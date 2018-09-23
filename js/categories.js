/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Search
4. Init Menu
5. Init Isotope


******************************/

$(document).ready(function()
{
	"use strict";

	/* 

	1. Vars and Inits

	*/

	var header = $('.header');
	var hambActive = false;
	var menuActive = false;

	// const URL = 'http://localhost/backend/';
	const URLS = 'http://192.168.0.10/backend/';
	var categories_menu ='';
	var categories = {};
	var categories_menu_mm='';
	var product_contents = '';
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
	initIsotope();

	getCategories();
	getProductCategories(idProduct);

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

	5. Init Isotope

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

	        // Sort based on the value from the sorting_type dropdown
	        sortingButtons.each(function()
	        {
	        	$(this).on('click', function()
	        	{
	        		var parent = $(this).parent().parent().find('.sorting_text');
		        		parent.text($(this).text());
		        		var option = $(this).attr('data-isotope-option');
		        		option = JSON.parse( option );
	    				grid.isotope( option );
	        	});
	        });
		}
	}

	/*
	7. Querying URL
	*/
	function getQueryVariable(variable)
		{
		    var query = new URL(window.location.href);
		    var query_string = query.search;

			var search_params = new URLSearchParams(query_string); 

			var id = search_params.get('id');
			return id;
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
               categories = result;
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
	function getProductCategories(id='') {
		// body...
		$.ajax({
            url: URLS+'product/categories/'+id,
            type: 'GET',
            dataType: 'json',
            headers: {
                'auth': '12345'
            },
            contentType: 'application/json;',
            success: function (result) {
               // CallBack(result);
               console.log(result);
               $('#count_result').append(result.product.count);
               $('.home_title').html(result.categories[0].categoriesName);
               // var product_contents = '';
               // product_content += '<div class="product_grid">';
               $.each(result.product.data, function(key,val){
               	// product_contents += '<div class="card"> <img src="images/product_2.jpg" alt="Avatar" style="width:100%"> <div class="container"> <h4><b>John Doe</b></h4> <p>Architect & Engineer</p></div></div>';
               	product_contents += '<div class="col-md-3 center-block text-center" style="padding:5px;">';
                product_contents += '	<a href="product.html?id='+val.idProduct+'">';
                product_contents += '		<img src="'+URLS+'/assets/uploads/'+JSON.parse(val.productImage).image1+'" alt="Image" style="max-width:100%;">';
                product_contents += '	</a>';
                product_contents += '<h4>'+val.productName+'</h4>';
                product_contents += '<a href="#" class="btn btn-sm btn-primary">'+val.productPrice+'</a>';
                product_contents += '</div><div class="clearfix"></div>';
               });
               console.log(product_contents);
               // product_content += '</div>';
               $('#product_grids').append(product_contents);
            },
            error: function (error) {
                
            }
        });
	}
});