import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}) {
  return (
    <div className="flex h-full w-full flex-col border-r bg-muted/40">
      <div className="border-b p-4">
        <h1 className="mb-3 text-lg font-semibold">LLM Council</h1>
        <Button onClick={onNewConversation} className="w-full">
          + New Conversation
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No conversations yet
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "mb-1 cursor-pointer rounded-lg p-3 transition-colors hover:bg-accent",
                  conv.id === currentConversationId && "bg-primary/10 border border-primary"
                )}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="mb-1 text-sm font-medium">
                  {conv.title || 'New Conversation'}
                </div>
                <div className="text-xs text-muted-foreground">
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
