import { useState } from "react";
import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

interface OTPModalProps {
  open: boolean;
  onClose: () => void;
}

const OTPModal = ({ open, onClose }: OTPModalProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsVerifying(true);
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("OTP verified successfully!");
    setIsVerifying(false);
    setOtp("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">Verify Your Transaction</DialogTitle>
          <DialogDescription className="text-center">
            Enter the 6-digit OTP sent to your registered mobile number
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
              onClick={handleVerify}
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            Didn't receive OTP?{" "}
            <button className="text-primary hover:underline">Resend</button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OTPModal;
