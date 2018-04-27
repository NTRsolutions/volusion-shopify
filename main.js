// const d3 = require("d3");
// const Papa = require("papaparse");
const fs = require('fs');
const dotenv = require('dotenv').config();
var http = require('http');
const express = require('express');
// const shopifyExpress = require('@shopify/shopify-express');
const session = require('express-session');
const app = express();
const nonce = require('nonce')();
const cookie = require('cookie')
const querystring = require('querystring');
const crypto = require('crypto');
const request  = require('request-promise');


//
// const {
//   SHOPIFY_APP_KEY,
//   SHOPIFY_APP_HOST,
//   SHOPIFY_APP_SECRET,
//   NODE_ENV
// } = process.env;
const apiKey = process.env.SHOPIFY_APP_KEY;
const apiSecret = process.env.SHOPIFY_APP_SECRET;
const scopes = 'read_products';
const forwardingAddress = process.env.SHOPIFY_APP_HOST;

app.use("/public", express.static(__dirname + "/public"));

//seesion is necessary for api proxy and auth verification
// app.use(session({secret: SHOPIFY_APP_SECRET}));
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
//
// var _shopifyExpress = shopifyExpress({
//   host: SHOPIFY_APP_HOST,
//   apiKey: SHOPIFY_APP_KEY,
//   secret: SHOPIFY_APP_SECRET,
//   scope: ['write_orders, write_products'],
//   accessMode: 'offline',
//   afterAuth: function afterAuth(req, res) {
//     var _req$session = req.session,
//         accessToken = _req$session.accessToken,
//         shop = _req$session.shop;
//     //install webhooks or hook into your own app here ??
//
//     return res.redirect('/');
//   }
// }),
//     routes = _shopifyExpress.routes,
//     withShop = _shopifyExpress.withShop;
//
//
// var test = "testing, testing1, testing2";
//
// test.split(", ").forEach(data => console.log(data));
//
// console.log(withShop)
//
// app.use('/shopify', routes);
// app.use('/myApp', withShop({authBaseUrl: '/shopfify'}), myAppMiddleware)

// var csvFile = fs.readFile('./cities');


//intall route
app.get('/shopify', (req, res) => {
  const shop = req.query.shop;
  if(shop) {
    const state = nonce(); //what does nonce() do?
    const redirectUri  = forwardingAddress + '/shopify/callback';
    const installUrl = 'https://' + shop +
    '/admin/oauth/authorize?client_id=' + apiKey +
    '&scope=' + scopes +
    '&state=' + state +
    '&redirect_uri=' + redirectUri;

    // console.log(redirectUri + '\n' + installUrl);
    res.cookie('state', state);
    res.redirect(installUrl);
  } else {
    return res.status(400).send("Missing shop parameter");
  }
})

//callback route
app.get('/shopify/callback', (req, res) => {
  const { shop, hmac, code, state } = req.query;
  const stateCookie = cookie.parse(req.headers.cookie).state;

  if(state !== stateCookie ){
    return res.status(403).send('Request orgin cannot be verified');
  }
  console.log(shop + '\n' + hmac + '\n' + code);
  if(shop && hmac && code) {
    //validate request is from Shopify using HMAC validation
    const map = Object.assign({}, req.query);
    delete map['signature'];
    delete map['hmac'];
    const message = querystring.stringify(map);
    const providedHmac = Buffer.from(hmac, 'utf-8');
    const generatedHash = Buffer.from(
      crypto
        .createHmac('sha256', apiSecret)
        .update(message)
        .digest('hex'),
        'utf-8'
      );
    let hashEquals = false;
    // timingSafeEqual will prevent any timing attacks. Arguments must be buffers
    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
    // timingSafeEqual will return an error if the input buffers are not the same length.
    } catch (e) {
      hashEquals = false;
    };

    if (!hashEquals) {
      return res.status(400).send('HMAC validation failed');
    }

    //Exchange temporary code for a permanent access token
    const accessToeknRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
    const accessTokenPayload = {
      client_id: apiKey,
      client_secret: apiSecret,
      code,
    };

    request.post(accessToeknRequestUrl, { json: accessTokenPayload})
    .then( accessTokenResponse => {
      const accessToken = accessTokenResponse.access_token;
      //Use access token to make API call to 'shop' endpoint

      const shopRequestUrl = 'https://' + shop + '/admin/products.json';
      const shopRequestHeaders = {
        'X-Shopify-Access-Token': accessToken,
      };

      request.get(shopRequestUrl, {headers: shopRequestHeaders})
      .then( shopResponse => {
        res.send(shopResponse);
      })
      .catch( err => res.status(err.statusCode).send(err.error.error_description));
    })
    .catch( err => {
      res.status(err.statusCode).send(err.error.error_description);
    })
  } else {
    res.status(400).send('Required parameter missing');
  }
})

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
