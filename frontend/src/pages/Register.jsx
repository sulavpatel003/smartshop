import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await API.post("/auth/register", form);

    toast.success("Account created successfully 🎉");

    navigate("/login");

  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Registration failed"
    );
  }
};

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="orb w-64 h-64 bg-teal-400 top-20 right-10 fixed" />
      <div className="orb w-48 h-48 bg-amber-300 bottom-20 left-10 fixed" />

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl shadow-teal-100 border border-teal-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-400 p-7 text-white text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">
              🚀
            </div>
            <h1
              className="text-2xl font-extrabold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Create Account
            </h1>
            <p className="text-teal-100 text-sm mt-1">
              Join LocalFinder today — it's free!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-7 space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 block font-['Sora']">
                Full Name
              </label>
              <input
                placeholder="Your name"
                className="input-base"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 block font-['Sora']">
                Email Address
              </label>
              <input
                placeholder="you@example.com"
                className="input-base"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 block font-['Sora']">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a strong password"
                className="input-base"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 block font-['Sora']">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "customer", label: "🛍️ Customer", desc: "Browse & buy" },
                  { value: "shop_owner", label: "🏪 Shop Owner", desc: "Sell products" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`cursor-pointer rounded-2xl border-2 p-3 text-center transition-all ${
                      form.role === opt.value
                        ? "border-teal-500 bg-teal-50"
                        : "border-stone-200 hover:border-teal-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={opt.value}
                      checked={form.role === opt.value}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      className="sr-only"
                    />
                    <div className="text-lg">{opt.label.split(" ")[0]}</div>
                    <div
                      className="text-xs font-bold text-stone-700 mt-0.5 font-['Sora']"
                    >
                      {opt.label.split(" ").slice(1).join(" ")}
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      {opt.desc}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn-secondary w-full py-3.5 text-base rounded-2xl text-white font-['Sora'] mt-2"
            >
              Create Account →
            </button>

            <p className="text-center text-stone-500 text-sm pt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-teal-600 font-bold hover:text-teal-700"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
