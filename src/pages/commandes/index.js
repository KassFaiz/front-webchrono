import OrderDetails from "../../components/OrderDetails";
import { AuthContext } from "../../context/authContext";
import { BASE_URL } from "../../defaults";
import Emitter from "../../utils/emitter";
import getOrderStatusMessage from "../../utils/getOrderStatusMessage";
import {
  Badge,
  Box,
  Callout,
  Flex,
  Heading,
  IconButton,
  Table,
  Text,
} from "gestalt";
import moment from "moment/moment";
import React, { useContext, useEffect, useState } from "react";

export default function Commandes() {
  //charger les commandes avec fetch et sauvegarder dans un state
  //afficher les données dans un tableau html
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const { token } = useContext(AuthContext);

  const getData = async () => {
    let _token = localStorage.getItem("token");
    try {
      var res = await fetch(
        `${BASE_URL}/api/orders`,
        _token
          ? {
              headers: {
                Authorization: "Token " + _token,
              },
            }
          : {}
      );
      var data = await res.json();
      setOrders(data);
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  };

  useEffect(() => {
    //Charger les données au chargement de la page
    !token && setOrders([]);
    !token && setActiveOrder(null);
    getData();
    Emitter.on("FETCH_ORDERS", () => getData());
    return () => {
      Emitter.off("FETCH_ORDERS");
    };
  }, [token]);

  return (
    <>
      <Box
        paddingX={3}
        smPaddingX={6}
        mdPaddingX={12}
        marginTop={7}
        marginBottom={12}
      >
        <Box marginBottom={10}>
          <Heading align="left">Mes commandes </Heading>
        </Box>
        {orders?.length ? (
          <Table accessibilityLabel="Basic Table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <Text weight="bold">ID</Text>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Text weight="bold">Date</Text>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Text weight="bold">Status</Text>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Text weight="bold">Destinataire</Text>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Text weight="bold">Adresse de Livraison</Text>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {orders.map((order) => (
                <Table.Row key={order.id}>
                  <Table.Cell>
                    <Text>#{order.id}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="whitespace-nowrap">
                      <Text>
                        {moment(order.added_date).format("DD MMM YYYY à hh:mm")}
                      </Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap={2}>
                      <Badge
                        position="middle"
                        text={getOrderStatusMessage(order).title}
                        type={getOrderStatusMessage(order).type}
                      />
                      {order.closed && (
                        <Badge
                          position="middle"
                          text="Commande close"
                          type="neutral"
                        />
                      )}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>
                      {order.user_firstname} {order.user_lastname}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{order.delivery_adress}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <IconButton
                      accessibilityLabel="Dismiss modal"
                      bgColor="white"
                      icon="arrow-forward"
                      iconColor="darkGray"
                      size="sm"
                      onClick={() => setActiveOrder(order)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <Box paddingY={12}>
            <Callout
              title="Aucune commande"
              message="Vous n'avez fait aucune commande pour le moment"
              type="info"
            />
          </Box>
        )}
      </Box>
      {activeOrder && (
        <OrderDetails
          propsOrder={activeOrder}
          dismissDetailsModal={() => setActiveOrder(null)}
        />
      )}
    </>
  );
}
