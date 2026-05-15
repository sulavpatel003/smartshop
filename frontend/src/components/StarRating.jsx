function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) return <span key={i}>★</span>;
        if (i === fullStars && halfStar) return <span key={i}>☆</span>;
        return <span key={i} className="text-gray-300">★</span>;
      })}
    </div>
  );
}

export default StarRating;