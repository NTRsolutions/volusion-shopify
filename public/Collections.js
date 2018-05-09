var volusioncategory = d3.csv('public/Categories.csv');

var shopifycollection = new Array();

volusioncategory.then(function (categories) {
  categories.forEach(function(category){
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
  })
})
