// 1️⃣ IMPORTS
import { useState, useMemo, useCallback } from "react";
import { ChevronsUpDown } from "lucide-react";
import { IoPricetag, IoCheckmarkCircle } from "react-icons/io5";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Badge } from "@/shared/components/ui/badge";
import { Label } from "@/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import type { Tag } from "@/features/customer-details/api/tagsApi";

// 2️⃣ TYPE DEFINITIONS
export interface TagsPanelProps {
  availableTags: Tag[];
  selectedTags: string[];
  applyTo: string[];
  onTagsChange: (tags: string[]) => void;
  onApplyToChange: (applyTo: string[]) => void;
}

// 3️⃣ CONSTANTS
const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Recovery: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  Priority: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  cp: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  VIP: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  Doc: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  LIC_Doc: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  InsTags: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
};

const DEFAULT_COLOR = { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };

// 4️⃣ HELPER FUNCTIONS
const getTagColor = (tag: string) => TAG_COLORS[tag] || DEFAULT_COLOR;

// 5️⃣ COMPONENT DECLARATION
export function TagsPanel({
  availableTags,
  selectedTags,
  applyTo,
  onTagsChange,
  onApplyToChange,
}: TagsPanelProps) {
  // 5️⃣ STATE
  const [tagComboOpen, setTagComboOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 8️⃣ DERIVED VALUES
  // Client-side filtering of tags based on search query
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return availableTags;
    
    const query = searchQuery.toLowerCase();
    return availableTags.filter(tag => 
      tag.Tags.toLowerCase().includes(query)
    );
  }, [availableTags, searchQuery]);

  const isAllSelected = useMemo(
    () => selectedTags.length === availableTags.length && availableTags.length > 0,
    [selectedTags.length, availableTags.length]
  );

  // 🔟 HANDLER FUNCTIONS
  const toggleTag = useCallback((tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  }, [selectedTags, onTagsChange]);

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      // Deselect all
      onTagsChange([]);
    } else {
      // Select all
      const allTagIds = availableTags.map(tag => String(tag.Tagsid));
      onTagsChange(allTagIds);
    }
  }, [isAllSelected, availableTags, onTagsChange]);

  const toggleApplyTo = useCallback((type: string) => {
    if (applyTo.includes(type)) {
      onApplyToChange(applyTo.filter((t) => t !== type));
    } else {
      onApplyToChange([...applyTo, type]);
    }
  }, [applyTo, onApplyToChange]);

  // 6️⃣ JSX RETURN
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
          <IoPricetag className="h-4 w-4 text-amber-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-800">Add Tags</h3>
      </div>

      {/* 2 Column Grid - Responsive: stacks on mobile, 2 cols on tablet+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: Search Tags + Loan/Customer */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Search Tags
          </Label>
          <Popover open={tagComboOpen} onOpenChange={setTagComboOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={tagComboOpen}
                className="w-full justify-between h-10 text-sm border-gray-200"
              >
                <span className="text-gray-500">Select tags</span>
                <ChevronsUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
              <Command shouldFilter={false}>
                <CommandInput 
                  placeholder="Search tags..." 
                  className="h-8 text-sm"
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList className="max-h-[300px] overflow-y-auto">
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup>
                    {/* Select All Option */}
                    <CommandItem
                      onSelect={handleSelectAll}
                      className="cursor-pointer text-sm py-2 font-semibold border-b border-gray-200 bg-gray-50 hover:bg-gray-100"
                    >
                      <Checkbox 
                        checked={isAllSelected}
                        className="mr-2 h-3.5 w-3.5" 
                      />
                      <span>Select All ({availableTags.length})</span>
                    </CommandItem>
                    
                    {/* Individual Tags */}
                    {filteredTags.length === 0 ? (
                      <div className="py-6 text-center text-sm text-gray-500">
                        No tags match your search
                      </div>
                    ) : (
                      filteredTags.map((tag) => {
                        const tagId = String(tag.Tagsid);
                        const tagName = tag.Tags;
                        const colors = getTagColor(tagName);
                        const isSelected = selectedTags.includes(tagId);
                        
                        return (
                          <CommandItem
                            key={tagId}
                            value={tagName}
                            onSelect={() => toggleTag(tagId)}
                            className={cn(
                              "cursor-pointer text-sm py-2",
                              isSelected && colors.bg
                            )}
                          >
                            <Checkbox 
                              checked={isSelected} 
                              className="mr-2 h-3.5 w-3.5" 
                            />
                            <span className={cn(
                              isSelected && `font-medium ${colors.text}`
                            )}>
                              {tagName}
                            </span>
                          </CommandItem>
                        );
                      })
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Loan / Customer Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <label className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-all flex-1 min-w-[120px] justify-center",
              applyTo.includes("loan")
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
            )}>
              <Checkbox
                checked={applyTo.includes("loan")}
                onCheckedChange={() => toggleApplyTo("loan")}
                className={cn(
                  "h-4 w-4 border-2",
                  applyTo.includes("loan") ? "border-white data-[state=checked]:bg-white data-[state=checked]:text-indigo-600" : "border-gray-400"
                )}
              />
              <span className="text-sm font-medium">Loan</span>
            </label>

            <label className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-all flex-1 min-w-[120px] justify-center",
              applyTo.includes("customer")
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
            )}>
              <Checkbox
                checked={applyTo.includes("customer")}
                onCheckedChange={() => toggleApplyTo("customer")}
                className={cn(
                  "h-4 w-4 border-2",
                  applyTo.includes("customer") ? "border-white data-[state=checked]:bg-white data-[state=checked]:text-green-600" : "border-gray-400"
                )}
              />
              <span className="text-sm font-medium">Customer</span>
            </label>
          </div>
        </div>

        {/* Column 2: Available Tags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Available Tags
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="h-6 px-2 text-xs"
                aria-label={isAllSelected ? "Deselect all tags" : "Select all tags"}
              >
                {isAllSelected ? "Deselect All" : "Select All"}
              </Button>
              <Badge variant="secondary" className={cn(
                "text-xs",
                selectedTags.length > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
              )}>
                {selectedTags.length} selected
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-gray-100 bg-gray-50/50 min-h-[80px] max-h-[200px] overflow-y-auto">
            {availableTags.map((tag) => {
              const tagId = String(tag.Tagsid);
              const tagName = tag.Tags;
              const colors = getTagColor(tagName);
              const isSelected = selectedTags.includes(tagId);
              return (
                <button
                  key={tagId}
                  onClick={() => toggleTag(tagId)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all h-fit",
                    isSelected
                      ? `${colors.bg} ${colors.text} ${colors.border} border`
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                  )}
                >
                  {isSelected && <IoCheckmarkCircle className="h-3 w-3" />}
                  {tagName}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
