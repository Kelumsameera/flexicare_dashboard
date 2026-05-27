interface HourCellProps {
  value: number;
  target: number;
}

export default function HourCell({
  value,
  target,
}: HourCellProps) {
  const percentage =
    target > 0
      ? (value / target) * 100
      : 0;

  const bgColor =
    percentage >= 100
      ? "bg-green-200 text-green-900"
      : percentage >= 70
      ? "bg-yellow-200 text-yellow-900"
      : "bg-red-200 text-red-900";

  return (
    <td
      className={`border border-gray-300 p-2 font-semibold transition-all duration-300 ${bgColor}`}
    >
      <div className="flex flex-col items-center">
        <span>{value}</span>

        <span className="text-xs opacity-70">
          {percentage.toFixed(0)}%
        </span>
      </div>
    </td>
  );
}