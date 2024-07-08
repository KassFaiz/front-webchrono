import {
  Avatar,
  Badge,
  Box,
  Button,
  Fieldset,
  Flex,
  Heading,
  Icon,
  IconButton,
  Layer,
  Popover,
  Text,
} from "gestalt";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/authContext";
import { CartContext } from "../context/cartContext";
import { WishlistContext } from "../context/wishlistContext";
import { BASE_URL } from "../defaults";
import groupBy from "../utils/groupBy";
import Logo from "./Logo";
import { SearchBar } from "./SearchBar";
import { SiteConfigsContext } from "../context/siteConfigsContext";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [groupedCategories, setGroupedCategories] = useState([]);
  const [openUserPopover, setOpenUserPopover] = useState(false);
  const [showMobileSearchbar, setShowMobileSearchbar] = useState(false);
  const [showCategoriesBox, setShowCategoriesBox] = useState(false);

  const urlSearchParams = useSearchParams();
  const anchorRef = useRef();
  const router = useRouter();
  const { siteConfigs } = useContext(SiteConfigsContext);

  const { openAuthModal, logout, token, user } = useContext(AuthContext);
  const { openCart, cartitemsTotal } = useContext(CartContext);
  const { wishlistArticles } = useContext(WishlistContext);

  const getData = async () => {
    try {
      fetch(`${BASE_URL}/api/product-categories/`)
        .then(async (categoriesRes) => {
          setCategories(await categoriesRes.json());
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    categories?.length &&
      setGroupedCategories(groupBy(categories, "category_group"));
  }, [categories]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      setShowCategoriesBox(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return (
    <Box
      as="header"
      paddingX={3}
      smPaddingX={6}
      mdPaddingX={12}
      className="header"
    >
      <div className="py-2 border-y border-solid border-[#eeeeee]">
        <Link
          href={siteConfigs?.whatsapp_link || "#"}
          target="_blank"
          className="flex justify-end items-center gap-3"
        >
          <Icon icon="whats-app" size={15} color={"subtle"} />
          <Text size="100" weight="bold" color="dark">
            Contactez-nous sur whatsApp:{" "}
            {siteConfigs?.whatsapp_link.split("/").pop()}
          </Text>
        </Link>
      </div>
      <div className="flex justify-between items-center gap-[25px] mb-5 pt-4">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex-1 hidden sm:flex justify-center">
          <SearchBar />
        </div>
        <div className="flex gap-[10px]">
          <div className="sm:hidden">
            <IconButton
              icon="search"
              size="md"
              iconColor="gray"
              onClick={() => setShowMobileSearchbar(!showMobileSearchbar)}
            />
          </div>
          <Link href={`/favoris`} className="flex justify-center items-center">
            <Box position="relative">
              <IconButton icon="heart" size="sm" iconColor="gray" />
              <div className="badge !-right-[6px]">
                <Badge
                  position="top"
                  text={wishlistArticles?.length || 0}
                  type="error"
                />
              </div>
            </Box>
          </Link>
          <div className="relative flex justify-center items-center">
            <IconButton
              icon="shopping-bag"
              size="sm"
              iconColor="gray"
              onClick={openCart}
            />
            <div className="badge !top-1 !-right-[2px]">
              <Badge position="top" text={cartitemsTotal || 0} type="error" />
            </div>
          </div>
          <div
            ref={anchorRef}
            className="flex justify-center items-center ml-2 cursor-pointer"
            onClick={() => setOpenUserPopover(!openUserPopover)}
          >
            <Avatar size="sm" name={token && user ? user?.username : "Hello"} />
            <IconButton
              accessibilityLabel="Open account popover"
              bgColor="white"
              icon="arrow-down"
              iconColor="gray"
              size="xs"
            />
          </div>
        </div>
      </div>
      {showMobileSearchbar && (
        <div className="flex-1 flex justify-center sm:hidden py-3 border-t border-solid border-[#eeeeee]">
          <SearchBar />
        </div>
      )}
      <div
        className={`sm:relative py-3 border-y border-solid border-[#eeeeee] group ${
          showCategoriesBox ? "expanded" : "group"
        }`}
      >
        <div
          className=""
          onClick={() => setShowCategoriesBox(!showCategoriesBox)}
        >
          <ul className="flex justify-between items-center gap-2 whitespace-nowrap">
            <ul className="flex gap-6 md:gap-12 w-max pointer-events-none overflow-x-auto">
              {categories?.filter((cat) => cat?.category_group === null)
                ?.length <= 0 && (
                <li className="grande-categorie">
                  <Heading size="200" color="default">
                    Categories
                  </Heading>
                </li>
              )}
              {categories
                ?.filter((cat) => cat?.category_group === null)
                .map((cat, i) => {
                  return (
                    <li key={i} className="grande-categorie">
                      <Link
                        href={`/catalogue?categorie=${cat.name}`}
                        className="categorie-item"
                      >
                        <Heading
                          size="200"
                          color={
                            cat.name === urlSearchParams.get("categorie")
                              ? "error"
                              : "default"
                          }
                        >
                          {cat.name}
                        </Heading>
                      </Link>
                    </li>
                  );
                })}
            </ul>
            <li className="grande-categorie flex items-center gap-1">
              <Heading size="200" color="default">
                Tout voir
              </Heading>
              <IconButton icon="arrow-down" size="xs" />
            </li>
          </ul>
        </div>
        <div className="fixed sm:absolute top-5 sm:group-hover:top-0 group-[.expanded]:top-0 left-0 opacity-0 sm:group-hover:opacity-100 group-[.expanded]:opacity-100 pointer-events-none sm:group-hover:pointer-events-auto group-[.expanded]:pointer-events-auto transition-all duration-300 w-full h-screen sm:h-[500px] bg-white shadow-md z-50 p-5 overflow-y-auto">
          <div className="flex justify-between items-center pb-5 border-b border-solid border-[#eeeeee]">
            <div
              className="flex"
              onClick={() => setShowCategoriesBox(!showCategoriesBox)}
            >
              {showCategoriesBox && <IconButton icon="cancel" />}
              <Heading size="500">
                {showCategoriesBox ? "Fermer" : "Categories"}
              </Heading>
            </div>
            <Link href={`/catalogue`} className="categorie-item">
              <Heading
                size="300"
                color={
                  router.pathname.includes("catalogue") &&
                  !urlSearchParams.get("categorie")
                    ? "error"
                    : "default"
                }
              >
                Tous les articles
              </Heading>
            </Link>
          </div>
          <ul className="w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-x-12 md:gap-y-6 mt-5">
            {/* Catégories avec sous-catégories */}
            {Object.keys(groupedCategories)
              ?.filter(
                (catgroup) => catgroup !== "undefined" && catgroup !== "null"
              )
              ?.map((catgroup, i) => {
                return (
                  <li key={i} className="flex-1">
                    <Link
                      href={`/catalogue?categorie=${catgroup}`}
                      className="categorie-item"
                    >
                      <Heading
                        size="300"
                        color={
                          catgroup === urlSearchParams.get("categorie")
                            ? "error"
                            : "default"
                        }
                      >
                        {catgroup !== "undefined" && catgroup !== "null"
                          ? catgroup
                          : "Categories"}
                      </Heading>
                    </Link>
                    {/* sous-catégories */}
                    <ul className="flex flex-col sm:h-[140px] flex-wrap gap-y-4 gap-x-2 mt-4">
                      {groupedCategories[catgroup]
                        ?.filter((cat) => cat?.category_group !== null)
                        ?.map((cat, index) => (
                          <li key={index}>
                            <Link
                              href={`/catalogue?categorie=${cat.name}`}
                              className="categorie-item"
                            >
                              <Heading
                                size="200"
                                color={
                                  cat.name === urlSearchParams.get("categorie")
                                    ? "error"
                                    : "subtle"
                                }
                              >
                                {cat.name}
                              </Heading>
                            </Link>
                          </li>
                        ))}
                      <li>
                        <Link
                          href={`/catalogue?categorie=${catgroup}`}
                          className="categorie-item"
                        >
                          <Heading
                            size="200"
                            color={
                              catgroup === urlSearchParams.get("categorie")
                                ? "error"
                                : "subtle"
                            }
                          >
                            Tout voir
                          </Heading>
                        </Link>
                      </li>
                    </ul>
                  </li>
                );
              })}

            {/* Catégories sans sous-catégories */}
            {groupedCategories["null"]
              ?.filter(
                (cat) =>
                  groupedCategories[cat?.name] === undefined ||
                  groupedCategories[cat?.name] === null
              )
              ?.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/catalogue?categorie=${cat?.name}`}
                    className="categorie-item"
                  >
                    <Heading
                      size="300"
                      color={
                        cat?.name === urlSearchParams.get("categorie")
                          ? "error"
                          : "default"
                      }
                    >
                      {cat?.name !== "undefined" && cat?.name !== "null"
                        ? cat?.name
                        : "Categories"}
                    </Heading>
                  </Link>

                  {/* Lien pour tout voir de la catégorie */}
                  <ul className="flex flex-col sm:h-[140px] flex-wrap gap-y-4 gap-x-2 mt-4">
                    <li className="flex-1">
                      <Link
                        href={`/catalogue?categorie=${cat?.name}`}
                        className="categorie-item"
                      >
                        <Heading
                          size="200"
                          color={
                            cat?.name === urlSearchParams.get("categorie")
                              ? "error"
                              : "subtle"
                          }
                        >
                          Tout voir
                        </Heading>
                      </Link>
                    </li>
                  </ul>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {openUserPopover && (
        <Layer>
          <Popover
            accessibilityLabel="Save to board"
            anchor={anchorRef.current}
            id="account-links"
            idealDirection="down"
            onDismiss={() => setOpenUserPopover(!openUserPopover)}
            positionRelativeToAnchor={false}
            size="xl"
          >
            <Box padding={4}>
              <Flex direction="column" gap={3}>
                {
                  <Fieldset legend="Hello">
                    <Box paddingX={4}>
                      <Text size="300" weight="bold">
                        {token
                          ? user?.username || user?.email
                          : "Veuillez vous connecter"}
                      </Text>
                    </Box>
                  </Fieldset>
                }
                {token && (
                  <Fieldset legend="Compte">
                    <Flex direction="column">
                      <Link href="/commandes">
                        <Button
                          text="Mes commandes"
                          color="transparent"
                          iconEnd="terms"
                          fullWidth
                        />
                      </Link>
                      <Link href="/compte">
                        <Button
                          text="Paramètres de compte"
                          color="transparent"
                          iconEnd="person"
                          fullWidth
                        />
                      </Link>
                    </Flex>
                  </Fieldset>
                )}
                <Fieldset legend="Plus d'options">
                  <Flex direction="column">
                    <Link href="/conditions-d-utilisation">
                      <Button
                        text="Conditions d'utilisation"
                        color="transparent"
                        iconEnd="arrow-up-right"
                        fullWidth
                      />
                    </Link>
                    <Link href="/politique-de-confidentialite">
                      <Button
                        text="Politiques de confidentialité"
                        color="transparent"
                        iconEnd="arrow-up-right"
                        fullWidth
                      />
                    </Link>
                    <Link href="/contact">
                      <Button
                        text="Contact"
                        color="transparent"
                        iconEnd="arrow-up-right"
                        fullWidth
                      />
                    </Link>
                    <Link href="/contact">
                      <Button
                        text="Aide"
                        color="transparent"
                        iconEnd="arrow-up-right"
                        fullWidth
                      />
                    </Link>
                  </Flex>
                </Fieldset>
                <Fieldset legend="Session">
                  <Flex direction="column">
                    {token ? (
                      <Button
                        text="Me déconnecter"
                        color="transparent"
                        iconEnd="logout"
                        fullWidth
                        onClick={logout}
                      />
                    ) : (
                      <Button
                        text="Me connecter"
                        color="transparent"
                        iconEnd="person"
                        fullWidth
                        onClick={openAuthModal}
                      />
                    )}
                  </Flex>
                </Fieldset>
              </Flex>
            </Box>
          </Popover>
        </Layer>
      )}
    </Box>
  );
}
