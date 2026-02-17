// utils.ts

export type PortfolioFormData = Record<string, unknown>;
export type PortfolioFieldValidator = (
  value: unknown,
  data: PortfolioFormData
) => string | null;

export type PortfolioFieldFormatter = (value: string) => string;

/* -------------------- Common Helpers -------------------- */

const isBlank = (value: unknown) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  return false;
};

const digitsOnly = (value: unknown) =>
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
      isBlank(value) ? `${label} is required.` : null;

const email =
  (label: string): PortfolioFieldValidator =>
    (value) => {
      const v = String(value ?? "").trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      return isValid ? null : `${label} must be a valid email address.`;
    };

const phone10 =
  (label: string): PortfolioFieldValidator =>
    (value) => {
      const digits = digitsOnly(value);
      if (digits.length !== 10)
        return `${label} must be a 10 digit number.`;
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
        : `${label} must be 5 digits (or 9 digits / 5-4).`;
    };

const integerRange =
  (label: string, min: number, max: number): PortfolioFieldValidator =>
    (value) => {
      const num =
        typeof value === "number" ? value : Number(value);

      if (!Number.isFinite(num) || !Number.isInteger(num))
        return `${label} must be a whole number.`;

      if (num < min || num > max)
        return `${label} must be between ${min} and ${max}.`;

      return null;
    };

const requiredSelect =
  (label: string): PortfolioFieldValidator =>
    (value) =>
      String(value ?? "").trim() === ""
        ? `${label} is required.`
        : null;

/* -------------------- Portfolio Validators -------------------- */

export const portfolioValidators = {
  portfolioName: required("Portfolio Name"),

  address: required("Address"),

  state: requiredSelect("State"),

  city: required("City"),

  zip: compose(
    required("Zip"),
    zipUS("Zip")
  ),

  phone: compose(
    required("Phone Number"),
    phone10("Phone Number")
  ),

  fax: compose(
    required("Fax"),
    phone10("Fax")
  ),

  email: compose(
    required("Email"),
    email("Email")
  ),

  timeZone: requiredSelect("Time Zone"),

  maxTransactionHour: compose(
    required("Max Transaction Hour"),
    integerRange("Max Transaction Hour", 0, 23)
  ),

  maxTransactionMinute: compose(
    required("Max Transaction Minute"),
    integerRange("Max Transaction Minute", 0, 59)
  ),

  movePayDateOnHoliday: requiredSelect("Move Pay Date on Holiday"),

  withdrawLeadsAfter: compose(
    required("Withdraw Leads After"),
    integerRange("Withdraw Leads After", 1, 365)
  ),

  preferredLanguages: (value: unknown) => {
    const arr = Array.isArray(value) ? value : [];
    if (arr.length === 0)
      return "At least one Preferred Language must be selected.";
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
