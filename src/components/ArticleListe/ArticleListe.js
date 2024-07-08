import Article from "../Article/Article";

export default function ArticleListe({
  data = [],
  isCartitemsList = false,
  handleCartitemRemoval,
  handleRemoveFromFavs,
  likes,
}) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-3 md:gap-x-6 gap-y-8 md:gap-y-14">
      {data &&
        data.map &&
        data?.map((product) => (
          <Article
            key={product.id}
            article={isCartitemsList ? null : product}
            cartitem={isCartitemsList ? product : null}
            handleCartitemRemoval={handleCartitemRemoval}
            likes={likes}
            handleRemoveFromFavs={handleRemoveFromFavs}
            inCarousel={false}
          />
        ))}
    </div>
  );
}
