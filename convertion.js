//test codes in Chrome web dev tool

var shopifyproducts = {"products": []};

var volusionproducts = d3.csv('/csv');

volusionproducts.then(function(products) {
	var parentproductcode;
	var parentproductindex;
	var isFirstChild;
	products.forEach(function(product, index){
		//identify parent product (productcode, index)
		//write codes here
		if(product.ischildofproductcode==undefined) {
			isFirstChild = true; //
			parentproductcode = product.productcode;
			parentproductindex = index;
		//if it is parent product, add one more product to JSON object
		shopifyproducts.products.push({
			"title": product.productname,
			"body_html": product.productdescription,
			"product_type": product.categorytree,
			"vendor": product.productmanufacturer
		})
	} else if(prodcut.ischildofproductcode === parentproductcode){ 		//if it is child product, match the ischildofproductcode with the parent ProductCode
		if(isFirstChild){
			isFirstChild = false;
			shopifyproducts.products[parentproductindex].variants = [];
			shopifyproducts.products[parentproductindex].variants.push();
		} else{
			shopifyproducts.products[parentproductindex].variants.push();
		}
	}


		// if(products[index+1].ischildofproductcode === product.productcode) {}
		//add the children product to parent product variant
		// shopifyproducts.products[parentproductindex].variant = []
		// return; //go to next iteration element

	})
})
