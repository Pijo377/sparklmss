import { addDays, isSameDay, lastDayOfMonth, startOfDay, addMonths, startOfMonth, getDay } from 'date-fns';
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const alphaRegex = /^[a-zA-Z\s]*$/;
export const licenseRegex = /^[A-Z0-9-]{5,20}$/i;

// ... (keep all previous formatting and date helpers here)
export const MON_FRI = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
export const WEEKS_FIRST_THIRD = ["First", "Second", "Third"];
export const WEEKS_LATE = ["Third", "Fourth", "Last"];
export const WEEKS_FULL = ["First", "Second", "Third", "Fourth", "Last"];

export const FREQUENCY_MAP: Record<string, { label: string; mode: string }[]> = {
  "Weekly": [
    { label: "Weekly", mode: "day_of_week" }, 
    { label: "Treat Weekly as Bi-weekly", mode: "day_of_week" }
  ],
  "Every Other Week": [
    { label: "Every Other Week", mode: "day_of_week" }
  ],
  "Semi-Monthly": [
    { label: "Two Specific Days", mode: "semi_dates" }, 
    { label: "Specific Week and Day", mode: "semi_weeks" }
  ],
  "Monthly": [
    { label: "Specific Day", mode: "monthly_date" }, 
    { label: "Specific Week and Day", mode: "monthly_week" }
  ]
};

export const formatPhone = (value: string) => {
  if (!value) return "";
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export const formatSSN = (value: string) => {
  if (!value) return "";
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
};

export const scrollToError = (id: string) => {
  const element = document.getElementById(`wrap-${id}`);
  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

export const getDayName = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
};

export const getNthDayOfMonth = (year: number, month: number, nth: string, dayName: string) => {
  const dayIndex = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].indexOf(dayName);
  let date = startOfMonth(new Date(year, month));
  let count = 0;
  if (nth === "Last") {
    date = lastDayOfMonth(date);
    while (getDay(date) !== dayIndex) date = addDays(date, -1);
    return startOfDay(date);
  }
  const targetCount = ["First", "Second", "Third", "Fourth"].indexOf(nth) + 1;
  while (count < targetCount) {
    if (getDay(date) === dayIndex) count++;
    if (count < targetCount) date = addDays(date, 1);
  }
  return startOfDay(date);
};

export const isAllowedDay = (date: Date, form: any, paydayMode: string) => {
  const d = startOfDay(date);
  if (paydayMode === 'day_of_week') return form.DayOfWeek ? getDayName(d) === form.DayOfWeek : true;
  if (paydayMode === 'semi_dates') {
    const dayNum = d.getDate().toString();
    const isLast = isSameDay(d, lastDayOfMonth(d));
    const d2Match = (form.SemiMonthlyPayDay02 === "32" || form.SemiMonthlyPayDay02 === "EOM") ? isLast : form.SemiMonthlyPayDay02 === dayNum;
    return form.SemiMonthlyPayDay01 === dayNum || d2Match;
  }
  if (paydayMode === 'semi_weeks') {
    const date1 = getNthDayOfMonth(d.getFullYear(), d.getMonth(), form.PayWeek1, form.DayOfWeek1);
    const date2 = getNthDayOfMonth(d.getFullYear(), d.getMonth(), form.PayWeek2, form.DayOfWeek2);
    return isSameDay(d, date1) || isSameDay(d, date2);
  }
  if (paydayMode === 'monthly_date') {
    return (form.MonthlyPayDay === "32" || form.MonthlyPayDay === "EOM") ? isSameDay(d, lastDayOfMonth(d)) : form.MonthlyPayDay === d.getDate().toString();
  }
  if (paydayMode === 'monthly_week') {
    return isSameDay(d, getNthDayOfMonth(d.getFullYear(), d.getMonth(), form.PayWeek1, form.DayOfWeek));
  }
  return true;
};
export const calculateNextPayday = (currentDate: Date, form: any, paydayMode: string) => {
  // 1. Handle bi-weekly option correctly
  if (form.HowPaid === "Treat Weekly as Bi-weekly") return addDays(currentDate, 14);
  
  // 2. Standard Frequency Logic
  if (form.Frequency === "Weekly") return addDays(currentDate, 7);
  if (form.Frequency === "Every Other Week") return addDays(currentDate, 14);

  // 3. Monthly Specific Week and Day
  if (paydayMode === 'monthly_week') {
    const nextMonthDate = addMonths(currentDate, 1);
    return getNthDayOfMonth(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), form.PayWeek1, form.DayOfWeek);
  }

  // 4. Monthly Specific Date
  if (paydayMode === 'monthly_date') {
    const nextMonthDate = addMonths(currentDate, 1);
    const day = parseInt(form.MonthlyPayDay, 10);
    if (!isNaN(day)) return new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), day);
    return lastDayOfMonth(nextMonthDate);
  }

  // 5. Semi-Monthly / Semi-Weeks
  let tempDate = addDays(currentDate, 1);
  for (let i = 0; i < 45; i++) {
    if (isAllowedDay(tempDate, form, paydayMode)) return tempDate;
    tempDate = addDays(tempDate, 1);
  }

  return null;
};
