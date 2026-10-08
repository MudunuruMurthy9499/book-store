import { ChevronDown } from "lucide-react";

/**
 * Reusable labelled dropdown for filter bars.
 * Props: label, value, onChange, options (string[])
 */
export default function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-1.5">
      {label && (
        <span className="text-gray-500 text-xs font-medium whitespace-nowrap hidden sm:inline">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 text-gray-700 text-xs rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 cursor-pointer hover:border-gray-300 transition-colors"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={12}
        />
      </div>
    </div>
  );
}
