document.addEventListener('DOMContentLoaded', function () {
   const inputs = document.querySelectorAll('.wrap-field input');

   inputs.forEach(input => {
      const parent = input.closest('.wrap-field');

      const toggleClass = () => {
         if (input.value.trim() !== '' || document.activeElement === input) {
            parent.classList.add('active');
         } else {
            parent.classList.remove('active');
         }
      };

      toggleClass();

      input.addEventListener('focus', toggleClass);
      input.addEventListener('blur', toggleClass);

      input.addEventListener('input', () => {
         toggleClass();

         if (input.classList.contains('phone')) {
            let raw = input.value;
            let result = '';

            let hasPlus = false;
            let hasOpenParen = false;
            let hasCloseParen = false;
            let lastCharType = ''; // 'digit', '(', ')', '-', 'space', 'plus'

            for (let i = 0; i < raw.length; i++) {
               const char = raw[i];

               if (char === '+') {
                  if (!hasPlus && result.length === 0) {
                     result += '+';
                     hasPlus = true;
                     lastCharType = 'plus';
                  }
               } else if (/\d/.test(char)) {
                  result += char;
                  lastCharType = 'digit';
               } else if (char === '(' && !hasOpenParen) {
                  result += '(';
                  hasOpenParen = true;
                  lastCharType = '(';
               } else if (char === ')' && !hasCloseParen) {
                  result += ')';
                  hasCloseParen = true;
                  lastCharType = ')';
               } else if ((char === ' ' || char === '-') &&
                          (lastCharType === 'digit' || lastCharType === ')')) {
                  // разрешаем пробел или дефис только после цифры или )
                  // исключаем дубликаты подряд
                  if (!(lastCharType === ' ' && char === ' ') && !(lastCharType === '-' && char === '-')) {
                     result += char;
                     lastCharType = char;
                  }
               } else {
                  continue; // все остальные символы игнорируем
               }
            }

            input.value = result;
         }
      });
   });

   // button
   document.querySelectorAll('.get-in-touch-page__item').forEach(form => {
      const checkbox = form.querySelector('input[type="checkbox"]');
      const button = form.querySelector('input[type="submit"]');

      if (checkbox && button) {
         const toggleButton = () => {
            button.disabled = !checkbox.checked;
         };
         toggleButton();
         checkbox.addEventListener('change', toggleButton);
      }

      /*
      button.addEventListener('click', () => {
         button.classList.add('active');
      });
      */
   });
	
   // 
   const fields = document.querySelectorAll('.wrap-field .wpcf7-validates-as-required');
   fields.forEach(field => {
      const wrap = field.closest('.wrap-field');

      if (!wrap) return;

      const observer = new MutationObserver(() => {
         if (field.classList.contains('wpcf7-not-valid')) {
            wrap.classList.add('wrap-no-valid-field');
         } else {
            wrap.classList.remove('wrap-no-valid-field');
         }
      });

      observer.observe(field, {
         attributes: true,
         attributeFilter: ['class']
      });
   });

	// 
	const input = document.getElementById("text");
   const counter = document.querySelector(".char-count");
   if (input && counter) {
      input.addEventListener("input", function () {
         counter.textContent = input.value.length;
      });
   }


   // Popup 
   const popupSuccesfully = document.getElementById('popup-succesfully');
   const popupFailedToSend = document.getElementById('popup-failed-to-send');

   // Закрытие попапов
   if (popupSuccesfully) {
      const popupSuccesfullyClose = document.getElementById('popup-succesfully-close');
      popupSuccesfullyClose.addEventListener('click', () => {
         popupSuccesfully.classList.remove('open');
      });
   }

   if (popupFailedToSend) {
      const popupFailedToSendClose = document.getElementById('popup-failed-to-send-close');
      popupFailedToSendClose.addEventListener('click', () => {
         popupFailedToSend.classList.remove('open');
      });
   }

   // Отслеживаем событие отправки любой формы CF7
   document.addEventListener('wpcf7submit', function(event) {
		const form = event.target; 
		const submitButton = form.querySelector('[type="submit"]');
		const status = event.detail.status;

		if (status === 'mail_sent') {
			if (submitButton) {
				submitButton.setAttribute('disabled', 'disabled'); // 🚀 блокируем кнопку
			}

			if (popupSuccesfully) {
				popupSuccesfully.classList.add('open');

				setTimeout(() => {
					popupSuccesfully.classList.remove('open');
				}, 4000);
			}
		} else if (status === 'mail_failed') {
			if (popupFailedToSend) {
				popupFailedToSend.classList.add('open');

				setTimeout(() => {
					popupFailedToSend.classList.remove('open');
				}, 5000);
			}

			// Если ошибка — кнопку разблокируем, чтобы юзер мог повторить
			if (submitButton) {
				submitButton.removeAttribute('disabled');
			}
		}
	});


   // 
   const copyBtn = document.getElementById('copy-email-button');
   if (copyBtn) {
      copyBtn.addEventListener('click', () => {
         const textToCopy = copyBtn.getAttribute('data-link-copy');

         if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
               copyBtn.classList.add('copied');
               setTimeout(() => {
                  copyBtn.classList.remove('copied');
               }, 3000);
            }).catch(err => {
               console.error('Ошибка копирования: ', err);
            });
         }
      });
   }
});