var volusionordercustomers = d3.csv('public/Orders.csv');

var volusionorderdetails = d3.csv('public/OrderDetails.csv');

//Create a middleware orderDetails

var orderDetails = new Array();

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
})

var shopifyorders = new Array();

volusionordercustomers.then(function (orders) {
  orders.forEach(function(order){
      shopifyorders.push(
      {
        "order":{
          "first_name": order.firstname,
          "last_name": order.lastname,
          "email": order.emailaddress,
          "phone": order.phonenumber,
          "verified_email": true,
          "addresses": [
            {
              "address1": order.billingaddress1,
              "address2": order.billingaddress2,
              "city": order.city,
              "company": order.companyname,
              "province": order.state,
              "zip": order.postalcode,
              "country": order.country
            }
          ]
        }
      });
  });
});
