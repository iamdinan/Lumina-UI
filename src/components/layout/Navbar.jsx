import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";

export function Navbar({ onToggleSidebar }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.focusSearch) {
      inputRef.current?.focus();
      navigate(location.pathname + location.search, { replace: true });
    }
  }, [location.pathname, location.search, location.state, navigate]);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <nav className="bg-base-100 border-b border-base-300 sticky top-0 z-10">
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
          <Link to="/" className="text-xl font-bold select-none">
            Lumina
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 w-full max-w-xs"
        >
          <input
            type="text"
            placeholder="Search series..."
            ref={inputRef}
            className="input input-bordered input-sm w-full focus:outline-none focus:border-base-content/20 transition-colors duration-150"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-square btn-sm btn-primary">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>
    </nav>
  );
}
