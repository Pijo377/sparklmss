import { useState, useCallback } from "react";

export type ApplyToType = "loan" | "customer";

export function useTagsSelection() {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [tagComboOpen, setTagComboOpen] = useState(false);
  const [applyTo, setApplyTo] = useState<ApplyToType[]>(["loan"]);

  const toggleTag = useCallback((tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId],
    );
  }, []);

  const toggleApplyTo = useCallback((type: ApplyToType) => {
    setApplyTo((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }, []);

  const clearTags = useCallback(() => {
    setSelectedTags([]);
    setApplyTo(["loan"]);
  }, []);

  return {
    selectedTags,
    tagComboOpen,
    setTagComboOpen,
    toggleTag,
    clearTags,
    applyTo,
    toggleApplyTo,
  };
}
