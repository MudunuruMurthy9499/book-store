import { Star } from "lucide-react";

/**
 * Reusable star rating display or interactive picker.
 * Props:
 *   value       – current rating (0–5)
 *   onChange    – if provided, renders interactive stars
 *   size        – icon size (default 16)
 *   className   – extra wrapper classes
 */
export default function StarRating({ value = 0, onChange, size = 16, className = "" }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onChange}
          onClick={() => onChange && onChange(star)}
          className={`transition-transform ${onChange ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            className={
              star <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }
          />
        </button>
      ))}
    </div>
  );
}
