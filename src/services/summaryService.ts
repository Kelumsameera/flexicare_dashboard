import {
  ref,
  get,
  set,
} from "firebase/database";

import { database } from "./firebase";

import type {
    CounterHistoryItem,
    LineData,
} from "../types/production";

import { hours } from "../utils/timeHelpers";

// =======================================
// GENERATE DAILY PRODUCTION SUMMARY
// =======================================

export async function generateProductionSummary() {
  try {
    // =========================
    // GET ALL LINES
    // =========================

    const linesSnapshot = await get(
      ref(database, "Lines")
    );

    if (!linesSnapshot.exists()) {
      return;
    }

    const lines =
      linesSnapshot.val() as Record<
        string,
        LineData
      >;

    // =========================
    // LOOP LINES
    // =========================

    for (const lineKey in lines) {
      const line = lines[lineKey];

      // =========================
      // GET MACHINE HISTORY
      // =========================

      const historySnapshot = await get(
        ref(
          database,
          `Machines/${line.machineId}/CounterHistory`
        )
      );

      if (!historySnapshot.exists()) {
        continue;
      }

      const history =
        historySnapshot.val() as Record<
          string,
          CounterHistoryItem
        >;

      // =========================
      // GROUP COUNTS
      // =========================

      const hourlySummary: Record<
        string,
        number
      > = {};

      hours.forEach((hour) => {
        hourlySummary[hour] = 0;
      });

      Object.values(history).forEach(
        (item) => {
          const time = item.Time;

          if (!time) return;

          const timePart =
            time.split(" ")[1];

          if (!timePart) return;

          const hour = parseInt(
            timePart.split(":")[0]
          );

          if (hour >= 8 && hour < 20) {
            const nextHour = hour + 1;

            const key = `${String(
              hour
            ).padStart(
              2,
              "0"
            )}:00-${String(
              nextHour
            ).padStart(2, "0")}:00`;

            hourlySummary[key] =
              item.Count;
          }
        }
      );

      // =========================
      // DATE
      // =========================

      const today = new Date();

      const dateKey =
        `${today.getFullYear()}-` +
        `${String(
          today.getMonth() + 1
        ).padStart(2, "0")}-` +
        `${String(
          today.getDate()
        ).padStart(2, "0")}`;

      // =========================
      // SAVE SUMMARY
      // =========================

      for (const hourKey in hourlySummary) {
        await set(
          ref(
            database,
            `ProductionSummary/${lineKey}/${dateKey}/${hourKey}`
          ),
          {
            count:
              hourlySummary[hourKey],

            target:
              line.hourlyTarget,

            productCode:
              line.productCode,

            machineId:
              line.machineId,

            plannedMembers:
              line.plannedMembers,
          }
        );
      }
    }

    console.log(
      "Production Summary Generated"
    );
  } catch (error) {
    console.error(
      "Summary Error:",
      error
    );
  }
}