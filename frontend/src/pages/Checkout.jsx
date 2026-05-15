import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Checkout() {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCOD = async () => {
    try {
      await axios.post(
        `${API_URL}/orders`,
        { delivery_type: "COD" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order placed successfully 🎉");
      fetchCart();

    } catch (error) {
      console.error(error);
      toast.error("Failed to place order");
    }
  };

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(
        `${API_URL}/payment/create`,
        { amount: total },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        order_id: data.id,

        handler: async function (response) {
          try {
            await axios.post(
              `${API_URL}/payment/verify`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            await axios.post(
              `${API_URL}/orders`,
              { delivery_type: "ONLINE" },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            toast.success("Payment successful 🎉");
            fetchCart();

          } catch (error) {
            console.error(error);
            toast.error("Payment verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Payment failed ❌");
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-16 pt-4">
      <div className="mb-8 text-center">
        <h2
          className="text-3xl font-extrabold text-stone-800 mb-1"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Checkout
        </h2>
        <p className="text-stone-400 text-sm">Review your order and choose payment method</p>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-3xl border border-orange-100 shadow-md p-6 mb-6">
        <h3
          className="text-base font-bold text-stone-700 mb-4 flex items-center gap-2 font-['Sora']"
        >
          <span className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 text-sm">
            📦
          </span>
          Order Summary
        </h3>

        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-2 border-b border-stone-50 last:border-0"
            >
              <div>
                <span className="text-stone-700 text-sm font-semibold font-['Sora']">
                  {item.name}
                </span>
                <span className="text-stone-400 text-xs ml-2">× {item.quantity}</span>
              </div>
              <span className="text-stone-700 font-bold text-sm font-['Sora']">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-dashed border-orange-200 flex justify-between items-center">
          <span className="text-stone-600 font-semibold font-['Sora']">Total</span>
          <span
            className="text-2xl font-extrabold gradient-text font-['Sora']"
          >
            ₹{total}
          </span>
        </div>
      </div>

      {/* Payment Options */}
      <div className="bg-white rounded-3xl border border-orange-100 shadow-md p-6">
        <h3
          className="text-base font-bold text-stone-700 mb-5 flex items-center gap-2 font-['Sora']"
        >
          <span className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm">
            💳
          </span>
          Payment Method
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleCOD}
            className="group p-5 rounded-2xl border-2 border-teal-200 hover:border-teal-400 hover:bg-teal-50 transition-all text-left"
          >
            <div className="text-2xl mb-2">💵</div>
            <div
              className="font-bold text-stone-800 text-sm font-['Sora']"
            >
              Cash on Delivery
            </div>
            <div className="text-xs text-stone-400 mt-1">
              Pay when you receive your order
            </div>
            <div className="mt-3 text-teal-600 font-bold text-xs font-['Sora'] group-hover:translate-x-1 transition-transform">
              Choose COD →
            </div>
          </button>

          <button
            onClick={handlePayment}
            className="group p-5 rounded-2xl border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all text-left"
          >
            <div className="text-2xl mb-2">💳</div>
            <div
              className="font-bold text-stone-800 text-sm font-['Sora']"
            >
              Pay Online
            </div>
            <div className="text-xs text-stone-400 mt-1">
              UPI, Cards & Net Banking via Razorpay
            </div>
            <div className="mt-3 text-orange-600 font-bold text-xs font-['Sora'] group-hover:translate-x-1 transition-transform">
              Pay ₹{total} →
            </div>
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-stone-400">
          <span>🔒</span>
          <span>Your payment is secured with 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
