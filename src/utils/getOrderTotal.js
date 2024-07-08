const getOrderTotal = (order) => {
  if (!order) return 0;
  return (
    order.cart_items.reduce(
      (sum, item) => sum + parseInt(item.product.price) * item.quantity,
      0
    ) * 650
  );
};

export default getOrderTotal;
