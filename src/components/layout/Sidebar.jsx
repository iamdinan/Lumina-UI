import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function Sidebar({ isOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const linkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
      location.pathname === path
        ? "bg-primary text-primary-content"
        : "hover:bg-base-200"
    }`;

  const actionClass = (variant = "ghost") =>
    `btn btn-sm w-full justify-center rounded-xl px-4 text-center ${variant}`;

  return (
    <aside
      className={`
        fixed md:sticky top-16 left-0 bottom-0 md:bottom-auto
        w-56 shrink-0 border-r border-base-300 bg-base-100 md:bg-transparent
        h-[calc(100vh-64px)] p-4 flex flex-col justify-between z-20 md:z-auto
        transition-transform duration-200 md:transform-none
        ${isOpen ? "translate-x-0" : "-translate-x-full md:hidden"}
      `}
    >
      <nav className="flex flex-col gap-1">
        <Link to="/" className={linkClass("/")}>
          Home
        </Link>
        {user && (
          <Link to="/my-list" className={linkClass("/my-list")}>
            My List
          </Link>
        )}
      </nav>

      <div className="border-t border-base-300 pt-4">
        {user ? (
          <div className="flex flex-col gap-2">
            <Link
              to="/profile"
              className={actionClass(
                "border-0 bg-transparent text-white shadow-none hover:bg-transparent hover:text-primary",
              )}
            >
              {user.username}
            </Link>
            <button
              className={actionClass("btn-error text-white")}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link to="/login" className={actionClass("btn-neutral text-white")}>
              Login
            </Link>
            <Link to="/register" className={actionClass("btn-primary")}>
              Register
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
