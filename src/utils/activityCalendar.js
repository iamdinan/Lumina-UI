export function getMonths(year) {
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const firstDay = new Date(Date.UTC(year, monthIndex, 1));
    const leadingDays = (firstDay.getUTCDay() + 6) % 7;
    const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    const dates = Array.from({ length: leadingDays + daysInMonth }, (_, index) => {
      if (index < leadingDays) return null;
      const day = index - leadingDays + 1;
      return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    });

    return {
      label: firstDay.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
      dates,
    };
  });
}
