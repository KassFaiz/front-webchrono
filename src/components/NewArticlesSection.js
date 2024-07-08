import React from "react";
import CarouselSection from "./CarourelSection/CarouselSection";

export default function NewArticlesSection({ products = [] }) {
  return (
    <>
      <CarouselSection
        label="Nouvel Arrivage"
        exploreText="Tout voir"
        exploreLink="/catalogue"
        data={products}
      />
    </>
  );
}
