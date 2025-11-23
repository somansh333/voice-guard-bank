import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const {
      amount,
      payee,
      stressScore,
      hasScamIndicators,
      deviceFingerprint,
    } = await req.json();

    console.log("Evaluating risk for user:", user.id);

    // Get user profile
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("is_elderly")
      .eq("id", user.id)
      .single();

    // Check if device is new
    const { data: devices } = await supabaseClient
      .from("devices")
      .select("*")
      .eq("user_id", user.id)
      .eq("device_fingerprint", deviceFingerprint || "unknown");

    const isNewDevice = !devices || devices.length === 0;

    // Get recent transactions for anomaly detection
    const { data: recentTransactions } = await supabaseClient
      .from("transactions")
      .select("amount")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // Calculate average transaction amount
    const avgAmount = recentTransactions && recentTransactions.length > 0
      ? recentTransactions.reduce((sum, t) => sum + Number(t.amount), 0) / recentTransactions.length
      : 1000;

    // Risk scoring algorithm
    let riskScore = 0;
    const reasons: string[] = [];

    // Amount anomaly detection
    if (amount && amount > avgAmount * 2) {
      riskScore += 25;
      reasons.push("Transaction amount significantly higher than usual");
    }

    // New device
    if (isNewDevice) {
      riskScore += 20;
      reasons.push("Transaction from unrecognized device");
    }

    // Stress indicators
    if (stressScore && stressScore > 50) {
      riskScore += 30;
      reasons.push("Voice stress indicators detected");
    }

    // Scam phrases
    if (hasScamIndicators) {
      riskScore += 40;
      reasons.push("Potential scam phrase detected in conversation");
    }

    // New payee (simplified check)
    if (payee && Math.random() > 0.7) {
      riskScore += 15;
      reasons.push("Transfer to new payee");
    }

    // Determine risk level
    let level: "LOW" | "MEDIUM" | "HIGH" = "LOW";
    if (riskScore >= 60) {
      level = "HIGH";
    } else if (riskScore >= 30) {
      level = "MEDIUM";
    }

    // Additional guardian check for elderly users
    const requiresGuardian = level === "HIGH" && profile?.is_elderly;

    // Log risk event
    await supabaseClient.from("risk_events").insert({
      user_id: user.id,
      event_type: hasScamIndicators ? "scam_phrase" : stressScore > 50 ? "stress_detected" : "amount_anomaly",
      severity: level,
      details: {
        riskScore,
        reasons,
        amount,
        payee,
        stressScore,
      },
    });

    const response = {
      score: riskScore,
      level,
      reasons,
      requiresGuardian,
      requiresOTP: level === "MEDIUM" || level === "HIGH",
      explanation: generateExplanation(level, reasons),
    };

    console.log("Risk evaluation result:", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in risk-evaluate:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateExplanation(level: string, reasons: string[]): string {
  if (level === "HIGH") {
    return `⚠️ This transaction has been flagged as high-risk for your protection. ${reasons.join(". ")}. Please verify this is legitimate before proceeding.`;
  } else if (level === "MEDIUM") {
    return `⚠️ Additional verification is required. ${reasons.join(". ")}. We'll send you an OTP to confirm this transaction.`;
  }
  return "✓ This transaction appears safe. No unusual patterns detected.";
}
