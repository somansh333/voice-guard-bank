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

    const { action } = await req.json();

    console.log("Mock banking API call:", action);

    let response;

    switch (action) {
      case "get_balance":
        response = {
          balance: 45230.50,
          currency: "INR",
          account_number: "****1234",
          last_updated: new Date().toISOString(),
        };
        break;

      case "get_transactions":
        const { data: dbTransactions } = await supabaseClient
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        response = {
          transactions: dbTransactions || [
            {
              id: "1",
              date: new Date(Date.now() - 86400000).toISOString(),
              description: "Grocery Store",
              amount: -500,
              balance: 45730.50,
            },
            {
              id: "2",
              date: new Date(Date.now() - 172800000).toISOString(),
              description: "Electric Bill Payment",
              amount: -1200,
              balance: 46230.50,
            },
            {
              id: "3",
              date: new Date(Date.now() - 259200000).toISOString(),
              description: "Salary Credit",
              amount: 50000,
              balance: 47430.50,
            },
            {
              id: "4",
              date: new Date(Date.now() - 345600000).toISOString(),
              description: "Online Shopping",
              amount: -2500,
              balance: -2570.50,
            },
            {
              id: "5",
              date: new Date(Date.now() - 432000000).toISOString(),
              description: "Restaurant",
              amount: -850,
              balance: 150.50,
            },
          ],
        };
        break;

      case "transfer":
        response = {
          success: true,
          transaction_id: `TXN${Date.now()}`,
          reference: `REF${Date.now()}`,
          message: "Transfer completed successfully",
          timestamp: new Date().toISOString(),
        };
        break;

      default:
        throw new Error("Unknown action");
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in mock-banking:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
