interface AnalyticsOverviewCardProps {
  line: string;
  product: string;
  machine: string;
  output: number;
  target: number;
  status: string;

  onClick: () => void;
}

export default function AnalyticsOverviewCard({
  line,
  product,
  machine,
  output,
  target,
  status,
  onClick,
}: AnalyticsOverviewCardProps) {
  const efficiency =
    target > 0
      ? (
          (output / target) *
          100
        ).toFixed(0)
      : "0";

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-left w-full"
    >
      {/* HEADER */}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {line}
          </h2>

          <p className="text-sm text-gray-500">
            {product}
          </p>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            status === "online"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </div>
      </div>

      {/* INFO */}

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500">
            Machine
          </span>

          <span className="font-semibold">
            {machine}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Output
          </span>

          <span className="font-semibold text-blue-600">
            {output}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Target
          </span>

          <span className="font-semibold text-green-600">
            {target}
          </span>
        </div>
      </div>

      {/* PROGRESS */}

      <div>
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-500">
            Efficiency
          </span>

          <span className="font-semibold">
            {efficiency}%
          </span>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-3 bg-blue-500 rounded-full"
            style={{
              width: `${Math.min(
                Number(
                  efficiency
                ),
                100
              )}%`,
            }}
          ></div>
        </div>
      </div>
    </button>
  );
}