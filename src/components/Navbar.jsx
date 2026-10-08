import { BookOpen, Heart, Menu, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WishlistModal from "./WishlistModal";
import { Toast } from "./ValidationBanner";

export default function Navbar({ cartCount = 0, wishlist = [], setWishlist }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emptyCartToast, setEmptyCartToast] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const navigate = useNavigate();

  const handleCartClick = () => {
    if (cartCount === 0) {
      setEmptyCartToast(true);
    } else {
      navigate("/cart");
    }
  };

  const handleNavLink = (link) => {
    if (link === "My Wishlist") {
      setWishlistOpen(true);
      setMobileMenuOpen(false);
    } else {
      navigate("/");
      setMobileMenuOpen(false);
    }
  };

  const navLinks = ["My Wishlist", "My Writers"];

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        {/* Empty-cart toast */}
        {emptyCartToast && (
          <Toast
            message="Your cart is empty. Browse books and add one to get started."
            type="warning"
            duration={3000}
            onDone={() => setEmptyCartToast(false)}
          />
        )}

        <div className="px-4 sm:px-6 py-3 flex items-center gap-4">
          {/* Logo — click to go home */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <BookOpen size={22} className="text-indigo-600" />
            <span className="text-gray-900 font-bold text-base tracking-tight">Book Worm</span>
          </button>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-6 flex-1 ml-4">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => handleNavLink(link)}
                className="relative text-gray-500 text-sm font-medium hover:text-indigo-600 transition-colors"
              >
                {link}
                {link === "My Wishlist" && wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Wishlist icon (mobile shortcut) */}
            <button
              className="relative text-gray-500 hover:text-pink-500 transition-colors p-1 md:hidden"
              onClick={() => setWishlistOpen(true)}
              aria-label={`Wishlist (${wishlist.length} items)`}
            >
              <Heart size={20} className={wishlist.length > 0 ? "fill-pink-400 text-pink-400" : ""} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart icon with validation */}
            <button
              className="relative text-gray-500 hover:text-indigo-600 transition-colors p-1"
              onClick={handleCartClick}
              aria-label={cartCount > 0 ? `Cart (${cartCount} items)` : "Cart is empty"}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button className="hidden sm:flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors p-1">
              <User size={20} />
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-gray-500 hover:text-indigo-600 transition-colors p-1"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-3">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => handleNavLink(link)}
                className="flex items-center justify-between w-full text-left py-2.5 text-sm text-gray-600 hover:text-indigo-600 border-b border-gray-50 last:border-0 transition-colors"
              >
                {link}
                {link === "My Wishlist" && wishlist.length > 0 && (
                  <span className="bg-pink-100 text-pink-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={handleCartClick}
              className="block w-full text-left py-2.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Cart {cartCount > 0 ? `(${cartCount})` : "(empty)"}
            </button>
          </div>
        )}
      </nav>

      {/* Wishlist slide-in panel */}
      {wishlistOpen && (
        <WishlistModal
          wishlist={wishlist}
          setWishlist={setWishlist}
          onClose={() => setWishlistOpen(false)}
        />
      )}
    </>
  );
}
