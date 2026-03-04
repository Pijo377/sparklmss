export interface AchProviderSelections {
    provider: string;
    product: string;
}

export interface AchProviderErrors {
    provider?: string;
    product?: string;
}

/**
 * Validates the ACH Provider mapping selections
 */
export const validateAchProviderMapping = (selections: AchProviderSelections): AchProviderErrors => {
    const errors: AchProviderErrors = {};

    if (!selections.provider) {
        errors.provider = "* Please select the ACH Provider.";
    }

    if (!selections.product) {
        errors.product = "* Please select the Product(s).";
    }

    return errors;
};
