"use strict";

Shopify.theme.jsRecommendedProducts = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsRecommendedProducts = $.extend(this, Shopify.theme.getSectionData($section)); // Look for an element with class 'product-recommendations'

    var $productRecommendations = $section.find('.product-recommendations'); // Selectors

    var productID = $productRecommendations.data('product-id');
    var limit = $productRecommendations.data('limit');
    var sectionID = $productRecommendations.data('section-id'); // If showing custom collection we do not want to build request url

    if (this.show_custom_collection) {
      this.showCustomCollection($section);
      return;
    } // Build request URL


    var shopURL = $productRecommendations.data('base-url');
    var requestUrl = "".concat(shopURL, "?section_id=").concat(sectionID, "&limit=").concat(limit, "&product_id=").concat(productID);
    $.ajax({
      type: 'GET',
      url: requestUrl,
      success: function success(data) {
        var $recommendedProductsElement = $(data).find('.product-recommendations').html(); // Insert product list into the product recommendations container

        $productRecommendations.html($recommendedProductsElement);
        Shopify.theme.jsProduct.relatedProducts(); // Initialize shopify payment buttons

        if (Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        } // Converting the currencies


        if (Shopify.theme.currencyConverter) {
          Shopify.theme.currencyConverter.convertCurrencies();
        }
      }
    });
  },
  setupRecommendedVideoPlayer: function setupRecommendedVideoPlayer($section) {
    var videosInRecommendedProducts = $section.find('[data-product-recommendations-container] [data-html5-video] video, [data-product-recommendations-container] [data-youtube-video]').get(); // Only run Plyr.setup if videosInRecommendedProducts exists

    if (videosInRecommendedProducts.length > 0) {
      videosInRecommendedProductsPlayer = Plyr.setup(videosInRecommendedProducts, {
        controls: videoControls,
        fullscreen: {
          enabled: true,
          fallback: true,
          iosNative: true
        },
        storage: {
          enabled: false
        }
      });

      if (videoPlayers !== null) {
        var combinedArray = videoPlayers.concat(videosInRecommendedProductsPlayer);
        videoPlayers = combinedArray;
      } else {
        videoPlayers = videosInRecommendedProductsPlayer;
      }
    }

    Shopify.theme.jsVideo.setupListeners();
  },
  showCustomCollection: function showCustomCollection($section) {
    var $recommendedProductsElement = $section.find('.product-recommendations').html();
    var $productRecommendationsContainer = $('.product-recommendations');
    $productRecommendationsContainer.html($recommendedProductsElement);
    Shopify.theme.jsProduct.relatedProducts();
  },
  unload: function unload($section) {}
};