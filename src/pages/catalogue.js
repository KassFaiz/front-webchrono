import cookieCutter from "cookie-cutter";
import Cookies from "cookies";
import { Box, Column, Flex, Heading, SelectList, Text } from "gestalt";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import ArticleListe from "../components/ArticleListe/ArticleListe";
import { BASE_URL } from "../defaults";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Catalogue({ articles = [] }) {
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const urlSearchParams = useSearchParams();
  let category = urlSearchParams.get("categorie");
  let searchQuery = urlSearchParams.get("recherche");
  const router = useRouter();

  const handleSort = (type = "name_az") => {
    let newList = [...filteredArticles];
    if (type === "name_az") {
      newList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (type === "name_za") {
      newList.sort((a, b) => -1 * a.name.localeCompare(b.name));
    } else if (type === "price+") {
      newList.sort((a, b) => a.price - b.price);
    } else if (type === "price-") {
      newList.sort((a, b) => -1 * (a.price - b.price));
    } else {
      articles;
    }
    setFilteredArticles(newList);
  };

  useEffect(() => {
    articles?.length && setFilteredArticles(articles);
  }, [articles]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      setFilteredArticles(articles);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return (
    <>
      <Head>
        <title>
          Webchrono |{" "}
          {category ||
            (searchQuery ? `Recherche: "${searchQuery}"` : "Catalogue")}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box
        marginTop={7}
        marginBottom={12}
        paddingX={3}
        smPaddingX={6}
        mdPaddingX={12}
      >
        <div className="flex justify-between items-center flex-wrap gap-x-2 gap-y-4">
          <Flex direction="column">
            <Heading align="forceLeft">
              {category ||
                (searchQuery ? `Recherche: "${searchQuery}"` : "Catalogue")}
            </Heading>
            {filteredArticles.length && (
              <Text>
                {filteredArticles.length}{" "}
                {filteredArticles.length > 1
                  ? "articles trouvés"
                  : "article trouvé"}
              </Text>
            )}
          </Flex>
          <div className="w-full sm:w-auto">
            <SelectList
              id="sorting"
              onChange={({ value }) => handleSort(value)}
              size="md"
            >
              {[
                { label: "Classer par", value: "" },
                { label: "Nom - a à z", value: "name_az" },
                { label: "Nom - z à a", value: "name_za" },
                { label: "Prix - croissant", value: "price+" },
                { label: "Prix - décroissant", value: "price-" },
              ].map(({ label, value }) => (
                <SelectList.Option key={label} label={label} value={value} />
              ))}
            </SelectList>
          </div>
        </div>
      </Box>
      <Box
        paddingX={3}
        smPaddingX={6}
        mdPaddingX={12}
        marginTop={7}
        marginBottom={12}
      >
        <ArticleListe data={filteredArticles} />
      </Box>
    </>
  );
}

export const getServerSideProps = async ({ req, res, query }) => {
  let articles = [];
  const reqSearchParams = new URLSearchParams();
  if (query?.categorie) {
    reqSearchParams.set("category", query?.categorie);
  }
  if (query?.recherche) {
    reqSearchParams.set("search_query", query?.recherche);
  }

  const isServer = !!req;
  const cookies = new Cookies(req, res);
  const token = isServer ? cookies.get("token") : cookieCutter.get("token");
  let reqHeader = token
    ? {
        headers: {
          Authorization: "Token " + token,
        },
      }
    : {};

  try {
    var res = await fetch(
      `${BASE_URL}/api/products/?${reqSearchParams.toString()}`,
      reqHeader
    );
    if (res.status === 200 || res.status === 201) {
      articles = await res.json();
    }
  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      articles,
    },
  };
};
