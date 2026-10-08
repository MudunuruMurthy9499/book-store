import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import BookCard from "../components/BookCard";
import FilterSelect from "../components/FilterSelect";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SectionHeading from "../components/SectionHeading";
import { bestsellers, categories, newLaunches, recommendedBooks } from "../data/books";

export default function CataloguePage({ cart = [], wishlist = [], setWishlist }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("All");
  const [format, setFormat] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("Relevance");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Price range helper ────────────────────────────────────────────
  const matchesPrice = (price) => {
    switch (priceRange) {
      case "Under ₹100":    return price < 100;
      case "₹100–₹300":    return price >= 100 && price <= 300;
      case "₹300–₹500":    return price > 300 && price <= 500;
      case "Above ₹500":   return price > 500;
      default:              return true; // "All"
    }
  };

  // ── Sort helper ───────────────────────────────────────────────────
  const sortBooks = (books) => {
    const copy = [...books];
    switch (sortBy) {
      case "Price: Low to High":  return copy.sort((a, b) => a.price - b.price);
      case "Price: High to Low":  return copy.sort((a, b) => b.price - a.price);
      case "Newest First":        return copy.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
      default:                    return copy; // "Relevance" — keep original order
    }
  };

  // ── Combined filter + sort ────────────────────────────────────────
  const MIN_BOOKS_PER_SECTION = 2;

  const filterBooks = (books) => {
    const matched = books.filter((book) => {
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" ||
        book.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase()));
      const matchesLanguage =
        language === "All" || book.language === language;
      const matchesFormat =
        format === "All" || book.format === format;
      const matchesPriceRange = matchesPrice(book.price);

      return matchesSearch && matchesCategory && matchesLanguage && matchesFormat && matchesPriceRange;
    });

    // Pad with non-matching books from the same section to ensure minimum visible books
    // (only when the sole active filter is category — not when price/language/format are set)
    const onlyCategoryActive =
      selectedCategory !== "All" &&
      language === "All" &&
      format === "All" &&
      priceRange === "All" &&
      searchQuery === "";

    if (onlyCategoryActive && matched.length < MIN_BOOKS_PER_SECTION) {
      const matchedIds = new Set(matched.map((b) => b.id));
      const fallbacks = books.filter((b) => !matchedIds.has(b.id));
      return sortBooks([...matched, ...fallbacks.slice(0, MIN_BOOKS_PER_SECTION - matched.length)]);
    }

    return sortBooks(matched);
  };

  const filteredRecommended = filterBooks(recommendedBooks);
  const filteredBestsellers = filterBooks(bestsellers);
  const filteredNewLaunches = filterBooks(newLaunches);
  const hasResults =
    filteredRecommended.length > 0 ||
    filteredBestsellers.length > 0 ||
    filteredNewLaunches.length > 0;

  // ── Active filter count (for clear-all badge) ─────────────────────
  const activeFilterCount = [
    selectedCategory !== "All",
    language !== "All",
    format !== "All",
    priceRange !== "All",
    searchQuery !== "",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar cartCount={cart.length} wishlist={wishlist} setWishlist={setWishlist} />

      <div className="flex flex-1 relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Category Sidebar */}
        <aside
          className={`
            fixed md:sticky top-0 md:top-[57px] h-full md:h-[calc(100vh-57px)]
            w-56 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto z-40
            transition-transform duration-200
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 md:hidden">
            <span className="text-sm font-semibold text-gray-700">Categories</span>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
          <ul className="py-2">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    selectedCategory === cat
                      ? "bg-indigo-50 text-indigo-700 font-semibold border-r-2 border-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Filter Bar */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex flex-col gap-2 sticky top-[57px] z-20 shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Mobile: open sidebar button */}
              <button
                className="md:hidden flex items-center gap-1.5 text-gray-600 text-xs font-medium border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <SlidersHorizontal size={13} />
                {selectedCategory !== "All" ? selectedCategory : "Category"}
              </button>

              {/* Search */}
              <div className="relative flex-1 min-w-36 max-w-xs">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={13}
                />
                <input
                  type="text"
                  placeholder="Search title or author…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-700 text-xs rounded-lg px-3 py-2 pl-8 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 placeholder-gray-400 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Filter dropdowns */}
              <div className="flex items-center gap-2 flex-wrap">
                <FilterSelect
                  label="Language"
                  value={language}
                  onChange={setLanguage}
                  options={["All", "English", "Hindi", "Spanish", "French"]}
                />
                <FilterSelect
                  label="Format"
                  value={format}
                  onChange={setFormat}
                  options={["All", "Paperback", "Hardcover", "eBook", "Audiobook"]}
                />
                <FilterSelect
                  label="Price"
                  value={priceRange}
                  onChange={setPriceRange}
                  options={["All", "Under ₹100", "₹100–₹300", "₹300–₹500", "Above ₹500"]}
                />
              </div>

              {/* Sort — pushed to the right */}
              <div className="ml-auto flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setLanguage("All");
                      setFormat("All");
                      setPriceRange("All");
                      setSortBy("Relevance");
                    }}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >
                    <X size={11} />
                    Clear all
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ml-0.5">
                      {activeFilterCount}
                    </span>
                  </button>
                )}
                <FilterSelect
                  label="Sort by"
                  value={sortBy}
                  onChange={setSortBy}
                  options={["Relevance", "Price: Low to High", "Price: High to Low", "Newest First"]}
                />
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("All")} className="hover:text-indigo-900 ml-0.5">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {language !== "All" && (
                  <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100">
                    {language}
                    <button onClick={() => setLanguage("All")} className="hover:text-indigo-900 ml-0.5">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {format !== "All" && (
                  <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100">
                    {format}
                    <button onClick={() => setFormat("All")} className="hover:text-indigo-900 ml-0.5">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {priceRange !== "All" && (
                  <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100">
                    {priceRange}
                    <button onClick={() => setPriceRange("All")} className="hover:text-indigo-900 ml-0.5">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {searchQuery !== "" && (
                  <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:text-indigo-900 ml-0.5">
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Book Sections */}
          <div className="flex-1 px-4 sm:px-6 py-6 space-y-10">
            {filteredRecommended.length > 0 && (
              <section>
                <SectionHeading title="Recommended for You" onViewAll={() => {}} />
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredRecommended.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </section>
            )}

            {filteredBestsellers.length > 0 && (
              <section>
                <SectionHeading title="Bestsellers this Month" onViewAll={() => {}} />
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredBestsellers.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </section>
            )}

            {filteredNewLaunches.length > 0 && (
              <section>
                <SectionHeading title="New Launches" onViewAll={() => {}} />
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredNewLaunches.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </section>
            )}

            {!hasResults && (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <Search size={36} className="text-gray-300 mb-4" />
                <p className="text-gray-600 text-base font-medium">No books found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try a different search term or filter
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setLanguage("All");
                    setFormat("All");
                    setPriceRange("All");
                    setSortBy("Relevance");
                  }}
                  className="mt-4 text-indigo-600 text-sm font-medium hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
