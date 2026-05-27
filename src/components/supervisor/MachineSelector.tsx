interface MachineSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const machines = [
  "Machine_01",
  "Machine_02",
  "Machine_03",
  "Machine_04",
  "Machine_05",
];

export default function MachineSelector({
  value,
  onChange,
}: MachineSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-3 rounded-lg w-full"
    >
      <option value="">
        Select Machine
      </option>

      {machines.map((machine) => (
        <option
          key={machine}
          value={machine}
        >
          {machine}
        </option>
      ))}
    </select>
  );
}