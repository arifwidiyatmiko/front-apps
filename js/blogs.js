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
	const URLS = 'http://192.168.1.24/backend/';
	var categories_menu ='';
	var categories = {};
	var categories_menu_mm='';
	var blog_cards = '';
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
	getBlogList();
	// getProductCategories(idProduct);

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
	function getBlogList(id='') {
		// body...
		$.ajax({
            url: URLS+'blog',
            type: 'GET',
            dataType: 'json',
            headers: {
                'auth': '12345'
            },
            contentType: 'application/json;',
            success: function (result) {
               // CallBack(result);
               console.log(result);
               $.each(result.data,function(key,val) {
               	// blog_cards +=
               	blog_cards += '<div class="col-md-4">';
		        blog_cards +='  <h2>'+val.blogTitle+'</h2>';
		        // blog_cards +='  <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. ';
		        blog_cards +=  val.blogContent.substring(0,200);
		        blog_cards +='  <p><a class="btn btn-default" href="blog.html?id='+val.idBlog+'&slug='+val.blogSlug+'" role="button">View details &raquo;</a></p>';
		        blog_cards +='</div>';
               });
               $('#blog_grids').append(blog_cards);
            },
            error: function (error) {
                
            }
        });
	}
});