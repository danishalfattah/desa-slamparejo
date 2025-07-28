// src/components/chat-box.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Loader2 } from "lucide-react";

interface ChatBoxProps {
  onClose: () => void;
}

interface Message {
  text: string;
  sender: "user" | "bot";
}

export default function ChatBox({ onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Apa saja layanan yang tersedia?",
    "Bagaimana cara menghubungi perangkat desa?",
    "Siapa saja tim pembuat website ini?", // Pertanyaan baru yang relevan
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    setMessages([
      {
        text: "Selamat datang di Layanan Chat Desa Slamparejo! Ada yang bisa saya bantu?",
        sender: "bot",
      },
    ]);
  }, []);

  const handleSend = async (question: string = input) => {
    if (question.trim() === "" || isLoading) return;

    const userMessage: Message = { text: question, sender: "user" };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Mengirim seluruh riwayat percakapan
        body: JSON.stringify({ history: newMessages }),
      });

      if (!response.ok) {
        throw new Error("Gagal mendapatkan respon dari server.");
      }

      const data = await response.json();
      setMessages([...newMessages, { text: data.text, sender: "bot" }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        {
          text: "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-80 h-[28rem] bg-white rounded-lg shadow-2xl flex flex-col z-50">
      <div className="bg-[#0B4973] text-white p-3 flex justify-between items-center rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <h3 className="font-semibold text-sm">
            Chat Bantuan Desa Slamparejo
          </h3>
        </div>
        <button onClick={onClose} className="hover:text-gray-300">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 mb-4 ${
              msg.sender === "user" ? "justify-end" : ""
            }`}
          >
            {msg.sender === "bot" && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <Bot size={20} className="text-gray-600" />
              </div>
            )}
            <div
              className={`p-3 rounded-lg max-w-[80%] break-words ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <Bot size={20} className="text-gray-600" />
            </div>
            <div className="p-3 rounded-lg bg-gray-200">
              <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t">
        <div className="flex flex-wrap gap-1 mb-2">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
              disabled={isLoading}
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ketik pertanyaan Anda..."
            className="w-full px-3 py-2 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#0B4973]"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            className="bg-[#0B4973] text-white p-2 rounded-full hover:bg-[#09395a] disabled:bg-gray-400"
            disabled={isLoading || input.trim() === ""}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
