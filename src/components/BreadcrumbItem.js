import React from "react";
import { Flex, Text, Icon, Box } from "gestalt";
import Link from "next/link";

export default function BreadcrumbItem({ item, last = false }) {
  return (
    <Flex alignItems="center">
      <Link href={item?.url}>
        <Text size={100}>{item?.text}</Text>
      </Link>
      {!last && (
        <Box paddingX={2}>
          <Icon icon="arrow-forward" size={10} />
        </Box>
      )}
    </Flex>
  );
}
