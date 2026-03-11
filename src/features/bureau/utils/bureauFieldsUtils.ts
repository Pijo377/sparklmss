import type { BureauFieldFormData } from "../config/bureauConfig";

export const validateBureauFields = (form: BureauFieldFormData): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!form.bureauName) {
        errors.bureauName = "* Please select the Bureau Name.";
    }
    if (!form.bureauFieldName) {
        errors.bureauFieldName = "* Please Enter Bureau Field Name.";
    }
    if (!form.bureauParameter) {
        errors.bureauParameter = "* Please Enter Bureau Parameter.";
    }
    return errors;
};
