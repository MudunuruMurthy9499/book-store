import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-screen-xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-indigo-600" />
            <h3 className="text-gray-900 font-bold text-base">Book Worm</h3>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your online destination for books across every genre. Read more, explore more.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-gray-700 font-semibold text-xs mb-3 uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {["Home", "Catalogue", "My Orders", "My Wishlist"].map((link) => (
              <li key={link}>
                <a href="#" className="text-gray-500 text-sm hover:text-indigo-600 transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-gray-700 font-semibold text-xs mb-3 uppercase tracking-wider">
            Top Categories
          </h4>
          <ul className="space-y-2">
            {["Fiction", "Self-help", "Biography", "Science Fiction", "Mystery"].map((cat) => (
              <li key={cat}>
                <a href="#" className="text-gray-500 text-sm hover:text-indigo-600 transition-colors">
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-gray-700 font-semibold text-xs mb-3 uppercase tracking-wider">
            Support
          </h4>
          <ul className="space-y-2">
            {["Contact Us", "Return Policy", "Privacy Policy", "Terms of Service"].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-500 text-sm hover:text-indigo-600 transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-4 text-center">
        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} Book Worm. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
