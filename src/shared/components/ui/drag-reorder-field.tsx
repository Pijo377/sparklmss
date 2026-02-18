import  { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

/**
 * Props for DragReorderField component
 */
export interface DragReorderFieldProps {
  /** Label displayed above the field */
  label: string;
  /** Array of items with id and label */
  value: Array<{ id: string; label: string }>;
  /** Callback when items are reordered */
  onChange: (value: Array<{ id: string; label: string }>) => void;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Placeholder text when no items */
  emptyText?: string;
  /** Maximum height before scrolling */
  maxHeight?: string;
  /** Whether to show the internal label (set false when EditSheet handles label) */
  showLabel?: boolean;
}

/**
 * Props for individual sortable items
 */
interface SortableItemProps {
  id: string;
  label: string;
  disabled?: boolean;
}

/**
 * Sortable Item Component
 * Individual draggable item in the reorder list
 */
function SortableItem({ id, label, disabled }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl transition-all duration-200 ${
        isDragging
          ? "shadow-lg bg-blue-50 border-blue-300 opacity-75"
          : isOver
            ? "border-blue-400 bg-blue-50"
            : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        disabled={disabled}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-grab active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        aria-label="Drag handle"
      >
        <GripVertical size={16} />
      </button>
      <span className="text-gray-900 truncate flex-1 font-medium">{label}</span>
    </div>
  );
}

/**
 * DragReorderField Component
 * A reusable vertical drag-and-drop field for reordering items
 *
 * @example
 * ```tsx
 * const [items, setItems] = useState([
 *   { id: "1", label: "Item 1" },
 *   { id: "2", label: "Item 2" },
 * ]);
 *
 * <DragReorderField
 *   label="Reorder Items"
 *   value={items}
 *   onChange={setItems}
 * />
 * ```
 */
export function DragReorderField({
  label,
  value,
  onChange,
  disabled = false,
  emptyText = "No items to reorder",
  showLabel = true,
}: DragReorderFieldProps) {
  // Validate items structure
  const validItems = useMemo(() => {
    return Array.isArray(value)
      ? value.filter((item) => item && typeof item === "object" && "id" in item && "label" in item)
      : [];
  }, [value]);

  // Setup sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Handle drag end event
   * Updates the order of items based on drag result
   */
  const handleDragEnd = (event: { active: { id: string | number }; over: { id: string | number } | null }) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = validItems.findIndex((item) => item.id === String(active.id));
      const newIndex = validItems.findIndex((item) => item.id === String(over.id));

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(validItems, oldIndex, newIndex);
        onChange(newOrder);
      }
    }
  };

  // Calculate dynamic max-height based on item count
  // ~44px per item + spacing
  const calculatedMaxHeight = validItems.length > 6 
    ? "350px" // Show scrollbar for more than 6 items
    : "auto"; // Auto height for 6 or fewer items

  return (
    <div className="space-y-2">
      {/* Label - only show if showLabel is true */}
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* Drag and Drop Container */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={validItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
          disabled={disabled}
        >
          {/* Items Container */}
          <div
            className={`space-y-2 border border-gray-200 rounded-xl bg-gray-50 p-3 overflow-y-auto ${
              disabled ? "opacity-50 pointer-events-none" : ""
            }`}
            style={{ maxHeight: calculatedMaxHeight }}
          >
            {validItems.length === 0 ? (
              <div className="h-11 px-4 flex items-center justify-center text-sm text-gray-500">
                {emptyText}
              </div>
            ) : (
              validItems.map((item) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  disabled={disabled}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default DragReorderField;
