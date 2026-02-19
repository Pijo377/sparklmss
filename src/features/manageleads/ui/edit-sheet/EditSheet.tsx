// 1️⃣ IMPORTS
import React, { useState, useEffect } from "react";
import { Plus, RotateCcw, X } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { CurrencyInput } from "@/shared/components/ui/currency-input";
import { TimePicker } from "@/shared/components/ui/date-picker-09";
import { DragReorderField } from "@/shared/components/ui/drag-reorder-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
// 2️⃣ TYPE DEFINITIONS
export interface EditSheetField {
  key: string;
  label: string;
  type?: "text" | "number" | "currency" | "date" | "time" | "select" | "textarea" | "checkbox" | "drag-reorder";
  options?: { value: string; label: string }[];
  editable?: boolean;
  placeholder?: string;
  required?: boolean;
  validate?: (value: unknown, data: Record<string, unknown>) => string | null;
  minDate?: (data: Record<string, unknown>) => string | undefined; // New: Dynamic min date
  format?: (value: string) => string; // NEW: Format input values
  groupLabel?: string; // New: Heading/title for a group of fields
  disabledIf?: (data: Record<string, unknown>) => boolean; // New: Conditionally disable based on form data
  hiddenIf?: (data: Record<string, unknown>) => boolean; // New: Conditionally hide based on form data
}

interface EditSheetProps<T extends Record<string, unknown>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  data?: T | null;
  fields: EditSheetField[];
  onSave: (data: T) => void;
  onReset?: () => void;
  onDataChange?: (data: T) => void; // NEW: Callback for real-time data changes
  mode?: "edit" | "add";
  saveButtonText?: string;
  saveButtonIcon?: React.ReactNode;
  showResetButton?: boolean;
  width?: string;
}

interface EditSheetFormProps<T extends Record<string, unknown>> {
  data?: T | null;
  fields: EditSheetField[];
  onSave: (data: T) => void;
  onReset?: () => void;
  onClose: () => void;
  onDataChange?: (data: T) => void; // NEW: Callback for real-time data changes
  mode?: "edit" | "add";
  saveButtonText?: string;
  saveButtonIcon?: React.ReactNode;
  showResetButton?: boolean;
}

// 3️⃣ CONSTANTS - None

// 4️⃣ COMPONENT HELPER
function EditSheetForm<T extends Record<string, unknown>>({
  data,
  fields,
  onSave,
  onReset,
  onClose,
  onDataChange, // NEW
  mode = "edit",
  saveButtonText,
  saveButtonIcon,
  showResetButton = false,
}: EditSheetFormProps<T>) {

  // 5️⃣ STATE
  const isBooleanSelect = (field: EditSheetField) => {
    if (field.type !== "select" || !field.options?.length) return false;
    const values = field.options.map((o) => o.value.trim().toLowerCase());
    return values.every((v) => v === "true" || v === "false");
  };

  const toDateInputString = (value: unknown) => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      const yyyy = value.getFullYear();
      const mm = String(value.getMonth() + 1).padStart(2, "0");
      const dd = String(value.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }

    const raw = String(value ?? "").trim();
    if (!raw) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return "";

    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const dd = String(parsed.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const toTimeInputString = (value: unknown) => {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(raw)) return raw;
    return "";
  };

  const toBoolean = (value: unknown) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;
    if (typeof value === "string") {
      const v = value.trim().toLowerCase();
      if (v === "true" || v === "1" || v === "y" || v === "yes") return true;
      if (v === "false" || v === "0" || v === "n" || v === "no") return false;
    }
    return false;
  };

  const getInitialData = (): T => {
    const base: Record<string, unknown> = data ? { ...data } : {};

    fields.forEach((field) => {
      if (base[field.key] === undefined) {
        if (field.type === "number") base[field.key] = 0;
        else if (field.type === "currency") base[field.key] = "0.00";
        else if (field.type === "checkbox") base[field.key] = false;
        else if (field.type === "drag-reorder") base[field.key] = [
          { id: "f1", label: "Delinquent Principal" },
          { id: "f2", label: "Current Principal" },
          { id: "f3", label: "Delinquent Interest" },
          { id: "f4", label: "Deferred Interest" },
          { id: "f5", label: "Deferred Principal" },
          { id: "f6", label: "Fees" },
        ];
        else if (isBooleanSelect(field)) base[field.key] = false;
        else base[field.key] = "";
      }

      if (field.type === "checkbox" || isBooleanSelect(field)) {
        base[field.key] = toBoolean(base[field.key]);
      }

      if (field.type === "date") {
        base[field.key] = toDateInputString(base[field.key]);
      }

      if (field.type === "time") {
        base[field.key] = toTimeInputString(base[field.key]);
      }

      // Convert number to string for currency fields
      if (field.type === "currency" && typeof base[field.key] === "number") {
        const num = base[field.key] as number;
        base[field.key] = num.toFixed(2);
      }

    });

    return base as T;
  };

  const [formData, setFormData] = useState<T>(getInitialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidation, setShowValidation] = useState(false);

  // 6️⃣ REFS - None
  // 7️⃣ CUSTOM HOOKS - None

  // 8️⃣ DERIVED VALUES
  // Check if all fields are checkboxes
  const allCheckboxes = fields.every((f) => f.type === "checkbox");
  const hasErrors = Object.keys(errors).length > 0;

  // 9️⃣ EFFECTS
  // Notify parent of form data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  // 🔟 HANDLER FUNCTIONS
  const validateAll = (nextData: T) => {
    const nextErrors: Record<string, string> = {};

    const isEmpty = (value: unknown) => {
      if (value === null || value === undefined) return true;
      if (typeof value === "string") return value.trim().length === 0;
      return false;
    };

    fields.forEach((field) => {
      if (field.editable === false) return;
      const value = nextData[field.key];

      if (field.required) {
        if (field.type === "checkbox") {
          if (value !== true) nextErrors[field.key] = `${field.label} is required.`;
        } else if (isEmpty(value)) {
          nextErrors[field.key] = `${field.label} is required.`;
        }
      }

      // Only validate type-specific and custom validations if value is not empty or field has custom validator
      if (!(value === "" || value === null || value === undefined)) {
        if (field.type === "number") {
          const num = typeof value === "number" ? value : Number(value);
          if (!Number.isFinite(num)) nextErrors[field.key] = `${field.label} must be a valid number.`;
        }
        if (field.type === "currency") {
          const strValue = String(value).replace(/,/g, '');
          const num = parseFloat(strValue);
          if (!Number.isFinite(num)) nextErrors[field.key] = `${field.label} must be a valid number.`;
        }
        if (field.type === "date") {
          const asString = String(value);
          const parsed = new Date(asString);
          if (Number.isNaN(parsed.getTime())) nextErrors[field.key] = `${field.label} must be a valid date.`;
        }

        if (field.type === "time") {
          const asString = String(value);
          if (!/^\d{2}:\d{2}(:\d{2})?$/.test(asString)) nextErrors[field.key] = `${field.label} must be a valid time.`;
        }

        if (field.type === "select" && field.options?.length) {
          const asString = String(value);
          const allowed = new Set(field.options.map((o) => o.value));
          if (!allowed.has(asString)) nextErrors[field.key] = `${field.label} must be a valid option.`;
        }
      }

      // Always call custom validator
      const customError = field.validate?.(value, nextData);
      if (customError) nextErrors[field.key] = customError;
    });

    return nextErrors;
  };

  const handleChange = (key: string, value: unknown) => {
    // Find the field definition to check for formatter
    const field = fields.find(f => f.key === key);
    let formattedValue = value;

    // Apply formatter if it exists and value is a string (text input)
    if (field?.format && typeof value === "string") {
      formattedValue = field.format(value);
    }

    setFormData((prev) => {
      const next = { ...prev, [key]: formattedValue } as T;
      if (showValidation) setErrors(validateAll(next));
      onDataChange?.(next);
      return next;
    });
  };

  const handleSave = () => {
    const nextErrors = validateAll(formData);
    setErrors(nextErrors);
    setShowValidation(true);
    if (Object.keys(nextErrors).length > 0) return;

    // Convert currency strings back to numbers before saving
    const dataToSave = { ...formData } as Record<string, any>;
    fields.forEach((field) => {
      if (field.type === "currency") {
        const strValue = String(dataToSave[field.key]).replace(/,/g, '');
        const num = parseFloat(strValue);
        dataToSave[field.key] = isNaN(num) ? 0 : num;
      }
    });

    onSave(dataToSave as T);
    onClose();
  };
  const handleReset = () => {
    setFormData(getInitialData());
    setErrors({});
    setShowValidation(false);
    onReset?.();
  };

  // 1️⃣1️⃣ RENDER HELPERS
  const renderField = (field: EditSheetField) => {
    const value = formData[field.key];
    const isEditable = field.editable !== false && !(field.disabledIf?.(formData as Record<string, unknown>));
    const error = showValidation ? errors[field.key] : undefined;
    const errorClass = error
      ? "border-red-300 focus:ring-red-500 focus:border-transparent"
      : "border-gray-200 focus:ring-blue-500 focus:border-transparent";

    // Calculate min date if applicable
    const minDate = field.type === "date" ? field.minDate?.(formData as Record<string, unknown>) : undefined;

    if (field.type === "select" && field.options) {
      return (
        <div>
          <Select
            value={
              isBooleanSelect(field)
                ? (value === true ? "true" : "false")
                : String(value ?? "")
            }
            onValueChange={(val) =>
              handleChange(field.key, isBooleanSelect(field) ? val === "true" : val)
            }
            disabled={!isEditable}
          >
            <SelectTrigger className={`h-11 px-4 text-sm bg-white border rounded-xl focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 ${errorClass}`}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div>
          <textarea
            id={field.key}
            value={String(value ?? "")}
            onChange={(e) => handleChange(field.key, e.target.value)}
            disabled={!isEditable}
            placeholder={field.placeholder}
            rows={4}
            className={`w-full px-4 py-3 text-sm bg-white border rounded-xl resize-none focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 ${errorClass}`}
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      );
    }

    if (field.type === "checkbox") {
      const checkboxError = showValidation ? errors[field.key] : undefined;
      return (
        <div>
          <label
            className={`flex items-center gap-3 p-3 bg-white border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${checkboxError ? "border-red-300" : "border-gray-200"}`}
          >
            <input
              type="checkbox"
              id={field.key}
              checked={value === true}
              onChange={(e) => handleChange(field.key, e.target.checked)}
              disabled={!isEditable}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            />
            <span className="text-sm font-medium text-gray-700">{field.label}</span>
          </label>
          {checkboxError && <p className="mt-1 text-xs text-red-600">{checkboxError}</p>}
        </div>
      );
    }

    if (field.type === "drag-reorder") {
      const dragReorderError = showValidation ? errors[field.key] : undefined;
      return (
        <div>
          <DragReorderField
            label={field.label}
            value={
              Array.isArray(value)
                ? value
                : typeof value === "string" && value
                  ? [{ id: "1", label: value }]
                  : []
            }
            onChange={(newValue) => handleChange(field.key, newValue)}
            disabled={!isEditable}
            showLabel={false}
          />
          {dragReorderError && <p className="mt-1 text-xs text-red-600">{dragReorderError}</p>}
        </div>
      );
    }

    return (
      <div>
        {field.type === "currency" ? (
          <CurrencyInput
            id={field.key}
            value={String(value ?? "0.00")}
            onChange={(val) => handleChange(field.key, val)}
            disabled={!isEditable}
            placeholder={field.placeholder}
            className={`h-11 px-4 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 ${errorClass}`}
          />
        ) : field.type === "time" ? (
          <TimePicker
            id={field.key}
            value={String(value ?? "")}
            onChange={(val) => handleChange(field.key, val)}
            disabled={!isEditable}
            placeholder={field.placeholder}
            className={`h-11 pr-4 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 ${errorClass}`}
          />
        ) : (
          <Input
            id={field.key}
            type={field.type || "text"}
            value={field.type === "date" ? toDateInputString(value) : String(value ?? "")}
            min={minDate} // Pass min date to input
            onChange={(e) =>
              handleChange(
                field.key,
                field.type === "number"
                  ? (e.target.value === "" ? "" : e.target.valueAsNumber)
                  : e.target.value
              )
            }
            disabled={!isEditable}
            placeholder={field.placeholder}
            className={`h-11 px-4 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 ${errorClass}`}
          />
        )}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  };

  // 1️⃣2️⃣ JSX RETURN
  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
        {allCheckboxes ? (
          // Grid layout for checkbox-only forms
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => {
              const value = formData[field.key];
              const isEditable = field.editable !== false;
              return (
                <label
                  key={field.key}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    id={field.key}
                    checked={value === true}
                    onChange={(e) =>
                      handleChange(field.key, e.target.checked)
                    }
                    disabled={!isEditable}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="text-sm font-medium text-gray-700">{field.label}</span>
                </label>
              );
            })}
          </div>
        ) : (
          // Standard layout for mixed fields
          <div className="space-y-5">
            {fields.map((field, index) => {
              const isFirstInGroup = field.groupLabel && (index === 0 || fields[index - 1].groupLabel !== field.groupLabel);
              const isHidden = field.hiddenIf?.(formData as Record<string, unknown>) || false;

              if (isHidden) return null;

              return (
                <React.Fragment key={field.key}>
                  {isFirstInGroup && (
                    <div className="pt-2 pb-1 border-b border-gray-100">
                      <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        {field.groupLabel}
                      </h4>
                    </div>
                  )}
                  <div className={field.type === "checkbox" ? "" : "space-y-2"}>
                    {field.type !== "checkbox" && (
                      <Label
                        htmlFor={field.key}
                        className="text-sm font-medium text-gray-700 block"
                      >
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                    )}
                    {renderField(field)}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      <SheetFooter className="shrink-0 px-4 py-3 sm:px-6 sm:py-4 bg-white border-t border-gray-200">
        <div className="flex gap-2 sm:gap-3 w-full flex-nowrap">
          <Button
            variant="default"
            onClick={handleSave}
            disabled={showValidation && hasErrors}
            className="cursor-pointer flex-1 min-w-0 h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            {saveButtonIcon ||
              (mode === "add" ? <Plus size={16} className="mr-1 sm:mr-2" /> : null)}
            <span className="truncate">
              {saveButtonText || (mode === "add" ? "Add " : "Save Changes")}
            </span>
          </Button>

          {showResetButton && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="cursor-pointer h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors duration-200"
              title="Reset"
            >
              <RotateCcw size={18} className="sm:size-5" />
            </Button>
          )}

          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors duration-200"
            title="Close"
          >
            <X size={18} className="sm:size-5" />
          </Button>
        </div>
      </SheetFooter>
    </>
  );
}

// 4️⃣ MAIN COMPONENT DECLARATION
export function EditSheet<T extends Record<string, unknown>>({
  open,
  onOpenChange,
  title,
  description,
  data,
  fields,
  onSave,
  onReset,
  onDataChange, // NEW
  mode = "edit",
  saveButtonText,
  saveButtonIcon,
  showResetButton = false,
  width = "w-full sm:w-[520px] md:w-[560px]",
}: EditSheetProps<T>) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={`${width} max-w-full flex flex-col h-full bg-gray-50 border-l border-gray-200`}
      >
        <SheetHeader className="shrink-0 px-4 py-4 sm:px-6 sm:py-6 bg-white border-b border-gray-200">
          <SheetTitle className="text-lg sm:text-xl font-semibold text-gray-900">
            {title}
          </SheetTitle>
          {description && (
            <SheetDescription className="text-xs sm:text-sm text-gray-600 mt-1">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        {open && (
          <EditSheetForm
            data={data}
            fields={fields}
            onSave={onSave}
            onReset={onReset}
            onDataChange={onDataChange} // NEW
            onClose={() => onOpenChange(false)}
            mode={mode}
            saveButtonText={saveButtonText}
            saveButtonIcon={saveButtonIcon}
            showResetButton={showResetButton}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

// 5️⃣ EXPORT
export default EditSheet;
