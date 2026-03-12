import { dashboardNavigationItems } from "@/features/dashboard/config/sidebar-config";
import type { Category, Shortcut } from "../types";

// Helper to check if a label should be excluded from Quick Links
const EXCLUDED_IDS = ["quick-link", "quick-links"];

export const CATEGORIES: Category[] = dashboardNavigationItems
    .filter(item => !EXCLUDED_IDS.includes(item.id))
    .map(navItem => {
        const shortcuts: Shortcut[] = [];

        // If it has submenus, map them to shortcuts
        if (navItem.subMenus) {
            navItem.subMenus.forEach(sub => {
                if (!EXCLUDED_IDS.includes(sub.id)) {
                    shortcuts.push({
                        id: sub.id,
                        path: sub.path,
                        name: sub.label,
                        category: navItem.label,
                        icon: sub.icon || navItem.icon
                    });
                }
            });
        } else if (navItem.path) {
            // If it's a direct link, add as its own shortcut
            shortcuts.push({
                id: navItem.id,
                path: navItem.path,
                name: navItem.label,
                category: navItem.label,
                icon: navItem.icon
            });
        }

        return {
            id: navItem.id,
            name: navItem.label,
            icon: navItem.icon,
            shortcuts: shortcuts
        };
    })
    .filter(category => category.shortcuts.length > 0);

export const ALL_SHORTCUTS: Shortcut[] = CATEGORIES.flatMap(cat => cat.shortcuts);
