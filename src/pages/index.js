import { BASE_URL } from "../defaults";
import { Flex } from "gestalt";
import Banner from "../components/Banner";
import NewArticlesSection from "../components/NewArticlesSection";
import TopArticlesSection from "../components/TopArticlesSection";
import Cookies from "cookies";
import cookieCutter from "cookie-cutter";
import Head from "next/head";
export default function Home({ data }) {
  return (
    <>
      <Head>
        <title>Webchrono | Accueil</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main>
        <Banner data={data?.bannerImages} />
        <div style={{ marginTop: 0 }}>
          <Flex direction="column">
            <TopArticlesSection products={data?.topSalesProducts} />
            <NewArticlesSection products={data?.newProducts} />
          </Flex>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  let data = {
    topSalesProducts: [],
    newProducts: [],
    bannerImages: [],
  };

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
    const res = await Promise.all([
      fetch(`${BASE_URL}/api/products/?tag=new`, reqHeader).then((resp) =>
        resp.json()
      ),
      fetch(`${BASE_URL}/api/products/?tag=topsale`, reqHeader).then((resp) =>
        resp.json()
      ),
      fetch(`${BASE_URL}/api/banner-images`, reqHeader).then((resp) =>
        resp.json()
      ),
    ]);
    data = {
      topSalesProducts: res[1],
      newProducts: res[0],
      bannerImages: res[2],
    };
  } catch (error) {
    console.log("error", error);
  }

  return {
    props: {
      data: data,
    },
  };
};
