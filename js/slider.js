$(document).ready(function() {
  // Initialize the slider
  var $slider = $('.use-case_slider');
  var $slides = $slider.find('.use-case_slider-slide');
  var $navDots = $('.w-slider-nav .w-slider-dot');
  var currentIndex = 0;
  var slideCount = $slides.length + 1;
  var slideDuration = 500; // Transition time in ms
  var autoplay = false; // Set to true if you want the slider to autoplay
  var autoplayDelay = 4000; // Delay between slides (in ms)
  var isInitialized = false; // Flag to check if the slider is initialized
  var clickCount = 0; // Track the number of clicks

  // Function to calculate the margin as a percentage of the container width
  function getMarginPercentage() {
      var sliderWidth = $slider.outerWidth(); // Get the width of the slider container
      var margin = 24 * 2; // The margin in px
      return (margin / sliderWidth) * 100 * 0; // Convert px margin to percentage
  }

  // Set up the slider container with overflow hidden to hide the slides off-screen
  $slider.css({
      position: 'relative',
      overflow: 'hidden',
      width: '100%', // Ensure the slider takes up full width
  });

  // Set up the slides in a row for horizontal sliding
  $slides.css({
      position: 'relative',
      float: 'left',
      width: '100%', // Make each slide take up 100% of the container width
  });

  // Function to show a slide based on index using transform
  function showSlide(index) {
      var marginPercentage = getMarginPercentage(); // Get margin in percentage

      // Update the position of slides using translateX
      $slider.find('.use-case_slider-slide').each(function(i) {
          var slide = $(this);
          var offset = ((i - index) * 100 - 100);

          // Apply margin only if it's not the first slide
          if (i !== 0) {
              offset += marginPercentage * i;
          }

          // Apply the translateX value based on the click count
          var translateXValue = -100 - (clickCount * 100); // Decrease by 100% each time

          // If it's beyond the last slide, reset to -100%
          if (translateXValue <= -(slideCount * 100)) {
              translateXValue = -100; // Reset to the first state
              clickCount = 0; // Reset click count
          }

          // Apply the transform and transition
          slide.css({
              transform: 'translateX(' + translateXValue + '%)',
              transition: 'transform ' + slideDuration + 'ms ease-in-out',
          });
      });

      // Update the navigation dots
      $navDots.removeClass('w-active');
      $navDots.eq(index).addClass('w-active');

      // Update the current index
      currentIndex = index;

      // Set initialized flag after first run
      if (!isInitialized) {
          isInitialized = true; // Set the flag to true after the first initialization
      }
  }

  // Navigation buttons (Next / Previous)
  $('.slider-nav_beige.is-left').click(function() {
      clickCount--;
      if (clickCount <= slideCount) {
          clickCount = slideCount;
      }
      var nextIndex = (currentIndex + 1) % slideCount;
      showSlide(nextIndex);
      return false;
  });

  $('.slider-nav_beige.is-right').click(function() {
      clickCount++;
      if (clickCount >= slideCount) {
          clickCount = 0;
      }
      var nextIndex = (currentIndex + 1) % slideCount;
      showSlide(nextIndex);
      return false;
  });

  // Navigation dots click event
  $navDots.click(function() {
      var dotIndex = $(this).index();
      showSlide(dotIndex);
  });

  // Autoplay functionality
  if (autoplay) {
      setInterval(function() {
          var nextIndex = (currentIndex + 1) % slideCount;
          showSlide(nextIndex);
      }, autoplayDelay);
  }

  // Add Drag/Swipe Functionality
  var isDragging = false;
  var startX = 0, endX = 0;

  $slider.on('mousedown touchstart', function(e) {
      isDragging = true;
      startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  });

  $(document).on('mouseup touchend', function(e) {
      if (!isDragging) return;
      isDragging = false;

      endX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
      var deltaX = endX - startX;

      if (deltaX > 50) {
          // Dragged Right: Trigger Left Navigation
          $('.slider-nav_beige.is-left').trigger('click');
      } else if (deltaX < -50) {
          // Dragged Left: Trigger Right Navigation
          $('.slider-nav_beige.is-right').trigger('click');
      }
  });

  // Show the first slide on load
  showSlide(currentIndex);
});
