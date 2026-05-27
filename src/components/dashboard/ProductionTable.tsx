import {
  useEffect,
  useState,
} from "react";

import {
  ref,
  onValue,
} from "firebase/database";

import { database } from "../../services/firebase";

import type {
  CounterHistoryItem,
  TableRow,
  LineData,
} from "../../types/production";

import HourCell from "./HourCell";

const hours = [
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
];

export default function ProductionTable() {
  const [rows, setRows] = useState<
    TableRow[]
  >([]);

  useEffect(() => {
    // =========================
    // LISTEN TO LINES
    // =========================

    const linesRef = ref(
      database,
      "Lines"
    );

    const unsubscribe = onValue(
      linesRef,
      (linesSnapshot) => {
        if (!linesSnapshot.exists()) {
          setRows([]);
          return;
        }

        const lines =
          linesSnapshot.val() as Record<
            string,
            LineData
          >;

        // =========================
        // LISTEN TO MACHINES
        // =========================

        const machinesRef = ref(
          database,
          "Machines"
        );

        onValue(
          machinesRef,
          (machinesSnapshot) => {
            if (
              !machinesSnapshot.exists()
            ) {
              return;
            }

            const machines =
              machinesSnapshot.val();

            const tableRows: TableRow[] =
              [];

            // =========================
            // LOOP LINES
            // =========================

            Object.entries(lines).forEach(
              ([lineKey, line]) => {
                const machineId =
                  line.machineId;

                const history =
                  machines[
                    machineId
                  ]?.CounterHistory || {};

                // =========================
                // INITIALIZE HOURS
                // =========================

                const hourlyMap: Record<
                  string,
                  number
                > = {};

                hours.forEach((hour) => {
                  hourlyMap[hour] = 0;
                });

                // =========================
                // MAP COUNTS
                // =========================

                Object.values(
                  history as Record<
                    string,
                    CounterHistoryItem
                  >
                ).forEach((item) => {
                  const time =
                    item.Time;

                  if (!time) return;

                  const timePart =
                    time.split(
                      " "
                    )[1];

                  if (!timePart)
                    return;

                  const hour =
                    parseInt(
                      timePart.split(
                        ":"
                      )[0]
                    );

                  if (
                    hour >= 8 &&
                    hour < 20
                  ) {
                    const nextHour =
                      hour + 1;

                    const key =
                      `${String(
                        hour
                      ).padStart(
                        2,
                        "0"
                      )}:00-${String(
                        nextHour
                      ).padStart(
                        2,
                        "0"
                      )}:00`;

                    hourlyMap[key] =
                      item.Count;
                  }
                });

                // =========================
                // PUSH ROW
                // =========================

                tableRows.push({
                  assemblyLine:
                    lineKey.replace(
                      "_",
                      " "
                    ),

                  productCode:
                    line.productCode,

                  plannedMembers:
                    line.plannedMembers,

                  hourlyTarget:
                    line.hourlyTarget,

                  hourlyData:
                    hourlyMap,
                });
              }
            );

            setRows(tableRows);
          }
        );
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse border border-gray-300 w-full text-center">
        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <thead>
          <tr className="bg-[#dfe4d3]">
            <th className="border border-gray-300 p-2">
              Assembly
              <br />
              Line
            </th>

            <th className="border border-gray-300 p-2">
              Product
              <br />
              Code
            </th>

            <th className="border border-gray-300 p-2">
              Planned TM
              <br />
              Members
            </th>

            <th className="border border-gray-300 p-2">
              Hourly
              <br />
              Target
            </th>

            {hours.map((hour) => (
              <th
                key={hour}
                className="border border-gray-300 p-2 whitespace-nowrap"
              >
                {hour}
              </th>
            ))}
          </tr>
        </thead>

        {/* ========================= */}
        {/* BODY */}
        {/* ========================= */}

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-all duration-200"
            >
              {/* LINE */}

              <td className="border border-gray-300 p-2 font-semibold">
                {row.assemblyLine}
              </td>

              {/* PRODUCT */}

              <td className="border border-gray-300 p-2">
                {row.productCode}
              </td>

              {/* MEMBERS */}

              <td className="border border-gray-300 p-2">
                {row.plannedMembers}
              </td>

              {/* TARGET */}

              <td className="border border-gray-300 p-2 font-semibold">
                {row.hourlyTarget}
              </td>

              {/* HOURS */}

              {hours.map((hour) => (
                <HourCell
                  key={hour}
                  value={
                    row.hourlyData[
                      hour
                    ] || 0
                  }
                  target={
                    row.hourlyTarget
                  }
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}