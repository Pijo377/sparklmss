import { useState, useCallback, useRef } from "react";
import { type UserProfile } from "../config/userProfileConfig";
import { validateUserProfile } from "../utils/utils";
import { formatPhoneNumber } from "@/features/manageleads/components/utils/utils";

// Mock Data
export const initialData: UserProfile[] = [
    {
        id: "1",
        employeeId: "MLC03",
        userName: "Dolly",
        firstName: "Dolly",
        lastName: "P",
        email: "dolly@sparklms.com",
        mobileNumber: "1112223333",
        dateOfBirth: "1995-05-15",
        emergencyContact: "9998887777",
        designation: "Agent",
        role: "Agent",
        dateOfJoining: "2023-01-10",
        reportingManager: "Manager 1",
        isActive: true,
    },
    {
        id: "2",
        employeeId: "MLC04",
        userName: "John",
        firstName: "John",
        lastName: "Doe",
        email: "john@sparklms.com",
        mobileNumber: "1234567890",
        dateOfBirth: "1990-10-20",
        emergencyContact: "1231231234",
        designation: "SuperAdmin",
        role: "Admin",
        dateOfJoining: "2022-05-15",
        reportingManager: "Manager 2",
        isActive: true,
    },
];

// Mock data for reporting managers based on roles
export const mockManagers: Record<string, { id: string; name: string; userName: string }[]> = {
    "Admin": [
        { id: "mgr_1", name: "System Admin", userName: "SuperTest" },
        { id: "mgr_2", name: "Super User", userName: "AdminUser" }
    ],
    "Manager": [
        { id: "mgr_3", name: "Jane Doe", userName: "ManagerOne" },
        { id: "mgr_4", name: "John Smith", userName: "ManagerTwo" }
    ],
    "Supervisor": [
        { id: "mgr_5", name: "Naveen Kumar", userName: "SupervisorTest" },
        { id: "mgr_6", name: "Alice Johnson", userName: "SupervisorTwo" }
    ],
    "Agent": [
        { id: "mgr_7", name: "Team Lead 1", userName: "AgentLeadOne" },
        { id: "mgr_8", name: "Team Lead 2", userName: "AgentLeadTwo" }
    ],
    "Collection Agent": [
        { id: "mgr_9", name: "Bharath G", userName: "newUser" },
        { id: "mgr_10", name: "Bharath G", userName: "Johndoetest" },
        { id: "mgr_11", name: "Bharath G", userName: "TestAdmin" },
        { id: "mgr_12", name: "Bharath G", userName: "Bharath" },
        { id: "mgr_13", name: "John Doe", userName: "TestSuperUser" },
        { id: "mgr_14", name: "Coll Test2", userName: "CollTest2" },
        { id: "mgr_15", name: "Test Users", userName: "Test Users" }
    ]
};

export const emptyForm: Omit<UserProfile, "id"> = {
    userName: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    mobileNumber: "",
    emergencyContact: "",
    employeeId: "",
    designation: "",
    role: "",
    dateOfJoining: "",
    reportingManager: "",
    password: "",
    confirmPassword: "",
    isActive: true,
};

export const useManageUserProfile = () => {
    const [data, setData] = useState<UserProfile[]>(initialData);
    const [isActive, setIsActive] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formMode, setFormMode] = useState<"add" | "edit">("add");
    const [formData, setFormData] = useState<UserProfile | Omit<UserProfile, "id">>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const formRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (field: string, value: any) => {
        let finalValue = value;
        if (field === "mobileNumber" || field === "emergencyContact") {
            finalValue = formatPhoneNumber(value);
        }

        setFormData((prev) => {
            const newData = { ...prev, [field]: finalValue };
            // If the role changes, automatically clear the selected reporting manager
            if (field === "role") {
                newData.reportingManager = "";
            }
            return newData;
        });

        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Handle Edit Action
    const handleEdit = useCallback((item: UserProfile) => {
        setFormData(item);
        setErrors({});
        setFormMode("edit");
        setIsFormVisible(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }, []);

    // Handle Delete Action
    const handleDelete = useCallback((item: UserProfile) => {
        if (confirm(`Are you sure you want to delete user ${item.userName}?`)) {
            setData((prev) => prev.filter((u) => u.id !== item.id));
        }
    }, []);

    const handleToggleActive = useCallback((item: UserProfile) => {
        setData((prev) =>
            prev.map((u) => u.id === item.id ? { ...u, isActive: !u.isActive } : u)
        );
    }, []);

    // Handle Save Action
    const handleSave = () => {
        const validationErrors = validateUserProfile(formData as UserProfile, formMode);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (formMode === "add") {
            const newId = String(Date.now());
            setData((prev) => [...prev, { ...formData, id: newId } as UserProfile]);
        } else {
            setData((prev) =>
                prev.map((item) => (item.id === (formData as UserProfile).id ? { ...formData } as UserProfile : item))
            );
        }
        setIsFormVisible(false);
        setFormData(emptyForm);
        setErrors({});
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setFormData(emptyForm);
        setErrors({});
    };

    const filteredData = data.filter((item) => item.isActive === isActive);

    return {
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
    };
};
