import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

const ICONS = {
  error:   { icon: AlertCircle,   bg: "bg-red-50",    border: "border-red-200",   text: "text-red-700",   icon_cls: "text-red-500"   },
  warning: { icon: AlertCircle,   bg: "bg-amber-50",  border: "border-amber-200", text: "text-amber-700", icon_cls: "text-amber-500" },
  success: { icon: CheckCircle2,  bg: "bg-green-50",  border: "border-green-200", text: "text-green-700", icon_cls: "text-green-500" },
  info:    { icon: Info,          bg: "bg-indigo-50", border: "border-indigo-200",text: "text-indigo-700",icon_cls: "text-indigo-500"},
};

/**
 * Inline validation banner — shown inside a page.
 * Props: message (string), type ("error"|"warning"|"success"|"info"), onClose (optional)
 */
export function ValidationBanner({ message, type = "error", onClose, className = "" }) {
  if (!message) return null;
  const cfg = ICONS[type];
  const Icon = cfg.icon;
  return (
    <div className={`flex items-start gap-2 ${cfg.bg} border ${cfg.border} ${cfg.text} rounded-lg px-4 py-3 text-sm ${className}`}>
      <Icon size={16} className={`${cfg.icon_cls} flex-shrink-0 mt-0.5`} />
      <span className="flex-1 leading-snug">{message}</span>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 hover:opacity-70 transition-opacity">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

/**
 * Auto-dismissing toast notification — fixed top-center.
 * Props: message, type, duration (ms, default 3500), onDone callback
 */
export function Toast({ message, type = "error", duration = 3500, onDone }) {
  const [visible, setVisible] = useState(true);
  const cfg = ICONS[type];
  const Icon = cfg.icon;

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onDone?.(); }, duration);
    return () => clearTimeout(t);
  }, [duration, onDone]);

  if (!visible) return null;

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 ${cfg.bg} border ${cfg.border} ${cfg.text} rounded-xl px-5 py-3 shadow-lg text-sm font-medium max-w-sm w-full mx-4 animate-fade-in`}>
      <Icon size={16} className={`${cfg.icon_cls} flex-shrink-0`} />
      <span className="flex-1">{message}</span>
      <button onClick={() => { setVisible(false); onDone?.(); }} className="flex-shrink-0 hover:opacity-70">
        <X size={14} />
      </button>
    </div>
  );
}
