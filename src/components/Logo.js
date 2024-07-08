import Image from "next/image";
import imageLoader from "../utils/imageLoader";
import { SiteConfigsContext } from "../context/siteConfigsContext";
import { useContext } from "react";

function Logo({}) {
  const { siteConfigs } = useContext(SiteConfigsContext);
  return (
    <Image
      loader={imageLoader}
      width={75}
      height={50}
      className="min-w-[35px] min-h-[10px] xs:min-w-[45px] xs:min-h-[20px] sm:min-w-[55px] sm:min-h-[30px] md:w-[75px] md:h-[50px] object-contain"
      src={siteConfigs?.logo || "/logo.svg"}
      alt="webchrono"
    />
  );
}

export default Logo;
