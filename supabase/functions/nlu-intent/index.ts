import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript } = await req.json();
    
    console.log("Processing NLU intent for:", transcript);

    const lowerText = transcript.toLowerCase();
    
    // Intent detection using rule-based system
    let intent = "general";
    let amount: number | null = null;
    let payee: string | null = null;

    // Balance check intent
    if (
      lowerText.includes("balance") ||
      lowerText.includes("how much") ||
      lowerText.includes("account")
    ) {
      intent = "balance";
    }
    
    // Transfer intent
    else if (
      lowerText.includes("transfer") ||
      lowerText.includes("send money") ||
      lowerText.includes("pay")
    ) {
      intent = "transfer";
      
      // Extract amount (simple pattern matching)
      const amountMatch = lowerText.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)/);
      if (amountMatch) {
        amount = parseFloat(amountMatch[1].replace(/,/g, ""));
      }
      
      // Extract payee (simple pattern - words after "to")
      const payeeMatch = lowerText.match(/to\s+([a-z\s]+?)(?:\s|$)/i);
      if (payeeMatch) {
        payee = payeeMatch[1].trim();
      }
    }
    
    // History intent
    else if (
      lowerText.includes("history") ||
      lowerText.includes("transactions") ||
      lowerText.includes("statement")
    ) {
      intent = "history";
    }

    const response = {
      intent,
      entities: {
        amount,
        payee,
      },
      confidence: 0.92,
      transcript,
    };

    console.log("NLU result:", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in nlu-intent:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
