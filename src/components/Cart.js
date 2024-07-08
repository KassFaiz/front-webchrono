import { CurrencyContext } from "../context/currencyContext";
import {
  Box,
  Button,
  Callout,
  CompositeZIndex,
  FixedZIndex,
  Flex,
  Layer,
  OverlayPanel,
  Table,
  Text,
  TextField,
} from "gestalt";
import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "../context/cartContext";
import Image from "next/image";

export default function Cart() {
  const { closeCart, cartitems, totalPrice, deliveryPrice, totalWeight } =
    useContext(CartContext);
  const { convertCurrency } = useContext(CurrencyContext);

  const HEADER_ZINDEX = new FixedZIndex(10);
  const zIndex = new CompositeZIndex([HEADER_ZINDEX]);

  return (
    <>
      <Layer zIndex={zIndex}>
        <OverlayPanel
          accessibilityDismissButtonLabel="Panier"
          accessibilityLabel="Panier"
          heading="Panier"
          subHeading=""
          onDismiss={closeCart}
          footer={
            <div className="flex justify-end">
              <div className="flex flex-col gap-1 max-w-[230px]">
                <div className="border-t border-gray-800 flex justify-end items-center gap-2">
                  <Text size="100">Poids:</Text>
                  <Box width={150} display="flex" justifyContent="end">
                    <Text size="200" align="end">
                      {totalWeight}Kg
                    </Text>
                  </Box>
                </div>
                <div className="border-t border-gray-800 flex justify-end items-center gap-2">
                  <Text size="100" align="right">
                    Sous-Total:
                  </Text>
                  <Box width={150} display="flex" justifyContent="end">
                    <Text weight="bold" align="end">
                      {convertCurrency(totalPrice)}
                    </Text>
                  </Box>
                </div>
                <Link href="/paiement">
                  <Button
                    text="Passer à la caisse"
                    color="red"
                    onClick={closeCart}
                    fullWidth
                    href="/paiement"
                  />
                </Link>
              </div>
            </div>
          }
          size="md"
        >
          <Box marginTop={5}>
            {cartitems?.length ? (
              <Table accessibilityLabel="Basic Table">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      <Text weight="bold">Image</Text>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Text weight="bold">Nom</Text>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Text weight="bold">Prix</Text>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Text weight="bold">Poids</Text>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Text weight="bold">Taille</Text>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Text weight="bold">Quantité</Text>
                    </Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {cartitems.map((cartitem, i) => (
                    <CartItemsRow key={i} cartitem={cartitem} />
                  ))}
                </Table.Body>
              </Table>
            ) : (
              <Box paddingY={5}>
                <Callout
                  title="Panier vide"
                  message="Parcourez le catalogue et ajouter des produits dans vos favoris"
                  type="info"
                  primaryAction={{
                    label: "Voir le catalogue",
                    href: "/catalogue",
                  }}
                />
              </Box>
            )}
          </Box>
        </OverlayPanel>
      </Layer>
    </>
  );
}

const CartItemsRow = ({ cartitem }) => {
  const [quantity, setQuantity] = useState(cartitem?.quantity || 1);
  const { removeFromCart, editCartitem } = useContext(CartContext);
  const { convertCurrency } = useContext(CurrencyContext);

  return (
    <Table.Row>
      <Table.Cell>
        <Image
          src={cartitem?.product?.image}
          alt={cartitem?.product?.name}
          style={{ width: 30, height: 30 }}
          width={30}
          height={30}
        />
      </Table.Cell>
      <Table.Cell>
        <Text lineClamp={1}>{cartitem?.product?.name}</Text>
      </Table.Cell>
      <Table.Cell>
        <Text>{convertCurrency(cartitem?.product?.price)}</Text>
      </Table.Cell>
      <Table.Cell>
        <Text>{cartitem?.weight || 0} Kg</Text>
      </Table.Cell>
      <Table.Cell>
        <Text>{cartitem?.size}</Text>
      </Table.Cell>
      <Table.Cell>
        <Box width="100%" maxWidth={100}>
          <TextField
            id={`quantity-${cartitem?.id}`}
            onChange={(res) => setQuantity(res.value)}
            type="number"
            value={quantity}
          />
        </Box>
      </Table.Cell>
      <Table.Cell>
        <Flex gap={2} justifyContent="end">
          <Button
            text="Modifier"
            color="red"
            onClick={() => editCartitem(quantity, cartitem)}
            disabled={
              !(quantity && parseInt(quantity) !== parseInt(cartitem?.quantity))
            }
          />
          <Button
            iconEnd="trash-can"
            onClick={() => removeFromCart(cartitem)}
          />
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
};
