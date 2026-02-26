import type { ColumnDef } from "../types";

export const STICKY_ACTIONS_WIDTH = 120;
export const DEFAULT_COLUMN_WIDTH = 120;
export const MIN_COLUMN_WIDTH = 80;
export const MAX_COLUMN_WIDTH = 400;

/**
 * Calculate cumulative right positions for pinned columns
 * Used for sticky column positioning in table headers and body
 */
export function calculatePinnedRightPositions<T>(
  columns: ColumnDef<T>[]
): Map<string, number> {
  const pinnedRightColumns = columns.filter(col => col.pinned === "right");
  const positions = new Map<string, number>();
  let cumulativeRight = STICKY_ACTIONS_WIDTH; // Start after actions column

  // Build position map for right-pinned columns (in reverse order)
  for (let i = pinnedRightColumns.length - 1; i >= 0; i--) {
    const col = pinnedRightColumns[i];
    positions.set(String(col.key), cumulativeRight);
    const width = col.width 
      ? (typeof col.width === 'number' ? col.width : parseInt(col.width)) 
      : DEFAULT_COLUMN_WIDTH;
    cumulativeRight += width;
  }

  return positions;
}

