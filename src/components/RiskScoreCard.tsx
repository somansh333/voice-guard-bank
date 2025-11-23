import { Shield, AlertTriangle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RiskScoreCardProps {
  level: "LOW" | "MEDIUM" | "HIGH";
}

const RiskScoreCard = ({ level }: RiskScoreCardProps) => {
  const getRiskConfig = () => {
    switch (level) {
      case "HIGH":
        return {
          icon: AlertCircle,
          color: "text-danger",
          bg: "bg-danger/10",
          border: "border-danger/20",
          badge: "destructive" as const,
          text: "High Risk",
          description: "Suspicious activity detected",
        };
      case "MEDIUM":
        return {
          icon: AlertTriangle,
          color: "text-warning",
          bg: "bg-warning/10",
          border: "border-warning/20",
          badge: "default" as const,
          text: "Medium Risk",
          description: "Additional verification required",
        };
      default:
        return {
          icon: Shield,
          color: "text-success",
          bg: "bg-success/10",
          border: "border-success/20",
          badge: "default" as const,
          text: "Low Risk",
          description: "Transaction secure",
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  return (
    <Card className={`border-2 ${config.border} ${config.bg}`}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`w-12 h-12 rounded-full ${config.bg} flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${config.color}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">Security Status</span>
            <Badge variant={config.badge}>{config.text}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskScoreCard;
