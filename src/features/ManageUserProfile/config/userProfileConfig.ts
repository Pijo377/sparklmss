import type { ColumnDef } from "@/features/manageleads/ui/data-table/types";
import { type EditSheetField } from "@/features/manageleads/ui/edit-sheet/EditSheet";

export interface UserProfile {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    mobileNumber: string;
    emergencyContact: string;
    employeeId: string;
    designation: string;
    role: string;
    dateOfJoining: string;
    reportingManager: string;
    password?: string;
    confirmPassword?: string;
    isActive: boolean;
    [key: string]: any;
}

export const columns: ColumnDef<UserProfile>[] = [
    { key: "employeeId", header: "Employee ID" },
    { key: "userName", header: "User Name" },
    { key: "firstName", header: "First Name" },
    { key: "lastName", header: "Last Name" },
    { key: "email", header: "Email" },
    { key: "mobileNumber", header: "Mobile Number" },
    { key: "designation", header: "Designation" },
    { key: "role", header: "Role" },
];

export const editSheetFields: EditSheetField[] = [
    {
        key: "userName",
        label: "User Name",
        type: "text",
        placeholder: "Enter User Name",
        required: true,
    },
    {
        key: "firstName",
        label: "First Name",
        type: "text",
        placeholder: "Enter First Name",
        required: true,
    },
    {
        key: "lastName",
        label: "Last Name",
        type: "text",
        placeholder: "Enter Last Name",
        required: true,
    },
    {
        key: "dateOfBirth",
        label: "Date of Birth",
        type: "date",
        required: true,
    },
    {
        key: "email",
        label: "Email",
        type: "text",
        placeholder: "Enter Email",
        required: true,
    },
    {
        key: "mobileNumber",
        label: "Mobile Number",
        type: "text",
        placeholder: "Enter Mobile Number",
        required: true,
    },
    {
        key: "emergencyContact",
        label: "Emergency Contact",
        type: "text",
        placeholder: "Enter Emergency Contact",
        required: true,
    },
    {
        key: "employeeId",
        label: "Employee ID",
        type: "text",
        placeholder: "Enter Employee ID",
        required: true,
    },
    {
        key: "designation",
        label: "Designation",
        type: "text",
        placeholder: "Enter Designation",
        required: true,
    },
    {
        key: "role",
        label: "Role",
        type: "select",
        options: [
            { value: "Admin", label: "Admin" },
            { value: "Agent", label: "Agent" },
            { value: "SuperAdmin", label: "SuperAdmin" },
        ],
        required: true,
    },
    {
        key: "dateOfJoining",
        label: "Date of Joining",
        type: "date",
        required: true,
    },
    {
        key: "reportingManager",
        label: "Reporting Manager",
        type: "select",
        options: [
            { value: "Manager 1", label: "Manager 1" },
            { value: "Manager 2", label: "Manager 2" },
        ],
        required: true,
    },
    {
        key: "password",
        label: "Password",
        type: "password",
        required: true,
    },
    {
        key: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        required: true,
    },
    {
        key: "isActive",
        label: "Is this User Profile active?",
        type: "checkbox",
        required: false,
    },
];
