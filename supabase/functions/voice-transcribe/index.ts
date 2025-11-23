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
    const { audio, text } = await req.json();
    
    console.log("Processing voice transcription request");

    // Mock transcription with stress detection
    // In production, this would use a real speech-to-text API
    const transcript = text || "Check my balance";
    
    // Analyze for stress indicators
    const stressIndicators = {
      fillerWords: ["umm", "uhh", "er", "ah"].filter(word => 
        transcript.toLowerCase().includes(word)
      ).length,
      pauseCount: Math.floor(Math.random() * 3), // Mock pause detection
      repeatCount: 0,
      hesitationScore: 0,
    };

    // Calculate stress score (0-100)
    const stressScore = Math.min(
      100,
      (stressIndicators.fillerWords * 15) +
      (stressIndicators.pauseCount * 20) +
      (stressIndicators.repeatCount * 25)
    );

    // Detect scam phrases
    const scamPhrases = [
      "account is blocked",
      "share otp",
      "kyc expired",
      "verification from bank",
      "urgent action required",
      "account suspended",
      "confirm your details",
    ];

    const detectedScamPhrases = scamPhrases.filter(phrase =>
      transcript.toLowerCase().includes(phrase)
    );

    const response = {
      transcript,
      stressIndicators,
      stressScore,
      scamPhrasesDetected: detectedScamPhrases,
      hasScamIndicators: detectedScamPhrases.length > 0,
      confidence: 0.95,
    };

    console.log("Transcription result:", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in voice-transcribe:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
