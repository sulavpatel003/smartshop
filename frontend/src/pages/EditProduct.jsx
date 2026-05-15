import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function EditProduct() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(true);

  // LOAD PRODUCT
  useEffect(() => {

    const fetchProduct = async () => {
      try {

        const res = await API.get(`/products/${id}`);

        setForm({
          name: res.data.name || "",
          price: res.data.price || "",
          description: res.data.description || "",
          image_url: res.data.image_url || "",
        });

      } catch (error) {
        console.error(error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

  }, [id]);

  // UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await API.put(`/products/${id}`, form);

      toast.success("✅ Product updated successfully");

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-bold">
        Loading product...
      </div>
    );
  }

  return (

    <div className="min-h-screen px-4 py-10">

      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 text-center">

          <h1
            className="text-4xl font-extrabold text-stone-800"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            ✏️ Edit Product
          </h1>

          <p className="text-stone-400 mt-2">
            Update your product information
          </p>

        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">

          {/* TOP BANNER */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-400 p-6 text-white">

            <h2
              className="text-2xl font-extrabold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Product Details
            </h2>

            <p className="text-orange-100 mt-1 text-sm">
              Make changes and save updates
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="p-7 space-y-5"
          >

            {/* PRODUCT NAME */}
            <div>

              <label className="block text-sm font-bold text-stone-600 mb-2 uppercase tracking-wide">
                Product Name
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full border border-orange-200 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-orange-100"
                placeholder="Enter product name"
                required
              />

            </div>

            {/* PRICE */}
            <div>

              <label className="block text-sm font-bold text-stone-600 mb-2 uppercase tracking-wide">
                Price
              </label>

              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value,
                  })
                }
                className="w-full border border-orange-200 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-orange-100"
                placeholder="Enter price"
                required
              />

            </div>

            {/* IMAGE URL */}
            <div>

              <label className="block text-sm font-bold text-stone-600 mb-2 uppercase tracking-wide">
                Image URL
              </label>

              <input
                type="text"
                value={form.image_url}
                onChange={(e) =>
                  setForm({
                    ...form,
                    image_url: e.target.value,
                  })
                }
                className="w-full border border-orange-200 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-orange-100"
                placeholder="Paste image URL"
                required
              />

            </div>

            {/* IMAGE PREVIEW */}
            {form.image_url && (

              <div>

                <p className="text-sm font-bold text-stone-600 mb-2 uppercase tracking-wide">
                  Preview
                </p>

                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-2xl border"
                />

              </div>

            )}

            {/* DESCRIPTION */}
            <div>

              <label className="block text-sm font-bold text-stone-600 mb-2 uppercase tracking-wide">
                Description
              </label>

              <textarea
                rows="5"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="w-full border border-orange-200 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-orange-100"
                placeholder="Write product description..."
                required
              />

            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 pt-3">

              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-400 hover:scale-[1.02] transition text-white py-3 rounded-2xl font-bold shadow-lg"
              >
                💾 Save Changes
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 rounded-2xl border border-stone-300 font-semibold hover:bg-stone-100 transition"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default EditProduct;