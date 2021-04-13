'use strict';

const books = document.querySelector('.books'),
      booksElems = document.querySelectorAll('.book'),
      body = document.getElementsByTagName('body'),
      a = booksElems[4].getElementsByTagName('a'),
      adv = document.querySelector('.adv'),
      book2List = booksElems[0].getElementsByTagName('li'),
      book5List = booksElems[5].getElementsByTagName('li'),
      book6List = booksElems[2].getElementsByTagName('li'),
      books6UL = booksElems[2].getElementsByTagName('ul'),
      bg = 'url("image/you-dont-know-js.jpg")';


// Восстановить порядок книг
books.prepend(booksElems[1]);
booksElems[0].after(booksElems[4]);
booksElems[5].after(booksElems[2]);

//Заменить картинку заднего фона на другую из папки image
body[0].setAttribute('style', `background-image: ${bg}`);

//Исправить заголовок в книге 3
a[0].textContent = 'Книга 3. this и Прототипы Объектов';

//Удалить рекламу со страницы
adv.remove();

//Восстановить порядок глав во второй и пятой книге 
book2List[1].after(book2List[3]);
book2List[2].after(book2List[6]);
book2List[3].after(book2List[8]);
book2List[9].after(book2List[5]);

book5List[1].after(book5List[9]);
book5List[5].after(book5List[3]);
book5List[8].after(book5List[6]);

//в шестой книге добавить главу и поставить её в правильное место
const newElem = document.createElement('li'); 
newElem.textContent = 'Глава 8: За пределами ES6';
books6UL[0].insertAdjacentElement('beforeend', newElem);
book6List[8].after(book6List[10]);
