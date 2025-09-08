const cursor = document.querySelector('.cursor-follower');
const block = document.querySelector('.block');

document.addEventListener('DOMContentLoaded', function() {
   
   if (cursor) {
      cursor.classList.remove('hidden');
   }
});

let mouseX = 0, mouseY = 0;   // реальные координаты курсора
let currentX = 0, currentY = 0; // позиция кружка

document.addEventListener('mousemove', e => {
   mouseX = e.clientX;
   mouseY = e.clientY;
});

function animate() {
   // плавно двигаем кружок к мышке (чем меньше коэффициент, тем плавнее)
   currentX += (mouseX - currentX) * 0.1;
   currentY += (mouseY - currentY) * 0.1;

   cursor.style.transform = `translate(${currentX - 5}px, ${currentY - 5}px)`;
   requestAnimationFrame(animate);
}
animate();

// ссылки
document.querySelectorAll('a, button').forEach(link => {
   link.addEventListener('mouseenter', () => {
      if (link.classList.contains('button')) {
         cursor.classList.add('button-hover');
      } else {
         cursor.classList.add('link');
      }
   });
   link.addEventListener('mouseleave', () => {
      cursor.classList.remove('link', 'button-hover');
   });
});

// на все спец-блоки
document.querySelectorAll('.special-block').forEach(block => {
   block.addEventListener('mouseenter', () => {
      cursor.classList.add('block-hover');
      cursor.innerHTML = 'See<br>More';
   });
   block.addEventListener('mouseleave', () => {
      cursor.classList.remove('block-hover');
      cursor.innerHTML = '';
   });
});