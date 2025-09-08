document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('drop-zone');
  const filePicker = document.getElementById('select-file'); // <-- переименовано
  const preview = dropZone.querySelector('.preview');

  if (!dropZone || !filePicker || !preview) {
    console.error('Не найден dropZone / select-file / preview');
    return;
  }

  let filesArray = [];

  function addFiles(fileList) {
      const list = Array.from(fileList).filter(f => f && f.type && f.type.startsWith('image/'));
      if (!list.length) {
         console.log('Файлы не являются изображениями или список пуст');
         return;
      }
      filesArray = filesArray.concat(list);
      console.log('Добавлены файлы:', list.map(f => f.name));
      renderPreview();
   }

   function renderPreview() {
      preview.innerHTML = '';
      const count = filesArray.length;
      if (count === 0) {
         preview.style.display = 'none';
         return;
      }
      preview.style.display = 'flex';

      filesArray.forEach((file, idx) => {
         const wrap = document.createElement('div');
         wrap.className = 'thumb';
         wrap.style.width = `${100 / count}%`;
         wrap.style.height = '100%';
         wrap.style.overflow = 'hidden';
         wrap.style.position = 'relative';

         const img = document.createElement('img');
         img.alt = file.name || `image-${idx}`;
         img.src = URL.createObjectURL(file);
         img.loading = 'lazy';
         img.style.width = '100%';
         img.style.height = '100%';
         img.style.objectFit = 'cover';
         img.addEventListener('load', () => {
         try { URL.revokeObjectURL(img.src); } catch (e) {}
         });

         const delBtn = document.createElement('button');
         delBtn.type = 'button';
         delBtn.textContent = '✕';
         delBtn.title = 'Remove';
         // минимальный стиль для кнопки
         Object.assign(delBtn.style, {
         position: 'absolute',
         top: '8px',
         right: '8px',
         zIndex: 30,
         background: 'rgba(0,0,0,0.45)',
         color: '#fff',
         border: 'none',
         width: '28px',
         height: '28px',
         borderRadius: '50%',
         cursor: 'pointer'
         });
         delBtn.addEventListener('click', (e) => {
         e.stopPropagation();
         filesArray.splice(idx, 1);
         renderPreview();
         });

         wrap.appendChild(img);
         wrap.appendChild(delBtn);
         preview.appendChild(wrap);
      });
   }

   // Универсальный prevent для drag/drop
   function preventAndLog(e) {
      e.preventDefault();
      e.stopPropagation();
      // console.log('drag event:', e.type);
   }

   // Вешаем на обе ноды — drop может попасть либо на dropZone, либо на filePicker (он покрывает зону)
   ['dragenter','dragover','dragleave','drop'].forEach(evt => {
      dropZone.addEventListener(evt, preventAndLog);
      filePicker.addEventListener(evt, preventAndLog);
   });

   // Визуал на dragover
   dropZone.addEventListener('dragover', () => dropZone.classList.add('dragover'));
   dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

   // drop на зоне
   dropZone.addEventListener('drop', (e) => {
      dropZone.classList.remove('dragover');
      const dt = e.dataTransfer;
      console.log('drop на dropZone, files:', dt && dt.files && dt.files.length ? dt.files.length : 0);
      if (dt && dt.files && dt.files.length) addFiles(dt.files);
   });

   // на случай, если input поверх (ловим drop на input)
   filePicker.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      console.log('drop на filePicker, files:', dt && dt.files && dt.files.length ? dt.files.length : 0);
      if (dt && dt.files && dt.files.length) addFiles(dt.files);
   });

   // выбор через диалог
   filePicker.addEventListener('change', (e) => {
      console.log('change event, выбранных файлов:', e.target.files && e.target.files.length ? e.target.files.length : 0);
      if (e.target.files && e.target.files.length) addFiles(e.target.files);
      filePicker.value = ''; // чистим, чтобы можно было выбрать те же файлы ещё раз
   });

   // небольшая подсказка в консоль — для отладки
   console.log('dropZone, filePicker и preview готовы. Пожалуйста, проверь в консоли события при drag/drop или выборе.');


   // Следим за изменениями внутри preview
   const previewParent = preview.parentElement;

   const observer = new MutationObserver(() => {
   if (preview.querySelectorAll('.thumb').length > 0) {
      previewParent.classList.add('has-images');
   } else {
      previewParent.classList.remove('has-images');
   }
   });

   // Настройка наблюдателя
   observer.observe(preview, {
      childList: true, // следим за добавлением/удалением прямых детей
      subtree: true    // и вложенных элементов
   });

});