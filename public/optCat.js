(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//test codes in Chrome web dev tool
const optCat = require('./optCat');
const shopifycategory = optCat.shopifycategory;
const shopifyoptionnames = optCat.shopifyoptionnames;
const shopifyoptionvalues = optCat.shopifyoptionvalues;
const shopifyproducts = new Array();
const volusionproducts = d3.csv('/csv');
(function(exports) {
	// const shopifyproducts = new Array();
	// const volusionproducts = d3.csv('/csv');

	exports.volusionproducts = volusionproducts;
})(typeof exports === 'undefined'?this['convertion']={}:exports);
const getTag = function(id) {
	return shopifycategory[id];
}
const getOptionValue = function(id) {
	return shopifyoptionvalues[id].name;
}
const getOptionName = function(id) {
	var catid = shopifyoptionvalues[id].optioncat;
	return shopifyoptionnames[catid];
}
//POST a new product
const postShopifyProduct = function(product) {
		var jsonProduct = {"product": product};
		var data = JSON.stringify(jsonProduct);

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
	  if (this.readyState === 4) {
	    console.log(this.responseText);
	  }
	});

	xhr.open("POST", "https://__apiKey:__password@kjamson.myshopify.com/admin/products.json");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

	xhr.send(data);
}

volusionproducts.then(function(products) {
	var parentproductcode;
	var parentproductindex;
	var isFirstChild;

	products.forEach(function(product, index){
		var optionname = "";
		var tags = new Array();
		var optionvalues = new Array();
		// console.log("inside the foreach now");  //testing purpose
		//identify parent product (productcode, index)
		// console.log("The productcode is: " + product.ischildofproductcode);  //testing purpose
		if(product.ischildofproductcode=="") {//if the current product's ischildofproductcode equals to "" meaning the next product could be child product
			isFirstChild = true;
			// console.log("isFirstChild: " + isFirstChild);	//tesing purpose
			//if(!parentproductcode) postShopifyProduct(shopifyproducts[parentproductindex]);// if current product does not have parent product POSR it to shopify
			parentproductcode = product.productcode;
			parentproductindex = index;
			// console.log(parentproductcode, parentproductindex);	//testing purpose

			//convert categoryids to categoryname
			product.categoryids.split(",").forEach(function(categoryid){
				// console.log(getTag(categoryid)); //Testing purpose
				tags.push(getTag(categoryid));
			});

			//convert optionids to otpionvalues
			product.optionids.split(",").forEach(function	(optionid, index){
				optionname = !optionname?getOptionName(optionid):optionname;
				// console.log(optionname);	//testing purpose
				// console.log(getOptionValue(optionid)); //Testing purpose
				optionvalues.push(getOptionValue(optionid));
			})

			// if(product.optionids!=""){ //if current product has set options
				shopifyproducts.push({
					"product": {
						"title": product.productname,
						"body_html": product.productdescription,
						"product_type": product.categorytree,
						"vendor": product.productmanufacturer,
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
				for(i=2; i<11; i++) {
					shopifyproducts[index].product.images.push({
						"src": product.photourl.replace(/-\d/g, '-'+i)
					})
				}
			// }
			// console.log(product.optionids + " : " + optionvalues + "\n" + product.categoryids + " : " + tags);	//testing purpose
			// console.log(shopifyproducts);		//testing purpose
		} else if(product.ischildofproductcode === parentproductcode){ 		//the current product is a child product and its parent code is parentproductcode
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
							"requires_shipping": product.freeshippingitem==="Y"?true:false
						}
					);
				}
		}
	})
})

},{"./optCat":2}],2:[function(require,module,exports){

},{}]},{},[1]);
