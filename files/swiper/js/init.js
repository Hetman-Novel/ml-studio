const lazyImages = document.querySelectorAll('.swiper-slide img[loading="lazy"]'); // Get all images with the loading="lazy" attribute
function addLoadedClass(image) { // Function to add class to image parent after it is loaded
   const parentElement = image.parentElement;
   if (image.complete) { // Check if the image is loaded
      parentElement.classList.add('loaded');
   } else {
      image.addEventListener('load', function() { // Add a load event to add the class after the image has loaded
         parentElement.classList.add('loaded');
      });
   }
}
lazyImages.forEach(addLoadedClass); // Loop through all the images and call the addLoadedClass function for each one
/* === */

/* Cases slider -> */
const casesSlider = document.getElementById('cases-slider');
if (casesSlider) {
  const swiper = new Swiper(casesSlider, {
    // НЕ используем mousewheel-модуль
    scrollbar: { el: '#cases-slider-scrollbar', draggable: true },
    slidesPerView: 3,
    slidesPerGroup: 1,
    spaceBetween: 25,
    loop: false,
    speed: 600,
    preloadImages: false,
    lazy: { loadOnTransitionStart: false, loadPrewNext: false },
    breakpoints: {
      0:   { slidesPerView: 1.27, spaceBetween: 24 },
      480: { slidesPerView: 2,    spaceBetween: 25 },
      768: { slidesPerView: 3,    spaceBetween: 25 },
    },
  });

  // аккумулируем делту, чтобы на тачпадах не было «дребезга»
  let acc = 0;
  const STEP_PX = 60;          // чувствительность «шага» колеса
  const DURATION = 800;        // плавность анимации

  casesSlider.addEventListener('wheel', (e) => {
    const dy = e.deltaY || 0;

    // На краях — не мешаем странице скроллиться
    if ((swiper.isBeginning && dy < 0) || (swiper.isEnd && dy > 0)) {
      return; // НЕ preventDefault — отдать скролл странице
    }

    acc += dy;

    if (Math.abs(acc) >= STEP_PX) {
      e.preventDefault(); // блокируем вертикальный скролл, пока крутим слайдер
      e.stopPropagation();

      const dir = acc > 0 ? 1 : -1; // вниз = вперёд, вверх = назад
      acc = 0;

      const next = Math.max(0, Math.min(
        swiper.slides.length - 1,
        swiper.activeIndex + dir
      ));

      swiper.slideTo(next, DURATION);
    }
  }, { passive: false }); // обязателен passive:false, чтобы preventDefault сработал
}
/* <- Cases slider */

/* Reviews slider -> */
let reviewsSlider = document.getElementById('reviews-slider');
if (reviewsSlider) {
   new Swiper(reviewsSlider, {
      navigation: {
         prevEl: '#reviews-btn-prev',
         nextEl: '#reviews-btn-next',
      },
      scrollbar: {
         el: '#reviews-scrollbar',
         draggable: true,
      },
      autoHeight: false,
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchOverflow: true,
      spaceBetween: 30,
      loop: false,
      speed: 800,
      effect: 'fade',
      fadeEffect: {
         crossFade: true
      },
   });
}
/* <- Reviews slider */

/* Practice slider -> */
document.addEventListener('DOMContentLoaded', function() {
   let swiperInstance = null;
   const breakpoint = 861;
   const slider = document.getElementById('practice-single-slider');

   function initOrDestroySlider() {
      const screenWidth = window.innerWidth;

      if (screenWidth >= breakpoint && !swiperInstance && slider) {
         swiperInstance = new Swiper(slider, {
            slidesPerView: 'auto',
            spaceBetween: 24,
            speed: 1000,
            effect: 'slide',
            loop: true,
            freeMode: {
               enabled: true,
               sticky: false,
               momentum: true,
               momentumRatio: 0.96,
               momentumBounce: false,
            },
            mousewheel: {
               releaseOnEdges: true,
               sensitivity: 0.2,      // плавность прокрутки
               invert: false,
               eventsTarget: '#practice-single-slider',
            },
         });
      }

      if (screenWidth < breakpoint && swiperInstance) {
         swiperInstance.destroy(true, true);
         swiperInstance = null;
      }
      let velocity = 0;
      slider.addEventListener('wheel', (e) => {
      e.preventDefault();
         velocity += e.deltaY * 0.1;
      });
      function animate() {
         if (Math.abs(velocity) > 0.1) {
            swiperInstance.setTranslate(swiperInstance.getTranslate() - velocity);
            velocity *= 0.96;
         }
         requestAnimationFrame(animate);
      }
      animate();
   }

   window.addEventListener('load', initOrDestroySlider);
   window.addEventListener('resize', initOrDestroySlider);
   window.addEventListener('orientationchange', initOrDestroySlider);

   // 
   function setTextWidth() {
      document.querySelectorAll('.slide-inner, .slide-inner').forEach(slide => {
         const img = slide.querySelector('img');
         const text = slide.querySelector('.practice-single__slider-text');

         if (img && text) {
            if (img.complete) {
               text.style.width = img.offsetWidth + 'px';
            } else {
               img.addEventListener('load', () => {
                  text.style.width = img.offsetWidth + 'px';
               });
            }
         }
      });
   }
   window.addEventListener('load', setTextWidth);
   window.addEventListener('resize', setTextWidth);
   window.addEventListener('orientationchange', setTextWidth);

   // 
   function updateSlideHeights() {
      const slides = slider.querySelectorAll('.there-is-text');

      slides.forEach(slide => {
         const textBlock = slide.querySelector('.practice-single__slider-text');
         const imageWrap = slide.querySelector('.slide-wrap-img');

         if (textBlock && imageWrap) {
            const slideHeight = slide.clientHeight;
            const textHeight = textBlock.offsetHeight;
            imageWrap.style.height = (slideHeight - textHeight) + 'px';
         }
      });
   }
   window.addEventListener('load', updateSlideHeights);
   window.addEventListener('resize', updateSlideHeights);
   window.addEventListener('orientationchange', updateSlideHeights);

});
/* <- Practice slider */