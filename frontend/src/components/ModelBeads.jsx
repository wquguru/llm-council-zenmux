import { useRef, useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * ModelBeads - A vertical navigation component for quickly jumping to different model responses
 * Inspired by DayBeads from crypto-crash project
 *
 * @param {Object} props
 * @param {Array<{id: string, label: string, icon?: string}>} props.items - Navigation items (e.g., Stage 1, Stage 2, Stage 3, models)
 * @param {string|null} props.activeItem - Currently active item ID
 * @param {Function} props.onJumpTo - Callback when user clicks a bead
 * @param {"desktop"|"mobile"} props.variant - Display variant
 */
export function ModelBeads({
  items = [],
  activeItem,
  onJumpTo,
  variant = "desktop",
}) {
  const beadRefs = useRef([]);
  const listRef = useRef(null);
  const [needsScroll, setNeedsScroll] = useState(true);

  // Calculate if we need internal scrolling
  useEffect(() => {
    const calc = () => {
      const el = listRef.current;
      if (!el) return;
      const total = el.scrollHeight;
      const viewport = window.innerHeight;

      if (variant === "mobile") {
        const maxVisible = viewport * 0.8 - 16;
        setNeedsScroll(total > maxVisible);
      } else {
        const available = viewport - 120; // Account for headers
        setNeedsScroll(total > available);
      }
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [items.length, variant]);

  // Auto-scroll to active item when it changes
  useEffect(() => {
    if (!activeItem) return;
    const idx = items.findIndex((x) => x.id === activeItem);
    const el = beadRefs.current[idx >= 0 ? idx : 0];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [activeItem, items]);

  // Keyboard navigation
  const onKeyDown = (e) => {
    let idx = items.findIndex((x) => x.id === activeItem);
    if (idx < 0) idx = 0;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.max(0, idx - 1);
      onJumpTo(items[next].id);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(items.length - 1, idx + 1);
      onJumpTo(items[next].id);
    } else if (e.key === "Home") {
      e.preventDefault();
      onJumpTo(items[0]?.id);
    } else if (e.key === "End") {
      e.preventDefault();
      onJumpTo(items[items.length - 1]?.id);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onJumpTo(items[idx]?.id);
    }
  };

  const activeIndex = items.findIndex((x) => x.id === activeItem);
  const activeId = activeIndex >= 0 ? `bead-${items[activeIndex].id}` : undefined;

  beadRefs.current.length = items.length;

  if (items.length === 0) return null;

  return (
    <div
      className="relative flex h-full"
      onKeyDown={onKeyDown}
      role="listbox"
      aria-label="模型跳转导航"
      aria-orientation="vertical"
      aria-activedescendant={activeId}
      tabIndex={0}
    >
      <div
        className={variant === "mobile" ? "relative flex-1 px-3 py-3" : "relative flex-1 px-4 py-2"}
        style={{ maxHeight: "100%", height: "100%", overflow: "hidden" }}
      >
        {needsScroll && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-card/80 via-card/40 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-card/80 via-card/40 to-transparent z-10" />
          </>
        )}

        <div
          ref={listRef}
          className={
            needsScroll
              ? variant === "mobile"
                ? "max-h-[80vh] overflow-y-auto no-scrollbar snap-y snap-proximity"
                : "max-h-full overflow-y-auto no-scrollbar snap-y snap-proximity pr-1"
              : "overflow-visible"
          }
          style={variant === "desktop" ? { maxHeight: "100%", height: "100%" } : undefined}
        >
          <TooltipProvider>
            <ul className="relative grid justify-items-center gap-3 px-3 py-1">
              {/* Vertical line through beads */}
              <span className="pointer-events-none absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-border" />

              {items.map((item, i) => {
                const active = item.id === activeItem;
                const size = variant === "mobile" ? 16 : 14;

                return (
                  <li key={item.id} className="relative flex justify-center snap-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          ref={(el) => (beadRefs.current[i] = el)}
                          id={`bead-${item.id}`}
                          role="option"
                          aria-selected={active}
                          aria-label={`跳转到 ${item.label}`}
                          className={`relative z-10 inline-flex items-center justify-center rounded-full border transition-all cursor-pointer ${
                            active
                              ? "bg-primary border-primary ring-2 ring-primary/40 text-primary-foreground"
                              : "bg-background border-muted-foreground/40 hover:border-foreground/60 hover:bg-muted"
                          }`}
                          style={{ width: size, height: size, minWidth: size, minHeight: size }}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => onJumpTo(item.id)}
                        >
                          {item.icon && (
                            <span className="text-[8px]" aria-hidden="true">
                              {item.icon}
                            </span>
                          )}
                          <span
                            className={variant === "mobile" ? "absolute -inset-3" : "absolute -inset-2"}
                            aria-hidden="true"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side={variant === "mobile" ? "right" : "left"}>
                        <span className="font-medium">{item.label}</span>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
