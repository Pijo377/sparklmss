import { useState } from "react";
import { ROLES, MENU_ITEMS, USERS } from "../config/manageusermenuconfig";

export const useManageUserMenu = () => {
    const [activeTab, setActiveTab] = useState("role-config");
    const [selectedRole, setSelectedRole] = useState('Admin');
    const [selectedUser, setSelectedUser] = useState('1');
    const [selectedMainMenuId, setSelectedMainMenuId] = useState<string | null>(null);

    // State for main menu visibility per role/user
    const [roleMenuState, setRoleMenuState] = useState<Record<string, Record<string, boolean>>>(() => {
        const initial: Record<string, Record<string, boolean>> = {};
        ROLES.forEach(role => {
            initial[role] = {};
            MENU_ITEMS.forEach(item => {
                initial[role][item.id] = true;
            });
            if (role === 'Admin') initial[role]['dashboard'] = false;
        });
        return initial;
    });

    const [userMenuState, setUserMenuState] = useState<Record<string, Record<string, boolean>>>(() => {
        const initial: Record<string, Record<string, boolean>> = {};
        USERS.forEach(user => {
            initial[user.id] = {};
            MENU_ITEMS.forEach(item => {
                initial[user.id][item.id] = true;
            });
        });
        return initial;
    });

    // State for submenu visibility per role/user/mainmenu
    const [roleSubMenuState, setRoleSubMenuState] = useState<Record<string, Record<string, Record<string, boolean>>>>(() => {
        const initial: Record<string, Record<string, Record<string, boolean>>> = {};
        ROLES.forEach(role => {
            initial[role] = {};
            MENU_ITEMS.forEach(item => {
                if (item.subMenus) {
                    initial[role][item.id] = {};
                    item.subMenus.forEach(sub => {
                        initial[role][item.id][sub.id] = true;
                    });
                }
            });
        });
        return initial;
    });

    const [userSubMenuState, setUserSubMenuState] = useState<Record<string, Record<string, Record<string, boolean>>>>(() => {
        const initial: Record<string, Record<string, Record<string, boolean>>> = {};
        USERS.forEach(user => {
            initial[user.id] = {};
            MENU_ITEMS.forEach(item => {
                if (item.subMenus) {
                    initial[user.id][item.id] = {};
                    item.subMenus.forEach(sub => {
                        initial[user.id][item.id][sub.id] = true;
                    });
                }
            });
        });
        return initial;
    });

    const toggleRoleMenu = (id: string) => {
        setRoleMenuState(prev => ({
            ...prev,
            [selectedRole]: { ...prev[selectedRole], [id]: !prev[selectedRole][id] }
        }));
    };

    const toggleUserMenu = (id: string) => {
        setUserMenuState(prev => ({
            ...prev,
            [selectedUser]: { ...prev[selectedUser], [id]: !prev[selectedUser][id] }
        }));
    };

    const toggleRoleSubMenu = (mainId: string, subId: string) => {
        setRoleSubMenuState(prev => ({
            ...prev,
            [selectedRole]: {
                ...prev[selectedRole],
                [mainId]: { ...prev[selectedRole][mainId], [subId]: !prev[selectedRole][mainId][subId] }
            }
        }));
    };

    const toggleUserSubMenu = (mainId: string, subId: string) => {
        setUserSubMenuState(prev => ({
            ...prev,
            [selectedUser]: {
                ...prev[selectedUser],
                [mainId]: { ...prev[selectedUser][mainId], [subId]: !prev[selectedUser][mainId][subId] }
            }
        }));
    };

    const currentMenuState = activeTab === "role-config" ? roleMenuState[selectedRole] : userMenuState[selectedUser];
    const currentSubMenuState = (activeTab === "role-config"
        ? roleSubMenuState[selectedRole][selectedMainMenuId || '']
        : userSubMenuState[selectedUser][selectedMainMenuId || '']
    ) || {};

    const toggleMenu = activeTab === "role-config" ? toggleRoleMenu : toggleUserMenu;
    const toggleSubMenu = (subId: string) => {
        if (!selectedMainMenuId) return;
        if (activeTab === "role-config") {
            toggleRoleSubMenu(selectedMainMenuId, subId);
        } else {
            toggleUserSubMenu(selectedMainMenuId, subId);
        }
    };

    const selectedItem = MENU_ITEMS.find(item => item.id === selectedMainMenuId);
    const isSubMenuEmpty = !selectedMainMenuId || !currentMenuState[selectedMainMenuId] || !selectedItem?.subMenus;

    return {
        activeTab,
        setActiveTab,
        selectedRole,
        setSelectedRole,
        selectedUser,
        setSelectedUser,
        selectedMainMenuId,
        setSelectedMainMenuId,
        currentMenuState,
        toggleMenu,
        currentSubMenuState,
        toggleSubMenu,
        selectedItem,
        isSubMenuEmpty
    };
};
