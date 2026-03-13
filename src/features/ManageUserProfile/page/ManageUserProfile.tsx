import { Edit2, Plus, CheckCircle, XCircle, Settings, Trash2, Save, X, User, ShieldCheck, Check, RotateCcw } from "lucide-react";
import { DataTable } from "@/features/manageleads/ui/data-table/DataTable";
import { TableCard } from "@/features/manageleads/ui/table-card/TableCard";
import Card from "@/features/bureau/ui/card";
import { Input } from "@/features/bureau/ui/input";
import { Label } from "@/features/bureau/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/bureau/ui/select";
import type { ToolbarButtonDef } from "@/features/manageleads/ui/data-table/types";
import { columns, type UserProfile } from "../config/userProfileConfig";
import { PasswordField } from "@/shared/components/ui/password-field";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/components/ui/popover";
import { useManageUserProfile, emptyForm, mockManagers } from "../hooks/useManageUserProfile";

const ManageUserProfile = () => {
    const {
        isActive,
        setIsActive,
        isFormVisible,
        setIsFormVisible,
        formMode,
        setFormMode,
        formData,
        setFormData,
        errors,
        setErrors,
        formRef,
        handleInputChange,
        handleEdit,
        handleDelete,
        handleToggleActive,
        handleSave,
        handleCancel,
        filteredData,
    } = useManageUserProfile();

    // Actions are defined inline in DataTable to access the row object
    // Define Toolbar Buttons
    const toolbarButtons: ToolbarButtonDef[] = [
        {
            icon: <Plus size={16} />,
            label: "Add",
            onClick: () => {
                setFormData(emptyForm);
                setErrors({});
                setFormMode("add");
                setIsFormVisible(true);
                setTimeout(() => {
                    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            },
            variant: "default",
            className: "bg-blue-600 hover:bg-blue-700 text-white",
        },
        {
            icon: isActive ? <CheckCircle size={16} /> : <XCircle size={16} />,
            label: isActive ? "Active" : "Inactive",
            onClick: () => setIsActive(!isActive),
            variant: isActive ? "default" : "outline",
            className: isActive
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "border-red-400 text-red-600 hover:bg-red-50",
        },
    ];

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900 shrink-0">Manage User Profile</h1>
            </div>

            {isFormVisible && (
                <div ref={formRef} className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300 scroll-mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Card 1: Personal Details (6 fields) */}
                        <Card className="p-5 border-blue-200 border-2 shadow-sm rounded-2xl bg-white flex flex-col gap-4">
                            <div className="flex items-center gap-3  border-b border-blue-100 pb-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User size={16} className="text-blue-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-blue-600">
                                    Personal Details
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                                <div>
                                    <Label className="block text-sm font-medium text-slate-900 mb-1.5">User Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={formData.userName}
                                        onChange={(e) => handleInputChange("userName", e.target.value)}
                                        placeholder="Enter User Name"
                                        maxLength={15}
                                        className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full"
                                    />
                                    {String(formData.userName).length >= 15 && <span className="text-red-500 text-[10px] mt-1 block">* max limit for the fields is 15</span>}
                                    {errors.userName && String(formData.userName).length < 15 && <span className="text-red-500 text-[10px] mt-1 block">{errors.userName}</span>}
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium text-slate-900 mb-1.5">First Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                        placeholder="First Name"
                                        maxLength={25}
                                        className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full"
                                    />
                                    {String(formData.firstName).length >= 25 && <span className="text-red-500 text-[10px] mt-1 block">* max limit for the fields is 25</span>}
                                    {errors.firstName && String(formData.firstName).length < 25 && <span className="text-red-500 text-[10px] mt-1 block">{errors.firstName}</span>}
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium text-slate-900 mb-1.5">Last Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                        placeholder="Last Name"
                                        maxLength={21}
                                        className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full"
                                    />
                                    {String(formData.lastName).length >= 21 && <span className="text-red-500 text-[10px] mt-1 block">* max limit for the fields is 21</span>}
                                    {errors.lastName && String(formData.lastName).length < 21 && <span className="text-red-500 text-[10px] mt-1 block">{errors.lastName}</span>}
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium text-slate-900 mb-1.5">Date of Birth <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="date"
                                        value={formData.dateOfBirth}
                                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 15)).toISOString().split('T')[0]}
                                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                        placeholder="mm/dd/yyyy"
                                        className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full"
                                    />
                                    {errors.dateOfBirth && <span className="text-red-500 text-[10px] mt-1 block">{errors.dateOfBirth}</span>}
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium text-slate-900 mb-1.5">Email <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        placeholder="Email"
                                        maxLength={50}
                                        className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full"
                                    />
                                    {String(formData.email).length >= 50 && <span className="text-red-500 text-[10px] mt-1 block">* max limit for the fields is 50</span>}
                                    {errors.email && String(formData.email).length < 50 && <span className="text-red-500 text-[10px] mt-1 block">{errors.email}</span>}
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium text-slate-900 mb-1.5">Mobile Number <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={formData.mobileNumber}
                                        onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                                        placeholder="Mobile Number"
                                        maxLength={14}
                                        className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full"
                                    />
                                    {String(formData.mobileNumber).length >= 14 && <span className="text-red-500 text-[10px] mt-1 block">* max limit for the fields is 14</span>}
                                    {errors.mobileNumber && String(formData.mobileNumber).length < 14 && <span className="text-red-500 text-[10px] mt-1 block">{errors.mobileNumber}</span>}
                                </div>
                            </div>
                        </Card>

                        {/* Card 2: Employment Details (6 fields) */}
                        <Card className="p-5 border-amber-200 border-2 shadow-sm rounded-2xl bg-white flex flex-col gap-4">
                            <div className="flex items-center gap-3  border-b border-amber-100 pb-2">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Settings size={16} className="text-amber-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-amber-600">
                                    Work Details
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                                <div>
                                    <Label className="block text-sm font-medium text-slate-900 mb-1.5">Emergency Contact <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={formData.emergencyContact}
                                        onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                                        placeholder="Emergency Contact"
                                        maxLength={14}
                                        className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full"
                                    />
                                    {String(formData.emergencyContact).length >= 14 && <span className="text-red-500 text-[10px] mt-1 block">* max limit for the fields is 14</span>}
                                    {errors.emergencyContact && String(formData.emergencyContact).length < 14 && <span className="text-red-500 text-[10px] mt-1 block">{errors.emergencyContact}</span>}
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium text-slate-900 mb-1.5">Employee ID <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={formData.employeeId}
                                        onChange={(e) => handleInputChange("employeeId", e.target.value)}
                                        placeholder="Employee ID"
                                        maxLength={10}
                                        className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full"
                                    />
                                    {String(formData.employeeId).length >= 10 && <span className="text-red-500 text-[10px] mt-1 block">* max limit for the fields is 10</span>}
                                    {errors.employeeId && String(formData.employeeId).length < 10 && <span className="text-red-500 text-[10px] mt-1 block">{errors.employeeId}</span>}
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium text-slate-900 mb-1.5">Designation <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={formData.designation}
                                        onChange={(e) => handleInputChange("designation", e.target.value)}
                                        placeholder="Designation"
                                        maxLength={15}
                                        className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full"
                                    />
                                    {String(formData.designation).length >= 15 && <span className="text-red-500 text-[10px] mt-1 block">* max limit for the fields is 15</span>}
                                    {errors.designation && String(formData.designation).length < 15 && <span className="text-red-500 text-[10px] mt-1 block">{errors.designation}</span>}
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium text-slate-900 mb-1.5">Role <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(val) => handleInputChange("role", val)}
                                    >
                                        <SelectTrigger className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                                            <SelectValue placeholder="--Select--" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Manager">Manager</SelectItem>
                                            <SelectItem value="Supervisor">Supervisor</SelectItem>
                                            <SelectItem value="Agent">Agent</SelectItem>
                                            <SelectItem value="Collection Agent">Collection Agent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <span className="text-red-500 text-[10px] mt-1 block">{errors.role}</span>}
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium text-slate-900 mb-1.5">Date of Joining <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="date"
                                        value={formData.dateOfJoining}
                                        onChange={(e) => handleInputChange("dateOfJoining", e.target.value)}
                                        placeholder="mm/dd/yyyy"
                                        className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full"
                                    />
                                    {errors.dateOfJoining && <span className="text-red-500 text-[10px] mt-1 block">{errors.dateOfJoining}</span>}
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium text-slate-900 mb-1.5">Reporting Manager <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={formData.reportingManager}
                                        onValueChange={(val) => handleInputChange("reportingManager", val)}
                                        disabled={!formData.role}
                                    >
                                        <SelectTrigger className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                                            <SelectValue placeholder="--Select--" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {formData.role && mockManagers[formData.role] ? (
                                                mockManagers[formData.role].map((mgr) => (
                                                    <SelectItem key={mgr.id} value={mgr.name + " [" + mgr.userName + "]"}>
                                                        {mgr.name} [{mgr.userName}]
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="none" disabled>Select a role first</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.reportingManager && <span className="text-red-500 text-[10px] mt-1 block">{errors.reportingManager}</span>}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Card 3: Security & Status (3 fields) */}
                    <Card className="p-5 border-blue-200 border-2 shadow-sm rounded-2xl bg-white flex flex-col gap-4">
                        <div className="flex items-center gap-3  border-b border-blue-100 pb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ShieldCheck size={16} className="text-blue-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-blue-600">
                                Security & Configuration
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                            <div className="flex-1">
                                <Label className="block text-sm font-medium text-slate-900 mb-1.5">Password {formMode === "add" && <span className="text-red-500">*</span>}</Label>
                                <PasswordField
                                    value={formData.password}
                                    onChange={(e: any) => handleInputChange("password", e.target.value)}
                                    placeholder="Enter Password"
                                    maxLength={20}
                                    className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full"
                                />
                                {String(formData.password).length >= 20 && <span className="text-red-500 text-[10px] mt-1 block">* max limit for the fields is 20</span>}
                                {errors.password && String(formData.password).length < 20 && <span className="text-red-500 text-[10px] mt-1 block">{errors.password}</span>}
                            </div>
                            <div className="flex-1">
                                <Label className="block text-sm font-medium text-slate-900 mb-1.5">Confirm Password {formMode === "add" && <span className="text-red-500">*</span>}</Label>
                                <PasswordField
                                    value={formData.confirmPassword}
                                    onChange={(e: any) => handleInputChange("confirmPassword", e.target.value)}
                                    placeholder="Confirm Password"
                                    maxLength={20}
                                    className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full"
                                />
                                {String(formData.confirmPassword).length >= 20 && <span className="text-red-500 text-[10px] mt-1 block">* max limit for the fields is 20</span>}
                                {errors.confirmPassword && String(formData.confirmPassword).length < 20 && <span className="text-red-500 text-[10px] mt-1 block">{errors.confirmPassword}</span>}
                            </div>
                            <div className="flex-1 mt-[26px]">
                                <div
                                    onClick={() => handleInputChange("isActive", !formData.isActive)}
                                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors h-11 select-none"
                                >
                                    <div className={`
                                        w-5 h-5 rounded-[4px] border transition-all flex items-center justify-center shrink-0
                                        ${formData.isActive
                                            ? 'bg-blue-600 border-blue-600 shadow-sm'
                                            : 'bg-white border-slate-300'}
                                    `}>
                                        {formData.isActive && <Check size={14} className="text-white stroke-[3.5]" />}
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 truncate tracking-tight">Is this User Profile active?</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Buttons Outside */}
                    <div className="flex justify-center gap-4 mt-2">
                        <button
                            onClick={handleSave}
                            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all font-semibold text-sm flex items-center gap-2 cursor-pointer"
                        >
                            <Save size={18} />
                            Submit
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-sm"
                        >
                            <X size={18} />
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <TableCard>
                <DataTable<UserProfile>
                    data={filteredData}
                    columns={columns}
                    actions={{
                        header: "Action",
                        width: "120px",
                        items: (item) => [
                            {
                                icon: <Edit2 size={16} className="text-blue-600" />,
                                label: "Edit",
                                onClick: handleEdit,
                            },
                            {
                                icon: (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Settings size={16} className="text-blue-600 cursor-pointer" />
                                        </PopoverTrigger>
                                        <PopoverContent
                                            side="bottom"
                                            align="end"
                                            sideOffset={8}
                                            className="w-auto p-1.5 bg-white border border-blue-500 rounded-[10px] flex items-center gap-1 shadow-lg z-50 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95"
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(item);
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm font-medium cursor-pointer"
                                            >
                                                <Trash2 size={16} /> Delete
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleActive(item);
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-md transition-colors text-sm font-medium cursor-pointer"
                                            >
                                                <RotateCcw size={16} /> {item.isActive ? "InActive" : "Active"}
                                            </button>
                                        </PopoverContent>
                                    </Popover>
                                ),
                                label: "Settings",
                                onClick: () => { },
                            }
                        ],
                    }}
                    enableColumnFilters={true}
                    enableGlobalSearch={true}
                    initialPageSize={100}
                    pageSizeOptions={[10, 25, 50, 100]}
                    title={`User Profile (${isActive ? "Active" : "Inactive"})`}
                    toolbarButtons={toolbarButtons}
                />
            </TableCard>
        </div>
    );
};

export default ManageUserProfile;
