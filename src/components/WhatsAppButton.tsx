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
          <img
            src="/images/wa.png"
            alt="WhatsApp"
            className="w-14 text-white fixed bottom-6 right-6 rounded-full shadow-lg z-50 cursor-pointer"
            onClick={() => window.open(whatsappUrl, "_blank")}
          />
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Hubungi kami di Whatsapp</p>
      </TooltipContent>
    </Tooltip>
  );
}