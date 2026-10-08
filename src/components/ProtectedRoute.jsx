import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "./ValidationBanner";
import { useState } from "react";

/**
 * Wraps a page and redirects away if `condition` is false.
 * Shows a toast before redirecting.
 *
 * Props:
 *   condition  – boolean, if false → redirect
 *   redirectTo – path to send user to (default "/")
 *   message    – toast message shown before redirect
 *   children   – the protected page content
 */
export default function ProtectedRoute({ condition, redirectTo = "/", message, children }) {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(!condition);

  useEffect(() => {
    if (!condition) {
      const timer = setTimeout(() => navigate(redirectTo, { replace: true }), 2000);
      return () => clearTimeout(timer);
    }
  }, [condition, navigate, redirectTo]);

  if (!condition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {showToast && (
          <Toast
            message={message || "Access not allowed. Redirecting…"}
            type="warning"
            duration={2000}
            onDone={() => setShowToast(false)}
          />
        )}
      </div>
    );
  }

  return children;
}
