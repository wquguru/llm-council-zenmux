import { ModelBeads } from "./ModelBeads";
import { Card } from "@/components/ui/card";

/**
 * NavigationPanel - Right-side navigation panel for quick model/stage jumping
 * Shows both on desktop (fixed right panel) and mobile (Sheet overlay)
 */
export function NavigationPanel({
  items = [],
  activeItem,
  onJumpTo,
  variant = "desktop"
}) {
  if (items.length === 0) return null;

  return (
    <Card
      className={
        variant === "mobile"
          ? "h-full border-l-0 border-t-0 border-b-0 rounded-none shadow-none"
          : "h-full border rounded-lg shadow-sm"
      }
    >
      <div className="flex flex-col h-full">
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            快速导航
          </h3>
        </div>
        <div className="flex-1 overflow-hidden">
          <ModelBeads
            items={items}
            activeItem={activeItem}
            onJumpTo={onJumpTo}
            variant={variant}
          />
        </div>
      </div>
    </Card>
  );
}
