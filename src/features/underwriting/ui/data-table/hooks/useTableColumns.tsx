import { useMemo, type ReactElement,  cloneElement, isValidElement } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { IoCall, IoEye, IoCopy } from "react-icons/io5";
import { Checkbox } from "@/shared/components/ui/checkbox";
import type { ColumnDef, ActionDef } from "../types";

/**
 * Builds TanStack Table columns from our column definitions
 */
export function useTableColumns<T extends Record<string, any>>(
  columns: ColumnDef<T>[],
  actions: any,
  columnWidths: Record<string, number>,
  enableRowSelection: boolean,
  stickyActions: boolean = true,
) {
  return useMemo(() => {
    const helper = createColumnHelper<T>();
    const cols: any[] = [];

    // Add selection column if enabled
    if (enableRowSelection) {
      cols.push(
        helper.display({
          id: "select",
          header: ({ table }: any) => (
            <div className="flex items-center justify-center mt-1">
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value: boolean) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            </div>
          ),
          cell: ({ row }: any) => (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            </div>
          ),
          size: 50,
          enableSorting: false,
          enableResizing: false,
        }),
      );
    }

    // Add data columns
    cols.push(
      ...columns.map((col) => {
        const key = String(col.key);
        return helper.accessor(col.key as any, {
          id: key,
          header: col.header,
          cell: (info: any) => {
            const value = info.getValue();
            const row = info.row.original;
            
            // Handle clickable cells (green link to customer details)
            if (col.clickable) {
              return (
                <span
                  className="text-green-600   underline  hover:text-green-700 font-bold hover:underline cursor-pointer"
                  onClick={() => window.location.href = `/customerDetails/customerLoanHistory`}
                >
                  {col.render ? col.render(value as T[keyof T], row) : value}
                </span>
              );
            }
            
            return col.render
              ? col.render(value as T[keyof T], row)
              : value;
          },
          enableSorting: col.sortable !== false,
          size: columnWidths[key],
          minSize: col.minWidth || 80,
          maxSize: col.maxWidth || 400,
          meta: {
            pinned: col.pinned,
          },
        });
      }),
    );

    // Add actions column
    if (actions) {
      const actionCol = helper.display({
        id: "actions",
        header: actions.header || "Actions",
        size: actions.width ? parseInt(actions.width) : 100,
        meta: {
          sticky: stickyActions,
        },
        cell: (info: any) => {
          const row = info.row.original;
          
          // Get action items - handle both function and array
          let actionItems: ActionDef<T>[] = [];
          if (typeof actions.items === "function") {
            actionItems = actions.items(row) || [];
          } else if (Array.isArray(actions.items)) {
            actionItems = actions.items;
          }

          // Default actions if none provided
          const defaultActions: ActionDef<T>[] = [
            {
              icon: <IoCall className="h-4 w-4" />,
              label: "Call",
              onClick: (row) => console.log("Call", row),
            },
            {
              icon: <IoEye className="h-4 w-4" />,
              label: "View",
              onClick: (row) => console.log("View", row),
            },
            {
              icon: <IoCopy className="h-4 w-4" />,
              label: "Copy",
              onClick: (row) => console.log("Copy", row),
            },
          ];

          const finalActions =
            actionItems.length > 0 ? actionItems : defaultActions;

          return (
            <div className="flex items-center justify-center gap-2">
              {finalActions.map((action, idx) => {
                if (action.hide && typeof action.hide === 'function' && action.hide(row)) return null;
                
                // Clone icon and add shake-icon class for animation
                const iconWithClass = isValidElement(action.icon) 
                  ? cloneElement(action.icon as ReactElement<any>, {
                      className: `${(action.icon as ReactElement<any>).props?.className || ''} shake-icon`.trim(),
                    })
                  : action.icon;
                
                // Get color classes based on action label - distinct contrasting colors
                const getActionColorClasses = (label: string | undefined) => {
                  switch (label?.toLowerCase()) {
                    case "call":
                      return "text-green-600 hover:bg-green-50 hover:text-green-700"; // Green - call/contact
                    case "view":
                      return "text-blue-600 hover:bg-blue-50 hover:text-blue-700"; // Blue - view/info
                    case "copy":
                      return "text-rose-600 hover:bg-rose-50 hover:text-rose-700"; // Rose - copy action
                    case "save":
                      return "text-green-600 hover:bg-green-50 hover:text-green-700"; // Green - save action
                    case "reset":
                      return "text-orange-600 hover:bg-orange-50 hover:text-orange-700"; // Orange - reset action
                    case "edit":
                      return "text-blue-600 hover:bg-blue-50 hover:text-blue-700"; // Blue - edit action
                    case "delete":
                      return "text-red-600 hover:bg-red-50 hover:text-red-700"; // Red - delete action
                    case "void":
                    case "void loan":
                      return "text-red-600 hover:bg-red-50 hover:text-red-700"; // Red - void action
                    default:
                      return "text-gray-600 hover:bg-gray-50 hover:text-gray-700";
                  }
                };

                return (
                  <button
                    key={idx}
                    onClick={() => action.onClick(row)}
                    className={`group inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ${getActionColorClasses(action.label)}`}
                    title={action.label}
                    aria-label={action.label}
                  >
                    {iconWithClass}
                  </button>
                );
              })}
            </div>
          );
        },
      });

      return [...cols, actionCol];
    }

    return cols;
  }, [columns, actions, columnWidths, enableRowSelection, stickyActions]);
}
