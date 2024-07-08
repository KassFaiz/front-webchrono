import { Box } from "gestalt";
import Image from "next/image";
import AliceCarousel from "react-alice-carousel";
import imageLoader from "../utils/imageLoader";

export default function Banner({ data = [] }) {
  console.log(data);
  return (
    <Box width="100%">
      <AliceCarousel
        className="banner_carousel"
        autoPlay
        autoPlayInterval={5000}
        disableButtonsControls
        responsive={{
          0: {
            items: 1,
          },
        }}
      >
        {data?.map((banner_image) => (
          <a
            key={banner_image.id}
            href={banner_image?.link ? banner_image.link : "#"}
            target={banner_image?.link ? "_blank" : "_self"}
            rel="noreferrer"
          >
            <Image
              loader={imageLoader}
              width={1400}
              height={400}
              src={banner_image?.image}
              alt=""
              className="banner_image"
            />
          </a>
        ))}
      </AliceCarousel>
    </Box>
  );
}
