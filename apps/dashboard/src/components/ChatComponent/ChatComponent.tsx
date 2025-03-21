"use client";

import React, { useState } from "react";
import { useAIStream } from "../../hooks/chat";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "You are an AI expert." },
  ]);
  const [input, setInput] = useState("");

  const { streamContent, isStreaming, isComplete, startStream, resetStream } =
    useAIStream();

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!input.trim() || isStreaming) return;

    // Add user message to the messages array
    const updatedMessages = [
      ...messages,
      { role: "user", content: input },
    ] as Message[];
    setMessages(updatedMessages);

    // Clear input field
    setInput("");

    // Start streaming the AI response
    startStream({ messages: updatedMessages });
  };

  // When streaming is complete, add the assistant's message to the chat history
  React.useEffect(() => {
    if (isComplete && streamContent) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: streamContent },
      ]);
      resetStream();
    }
  }, [isComplete, streamContent, resetStream]);

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.slice(1).map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}

        {/* Display the streaming content */}
        {isStreaming && (
          <div className="message assistant streaming">
            <strong>assistant:</strong> {streamContent}
          </div>
        )}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isStreaming}
        />
        <button
          onClick={handleSendMessage}
          disabled={isStreaming || !input.trim()}
        >
          {isStreaming ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
