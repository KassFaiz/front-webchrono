import { BASE_URL } from "@/defaults";

const addToCart = async (quantity = 1, productId) => {
  const fd = new FormData();
  fd.append("quantity", quantity);
  fd.append("product_id", productId);
  var res = await fetch(`${BASE_URL}/api/cart-items/add_product_to_cart/`, {
    method: "POST",
    body: fd,
  });
  var data = await res.json();
  return data;
};

const removeFromCart = async (cartitemId) => {
  try {
    var res = await fetch(`${BASE_URL}/api/cart-items/${cartitemId}/`, {
      method: "DELETE",
    });
    return { status: "success" };
  } catch (error) {
    console.log(JSON.stringify(error));
    return null;
  }
};

export { addToCart, removeFromCart };
