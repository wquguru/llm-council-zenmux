import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import Stage1 from "./Stage1";
import Stage2 from "./Stage2";
import Stage3 from "./Stage3";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ChatInterface({
  conversation,
  onSendMessage,
  isLoading,
}) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!conversation) {
    return (
      <div className="flex h-full flex-col">
        <div className="hidden items-center justify-between border-b bg-card px-6 py-4 md:flex shadow-sm">
          <h1 className="text-2xl font-bold">LLM Council</h1>
          <a
            href="https://github.com/wquguru/llm-council-zenmux"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:scale-110"
            title="View on GitHub"
          >
            <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </a>
        </div>
        <div className="flex items-center justify-center gap-2 border-b bg-warning/10 px-4 py-2.5 text-xs font-semibold text-warning md:px-6 md:py-3 md:text-sm border-warning/20">
          <span>⚠️</span>
          <span className="line-clamp-1 md:line-clamp-none">
            隐私提示：所有对话对所有访问者可见，请勿输入敏感信息
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground p-6">
          <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
            Welcome to LLM Council
          </h2>
          <p className="text-base md:text-lg max-w-md">
            Create a new conversation to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="hidden items-center justify-between border-b bg-card px-6 py-4 md:flex shadow-sm">
        <h1 className="text-2xl font-bold">LLM Council</h1>
        <a
          href="https://github.com/wquguru/llm-council-zenmux"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:scale-110"
          title="View on GitHub"
        >
          <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
        </a>
      </div>
      <div className="flex items-center justify-center gap-2 border-b bg-warning/10 px-4 py-2.5 text-xs font-semibold text-warning md:px-6 md:py-3 md:text-sm border-warning/20">
        <span>⚠️</span>
        <span className="line-clamp-1 md:line-clamp-none">
          隐私提示：所有对话对所有访问者可见，请勿输入敏感信息
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 md:p-6">
          {conversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground md:py-20">
              <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
                Start a conversation
              </h2>
              <p className="text-base md:text-lg max-w-md">
                Ask a question to consult the LLM Council
              </p>
            </div>
          ) : (
            conversation.messages.map((msg, index) => (
              <div key={index} className="mb-6 md:mb-8">
                {msg.role === "user" ? (
                  <div className="mb-4">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mono">
                      You
                    </div>
                    <Card className="max-w-full border-primary/30 bg-primary/5 p-4 md:max-w-[80%] shadow-sm hover:shadow-md transition-shadow">
                      <div className="markdown-content text-sm md:text-base">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </Card>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground mono">
                      LLM Council
                    </div>

                    {/* Stage 1 */}
                    {msg.loading?.stage1 && (
                      <Card className="mb-4 flex items-center gap-3 border-muted bg-muted/50 p-4 shadow-sm">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary"></div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Running Stage 1: Collecting individual responses...
                        </span>
                      </Card>
                    )}
                    {msg.stage1 && <Stage1 responses={msg.stage1} />}

                    {/* Stage 2 */}
                    {msg.loading?.stage2 && (
                      <Card className="mb-4 flex items-center gap-3 border-muted bg-muted/50 p-4 shadow-sm">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary"></div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Running Stage 2: Peer rankings...
                        </span>
                      </Card>
                    )}
                    {msg.stage2 && (
                      <Stage2
                        rankings={msg.stage2}
                        labelToModel={msg.metadata?.label_to_model}
                        aggregateRankings={msg.metadata?.aggregate_rankings}
                      />
                    )}

                    {/* Stage 3 */}
                    {msg.loading?.stage3 && (
                      <Card className="mb-4 flex items-center gap-3 border-muted bg-muted/50 p-4 shadow-sm">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary"></div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Running Stage 3: Final synthesis...
                        </span>
                      </Card>
                    )}
                    {msg.stage3 && <Stage3 finalResponse={msg.stage3} />}
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex items-center gap-3 p-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary"></div>
              <span className="text-sm font-medium text-muted-foreground">
                Consulting the council...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {conversation.messages.length === 0 && (
        <form
          className="flex items-end gap-3 border-t bg-card p-4 md:gap-4 md:p-6 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
          onSubmit={handleSubmit}
        >
          <Textarea
            className="min-h-[60px] max-h-[200px] resize-y text-sm md:min-h-[80px] md:max-h-[300px] md:text-base shadow-sm"
            placeholder="Ask your question... (Shift+Enter for new line, Enter to send)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={3}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-auto px-6 py-3 md:px-8 md:py-4 font-semibold shadow-sm hover:shadow-md transition-all"
          >
            Send
          </Button>
        </form>
      )}
    </div>
  );
}
