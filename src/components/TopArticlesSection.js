import React from "react";
import CarouselSection from "./CarourelSection/CarouselSection";

export default function TopArticlesSection({ products = [] }) {
  return (
    <CarouselSection
      label="Top des ventes"
      exploreText="Tout voir"
      exploreLink="/catalogue"
      data={products}
    />
  );
}
