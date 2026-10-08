import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import CartPage from "./pages/CartPage";
import CataloguePage from "./pages/CataloguePage";
import ConfirmationPage from "./pages/ConfirmationPage";
import PaymentPage from "./pages/PaymentPage";
import ProductDetailPage from "./pages/ProductDetailPage";

export default function App() {
  const [cart, setCart]               = useState([]);
  const [wishlist, setWishlist]       = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  return (
    <BrowserRouter>
      <Routes>

        {/* ── Catalogue — always accessible ── */}
        <Route path="/" element={<CataloguePage cart={cart} wishlist={wishlist} setWishlist={setWishlist} />} />
        <Route path="/catalogue" element={<CataloguePage cart={cart} wishlist={wishlist} setWishlist={setWishlist} />} />

        {/* ── Product Detail — always accessible ── */}
        <Route
          path="/product/:id"
          element={<ProductDetailPage cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />}
        />

        {/* ── Cart — requires at least one item in cart ── */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute
              condition={cart.length > 0}
              redirectTo="/"
              message="Your cart is empty. Please add a book before proceeding to checkout."
            >
              <CartPage
                cart={cart}
                setCart={setCart}
                onCheckout={() => setOrderPlaced(true)}
              />
            </ProtectedRoute>
          }
        />

        {/* ── Payment — requires cart to have items ── */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute
              condition={cart.length > 0}
              redirectTo="/cart"
              message="No items found. Add books to your cart first."
            >
              <PaymentPage
                cart={cart}
                onPaymentSuccess={() => setOrderPlaced(true)}
              />
            </ProtectedRoute>
          }
        />

        {/* ── Confirmation — requires order to have been placed ── */}
        <Route
          path="/confirmation"
          element={
            <ProtectedRoute
              condition={orderPlaced}
              redirectTo="/"
              message="No completed order found. Please complete your purchase first."
            >
              <ConfirmationPage cart={cart} clearCart={() => setCart([])} />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
