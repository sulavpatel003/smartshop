import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function CreateShop() {
  const [form, setForm] = useState({
    shop_name: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/shops", form);
      toast.success("Your shop is now live on SmartShop 🏪✨");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong while creating your shop");
      
    }
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        });
        toast.success("Location fetched successfully");
      },
      () => toast.error("Location permission denied")
    );
  };

  return (
    <div className="max-w-lg mx-auto pb-16 pt-4">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl shadow-teal-200">
          🏪
        </div>
        <h2
          className="text-3xl font-extrabold text-stone-800 mb-1"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Open Your Shop
        </h2>
        <p className="text-stone-400 text-sm">
          Set up your local shop and start selling today
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-teal-100 shadow-xl shadow-teal-50 p-7">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 block font-['Sora']">
              🏷️ Shop Name
            </label>
            <input
              placeholder="e.g. Ravi's Electronics"
              className="input-base"
              value={form.shop_name}
              onChange={(e) => setForm({ ...form, shop_name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 block font-['Sora']">
              📍 Address
            </label>
            <input
              placeholder="Shop address..."
              className="input-base"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 block font-['Sora']">
              🗺️ Location Coordinates
            </label>
            <button
              type="button"
              onClick={getLocation}
              className={`w-full mb-3 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm font-['Sora'] border-2 transition-all ${
                form.latitude
                  ? "border-teal-400 bg-teal-50 text-teal-700"
                  : "border-teal-200 text-teal-600 hover:bg-teal-50"
              }`}
            >
              📍 {form.latitude ? `Location set (${form.latitude})` : "Use My Current Location"}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <input
                className="input-base"
                placeholder="Latitude"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              />
              <input
                className="input-base"
                placeholder="Longitude"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-secondary w-full py-3.5 text-base rounded-2xl text-white font-['Sora'] mt-2"
          >
            🚀 Create Shop
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateShop;
