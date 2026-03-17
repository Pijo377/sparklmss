// ============================================================================
// IFRAME MODAL COMPONENT
// ============================================================================
// Used for payment actions that require iframe loading (Pay By Card, etc.)

import * as React from "react";
import { Modal } from "./Modal";
import { Loader2 } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export interface IframeModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  iframeUrl: string;
  onLoad?: () => void;
  onError?: () => void;
  maxWidth?: string;
  maxHeight?: string;
  showCloseButton?: boolean;
  preventCloseWhileLoading?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const IframeModal: React.FC<IframeModalProps> = ({
  open,
  onOpenChange,
  title = "Payment Processing",
  iframeUrl,
  onLoad,
  onError,
  maxWidth = "90vw",
  maxHeight = "80vh",
  showCloseButton = true,
  preventCloseWhileLoading = true,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (iframeUrl) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [iframeUrl]);

  React.useEffect(() => {
    if (!open) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [open]);

  const handleIframeLoad = React.useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleIframeError = React.useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      showCloseButton={showCloseButton}
      preventClose={preventCloseWhileLoading && isLoading}
      bodyClassName="p-0 relative"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Loading payment form...</p>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="flex flex-col items-center gap-3 text-center px-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-2xl">⚠</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Failed to load payment form</p>
              <p className="text-xs text-gray-500 mt-1">Please try again or contact support</p>
            </div>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={iframeUrl}
        title={title}
        className="w-full h-full border-0"
        style={{ minHeight: "500px", height: "calc(80vh - 100px)" }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        allow="payment"
      />
    </Modal>
  );
};
