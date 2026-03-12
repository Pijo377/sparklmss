import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

export interface Shortcut {
    id: string;
    path: string;
    name: string;
    category: string;
    icon: LucideIcon | IconType;
}

export interface Category {
    id: string;
    name: string;
    icon: LucideIcon | IconType;
    shortcuts: Shortcut[];
}
