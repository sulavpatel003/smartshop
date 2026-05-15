import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import StarRating from "../components/StarRating";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchProduct = async () => {
    const res = await API.get(`/products/${id}`);
    setProduct(res.data);
  };

  const fetchReviews = async () => {
    const res = await API.get(`/reviews/${id}`);
    setReviews(res.data);
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleSubmit = async () => {
    await API.post(
      `/reviews/${id}`,
      { rating, comment },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setComment("");
    fetchReviews();
  };

  if (!product)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-orange-500 font-semibold font-['Sora']">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Loading product...
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto pb-16">
      {/* Product hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-orange-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-80 md:h-96 object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2 flex items-center gap-1 font-['Sora']">
            🏪 {product.shop_name}
          </p>
          <h1
            className="text-3xl font-extrabold text-stone-800 mb-3 leading-tight"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={parseFloat(product.avg_rating)} />
            <span className="text-sm text-stone-400">
              ({product.total_reviews} reviews)
            </span>
          </div>

          <p className="text-stone-500 text-sm leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex items-baseline gap-2 mb-6">
            <span
              className="text-4xl font-extrabold gradient-text"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              ₹{product.price}
            </span>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-sm text-stone-600 flex items-start gap-3">
            <span className="text-lg">🚀</span>
            <div>
              <p className="font-semibold text-stone-700 font-['Sora']">Fast Local Delivery</p>
              <p className="text-xs text-stone-400 mt-0.5">Available from nearby shops • Cash on Delivery supported</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Review */}
      <div className="bg-white rounded-3xl border border-orange-100 shadow-md p-6 mb-8">
        <h2
          className="text-xl font-bold text-stone-800 mb-5"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          ✍️ Write a Review
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-shrink-0">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 block font-['Sora']">
              Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="input-base w-auto pr-8"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} ⭐
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 block font-['Sora']">
              Your Review
            </label>
            <input
              type="text"
              placeholder="Share your experience with this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-base"
            />
          </div>

          <div className="flex-shrink-0 flex items-end">
            <button
              onClick={handleSubmit}
              className="btn-primary px-6 py-2.5 text-sm rounded-xl text-white font-['Sora'] whitespace-nowrap"
            >
              Submit →
            </button>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div>
        <h2
          className="text-xl font-bold text-stone-800 mb-5"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          💬 Customer Reviews ({reviews.length})
        </h2>

        {reviews.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-orange-50">
            <div className="text-5xl mb-3">⭐</div>
            <p className="text-stone-400 font-['Sora'] font-semibold">
              No reviews yet. Be the first!
            </p>
          </div>
        )}

        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-white font-bold text-sm font-['Sora'] flex-shrink-0">
                {r.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p
                    className="font-bold text-stone-800 text-sm font-['Sora']"
                  >
                    {r.name}
                  </p>
                  <StarRating rating={r.rating} />
                </div>
                <p className="text-stone-500 text-sm leading-relaxed">{r.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
