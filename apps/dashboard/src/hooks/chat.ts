import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

// Define types for messages and API responses
type Role = "system" | "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}

interface AIStreamParams {
  messages: Message[];
}

export function useAIStream() {
  const [streamedContent, setStreamedContent] = useState<string>("");
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // Reset the streamed content
  const resetStream = useCallback(() => {
    setStreamedContent("");
    setIsComplete(false);
  }, []);

  // React Query mutation for handling the streaming request
  const mutation = useMutation({
    mutationFn: async ({ messages }: AIStreamParams) => {
      try {
        // Reset the stream content when starting a new request
        resetStream();

        // Prepare the request body
        const body = JSON.stringify({
          messages,
          stream: true,
        });

        // Make the fetch request
        const response = await fetch(`${process.env.REACT_APP_TUNNEL}chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the response body as a readable stream
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Failed to get stream reader");
        }

        // Process the stream
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setIsComplete(true);
            break;
          }

          // Decode the chunk and add it to the buffer
          buffer += decoder.decode(value, { stream: true });

          // Process the buffer for SSE events
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep the last incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = line.slice(6); // Remove 'data: ' prefix
                if (data === "[DONE]") {
                  setIsComplete(true);
                  continue;
                }

                setStreamedContent((prev) => prev + data);
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }

        return streamedContent;
      } catch (error) {
        console.error("Streaming error:", error);
        throw error;
      }
    },
  });

  // Return the hook API
  return {
    streamContent: streamedContent,
    isStreaming: mutation.isPending,
    isComplete,
    error: mutation.error,
    startStream: mutation.mutate,
    resetStream,
  };
}
