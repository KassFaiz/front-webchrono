const getUsedPromoCodes = (cartitems) => {
  var promoCodes = [];
  cartitems.forEach(function (cartitem) {
    promoCodes = [...promoCodes, ...cartitem.used_promo_codes];
  });
  return promoCodes;
};

export default getUsedPromoCodes;
