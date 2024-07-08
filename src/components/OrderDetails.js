import { CurrencyContext } from "../context/currencyContext";
import getUsedPromoCodes from "../utils/getUsedPromoCodes";
import {
  Badge,
  Box,
  Button,
  Callout,
  Column,
  CompositeZIndex,
  Flex,
  Heading,
  Table,
  Text,
} from "gestalt";
import { FixedZIndex } from "gestalt";
import { Layer, OverlayPanel } from "gestalt";
import moment from "moment";
import React, { useContext } from "react";
import { useState } from "react";
import Emitter from "../utils/emitter";
import getOrderStatusMessage from "../utils/getOrderStatusMessage";
import getOrderTotal from "../utils/getOrderTotal";
import { notifySuccess } from "../utils/notify";
import { BASE_URL } from "../defaults";

export default function OrderDetails({ propsOrder, dismissDetailsModal }) {
  const [order, setOrder] = useState(propsOrder);

  const { convertCurrency, currentCurrency } = useContext(CurrencyContext);

  const HEADER_ZINDEX = new FixedZIndex(10);
  const zIndex = new CompositeZIndex([HEADER_ZINDEX]);

  const orderStatus = getOrderStatusMessage(order);
  const orderTotal = getOrderTotal(order);
  const usedPromoCodes = getUsedPromoCodes(order?.cart_items);

  const handleDeliveryConfirm = async () => {
    const fd = new FormData();
    fd.append("closed", true);
    let _token = localStorage.getItem("token");
    try {
      var res = await fetch(
        `${BASE_URL}/api/orders/${order.id}/`,
        _token
          ? {
              method: "PATCH",
              body: fd,
              headers: {
                Authorization: "Token " + _token,
              },
            }
          : {}
      );
      var data = await res.json();
      setOrder(data);
      notifySuccess(
        `Félicitations, la commande est close! Merci de nous avoir fait confiance!`
      );
      Emitter.emit("FETCH_ORDERS");
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  };

  const handleAbortion = async () => {
    const fd = new FormData();
    fd.append("status", "aborted");
    fd.append("closed", true);
    let _token = localStorage.getItem("token");
    try {
      var res = await fetch(
        `${BASE_URL}/api/orders/${order.id}/`,
        _token
          ? {
              method: "PATCH",
              body: fd,
              headers: {
                Authorization: "Token " + _token,
              },
            }
          : {}
      );
      var data = await res.json();
      setOrder(data);
      notifySuccess(
        `La commande a été annulée avec succès! Vous serez remboursé très rapidement.`
      );
      Emitter.emit("FETCH_ORDERS");
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  };

  return (
    <Layer zIndex={zIndex}>
      <OverlayPanel
        accessibilityDismissButtonLabel={`Fermer commande ID: ${order.id}`}
        accessibilityLabel={`Commande ID: ${order.id}`}
        heading={`Commande ID: ${order.id}`}
        subHeading={
          <Box marginTop={-8} marginStart={6}>
            <Text>
              Enregistrée le{" "}
              {moment(order.added_date).format("DD MMMM YYYY à hh:mm")}
            </Text>
          </Box>
        }
        onDismiss={dismissDetailsModal}
        footer={
          <Flex alignItems="center" justifyContent="end" gap={2}>
            {order.status === "pending" && (
              <>
                <Button
                  color="red"
                  text="Annuler la commande et me faire rembourser"
                  onClick={handleAbortion}
                />
              </>
            )}
            {order.status === "delivery_started" && (
              <a
                href={order.delivery_tracking_link || "#"}
                target="_blank"
                rel="noreferrer"
              >
                <Button color="red" text="Suivre la livraison" />
              </a>
            )}
            {order.status === "delivery_ended" && order.closed === false && (
              <>
                <Button color="gray" text="Signaler un problème" />
                <Button
                  color="red"
                  text="Confirmer la réception"
                  onClick={handleDeliveryConfirm}
                />
              </>
            )}
          </Flex>
        }
        size="md"
      >
        <Box>
          <Box marginBottom={2}>
            <Flex alignItems="center" gap={2}>
              <Heading size="400">Statut</Heading>
              {order.closed && (
                <Badge position="middle" text="close" type="neutral" />
              )}
            </Flex>
          </Box>
          <Callout
            iconAccessibilityLabel="Info"
            message={orderStatus.message}
            title={orderStatus.title}
            type={orderStatus.type || "info"}
          />
          {order.status === "rejected" && (
            <Box marginTop={5}>
              <Heading size="400">Motif du rejet</Heading>
              {order.motif_rejet || "Aucune raison spécifiée"}
            </Box>
          )}
          <Box marginTop={5}>
            <Heading size="400">Produits achetés</Heading>
            {order.cart_items.length ? (
              <Table accessibilityLabel="Basic Table">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      <Text weight="bold">Image</Text>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Text weight="bold">Nom x Taille</Text>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Text weight="bold">PU x Quantité</Text>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <Text weight="bold">Total</Text>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {order.cart_items.map((cartitem) => (
                    <Table.Row key={cartitem?.id}>
                      <Table.Cell>
                        <img
                          src={cartitem.product.image}
                          alt={cartitem.product.name}
                          style={{ width: 30, height: 30 }}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Text>
                          {cartitem.product.name} - {cartitem?.size || "RAS"}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text>
                          {convertCurrency(cartitem.product.price)}x{" "}
                          {cartitem.quantity}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text>
                          {convertCurrency(
                            parseInt(cartitem.product.price) *
                              parseInt(cartitem.quantity)
                          )}
                        </Text>
                        <Box marginTop={2}>
                          <Flex gap={1} wrap>
                            {cartitem?.used_promo_codes?.map((promocode) => (
                              <Badge
                                key={promocode?.id}
                                text={`${promocode?.code} - ${
                                  promocode?.discount_value
                                }${
                                  promocode?.discount_type === "percentage"
                                    ? "%"
                                    : currentCurrency === "usd"
                                    ? "$"
                                    : currentCurrency === "eur"
                                    ? "€"
                                    : "F CFA"
                                }`}
                                type="darkWash"
                              />
                            ))}
                          </Flex>
                        </Box>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell>
                      <div className="whitespace-nowrap">
                        <Flex justifyContent="between" gap={2}>
                          <Text>Total:</Text>
                          <Text>
                            {convertCurrency(
                              order?.cart_total_price || orderTotal || 0
                            )}
                          </Text>
                        </Flex>
                        <Flex justifyContent="between" gap={2}>
                          <Text>Livraison:</Text>
                          <Text>
                            {convertCurrency(order?.delivery_price || 0)}
                          </Text>
                        </Flex>
                        <Flex justifyContent="between" gap={2}>
                          <Text weight="bold">Total payé:</Text>
                          <Text color="link" weight="bold">
                            {convertCurrency(
                              (order?.cart_total_price || orderTotal) +
                                (order?.delivery_price || 0)
                            )}
                          </Text>
                        </Flex>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            ) : (
              <Text>Aucun produit dans cette commande</Text>
            )}
          </Box>
          <Box marginTop={5}>
            <div className="flex flex-col sm:flex-row gap-y-8 justify-between">
              <Box>
                <Heading size="400">Adresse de livraison</Heading>
                <Box marginTop={2}>
                  <Text>{order.zip_code}</Text>
                  <Text>{order.delivery_adress}</Text>
                  <Text>{order.delivery_adress2}</Text>
                  <Text>
                    {order.ville}, {order.pays}
                  </Text>
                </Box>
              </Box>
              <Box>
                <Heading size="400">Propriétaire</Heading>
                <Box marginTop={2}>
                  <Text>
                    {order.user_firstname} {order.user_lastname}
                  </Text>
                  <Text>{order.email}</Text>
                  <Text>{order.phone}</Text>
                </Box>
              </Box>
            </div>
          </Box>
        </Box>
      </OverlayPanel>
    </Layer>
  );
}
