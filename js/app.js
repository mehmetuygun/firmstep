/** 
You can define filter options as many as you would like. 
To do that,
Make sure all the filter option match with specs property name in filters array
You have to set all checkbox name of the html which is using to filter specs same as specs property name from products.json
*/

// filters option 
var filters = {
	manufacturer: [],
	storage: [],
	os: [],
	camera: [],
};

// filtered products after filter options are selected goes here
var filtered_products = [];

// uncheck all the checkbox of filter options
$('#buttonClear').on('click', function (e) {
	e.preventDefault();

	$('.product_filter input[type="checkbox"]').removeAttr('checked');
	clearFilterOptions();
	runFilter();
});

// render product list template whenever any filter option is checked
$('.product_filter input[type="checkbox"]').on('change', function() {
	setFilterOptions();
    runFilter();
});

// send related filter options into its class in filters object
function setFilterOptions() {
	for (var i in filters) {
		filters[i] = $('.product_filter input[type="checkbox"][name="' + i + '[]"]:checked').map(function(){
	        return this.value;
	    }).toArray();
	}
}

// clear all the selected filter options in filters object
function clearFilterOptions() {
	for (key in filters) {
		filters[key] = [];
	}
}

// get the products list from products.json file
function runFilter() {
	$.getJSON("products.json", setProductData);
}

// put the products list which is getting from products.json file into filtered_products after filtered them according to selected filter options
function setProductData(data) {
	filtered_products = data.filter(function(product) {
		return hasFilter(product.specs);
	});
	renderTemplate(filtered_products);
}

// check if product specs match with filtered options
function hasFilter(specs) {
	var result = false;
	for (spec in specs) {
		for (filter in filters) {
			if (filter === spec) {
				result = hasValue(specs[spec], filters[filter]);
				// if even one specs does not match with selected filtered options. Do not show them
				if (result == false) {
					return false;
				}
			}
		}
	}
	return result;
}

// check if product spec property name is in selected filter options.
function hasValue(value, array) {
	if (array.length < 1) {
		return true;
	}
	for (var i = 0; i < array.length; i++) {
		if (value == array[i]) {
			return true;
		}
	}
	return false;
}

// create product list html according filtered products
function createProductListHtml(data) {
	var templateHtml = '<ul class="products-list">';
	for (var i=0;i<data.length;i++) {
		templateHtml += '<li>\
						<a href="#" class="product-photo">\
							<img src="http:'+data[i].image.small+'" height="130" alt="Iphone 6">\
						</a>\
						<h2><a href="#"> '+data[i].name+' </a></h2>\
						<ul class="product-description">\
							<li><span>Manufacturer: </span>'+data[i].specs.manufacturer+'</li>\
							<li><span>Storage: </span>'+data[i].specs.storage+' GB</li>\
							<li><span>OS: </span>'+data[i].specs.os+'</li>\
							<li><span>Camera: </span>'+data[i].specs.camera+' Mpx</li>\
							<li><span>Description: </span>'+data[i].description+'</li>\
						</ul>\
						<p class="product-price">£'+data[i].price+'</p>\
					</li>';

	}
	templateHtml += '</ul>';
	return templateHtml;
}

// display the product list
function renderTemplate(data) {
	$('#product-list-block').html(createProductListHtml(data));
}

// initialize
setFilterOptions();
runFilter();
