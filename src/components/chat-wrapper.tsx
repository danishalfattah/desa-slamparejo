// src/components/chat-wrapper.tsx
"use client";

import React, { useState } from "react";
import ChatIcon from "./chat-icon";
import ChatBox from "./chat-box";

export default function ChatWrapper() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {!isChatOpen ? (
        <ChatIcon onClick={() => setIsChatOpen(true)} />
      ) : (
        <ChatBox onClose={() => setIsChatOpen(false)} />
      )}
    </>
  );
}
