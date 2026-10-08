import { Heart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WishlistModal({ wishlist = [], setWishlist, onClose }) {
  const navigate = useNavigate();

  const handleRemove = (e, bookId) => {
    e.stopPropagation();
    setWishlist((prev) => prev.filter((w) => w.id !== bookId));
  };

  const handleBookClick = (bookId) => {
    onClose();
    navigate(`/product/${bookId}`);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-pink-500 fill-pink-500" />
            <h2 className="text-gray-900 font-bold text-base">My Wishlist</h2>
            {wishlist.length > 0 && (
              <span className="bg-pink-100 text-pink-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <Heart size={40} className="text-gray-200 mb-3" />
              <p className="text-gray-500 font-medium text-sm">Your wishlist is empty</p>
              <p className="text-gray-400 text-xs mt-1">
                Browse books and click "Add to Wishlist" to save them here.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {wishlist.map((book) => (
                <li
                  key={book.id}
                  onClick={() => handleBookClick(book.id)}
                  className="flex gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3 cursor-pointer hover:border-indigo-200 hover:shadow-sm transition-all group"
                >
                  {/* Cover */}
                  <div
                    className={`${book.cover} w-14 h-20 rounded-lg flex-shrink-0 flex flex-col items-center justify-center p-1.5 shadow-sm`}
                  >
                    <span className="text-white text-[7px] font-bold text-center leading-tight uppercase">
                      {book.coverText}
                    </span>
                    <span className="text-white/70 text-[6px] text-center mt-1 uppercase">
                      {book.coverSub}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-semibold leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {book.title}
                    </p>
                    <p className="text-indigo-500 text-xs mt-0.5">by {book.author}</p>
                    <p className="text-gray-900 font-bold text-sm mt-1.5">₹{book.price}</p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={(e) => handleRemove(e, book.id)}
                    className="text-gray-300 hover:text-pink-500 transition-colors flex-shrink-0 self-start mt-0.5"
                    aria-label={`Remove ${book.title} from wishlist`}
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
