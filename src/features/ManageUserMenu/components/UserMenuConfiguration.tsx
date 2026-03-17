import { useState } from "react";
import { USERS, MENU_ITEMS } from "../config/manageusermenuconfig";
import { Menu, X, Search } from "lucide-react";

interface UserMenuConfigurationProps {
    selectedUser: string;
    setSelectedUser: (userId: string) => void;
    selectedMainMenuId: string | null;
    setSelectedMainMenuId: (id: string | null) => void;
    currentMenuState: Record<string, boolean>;
    toggleMenu: (id: string) => void;
    currentSubMenuState: Record<string, boolean>;
    toggleSubMenu: (id: string) => void;
    selectedItem: any;
    isSubMenuEmpty: boolean;
}

const UserMenuConfiguration = ({
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
}: UserMenuConfigurationProps) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = USERS.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-24 gap-6">
            {/* Selection Column (Users) */}
            <div className="lg:col-span-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-center">
                        <h2 className="text-sm font-semibold text-slate-900">Users</h2>
                    </div>
                    {/* Search Box */}
                    <div className="p-2 border-b border-slate-50 bg-slate-50/30">
                        <div className="relative group">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                    <div className="p-2 space-y-1 h-[calc(100vh-320px)] overflow-y-auto scrollbar-hide">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => {
                                        setSelectedUser(user.id);
                                        setSelectedMainMenuId(null);
                                    }}
                                    className={`w-full flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${selectedUser === user.id
                                        ? 'bg-blue-50 text-slate-900 font-medium'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <span>{user.name}</span>
                                    {selectedUser === user.id && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="py-8 text-center">
                                <p className="text-xs text-slate-400 italic">No users found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Menu Configuration Column */}
            <div className="lg:col-span-9">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full hover:border-blue-200 transition-colors overflow-hidden">
                    <div className="p-4 border-b border-blue-500 flex items-center justify-center bg-blue-600 relative">
                        <h2 className="text-sm font-semibold text-white">Main Menu</h2>
                        <span className="absolute right-4 text-[10px] font-bold px-2 py-0.5 bg-white/20 text-white rounded-full border border-white/30 uppercase tracking-tight">
                            {Object.values(currentMenuState).filter(Boolean).length} Active
                        </span>
                    </div>

                    <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-320px)] scrollbar-hide">
                        {MENU_ITEMS.map((item) => {
                            const isActive = currentMenuState[item.id];
                            const Icon = item.icon;
                            const isSelected = selectedMainMenuId === item.id;

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedMainMenuId(item.id)}
                                    className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${isSelected
                                        ? 'border-blue-600 bg-blue-50/30'
                                        : isActive
                                            ? 'border-slate-200 bg-white shadow-sm hover:border-blue-200'
                                            : 'border-slate-100 bg-slate-50/50 opacity-75 hover:opacity-100'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        <Icon className="w-4 h-4" />
                                    </div>

                                    <div className="flex-1">
                                        <span className={`text-sm font-medium ${isActive ? 'text-slate-900' : 'text-slate-500'
                                            }`}>
                                            {item.label}
                                        </span>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleMenu(item.id);
                                            setSelectedMainMenuId(item.id);
                                        }}
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? 'bg-blue-600' : 'bg-slate-200'
                                            }`}
                                        role="switch"
                                        aria-checked={isActive}
                                    >
                                        <span className="sr-only">Toggle {item.label}</span>
                                        <span
                                            aria-hidden="true"
                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-2' : '-translate-x-2'
                                                }`}
                                        />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Sub Menu Configuration Column */}
            <div className="lg:col-span-9">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-blue-500 flex items-center justify-center bg-blue-600">
                        <h2 className="text-sm font-semibold text-white">
                            Sub Menu
                        </h2>
                    </div>

                    <div className={`p-4 h-[calc(100vh-320px)] scrollbar-hide ${isSubMenuEmpty ? 'overflow-hidden' : 'overflow-y-auto'}`}>

                        {!selectedMainMenuId || !currentMenuState[selectedMainMenuId] ? (
                            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                                    <div className="relative p-5 bg-white rounded-2xl border border-blue-50 shadow-sm transition-transform hover:scale-105 duration-300">
                                        <Menu className="w-10 h-10 text-blue-600/70" />
                                    </div>
                                </div>
                                <h3 className="text-base font-semibold text-slate-800 mb-2">
                                    {!selectedMainMenuId ? "No Menu Selected" : "Main Menu Disabled"}
                                </h3>
                                <p className="text-sm text-slate-500 max-w-[240px] leading-relaxed mx-auto">
                                </p>
                            </div>
                        ) : !selectedItem?.subMenus ? (
                            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                                <div className="p-5 bg-blue-50/50 rounded-2xl border border-dashed border-blue-200 mb-4 group-hover:scale-105 transition-transform duration-300">
                                    <X className="w-10 h-10 text-blue-400/70" />
                                </div>
                                <p className="text-sm text-slate-500 italic max-w-[200px]">No sub menus available for {selectedItem?.label}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {selectedItem.subMenus.map((sub: any) => {
                                    const isActive = currentSubMenuState[sub.id];
                                    const SubIcon = sub.icon;

                                    return (
                                        <div
                                            key={sub.id}
                                            className={`group flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 ${isActive
                                                ? 'border-slate-200 bg-white shadow-sm hover:border-blue-200'
                                                : 'border-slate-100 bg-slate-50/50 opacity-75 hover:opacity-100'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-lg transition-colors ${isActive
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                <SubIcon className="w-4 h-4" />
                                            </div>

                                            <div className="flex-1">
                                                <span className={`text-sm font-medium ${isActive ? 'text-slate-900' : 'text-slate-500'
                                                    }`}>
                                                    {sub.label}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => toggleSubMenu(sub.id)}
                                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? 'bg-blue-600' : 'bg-slate-200'
                                                    }`}
                                                role="switch"
                                                aria-checked={isActive}
                                            >
                                                <span className="sr-only">Toggle {sub.label}</span>
                                                <span
                                                    aria-hidden="true"
                                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-2' : '-translate-x-2'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserMenuConfiguration;
