import { IoSearch } from "react-icons/io5";
import { FileDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { ToolbarButtonDef } from "../types";

interface TableHeaderProps {
  title?: string;
  enableGlobalSearch: boolean;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  enableExport?: boolean;
  onExport?: () => void;
  toolbarButtons?: ToolbarButtonDef[];
}

/**
 * Table header with title, global search, and toolbar buttons
 */
export function TableHeader({
  title,
  enableGlobalSearch,
  globalFilter,
  onGlobalFilterChange,
  enableExport = false,
  onExport,
  toolbarButtons = [],
}: TableHeaderProps) {
  // Backward compatibility: Add export button if enableExport is true
  const buttons: ToolbarButtonDef[] = [...toolbarButtons];
  if (enableExport && onExport) {
    buttons.push({
      icon: <FileDown className="w-4 h-4" />,
      label: "Export",
      onClick: onExport,
      variant: "outline",
      className: "border-blue-600 text-blue-600 hover:bg-blue-50",
    });
  }

  if (!title && !enableGlobalSearch && buttons.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
      {/* Left: Search */}
      {enableGlobalSearch && (
        <div className="relative w-full sm:w-80 flex items-center">
          <IoSearch className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      )}

      {/* Right: Toolbar Buttons */}
      {buttons.length > 0 && (
        <div className="flex items-center gap-3">
          {buttons.map((button, index) => {
            if (button.hide) return null;
            
            return (
              <Button
                key={index}
                onClick={button.onClick}
                disabled={button.disabled}
                variant={button.variant || "default"}
                size="sm"
                className={button.className}
              >
                {button.icon}
                <span className="ml-2">{button.label}</span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
