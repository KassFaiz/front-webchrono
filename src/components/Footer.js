import { Box, Icon, SelectList, Text } from "gestalt";
import Link from "next/link";
import { useContext } from "react";
import { CurrencyContext } from "../context/currencyContext";
import { SiteConfigsContext } from "../context/siteConfigsContext";

export default function Footer() {
  const { switchCurrency, currentCurrency } = useContext(CurrencyContext);
  const { siteConfigs } = useContext(SiteConfigsContext);

  return (
    <Box
      as="footer"
      color="elevationAccent"
      paddingX={3}
      smPaddingX={6}
      mdPaddingX={12}
    >
      <div className="flex flex-col md:flex-row items-start sm:justify-between gap-20">
        <div className="w-full flex items-end md:items-start justify-between md:justify-start md:flex-col flex-wrap md:flex-nowrap gap-4">
          <img
            className="w-[115px] h-[30px] xs:w-[125px] xs:h-[40px] sm:w-[135px] sm:h-[50px] md:w-[150px] md:h-[70px] object-contain"
            src={siteConfigs?.logo || "/logo2.svg"}
            alt="webchrono"
          />
          <div className="w-full xs:w-auto">
            <SelectList
              id="currencySelect"
              label="Devise"
              onChange={({ value }) => switchCurrency(value)}
              size="md"
              value={currentCurrency}
            >
              {[
                { label: "Euro", value: "eur" },
                { label: "Dollar", value: "usd" },
                { label: "Franc (cfa)", value: "xof" },
              ].map(({ label, value }) => (
                <SelectList.Option key={label} label={label} value={value} />
              ))}
            </SelectList>
          </div>
        </div>
        <ul className="w-full md:w-auto flex flex-wrap sm:flex-nowrap md:flex-1 sm:justify-between lg:justify-end gap-14 sm:gap-6 lg:gap-20 mt-6 whitespace-nowrap">
          <li className="flex flex-col gap-6">
            <Text size="300" weight="bold">
              A propos
            </Text>
            <ul className="flex flex-col gap-6">
              <li className="categorie-item">
                <Link href="/a-propos">
                  <Text size="200" weight="bold" color="subtle">
                    Qui sommes-nous?
                  </Text>
                </Link>
              </li>
              <li className="categorie-item">
                <Link href="/conditions-d-utilisation">
                  <Text size="200" weight="bold" color="subtle">
                    Conditions
                  </Text>
                </Link>
              </li>
              <li className="categorie-item">
                <Link href="mentions-legales">
                  <Text size="200" weight="bold" color="subtle">
                    Mentions légales
                  </Text>
                </Link>
              </li>
              <li className="categorie-item">
                <Link href="politique-de-confidentialite">
                  <Text size="200" weight="bold" color="subtle">
                    Politique de confidentialité
                  </Text>
                </Link>
              </li>
            </ul>
          </li>
          <li className="flex flex-col gap-6">
            <Text size="300" weight="bold">
              Réseaux sociaux
            </Text>
            <ul className="flex flex-col gap-6">
              <li className="categorie-item">
                <Link
                  href={siteConfigs?.facebook_link || "#"}
                  target="_blank"
                  className="flex items-center gap-3"
                >
                  <Icon icon="facebook" size={20} color={"subtle"} />
                  <Text size="200" weight="bold" color="subtle">
                    Facebook
                  </Text>
                </Link>
              </li>
              <li className="categorie-item">
                <Link
                  href={siteConfigs?.pinterest_link || "#"}
                  target="_blank"
                  className="flex items-center gap-3"
                >
                  <Icon icon="pinterest" size={20} color={"subtle"} />
                  <Text size="200" weight="bold" color="subtle">
                    Pinterest
                  </Text>
                </Link>
              </li>
              <li className="categorie-item">
                <Link
                  href={siteConfigs?.instagram_link || "#"}
                  target="_blank"
                  className="flex items-center gap-3"
                >
                  <Icon icon="instagram" size={20} color={"subtle"} />
                  <Text size="200" weight="bold" color="subtle">
                    Instagram
                  </Text>
                </Link>
              </li>
              {siteConfigs?.twitter_link && (
                <li className="categorie-item">
                  <Link
                    href={siteConfigs?.twitter_link || "#"}
                    target="_blank"
                    className="flex items-center gap-3"
                  >
                    <Icon icon="twitter" size={20} color={"subtle"} />
                    <Text size="200" weight="bold" color="subtle">
                      Twitter
                    </Text>
                  </Link>
                </li>
              )}
              {siteConfigs?.whatsapp_link && (
                <li className="categorie-item">
                  <Link
                    href={siteConfigs?.whatsapp_link || "#"}
                    target="_blank"
                    className="flex items-center gap-3"
                  >
                    <Icon icon="whats-app" size={20} color={"subtle"} />
                    <Text size="200" weight="bold" color="subtle">
                      WhatsApp: {siteConfigs?.whatsapp_link.split("/").pop()}
                    </Text>
                  </Link>
                </li>
              )}
            </ul>
          </li>
          <li className="flex flex-col gap-6">
            <Text size="300" weight="bold">
              Support
            </Text>
            <ul className="flex flex-col gap-6">
              <li className="categorie-item">
                <Link href={siteConfigs?.help_link || "#"} target="_blank">
                  <Text size="200" weight="bold" color="subtle">
                    Aide
                  </Text>
                </Link>
              </li>
              <li className="categorie-item">
                <Link href="/contact">
                  <Text size="200" weight="bold" color="subtle">
                    Contact
                  </Text>
                </Link>
              </li>
            </ul>
          </li>
          <li className="flex flex-col gap-6">
            <Text size="300" weight="bold">
              Paiement
            </Text>
            <ul className="flex flex-col gap-6">
              <li className="categorie-item">
                <Text size="200" weight="bold" color="subtle">
                  Visa
                </Text>
              </li>
              <li className="categorie-item">
                <Text size="200" weight="bold" color="subtle">
                  Mastercard
                </Text>
              </li>
              <li className="categorie-item">
                <Text size="200" weight="bold" color="subtle">
                  Western Union
                </Text>
              </li>
              <li className="categorie-item">
                <Text size="200" weight="bold" color="subtle">
                  Mobile Money
                </Text>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="mt-20">
        <Text color="subtle" size="200" weight="bold">
          © WebChrono {new Date().getFullYear()}
        </Text>
      </div>
    </Box>
  );
}
