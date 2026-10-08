import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BookCard({ book, onAddToCart }) {
  const navigate = useNavigate();

  return (
    <div
      className="flex gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
      onClick={() => navigate(`/product/${book.id}`)}
    >
      {/* Book Cover */}
      <div
        className={`${book.cover} w-20 h-28 rounded-lg flex-shrink-0 flex flex-col items-center justify-center p-2 overflow-hidden shadow-sm`}
      >
        <span className="text-white text-[8px] font-bold text-center leading-tight uppercase drop-shadow">
          {book.coverText}
        </span>
        <span className="text-white/80 text-[7px] text-center mt-1.5 uppercase tracking-wide">
          {book.coverSub}
        </span>
      </div>

      {/* Book Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="text-gray-900 text-sm font-semibold leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {book.title}
        </h3>
        <span className="text-indigo-500 text-xs mt-0.5">{book.author}</span>
        <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
          {book.description}
        </p>
        <span className="text-gray-400 text-xs mt-1">{book.format}</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {book.tags.map((tag) => (
            <span key={tag} className="text-indigo-500 text-[10px]">
              {tag}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <span className="text-gray-900 font-bold text-base">₹{book.price}</span>
            <p className="text-gray-400 text-[10px] mt-0.5">Delivery by {book.delivery}</p>
          </div>
          <button
            className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
            onClick={(e) => {
              e.stopPropagation(); // Don't navigate on Add click
              onAddToCart && onAddToCart(book);
              navigate(`/product/${book.id}`);
            }}
          >
            <ShoppingCart size={12} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
