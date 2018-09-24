/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Search
4. Init Menu
5. Init Image
6. Init Quantity
7. Init Isotope


******************************/

$(document).ready(function()
{
	"use strict";
	// var query = window.location;
	// 	       console.log(query);
	/* 

	1. Vars and Inits

	*/
	

	var header = $('.header');
	var hambActive = false;
	var menuActive = false;

	// const URL = 'http://localhost/backend/';
	const URLS = 'http://192.168.1.24/backend/';
	var categories_menu ='';
	var categories_menu_mm='';
	var content_image = '';
	var content_image_large = '';
	var idProduct = getQueryVariable("id");


	setHeader();

	$(window).on('resize', function()
	{
		setHeader();
	});

	$(document).on('scroll', function()
	{
		setHeader();
	});

	initSearch();
	initMenu();
	initImage();
	initQuantity();
	getCategories();
	initIsotope();
	getProduct(idProduct);
	/* 

	2. Set Header

	*/

	function setHeader()
	{
		if($(window).scrollTop() > 100)
		{
			header.addClass('scrolled');
		}
		else
		{
			header.removeClass('scrolled');
		}
	}

	/* 

	3. Init Search

	*/

	function initSearch()
	{
		if($('.search').length && $('.search_panel').length)
		{
			var search = $('.search');
			var panel = $('.search_panel');

			search.on('click', function()
			{
				panel.toggleClass('active');
			});
		}
	}

	/* 

	4. Init Menu

	*/

	function initMenu()
	{
		if($('.hamburger').length)
		{
			var hamb = $('.hamburger');

			hamb.on('click', function(event)
			{
				event.stopPropagation();

				if(!menuActive)
				{
					openMenu();
					
					$(document).one('click', function cls(e)
					{
						if($(e.target).hasClass('menu_mm'))
						{
							$(document).one('click', cls);
						}
						else
						{
							closeMenu();
						}
					});
				}
				else
				{
					$('.menu').removeClass('active');
					menuActive = false;
				}
			});

			//Handle page menu
			if($('.page_menu_item').length)
			{
				var items = $('.page_menu_item');
				items.each(function()
				{
					var item = $(this);

					item.on('click', function(evt)
					{
						if(item.hasClass('has-children'))
						{
							evt.preventDefault();
							evt.stopPropagation();
							var subItem = item.find('> ul');
						    if(subItem.hasClass('active'))
						    {
						    	subItem.toggleClass('active');
								TweenMax.to(subItem, 0.3, {height:0});
						    }
						    else
						    {
						    	subItem.toggleClass('active');
						    	TweenMax.set(subItem, {height:"auto"});
								TweenMax.from(subItem, 0.3, {height:0});
						    }
						}
						else
						{
							evt.stopPropagation();
						}
					});
				});
			}
		}
	}

	function getQueryVariable(variable)
		{
		    var query = new URL(window.location.href);
		    var query_string = query.search;

			var search_params = new URLSearchParams(query_string); 

			var id = search_params.get('id');
			return id;
		}

	function openMenu()
	{
		var fs = $('.menu');
		fs.addClass('active');
		hambActive = true;
		menuActive = true;
	}

	function closeMenu()
	{
		var fs = $('.menu');
		fs.removeClass('active');
		hambActive = false;
		menuActive = false;
	}

	/* 

	5. Init Image

	*/

	function initImage()
	{
		var images = $('.details_image_thumbnail');
		var selected = $('.details_image_large img');

		images.each(function()
		{
			var image = $(this);
			image.on('click', function()
			{
				var imagePath = new String(image.data('image'));
				selected.attr('src', imagePath);
				images.removeClass('active');
				image.addClass('active');
			});
		});
	}

	/* 

	6. Init Quantity

	*/

	function initQuantity()
	{
		// Handle product quantity input
		if($('.product_quantity').length)
		{
			var input = $('#quantity_input');
			var incButton = $('#quantity_inc_button');
			var decButton = $('#quantity_dec_button');

			var originalVal;
			var endVal;

			incButton.on('click', function()
			{
				originalVal = input.val();
				endVal = parseFloat(originalVal) + 1;
				input.val(endVal);
			});

			decButton.on('click', function()
			{
				originalVal = input.val();
				if(originalVal > 0)
				{
					endVal = parseFloat(originalVal) - 1;
					input.val(endVal);
				}
			});
		}
	}

	/* 

	7. Init Isotope

	*/

	function initIsotope()
	{
		var sortingButtons = $('.product_sorting_btn');
		var sortNums = $('.num_sorting_btn');

		if($('.product_grid').length)
		{
			var grid = $('.product_grid').isotope({
				itemSelector: '.product',
				layoutMode: 'fitRows',
				fitRows:
				{
					gutter: 30
				},
	            getSortData:
	            {
	            	price: function(itemElement)
	            	{
	            		var priceEle = $(itemElement).find('.product_price').text().replace( '$', '' );
	            		return parseFloat(priceEle);
	            	},
	            	name: '.product_name',
	            	stars: function(itemElement)
	            	{
	            		var starsEle = $(itemElement).find('.rating');
	            		var stars = starsEle.attr("data-rating");
	            		return stars;
	            	}
	            },
	            animationOptions:
	            {
	                duration: 750,
	                easing: 'linear',
	                queue: false
	            }
	        });
		}
	}
	function getCategories() {
		// body...
		$.ajax({
            url: URLS+'categories/',
            type: 'GET',
            dataType: 'json',
            headers: {
                'auth': '12345'
            },
            contentType: 'application/json;',
            success: function (result) {
               // CallBack(result);
               console.log(result);

               $.each(result.data, function(key,val){
               	categories_menu += '<li><a href="categories.html?id='+val.idCategories+'">'+val.categoriesName+'</a></li>';
               	categories_menu_mm += '<li class="page_menu_item menu_mm"><a href="categories.html?id='+val.idCategories+'">'+val.categoriesName+'</a></li>';
               });
               $('#menu_categories').append(categories_menu);
               $('.page_menu_selection').append(categories_menu_mm);
            },
            error: function (error) {
                
            }
        });
	}
	function getProduct(id='') {
		// body...
		$.ajax({
            url: URLS+'product/index/'+id,
            type: 'GET',
            dataType: 'json',
            headers: {
                'auth': '12345'
            },
            contentType: 'application/json;',
            success: function (result) {
               // CallBack(result);
               console.log(result);
               $('.home_title').append(result[0].productName);
               $('.details_name').append(result[0].productName);
               $('.details_price').append(result[0].productPrice);
               $('.details_text').append(result[0].productDetails);
               $('.description_text').append(result[0].productDetails);
               var image = [];
               image.push(JSON.parse(result[0].productImage).image1);
               image.push(JSON.parse(result[0].productImage).image2);
               image.push(JSON.parse(result[0].productImage).image3);
               var i = true;
               $.each(image,function(key,val){

               	if (val != '') {
               		console.log(val);
               		if (i == true) {
               			content_image_large = '<img src="'+URLS+'assets/uploads/'+val+'" alt="">';
               			var st = "active";i=false;
               		}else{var st = "";}
               		content_image += '<div class="details_image_thumbnail '+st+'" data-image="'+URLS+'assets/uploads/'+val+'"><img src="'+URLS+'assets/uploads/'+val+'" alt=""></div>';
               	}
               });

    //            product_content += '<div class="product_grid">';
    //            $.each(result.data, function(key,val){
    //            	// categories_menu += '<li><a href="#'+val.idCategories+'">'+val.categoriesName+'</a></li>';
    //            	product_content += '<div class="col-sm-3 product">';
				// product_content += '	<div class="product_image"><img src="images/product_1.jpg" alt=""></div>';
				// product_content += '	<div class="product_extra product_new"><a href="categories.html">New</a></div>';
				// product_content += '	<div class="product_content">';
				// product_content += '		<div class="product_title"><a href="product.html#id='+val.idProduct+'">'+val.productName+'</a></div>';
				// product_content += '		<div class="product_price">$670</div>';
				// product_content += '	</div>';
				// product_content += '</div>';
				
    //            });
    //            product_content += '</div>';
     // console.log(content_image);
     			$('.details_image_large').append(content_image_large);
               $('#images_product').append(content_image);
              
               
            },
            error: function (error) {
                
            }
        });
	}

});