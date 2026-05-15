import { useEffect, useState } from "react";
import API from "../services/api";

const statusConfig = {
  accepted: { color: "bg-teal-100 text-teal-700", icon: "✅" },
  rejected: { color: "bg-red-100 text-red-600", icon: "❌" },
  delivered: { color: "bg-blue-100 text-blue-700", icon: "📦" },
  pending: { color: "bg-amber-100 text-amber-700", icon: "⏳" },
};

function ShopOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/shop");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const statusInfo = (status) =>
    statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <div className="max-w-4xl mx-auto pb-16 pt-4">
      <div className="mb-8">
        <h2
          className="text-3xl font-extrabold text-stone-800 mb-1"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          📦 Shop Orders
        </h2>
        <p className="text-stone-400 text-sm">
          {orders.length} order{orders.length !== 1 ? "s" : ""} to manage
        </p>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border border-orange-100">
          <div className="text-7xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-stone-700 mb-2 font-['Sora']">
            No orders yet
          </h3>
          <p className="text-stone-400 text-sm">
            New orders from customers will appear here
          </p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order, index) => {
          const s = statusInfo(order.payment_status);
          return (
            <div
              key={index}
              className="bg-white rounded-3xl border border-stone-100 shadow-md p-6 hover:border-orange-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3
                    className="text-lg font-bold text-stone-800 font-['Sora']"
                  >
                    Order #{order.order_id}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full font-['Sora'] flex items-center gap-1 ${s.color}`}
                >
                  {s.icon} {order.payment_status || "Pending"}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                <div className="bg-orange-50 rounded-2xl p-3">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide font-['Sora'] mb-1">Product</p>
                  <p className="font-bold text-stone-800 text-sm font-['Sora'] truncate">{order.product_name}</p>
                </div>
                <div className="bg-orange-50 rounded-2xl p-3">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide font-['Sora'] mb-1">Quantity</p>
                  <p className="font-bold text-stone-800 text-sm font-['Sora']">{order.quantity}</p>
                </div>
                <div className="bg-orange-50 rounded-2xl p-3">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide font-['Sora'] mb-1">Price</p>
                  <p className="font-bold text-stone-800 text-sm font-['Sora']">₹{order.price}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl p-3">
                  <p className="text-[10px] font-bold text-orange-100 uppercase tracking-wide font-['Sora'] mb-1">Total</p>
                  <p className="font-extrabold text-white text-lg font-['Sora']">₹{order.total_amount}</p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => updateStatus(order.order_id, "accepted")}
                  className="flex-1 py-2 text-sm font-bold rounded-xl bg-teal-100 text-teal-700 hover:bg-teal-200 transition font-['Sora']"
                >
                  ✅ Accept
                </button>
                <button
                  onClick={() => updateStatus(order.order_id, "rejected")}
                  className="flex-1 py-2 text-sm font-bold rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition font-['Sora']"
                >
                  ❌ Reject
                </button>
                <button
                  onClick={() => updateStatus(order.order_id, "delivered")}
                  className="flex-1 py-2 text-sm font-bold rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition font-['Sora']"
                >
                  📦 Delivered
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShopOrders;
