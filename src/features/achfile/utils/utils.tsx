

/**
 * Validates the ACH File form fields.
 * Returns a Record of field-name → error-message for every invalid field.
 */
export const validateForm = (fields: {
    selectedFileType: string;
    groupName: string;
    provider: string;
    returnFileType: string;
    returnFileExtension: string;
    destination: string;
    origin: string;
    destinationName: string;
    originName: string;
    companyId: string;
    achExtension: string;
    uploadHostName: string;
    uploadProtocol: string;
    uploadUserName: string;
    uploadPassword: string;
    uploadPortNo: string;
    uploadPath: string;
    downloadHostName: string;
    downloadProtocol: string;
    downloadUserName: string;
    downloadPassword: string;
    downloadPortNo: string;
    downloadPath: string;
}): Record<string, string> => {
    const e: Record<string, string> = {};

    // Group Name (required for all types)
    if (!fields.groupName.trim()) e.groupName = fields.selectedFileType === 'CSV File' ? '* Please enter CSV Group Name.' : '* Please enter ACH Group Name.';

    // ACH Provider
    if (!fields.provider) e.provider = '* Please select ACH Provider.';

    // Return File Type
    if (!fields.returnFileType) e.returnFileType = '* Please select Return File Type.';

    // Return File Extension
    if (!fields.returnFileExtension.trim()) e.returnFileExtension = '* Please enter Return File Extension.';

    // NACHA / PDS only fields
    if (fields.selectedFileType !== 'CSV File') {
        if (!fields.destination.trim()) e.destination = '* Please enter Immediate Destination.';
        else if (!/^\d{9}$/.test(fields.destination)) e.destination = '* Immediate Destination should be 9 digits.';

        if (!fields.origin.trim()) e.origin = '* Please enter Immediate Origin.';
        else if (!/^\d{9}$/.test(fields.origin)) e.origin = '* Immediate Origin should be 9 digits.';

        if (!fields.destinationName.trim()) e.destinationName = '* Please enter Immediate Destination Name.';
        if (!fields.originName.trim()) e.originName = '* Please enter Immediate Origin Name.';
        if (!fields.companyId.trim()) e.companyId = '* Please enter the Company ID.';
        if (!fields.achExtension.trim()) e.achExtension = '* Please enter ACH File Extension.';
    }

    // Upload credentials
    if (!fields.uploadHostName.trim()) e.uploadHostName = '* Please enter Host Name.';
    if (!fields.uploadProtocol) e.uploadProtocol = '* Please select Upload Transfer Protocol.';
    if (!fields.uploadUserName.trim()) e.uploadUserName = '* Please enter User Name.';
    if (!fields.uploadPassword.trim()) e.uploadPassword = '* Please enter the Password.';
    if (!fields.uploadPortNo.trim()) e.uploadPortNo = '* Please enter the Port Number.';
    if (!fields.uploadPath.trim()) e.uploadPath = '* Please enter the File Path.';
    else if (!fields.uploadPath.startsWith('/')) e.uploadPath = '* File path should start with single slash (/).';

    // Download credentials
    if (!fields.downloadHostName.trim()) e.downloadHostName = '* Please enter Host Name.';
    if (!fields.downloadProtocol) e.downloadProtocol = '* Please select Download Transfer Protocol.';
    if (!fields.downloadUserName.trim()) e.downloadUserName = '* Please enter User Name.';
    if (!fields.downloadPassword.trim()) e.downloadPassword = '* Please enter the Password.';
    if (!fields.downloadPortNo.trim()) e.downloadPortNo = '* Please enter the Port Number.';
    if (!fields.downloadPath.trim()) e.downloadPath = '* Please enter the Download Path.';
    else if (!fields.downloadPath.startsWith('/')) e.downloadPath = '* File path should start with single slash (/).';

    return e;
};


/**
 * Max limits for each form field.
 */
export const MAX_LIMITS = {
    groupName: 50,
    destination: 9,
    origin: 9,
    destinationName: 23,
    originName: 23,
    companyId: 10,
    achExtension: 10,
    returnFileExtension: 20,
    uploadHostName: 255,
    uploadUserName: 36,
    uploadPassword: 70,
    uploadPortNo: 5,
    uploadPath: 200,
    downloadHostName: 255,
    downloadUserName: 36,
    downloadPassword: 70,
    downloadPortNo: 5,
    downloadPath: 200,
    separator: 1,
    field1: 50,
    field2: 50,
};

/**
 * Inline error message component.
 * Renders red text below a field when validation fails after submit
 * or when the max character limit is reached.
 */
export const ErrorMsg = ({ field, isSubmitted, errors, value }: {
    field: string;
    isSubmitted: boolean;
    errors: Record<string, string>;
    value?: string;
}) => {
    const limit = MAX_LIMITS[field as keyof typeof MAX_LIMITS];
    if (value && limit && value.length >= limit) {
        return <span className="text-red-500 text-[11px] mt-1 block">* max limit for the fields is {limit}</span>;
    }
    return isSubmitted && errors[field] ? <span className="text-red-500 text-[11px] mt-1 block">{errors[field]}</span> : null;
};
