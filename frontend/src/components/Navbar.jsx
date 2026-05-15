import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `relative font-semibold text-sm transition-all duration-200 px-1 py-0.5 font-['Sora'] ${
      isActive(path)
        ? "text-orange-500"
        : "text-stone-600 hover:text-orange-500"
    }`;

  return (
    <nav className="navbar-glass sticky top-0 z-50 px-6 py-3 flex justify-between items-center shadow-sm">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">
          <span className="text-white text-lg">🌍</span>
        </div>
        <span
          className="text-xl font-bold gradient-text"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          LocalFinder
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-5 items-center">
        <Link to="/" className={linkClass("/")}>
          Home
          {isActive("/") && (
            <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-orange-500 rounded-full" />
          )}
        </Link>
        <Link to="/products" className={linkClass("/products")}>
          Products
          {isActive("/products") && (
            <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-orange-500 rounded-full" />
          )}
        </Link>

        {user?.role == "customer" && (
          <Link to="/cart" className="relative hover:text-orange-500 transition-colors">
            <span className="text-stone-600 hover:text-orange-500 font-semibold text-sm font-['Sora'] flex items-center gap-1">
              🛒 <span>Cart</span>
            </span>
            {cart.length > 0 && (
              <span className="absolute -top-2.5 -right-3 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full pulse-dot shadow-md shadow-orange-300 min-w-[1.1rem] text-center">
                {cart.length}
              </span>
            )}
          </Link>
        )}

        {user && (
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
            {isActive("/dashboard") && (
              <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-orange-500 rounded-full" />
            )}
          </Link>
        )}

        {user?.role === "shop_owner" && (
          <Link to="/shop-orders" className={linkClass("/shop-orders")}>
            📦 Orders
          </Link>
        )}

        {user?.role === "shop_owner" && (
          <Link to="/add-product" className={linkClass("/add-product")}>
            + Product
          </Link>
        )}

        <Link to="/chats" className={linkClass("/chats")}>
          💬 Chats
        </Link>
        <Link to="/community" className={linkClass("/community")}>
          🌐 Community
        </Link>

        {!user ? (
          <div className="flex items-center gap-2 ml-2">
            <Link
              to="/login"
              className="text-sm font-semibold text-stone-700 hover:text-orange-500 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-all font-['Sora']"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn-primary text-sm px-4 py-1.5 rounded-xl text-white font-['Sora']"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3 ml-2">
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-white text-xs font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-stone-700 font-['Sora']">
                {user.name?.split(" ")[0]}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-sm font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-all font-['Sora']"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden p-2 rounded-lg hover:bg-orange-50 transition"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className={`w-5 h-0.5 bg-stone-700 mb-1 transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
        <div className={`w-5 h-0.5 bg-stone-700 mb-1 transition-all ${menuOpen ? "opacity-0" : ""}`} />
        <div className={`w-5 h-0.5 bg-stone-700 transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-orange-100 shadow-xl p-4 flex flex-col gap-3 md:hidden">
          <Link to="/" className="text-stone-700 font-semibold font-['Sora'] hover:text-orange-500" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className="text-stone-700 font-semibold font-['Sora'] hover:text-orange-500" onClick={() => setMenuOpen(false)}>Products</Link>
          {user?.role !== "shop_owner" && <Link to="/cart" className="text-stone-700 font-semibold font-['Sora'] hover:text-orange-500" onClick={() => setMenuOpen(false)}>🛒 Cart ({cart.length})</Link>}
          {user && <Link to="/dashboard" className="text-stone-700 font-semibold font-['Sora'] hover:text-orange-500" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
          {user?.role === "shop_owner" && <Link to="/shop-orders" className="text-stone-700 font-semibold font-['Sora'] hover:text-orange-500" onClick={() => setMenuOpen(false)}>📦 Orders</Link>}
          <Link to="/chats" className="text-stone-700 font-semibold font-['Sora'] hover:text-orange-500" onClick={() => setMenuOpen(false)}>💬 Chats</Link>
          <Link to="/community" className="text-stone-700 font-semibold font-['Sora'] hover:text-orange-500" onClick={() => setMenuOpen(false)}>🌐 Community</Link>
          {!user ? (
            <div className="flex gap-2 pt-2 border-t border-orange-100">
              <Link to="/login" className="flex-1 text-center py-2 rounded-xl border border-orange-300 text-orange-600 font-semibold font-['Sora']" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="flex-1 text-center py-2 rounded-xl btn-primary font-['Sora']" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          ) : (
            <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full py-2 rounded-xl bg-red-50 text-red-500 font-semibold font-['Sora'] hover:bg-red-100">Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
