import type { BureauGroupFormData } from "../config/bureauConfig";

export const validateBureauGroupTop = (form: BureauGroupFormData): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!form.bureauGroupNameTop) {
        errors.bureauGroupNameTop = "* Please enter Bureau Group Name.";
    }
    return errors;
};

export const validateBureauGroupBottom = (form: BureauGroupFormData, mappedFilesCount: number): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!form.bureauGroupNameBottom) {
        errors.bureauGroupNameBottom = "* Please enter Bureau Group Name.";
    }
    if (mappedFilesCount === 0) {
        errors.mapping = "* Please map at least one file.";
    }
    return errors;
};
