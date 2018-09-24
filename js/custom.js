/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Home Slider
4. Init Search
5. Init Menu
6. Init Isotope


******************************/

$(document).ready(function()
{
	"use strict";
		$('#blogCarousel').carousel({
				interval: 5000
		});
	/* 

	1. Vars and Inits

	*/
	// const URL = 'http://localhost/backend/';
	const URL = 'http://192.168.1.24/backend/';
	var header = $('.header');
	var hambActive = false;
	var menuActive = false;
	var categories_menu = '';
	var categories_menu_mm = '';
	var product_content = '';

	setHeader();

	$(window).on('resize', function()
	{
		setHeader();
	});

	$(document).on('scroll', function()
	{
		setHeader();
	});

	initHomeSlider();
	initSearch();
	initMenu();
	getProduct();
	// initIsotope();
	getCategories();
	getBlog();

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

	3. Init Home Slider

	*/

	function initHomeSlider()
	{
		if($('.home_slider').length)
		{
			var homeSlider = $('.home_slider');
			homeSlider.owlCarousel(
			{
				items:1,
				autoplay:true,
				autoplayTimeout:10000,
				loop:true,
				nav:false,
				smartSpeed:1200,
				dotsSpeed:1200,
				fluidSpeed:1200
			});

			/* Custom dots events */
			if($('.home_slider_custom_dot').length)
			{
				$('.home_slider_custom_dot').on('click', function()
				{
					$('.home_slider_custom_dot').removeClass('active');
					$(this).addClass('active');
					homeSlider.trigger('to.owl.carousel', [$(this).index(), 1200]);
				});
			}

			/* Change active class for dots when slide changes by nav or touch */
			homeSlider.on('changed.owl.carousel', function(event)
			{
				$('.home_slider_custom_dot').removeClass('active');
				$('.home_slider_custom_dots li').eq(event.page.index).addClass('active');
			});

			// add animate.css class(es) to the elements to be animated
			function setAnimation ( _elem, _InOut )
			{
				// Store all animationend event name in a string.
				// cf animate.css documentation
				var animationEndEvent = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

				_elem.each ( function ()
				{
					var $elem = $(this);
					var $animationType = 'animated ' + $elem.data( 'animation-' + _InOut );

					$elem.addClass($animationType).one(animationEndEvent, function ()
					{
						$elem.removeClass($animationType); // remove animate.css Class at the end of the animations
					});
				});
			}

			// Fired before current slide change
			homeSlider.on('change.owl.carousel', function(event)
			{
				var $currentItem = $('.home_slider_item', homeSlider).eq(event.item.index);
				var $elemsToanim = $currentItem.find("[data-animation-out]");
				setAnimation ($elemsToanim, 'out');
			});

			// Fired after current slide has been changed
			homeSlider.on('changed.owl.carousel', function(event)
			{
				var $currentItem = $('.home_slider_item', homeSlider).eq(event.item.index);
				var $elemsToanim = $currentItem.find("[data-animation-in]");
				setAnimation ($elemsToanim, 'in');
			})
		}
	}

	/* 

	4. Init Search

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

	5. Init Menu

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

	6. Init Isotope

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


	/* 
	7. Load Kategori Dropdown Menu
	*/
	function getCategories() {
		// body...
		$.ajax({
            url: URL+'categories/',
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
            url: URL+'product/',
            type: 'GET',
            dataType: 'json',
            headers: {
                'auth': '12345'
            },
            contentType: 'application/json;',
            success: function (result) {
               // CallBack(result);
               console.log(result);
               // product_content += '<div class="product_grid">';
               $.each(result.data, function(key,val){
               
				product_content += '<div class="col-md-3">';
                product_content += '	<a href="product.html?id='+val.idProduct+'">';
                product_content += '		<img src="'+URL+'/assets/uploads/'+JSON.parse(val.productImage).image1+'" alt="Image" style="max-width:100%;">';
                product_content += '	</a>';
                product_content += '<span>'+val.productName+'</span>';
                product_content += '</div>';
				
               });
               // product_content += '</div>';
               $('#product_grids').append(product_content);
               // console.log(product_content);
               
            },
            error: function (error) {
                
            }
        });
	}
	function getBlog() {
		$.ajax({
            url: URL+'blog/',
            type: 'GET',
            dataType: 'json',
            headers: {
                'auth': '12345'
            },
            contentType: 'application/json;',
            success: function (result) {
               // CallBack(result);
               console.log(result);
               $('#blog_main_title').append(result.data[0].blogTitle);
               $('#blog_main_title_url').attr('href','blog.html?id='+result.data[0].idBlog);
               // $('.avds_title').append(result.data[0].blogTitle);
            },
            error: function (error) {
                
            }
        });
	}
});