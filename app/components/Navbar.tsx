import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();

      setShowMenu(false);

      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout");
    }
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">
          RESUMIND
        </p>
      </Link>

      <div className="flex items-center gap-3">
        <Link
          to="/upload"
          className="primary-button w-fit"
        >
          Upload Resume
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold hover:opacity-90 transition"
          >
            {auth?.user?.username?.[0]?.toUpperCase() || "P"}
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border z-50 overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-semibold text-gray-800">
                  {auth?.user?.username || "User"}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-600 font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;