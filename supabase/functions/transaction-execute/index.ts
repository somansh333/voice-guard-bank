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
      payee_name,
      payee_account,
      risk_level,
      otp_verified,
    } = await req.json();

    console.log("Processing transaction for user:", user.id);

    // Decision logic based on risk level
    let status = "pending";
    let requiresOTP = false;
    let requiresGuardian = false;
    let blocked = false;

    if (risk_level === "LOW") {
      status = "completed";
    } else if (risk_level === "MEDIUM") {
      if (!otp_verified) {
        requiresOTP = true;
        status = "pending";
      } else {
        status = "completed";
      }
    } else if (risk_level === "HIGH") {
      // Check if user is elderly
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("is_elderly")
        .eq("id", user.id)
        .single();

      if (profile?.is_elderly) {
        requiresGuardian = true;
        status = "pending";
        
        // Notify guardian (mock)
        console.log("Guardian notification sent for transaction");
      } else {
        // Block transaction for non-elderly high-risk
        status = "blocked";
        blocked = true;
      }
    }

    // Create transaction record
    const { data: transaction, error: txError } = await supabaseClient
      .from("transactions")
      .insert({
        user_id: user.id,
        transaction_type: "transfer",
        amount,
        payee_name,
        payee_account,
        status,
        risk_level,
        requires_otp: requiresOTP,
        otp_verified: otp_verified || false,
        guardian_notified: requiresGuardian,
      })
      .select()
      .single();

    if (txError) {
      throw txError;
    }

    // Mock banking API call for completed transactions
    let bankingResponse = null;
    if (status === "completed") {
      bankingResponse = {
        transaction_id: transaction.id,
        bank_reference: `BNK${Date.now()}`,
        timestamp: new Date().toISOString(),
        new_balance: 45230.50 - Number(amount),
      };
    }

    const response = {
      success: status === "completed",
      transaction_id: transaction.id,
      status,
      requires_otp: requiresOTP,
      requires_guardian: requiresGuardian,
      blocked,
      message: generateStatusMessage(status, requiresGuardian, blocked),
      banking_response: bankingResponse,
    };

    console.log("Transaction result:", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in transaction-execute:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateStatusMessage(
  status: string,
  requiresGuardian: boolean,
  blocked: boolean
): string {
  if (blocked) {
    return "⛔ Transaction blocked for security reasons. This appears to be a high-risk transaction. Please contact customer support if you believe this is an error.";
  }
  if (requiresGuardian) {
    return "⏳ Transaction pending guardian approval. Your guardian has been notified and will need to approve this transaction before it proceeds.";
  }
  if (status === "completed") {
    return "✓ Transaction completed successfully!";
  }
  return "⏳ Transaction pending verification.";
}
