import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  isRecording: boolean;
  onRecord: (recording: boolean) => void;
}

const VoiceButton = ({ isRecording, onRecord }: VoiceButtonProps) => {
  return (
    <Button
      onClick={() => onRecord(!isRecording)}
      variant={isRecording ? "destructive" : "default"}
      size="icon"
      className={cn(
        "rounded-full transition-all",
        isRecording && "animate-pulse shadow-lg scale-110"
      )}
    >
      {isRecording ? (
        <MicOff className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
};

export default VoiceButton;
