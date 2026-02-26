/**
 * Toolbar button definition (for table-level actions)
 */
export interface ToolbarButtonDef {
    /** Icon component */
    icon: React.ReactNode;
    /** Button label text */
    label: string;
    /** Click handler */
    onClick: () => void;
    /** Button variant (default: "default") */
    variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
    /** Custom className for styling */
    className?: string;
    /** Conditional hide */
    hide?: boolean;
    /** Disabled state */
    disabled?: boolean;
}
