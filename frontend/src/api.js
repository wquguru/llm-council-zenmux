/**
 * API client for the LLM Council backend.
 */

import { toast } from "sonner";
import i18n from "./i18n";

// In production (Docker), use relative path to go through Nginx proxy
// In development, use direct backend URL
const API_BASE = import.meta.env.PROD ? "" : "http://localhost:8008";

// Constants
export const MAX_MESSAGE_LENGTH = 1000;

/**
 * Handle API error responses and show appropriate toast notifications.
 */
async function handleErrorResponse(response) {
  let errorData;
  try {
    errorData = await response.json();
  } catch {
    errorData = null;
  }

  const errorCode = errorData?.error?.code;
  const t = i18n.t.bind(i18n);

  switch (response.status) {
    case 429:
      // Rate limit exceeded
      toast.warning(t("errorRateLimited"));
      throw new Error("RATE_LIMITED");

    case 400:
      // Validation error
      if (errorCode === "CONTENT_TOO_LONG") {
        toast.error(t("errorContentTooLong", { max: MAX_MESSAGE_LENGTH }));
      } else if (errorCode === "CONTENT_EMPTY") {
        toast.error(t("errorContentEmpty"));
      } else {
        toast.error(t("errorGeneric"));
      }
      throw new Error(errorCode || "VALIDATION_ERROR");

    default:
      toast.error(t("errorGeneric"));
      throw new Error("API_ERROR");
  }
}

export const api = {
  /**
   * List all conversations.
   */
  async listConversations() {
    const response = await fetch(`${API_BASE}/api/conversations`);
    if (!response.ok) {
      throw new Error("Failed to list conversations");
    }
    return response.json();
  },

  /**
   * Create a new conversation.
   */
  async createConversation() {
    const response = await fetch(`${API_BASE}/api/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error("Failed to create conversation");
    }
    return response.json();
  },

  /**
   * Get a specific conversation.
   */
  async getConversation(conversationId) {
    const response = await fetch(
      `${API_BASE}/api/conversations/${conversationId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to get conversation");
    }
    return response.json();
  },

  /**
   * Send a message in a conversation.
   */
  async sendMessage(conversationId, content) {
    const response = await fetch(
      `${API_BASE}/api/conversations/${conversationId}/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      },
    );
    if (!response.ok) {
      await handleErrorResponse(response);
    }
    return response.json();
  },

  /**
   * Send a message and receive streaming updates.
   * @param {string} conversationId - The conversation ID
   * @param {string} content - The message content
   * @param {function} onEvent - Callback function for each event: (eventType, data) => void
   * @returns {Promise<void>}
   */
  async sendMessageStream(conversationId, content, onEvent) {
    const response = await fetch(
      `${API_BASE}/api/conversations/${conversationId}/message/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      },
    );

    if (!response.ok) {
      await handleErrorResponse(response);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = ""; // Buffer for incomplete lines
    let hasReceivedComplete = false;

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Stream ended - ensure we fire complete if not already done
          if (!hasReceivedComplete) {
            onEvent("complete", {});
          }
          break;
        }

        // Append new data to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete lines
        const lines = buffer.split("\n");
        // Keep the last incomplete line in buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const event = JSON.parse(data);
              if (event.type === "complete") {
                hasReceivedComplete = true;
              }
              onEvent(event.type, event);
            } catch (e) {
              console.error("Failed to parse SSE event:", e);
            }
          }
        }
      }

      // Process any remaining data in buffer
      if (buffer.startsWith("data: ")) {
        const data = buffer.slice(6);
        try {
          const event = JSON.parse(data);
          if (event.type === "complete") {
            hasReceivedComplete = true;
          }
          onEvent(event.type, event);
        } catch (e) {
          // Ignore parse errors for incomplete final chunk
        }
      }
    } catch (error) {
      console.error("SSE stream error:", error);
      // Ensure loading state is cleared on error
      onEvent("error", { message: error.message });
    }
  },
};
