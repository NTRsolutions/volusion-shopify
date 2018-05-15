var volusionordercustomers = d3.csv('public/Orders.csv');

var volusionorderdetails = d3.csv('public/OrderDetails.csv');

//Create a middleware orderDetails

var orderDetails = new Array();
var shopifyorders = new Array();

volusionorderdetails.then(function (orders) {
  for(i=0; i<orders.length; i++){
    let order = orders[i];
    //if this order has more than one item
    if(orderDetails[order.orderid]) {
      orderDetails[order.orderid].products.push({
        "sku": order.productcode,
        "price": order.productprice,
        "qty": order.quantity,
        "title": order.productname,
        "totalPrice": order.totalprice
      });
    }
    else {  //it could be first item in the order or the only item the order
      orderDetails[order.orderid] = {
        "products": [
          {
            "sku": order.productcode,
            "price": order.productprice,
            "qty": order.quantity,
            "title": order.productname,
            "totalPrice": order.totalprice
          }
        ]
      }
    }
  }
});

volusionordercustomers.then(function (orders) {
  orders.forEach(function(order){
      shopifyorders.push(
      {
        "order": {
          "note": order.order_comments,
          "order_number": order.orderid,
          "number": order.orderid,
          "total_price": "",
          "subtotal": "",
          "total_tax": "",
          "currency": "CAD",
          "financial_status": "",
          "processed_at": "",
          "total_discount": "",
          "total_line_items_price": "",
          "canncelled_at": "",//may be can imported canncled Orders
          "discount_application": [],
          "tax_lines": [
            {
              "title": "",
              "price": "",
              "rate":
            }
          ]
          "line_items": [
            {
              "id": ,//if I find the id, the rest of the information will be automatically filled
              "title": "",
              "quantity": ,
              "price": "",
              "taxable": true,
              "name": "",
              "tax_lines": [  //individule item tax
                {
                  "title": "",
                  "price": "",
                  "rate":
                }
              ]
            }
          ],
          "shipping_lines": [
            {
              "id": 279464542261,
              "title": "Shipping Method #301",
              "price": "17.41",
              "code": "Shipping Method #301",
              "source": "shopify",
              "phone": null,
              "requested_fulfillment_service_id": null,
              "delivery_category": null,
              "carrier_identifier": null,
              "discounted_price": "17.41",
              "discount_amounts": [],
              "discount_allocations": [],
              "tax_lines": []
            }
          ],
          "customer": {
            "first_name": order.billingfirstname,
            "last_name": order.billinglastname,
            "email": order.creditcardauthorizationnumber,
            "phone": order.billingphonenumber,
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
          "email": order.creditcardauthorizationnumber,
          "transactions":{

          }
        }
      });
  });
});
