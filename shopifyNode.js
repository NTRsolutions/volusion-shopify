const Shopify = require('shopify-api-node');
const shopifyAPI = require('shopify-node-api');

// const options = {
// shopName: 'KJmanson',
// apiKey: SHOPIFY_APP_KEY,
// password: SHOPIFY_APP_SECRET
// }
//
// var kjamson = new Shopify(options);
//
// kjamson.product.list().catch(err => console.log(err));


const config = {
shop: 'kjmanson',
shopify_api_key: 'SHOPIFY_APP_KEY',
access_token: 'SHOPIFY_APP_SECRET'
}

var kjamson = new shopifyAPI(config);

kjamson.get('/admin/shop.json', function(err, data, headers) {
  if(err) console.log(err);
  console.log(data);
  console.log(headers);
})
