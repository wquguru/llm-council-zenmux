import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import Stage1 from "./Stage1";
import Stage2 from "./Stage2";
import Stage3 from "./Stage3";
import CouncilAvatars from "./CouncilAvatars";
import ShareButton from "./ShareButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Model configuration (should match backend config.py)
const COUNCIL_MODELS = [
  "qwen/qwen3-14b",
  "x-ai/grok-4.1-fast",
  "kuaishou/kat-coder-pro-v1",
];
const CHAIRMAN_MODEL = "deepseek/deepseek-chat-v3.1";

export default function ChatInterface({
  conversation,
  onSendMessage,
  isLoading,
  onNewConversation,
  conversationId,
}) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [activeModel, setActiveModel] = useState(null);
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const stage1Ref = useRef(null);
  const stage2Ref = useRef(null);
  const stage3Ref = useRef(null);
  const textareaRef = useRef(null);
  const formRef = useRef(null);

  // Handle mobile keyboard appearing - scroll input into view
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleFocus = () => {
      // Delay to wait for keyboard animation
      setTimeout(() => {
        // Scroll the form into view
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        });
      }, 300);
    };

    textarea.addEventListener("focus", handleFocus);
    return () => textarea.removeEventListener("focus", handleFocus);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput("");
      // Blur textarea on mobile to hide keyboard after sending
      if (window.innerWidth < 768) {
        textareaRef.current?.blur();
      }
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSelectModel = (modelId) => {
    setActiveModel(modelId);
    // 不使用 scrollIntoView，它会滚动外层容器导致 header 消失
    // Tab 切换已经足够，用户可以自行滚动查看内容
  };

  const handleChairmanClick = (modelId) => {
    setActiveModel(modelId);
    // 只滚动内部的 ScrollArea,不影响外层容器
    if (stage3Ref.current && scrollAreaRef.current) {
      // 获取 Radix ScrollArea 的实际滚动视口 (Viewport)
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        // 计算 stage3 相对于 viewport 的位置
        const stage3Rect = stage3Ref.current.getBoundingClientRect();
        const viewportRect = viewport.getBoundingClientRect();
        const scrollOffset = stage3Rect.top - viewportRect.top + viewport.scrollTop;

        // 平滑滚动到目标位置
        viewport.scrollTo({
          top: scrollOffset - 20, // 减去 20px 留一点顶部间距
          behavior: 'smooth'
        });
      }
    }
  };

  const scrollToStage2 = () => {
    if (stage2Ref.current) {
      // Use 'start' to ensure the top of the card is visible
      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        stage2Ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 50);
    }
  };

  const getModelStatuses = (msg) => {
    const statuses = {};

    // Council members status
    COUNCIL_MODELS.forEach(model => {
      if (msg.loading?.stage1) {
        statuses[model] = 'thinking';
      } else if (msg.stage1) {
        statuses[model] = 'completed';
      }
    });

    // Chairman status
    if (msg.loading?.stage3) {
      statuses[CHAIRMAN_MODEL] = 'thinking';
    } else if (msg.stage3) {
      statuses[CHAIRMAN_MODEL] = 'completed';
    }

    return statuses;
  };

  if (!conversation) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground p-6">
          <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
            {t('welcomeTitle')}
          </h2>
          <p className="text-base md:text-lg max-w-md mb-6">
            {t('welcomeSubtitle')}
          </p>
          <Button
            onClick={onNewConversation}
            size="lg"
            className="px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            {t('newConversation')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="p-3 pb-16 md:p-6 md:pb-20">
          {conversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground md:py-20">
              <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl md:hidden">
                Start a conversation
              </h2>
              <p className="text-base md:text-lg max-w-md md:hidden">
                Ask a question to consult the LLM Council
              </p>
            </div>
          ) : (
            conversation.messages.map((msg, index) => (
              <div key={index} className="mb-6 md:mb-8">
                {msg.role === "user" ? (
                  <div className="mb-4">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mono">
                      {t('you')}
                    </div>
                    <Card className="max-w-full border-primary/30 bg-primary/5 p-4 md:max-w-[80%] shadow-sm hover:shadow-md transition-shadow">
                      <div className="markdown-content text-sm md:text-base">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </Card>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mono">
                        {t('llmCouncil')}
                      </span>
                      {msg.stage3 && (
                        <ShareButton
                          conversationId={conversationId}
                          conversationTitle={conversation?.title}
                        />
                      )}
                    </div>

                    {/* Council Avatars */}
                    {(msg.stage1 || msg.stage2 || msg.stage3 || msg.loading) && (
                      <CouncilAvatars
                        councilModels={COUNCIL_MODELS}
                        chairmanModel={CHAIRMAN_MODEL}
                        activeModel={activeModel}
                        onSelectModel={handleSelectModel}
                        onChairmanClick={handleChairmanClick}
                        modelStatuses={getModelStatuses(msg)}
                      />
                    )}

                    {/* Stage 1 */}
                    <div ref={stage1Ref}>
                      {msg.loading?.stage1 && (
                        <Card className="mb-4 flex items-center gap-3 border-muted bg-muted/50 p-4 shadow-sm">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary"></div>
                          <span className="text-sm font-medium text-muted-foreground">
                            {t('loadingStage1')}
                          </span>
                        </Card>
                      )}
                      {msg.stage1 && (
                        <Stage1
                          responses={msg.stage1}
                          activeModel={activeModel}
                          onSelectModel={handleSelectModel}
                        />
                      )}
                    </div>

                    {/* Stage 2 */}
                    <div ref={stage2Ref}>
                      {msg.loading?.stage2 && (
                        <Card className="mb-4 flex items-center gap-3 border-muted bg-muted/50 p-4 shadow-sm">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary"></div>
                          <span className="text-sm font-medium text-muted-foreground">
                            {t('loadingStage2')}
                          </span>
                        </Card>
                      )}
                      {msg.stage2 && (
                        <Stage2
                          rankings={msg.stage2}
                          labelToModel={msg.metadata?.label_to_model}
                          aggregateRankings={msg.metadata?.aggregate_rankings}
                          activeModel={activeModel}
                          onSelectModel={handleSelectModel}
                          scrollToStage2={scrollToStage2}
                        />
                      )}
                    </div>

                    {/* Stage 3 */}
                    <div ref={stage3Ref}>
                      {msg.loading?.stage3 && (
                        <Card className="mb-4 flex items-center gap-3 border-muted bg-muted/50 p-4 shadow-sm">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary"></div>
                          <span className="text-sm font-medium text-muted-foreground">
                            {t('loadingStage3')}
                          </span>
                        </Card>
                      )}
                      {msg.stage3 && <Stage3 finalResponse={msg.stage3} />}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex items-center gap-3 p-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary"></div>
              <span className="text-sm font-medium text-muted-foreground">
                {t('consultingCouncil')}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {conversation.messages.length === 0 && (
        <form
          ref={formRef}
          className="flex items-end gap-3 border-t bg-card p-4 md:gap-4 md:p-6 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
          onSubmit={handleSubmit}
        >
          <Textarea
            ref={textareaRef}
            className="min-h-[60px] max-h-[200px] resize-y text-sm md:min-h-[80px] md:max-h-[300px] md:text-base shadow-sm"
            placeholder={t('placeholder')}
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
            {t('send')}
          </Button>
        </form>
      )}
    </div>
  );
}
