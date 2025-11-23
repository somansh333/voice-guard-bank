import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Mic, Send, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import RiskScoreCard from "@/components/RiskScoreCard";
import VoiceButton from "@/components/VoiceButton";
import GuardianAlert from "@/components/GuardianAlert";
import OTPModal from "@/components/OTPModal";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH";
}

const Assistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentRisk, setCurrentRisk] = useState<"LOW" | "MEDIUM" | "HIGH">("LOW");
  const [showGuardianAlert, setShowGuardianAlert] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        // Add welcome message
        setMessages([
          {
            id: "1",
            role: "assistant",
            content: "Hello! I'm your SentinelPay assistant. I can help you check your balance, make transfers, or view your transaction history. How can I assist you today?",
            timestamp: new Date(),
          },
        ]);
      }
    });

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      toast.info("You're offline. Limited features available.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [navigate]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate AI response with risk evaluation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock response based on keywords
      let response = "I understand. Let me help you with that.";
      let risk: "LOW" | "MEDIUM" | "HIGH" = "LOW";

      if (input.toLowerCase().includes("balance")) {
        response = "Your current balance is ₹45,230.50. Would you like to see recent transactions?";
      } else if (input.toLowerCase().includes("transfer")) {
        response = "I'll help you make a transfer. Please provide the recipient's details and amount.";
        risk = "MEDIUM";
      } else if (input.toLowerCase().includes("history")) {
        response = "Here are your last 5 transactions: 1) ₹500 to Grocery Store (Yesterday), 2) ₹1,200 to Electric Bill (2 days ago)...";
      }

      // Check for scam phrases
      if (
        input.toLowerCase().includes("otp") ||
        input.toLowerCase().includes("kyc") ||
        input.toLowerCase().includes("blocked")
      ) {
        risk = "HIGH";
        response = "⚠️ WARNING: This appears to be a potential scam. Never share your OTP or personal details. Your account is secure.";
        setShowGuardianAlert(true);
      }

      setCurrentRisk(risk);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        riskLevel: risk,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (risk === "MEDIUM") {
        setTimeout(() => setShowOTP(true), 1000);
      }
    } catch (error) {
      toast.error("Failed to process message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceRecord = (recording: boolean) => {
    setIsRecording(recording);
    if (!recording) {
      // Simulate voice to text
      const voiceInput = "Check my balance";
      setInput(voiceInput);
      setTimeout(() => handleSendMessage(), 500);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SentinelPay</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={isOnline ? "default" : "destructive"} className="gap-1">
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isOnline ? "Online" : "Offline"}
            </Badge>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        {/* Risk Score */}
        <div className="mb-4">
          <RiskScoreCard level={currentRisk} />
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.riskLevel && message.riskLevel !== "LOW" && (
                  <Badge
                    variant={message.riskLevel === "HIGH" ? "destructive" : "default"}
                    className="mt-2"
                  >
                    Risk: {message.riskLevel}
                  </Badge>
                )}
              </Card>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="max-w-[80%] p-4 bg-card">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2 items-center p-4 bg-card rounded-lg border shadow-sm">
          <VoiceButton isRecording={isRecording} onRecord={handleVoiceRecord} />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type or use voice..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      <GuardianAlert
        open={showGuardianAlert}
        onClose={() => setShowGuardianAlert(false)}
      />
      <OTPModal open={showOTP} onClose={() => setShowOTP(false)} />
    </div>
  );
};

export default Assistant;
