import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}) {
  return (
    <div className="flex h-full w-full flex-col border-r bg-card overflow-hidden">
      <div className="border-b p-4 flex-shrink-0">
        <h1 className="mb-4 text-xl font-bold text-foreground truncate">
          LLM Council
        </h1>
        <Button onClick={onNewConversation} className="w-full">
          + New Conversation
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No conversations yet
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "mb-2 cursor-pointer rounded-lg p-3 transition-all hover:bg-muted/50 hover:shadow-sm min-w-0",
                  conv.id === currentConversationId &&
                    "bg-primary/10 border border-primary shadow-sm",
                )}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="mb-1 text-sm font-semibold truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  {conv.title || "New Conversation"}
                </div>
                <div className="text-xs text-muted-foreground mono">
                  {conv.message_count} messages
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
