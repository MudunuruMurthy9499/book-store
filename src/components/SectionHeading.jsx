/**
 * Reusable section heading with an optional "View All" link.
 * Props: title, onViewAll
 */
export default function SectionHeading({ title, onViewAll }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-gray-900 text-base font-bold tracking-tight">{title}</h2>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="text-indigo-600 text-xs font-medium hover:underline transition-colors"
        >
          View All →
        </button>
      )}
    </div>
  );
}
