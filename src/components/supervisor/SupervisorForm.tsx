import { useState } from "react";

import {
  ref,
  set,
} from "firebase/database";

import {
  Save,
  Package,
  Users,
  Target,
  Factory,
  Cpu,
} from "lucide-react";

import { database } from "../../services/firebase";

import LineSelector from "./LineSelector";
import MachineSelector from "./MachineSelector";

export default function SupervisorForm() {
  // =========================
  // STATES
  // =========================

  const [line, setLine] = useState("");

  const [machineId, setMachineId] =
    useState("");

  const [productCode, setProductCode] =
    useState("");

  const [plannedMembers, setPlannedMembers] =
    useState<number | "">("");

  const [hourlyTarget, setHourlyTarget] =
    useState<number | "">("");

  const [loading, setLoading] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setLine("");
    setMachineId("");
    setProductCode("");
    setPlannedMembers("");
    setHourlyTarget("");
  };

  // =========================
  // SAVE DATA
  // =========================

  const handleSave = async () => {
    if (
      !line ||
      !machineId ||
      !productCode ||
      !plannedMembers ||
      !hourlyTarget
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // SAVE LINE CONFIG
      // =========================

      await set(ref(database, `Lines/${line}`), {
        machineId,
        productCode,
        plannedMembers,
        hourlyTarget,
      });

      // =========================
      // ASSIGNMENT HISTORY
      // =========================

      const now = new Date();

      const timestamp =
        `${now.getFullYear()}-` +
        `${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-` +
        `${String(now.getDate()).padStart(
          2,
          "0"
        )}_` +
        `${String(now.getHours()).padStart(
          2,
          "0"
        )}-` +
        `${String(now.getMinutes()).padStart(
          2,
          "0"
        )}`;

      // =========================
      // SAVE CURRENT MACHINE
      // =========================

      await set(
        ref(
          database,
          `Assignments/${line}/currentMachine`
        ),
        machineId
      );

      // =========================
      // SAVE HISTORY
      // =========================

      await set(
        ref(
          database,
          `Assignments/${line}/history/${timestamp}`
        ),
        machineId
      );

      // =========================
      // SUCCESS
      // =========================

      setSuccessMessage(
        "Production setup saved successfully!"
      );

      resetForm();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);

      alert("Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-200">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-3 rounded-xl">
          <Factory className="text-blue-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Production Setup
          </h2>

          <p className="text-gray-500 text-sm">
            Configure production line settings
          </p>
        </div>
      </div>

      {/* SUCCESS */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-5">
          {successMessage}
        </div>
      )}

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* LINE */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Production Line
          </label>

          <LineSelector
            value={line}
            onChange={setLine}
          />
        </div>

        {/* MACHINE */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Machine
          </label>

          <div className="relative">
            <Cpu
              className="absolute left-3 top-3 text-gray-400 z-10"
              size={18}
            />

            <div className="pl-8">
              <MachineSelector
                value={machineId}
                onChange={setMachineId}
              />
            </div>
          </div>
        </div>

        {/* PRODUCT CODE */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Product Code
          </label>

          <div className="relative">
            <Package
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="032-10-126U"
              value={productCode}
              onChange={(e) =>
                setProductCode(e.target.value)
              }
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-3 pl-10 rounded-lg w-full"
            />
          </div>
        </div>

        {/* MEMBERS */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Planned Members
          </label>

          <div className="relative">
            <Users
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />

            <input
              type="number"
              placeholder="8"
              value={plannedMembers}
              onChange={(e) =>
                setPlannedMembers(
                  Number(e.target.value)
                )
              }
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-3 pl-10 rounded-lg w-full"
            />
          </div>
        </div>

        {/* TARGET */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Hourly Target
          </label>

          <div className="relative">
            <Target
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />

            <input
              type="number"
              placeholder="120"
              value={hourlyTarget}
              onChange={(e) =>
                setHourlyTarget(
                  Number(e.target.value)
                )
              }
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-3 pl-10 rounded-lg w-full"
            />
          </div>
        </div>
      </div>

      {/* BUTTON */}
      <div className="mt-8">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 w-full font-semibold disabled:opacity-50"
        >
          <Save size={18} />

          {loading
            ? "Saving..."
            : "Save Production Setup"}
        </button>
      </div>
    </div>
  );
}