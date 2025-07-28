import { MessageSquare } from "lucide-react";

interface ChatIconProps {
  onClick: () => void;
}

export default function ChatIcon({ onClick }: ChatIconProps) {
  return (
    <button
      onClick={onClick}
      className="z-1000 fixed bottom-4 right-4 bg-[#0B4973] text-white p-4 rounded-full shadow-lg hover:bg-[#09395a] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B4973]"
      aria-label="Buka Chatbot"
    >
      <MessageSquare size={24} />
    </button>
  );
}
