var volusionoptions = d3.csv('public/Options.csv');
var volusionoptioncategories = d3.csv('public/OptionCategories.csv');
var shopifyoptionvalues = {};
var shopifyoptionnames = {};

volusionoptions.then(function (option) {
  option.forEach(function(value) {
    shopifyoptionvalues[value.id] = {
        "name": value.optionsdesc,
        "optioncat": value.optioncatid
      };
  })
})

volusionoptioncategories.then(function(optioncat) {
  optioncat.forEach(function(value) {
    shopifyoptionnames[value.id] = value.optioncategoriesdesc;
  })
})
