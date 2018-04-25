//test codes in Chrome web dev tool
const shopifycategory = {"1477":"Business & Tech","1513":"Handbags","1516":"Briefcase","1517":"Wheeled Briefcase","1630":"Shipping","1631":"Returns","1669":"Site Help / FAQ","1670":"About Us","1814":"Luggage","1815":"Hardcase Luggage","1816":"Softside Luggage","1817":"Two-wheel Upright","1819":"Four-wheel Spinner","1820":"Two-wheel Upright","1821":"Four-wheel Spinner","1822":"Backpacks","1823":"Garment Bags","1827":"Kids","1829":"New Arrival","1857":"Brand","1858":"Samsonite","1859":"Delsey","1860":"Lug","1861":"LeSportsac","1862":"Mancini","1863":"Verage","1864":"Briggs & Riley","1867":"Jansport","1881":"Pacsafe","1883":"Laptop & Tablet Bags","1892":"Accessories","1893":"Wallet","1894":"Travel Accessories","1895":"Men's Wallet","1896":"Ladies' Wallet","1903":"Heys","1907":"High Sierra","1909":"Swiss Gear","1914":"Secrid","1916":"Aoking","1919":"Carry-on (under 22\")","1920":"Medium (23\"-26\")","1921":"Large (27\"-30\")","1922":"Nohoo","1930":"Lunch Bag","1933":"Lewis N Clark","1935":"WillLand Outdoors","1940":"Duffel Bags and Totes","1945":"Sale","1948":"Knomo","1957":"LOQI","1960":"Lipault","1962":"Travelpro","1963":"Rolser","1964":"Fulton","1977":"Shopping Cart","1986":"OGIO","1988":"American Tourister","1991":"Umbrellas","1996":"Kenneth Cole","1998":"Messenger Bag","2007":"Travel Organization","2015":"Laptop/Tablet Backpack","2016":"Rolling Backpacks","2017":"Hiking Backpacks","2018":"Wheeled Duffles","2019":"Sports Duffle","2020":"Wheeled Garment Bags","2021":"Non Wheeled Garment Bags","2022":"Luggage Sets","2023":"Travel Electronics","2027":"Passport Holder","2028":"Backpack Handbags","2029":"Crossbody Bags","2031":"Totes","2032":"Anti-Theft Travel Handbags","2033":"Travel Security","2034":"WestJet","2035":"Samboro","2036":"Others","2039":"Leather Briefcase","2040":"Non-Leather Briefcase","2041":"Backpack","2045":"Trochi","2050":"Luggage","2053":"","2054":"","2055":"Canada Day Sale","2056":"Bestlife","2057":"Locations","2058":"Samsonite Clearance","2059":"CHATELET","2060":"Caumartin","2061":"HONORÉ+","2062":"RFID","2063":"Heys Kids Sale","2064":"Ultra Lite 2.0","2065":"Category","2066":"Lock","2067":"Pacsafe Sale","2068":"Kid's Luggage","2069":"Cyber Monday","2070":"Spring into Saving","2071":"Travel Comfort","2072":"Lug Handbag 20% Off","2073":"FeaturedCarryOn","2074":"FeaturedMedium","2075":"FeaturedLarge","2076":"Contact Us","2078":"Pacsafe Vibe","2079":"Lock","2080":"Luggage Tag","2081":"New Arrival","2082":"Genuine Leather Backpacks","2083":"Genuine Leather Handbags","2084":"Spring into Saving","2085":"Pacsafe Anti-Theft Technology"};

var shopifyproducts = {"products": []};

var volusionproducts = d3.csv('/csv');

volusionproducts.then(function(products) {
	var parentproductcode;
	var parentproductindex;
	var isFirstChild;
	products.forEach(function(product, index){
		console.log("inside the foreach now");
		//identify parent product (productcode, index)
		//write codes here
		console.log("The productcode is: " + product.ischildofproductcode);
		if(product.ischildofproductcode=="") {
			isFirstChild = true; //
			console.log("isFirstChild: " + isFirstChild);
			parentproductcode = product.productcode;
			parentproductindex = index;
			console.log(parentproductcode, parentproductindex);
		//if it is parent product, add one more product to JSON object
		shopifyproducts.products.push({
			"title": product.productname,
			"body_html": product.productdescription,
			"product_type": product.categorytree,
			"vendor": product.productmanufacturer,
		});
		var tag = product.categoryids.split(",");
		tag.forEach(function(value) {
			let cat = shopifycategory[value] +", ";
			shopifyproducts.products[index].tag += cat ;
		})

		console.log(shopifyproducts);
	} else if(product.ischildofproductcode === parentproductcode){ 		//if it is child product, match the ischildofproductcode with the parent ProductCode
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
