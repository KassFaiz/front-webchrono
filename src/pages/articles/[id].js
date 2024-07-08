import Breadcrumb from "../../components/Breadcrumb";
import { AuthContext } from "../../context/authContext";
import { CartContext } from "../../context/cartContext";
import { CurrencyContext } from "../../context/currencyContext";
import { BASE_URL } from "../../defaults";
import cookieCutter from "cookie-cutter";
import Cookies from "cookies";
import { Badge, IconButton, SelectList, Tag } from "gestalt";
import { Box, Button, Flex, Heading, Tabs, Text, TextField } from "gestalt";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { useMediaQuery } from "react-responsive";
import imageLoader from "../../utils/imageLoader";
import Head from "next/head";
import { useEffect } from "react";
import { WishlistContext } from "../../context/wishlistContext";

export default function ArticleDetails({ defaultArticle }) {
  const [article, setArticle] = useState(defaultArticle);
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(defaultArticle?.is_in_cart || false);
  const [isLiked, setIsLiked] = useState(defaultArticle?.is_liked || false);
  const [sizes, setSizes] = useState(defaultArticle?.sizes?.split(";"));
  const [selectedSize, setSelectedSize] = useState(
    sizes?.length ? sizes[0] : ""
  );

  const { wishlistArticles, toggleLike } = useContext(WishlistContext);
  const { cartitems, addToCart, removeFromCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const { convertCurrency } = useContext(CurrencyContext);

  useEffect(() => {
    setIsInCart(
      cartitems?.filter((item) => item?.product?.id === article?.id).length &&
        true
    );
  }, [article, cartitems]);

  useEffect(() => {
    setIsLiked(
      wishlistArticles?.filter((item) => item?.id === defaultArticle?.id)
        .length && true
    );
  }, [wishlistArticles, defaultArticle]);

  return (
    <>
      <Head>
        <title>Webchrono | {article?.name}</title>
        <meta
          name="description"
          content={`${article?.name}: ${article?.description}`}
        ></meta>
        <meta property="og:title" content={article?.name} />
        <meta
          property="og:url"
          content={`https://webchrono.vercel.app/articles/${article?.id}`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content={`${article?.name}: ${article?.description}`}
        />
        <meta property="og:image" content={article?.image} />

        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content={article?.name} />
        <meta
          property="twitter:description"
          content={`${article?.name}: ${article?.description}`}
        />
        <meta
          property="twitter:url"
          content={`https://webchrono.vercel.app/articles/${article?.id}`}
        />
        <meta property="twitter:image" content={article?.image} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Box
          paddingX={3}
          smPaddingX={6}
          mdPaddingX={12}
          marginTop={3}
          smMarginTop={7}
          marginBottom={12}
        >
          <Breadcrumb
            pagesList={[
              {
                text: "Accueil",
                url: "/",
              },
              {
                text: "articles",
                url: "/catalogue",
              },
              {
                text: article?.name,
                url: "#",
              },
            ]}
          />
          <Box marginTop={3} smMarginTop={7}>
            <div className="flex flex-col sm:flex-row items-start sm450:items-center md:items-start sm:justify-between gap-8 lg:gap-16">
              <ProductImageGallery
                images={[
                  { id: new Date(), file: article?.image },
                  ...article?.secondary_images,
                ]}
              />
              <div className="flex-1 w-full sm:w-auto lg:min-w-[350px]">
                {/* ---------Categorie-------- */}
                <ul className="flex gap-2 flex-wrap uppercase font-bold -mb-2">
                  <Link
                    href={
                      article?.category?.name
                        ? `/catalogue?categorie=${article?.category?.name}`
                        : "#"
                    }
                  >
                    <Text size="100" weight="bold" color="error">
                      #{article?.category?.name}
                    </Text>
                  </Link>
                  {article?.tags
                    ?.replace(" ", "")
                    ?.split(";")
                    ?.map((tag) => (
                      <Link key={tag} href={`/catalogue?tag=${tag}`}>
                        <Text size="100" weight="bold" color="error">
                          #{tag}
                        </Text>
                      </Link>
                    ))}
                </ul>
                {/* ---------Nom-------- */}
                <Heading size="600">{article?.name}</Heading>
                {/* ---------Prix-------- */}
                <Box marginTop={5}>
                  <Heading size="500" color="error">
                    {convertCurrency(article?.price)}
                  </Heading>
                </Box>
                {/* ---------Variation de prix et livraison-------- */}
                <Flex justifyContent="between">
                  <Box marginTop={1}>
                    <Flex>
                      <Text color="subtle">
                        {article?.quantity} en stock actuellement
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
                {/* ---------Ajout au panier-------- */}
                <Box marginTop={7}>
                  {!isInCart && sizes?.length && (
                    <Box marginBottom={4}>
                      <SelectList
                        id="sizes-select"
                        label="Tailles"
                        onChange={({ value }) => setSelectedSize(value)}
                        size="lg"
                      >
                        {sizes?.map((size) => (
                          <SelectList.Option
                            key={size}
                            label={size}
                            value={size}
                          />
                        ))}
                      </SelectList>
                    </Box>
                  )}
                  <div className="flex items-end gap-2 xs:whitespace-nowrap">
                    {!isInCart && (
                      <Box marginRight={1} width={70}>
                        <TextField
                          label="Quantité"
                          value={quantity}
                          onChange={(data) => setQuantity(data.value)}
                        />
                      </Box>
                    )}
                    <div className="flex-1">
                      {isInCart ? (
                        <Button
                          color="red"
                          text="Retirer du panier"
                          fullWidth
                          iconEnd="trash-can"
                          onClick={() => removeFromCart(null, article)}
                        />
                      ) : (
                        <Button
                          color="red"
                          text="Ajouter au panier"
                          fullWidth
                          iconEnd="shopping-bag"
                          onClick={() =>
                            addToCart(quantity, selectedSize, article)
                          }
                        />
                      )}
                    </div>
                    <IconButton
                      icon="heart"
                      iconColor={isLiked ? "red" : "gray"}
                      onClick={() => toggleLike(article)}
                    />
                  </div>
                </Box>
              </div>
            </div>
          </Box>
        </Box>

        {/* ---------Description et avis-------- */}
        <Box
          marginTop={7}
          paddingX={3}
          smPaddingX={6}
          mdPaddingX={12}
          marginBottom={12}
        >
          <Flex alignContent="center">
            <Tabs
              activeTabIndex={0}
              onChange={null}
              tabs={[{ href: "#", text: "Description" }]}
              wrap
            />
          </Flex>
          <div className="mt-2 w-full sm:max-h-[200px] overflow-y-auto">
            <Text>{article?.description}</Text>
          </div>
        </Box>
      </div>
    </>
  );
}

const ProductImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(
    images?.length ? images[0]?.file : null
  );

  const isSmScreen = useMediaQuery({ query: "(max-width: 640px)" });

  const getAbsoluteURL = (imageUrl) => {
    return imageUrl?.startsWith("http") ? imageUrl : `${BASE_URL}${imageUrl}`;
  };

  return (
    <div className="w-full flex-1 flex flex-col-reverse md:flex-row gap-4">
      <div className="overflow-x-auto md:overscroll-x-none md:overflow-y-auto h-[35px] md:h-full md:w-[50px]">
        <div className="flex md:flex-col gap-2">
          {images?.map((image, index) => (
            <Image
              loader={imageLoader}
              key={image?.id}
              width={50}
              height={80}
              className={`w-full min-h-full max-w-[35px] md:max-w-[50px] max-h-[35px] md:max-h-[80px] border border-solid border-[#e6002360] cursor-pointer ${
                image?.file?.includes(selectedImage) ? "!border-4" : ""
              }`}
              src={getAbsoluteURL(image?.file)}
              alt={`Image secondaire ${index + 1}`}
              onClick={() => setSelectedImage(image?.file)}
            />
          ))}
        </div>
      </div>
      <Image
        loader={imageLoader}
        width={475}
        height={680}
        className={`flex-1 p-2 ${
          isSmScreen ? "w-full max-h-[40vh] object-contain" : ""
        } md:max-w-[375px] sm:aspect-[1/1.3] border border-solid border-[#e6002360] rounded-[10px]`}
        src={getAbsoluteURL(selectedImage)}
        alt="Image principal"
      />
    </div>
  );
};

export const getServerSideProps = async ({ req, res, params }) => {
  let articleId = params.id;
  let data = null;

  const isServer = !!req;
  const cookies = new Cookies(req, res);
  const token = isServer ? cookies.get("token") : cookieCutter.get("token");
  const fingerprint = isServer
    ? cookies.get("fingerprint")
    : cookieCutter.get("fingerprint");
  let reqHeader = {
    headers: token
      ? {
          Authorization: "Token " + token,
          fingerprint,
        }
      : {
          fingerprint,
        },
  };

  try {
    const res = await fetch(`${BASE_URL}/api/products/${articleId}`, reqHeader);
    if (res.status === 200 || res.status === 201) {
      data = await res.json();
      console.log(data.is_in_cart);
    }
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      defaultArticle: data,
    },
  };
};
