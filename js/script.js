const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'book_APPS';

const checkbox = document.getElementById('inputBookIsComplete');
const submitButton = document.getElementById('bookSubmit');
const statusText = submitButton.querySelector('span');


function generateId() {
  return +new Date();
}

function generatebookObject(id, title, penulis, timestamp, isCompleted) {
  return {
    id,
    title,
    penulis,
    timestamp,
    isCompleted
  }
}

function findbook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findbookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}


/**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
function isStorageExist() /* boolean */ {
if (typeof (Storage) === undefined) {
  alert('Browser kamu tidak mendukung local storage');
  return false;
}
return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see books}
 */
function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}


function makebook(bookObject) {
  const {id, title, penulis, timestamp, isCompleted} = bookObject;

  const textTitle = document.createElement('h2');
  textTitle.innerText = `Judul buku : ${title}`;

  const textPenulis = document.createElement('p');
  textPenulis.innerText = `Penulis buku : ${penulis}`;

  const textTimestamp = document.createElement('p');
  textTimestamp.innerText = `Tanggal terbit : ${timestamp}`;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textPenulis, textTimestamp);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow')
  container.style.padding = '24px';
  container.append(textContainer);
  container.setAttribute('id', `book-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {

    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addbook() {
  const textbook = document.getElementById('title').value;
  const penulisbook = document.getElementById('penulis').value;
  const timestamp = document.getElementById('date').value;
  const generatedID = generateId();

  if (checkbox.checked) {
    const bookObject = generatebookObject(generatedID, textbook, penulisbook, timestamp, true);
    books.push(bookObject);
  } else{
    const bookObject = generatebookObject(generatedID, textbook, penulisbook, timestamp, false);
    books.push(bookObject);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  // Mengosongkan kolom isian formulir
  document.getElementById('title').value = '';
  document.getElementById('penulis').value = '';
  document.getElementById('date').value = '';
}

function addTaskToCompleted(bookId /* HTMLELement */) {
const bookTarget = findbook(bookId);

if (bookTarget == null) return;

bookTarget.isCompleted = true;
document.dispatchEvent(new Event(RENDER_EVENT));
saveData();
}

function removeTaskFromCompleted(bookId /* HTMLELement */) {
const bookTarget = findbookIndex(bookId);

if (bookTarget === -1) return;

books.splice(bookTarget, 1);
document.dispatchEvent(new Event(RENDER_EVENT));
saveData();
}

function undoTaskFromCompleted(bookId /* HTMLELement */) {

const bookTarget = findbook(bookId);
if (bookTarget == null) return;

bookTarget.isCompleted = false;
document.dispatchEvent(new Event(RENDER_EVENT));
saveData();
}

document.addEventListener('DOMContentLoaded', function () {

  const submitForm /* HTMLFormElement */ = document.getElementById('form');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addbook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  // console.log('Data berhasil di simpan.');

  const savedData = localStorage.getItem(STORAGE_KEY);
  console.log(savedData);

});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedbookList = document.getElementById('books');
  const listCompleted = document.getElementById('completed-books');

  // clearing list item
  uncompletedbookList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makebook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedbookList.append(bookElement);
    }
  }
});


// Update Checkbox
checkbox.addEventListener('change', function () {
  if (checkbox.checked) {
    statusText.innerText = 'Sudah selesai dibaca';
  } else {
    statusText.innerText = 'Belum selesai dibaca';
  }
});
