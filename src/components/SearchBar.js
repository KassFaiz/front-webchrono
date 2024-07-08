import React from "react";
import { TextField, Box, Flex, IconButton, SearchField } from "gestalt";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const urlSearchParams = useSearchParams();

  useEffect(() => {
    setSearchQuery(urlSearchParams.get("recherche" || ""));
  }, [urlSearchParams]);

  return (
    <div className="flex-1">
      <Flex>
        <Box width="100%">
          <SearchField
            id="searchbox"
            onChange={(e) => setSearchQuery(e.value)}
            accessibilityLabel="Rechercher des articles"
            accessibilityClearButtonLabel="Réinitialiser la récherche"
            placeholder="Rechercher un article"
            value={searchQuery}
          />
        </Box>
        {searchQuery && (
          <Link href={`/catalogue?recherche=${searchQuery}`}>
            <IconButton icon="search" />
          </Link>
        )}
      </Flex>
    </div>
  );
};
