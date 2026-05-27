import SupervisorForm from "../components/supervisor/SupervisorForm";

export default function Supervisor() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] p-6">
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Supervisor Panel
        </h1>

        <p className="text-gray-500 mt-1">
          Manage production lines, targets, and product assignments.
        </p>
      </div>

      {/* FORM */}
      <SupervisorForm />
    </div>
  );
}