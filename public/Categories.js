var volusioncategory = d3.csv('public/Categories.csv');

var shopifycategory = {};

volusioncategory.then(function (category) {
  category.forEach(function(value){
    shopifycategory[value.categoryid] = value.categoryname;
  })
})
