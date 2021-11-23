const axios = require("axios");

const getProductUrl = (product_id) =>
  `https://www.amazon.com/gp/aod/ajax/?asin=${product_id}&m=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=8-1&pc=dp`;

const getPrices = (product_id) => {
  const productUrl = getProductUrl(product_id);
  const { data } = axios.get(productUrl);
  console.log(data);
};

getPrices("B0002E4Z8M");
