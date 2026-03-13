import { Save, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { tabConfigs } from "../config/manageusermenuconfig";
import RoleMenuConfiguration from "../components/RoleMenuConfiguration";
import UserMenuConfiguration from "../components/UserMenuConfiguration";
import { useManageUserMenu } from "../hooks/useManageUserMenu";

const ManageUserMenu = () => {
    const {
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
    } = useManageUserMenu();

    return (
        <div className="flex flex-col gap-4 p-4 font-display">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900">Manage User Menu</h1>
            </div>

            <Tabs defaultValue="role-config" className="w-full" onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-4">
                    <TabsList className="bg-muted p-1 rounded-lg inline-flex flex-wrap justify-start gap-1 h-auto w-auto">
                        {tabConfigs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="
                                flex items-center gap-2 px-3 py-2 text-sm
                                data-[state=active]:bg-blue-600
                                data-[state=active]:text-white
                                data-[state=active]:shadow-sm
                            "
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-all shadow-sm">
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all shadow-sm">
                            <Save className="w-4 h-4" />
                            Submit Changes
                        </button>
                    </div>
                </div>

                <TabsContent value="role-config" className="mt-6">
                    <RoleMenuConfiguration
                        selectedRole={selectedRole}
                        setSelectedRole={setSelectedRole}
                        selectedMainMenuId={selectedMainMenuId}
                        setSelectedMainMenuId={setSelectedMainMenuId}
                        currentMenuState={currentMenuState}
                        toggleMenu={toggleMenu}
                        currentSubMenuState={currentSubMenuState}
                        toggleSubMenu={toggleSubMenu}
                        selectedItem={selectedItem}
                        isSubMenuEmpty={isSubMenuEmpty}
                    />
                </TabsContent>

                <TabsContent value="user-config" className="mt-6">
                    <UserMenuConfiguration
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        selectedMainMenuId={selectedMainMenuId}
                        setSelectedMainMenuId={setSelectedMainMenuId}
                        currentMenuState={currentMenuState}
                        toggleMenu={toggleMenu}
                        currentSubMenuState={currentSubMenuState}
                        toggleSubMenu={toggleSubMenu}
                        selectedItem={selectedItem}
                        isSubMenuEmpty={isSubMenuEmpty}
                    />
                </TabsContent>
            </Tabs>
        </div >
    );
};

export default ManageUserMenu;
