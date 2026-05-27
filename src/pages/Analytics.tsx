import {
  useEffect,
  useState,
} from "react";

import {
  ref,
  onValue,
} from "firebase/database";

import { database } from "../services/firebase";

import AnalyticsOverviewCard from "../components/dashboard/AnalyticsOverviewCard";

import RealtimeLineCard from "../components/dashboard/RealtimeLineCard";

interface LineData {
  machineId: string;
  productCode: string;
  hourlyTarget: number;
}

interface CounterHistoryItem {
  Count: number;
  Time: string;
  Interval: number;
}

interface ChartDataItem {
  time: string;
  output: number;
  interval: number;
}

interface LineRealtimeData {
  current: number;
  status: string;
  chartData: ChartDataItem[];
}

export default function Analytics() {
  // =========================
  // STATES
  // =========================

  const [lines, setLines] =
    useState<
      Record<string, LineData>
    >({});

  const [lineRealtimeData, setLineRealtimeData] =
    useState<
      Record<
        string,
        LineRealtimeData
      >
    >({});

  const [selectedLine, setSelectedLine] =
    useState<string | null>(
      null
    );

  // =========================
  // LOAD LINES
  // =========================

  useEffect(() => {
    const linesRef = ref(
      database,
      "Lines"
    );

    const unsubscribe = onValue(
      linesRef,
      (snapshot) => {
        if (
          snapshot.exists()
        ) {
          setLines(
            snapshot.val()
          );
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================
  // LOAD MACHINE DATA
  // =========================

  useEffect(() => {
    const unsubscribers:
      (() => void)[] = [];

    Object.entries(lines).forEach(
      ([lineKey, line]) => {
        const machineId =
          line.machineId;

        // =========================
        // LIVE STATUS
        // =========================

        const liveRef = ref(
          database,
          `Machines/${machineId}/LiveStatus`
        );

        const unsubscribeLive =
          onValue(
            liveRef,
            (snapshot) => {
              const current =
                snapshot.exists()
                  ? snapshot.val()
                      .Count || 0
                  : 0;

              setLineRealtimeData(
                (
                  prev
                ) => ({
                  ...prev,

                  [lineKey]:
                    {
                      ...prev[
                        lineKey
                      ],

                      current,
                    },
                })
              );
            }
          );

        unsubscribers.push(
          unsubscribeLive
        );

        // =========================
        // HEARTBEAT
        // =========================

        const heartbeatRef = ref(
          database,
          `Machines/${machineId}/heartbeat`
        );

        const unsubscribeHeartbeat =
          onValue(
            heartbeatRef,
            (snapshot) => {
              let status =
                "offline";

              if (
                snapshot.exists()
              ) {
                const heartbeat =
                  snapshot.val();

                const now =
                  Math.floor(
                    Date.now() /
                      1000
                  );

                const difference =
                  now -
                  heartbeat;

                if (
                  difference <=
                  15
                ) {
                  status =
                    "online";
                }
              }

              setLineRealtimeData(
                (
                  prev
                ) => ({
                  ...prev,

                  [lineKey]:
                    {
                      ...prev[
                        lineKey
                      ],

                      status,
                    },
                })
              );
            }
          );

        unsubscribers.push(
          unsubscribeHeartbeat
        );

        // =========================
        // COUNTER HISTORY
        // =========================

        const historyRef = ref(
          database,
          `Machines/${machineId}/CounterHistory`
        );

        const unsubscribeHistory =
          onValue(
            historyRef,
            (snapshot) => {
              const chartData: ChartDataItem[] =
                [];

              if (
                snapshot.exists()
              ) {
                const history =
                  snapshot.val();

                Object.values(
                  history as Record<
                    string,
                    CounterHistoryItem
                  >
                )
                  .slice(-30)
                  .forEach(
                    (
                      item
                    ) => {
                      const time =
                        item.Time?.split(
                          " "
                        )[1] ||
                        "";

                      chartData.push(
                        {
                          time,

                          output:
                            item.Count ||
                            0,

                          interval:
                            Number(
                              item.Interval
                            ) ||
                            0,
                        }
                      );
                    }
                  );
              }

              setLineRealtimeData(
                (
                  prev
                ) => ({
                  ...prev,

                  [lineKey]:
                    {
                      ...prev[
                        lineKey
                      ],

                      chartData,
                    },
                })
              );
            }
          );

        unsubscribers.push(
          unsubscribeHistory
        );
      }
    );

    return () => {
      unsubscribers.forEach(
        (
          unsubscribe
        ) =>
          unsubscribe()
      );
    };
  }, [lines]);

  // =========================
  // SELECTED LINE
  // =========================

  const selectedLineData =
    selectedLine
      ? lines[selectedLine]
      : null;

  const selectedRealtime =
    selectedLine
      ? lineRealtimeData[
          selectedLine
        ]
      : null;

  // =========================
  // PAGE
  // =========================

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-6">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Production Analytics
        </h1>

        <p className="text-gray-500 mt-1">
          Realtime production
          monitoring and cycle
          analysis
        </p>
      </div>

      {/* ========================= */}
      {/* OVERVIEW CARDS */}
      {/* ========================= */}

      {!selectedLine && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(
            lines
          ).map(
            (
              [
                lineKey,
                line,
              ]
            ) => {
              const realtime =
                lineRealtimeData[
                  lineKey
                ];

              return (
                <AnalyticsOverviewCard
                  key={
                    lineKey
                  }
                  line={lineKey.replace(
                    "_",
                    " "
                  )}
                  product={
                    line.productCode
                  }
                  machine={
                    line.machineId
                  }
                  output={
                    realtime?.current ||
                    0
                  }
                  target={
                    line.hourlyTarget
                  }
                  status={
                    realtime?.status ||
                    "offline"
                  }
                  onClick={() =>
                    setSelectedLine(
                      lineKey
                    )
                  }
                />
              );
            }
          )}
        </div>
      )}

      {/* ========================= */}
      {/* DETAILED VIEW */}
      {/* ========================= */}

      {selectedLine &&
        selectedLineData &&
        selectedRealtime && (
          <div>
            {/* BACK BUTTON */}

            <button
              onClick={() =>
                setSelectedLine(
                  null
                )
              }
              className="mb-6 bg-gray-800 text-white px-5 py-2 rounded-xl hover:bg-black transition-all"
            >
              ← Back to Lines
            </button>

            {/* REALTIME CARD */}

            <RealtimeLineCard
              line={selectedLine.replace(
                "_",
                " "
              )}
              product={
                selectedLineData.productCode
              }
              machine={
                selectedLineData.machineId
              }
              target={
                selectedLineData.hourlyTarget
              }
              current={
                selectedRealtime.current
              }
              status={
                selectedRealtime.status
              }
              chartData={
                selectedRealtime.chartData
              }
            />
          </div>
        )}
    </div>
  );
}