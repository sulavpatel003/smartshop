import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      login(res.data);
      toast.success(`Welcome back, ${res.data.user.name} 👋`);

      navigate("/products");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
  error.response?.data?.message ||
  "Invalid email or password"
);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* Orbs */}
      <div className="orb w-64 h-64 bg-orange-400 top-10 left-10 fixed" />
      <div className="orb w-48 h-48 bg-teal-400 bottom-20 right-10 fixed" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-orange-100 border border-orange-100 overflow-hidden">
          {/* Header strip */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-400 p-7 text-white text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 backdrop-blur-sm">
              🔑
            </div>
            <h1
              className="text-2xl font-extrabold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Welcome Back
            </h1>
            <p className="text-orange-100 text-sm mt-1">
              Sign in to your LocalFinder account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-7 space-y-4">
            <div>
              <label
                className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 block"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Email Address
              </label>
              <input
                type="email"
                className="input-base"
                placeholder="you@example.com"
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label
                className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 block"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Password
              </label>
              <input
                type="password"
                className="input-base"
                placeholder="••••••••"
                required
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 text-base rounded-2xl text-white font-['Sora'] mt-2"
            >
              Sign In →
            </button>

            <p className="text-center text-stone-500 text-sm pt-2">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-orange-500 font-bold hover:text-orange-600"
              >
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
