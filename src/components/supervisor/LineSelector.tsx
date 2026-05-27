interface LineSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const lines = [
  "Line_01",
  "Line_02",
  "Line_03",
  "Line_04",
];

export default function LineSelector({
  value,
  onChange,
}: LineSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded w-full"
    >
      <option value="">
        Select Line
      </option>

      {lines.map((line) => (
        <option
          key={line}
          value={line}
        >
          {line}
        </option>
      ))}
    </select>
  );
}