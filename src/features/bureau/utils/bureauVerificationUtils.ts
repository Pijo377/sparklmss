import type { BureauVerificationFormData } from "../config/bureauConfig";

export const validateBureauVerification = (form: BureauVerificationFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!form.bureauGroupName) {
        errors.bureauGroupName = "* Please select the Bureau Group Name.";
    }
    if (!form.controlFile) {
        errors.controlFile = "* Please select the Control File.";
    }
    if (!form.parameterTag) {
        errors.parameterTag = "* Please enter the Parameter Tag.";
    } else if (form.controlFile !== "DX_BAV_MVS" && !form.parameterTag.startsWith("//")) {
        errors.parameterTag = "* Parameter Tag must start with //";
    }
    if (!form.decisionDataType) {
        errors.decisionDataType = "* Please select the Decision Data Type.";
    }
    if (!form.decisionOperator) {
        errors.decisionOperator = "* Please select the Decision Operator.";
    }
    if (!form.decisionValue) {
        errors.decisionValue = "* Please enter the Decision Value.";
    }

    return errors;
};
