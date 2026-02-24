// utils.ts

export type PortfolioFormData = Record<string, unknown>;
export type PortfolioFieldValidator = (
  value: unknown,
  data: PortfolioFormData
) => string | null;

export type PortfolioFieldFormatter = (value: string) => string;

/* -------------------- Common Helpers -------------------- */

export const isBlank = (value: unknown) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  return false;
};

export const digitsOnly = (value: unknown) =>
  String(value ?? "").replace(/\D/g, "");

const compose =
  (...validators: PortfolioFieldValidator[]): PortfolioFieldValidator =>
    (value, data) => {
      for (const v of validators) {
        const result = v(value, data);
        if (result) return result;
      }
      return null;
    };

/* -------------------- Formatters -------------------- */

export const formatPhoneNumber = (value: string): string => {
  const digits = digitsOnly(value);

  if (digits.length === 0) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)})-${digits.slice(3)}`;

  return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

/* -------------------- Basic Validators -------------------- */

const required =
  (label: string): PortfolioFieldValidator =>
    (value) =>
      isBlank(value) ? `*${label} is required` : null;

const email =
  (label: string): PortfolioFieldValidator =>
    (value) => {
      const v = String(value ?? "").trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      return isValid ? null : `* Please enter Valid Email.`;
    };

const phone10 =
  (label: string): PortfolioFieldValidator =>
    (value) => {
      const digits = digitsOnly(value);
      if (digits.length !== 10)
        return `*${label} is required`;
      return null;
    };

const zipUS =
  (label: string): PortfolioFieldValidator =>
    (value) => {
      const v = String(value ?? "").trim();
      const isValid =
        /^\d{5}$/.test(v) ||
        /^\d{9}$/.test(v) ||
        /^\d{5}-\d{4}$/.test(v);
      return isValid
        ? null
        : `*Zip is required`;
    };

const integerRange =
  (label: string, min: number, max: number): PortfolioFieldValidator =>
    (value) => {
      const num =
        typeof value === "number" ? value : Number(value);

      if (!Number.isFinite(num) || !Number.isInteger(num))
        return `*${label} is required`;

      if (num < min || num > max)
        return `*${label} must be between ${min} and ${max}.`;

      return null;
    };

const requiredSelect =
  (label: string): PortfolioFieldValidator =>
    (value) =>
      String(value ?? "").trim() === ""
        ? `*${label} is required`
        : null;

/* -------------------- Portfolio Validators -------------------- */

export const portfolioValidators = {
  portfolioName: (value: unknown) => isBlank(value) ? "*Portfolio Name is required" : null,

  address: (value: unknown) => isBlank(value) ? "*Address is required" : null,

  state: (value: unknown) => isBlank(value) ? "*State is required" : null,

  city: (value: unknown) => isBlank(value) ? "*City is required" : null,

  zip: (value: unknown) => isBlank(value) ? "*Zip is required" : null,

  phone: (value: unknown) => isBlank(value) ? "*PhoneNumber is required" : null,

  fax: (value: unknown) => isBlank(value) ? "*Fax is required" : null,

  email: compose(
    (value: unknown) => isBlank(value) ? "*Email is required" : null,
    email("Email")
  ),

  timeZone: (value: unknown) => isBlank(value) ? "*TimeZone is required" : null,

  maxTransactionHour: (value: unknown) => isBlank(value) ? "*Required" : null,

  maxTransactionMinute: (value: unknown) => isBlank(value) ? "*Required" : null,

  movePayDateOnHoliday: (value: unknown) => isBlank(value) ? "*Move Pay Date is required" : null,

  withdrawLeadsAfter: (value: unknown) => {
    if (isBlank(value)) return "*Required";
    const num = Number(value);
    if (isNaN(num) || num < 1 || num > 365) return "*Must be between 1 and 365";
    return null;
  },

  preferredLanguages: (value: unknown) => {
    const arr = Array.isArray(value) ? value : [];
    if (arr.length === 0)
      return "*Required";
    return null;
  },
};

/* -------------------- Form Validate Function -------------------- */

export const validatePortfolioForm = (
  data: PortfolioFormData
) => {
  const errors: Record<string, string> = {};

  Object.entries(portfolioValidators).forEach(
    ([key, validator]) => {
      const error = validator(data[key], data);
      if (error) errors[key] = error;
    }
  );

  return errors;
};
