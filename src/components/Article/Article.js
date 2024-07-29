import { Box, Button, Flex, IconButton, Text } from "gestalt";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { CartContext } from "../../context/cartContext";
import { CurrencyContext } from "../../context/currencyContext";
import imageLoader from "../../utils/imageLoader";
import styles from "./Article.module.css";
import { WishlistContext } from "../../context/wishlistContext";

export default function Article({
  article,
  cartitem = null,
  inCarousel = true,
}) {
  const finalArticle = cartitem?.product || article;
  const [isInCart, setIsInCart] = useState(finalArticle?.is_in_cart);
  const [isLiked, setIsLiked] = useState(finalArticle?.is_fav);

  const { cartitems, addToCart, removeFromCart } = useContext(CartContext);
  const { convertCurrency } = useContext(CurrencyContext);
  const { wishlistArticles, toggleLike } = useContext(WishlistContext);

  const isLgScreen = useMediaQuery({ query: "(min-width: 1024px)" });

  useEffect(() => {
    setIsInCart(
      cartitems?.filter((item) => item?.product?.id === finalArticle?.id)
        .length && true
    );
  }, [cartitems]);

  useEffect(() => {
    setIsLiked(
      wishlistArticles?.filter((item) => item?.id === finalArticle?.id)
        .length && true
    );
  }, [wishlistArticles, finalArticle]);

  return (
    <div className={inCarousel ? styles.carousel_article : styles.list_article}>
      <div className="flex flex-col h-full">
        <Link
          href={`/articles/${finalArticle?.id}`}
          className={styles.carousel_article_img_link_wrapper}
        >
          <Image
            loader={imageLoader}
            width={475}
            height={680}
            src={finalArticle?.image}
            alt=""
            className={styles.carousel_article_img}
          />
        </Link>
        <div className="line-clamp-2 mt-3 flex-1">
          <Text as="h3" align="center" weight="bold">
            {finalArticle?.name} {cartitem && `x ${cartitem?.quantity}`}
          </Text>
        </div>
        <Box marginTop={1} marginBottom={3}>
          <Text as="h5" align="center" color="error" weight="bold">
            {convertCurrency(finalArticle?.price)} €
          </Text>
        </Box>
        <Flex>
          {isInCart ? (
            <Button
              text={isLgScreen ? "Retirer du panier" : "Retirer"}
              color="red"
              fullWidth={true}
              iconEnd="shopping-bag"
              onClick={() => removeFromCart(null, finalArticle)}
            />
          ) : (
            <Button
              text={isLgScreen ? "Ajouter au panier" : "Ajouter"}
              color="red"
              fullWidth={true}
              iconEnd="shopping-bag"
              onClick={() => addToCart(1, null, finalArticle)}
            />
          )}
          <IconButton
            icon="heart"
            iconColor={isLiked ? "red" : "gray"}
            onClick={() => toggleLike(finalArticle)}
          />
        </Flex>
      </div>
    </div>
  );
}
