import { Box, Heading, Text } from "gestalt";
import React from "react";
import { BASE_URL } from "../defaults";
import Head from "next/head";

export default function Contact({ legalNotices }) {
  return (
    <>
      <Head>
        <title>Webchrono | Mentions légales</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="max-w-3xl mx-auto">
        <Box
          paddingX={3}
          smPaddingX={6}
          mdPaddingX={12}
          marginTop={7}
          marginBottom={12}
        >
          <Heading size="600">Mentions légales</Heading>
          <div
            className="formattedTextWrapper mt-10"
            dangerouslySetInnerHTML={{
              __html: legalNotices,
            }}
          ></div>
        </Box>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  let data = null;

  try {
    const res = await fetch(`${BASE_URL}/api/core/configs`);
    if (res.ok) {
      let _data = await res.json();
      data = _data?.length ? _data[0]?.legal_notices : null;
    }
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      legalNotices: data,
    },
  };
};
