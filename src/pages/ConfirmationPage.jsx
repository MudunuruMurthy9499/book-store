import { CheckCircle2, ChevronRight, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// ── Purchased book mini-card ──────────────────────────────────────────────────
function PurchasedBookCard({ item, onNavigate }) {
  return (
    <div
      className="flex gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
      onClick={() => onNavigate(`/product/${item.id}`)}
    >
      {/* Cover */}
      <div
        className={`${item.cover} w-20 h-28 rounded-lg flex-shrink-0 flex flex-col items-center justify-center p-2 shadow-sm`}
      >
        <span className="text-white text-[8px] font-bold text-center leading-tight uppercase drop-shadow">
          {item.coverText}
        </span>
        <span className="text-white/80 text-[7px] text-center mt-1.5 uppercase tracking-wide">
          {item.coverSub}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-0.5">
        <h3 className="text-gray-900 text-sm font-semibold leading-tight group-hover:text-indigo-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-indigo-500 text-xs mt-0.5 hover:underline">
          by {item.author}
        </p>
        <p className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2">
          {item.description}
        </p>
        <p className="text-gray-400 text-xs mt-1">{item.format}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {item.tags.map((t) => (
            <span key={t} className="text-indigo-500 text-[10px] hover:underline cursor-pointer">
              {t}
            </span>
          ))}
        </div>
        <p className="text-gray-900 font-bold text-sm mt-2">₹{item.price * item.qty}</p>
        <p className="text-gray-400 text-[10px] mt-0.5">Delivery by {item.delivery}</p>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ConfirmationPage({ cart, clearCart }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar cartCount={0} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-2.5">
        <nav className="flex items-center gap-1 text-xs text-gray-400 flex-wrap">
          <button onClick={() => navigate("/")}        className="hover:text-indigo-600 transition-colors">Home</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate("/cart")}    className="hover:text-indigo-600 transition-colors">Cart</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate("/payment")} className="hover:text-indigo-600 transition-colors">Payment</button>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-medium">Confirmation</span>
        </nav>
      </div>

      {/* Progress steps */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3">
        <div className="max-w-screen-lg mx-auto flex items-center gap-3 text-xs">
          {[
            { label: "Cart",         done: true  },
            { label: "Payment",      done: true  },
            { label: "Confirmation", done: false, active: true },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              {i > 0 && <div className="w-8 h-px bg-gray-200" />}
              <div className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step.done   ? "bg-indigo-600 text-white" :
                  step.active ? "bg-indigo-100 text-indigo-600 ring-2 ring-indigo-300" :
                                "bg-gray-100 text-gray-400"
                }`}>
                  {step.done ? "✓" : i + 1}
                </div>
                <span className={`font-medium ${step.active ? "text-indigo-600" : "text-gray-700"}`}>
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-screen-md mx-auto">

          {/* ── Success card ───────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Header — green tick + message */}
            <div className="flex flex-col items-center pt-8 pb-6 px-6 border-b border-gray-100 bg-green-50">
              <div className="w-14 h-14 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center mb-4 shadow-sm">
                <CheckCircle2 size={30} className="text-green-500" strokeWidth={2.5} />
              </div>
              <h1 className="text-gray-900 text-base font-bold text-center leading-snug">
                Your purchase of the following reads is successful
              </h1>
              <p className="text-gray-400 text-xs mt-1.5">
                Order confirmed · A confirmation email has been sent.
              </p>
            </div>

            {/* Purchased books */}
            <div className="p-6">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No items found.</p>
              ) : (
                <div className={`grid gap-4 ${cart.length === 1 ? "grid-cols-1 max-w-sm mx-auto" : "grid-cols-1 sm:grid-cols-2"}`}>
                  {cart.map((item) => (
                    <PurchasedBookCard key={item.id} item={item} onNavigate={navigate} />
                  ))}
                </div>
              )}

              {/* CTA row */}
              <div className="border-t border-gray-100 mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-gray-400 text-xs text-center sm:text-left">
                  Thank you for shopping with Book Worm! 🎉
                </p>
                <button
                  onClick={() => { clearCart?.(); navigate("/"); }}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all shadow-sm"
                >
                  Continue Shopping
                  <ShoppingBag size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
