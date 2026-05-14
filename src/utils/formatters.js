export function formatNumber(value, suffix = "") {
  if (value === null || value === undefined || value === "") return "-";
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  return `${num}${suffix}`;
}

export function formatDateShort(isoDate) {
  if (!isoDate) return "-";
  // Keep it simple and course-safe: show YYYY-MM-DD
  return isoDate;
}
