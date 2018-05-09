const d3 = require('d3');
const dotenv = require('dotenv').config();

const forwardingAddress = process.env.SHOPIFY_APP_HOST;

let volusioncategory = d3.csv(forwardingAddress+'/Categories');
let shopifycollection = new Array();
var status = false;

volusioncategory.then(function (categories) {
  for(i=0;i<categories.length;i++){
    category = categories[i];
    shopifycollection.push(
    {
      "smart_collection": {
        "title": category.categoryname,
        "body_html": category.categorydescription,
        "disjunctive": true,
        "sort_order": "best-selling",
        "published": true,
        "metafields": [
          {
            "namespace": "global",
            "key": "description_tag",
            "value_type": "string",
            "value": category.metatag_description
          },
          {
            "namespace": "global",
            "key": "title_tag",
            "value_type": "string",
            "value": category.metatag_title
          }
        ],
        "rules": [
          {
            "column": "vendor",
            "relattion": "equals",
            "condition": category.categoryname
          },
          {
            "column": "title",
            "relattion": "contains",
            "condition": category.categoryname
          },
          {
            "column": "tag",
            "relattion": "equals",
            "condition": category.categoryname
          }
        ]
      }
    });
  } //end of for loop
  console.log(shopifycollection[0]);
  status = true;
})


module.exports = {
  shopifycollection,
  status
};
