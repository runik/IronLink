import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// Simple utility function for class merging (similar to cn)
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
  closeButton?: boolean;
  onClose?: () => void;
  animation?: 'fade' | 'slide' | 'scale' | 'bounce';
}

interface DialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

// Context for dialog state
const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isClosing: boolean;
  setIsClosing: (closing: boolean) => void;
} | null>(null);

const useDialogContext = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog");
  }
  return context;
};

// Root Dialog component
const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  const [isClosing, setIsClosing] = React.useState(false);
  
  return (
    <DialogContext.Provider value={{ open, onOpenChange, isClosing, setIsClosing }}>
      {children}
    </DialogContext.Provider>
  );
};

// Trigger component
const DialogTrigger: React.FC<DialogTriggerProps> = ({ 
  asChild = false, 
  children, 
  onClick,
  ...props 
}) => {
  const { onOpenChange } = useDialogContext();
  
  const handleClick = () => {
    onOpenChange(true);
    onClick?.();
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: handleClick,
    } as any);
  }

  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

// Portal component for rendering dialog outside normal DOM hierarchy
const DialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

// Overlay component
const DialogOverlay: React.FC<{ className?: string }> = ({ className }) => {
  const { open, onOpenChange, isClosing } = useDialogContext();

  if (!open && !isClosing) return null;

  return (
    <div
      data-dialog-overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
        isClosing 
          ? "animate-out fade-out-0 duration-300 ease-out"
          : "animate-in fade-in-0 duration-300 ease-out",
        className
      )}
      onClick={() => onOpenChange(false)}
    />
  );
};

// Content component
const DialogContent: React.FC<DialogContentProps> = ({ 
  className, 
  children, 
  closeButton = true,
  onClose,
  animation = 'fade'
}) => {
  const { open, onOpenChange, isClosing, setIsClosing } = useDialogContext();
  const dialogRef = React.useRef<HTMLDivElement>(null);

  // Animation classes based on variant
  const getAnimationClasses = () => {
    const baseClasses = "duration-300 ease-out";
    
    if (isClosing) {
      // Exit animations
      switch (animation) {
        case 'slide':
          return cn(baseClasses, "animate-out fade-out-0 slide-out-to-bottom-8");
        case 'scale':
          return cn(baseClasses, "animate-out fade-out-0 zoom-out-95");
        case 'bounce':
          return cn(baseClasses, "animate-out fade-out-0 zoom-out-95");
        case 'fade':
        default:
          return cn(baseClasses, "animate-out fade-out-0 zoom-out-95 slide-out-to-left-1/2 slide-out-to-top-[48%]");
      }
    } else {
      // Enter animations
      switch (animation) {
        case 'slide':
          return cn(baseClasses, "animate-in fade-in-0 slide-in-from-bottom-8");
        case 'scale':
          return cn(baseClasses, "animate-in fade-in-0 zoom-in-95");
        case 'bounce':
          return cn(baseClasses, "animate-in fade-in-0 zoom-in-95 animate-bounce");
        case 'fade':
        default:
          return cn(baseClasses, "animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]");
      }
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onOpenChange(false);
      onClose?.();
      setIsClosing(false);
    }, 300); // Match the animation duration
  };

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange, onClose]);

  if (!open && !isClosing) return null;

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        ref={dialogRef}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-[90%] max-w-lg max-h-[90vh] -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg",
          getAnimationClasses(),
          "overflow-y-auto rounded-lg sm:w-full shadow-2xl",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        {closeButton && (
          <button
            type="button"
            className="absolute right-1 top-1 sm:right-2 sm:top-2 opacity-90 transition-all focus:outline-none disabled:pointer-events-none text-gray-300 hover:text-black z-20 p-2 hover:scale-110 duration-200"
            onClick={handleClose}
          >
            <X className="h-7 w-7 sm:h-6 sm:w-6" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </DialogPortal>
  );
};

// Header component
const DialogHeader: React.FC<DialogHeaderProps> = ({ className, children }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
  >
    {children}
  </div>
);

// Footer component
const DialogFooter: React.FC<DialogFooterProps> = ({ className, children }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
  >
    {children}
  </div>
);

// Title component
const DialogTitle: React.FC<DialogTitleProps> = ({ className, children }) => (
  <h2
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
  >
    {children}
  </h2>
);

// Description component
const DialogDescription: React.FC<DialogDescriptionProps> = ({ className, children }) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
  >
    {children}
  </p>
);

// Close component
const DialogClose: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  const { onOpenChange } = useDialogContext();
  
  return (
    <button
      type="button"
      className={className}
      onClick={() => onOpenChange(false)}
    >
      {children}
    </button>
  );
};

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
