const d3 = require('d3');
const dotenv = require('dotenv').config();

const forwardingAddress = process.env.SHOPIFY_APP_HOST;

var shippingMethod = {"103": { "title": "Free In-store Pickup (Woodbridge)","source": ""}, "301": { "title": "Canada Post Regular", "source": "CANADAPOST"}, "302": { "title": "Canada Post Expedited", "source": "CANADAPOST"}, "303": { "title": "Canada Post Xpresspost", "source": "CANADAPOST"}, "305": { "title": "Canada Post Xpresspost USA", "source": "CANADAPOST"}, "307": { "title": "Canada Post Expedited US Commercial", "source": "CANADAPOST"}, "308": { "title": "Canada Post Expedited US", "source": "CANADAPOST"}, "310": { "title": "Canada Post International Parcelce","source": "CANADAPOST"}, "311": { "title": "Canada Post Small Packet International", "source": "CANADAPOST"}, "312": { "title": "Canada Post Small Packet Internationalce","source": "CANADAPOST"}, "313": { "title": "Canada Post International Parcel Air", "source": "CANADAPOST"}, "314": { "title": "Canada Post XPressPost International", "source": "CANADAPOST"}, "920": { "title": "Free Shipping - Canada Post Standard", "source": "CANADAPOST"}, "921": { "title": "Free Shipping on Orders $99 or more", "source": ""}, "922": { "title": "Canada Post Tracked Packet - USA 6 Business Days", "source": ""}, "923": { "title": "Canada Post Tracked Packet - USA 6 Business Days", "source": ""}, "924": { "title": "Canada Post Expedited - USA", "source": "CANADAPOST"}, "929": { "title": "Free In-store Pickup (Market Village)", "source": ""}, "930": { "title": "Penguin Pick-Up (Lawrence/Keele)", "source": "CANADAPOST"}, "931": { "title": "Penguin Pick-Up (Lawrence & Keele)", "source": "CANADAPOST"}, "932": { "title": "Penguin Pick-Up (Eglinton & Warden)", "source": "CANADAPOST"}, "933": { "title": "Penguin Pick-Up (Hwy 7 & Edgeley)", "source": "CANADAPOST"}, "934": { "title": "Penguin Pick-Up (Hwy 7 & Edgeley)", "source": "CANADAPOST"}, "935": { "title": "Free In-store Pickup (College Park)", "source": ""}, "936": { "title": "Fixed Shipping Fee", "source": ""}, "937": { "title": "Free Shipping (Direct from Manufacturer)", "source": "OTHER"}, "938": { "title": "Free Shipping - Dropship Direct fromacturer","source": "OTHER"}, "940": { "title": "Free Shipping - Canada Post Standard", "source": ""}, "941": { "title": "Free Shipping(CanPar)", "source": "OTHER"}, "101": { "title": "Free Shipping (7 Day Ground)", "source": ""}, "104": { "title": "Online Delivery / No Shipping", "source": ""}, "105": { "title": "Shipping & Handling", "source": ""}, "919": { "title": "Free Shipping (7 Day Ground)", "source": ""}, "939": { "title": "Free Shipping - Canada Post Standard", "source": "CANADAPOST"}, "201": { "title": "Australia Post Regular Parcel", "source": "AUSTRALIAPOST"}, "202": { "title": "Australia Post Express Post Parcel", "source": "AUSTRALIAPOST"}, "203": { "title": "Australia Post Sea Mail", "source": "AUSTRALIAPOST"}, "204": { "title": "Australia Post Air Mail", "source": "AUSTRALIAPOST"}, "205": { "title": "Australia Post ECI Documents", "source": "AUSTRALIAPOST"}, "206": { "title": "Australia Post ECI Merchandise", "source": "AUSTRALIAPOST"}, "207": { "title": "Australia Post Express Postnational","source": "AUSTRALIAPOST"}, "304": { "title": "Canada Post Priority Courier", "source": "CANADAPOST"}, "306": { "title": "Canada Post Priority Worldwide USA", "source": "CANADAPOST"}, "309": { "title": "Canada Post Priority Worldwide INTL", "source": "CANADAPOST"}, "401": { "title": "DHL Worldwide Express", "source": "DHL"}, "501": { "title": "FedEx Ground&reg;", "source": "FEDEX"}, "502": { "title": "FedEx Home Delivery&reg;", "source": "FEDEX"}, "504": { "title": "FedEx 2Day&reg;", "source": "FEDEX"}, "505": { "title": "FedEx Standard Overnight&reg;", "source": "FEDEX"}, "506": { "title": "FedEx Priority Overnight&reg;", "source": "FEDEX"}, "507": { "title": "FedEx First Overnight&reg;", "source": "FEDEX"}, "508": { "title": "FedEx International Ground&reg;", "source": "FEDEX"}, "509": { "title": "FedEx International Economy&reg;", "source": "FEDEX"}, "510": { "title": "FedEx International Priority&reg;", "source": "FEDEX"}, "511": { "title": "FedEx International First&reg;", "source": "FEDEX"}, "512": { "title": "FedEx 1Day&reg;&nbsp;Freight", "source": "FEDEX"}, "513": { "title": "FedEx 2Day&reg;&nbsp;Freight", "source": "FEDEX"}, "514": { "title": "FedEx 3Day&reg;&nbsp;Freight", "source": "FEDEX"}, "515": { "title": "FedEx Internationality&reg;&nbsp;Freight","source": "FEDEX"}, "516": { "title": "FedEx Express Saver&reg;", "source": "FEDEX"}, "601": { "title": "Parcelforce Next Day", "source": "ROYALMAIL"}, "602": { "title": "Parcelforce 48 Hour", "source": "ROYALMAIL"}, "603": { "title": "Parcelforce Before 9:00 AM Delivery Next", "source": "ROYALMAIL"}, "604": { "title": "Parcelforce Before 10:00 AM DeliveryDay","source": "ROYALMAIL"}, "605": { "title": "Parcelforce Before 12:00 AM DeliveryDay","source": "ROYALMAIL"}, "701": { "title": "UPS Ground", "source": "UPS"}, "702": { "title": "UPS Standard", "source": "UPS"}, "703": { "title": "UPS 3Day Select&reg;", "source": "UPS"}, "704": { "title": "UPS 2nd Day Air&reg;", "source": "UPS"}, "705": { "title": "UPS 2nd Day Air A.M.&reg;", "source": "UPS"}, "706": { "title": "UPS Next Day Air Saver&reg;", "source": "UPS"}, "707": { "title": "UPS Next Day Air&reg;", "source": "UPS"}, "708": { "title": "UPS Next Day Air Early A.M.&reg;", "source": "UPS"}, "709": { "title": "UPS Worldwide Expedited<sup>SM<\/sup>", "source": "UPS"}, "710": { "title": "UPS Worldwide Saver", "source": "UPS"},"711": {"title":"UPS Worldwide Express<sup>SM</sup>","source":"UPS"},"712": {"title":"UPS Worldwide Express Plus<sup>SM</sup>","source":"UPS"},"713": {"title":"UPS Express","source":"UPS"},"714": {"title":"UPS Expedited","source":"UPS"},"715": {"title":"UPS Express Saver","source":"UPS"},"716": {"title":"UPS Express Early A.M.","source":"UPS"},"801": {"title":"USPS Library","source":"USPS"},"802": {"title":"USPS Media Mail","source":"USPS"},"803": {"title":"USPS BPM (Bound Printed Matter)","source":"USPS"},"804": {"title":"USPS Standard","source":"USPS"},"805": {"title":"USPS First-Class Mail Package","source":"USPS"},"806": {"title":"USPS First-Class Mail Large Envelope","source":"USPS"},"807": {"title":"USPS First-Class Mail Letter","source":"USPS"},"808": {"title":"USPS Priority Mail","source":"USPS"},"890": {"title":"USPS Priority Mail 1-Day","source":"USPS"},"891": {"title":"USPS Priority Mail 2-Day","source":"USPS"},"892": {"title":"USPS Priority Mail 3-Day","source":"USPS"},"893": {"title":"USPS Priority Mail DPO","source":"USPS"},"894": {"title":"USPS Priority Mail Military","source":"USPS"},"809": {"title":"USPS Priority Mail Flat Rate Envelope","source":"USPS"},"896": {"title":"USPS Priority Mail 1-Day Flat Rate Envelope","source":"USPS"},"897": {"title":"USPS Priority Mail 2-Day Flat Rate Envelope","source":"USPS"},"898": {"title":"USPS Priority Mail 3-Day Flat Rate Envelope","source":"USPS"},"899": {"title":"USPS Priority Mail DPO Flat Rate Envelope","source":"USPS"},"900": {"title":"USPS Priority Mail Military Flat Rate Envelope","source":"USPS"},"810": {"title":"USPS Priority Mail Small Flat Rate Box","source":"USPS"},"914": {"title":"USPS Priority Mail 1-Day Small Flat Rate Box","source":"USPS"},"915": {"title":"USPS Priority Mail 2-Day Small Flat Rate Box","source":"USPS"},"916": {"title":"USPS Priority Mail 3-Day Small Flat Rate Box","source":"USPS"},"917": {"title":"USPS Priority Mail DPO Small Flat Rate Box","source":"USPS"},"918": {"title":"USPS Priority Mail Military Small Flat Rate Box","source":"USPS"},"811": {"title":"USPS Priority Mail Medium Flat Rate Box","source":"USPS"},"908": {"title":"USPS Priority Mail 1-Day Medium Flat Rate Box","source":"USPS"},"909": {"title":"USPS Priority Mail 2-Day Medium Flat Rate Box","source":"USPS"},"910": {"title":"USPS Priority Mail 3-Day Medium Flat Rate Box","source":"USPS"},"911": {"title":"USPS Priority Mail DPO Medium Flat Rate Box","source":"USPS"},"912": {"title":"USPS Priority Mail Military Medium Flat Rate Box","source":"USPS"},"812": {"title":"USPS Priority Mail Large Flat Rate Box","source":"USPS"},"902": {"title":"USPS Priority Mail 1-Day Large Flat Rate Box","source":"USPS"},"903": {"title":"USPS Priority Mail 2-Day Large Flat Rate Box","source":"USPS"},"904": {"title":"USPS Priority Mail 3-Day Large Flat Rate Box","source":"USPS"},"905": {"title":"USPS Priority Mail DPO Large Flat Rate Box","source":"USPS"},"906": {"title":"USPS Priority Mail Military Large Flat Rate Box","source":"USPS"},"813": {"title":"USPS Priority Mail Express","source":"USPS"},"854": {"title":"USPS Priority Mail Express 1-Day","source":"USPS"},"855": {"title":"USPS Priority Mail Express 2-Day","source":"USPS"},"856": {"title":"USPS Priority Mail Express 3-Day","source":"USPS"},"857": {"title":"USPS Priority Mail Express DPO","source":"USPS"},"858": {"title":"USPS Priority Mail Express Military","source":"USPS"},"814": {"title":"USPS Priority Mail Express Flat Rate Envelope","source":"USPS"},"860": {"title":"USPS Priority Mail Express 1-Day Flat Rate Envelope","source":"USPS"},"861": {"title":"USPS Priority Mail Express 2-Day Flat Rate Envelope","source":"USPS"},"862": {"title":"USPS Priority Mail Express 3-Day Flat Rate Envelope","source":"USPS"},"863": {"title":"USPS Priority Mail Express DPO Flat Rate Envelope","source":"USPS"},"864": {"title":"USPS Priority Mail Express Military Flat Rate Envelope","source":"USPS"},"815": {"title":"USPS Priority Mail Express Hold for Pickup","source":"USPS"},"872": {"title":"USPS Priority Mail Express 1-Day Hold for Pickup","source":"USPS"},"873": {"title":"USPS Priority Mail Express 2-Day Hold for Pickup","source":"USPS"},"874": {"title":"USPS Priority Mail Express 3-Day Hold for Pickup","source":"USPS"},"875": {"title":"USPS Priority Mail Express DPO Hold for Pickup","source":"USPS"},"876": {"title":"USPS Priority Mail Express Military Hold for Pickup","source":"USPS"},"816": {"title":"USPS Priority Mail Express Flat Rate Envelope Hold for Pickup","source":"USPS"},"866": {"title":"USPS Priority Mail Express 1-Day Flat Rate Envelope Hold for Pickup","source":"USPS"},"867": {"title":"USPS Priority Mail Express 2-Day Flat Rate Envelope Hold for Pickup","source":"USPS"},"868": {"title":"USPS Priority Mail Express 3-Day Flat Rate Envelope Hold for Pickup","source":"USPS"},"869": {"title":"USPS Priority Mail Express DPO Flat Rate Envelope Hold for Pickup","source":"USPS"},"870": {"title":"USPS Priority Mail Express Military Flat Rate Envelope Hold for Pickup","source":"USPS"},"817": {"title":"USPS Priority Mail Express Sunday/Holiday Guarantee","source":"USPS"},"878": {"title":"USPS Priority Mail Express 1-Day Sunday/Holiday Guarantee","source":"USPS"},"879": {"title":"USPS Priority Mail Express 2-Day Sunday/Holiday Guarantee","source":"USPS"},"880": {"title":"USPS Priority Mail Express 3-Day Sunday/Holiday Guarantee","source":"USPS"},"881": {"title":"USPS Priority Mail Express DPO Sunday/Holiday Guarantee","source":"USPS"},"882": {"title":"USPS Priority Mail Express Military Sunday/Holiday Guarantee","source":"USPS"},"818": {"title":"USPS Priority Mail Express Flat-Rate Envelope Sunday/Holiday Guarantee","source":"USPS"},"884": {"title":"USPS Priority Mail Express 1-Day Flat-Rate Envelope Sunday/Holiday Guarantee","source":"USPS"},"885": {"title":"USPS Priority Mail Express 2-Day Flat-Rate Envelope Sunday/Holiday Guarantee","source":"USPS"},"886": {"title":"USPS Priority Mail Express 3-Day Flat-Rate Envelope Sunday/Holiday Guarantee","source":"USPS"},"887": {"title":"USPS Priority Mail Express DPO Flat-Rate Envelope Sunday/Holiday Guarantee","source":"USPS"},"888": {"title":"USPS Priority Mail Express Military Flat-Rate Envelope Sunday/Holiday Guarantee","source":"USPS"},"819": {"title":"USPS First-Class Mail International Letter","source":"USPS"},"820": {"title":"USPS First-Class Mail International Large Envelope","source":"USPS"},"821": {"title":"USPS First-Class Package International Service","source":"USPS"},"822": {"title":"USPS Priority Mail International","source":"USPS"},"823": {"title":"USPS Priority Mail International Flat Rate Envelope","source":"USPS"},"824": {"title":"USPS Priority Mail International Small Flat Rate Box","source":"USPS"},"825": {"title":"USPS Priority Mail International Medium Flat Rate Box","source":"USPS"},"826": {"title":"USPS Priority Mail International Large Flat Rate Box","source":"USPS"},"827": {"title":"USPS Priority Mail Express International","source":"USPS"},"828": {"title":"USPS Priority Mail Express International Flat Rate Envelope","source":"USPS"},"829": {"title":"USPS Global Express Guaranteed (GXG)","source":"USPS"},"830": {"title":"USPS Global Express Guaranteed Non-Document Rectangular","source":"USPS"},"831": {"title":"USPS Global Express Guaranteed Non-Document Non-Rectangular","source":"USPS"},"832": {"title":"USPS GXG Envelopes","source":"USPS"}}


var cancelledDate = function(order) {
  if(order.orderstatus === "Cancelled") {
    return new Date(order.orderdate);
  }
  else return "";
}

var financialStatus = function(order) {
  if(order.orderstatus === "Cancelled") {
    return "voided";
  } else if(order.orderstatus === "Returned") {
    return "refunded"
  } else if( order.total_payment_authorized !== 0 && order.total_payment_received === 0) {
    return "authorized";
  } else if( order.total_payment_authorized === 0 && order.total_payment_received === 0 ) {
    return "voided";
  } else if(order.total_payment_received!== order.total_payment_authorized){
    return "partially_paid";
  }else return "paid";
}

var discountType = function(type) {
  switch(type) {
    case '1':
      return "fixed_amount";
      break;
    case '2':
      return "fixed_amount";
      break;
    case '3':
      return "percentage";
      break;
    case '4':
      return "percentage";
  }
}

var allocationMethod = function(type) {
  switch (type) {
    case '1':
      return "one";
      break;
    case '2':
      return "across";
      break;
    case '3':
      return "one";
      break;
    case '4':
      return "across";
  }
}

var transactionKind = function(order) {
	if(order.orderstatus === "Shipped" || order.orderstatus === "Processing")
		return "capture";
	else return "void";
}

var shopifyorders = new Array();
console.time('runtime');
d3.csv(forwardingAddress+'/OrderDetails').then(function (orders) {
  //TODO:
  console.log(orders.length);
	var orderDetails = new Array();
  for(i=0; i<orders.length; i++){
    let order = orders[i];
    let option = order.options.split(":")[1];
    let length = option?option.length-1:0;
    option = option?option.substring(0, length):"";
    //if this order has more than one item
    if(orderDetails[order.orderid]) {
      if(order.productcode.indexOf("DSC-") === -1) {
        orderDetails[order.orderid].products.push({
          "sku": order.productcode,
          "price": order.productprice,
          "qty": parseInt(order.quantity)===0?1:parseInt(order.quantity),
          "title": order.productname,
          "totalPrice": order.totalprice,
          "fulfillable_quantity": parseInt(order.qtyshipped),
          "option": option
        });
      }
      else if(order.couponcode) {
        orderDetails[order.orderid].discount_applications.push({
          "type": "manual",
          "value": order.totalprice.split('-')[1],
          "value_type": "fixed_amount",
          "allocation_method": "acroos",
          "target_selection": "all",
          "target_type": "line_item"
        });
        orderDetails[order.orderid].discount_codes.push({
          "code": order.couponcode,
          "amount": order.totalprice.split('-')[1],
          "type": "fixed_amount"
        })
      }
    }
    else {  //it could be first item in the order or the only item the order
      orderDetails[order.orderid] = {
        "products": [
          {
            "sku": order.productcode,
            "price": order.productprice,
            "qty": parseInt(order.quantity)===0?1:parseInt(order.quantity),
            "title": order.productname,
            "totalPrice": order.totalprice,
            "fulfillable_quantity": parseInt(order.qtyshipped),
            "option": option
          }
        ],
        "discount_applications": [],
        "discount_codes": []
      }
    }
  }
	var shopifycustomers = new Array();
	d3.csv(forwardingAddress+'/Customers').then((customers) => {
		for(i = 0; i< customers.length; i ++) {
		 let customer = customers[i];
		shopifycustomers[customer.customerid] = customer.emailaddress;
}
})
	return [orderDetails, shopifycustomers];
})
.then((result)=>{
	var orderDetails = result[0];
	var shopifycustomers = result[1];
  d3.csv(forwardingAddress+'/Orders').then(function (orders) {
    console.log(orders.length);
    for(index=0; index<orders.length; index++){
        let order = orders[index];
        let total_discount;
        let customerid = order.customerid;
        shopifyorders.push({
          "order": {
            "note": order.order_comments,
            "order_number": order.orderid,
            "number": order.orderid,
            "total_price": order.paymentamount,
            "subtotal": order.affiliate_commissionable_value,
            "total_tax": order.salestax1,
            "currency": "CAD",
            "financial_status": financialStatus(order),
            "processed_at": new Date(order.orderdate),
            "total_discounts": orderDetails[order.orderid].discount_applications[0]?orderDetails[order.orderid].discount_applications[0].value:"",
            "total_line_items_price": 0,
            "canncelled_at": cancelledDate(order), //equals to orderdate if order status is Cancelled
            "discount_applications": orderDetails[order.orderid].discount_applications,
            "discount_codes": orderDetails[order.orderid].discount_codes,
            "browser_ip": order.customer_ipaddress,
            "tax_lines": [  //individule item tax
              {
                "title": order.tax1_title,
                "price": Math.round(order.affiliate_commissionable_value*order.salestaxrate1*100)/100,
                "rate": order.salestaxrate1
              }
            ],
      			"transactions": [
                      {
      					"kind": transactionKind(order),
      					"gateway": "shopify_gateway",
      					"amount": order.paymentamount,
      					"authorization": order.creditcardtransactionid?order.creditcardtransactionid:""
      				}
      			],
            "shipping_lines": [
              {
                "title": shippingMethod[order.shippingmethodid]?shippingMethod[order.shippingmethodid].title:"Shipping Method #"+order.shippingmethodid,
                "price": order.totalshippingcost,
                "code": order.shippingmethodid,
                "source": shippingMethod[order.shippingmethodid]?shippingMethod[order.shippingmethodid].source:"shopify"
              }
            ],
            "customer": {
              "first_name": order.billingfirstname,
              "last_name": order.billinglastname,
              "email": shopifycustomers[customerid],
              "verified_email": true,
              "addresses": [
                {
                  "address1": order.billingaddress1,
                  "address2": order.billingaddress2,
                  "city": order.billingcity,
                  "company": order.billingcompanyname,
                  "province": order.billingstate,
                  "zip": order.billingpostalcode,
                  "country": order.billingcountry
                }
              ]
            },
            "billing_address": {
              "first_name": order.billingfirstname,
              "last_name": order.billinglastname,
              "address1": order.billingaddress1,
              "address2": order.billingaddress2,
              "city": order.billingcity,
              "company": order.billingcompanyname,
              "province": order.billingstate,
              "zip": order.billingpostalcode,
              "country": order.billingcountry
            },
            "shipping_address": {
              "first_name": order.shipfirstname,
              "last_name": order.shiplastname,
              "address1": order.shipaddress1,
              "address2": order.shipaddress2,
              "city": order.shipcity,
              "company": order.shipcompanyname,
              "province": order.shipstate,
              "zip": order.shippostalcode,
              "country": order.shipcountry
            },
            "email": order.creditcardauthorizationnumber
          }
        });
        var currentShopifyOrder = shopifyorders[shopifyorders.length-1];
        currentShopifyOrder.order.line_items = new Array();
        for(i=0; i<orderDetails[order.orderid].products.length; i++) {
          //TODO: 1.
          let orderProduct = orderDetails[order.orderid].products[i];
          let totalPrice = parseFloat(orderProduct.totalPrice);
          currentShopifyOrder.order.total_line_items_price += totalPrice;
          currentShopifyOrder.order.line_items.push({
            "title": orderProduct.title,
            "quantity": orderProduct.qty,
            "sku": orderProduct.sku,
            "price": orderProduct.totalPrice,
            "taxable": true,
            "fulfillable_quantity": orderProduct.fulfillable_quantity,
            "fulfillment_service": "manual",
            "fulfillment_status": orderProduct.qty!==0?"fulfilled":"null",
            "name": orderProduct.option
          });
        }
    }
    // console.log(shopifyorders[978]);
    module.exports = shopifyorders;
  });
  console.timeEnd('runtime');
})
.catch((err) => {
  if(err) console.log(err);
});
