import React from "react";
import { Flex } from "gestalt";
import BreadcrumbItem from "./BreadcrumbItem";

export default function Breadcrumb({ pagesList = [] }) {
  return (
    <Flex alignItems="center">
      {pagesList.map((page, index) => (
        <BreadcrumbItem item={page} last={index === pagesList.length - 1} />
      ))}
    </Flex>
  );
}
