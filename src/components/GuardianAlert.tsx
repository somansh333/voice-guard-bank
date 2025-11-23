import { Users, Phone, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GuardianAlertProps {
  open: boolean;
  onClose: () => void;
}

const GuardianAlert = ({ open, onClose }: GuardianAlertProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
              <Users className="h-8 w-8 text-warning" />
            </div>
          </div>
          <DialogTitle className="text-center">Guardian Alert Triggered</DialogTitle>
          <DialogDescription className="text-center">
            This transaction has been flagged as high-risk. Your guardian has been notified.
          </DialogDescription>
        </DialogHeader>

        <Card className="p-4 bg-muted/50">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Guardian: Family Member</p>
                <p className="text-sm text-muted-foreground">Primary Contact</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm">+91 98765 43210</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm">guardian@example.com</p>
            </div>
          </div>
        </Card>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <strong>Why was this flagged?</strong>
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Potential scam phrase detected</li>
            <li>Unusual transaction pattern</li>
            <li>Request for sensitive information</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            I Understand
          </Button>
          <Button className="flex-1 bg-success" onClick={onClose}>
            Contact Guardian
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuardianAlert;
