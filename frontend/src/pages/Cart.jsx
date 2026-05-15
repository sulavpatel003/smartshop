import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto pb-16 pt-4">
      <div className="mb-8">
        <h2
          className="text-3xl font-extrabold text-stone-800 mb-1"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          🛒 Your Cart
        </h2>
        <p className="text-stone-400 text-sm">
          {cart.length === 0
            ? "Your cart is empty"
            : `${cart.length} item${cart.length > 1 ? "s" : ""} in your cart`}
        </p>
      </div>

      {cart.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border border-orange-100 shadow-sm">
          <div className="text-7xl mb-5">🛍️</div>
          <h3
            className="text-xl font-bold text-stone-700 mb-2 font-['Sora']"
          >
            Your cart is empty
          </h3>
          <p className="text-stone-400 text-sm mb-6">
            Discover amazing local products and add them here
          </p>
          <button
            onClick={() => navigate("/products")}
            className="btn-primary px-8 py-3 rounded-2xl text-white font-['Sora']"
          >
            Explore Products →
          </button>
        </div>
      )}

      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex items-center gap-4 hover:border-orange-200 transition-colors"
          >
            {/* Product image placeholder */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center text-2xl flex-shrink-0 border border-orange-100">
              🛍️
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className="font-bold text-stone-800 text-sm truncate font-['Sora']"
              >
                {item.name}
              </h3>
              <p className="text-orange-500 font-bold text-sm mt-0.5">
                ₹{item.price}
              </p>

              {/* Quantity controls */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() =>
                    updateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                  className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 font-bold text-lg flex items-center justify-center hover:bg-orange-200 transition"
                >
                  −
                </button>
                <span className="w-8 text-center font-bold text-stone-700 text-sm font-['Sora']">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                  className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 font-bold text-lg flex items-center justify-center hover:bg-orange-200 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className="font-extrabold text-stone-800 font-['Sora']">
                ₹{item.price * item.quantity}
              </span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-xs text-red-400 hover:text-red-500 font-semibold font-['Sora'] hover:bg-red-50 px-2 py-1 rounded-lg transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="bg-white rounded-3xl border border-orange-100 shadow-md p-6">
          <div className="flex items-center justify-between mb-2 text-stone-500 text-sm">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>
          <div className="flex items-center justify-between mb-5 font-bold text-stone-800 text-lg border-t border-dashed border-orange-100 pt-4 mt-3">
            <span className="font-['Sora']">Total</span>
            <span className="gradient-text font-['Sora'] text-2xl">₹{total}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="btn-primary w-full py-3.5 text-base rounded-2xl text-white font-['Sora']"
          >
            Proceed to Checkout →
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
