import type { CounterHistoryItem } from "../types/production";

export function generateHourlyData(
  data: Record<string, CounterHistoryItem>,
  hours: string[]
) {
  const hourlyMap: Record<string, number> = {};

  hours.forEach((hour) => {
    hourlyMap[hour] = 0;
  });

  Object.values(data).forEach((item) => {
    const time = item.Time;

    if (!time) return;

    const timePart = time.split(" ")[1];

    if (!timePart) return;

    const hour = parseInt(
      timePart.split(":")[0]
    );

    if (hour >= 8 && hour < 20) {
      const nextHour = hour + 1;

      const key = `${String(hour).padStart(
        2,
        "0"
      )}:00-${String(nextHour).padStart(
        2,
        "0"
      )}:00`;

      hourlyMap[key] = item.Count;
    }
  });

  return hourlyMap;
}