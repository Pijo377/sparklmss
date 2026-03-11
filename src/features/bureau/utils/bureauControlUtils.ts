import type { BureauControlFormData } from "../config/bureauConfig";

export const validateBureauControl = (form: BureauControlFormData): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!form.bureauName) {
        errors.bureauName = "* Please select the Bureau Name.";
    }
    if (!form.bureauControlName) {
        errors.bureauControlName = "* Please Enter Bureau Control Name.";
    }
    if (!form.bureauFieldName) {
        errors.bureauFieldName = "* Please select the Field Names.";
    }
    if (!form.bureauFieldValue) {
        errors.bureauFieldValue = "* Please Enter/Select Field Value.";
    }
    return errors;
};

export const validateControlSearch = (searchName: string): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!searchName) {
        errors.searchControlName = "* Please select the Bureau Control Name.";
    }
    return errors;
};
