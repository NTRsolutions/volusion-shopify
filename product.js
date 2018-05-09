const d3 = require('d3');
const optCat = require('./public/optCat');
const dotenv = require('dotenv').config();

const forwardingAddress = process.env.SHOPIFY_APP_HOST;
const volusionproducts = d3.csv(forwardingAddress+'/csv');
const shopifycategory = optCat.shopifycategory;
const shopifyoptionnames = optCat.shopifyoptionnames;
const shopifyoptionvalues = optCat.shopifyoptionvalues;


let shopifyproducts = new Array();

const getTag = function(id) {
	return shopifycategory[id];
}
const getOptionValue = function(id) {
	return shopifyoptionvalues[id].name;
}
const getOptionName = function(id){
		return !shopifyoptionvalues[id].optioncat?"":shopifyoptionnames[shopifyoptionvalues[id].optioncat]
}


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
			console.log("shopifyproducts is ready and the total amount is: "+shopifyproducts.length-1);
})// end of volusionproducts.then(function(products)

module.exports = {
	shopifyproducts
}
