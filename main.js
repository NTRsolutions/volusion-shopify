// const d3 = require("d3");
// const Papa = require("papaparse");
const fs = require('fs');
const dotenv = require('dotenv').config();
var http = require('http');
const express = require('express');
const shopifyExpress = require('@shopify/shopify-express');
const session = require('express-session');
const app = express();



const {
  SHOPIFY_APP_KEY,
  SHOPIFY_APP_HOST,
  SHOPIFY_APP_SECRET,
  NODE_ENV
} = process.env;

app.use("/public", express.static(__dirname + "/public"));

//seesion is necessary for api proxy and auth verification
app.use(session({secret: SHOPIFY_APP_SECRET}));
// 
// const {routes, withShop} = shopifyExpress({
//   host: SHOPIFY_APP_HOST,
//   apiKey: SHOPIFY_APP_KEY,
//   secret: SHOPIFY_APP_SECRET,
//   scope: ['write_orders, write_products'],
//   accessMode: 'offline',
//   afterAuth(req, res) {
//     const {session: {accessToken, shop}} = req;
//     //install webhooks or hook into your own app here ??
//     return res.redirect('/');
//   }
// });

var _shopifyExpress = shopifyExpress({
  host: SHOPIFY_APP_HOST,
  apiKey: SHOPIFY_APP_KEY,
  secret: SHOPIFY_APP_SECRET,
  scope: ['write_orders, write_products'],
  accessMode: 'offline',
  afterAuth: function afterAuth(req, res) {
    var _req$session = req.session,
        accessToken = _req$session.accessToken,
        shop = _req$session.shop;
    //install webhooks or hook into your own app here ??

    return res.redirect('/');
  }
}),
    routes = _shopifyExpress.routes,
    withShop = _shopifyExpress.withShop;


var test = "testing, testing1, testing2";

test.split(", ").forEach(data => console.log(data));

console.log(withShop)

app.use('/shopify', routes);
// app.use('/myApp', withShop({authBaseUrl: '/shopfify'}), myAppMiddleware)

// var csvFile = fs.readFile('./cities');

app.get("/", function(req, res){
  res.sendFile('/index.html', {root: __dirname + '/public'});
});

app.get("/csv", function(req, res){
  res.sendFile('/cities.csv', {root: __dirname + '/public'})
})

app.listen(3000, function(){
  console.log('Example app listening on port 3000!')
})

// d3.csv('/cities.csv');

//
// Papa.parse('./cities.csv', {
//   download: true,
//   complete: function(result) {
//     console.log("Finished: ", result.data);
//   }
// });
