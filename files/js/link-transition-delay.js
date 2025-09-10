document.addEventListener('DOMContentLoaded', function() {

   if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.querySelectorAll('.js-transition-delay').forEach(function (link) {
         link.addEventListener('click', function (event) {
            event.preventDefault();
            const href = this.getAttribute('href');
            setTimeout(function () {
               window.location.href = href;
            }, 1000);
         });
      });
   }
});