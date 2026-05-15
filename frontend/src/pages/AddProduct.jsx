import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    // image_url: "",
  });
  const [image, setImage] = useState(null);
const [uploading, setUploading] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!form.name || !form.price) {
  //     alert("Name and Price are required");
  //     return;
  //   }
  //   try {
  //     await API.post("/products", form);
  //     alert("Product added successfully");
  //     setForm({ name: "", price: "", description: "", image_url: "" });
  //   } catch (error) {
  //     console.error("Add product error:", error);
  //     alert(error.response?.data?.message || "Error adding product");
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.price) {
    toast.error("Name and Price are required");
    return;
  }

  try {
    let imageUrl = "";

    // upload image first
    if (image) {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", image);

      const uploadRes = await API.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      imageUrl = uploadRes.data.imageUrl;

      setUploading(false);
    }

    // create product
    await API.post("/products", {
      ...form,
      image_url: imageUrl,
    });

    toast.success("Product added successfully 🛍️");

    setForm({
      name: "",
      price: "",
      description: "",
      image_url: "",
    });

    setImage(null);

  } catch (error) {
    console.error("Add product error:", error);

    toast.error(
      error.response?.data?.message ||
      "Error adding product"
    );

    setUploading(false);
  }
};

  const fields = [
    { key: "name", label: "Product Name", placeholder: "e.g. Handmade Pottery", type: "text", icon: "🛍️" },
    { key: "price", label: "Price (₹)", placeholder: "e.g. 499", type: "number", icon: "💰" },
    { key: "description", label: "Description", placeholder: "Describe your product...", type: "text", icon: "📝" },
    // { key: "image_url", label: "Image URL", placeholder: "https://...", type: "text", icon: "🖼️" },
  ];

  return (
    <div className="max-w-lg mx-auto pb-16 pt-4">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl shadow-orange-200">
          ➕
        </div>
        <h2
          className="text-3xl font-extrabold text-stone-800 mb-1"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Add New Product
        </h2>
        <p className="text-stone-400 text-sm">
          List your product and reach local customers
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-50 p-7">
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 font-['Sora']">
                <span>{f.icon}</span> {f.label}
              </label>
              {/* <input
                type={f.type}
                placeholder={f.placeholder}
                className="input-base"
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              /> */}
              {f.key === "description" ? (
  <textarea
    placeholder={f.placeholder}
    rows={5}
    className="input-base resize-none overflow-y-auto"
    value={form[f.key]}
    onChange={(e) =>
      setForm({
        ...form,
        [f.key]: e.target.value,
      })
    }
  />
) : (
  <input
    type={f.type}
    placeholder={f.placeholder}
    className="input-base"
    value={form[f.key]}
    onChange={(e) =>
      setForm({
        ...form,
        [f.key]: e.target.value,
      })
    }
  />
)}
            </div>
          ))}
          {/* IMAGE UPLOAD */}
<div>
  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 font-['Sora']">
    🖼️ Product Image
  </label>

  <label className="border-2 border-dashed border-orange-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50 transition">
    <div className="text-4xl mb-2">
      📸
    </div>

    <p className="text-sm text-stone-500 font-semibold">
      Click to upload product image
    </p>

    <p className="text-xs text-stone-300 mt-1">
      JPG, PNG, WEBP
    </p>

    <input
      type="file"
      hidden
      accept="image/*"
      onChange={(e) =>
        setImage(e.target.files[0])
      }
    />
  </label>
</div>

          {/* Image preview */}
          {/* {form.image_url && (
            <div className="rounded-2xl overflow-hidden border border-orange-100 h-40">
              <img
                src={form.image_url}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          )} */}

          {image && (
  <div className="rounded-2xl overflow-hidden border border-orange-100 h-52 shadow-sm">
    <img
      src={URL.createObjectURL(image)}
      alt="Preview"
      className="w-full h-full object-cover"
    />
  </div>
)}

          <button
            type="submit"
            className="btn-primary w-full py-3.5 text-base rounded-2xl text-white font-['Sora'] mt-2"
          >
            {uploading ? "Uploading..." : "🚀 Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
