import {
  AlertCircle,
  BookOpen,
  ChevronRight,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import StarRating from "../components/StarRating";
import { ValidationBanner } from "../components/ValidationBanner";
import { allBooks, sampleReviews } from "../data/books";

export default function ProductDetailPage({ cart, setCart, wishlist = [], setWishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const book = allBooks.find((b) => b.id === Number(id));
  const relatedBooks = allBooks.filter(
    (b) => b.id !== book?.id && b.tags.some((t) => book?.tags.includes(t))
  ).slice(0, 4);

  // Review form state
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviews, setReviews] = useState(sampleReviews);
  const [reviewErrors, setReviewErrors] = useState({});
  const [addedToCart, setAddedToCart] = useState(false);
  const isWishlisted = wishlist.some((w) => w.id === book?.id);

  // Validation: user must click "Add to Cart" before going to cart
  const [cartError, setCartError] = useState("");

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar cartCount={cart.length} wishlist={wishlist} setWishlist={setWishlist} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Book not found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Add to Cart ──────────────────────────────────────────────────
  const handleAddToCart = () => {
    const alreadyIn = cart.some((c) => c.id === book.id);
    if (!alreadyIn) {
      setCart((prev) => [...prev, { ...book, qty: 1 }]);
    }
    setAddedToCart(true);
    setCartError("");
  };

  // ── Toggle Wishlist ───────────────────────────────────────────────
  const handleToggleWishlist = () => {
    if (!setWishlist) return;
    setWishlist((prev) =>
      prev.some((w) => w.id === book.id)
        ? prev.filter((w) => w.id !== book.id)
        : [...prev, book]
    );
  };

  // ── Proceed to Cart (Page 2) — blocked without adding ────────────
  const handleProceedToCart = () => {
    if (!addedToCart) {
      setCartError("Please add this book to your cart before proceeding.");
      return;
    }
    navigate("/cart");
  };

  // ── Review submit ─────────────────────────────────────────────────
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!reviewRating) errors.rating = "Please select a star rating.";
    if (!reviewText.trim()) errors.text = "Please write your review before submitting.";
    if (reviewText.trim().length < 10) errors.text = "Review must be at least 10 characters.";
    if (Object.keys(errors).length) {
      setReviewErrors(errors);
      return;
    }
    setReviews((prev) => [
      { id: Date.now(), name: "You", rating: reviewRating, text: reviewText.trim() },
      ...prev,
    ]);
    setReviewText("");
    setReviewRating(0);
    setReviewErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar cartCount={cart.length} wishlist={wishlist} setWishlist={setWishlist} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-2.5">
        <nav className="flex items-center gap-1 text-xs text-gray-400 flex-wrap">
          <button onClick={() => navigate("/")} className="hover:text-indigo-600 transition-colors">
            Home
          </button>
          <ChevronRight size={12} />
          {book.tags[0] && (
            <>
              <button
                onClick={() => navigate("/")}
                className="hover:text-indigo-600 transition-colors"
              >
                {book.tags[0]}
              </button>
              <ChevronRight size={12} />
            </>
          )}
          <span className="text-gray-700 font-medium">{book.title}</span>
        </nav>
      </div>

      <div className="flex-1 px-4 sm:px-6 py-6">
        <div className="max-w-screen-xl mx-auto flex gap-6 flex-col lg:flex-row">

          {/* ── Left: Book detail ───────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Top card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex gap-5 flex-col sm:flex-row">

                {/* Cover images */}
                <div className="flex gap-3 flex-shrink-0">
                  <div
                    className={`${book.cover} w-32 sm:w-40 h-48 sm:h-56 rounded-xl flex flex-col items-center justify-center p-3 shadow-md`}
                  >
                    <span className="text-white text-xs font-bold text-center leading-tight uppercase drop-shadow">
                      {book.coverText}
                    </span>
                    <span className="text-white/80 text-[9px] text-center mt-2 uppercase tracking-wide">
                      {book.coverSub}
                    </span>
                  </div>
                  {/* Second cover tile (quote excerpt) */}
                  <div className="hidden sm:flex w-28 h-56 bg-gray-100 rounded-xl flex-col items-center justify-center p-3 text-center border border-gray-200">
                    <span className="text-gray-500 text-[10px] italic leading-relaxed">
                      "Discover how less can truly be more."
                    </span>
                    <div className="mt-3 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-[8px] font-bold">Q</span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-gray-900 text-xl font-bold leading-tight">{book.title}</h1>
                  <p className="text-indigo-500 text-sm mt-1 hover:underline cursor-pointer">
                    by {book.author}
                  </p>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed line-clamp-3">
                    {book.description}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    Published by:{" "}
                    <span className="text-indigo-500 hover:underline cursor-pointer">
                      {book.publisher}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {book.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-indigo-500 text-xs hover:underline cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{book.format}</p>

                  {/* Price */}
                  <div className="mt-4">
                    <span className="text-gray-900 text-2xl font-bold">₹{book.price}</span>
                    <p className="text-gray-400 text-xs mt-0.5">Delivery by {book.delivery}</p>
                  </div>

                  {/* Cart error banner */}
                  {cartError && (
                    <ValidationBanner
                      message={cartError}
                      type="error"
                      className="mt-3"
                      onClose={() => setCartError("")}
                    />
                  )}

                  {/* Action buttons */}
                  <div className="mt-4 flex gap-3 flex-wrap">
                    <button
                      onClick={handleAddToCart}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm ${
                        addedToCart
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      <ShoppingCart size={15} />
                      {addedToCart ? "Added to Cart ✓" : "Add to Cart"}
                    </button>
                    <button
                      onClick={handleToggleWishlist}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        isWishlisted
                          ? "bg-pink-50 border-pink-300 text-pink-600 hover:bg-pink-100"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <Heart size={15} className={isWishlisted ? "fill-pink-500 text-pink-500" : ""} />
                      {isWishlisted ? "Wishlisted ♥" : "Add to Wishlist"}
                    </button>
                  </div>

                  {/* Proceed to cart */}
                  <button
                    onClick={handleProceedToCart}
                    className={`mt-3 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      addedToCart
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    }`}
                  >
                    Proceed to Cart
                    <ChevronRight size={15} />
                  </button>
                  {!addedToCart && (
                    <p className="text-xs text-gray-400 mt-1">
                      Add to cart first to proceed
                    </p>
                  )}
                </div>
              </div>

              {/* Meta row */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-6 text-xs text-gray-500">
                <div>
                  <span className="block text-gray-400 mb-0.5">Language</span>
                  <span className="text-indigo-500 font-medium">{book.language}</span>
                </div>
                <div>
                  <span className="block text-gray-400 mb-0.5">Rating</span>
                  <StarRating value={book.rating} size={13} />
                </div>
                <div>
                  <span className="block text-gray-400 mb-0.5">Sells</span>
                  <span className="text-gray-700 font-medium">{book.sells}</span>
                </div>
              </div>
            </div>

            {/* About the writer */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-gray-900 text-sm font-bold mb-3">About the writer</h2>
              <div className="flex gap-3 items-start">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User size={22} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-semibold">{book.author}</p>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">{book.authorBio}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-gray-900 text-sm font-bold mb-4">Reviews</h2>
              <div className="flex flex-col lg:flex-row gap-6">

                {/* Leave a review form */}
                <form onSubmit={handleReviewSubmit} className="flex-1 min-w-0 space-y-3" noValidate>
                  <label className="block text-xs text-gray-500 font-medium">
                    Leave Your Review
                  </label>

                  {/* Text area */}
                  <div>
                    <div className="relative">
                      <textarea
                        value={reviewText}
                        onChange={(e) => {
                          setReviewText(e.target.value);
                          if (reviewErrors.text) setReviewErrors((p) => ({ ...p, text: "" }));
                        }}
                        maxLength={100}
                        placeholder="Placeholder text"
                        rows={5}
                        className={`w-full border rounded-lg px-3 py-2 text-xs text-gray-700 placeholder-gray-300 resize-none focus:outline-none focus:ring-2 transition-colors ${
                          reviewErrors.text
                            ? "border-red-300 focus:ring-red-200 bg-red-50"
                            : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-400"
                        }`}
                      />
                      <span className="absolute bottom-2 right-3 text-[10px] text-gray-300">
                        {reviewText.length}/100
                      </span>
                    </div>
                    {reviewErrors.text && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={11} />
                        {reviewErrors.text}
                      </p>
                    )}
                  </div>

                  {/* Star picker + submit */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <StarRating
                        value={reviewRating}
                        onChange={(v) => {
                          setReviewRating(v);
                          if (reviewErrors.rating)
                            setReviewErrors((p) => ({ ...p, rating: "" }));
                        }}
                        size={18}
                      />
                      {reviewErrors.rating && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle size={11} />
                          {reviewErrors.rating}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all shadow-sm"
                    >
                      Submit <ChevronRight size={13} />
                    </button>
                  </div>
                </form>

                {/* Existing reviews */}
                <div className="flex-1 min-w-0 space-y-4 max-h-72 overflow-y-auto pr-1">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <p className="text-gray-900 text-xs font-semibold">{review.name}</p>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed">{review.text}</p>
                      <StarRating value={review.rating} size={12} className="mt-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Related Reads ─────────────────────────────────── */}
          <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0 space-y-3">
            <h2 className="text-gray-900 text-sm font-bold">Related Reads</h2>
            {relatedBooks.length === 0 && (
              <p className="text-gray-400 text-xs">No related books found.</p>
            )}
            {relatedBooks.map((rb) => (
              <div
                key={rb.id}
                onClick={() => navigate(`/product/${rb.id}`)}
                className="bg-white border border-gray-200 rounded-xl p-3 flex gap-3 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
              >
                <div
                  className={`${rb.cover} w-14 h-20 rounded-lg flex-shrink-0 flex flex-col items-center justify-center p-1.5 shadow-sm`}
                >
                  <span className="text-white text-[7px] font-bold text-center leading-tight uppercase">
                    {rb.coverText}
                  </span>
                  <span className="text-white/70 text-[6px] text-center mt-1 uppercase">
                    {rb.coverSub}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-xs font-semibold leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {rb.title}
                  </p>
                  <p className="text-indigo-500 text-[10px] mt-0.5">by {rb.author}</p>
                  <p className="text-gray-400 text-[10px] mt-1 line-clamp-2">{rb.description}</p>
                  <p className="text-gray-400 text-[10px] mt-1">{rb.format}</p>
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {rb.tags.map((t) => (
                      <span key={t} className="text-indigo-400 text-[9px]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-900 font-bold text-sm mt-1.5">₹{rb.price}</p>
                  <p className="text-gray-400 text-[10px]">Delivery by {rb.delivery}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
