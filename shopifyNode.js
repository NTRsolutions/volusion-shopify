const Shopify = require('shopify-api-node');
const shopifyAPI = require('shopify-node-api');

// const options = {
// shopName: 'KJmanson',
// apiKey: 'b9f585c1a3cd6fa1a193d9f135001f16',
// password: '07b794904f620b38dde2132b859c8534'
// // accessToken: 'e24cbcf7ef6274d573a1dd4e16cc2ab2'
// }
//
// var kjamson = new Shopify(options);
//
// kjamson.product.list().catch(err => console.log(err));


const config = {
shop: 'kjmanson',
shopify_api_key: 'b9f585c1a3cd6fa1a193d9f135001f16',
access_token: '07b794904f620b38dde2132b859c8534'
// accessToken: 'e24cbcf7ef6274d573a1dd4e16cc2ab2'
}

var kjamson = new shopifyAPI(config);

kjamson.get('/admin/shop.json', function(err, data, headers) {
  if(err) console.log(err);
  console.log(data);
  console.log(headers);
})
