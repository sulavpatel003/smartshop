import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { CartContext } from "../context/CartContext";
import MapView from "../components/MapView";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";
import toast from "react-hot-toast";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(null);
//   const [location, setLocation] = useState({
//   lat: 31.2536,
//   lng: 75.7033,
// });
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const startChat = async (shop_id) => {
    try {
      const res = await API.post(
        "/chat/start",
        { shop_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate(`/chat/${res.data.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to start chat");
    }
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        toast.error("Location permission denied");
      }
    );
  };



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "/products";
        if (search) url = `/products/search?q=${search}`;
        if (location) url = `/products/nearby?lat=${location.lat}&lng=${location.lng}`;
        const res = await API.get(url);
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [search, location]);

  const openDirections = (lat, lng) => {
    if (!lat || !lng) {
      toast.error("Location not available for this shop");
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  return (
    <div className="pb-16">
      {/* Page header */}
      <div className="text-center mb-8 pt-4">
        <h2
          className="text-4xl font-extrabold text-stone-800 mb-2"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Explore <span className="gradient-text">Products</span>
        </h2>
        <p className="text-stone-500 text-base">
          Discover authentic items from local shops near you
        </p>
      </div>

      {/* Search + Location bar */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-6">
        <button
          onClick={getLocation}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm font-['Sora'] transition-all ${
            location
              ? "bg-teal-500 text-white shadow-lg shadow-teal-200"
              : "bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50"
          }`}
        >
          📍{" "}
          {location ? "Location Active ✓" : "Use My Location"}
        </button>

        <div className="relative w-full md:w-96">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xs z-10">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search for products, shops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base !pl-14 shadow-sm"
          />
        </div>
      </div>

      {/* Map */}
      <div className="mb-8 h-64 rounded-3xl overflow-hidden shadow-xl border border-orange-100">
        <MapView products={products} userLocation={location} />
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛍️</div>
          <p
            className="text-stone-500 text-lg font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            No products found
          </p>
          <p className="text-stone-400 text-sm mt-1">
            Try a different search or enable location
          </p>
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/product/${p.id}`)}
            className="bg-white rounded-3xl overflow-hidden border border-orange-50 shadow-md hover:shadow-xl hover:shadow-orange-100 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={p.image_url || "https://via.placeholder.com/300x200?text=No+Image"}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Price badge */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-orange-600 font-extrabold text-sm px-3 py-1 rounded-full shadow-md font-['Sora']">
                ₹{p.price}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="mb-3">
                <h3
                  className="text-base font-bold text-stone-800 leading-tight"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  {p.name}
                </h3>
                <p className="text-xs text-orange-500 font-semibold mt-1 flex items-center gap-1">
                  <span>🏪</span> {p.shop_name}
                </p>
                <p className="text-stone-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <StarRating rating={parseFloat(p.avg_rating)} />
                  <span className="text-xs text-stone-400">
                    ({p.total_reviews})
                  </span>
                </div>

                {p.distance !== undefined && (
                  <p className="text-xs text-teal-600 font-semibold mt-1.5 flex items-center gap-1">
                    📍{" "}
                    {p.distance < 1
                      ? `${(p.distance * 1000).toFixed(0)}m away`
                      : `${p.distance.toFixed(2)} km away`}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-2 mt-auto pt-3 border-t border-orange-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p);
                  }}
                  className="btn-primary w-full py-2.5 text-sm rounded-xl text-white font-['Sora']"
                >
                  🛒 Add to Cart
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDirections(p.latitude, p.longitude);
                    }}
                    disabled={!p.latitude || !p.longitude}
                    className="w-full py-2 text-xs font-semibold rounded-xl border-2 border-teal-200 text-teal-600 hover:bg-teal-50 transition disabled:opacity-40 disabled:cursor-not-allowed font-['Sora']"
                  >
                    🧭 Directions
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startChat(p.shop_id);
                    }}
                    className="w-full py-2 text-xs font-semibold rounded-xl border-2 border-violet-200 text-violet-600 hover:bg-violet-50 transition font-['Sora']"
                  >
                    💬 Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
