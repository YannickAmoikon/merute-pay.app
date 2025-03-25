"use client";

import { ReactElement, useState, useEffect } from "react";
import { ChevronDown, ChevronsRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/utils/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarItem {
  id: string;
  title: string;
  href?: string;
  icon?: ReactElement;
  subItems?: SidebarItem[];
}

interface SidebarProps {
  menuTitle: string;
  items: SidebarItem[];
  className?: string;
}

export function Sidebar({ menuTitle, items, className }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.subItems?.length) {
        initialExpandedState[item.id] = true;
      }
    });
    setExpandedItems(initialExpandedState);
  }, [items]);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isActive = (href?: string) => href && pathname.startsWith(href);
  const isActiveParent = (item: SidebarItem) => {
    return isActive(item.href) || (item.subItems?.some(subItem => isActive(subItem.href)) ?? false);
  };

  return (
      <TooltipProvider delayDuration={100}>
        <aside className={cn(
            "h-full border-r bg-background transition-all duration-200 flex flex-col",
            isCollapsed ? "w-14" : "w-56",
            className
        )}>
          {/* Header */}
          <div className="flex items-center justify-between px-3 border-b h-14">
            {!isCollapsed && (
                <h2 className="text-sm font-bold uppercase tracking-wider">{menuTitle}</h2>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="size-8"
                >
                  <ChevronsRight size={16} className={isCollapsed ? "" : "rotate-180"} />
                  <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"} sidebar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {isCollapsed ? "Développer" : "Réduire"}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1">
            <nav className="p-1.5 space-y-2">
              {items.map(item => {
                const active = isActiveParent(item);
                const expanded = expandedItems[item.id];

                if (isCollapsed) {
                  return (
                      <Tooltip key={item.id} delayDuration={100}>
                        <TooltipTrigger asChild>
                          <div
                              onClick={() => item.href ? null : toggleItem(item.id)}
                              className={cn(
                                  "flex items-center justify-center p-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                                  active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                              )}
                          >
                            <Link
                                href={item.href || "#"}
                                className="flex items-center justify-center"
                            >
                              {item.icon && (
                                  <span>{item.icon}</span>
                              )}
                            </Link>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.title}</p>
                          {item.subItems && (
                              <p className="text-xs text-muted-foreground">{item.subItems.length} sous-éléments</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                  );
                }

                return (
                    <div key={item.id} className="space-y-1">
                      {/* Main Item */}
                      <div
                          onClick={() => item.href ? null : toggleItem(item.id)}
                          className={cn(
                              "flex items-center rounded-md text-sm font-medium transition-colors cursor-pointer",
                              active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                              "px-3 py-2 justify-between"
                          )}
                      >
                        <Link
                            href={item.href || "#"}
                            className="flex items-center flex-1"
                        >
                          {item.icon && (
                              <span className="mr-2">
                          {item.icon}
                        </span>
                          )}
                          {item.title}
                        </Link>

                        {item.subItems && (
                            <ChevronDown className={cn(
                                "h-4 w-4 transition-transform",
                                expanded ? "rotate-180" : ""
                            )}/>
                        )}
                      </div>
                    </div>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          {!isCollapsed && (
              <div className="p-2 uppercase text-xs text-muted-foreground text-center">
                Merute Digital Orbital
              </div>
          )}
        </aside>
      </TooltipProvider>
  );
}