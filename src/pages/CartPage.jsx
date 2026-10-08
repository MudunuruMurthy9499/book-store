import { AlertCircle, ChevronRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { ValidationBanner } from "../components/ValidationBanner";

// ── Saved address (mock) ──────────────────────────────────────────────────────
const SAVED_ADDRESS = {
  firstName: "John",
  lastName: "Smith",
  address: "42 Baker Street, Apt 3B",
  email: "john.smith@email.com",
  city: "Mumbai",
  pin: "400001",
  phone: "9876543210",
  state: "Maharashtra",
  country: "India",
};

// ── Field error helper ────────────────────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
      <AlertCircle size={11} className="flex-shrink-0" />
      {msg}
    </p>
  );
}

// ── Reusable input ────────────────────────────────────────────────────────────
function FormInput({ label, error, className = "", ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
      )}
      <input
        {...props}
        className={`w-full border rounded-lg px-3 py-2 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 transition-colors ${
          error
            ? "border-red-300 bg-red-50 focus:ring-red-200 text-red-700"
            : "border-gray-200 bg-white focus:ring-indigo-200 focus:border-indigo-400 text-gray-800"
        }`}
      />
      <FieldError msg={error} />
    </div>
  );
}

// ── Reusable select ───────────────────────────────────────────────────────────
function FormSelect({ label, error, children, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs text-gray-500 mb-1">{label}</label>}
      <select
        {...props}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors appearance-none ${
          error
            ? "border-red-300 bg-red-50 focus:ring-red-200 text-red-700"
            : "border-gray-200 bg-white focus:ring-indigo-200 focus:border-indigo-400 text-gray-800"
        }`}
      >
        {children}
      </select>
      <FieldError msg={error} />
    </div>
  );
}

// ── Address validation ────────────────────────────────────────────────────────
function validateAddress(f) {
  const e = {};
  if (!f.firstName.trim()) e.firstName = "First name is required.";
  if (!f.lastName.trim()) e.lastName = "Last name is required.";
  if (!f.address.trim()) e.address = "Address is required.";
  if (!f.email.trim()) e.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email.";
  if (!f.city.trim()) e.city = "City is required.";
  if (!f.pin.trim()) e.pin = "PIN code is required.";
  else if (!/^\d{6}$/.test(f.pin)) e.pin = "PIN must be 6 digits.";
  if (!f.phone.trim()) e.phone = "Phone number is required.";
  else if (!/^\d{10}$/.test(f.phone)) e.phone = "Enter a valid 10-digit number.";
  if (!f.state.trim()) e.state = "State is required.";
  if (!f.country.trim()) e.country = "Country is required.";
  return e;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CartPage({ cart, setCart, onCheckout }) {
  const navigate = useNavigate();

  // ── Quantity helpers ──────────────────────────────────────────────
  const updateQty = (id, delta) =>
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  const removeItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  // ── Address form state ────────────────────────────────────────────
  const [useSaved, setUseSaved] = useState(false);
  const [addr, setAddr] = useState({
    firstName: "", lastName: "", address: "", email: "",
    city: "", pin: "", phone: "", state: "", country: "India",
  });
  const [addrErrors, setAddrErrors] = useState({});

  const setField = (field) => (e) => {
    setAddr((prev) => ({ ...prev, [field]: e.target.value }));
    setAddrErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleUseSaved = (checked) => {
    setUseSaved(checked);
    if (checked) {
      setAddr(SAVED_ADDRESS);
      setAddrErrors({});
    } else {
      setAddr({ firstName: "", lastName: "", address: "", email: "", city: "", pin: "", phone: "", state: "", country: "India" });
    }
  };

  // ── Coupon / gift points ──────────────────────────────────────────
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = () => {
    if (!coupon.trim()) { setCouponError("Please enter a coupon code."); return; }
    if (coupon.trim().toUpperCase() === "BOOK10") {
      setCouponApplied(true); setCouponError("");
    } else {
      setCouponError("Invalid code. Try BOOK10."); setCouponApplied(false);
    }
  };

  // ── Totals ────────────────────────────────────────────────────────
  const itemCount  = cart.reduce((s, i) => s + i.qty, 0);
  const price      = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax        = Math.round(price * 0.12);          // 12 % GST
  const delivery   = price > 500 ? 0 : 49;
  const discount   = couponApplied ? Math.round(price * 0.1) : 0; // redeem gift points via coupon
  const total      = price + tax + delivery - discount;

  // ── Pay Now → validate address first ─────────────────────────────
  const handlePayNow = () => {
    if (cart.length === 0) return;
    const errors = validateAddress(addr);
    if (Object.keys(errors).length) {
      setAddrErrors(errors);
      // Scroll address section into view
      document.getElementById("address-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    onCheckout?.();
    navigate("/payment", { state: { total } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar cartCount={cart.length} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-2.5">
        <nav className="flex items-center gap-1 text-xs text-gray-400 flex-wrap">
          <button onClick={() => navigate("/")} className="hover:text-indigo-600 transition-colors">Home</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate("/")} className="hover:text-indigo-600 transition-colors">Non-Fiction</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate("/")} className="hover:text-indigo-600 transition-colors">Self Help</button>
          {cart[0] && (
            <>
              <ChevronRight size={12} />
              <button
                onClick={() => navigate(`/product/${cart[0].id}`)}
                className="hover:text-indigo-600 transition-colors"
              >
                {cart[0].title}
              </button>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-gray-700 font-medium">Checkout</span>
        </nav>
      </div>

      <div className="flex-1 px-4 sm:px-6 py-5">
        <div className="max-w-screen-xl mx-auto">

          <h1 className="text-gray-900 text-lg font-bold mb-5 flex items-center gap-2">
            <ShoppingCart size={18} className="text-indigo-600" />
            Shopping Cart
          </h1>

          {/* ── Empty state ─────────────────────────────────────────── */}
          {cart.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
              <ShoppingCart size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 text-base font-medium">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-1">
                Browse our catalogue and add books to get started.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-all shadow-sm"
              >
                Browse Catalogue
              </button>
            </div>
          ) : (
            <div className="flex flex-col xl:flex-row gap-5">

              {/* ══ LEFT COLUMN ══════════════════════════════════════ */}
              <div className="flex-1 min-w-0 space-y-5">

                {/* ── Cart items ─────────────────────────────────── */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                    {cart.map((item) => (
                      <div key={item.id} className="p-4 flex gap-4">
                        {/* Cover */}
                        <div
                          className={`${item.cover} w-24 sm:w-28 rounded-xl flex-shrink-0 flex flex-col items-center justify-center p-2 shadow-sm`}
                          style={{ minHeight: "8rem" }}
                        >
                          <span className="text-white text-[9px] font-bold text-center leading-tight uppercase drop-shadow">
                            {item.coverText}
                          </span>
                          <span className="text-white/70 text-[7px] text-center mt-1.5 uppercase tracking-wide">
                            {item.coverSub}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h3
                              className="text-gray-900 text-sm font-semibold leading-tight cursor-pointer hover:text-indigo-600 transition-colors"
                              onClick={() => navigate(`/product/${item.id}`)}
                            >
                              {item.title}
                            </h3>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-0.5"
                              aria-label="Remove"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <p className="text-indigo-500 text-xs mt-0.5 hover:underline cursor-pointer">
                            by {item.author}
                          </p>
                          <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">{item.format}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.tags.map((t) => (
                              <span key={t} className="text-indigo-500 text-[10px] hover:underline cursor-pointer">{t}</span>
                            ))}
                          </div>

                          <p className="text-gray-900 font-bold text-base mt-2">₹{item.price * item.qty}</p>
                          <p className="text-gray-400 text-[10px]">Delivery by {item.delivery}</p>

                          {/* Qty control */}
                          <div className="mt-2 flex items-center gap-1 border border-gray-200 rounded-lg w-fit overflow-hidden">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              disabled={item.qty <= 1}
                              className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                              aria-label="Decrease"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="px-3 text-sm font-medium text-gray-700 min-w-[2rem] text-center select-none">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
                              aria-label="Increase"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Address form ───────────────────────────────── */}
                <div id="address-section" className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <h2 className="text-gray-900 text-sm font-bold mb-4">Address</h2>

                  {/* Use saved address toggle */}
                  <label className="flex items-center gap-2 mb-4 cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={useSaved}
                      onChange={(e) => handleUseSaved(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 rounded"
                    />
                    <span className="text-sm text-gray-600">Use Saved Address</span>
                  </label>

                  <div className="space-y-3">
                    {/* Row 1: First / Last / Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <FormInput
                        label="First Name"
                        placeholder="First Name"
                        value={addr.firstName}
                        onChange={setField("firstName")}
                        error={addrErrors.firstName}
                        disabled={useSaved}
                      />
                      <FormInput
                        label="Last Name"
                        placeholder="Last Name"
                        value={addr.lastName}
                        onChange={setField("lastName")}
                        error={addrErrors.lastName}
                        disabled={useSaved}
                      />
                      <FormInput
                        label="Address"
                        placeholder="Address Line 2"
                        value={addr.address}
                        onChange={setField("address")}
                        error={addrErrors.address}
                        disabled={useSaved}
                      />
                    </div>

                    {/* Row 2: Email / City / PIN */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <FormInput
                        label="e-mail"
                        placeholder="e-mail"
                        type="email"
                        value={addr.email}
                        onChange={setField("email")}
                        error={addrErrors.email}
                        disabled={useSaved}
                      />
                      <FormInput
                        label="City"
                        placeholder="City"
                        value={addr.city}
                        onChange={setField("city")}
                        error={addrErrors.city}
                        disabled={useSaved}
                      />
                      <FormInput
                        label="Pin"
                        placeholder="000000"
                        value={addr.pin}
                        maxLength={6}
                        onChange={(e) => {
                          setAddr((p) => ({ ...p, pin: e.target.value.replace(/\D/g, "").slice(0, 6) }));
                          setAddrErrors((p) => ({ ...p, pin: "" }));
                        }}
                        error={addrErrors.pin}
                        disabled={useSaved}
                      />
                    </div>

                    {/* Row 3: Phone / State / Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Phone with +91 prefix */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
                        <div className={`flex border rounded-lg overflow-hidden focus-within:ring-2 transition-colors ${addrErrors.phone ? "border-red-300 focus-within:ring-red-200" : "border-gray-200 focus-within:ring-indigo-200"}`}>
                          <span className="px-3 py-2 text-sm text-gray-500 bg-gray-50 border-r border-gray-200 flex-shrink-0 select-none">
                            +91
                          </span>
                          <input
                            type="tel"
                            placeholder="12345678890"
                            value={addr.phone}
                            maxLength={10}
                            disabled={useSaved}
                            onChange={(e) => {
                              setAddr((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }));
                              setAddrErrors((p) => ({ ...p, phone: "" }));
                            }}
                            className="flex-1 px-3 py-2 text-sm bg-white placeholder-gray-300 focus:outline-none text-gray-800 disabled:bg-gray-50"
                          />
                        </div>
                        <FieldError msg={addrErrors.phone} />
                      </div>

                      <FormSelect
                        label="State"
                        value={addr.state}
                        onChange={setField("state")}
                        error={addrErrors.state}
                        disabled={useSaved}
                      >
                        <option value="">State</option>
                        {["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan", "West Bengal", "Uttar Pradesh", "Kerala", "Telangana"].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </FormSelect>

                      <FormSelect
                        label="Country"
                        value={addr.country}
                        onChange={setField("country")}
                        error={addrErrors.country}
                        disabled={useSaved}
                      >
                        <option value="">Country</option>
                        {["India", "United States", "United Kingdom", "Canada", "Australia", "Singapore"].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </FormSelect>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  ← Continue Shopping
                </button>
              </div>

              {/* ══ RIGHT COLUMN — Grand Total ════════════════════════ */}
              <div className="w-full xl:w-80 flex-shrink-0 space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Decorative illustration banner */}
                  <div className="h-36 bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 relative overflow-hidden flex items-center justify-center">
                    {/* Geometric decorative shapes */}
                    <div className="absolute top-3 left-6 w-10 h-10 border-2 border-white/20 rounded-sm rotate-12" />
                    <div className="absolute top-8 right-10 w-5 h-5 bg-amber-400/60 rounded-sm rotate-45" />
                    <div className="absolute bottom-4 left-10 w-6 h-6 bg-white/10 rounded rotate-6" />
                    <div className="absolute bottom-3 right-6 w-8 h-8 border-2 border-amber-300/40 rounded-sm -rotate-12" />
                    {/* Book icon cluster */}
                    <div className="flex items-end gap-2 z-10">
                      <div className="w-10 h-14 bg-amber-500 rounded-sm shadow-lg flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">BOOK</span>
                      </div>
                      <div className="w-8 h-10 bg-teal-400 rounded-sm shadow-md flex items-center justify-center mb-1">
                        <span className="text-white text-[7px] font-bold">READ</span>
                      </div>
                      <div className="w-12 h-16 bg-indigo-300 rounded-sm shadow-lg flex items-center justify-center -mb-1">
                        <span className="text-white text-[8px] font-bold">STORY</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h2 className="text-gray-900 text-sm font-bold">Grand Total</h2>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Price ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                        <span>₹{price}.00</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax</span>
                        <span>₹{tax}.00</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery Charges</span>
                        <span>{delivery === 0 ? <span className="text-green-600 font-medium">Free</span> : `₹${delivery}`}</span>
                      </div>
                    </div>

                    {/* Coupon — Redeem gift points */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => { setCoupon(e.target.value); setCouponError(""); }}
                        placeholder="Apply Coupon"
                        disabled={couponApplied}
                        className={`flex-1 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 transition-colors placeholder-gray-400 ${
                          couponError
                            ? "border-red-300 bg-red-50 focus:ring-red-200"
                            : couponApplied
                            ? "border-green-300 bg-green-50 text-green-700"
                            : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-400"
                        }`}
                      />
                      {!couponApplied ? (
                        <button
                          onClick={handleApplyCoupon}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all flex-shrink-0"
                        >
                          Apply
                        </button>
                      ) : (
                        <button
                          onClick={() => { setCouponApplied(false); setCoupon(""); }}
                          className="text-red-500 text-xs font-medium px-2 hover:underline flex-shrink-0"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                    {couponApplied && (
                      <p className="text-xs text-green-600 font-medium">✓ Gift points redeemed — 10% off!</p>
                    )}

                    {/* Discount row */}
                    {couponApplied && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>− ₹{discount}</span>
                      </div>
                    )}

                    {/* Divider + Total */}
                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                      <span className="text-gray-900 text-sm font-bold">Total Amount</span>
                      <span className="text-gray-900 text-base font-bold">₹{total}</span>
                    </div>

                    {/* Address error summary */}
                    {Object.keys(addrErrors).some((k) => addrErrors[k]) && (
                      <ValidationBanner
                        message="Please fill in all required delivery address fields before paying."
                        type="error"
                      />
                    )}

                    {/* Pay Now */}
                    <button
                      onClick={handlePayNow}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-semibold py-3 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      Pay Now
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-700 leading-relaxed">
                  📦 Orders placed before <strong>5 PM</strong> are dispatched the same day.
                  Free delivery on orders above ₹500.
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
