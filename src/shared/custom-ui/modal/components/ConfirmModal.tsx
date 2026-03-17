// 1️⃣ IMPORTS
"use client";

import { cn } from "@/shared/lib/utils";
import type { ConfirmModalProps } from "../types";
import { Modal } from "./Modal";
import { LoadingSpinner } from "./LoadingSpinner";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Trash2,
  AlertCircle 
} from "lucide-react";

// 2️⃣ TYPE DEFINITIONS - In ../types

// 3️⃣ CONSTANTS
const VARIANT_CONFIG = {
  danger: {
    icon: Trash2,
    iconBgColor: "bg-red-50",
    iconColor: "text-red-600",
    buttonBg: "bg-red-600 hover:bg-red-700",
    buttonRing: "focus:ring-red-500",
  },
  warning: {
    icon: AlertTriangle,
    iconBgColor: "bg-amber-50",
    iconColor: "text-amber-600",
    buttonBg: "bg-amber-600 hover:bg-amber-700",
    buttonRing: "focus:ring-amber-500",
  },
  success: {
    icon: CheckCircle2,
    iconBgColor: "bg-green-50",
    iconColor: "text-green-600",
    buttonBg: "bg-green-600 hover:bg-green-700",
    buttonRing: "focus:ring-green-500",
  },
  info: {
    icon: Info,
    iconBgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    buttonBg: "bg-blue-600 hover:bg-blue-700",
    buttonRing: "focus:ring-blue-500",
  },
  default: {
    icon: AlertCircle,
    iconBgColor: "bg-gray-50",
    iconColor: "text-gray-600",
    buttonBg: "bg-gray-900 hover:bg-gray-800",
    buttonRing: "focus:ring-gray-500",
  },
} as const;

// 4️⃣ COMPONENT DECLARATION
/**
 * Confirmation Modal - Modern, Icon-Based Design
 * 
 * Features:
 * - Visual icon indicators for different action types
 * - Better dimensions and spacing
 * - Mobile responsive (adapts to small screens)
 * - Scalable variant system (danger, warning, success, info, default)
 * - Smooth animations and transitions
 */
export function ConfirmModal({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  loading = false,
  trigger,
}: ConfirmModalProps) {

  // 5️⃣ STATE - None

  // 6️⃣ REFS - None

  // 7️⃣ CUSTOM HOOKS - None

  // 8️⃣ DERIVED VALUES
  const config = VARIANT_CONFIG[variant];
  const IconComponent = config.icon;

  // 9️⃣ EFFECTS - None

  // 🔟 HANDLERS
  const handleConfirm = async () => {
    await onConfirm?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  // 1️⃣1️⃣ JSX RETURN
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
      maxWidth="480px"
      preventClose={loading}
      loading={loading}
      showCloseButton={false}
      className="rounded-xl"
    >
      {/* Main Content Container - Compact Horizontal Layout */}
      <div className="flex flex-col items-center text-center px-6 sm:px-7 pt-6 pb-5">
        {/* Icon Circle - Reduced by 30% */}
        <div
          className={cn(
            "flex items-center justify-center w-14 h-14 rounded-full mb-4",
            "transition-all duration-200",
            config.iconBgColor
          )}
        >
          <IconComponent className={cn("w-7 h-7", config.iconColor)} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm font-medium text-gray-700 leading-relaxed">
            {description}
          </p>
        )}

        {/* Additional Content */}
        {children && (
          <div className="mt-4 w-full">
            {children}
          </div>
        )}
      </div>

      {/* Action Buttons Footer - Compact */}
      <div className="flex flex-col-reverse sm:flex-row gap-2.5 px-6 sm:px-7 pb-5 pt-1">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all",
            "text-gray-700 bg-white border border-gray-300",
            "hover:bg-gray-50 hover:border-gray-400",
            "focus:outline-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "active:scale-[0.98]"
          )}
        >
          {cancelText}
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className={cn(
            "flex-1 inline-flex items-center justify-center gap-2",
            "px-4 py-2.5 text-sm font-medium rounded-lg transition-all",
            "text-white focus:outline-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "active:scale-[0.98]",
            config.buttonBg,
            config.buttonRing
          )}
        >
          {loading && <LoadingSpinner className="h-4 w-4" />}
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
