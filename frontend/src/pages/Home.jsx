import { Link } from "react-router-dom";

const features = [
  {
    icon: "🛍️",
    title: "Local Shops",
    desc: "Discover authentic products from neighbourhood stores near you",
    color: "from-orange-400 to-amber-400",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
  {
    icon: "💬",
    title: "Live Community",
    desc: "Chat directly with sellers & buyers in real-time",
    color: "from-teal-500 to-emerald-400",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    icon: "🤖",
    title: "AI Powered",
    desc: "Smart recommendations tailored to your preferences",
    color: "from-violet-500 to-purple-400",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
];

const stats = [
  { value: "500+", label: "Local Shops" },
  { value: "10K+", label: "Products" },
  { value: "50K+", label: "Happy Customers" },
  { value: "4.9★", label: "Average Rating" },
];

function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-96 h-96 bg-orange-400 top-0 -right-32" />
      <div className="orb w-72 h-72 bg-amber-300 top-32 -left-20" />
      <div className="orb w-64 h-64 bg-teal-400 bottom-40 right-10" />

      {/* HERO */}
      <section className="relative text-center pt-16 pb-20 px-4">
        <div
          className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          <span className="pulse-dot w-2 h-2 bg-orange-500 rounded-full inline-block" />
          Now Live in Your City
        </div>

        <h1
          className="text-5xl md:text-7xl font-extrabold mb-5 leading-tight"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Discover{" "}
          <span className="gradient-text">Local</span>
          <br />
          Products 🌍
        </h1>

        <p className="text-stone-500 text-lg md:text-xl max-w-xl mx-auto mb-10 font-['Nunito']">
          Find authentic items from nearby shops wherever you travel.
          Shop local, support your community.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/products"
            className="btn-primary px-8 py-3.5 text-base font-['Sora'] rounded-2xl text-white inline-flex items-center gap-2 shadow-xl shadow-orange-200"
          >
            Explore Products →
          </Link>
          <Link
            to="/create-shop"
            className="px-8 py-3.5 text-base font-semibold rounded-2xl border-2 border-orange-300 text-orange-600 hover:bg-orange-50 transition-all font-['Sora'] inline-flex items-center gap-2"
          >
            🏪 Open Your Shop
          </Link>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="relative mx-4 md:mx-0 mb-16">
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl py-8 px-6 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-2xl shadow-orange-300">
          {stats.map((s) => (
            <div key={s.label} className="text-center text-white">
              <div
                className="text-3xl font-extrabold"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {s.value}
              </div>
              <div className="text-orange-100 text-sm font-medium mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="pb-20 px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-stone-800 mb-3"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Why LocalFinder?
          </h2>
          <p className="text-stone-500 text-base max-w-md mx-auto">
            Everything you need to connect with local businesses and discover
            great products nearby.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`card p-7 text-center ${f.bg} border ${f.border} cursor-default`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg`}
              >
                {f.icon}
              </div>
              <h3
                className="text-lg font-bold text-stone-800 mb-2"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {f.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-4 md:mx-0 mb-16">
        <div className="bg-stone-900 rounded-3xl p-10 text-center text-white relative overflow-hidden">
          <div className="orb w-48 h-48 bg-orange-500 top-0 left-0" />
          <div className="orb w-36 h-36 bg-teal-500 bottom-0 right-0" />
          <div className="relative z-10">
            <h2
              className="text-2xl md:text-3xl font-extrabold mb-3"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Own a local shop?
            </h2>
            <p className="text-stone-400 mb-6 max-w-sm mx-auto text-sm">
              Reach thousands of customers in your area. List your products for
              free and grow your business online.
            </p>
            <Link
              to="/register"
              className="inline-block bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold px-8 py-3 rounded-2xl hover:shadow-xl hover:shadow-orange-900 transition-all font-['Sora']"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
