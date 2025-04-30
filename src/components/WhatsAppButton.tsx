
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

export default function WhatsAppButton({ phoneNumber, message = "Hello, I'd like to inquire about medical services." }: WhatsAppButtonProps) {
  // Format the phone number (remove any non-digit characters)
  const formattedPhone = phoneNumber.replace(/\D/g, "");
  
  // Create the WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-kartini-green hover:bg-kartini-green/90 z-50"
          onClick={() => window.open(whatsappUrl, "_blank")}
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Contact us on WhatsApp</p>
      </TooltipContent>
    </Tooltip>
  );
}
