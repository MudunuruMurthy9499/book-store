import {
  AlertCircle,
  CreditCard,
  Landmark,
  Smartphone,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatCardNumber = (val) =>
  val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1-").replace(/-$/, "");

const formatExpiry = (val) => {
  const d = val.replace(/\D/g, "").slice(0, 4);
  return d.length <= 2 ? d : d.slice(0, 2) + "/" + d.slice(2);
};

// ── Payment methods ───────────────────────────────────────────────────────────
const METHODS = [
  { id: "credit",     label: "Credit Card",  icon: CreditCard },
  { id: "debit",      label: "Debit Card",   icon: CreditCard },
  { id: "upi",        label: "UPI",          icon: Smartphone },
  { id: "wallet",     label: "Wallet",       icon: Wallet     },
  { id: "netbanking", label: "Net Banking",  icon: Landmark   },
];

// ── Validators ────────────────────────────────────────────────────────────────
function validateCard({ cardNumber, nameOnCard, cvv, expiry }) {
  const e = {};
  const digits = cardNumber.replace(/-/g, "");
  if (!digits)                 e.cardNumber = "Card number is required.";
  else if (digits.length < 16) e.cardNumber = "Must be 16 digits.";
  if (!nameOnCard.trim())      e.nameOnCard = "Name is required.";
  else if (!/^[a-zA-Z\s]+$/.test(nameOnCard)) e.nameOnCard = "Letters only.";
  if (!cvv)                    e.cvv = "CVV required.";
  else if (!/^\d{3,4}$/.test(cvv)) e.cvv = "3 or 4 digits.";
  if (!expiry)                 e.expiry = "Expiry required.";
  else {
    const [mm, yy] = expiry.split("/");
    const m = parseInt(mm, 10), y = parseInt("20" + yy, 10);
    const now = new Date();
    if (!mm || !yy || yy.length < 2)  e.expiry = "Use MM/YY format.";
    else if (m < 1 || m > 12)          e.expiry = "Invalid month.";
    else if (y < now.getFullYear() || (y === now.getFullYear() && m < now.getMonth() + 1))
      e.expiry = "Card expired.";
  }
  return e;
}
const validateUPI        = ({ upiId })                    => (!upiId.trim() ? { upiId: "UPI ID required." } : !/^[\w.\-_]+@[\w]+$/.test(upiId) ? { upiId: "Invalid UPI ID (e.g. name@upi)." } : {});
const validateWallet     = ({ walletPhone, walletProvider }) => ({ ...(!/^\d{10}$/.test(walletPhone) ? { walletPhone: "Enter 10-digit number." } : {}), ...(!walletProvider ? { walletProvider: "Select a wallet." } : {}) });
const validateNetBanking = ({ bank })                     => (!bank ? { bank: "Select a bank." } : {});

// ── Reusable light-theme field error ─────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
      <AlertCircle size={11} className="flex-shrink-0" />{msg}
    </p>
  );
}

// ── Reusable light input ──────────────────────────────────────────────────────
function FormInput({ label, error, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>}
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

// ── Reusable light select ─────────────────────────────────────────────────────
function FormSelect({ label, error, children, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>}
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

// ── Main Component ────────────────────────────────────────────────────────────
export default function PaymentPage({ cart, onPaymentSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();

  const passedTotal = location.state?.total;
  const subtotal    = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery    = subtotal > 500 ? 0 : 49;
  const payable     = passedTotal ?? subtotal + delivery;

  const [method, setMethod] = useState("credit");
  const [errors, setErrors] = useState({});

  // Card
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cvv,        setCvv]        = useState("");
  const [expiry,     setExpiry]     = useState("");
  // UPI
  const [upiId, setUpiId] = useState("");
  // Wallet
  const [walletProvider, setWalletProvider] = useState("");
  const [walletPhone,    setWalletPhone]    = useState("");
  // Net Banking
  const [bank, setBank] = useState("");

  const clear = (f) => setErrors((p) => ({ ...p, [f]: "" }));

  const handlePay = (e) => {
    e.preventDefault();
    let errs = {};
    if      (method === "credit" || method === "debit") errs = validateCard({ cardNumber, nameOnCard, cvv, expiry });
    else if (method === "upi")        errs = validateUPI({ upiId });
    else if (method === "wallet")     errs = validateWallet({ walletPhone, walletProvider });
    else if (method === "netbanking") errs = validateNetBanking({ bank });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onPaymentSuccess?.();
    navigate("/confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar cartCount={cart.length} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-2.5">
        <nav className="flex items-center gap-1 text-xs text-gray-400 flex-wrap">
          <button onClick={() => navigate("/")}     className="hover:text-indigo-600 transition-colors">Home</button>
          <CreditCard size={10} className="text-gray-300" />
          <button onClick={() => navigate("/cart")} className="hover:text-indigo-600 transition-colors">Shopping Cart</button>
          <CreditCard size={10} className="text-gray-300" />
          <span className="text-gray-700 font-medium">Payment</span>
        </nav>
      </div>

      {/* Progress steps */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3">
        <div className="max-w-screen-lg mx-auto flex items-center gap-3 text-xs">
          {[
            { label: "Cart",         done: true  },
            { label: "Payment",      done: false, active: true },
            { label: "Confirmation", done: false },
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
                <span className={`font-medium ${step.active ? "text-indigo-600" : step.done ? "text-gray-700" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 py-8">
        <div className="max-w-screen-lg mx-auto flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Payment panel ──────────────────────────────────────── */}
          <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h1 className="text-gray-900 text-base font-bold">Complete Payment</h1>
              <span className="text-gray-600 text-sm font-medium">
                Payable Amount:{" "}
                <span className="text-indigo-600 text-base font-bold">₹{payable}</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row">
              {/* ── Method sidebar ──────────────────────────────── */}
              <div className="sm:w-44 border-b sm:border-b-0 sm:border-r border-gray-100 flex sm:flex-col overflow-x-auto sm:overflow-visible bg-gray-50">
                {METHODS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => { setMethod(id); setErrors({}); }}
                    className={`flex items-center gap-2 px-4 py-3.5 text-sm whitespace-nowrap text-left w-full transition-colors ${
                      method === id
                        ? "bg-white text-indigo-700 font-semibold border-r-2 border-indigo-600 shadow-sm"
                        : "text-gray-500 hover:bg-white hover:text-gray-800"
                    }`}
                  >
                    <Icon size={14} className="flex-shrink-0" />
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Form area ───────────────────────────────────── */}
              <form onSubmit={handlePay} className="flex-1 p-6 space-y-4" noValidate>

                {/* Credit / Debit Card */}
                {(method === "credit" || method === "debit") && (
                  <>
                    <FormInput
                      label="Card Number"
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      value={cardNumber}
                      error={errors.cardNumber}
                      onChange={(e) => { setCardNumber(formatCardNumber(e.target.value)); clear("cardNumber"); }}
                    />
                    <FormInput
                      label="Name on Card"
                      placeholder="Name"
                      value={nameOnCard}
                      error={errors.nameOnCard}
                      onChange={(e) => { setNameOnCard(e.target.value); clear("nameOnCard"); }}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="CVV"
                        placeholder="XXX"
                        value={cvv}
                        maxLength={4}
                        error={errors.cvv}
                        onChange={(e) => { setCvv(e.target.value.replace(/\D/g, "").slice(0, 4)); clear("cvv"); }}
                      />
                      <FormInput
                        label="Date of Expiry"
                        placeholder="MM/YY"
                        value={expiry}
                        error={errors.expiry}
                        onChange={(e) => { setExpiry(formatExpiry(e.target.value)); clear("expiry"); }}
                      />
                    </div>
                  </>
                )}

                {/* UPI */}
                {method === "upi" && (
                  <FormInput
                    label="UPI ID"
                    placeholder="yourname@upi"
                    value={upiId}
                    error={errors.upiId}
                    onChange={(e) => { setUpiId(e.target.value.trim()); clear("upiId"); }}
                  />
                )}

                {/* Wallet */}
                {method === "wallet" && (
                  <>
                    <FormSelect
                      label="Wallet Provider"
                      value={walletProvider}
                      error={errors.walletProvider}
                      onChange={(e) => { setWalletProvider(e.target.value); clear("walletProvider"); }}
                    >
                      <option value="">Select Provider</option>
                      {["Paytm", "PhonePe", "Amazon Pay", "Mobikwik", "Freecharge"].map((w) => (
                        <option key={w}>{w}</option>
                      ))}
                    </FormSelect>
                    <FormInput
                      label="Registered Mobile Number"
                      placeholder="10-digit number"
                      value={walletPhone}
                      error={errors.walletPhone}
                      onChange={(e) => { setWalletPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); clear("walletPhone"); }}
                    />
                  </>
                )}

                {/* Net Banking */}
                {method === "netbanking" && (
                  <FormSelect
                    label="Select Bank"
                    value={bank}
                    error={errors.bank}
                    onChange={(e) => { setBank(e.target.value); clear("bank"); }}
                  >
                    <option value="">Select Bank</option>
                    {["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank", "Yes Bank", "PNB"].map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </FormSelect>
                )}

                {/* Pay Now */}
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-semibold py-3 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
                >
                  <CreditCard size={15} />
                  Pay Now  ₹{payable}
                </button>

                <p className="text-[11px] text-gray-400 text-center">
                  🔒 Payments are 256-bit encrypted and secure
                </p>
              </form>
            </div>
          </div>

          {/* ── Order summary sidebar ─────────────────────────────── */}
          <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-gray-900 text-sm font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <div className={`${item.cover} w-9 h-12 rounded flex-shrink-0 flex items-center justify-center p-1`}>
                      <span className="text-white text-[6px] font-bold text-center leading-tight uppercase">
                        {item.coverText}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-xs font-medium leading-tight line-clamp-1">{item.title}</p>
                      <p className="text-gray-400 text-[10px]">Qty: {item.qty}</p>
                    </div>
                    <span className="text-gray-900 text-xs font-semibold flex-shrink-0">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span>{delivery === 0 ? <span className="text-green-600">Free</span> : `₹${delivery}`}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100 mt-1">
                  <span>Total</span><span>₹{payable}</span>
                </div>
              </div>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-700 leading-relaxed">
              🔒 Your payment details are protected with 256-bit SSL encryption.
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
