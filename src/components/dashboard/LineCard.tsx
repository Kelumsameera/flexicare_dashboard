interface LineCardProps {
  line: string;
  product: string;
  machine: string;
  target: number;
  current: number;
}

export default function LineCard({
  line,
  product,
  machine,
  target,
  current,
}: LineCardProps) {
  const percentage =
    target > 0
      ? Math.min(
          (current / target) * 100,
          100
        )
      : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {line}
        </h2>

        <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
          {machine}
        </span>
      </div>

      {/* PRODUCT */}
      <div className="mb-3">
        <p className="text-gray-500 text-sm">
          Product Code
        </p>

        <h3 className="font-semibold text-lg text-gray-800">
          {product}
        </h3>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-100 rounded-xl p-3">
          <p className="text-gray-500 text-sm">
            Target
          </p>

          <h3 className="text-2xl font-bold text-gray-800">
            {target}
          </h3>
        </div>

        <div className="bg-gray-100 rounded-xl p-3">
          <p className="text-gray-500 text-sm">
            Current
          </p>

          <h3 className="text-2xl font-bold text-gray-800">
            {current}
          </h3>
        </div>
      </div>

      {/* PROGRESS */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">
            Progress
          </span>

          <span className="font-semibold">
            {percentage.toFixed(0)}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}