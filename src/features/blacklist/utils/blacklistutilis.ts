import { formatPhoneNumber, digitsOnly } from "@/features/manageleads/components/utils/utils";

// ── Formatters ─────────────────────────────────────────────────────────
export const formatSSN = (value: string): string => {
    const digits = digitsOnly(value);
    if (digits.length === 0) return "";
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
};

export const formatAccountNo = (value: string): string => digitsOnly(value).slice(0, 17);
export const formatABA = (value: string): string => digitsOnly(value).slice(0, 9);

export const categoryFormatter: Record<string, (v: string) => string> = {
    "Blacklist SSN": formatSSN,
    "Blacklist Phone No": formatPhoneNumber,
    "Blacklist Account No": formatAccountNo,
    "Blacklist ABA": formatABA,
};

// ── Validators ─────────────────────────────────────────────────────────
export const categoryValidator: Record<string, (v: string) => string | null> = {
    "Blacklist SSN": (v) => {
        const d = digitsOnly(v);
        return d.length === 9 ? null : "* Please enter ssn number";
    },
    "Blacklist Email": (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "* Please enter email address",
    "Blacklist Phone No": (v) => {
        const d = digitsOnly(v);
        return d.length === 10 ? null : "* Please enter phone number";
    },
    "Blacklist Employer": (v) =>
        v.trim().length >= 2 ? null : "* Please enter Employer name",
    "Blacklist Account No": (v) => {
        const d = digitsOnly(v);
        return d.length >= 4 && d.length <= 17 ? null : "* Please enter account number";
    },
    "Blacklist ABA": (v) => {
        const d = digitsOnly(v);
        return d.length === 9 ? null : "* Please enter ABA number";
    },
    "Blacklist IPAddress": (v) =>
        /^(\d{1,3}\.){3}\d{1,3}$/.test(v.trim()) ? null : "* Please enter IP Address",
    "Blacklist Domain": (v) =>
        /^[a-zA-Z0-9]([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}$/.test(v.trim()) ? null : "* Please enter Domain",
};
