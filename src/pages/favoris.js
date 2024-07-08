import { Box, Callout, Heading } from "gestalt";
import Head from "next/head";
import { useContext } from "react";
import ArticleListe from "../components/ArticleListe/ArticleListe";
import { WishlistContext } from "../context/wishlistContext";

export default function Favoris() {
  const { setWishlistArticles, wishlistArticles: articles } =
    useContext(WishlistContext);

  return (
    <>
      <Head>
        <title>Webchrono | Mes Favoris</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box
        paddingX={3}
        smPaddingX={6}
        mdPaddingX={12}
        marginTop={7}
        marginBottom={12}
      >
        <Box marginBottom={12}>
          <Heading align="center">Mes favoris</Heading>
        </Box>
        {articles?.length ? (
          <ArticleListe data={articles} />
        ) : (
          <Box paddingY={12}>
            <Callout
              title="Aucun produit"
              message="Parcourez le catalogue pour pouvoir ajouter des produits dans vos favoris"
              type="info"
              primaryAction={{
                label: "Voir le catalogue",
                href: "/catalogue",
              }}
            />
          </Box>
        )}
      </Box>
    </>
  );
}
