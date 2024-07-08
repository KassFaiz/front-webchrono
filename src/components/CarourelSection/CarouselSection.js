import { Box, Flex, Heading, Text } from "gestalt";
import React from "react";
import Article from "../Article/Article";
import AliceCarousel from "react-alice-carousel";
import Link from "next/link";

export default function CarouselSection({
  label,
  exploreText,
  exploreLink = "#",
  data = [],
}) {
  return (
    <Box
      paddingX={3}
      smPaddingX={6}
      mdPaddingX={12}
      marginTop={12}
      marginBottom={12}
    >
      <Box marginBottom={5}>
        <Flex justifyContent="between" alignItems="center">
          <Heading size={500}>{label}</Heading>
          <div className="carousel-explore-link-wrapper">
            <Link href={exploreLink}>
              <Text color="error" weight="bold">
                {exploreText}
              </Text>
            </Link>
          </div>
        </Flex>
      </Box>
      <AliceCarousel
        className="banner_carousel"
        autoPlay
        autoPlayInterval={5000}
        disableButtonsControls
        responsive={{
          0: {
            items: 1,
          },
          320: {
            items: 2,
          },
          640: {
            items: 3,
          },
          768: {
            items: 4,
          },
        }}
      >
        {data.map((item, i) => (
          <Article key={i} article={item} />
        ))}
      </AliceCarousel>
    </Box>
  );
}
