const d3 = require("d3");
// const Papa = require("papaparse");
const fs = require('fs');
const stopcock = require('stopcock');
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

const apiKey = process.env.SHOPIFY_APP_KEY;
const apiSecret = process.env.SHOPIFY_APP_SECRET;
const scopes = 'read_products, write_products';
const forwardingAddress = process.env.SHOPIFY_APP_HOST;


const volusionproducts = d3.csv(forwardingAddress+'/csv');
const optCat = require('./public/optCat');
const shopifycategory = optCat.shopifycategory;
const shopifyoptionnames = optCat.shopifyoptionnames;
const shopifyoptionvalues = optCat.shopifyoptionvalues;
var shopifyproducts = new Array();

const getTag = function(id) {
	return shopifycategory[id];
}
const getOptionValue = function(id) {
	return shopifyoptionvalues[id].name;
}
const getOptionName = function(id){
		return !shopifyoptionvalues[id].optioncat?"":shopifyoptionnames[shopifyoptionvalues[id].optioncat]
}

const postNewProduct = stopcock((i, createProductUrl, shopRequestHeaders)=>{
	if(shopifyproducts[i]) {
		// result.push('I am inside of the shopify callback block '+shopifyproducts[i].product.title)
		let newProduct = shopifyproducts[i];
		var date = new Date();
		request.post(createProductUrl, {json: newProduct, headers: shopRequestHeaders})
		.then((res) => {
			if(res.product.id) {
				let timestamp = date.getUTCFullYear()+'-'+(date.getUTCMonth()+1)+'-'+date.getUTCDate()+' '+(date.getUTCHours()-date.getTimezoneOffset()/60)+':'+date.getUTCMinutes()+':'+date.getUTCSeconds();
				console.log(timestamp+' '+'Success!' + ' The index is: '+ i +'\t' + res.product.id + '\t'+res.product.title);
				let data = {
					"timestamp": timestamp,
					"status": "Success!",
					"message": res.product.id + '\t'+res.product.title
				}
				fs.appendFile('log.json', JSON.stringify(data), (err) => {
								if (err) throw err;
				})
			}
		})
		.catch( err => {
			console.log('\x1b[31m%s\x1b[0m', err);
		});
	}
},{limit: 2, interval: 1000, bucketSize: 2})

volusionproducts.then(function(products) {
	var parentproductcode;
	var parentproductindex;
	var isFirstChild, hasNoChild;
	for(index=0; index<products.length; index++)
	{
		let product = products[index];
		let nextProduct = products[index+1];
		let optionname = "";
		let tags = new Array();
		let optionvalues = new Array();
		/*  To determine current product has a child or not
		//	Current product	next product	result
		//	parentproduct	children	may have child
		//	parentproduct	parentproduct	has no child
		//	child	parent	last child
		//	child	child	not last child
		*/

		if(product.ischildofproductcode=="") {//if the current product's ischildofproductcode equals to "" meaning the next product could be child product
			isFirstChild = true;
			// if(nextProduct.ischildofproductcode=="") console.log('this is not the last one'+'\n'+product.productname)
			// console.log('Parent product: ' + product.productname + '\n' +
			// 						'Parent product code: ' + product.productcode + '\n' +
			// 						'Next product: ' + nextProduct.ischildofproductcode)

			// console.log()
			if(!nextProduct || nextProduct.ischildofproductcode=="") hasNoChild = true;
			else if(nextProduct.ischildofproductcode===product.ischildofproductcode) {hasNoChild=false;}

			parentproductcode = product.productcode;
			parentproductindex = shopifyproducts.length;
			// console.log(nextProduct.ischildofproductcode + ' ' + parentproductcode)
			// console.log("The index of volusionproducts: " + index + " " + product.productcode + "\n"
			// 						+ "The index of the shopifyproducts: " + shopifyproducts.length + "\n"
			// 						+ "The index of the parentproduct: " + parentproductindex);

			//convert categoryids to categoryname
			product.categoryids.split(",").forEach(function(categoryid){
				// console.log(getTag(categoryid)); //Testing purpose
				tags.push(getTag(categoryid));
			});

			//convert optionids to otpionvalues
			product.optionids.split(",").forEach(function	(optionid, index){
				if(optionid) {
					// getOptionName(optionid).then( name => {  optionname = name; console.log('The name of option is: ' + optionname);} ).catch( err => console.log(err));
					optionname = getOptionName(optionid);
					optionvalues.push(getOptionValue(optionid));
				} else {
					optionname = "Color";
				}
			});
			// optionname.then(value => console.log(value))
			// if(product.optionids!=""){ //if current product has set options
			if(hasNoChild)
			{
				shopifyproducts.push({
					"product": {
						"title": product.productname,
						"body_html": product.productdescription,
						"product_type": product.categorytree,
						"vendor": product.productmanufacturer,
						"published": product.hideproduct==="Y"?false:true,
						"metafields_global_title_tag": product.productname + " | Luggage City",
						"tags": tags.join(", "),
						"metafields": [
							{
								"namespace": "Product",
								"key": "Features",
								"value": product.features,
								"value_type": "string"
							},
							{
								"namespace": "Product",
								"key": "Specifications",
								"value": product.techspecs,
								"value_type": "string"
							}
						],
						"variants": [
							{
								"title": product.productname,
								"price": product.saleprice?product.saleprice:product.productprice,
								"compare_at_price": product.saleprice?product.productprice:null,
								"sku": product.productcode,
								"inventory_quantity": product.stockstatus,
								"inventory_management": "shopify",
								"fulfillment_service": "manual",
								"requires_shipping": product.freeshippingitem==="Y"?true:false
							}
						],
						"options": [
							{
								"name": optionname,
								"values": optionvalues
							}
						],
						"images": []
					}
				});
			} else {
				shopifyproducts.push({
					"product": {
						"title": product.productname,
						"body_html": product.productdescription,
						"product_type": product.categorytree,
						"vendor": product.productmanufacturer,
						"published": product.hideproduct==="Y"?false:true,
						"metafields_global_title_tag": product.productname + " | Luggage City",
						"tags": tags.join(", "),
						"metafields": [
							{
								"namespace": "Product",
								"key": "Features",
								"value": product.features,
								"value_type": "string"
							},
							{
								"namespace": "Product",
								"key": "Specifications",
								"value": product.techspecs,
								"value_type": "string"
							}
						],
						"options": [
							{
								"name": optionname,
								"values": optionvalues
							}
						],
						"images": []
					}
				});
			}
			for(i=2; i<11; i++) {
				shopifyproducts[parentproductindex].product.images.push({
					"src": product.photourl.replace(/-\d/g, '-'+i)
				})
			}
		} else if(product.ischildofproductcode === parentproductcode){ 		//the current product is a child product and its parent code is parentproductcode
			// console.log(product.ischildofproductcode)
				if(isFirstChild){	//the current product is the first child product of the parent product
					isFirstChild = false;
					shopifyproducts[parentproductindex].product.variants = [];
					shopifyproducts[parentproductindex].product.variants.push(
						{
							"title": product.productname.split(" - ")[1],
							"option1": product.productname.split(" - ")[1],
							"price": product.saleprice?product.saleprice:product.productprice,
							"compare_at_price": product.saleprice?product.productprice:null,
							"sku": product.productcode,
							"inventory_quantity": product.stockstatus,
							"inventory_management": "shopify",
							"fulfillment_service": "manual",
							"requires_shipping": product.freeshippingitem==="Y"?true:false
						}
					);
				} else{	//the current product is not the first child product of the parent product
					shopifyproducts[parentproductindex].product.variants.push(
						{
							"title": product.productname.split(" - ")[1],
							"option1": product.productname.split(" - ")[1],
							"price": product.saleprice?product.saleprice:product.productprice,
							"compare_at_price": product.saleprice?product.productprice:null,
							"sku": product.productcode,
							"inventory_quantity": product.stockstatus,
							"inventory_management": "shopify",
							"fulfillment_service": "manual",
							"requires_shipping": product.freeshippingitem==="Y"?true:false
						}
					);
				}
		}

	}//end of for loop
			console.log(shopifyproducts[shopifyproducts.length-1].product.variants)
})// end of volusionproducts.then(function(products)



app.use("/public", express.static(__dirname + "/public"));

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
  // console.log(shop + '\n' + hmac + '\n' + code);
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

      const createProductUrl = 'https://' + shop + "/admin/products.json";
      const shopRequestHeaders = {
        'X-Shopify-Access-Token': accessToken,
				'HTTP_X_SHOPIFY_SHOP_API_CALL_LIMIT': 80/40
      };
			var result = new Array();
			var error = new Array();
      for(i=0; i<shopifyproducts.length; i++)
      {
				postNewProduct(i, createProductUrl, shopRequestHeaders);
      }
			res.send("Result" + '\n' + result +
								"Error" + '\n' + error);
    })
    .catch( err => {
      res.status(err.statusCode).send(err.error);
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
  console.log('Example app listening on port 3000!');
})
