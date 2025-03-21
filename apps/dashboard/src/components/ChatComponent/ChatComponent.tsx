"use client";

import React, { useState } from "react";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { useAIStream } from "../../hooks/chat";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "You are a friendly chat bot" },
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

    console.log("MESSAGES:");
    console.log(updatedMessages);

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
          <div
            key={index}
            className={`message ${message.role}`}
            style={{ marginTop: "1rem" }}
          >
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}

        {/* Display the streaming content */}
        {isStreaming && (
          <div
            className="message assistant streaming"
            style={{ marginTop: "1rem" }}
          >
            <strong>assistant:</strong> {streamContent}
          </div>
        )}
      </div>

      <div
        className="input-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1rem",
        }}
      >
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isStreaming}
          style={{ flexGrow: 1, marginRight: 10 }}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isStreaming || !input.trim()}
        >
          {isStreaming ? "Thinking..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default ChatComponent;
