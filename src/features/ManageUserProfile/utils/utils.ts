

export const validateUserProfile = (form: any, mode: "add" | "edit"): Record<string, string> => {
    const errors: Record<string, string> = {};

    // 1. User Name
    if (!form.userName?.trim()) {
        errors.userName = "* Please enter User Name.";
    } else if (!/^[a-zA-Z][a-zA-Z0-9.,$;]+$/.test(form.userName)) {
        errors.userName = "* User Name should be alphanumeric.It should start with alphabet and end with alphanumeric.";
    }

    // 2. First Name
    if (!form.firstName?.trim()) {
        errors.firstName = "* Please enter First Name.";
    } else if (!/^[a-zA-Z]*([a-zA-Z ]+)*[a-zA-Z]$/.test(form.firstName)) {
        errors.firstName = "* Only alphabets and space are allowed in First Name[It should not start or end with space].";
    }

    // 3. Last Name
    if (!form.lastName?.trim()) {
        errors.lastName = "* Please enter Last Name.";
    } else if (!/^[a-zA-Z]*([a-zA-Z ]+)*[a-zA-Z]$/.test(form.lastName)) {
        errors.lastName = "* Only alphabets and space are allowed in Last Name[It should not start or end with space].";
    }

    // 4. Date of Birth
    if (!form.dateOfBirth) {
        errors.dateOfBirth = "* Please select the Date of Birth.";
    } else {
        const temp = new Date(form.dateOfBirth).getFullYear();
        const temp1 = new Date().getFullYear();
        const result = Number(temp1) - Number(temp);
        if (result < 15) {
            errors.dateOfBirth = "* Your Age should be Greater than 15.";
        }
    }

    // 5. Email
    if (!form.email?.trim()) {
        errors.email = "* Please enter Email.";
    } else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(form.email)) {
        errors.email = "* Please enter Valid Email.";
    }

    // 6. Mobile Number
    if (!form.mobileNumber?.trim()) {
        errors.mobileNumber = "* Please enter Mobile Number.";
    } else if (!/^\(([123456789]\d{2})\)[-](\d{3})[-](\d{4})$/.test(form.mobileNumber)) {
        errors.mobileNumber = "* Please enter Valid Mobile Number.";
    }

    // 7. Emergency Contact
    if (!form.emergencyContact?.trim()) {
        errors.emergencyContact = "* Please enter Emergency Contact Number.";
    } else if (!/^\(([123456789]\d{2})\)[-](\d{3})[-](\d{4})$/.test(form.emergencyContact)) {
        errors.emergencyContact = "* Please enter Valid Emergency Contact Number.";
    }

    // 8. Employee ID
    if (!form.employeeId?.trim()) {
        errors.employeeId = "* Please enter Employee ID.";
    } else if (!/^\w+$/.test(form.employeeId)) {
        errors.employeeId = "* Please enter Valid Employee ID.";
    }

    // 9. Designation
    if (!form.designation?.trim()) {
        errors.designation = "* Please enter Designation.";
    } else if (!/^[A-Za-z]+$/.test(form.designation)) {
        errors.designation = "* Please enter Valid Designation.";
    }

    // 10. Role
    if (!form.role) {
        errors.role = "* Please select the Role.";
    }

    // 11. Date of Joining
    if (!form.dateOfJoining) {
        errors.dateOfJoining = "* Please select the Date of Joining.";
    }

    // 12. Reporting Manager
    if (!form.reportingManager) {
        errors.reportingManager = "* Please select the Manager.";
    }

    // 13. Password Validation
    if (mode === "add" || form.password || form.confirmPassword) {
        if (!form.password?.trim()) {
            errors.password = "* Please enter Password.";
        } else if (!/(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+-])(?!.*\s).*$/.test(form.password)) {
            errors.password = "* Password must be minimum 8 characters long with at least one numeric, one upper case character and one special character.";
        }

        if (!form.confirmPassword?.trim()) {
            errors.confirmPassword = "* Please enter Confirm Password";
        } else if (form.password !== form.confirmPassword && !errors.password) {
            errors.confirmPassword = "* Password and Confirm Password must be same!.";
        }
    }

    return errors;
};
