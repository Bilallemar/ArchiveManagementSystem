// Standard Gregorian calendar quarters: Q1 Jan-Mar, Q2 Apr-Jun, Q3 Jul-Sep, Q4 Oct-Dec
const QUARTER_MONTHS = {
  1: { startMonth: 1, endMonth: 3 },
  2: { startMonth: 4, endMonth: 6 },
  3: { startMonth: 7, endMonth: 9 },
  4: { startMonth: 10, endMonth: 12 },
};

const QUARTER_LABELS_PS = {
  1: "لومړۍ ربع",
  2: "دویمه ربع",
  3: "دریمه ربع",
  4: "څلورمه ربع",
};

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * Returns { dateFrom, dateTo } as "YYYY-MM-DD" strings for a given year + quarter (1-4).
 * Use for Archive report (date-range based).
 */
export function getQuarterDateRange(year, quarter) {
  const { startMonth, endMonth } = QUARTER_MONTHS[quarter];
  const dateFrom = `${year}-${String(startMonth).padStart(2, "0")}-01`;
  const lastDay = daysInMonth(year, endMonth);
  const dateTo = `${year}-${String(endMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { dateFrom, dateTo };
}

/**
 * Returns { monthFrom, monthTo } (1-12) for a given quarter.
 * Use for Makhzan/Hifziya reports (year + month-range based).
 */
export function getQuarterMonthRange(quarter) {
  const { startMonth, endMonth } = QUARTER_MONTHS[quarter];
  return { monthFrom: startMonth, monthTo: endMonth };
}

/**
 * Human-readable Pashto label for the selected quarter/year, e.g. "دویمه ربع د ٢٠٢٦ کال"
 */
export function getQuarterLabel(year, quarter) {
  return `${QUARTER_LABELS_PS[quarter]} د ${year} کال`;
}

export const QUARTER_OPTIONS = [
  { value: 1, label: "ربع اول (جنوري-مارچ)" },
  { value: 2, label: "ربع دوم (اپریل-جون)" },
  { value: 3, label: "ربع سوم (جولای-سپتمبر)" },
  { value: 4, label: "ربع چلورم (اکتوبر-دسمبر)" },
];