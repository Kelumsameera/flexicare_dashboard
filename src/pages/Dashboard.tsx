import {
  LayoutDashboard,
  Activity,
  Clock3,
  Target,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  ref,
  onValue,
} from "firebase/database";

import { database } from "../services/firebase";

import ProductionTable from "../components/dashboard/ProductionTable";

import LineCard from "../components/dashboard/LineCard";

interface LineData {
  machineId: string;
  productCode: string;
  plannedMembers: number;
  hourlyTarget: number;
}


export default function Dashboard() {
  const [lines, setLines] = useState<
    Record<string, LineData>
  >({});

  const [liveCounts, setLiveCounts] =
    useState<Record<string, number>>({});

  // =========================
  // FETCH LINES
  // =========================

  useEffect(() => {
    const linesRef = ref(
      database,
      "Lines"
    );

    const unsubscribe = onValue(
      linesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setLines(snapshot.val());
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================
  // FETCH LIVE COUNTS
  // =========================

  useEffect(() => {
    const machinesRef = ref(
      database,
      "Machines"
    );

    const unsubscribe = onValue(
      machinesRef,
      (snapshot) => {
        if (!snapshot.exists()) return;

        const machines = snapshot.val();

        const counts: Record<
          string,
          number
        > = {};

        Object.keys(machines).forEach(
          (machineId) => {
            counts[machineId] =
              machines[machineId]
                ?.LiveStatus?.Count || 0;
          }
        );

        setLiveCounts(counts);
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================
  // SUMMARY VALUES
  // =========================

  const totalLines =
    Object.keys(lines).length;

  const totalTarget = Object.values(
    lines
  ).reduce(
    (sum, line) =>
      sum + line.hourlyTarget,
    0
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-6">
      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <LayoutDashboard className="text-blue-600" />

            Production Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Real-time production monitoring system
          </p>
        </div>

        {/* LIVE STATUS */}

        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-medium flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

          Live Monitoring
        </div>
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* ACTIVE LINES */}

        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Active Lines
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {totalLines}
              </h2>
            </div>

            <div className="bg-blue-100 p-3 rounded-xl">
              <Activity className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* SHIFT */}

        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Current Shift
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                Day Shift
              </h2>
            </div>

            <div className="bg-orange-100 p-3 rounded-xl">
              <Clock3 className="text-orange-600" />
            </div>
          </div>
        </div>

        {/* TARGET */}

        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Total Target
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {totalTarget}
              </h2>
            </div>

            <div className="bg-green-100 p-3 rounded-xl">
              <Target className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= LINE CARDS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {Object.entries(lines).map(
          ([lineKey, line]) => (
            <LineCard
              key={lineKey}
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
              target={
                line.hourlyTarget
              }
              current={
                liveCounts[
                  line.machineId
                ] || 0
              }
            />
          )
        )}
      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* TABLE HEADER */}

        <div className="bg-[#1f2937] text-white px-6 py-4">
          <h2 className="text-xl font-semibold">
            Hourly Production
            Monitoring
          </h2>

          <p className="text-sm text-gray-300 mt-1">
            Real-time production
            tracking by line
          </p>
        </div>

        {/* TABLE */}

        <div className="p-4">
          <ProductionTable />
        </div>
      </div>
    </div>
  );
}