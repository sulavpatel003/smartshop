import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [shop, setShop] = useState(null);

  //**** */
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === "customer") {
          const res = await API.get("/orders/my");
          setOrders(res.data);
        } else {
          const res = await API.get("/orders/shop");
          setOrders(res.data);
          const shopRes = await API.get("/shops/my");
          setShop(shopRes.data);

          const productRes = await API.get(
  "/products/my/products"
);

setProducts(productRes.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchData();
  }, [user]);

  const roleColor =
    user?.role === "shop_owner"
      ? "from-teal-500 to-emerald-400"
      : "from-orange-500 to-amber-400";

      //*** */
      const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Delete this product?"
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/products/${id}`);

    setProducts((prev) =>
      prev.filter((p) => p.id !== id)
    );

    toast.success("Product deleted successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete product");
  }
};

const toggleShopStatus = async () => {
  try {

    const updatedStatus = !shop.is_active;

    const res = await API.put(
      "/shops/status",
      {
        is_active: updatedStatus,
      }
    );

    setShop(res.data.shop);

  } catch (error) {
    console.error(error);
    toast.error("Failed to update shop status");
  }
};

  return (
    <div className="max-w-4xl mx-auto pb-16 pt-4">
      {/* Header */}
      <div className="mb-8">
        <h2
          className="text-3xl font-extrabold text-stone-800 mb-1"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          👤 My Dashboard
        </h2>
        <p className="text-stone-400 text-sm">
          Manage your account and track your activity
        </p>
      </div>

      {/* Profile card */}
      <div
        className={`bg-gradient-to-br ${roleColor} rounded-3xl p-6 mb-6 text-white shadow-xl`}
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-extrabold text-white font-['Sora'] shadow-inner">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3
              className="text-xl font-extrabold font-['Sora']"
            >
              {user?.name}
            </h3>
            <p className="text-white/80 text-sm">{user?.email}</p>
            <span className="inline-block mt-2 bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest font-['Sora']">
              {user?.role === "shop_owner" ? "🏪 Shop Owner" : "🛍️ Customer"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 text-center">
          <div className="text-3xl font-extrabold gradient-text font-['Sora']">
            {orders.length}
          </div>
          <div className="text-stone-500 text-xs font-semibold mt-1 font-['Sora'] uppercase tracking-wide">
            {user?.role === "customer" ? "Orders Placed" : "Orders Received"}
          </div>
        </div>

        {user?.role === "shop_owner" && shop && (
          <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5 text-center col-span-2 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-xl">
                🏪
              </div>
              <div className="text-left">
                <div
                  className="font-bold text-stone-800 font-['Sora']"
                >
                  {shop.shop_name}
                </div>
                <div className="text-stone-400 text-xs">{shop.address}</div>
              </div>
              
              <div className="ml-auto flex items-center gap-3">

  {/* STATUS TEXT */}
  <div
    className={`px-4 py-2 rounded-full text-sm font-bold ${
      shop.is_active
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {shop.is_active
      ? "🟢 Online"
      : "🔴 Offline"}
  </div>

  {/* TOGGLE */}
  <button
    onClick={toggleShopStatus}
    className={`relative w-16 h-8 rounded-full transition ${
      shop.is_active
        ? "bg-green-500"
        : "bg-gray-400"
    }`}
  >

    <div
      className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${
        shop.is_active
          ? "left-9"
          : "left-1"
      }`}
    />

  </button>

</div>

            </div>
          </div>
        )}
      </div>

      {/* Orders */}
      <div className="bg-white rounded-3xl border border-orange-100 shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-orange-50 flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
            {user?.role === "customer" ? "🛒" : "📦"}
          </span>
          <h3
            className="font-bold text-stone-800 font-['Sora']"
          >
            {user?.role === "customer" ? "My Orders" : "Orders Received"}
          </h3>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-stone-400 font-semibold font-['Sora']">
              No orders yet
            </p>
            <p className="text-stone-300 text-xs mt-1">
              Your order history will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-50">
            {orders.map((o) => (
              <div
                key={o.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-orange-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 text-sm font-bold font-['Sora']">
                    #{o.id}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-700 font-['Sora']">
                      Order #{o.id}
                    </div>
                    <div className="text-xs text-stone-400">
                      {o.delivery_type || "Standard"} delivery
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-stone-800 font-['Sora']">
                    ₹{o.total_amount}
                  </div>
                  <div className="text-xs text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded-full mt-1">
                    {o.status || "Pending"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    {/* SHOP OWNER PRODUCTS */}
{user?.role === "shop_owner" && (
  <div className="mt-8">

    <div className="flex items-center justify-between mb-5">
      <h3
        className="text-2xl font-extrabold text-stone-800"
        style={{ fontFamily: "Sora, sans-serif" }}
      >
        🛍️ My Products
      </h3>

      <button
        onClick={() => navigate("/add-product")}
        className="bg-gradient-to-r from-orange-500 to-amber-400 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:scale-105 transition"
      >
        + Add Product
      </button>
    </div>

    {products.length === 0 ? (

      <div className="bg-white rounded-3xl shadow-md border border-orange-100 p-10 text-center">
        <div className="text-5xl mb-3">📦</div>

        <p className="text-stone-500 font-semibold">
          No products added yet
        </p>
      </div>

    ) : (

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {products.map((p) => (

          <div
            key={p.id}
            className="bg-white rounded-3xl shadow-md border border-orange-100 overflow-hidden hover:shadow-xl transition"
          >

            {/* IMAGE */}
            <img
              src={p.image_url}
              alt={p.name}
              className="w-full h-52 object-cover"
            />

            {/* BODY */}
            <div className="p-5">

              <h4 className="text-xl font-extrabold text-stone-800 font-['Sora']">
                {p.name}
              </h4>

              <p className="text-stone-400 text-sm mt-1 line-clamp-2">
                {p.description}
              </p>

              <div className="mt-4 flex items-center justify-between">

                <div className="text-2xl font-extrabold text-orange-500 font-['Sora']">
                  ₹{p.price}
                </div>

                <div className="flex gap-2">

                  {/* EDIT */}
                  <button
                    onClick={() =>
                      navigate(`/edit-product/${p.id}`)
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    ✏️ Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>
)}

    </div>
  );
}

export default Dashboard;
