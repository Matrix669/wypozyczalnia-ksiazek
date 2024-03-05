const btnAddStudent = document.querySelector('.btn-add-student')
const btnAddBook = document.querySelector('.btn-add-book')
const btnShowStudents = document.querySelector('.btn-show-students')
const btnShowBooks = document.querySelector('.btn-show-books')

const btnSubmit = document.querySelector('.btn-submit')
const btnClear = document.querySelector('.btn-clear')
const formStudent = document.querySelector('.form')
const selectBook = document.querySelector('.select')
const inputName = document.querySelector('.input-name')
const inputSurname = document.querySelector('.input-surname')
const inputClass = document.querySelector('.input-class')
const inputDateBirth = document.querySelector('.input-birthDate')
const infoBookContainer = document.querySelector('.info-book')
const studentsContainer = document.querySelector('.students-container')
const booksContainer = document.querySelector('.books-container')

const inputArr = [inputName, inputSurname, inputClass, inputDateBirth]

// show and hide forms

function handleForm() {
	clearBookInfo()
	if (formStudent.className === 'form d-none') {
		formStudent.className = 'form'
		selectBook.className = 'select form-select fs-4 py-4 px-2 d-none'
		studentsContainer.classList.remove('active')
		booksContainer.classList.remove('active')
	} else {
		formStudent.className = 'form d-none'
	}
}

function handleSelect() {
	clearBookInfo()
	if (selectBook.className === 'select form-select fs-4 py-4 px-2 d-none') {
		selectBook.className = 'select form-select fs-4 py-4 px-2'
		formStudent.className = 'form d-none'
		studentsContainer.classList.remove('active')
		booksContainer.classList.remove('active')
	} else {
		selectBook.className = 'select form-select fs-4 py-4 px-2 d-none'
	}
}

function handleShowStudents() {
	studentsContainer.classList.toggle('active')
	selectBook.className = 'select form-select fs-4 py-4 px-2 d-none'
	formStudent.className = 'form d-none'
	booksContainer.classList.remove('active')
}

function handleShowBooks() {
	booksContainer.classList.toggle('active')
	selectBook.className = 'select form-select fs-4 py-4 px-2 d-none'
	formStudent.className = 'form d-none'
	studentsContainer.classList.remove('active')
}

// form validation

function showError(input, msg) {
	const formBox = input.parentElement
	const errorMsg = formBox.querySelector('.error-info')

	formBox.classList.add('error')
	errorMsg.textContent = msg
}

function clearError(input) {
	const formBox = input.parentElement
	formBox.classList.remove('error')
}

function clearForm(e) {
	e.preventDefault()
	inputArr.forEach(el => {
		el.value = ''
		clearError(el)
	})
}

function checkForm(input) {
	input.forEach(el => (el.value === '' ? showError(el, el.placeholder) : clearError(el)))
}

function checkLengthInput(input, min) {
	if (input.value.length < min) {
		showError(input, `${input.previousElementSibling.innerText.slice(0, -1)} składa się z min. ${min} znaków`)
	}
}

function checkDateBirth(dateBirth) {
	const birthDate = new Date(dateBirth.value)
	const today = new Date()
	const minAge = 16

	let age = today.getFullYear() - birthDate.getFullYear()
	const monthDiff = today.getMonth() - birthDate.getMonth()
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--
	}

	age < minAge ? showError(dateBirth, 'Musisz mieć co najmniej 16 lat!') : ''
}

function checkErrors() {
	const allInputs = document.querySelectorAll('.form-box')
	let errorCount = 0

	allInputs.forEach(input => {
		if (input.classList.contains('error')) {
			errorCount++
		}
	})

	if (errorCount === 0) {
		console.log('wysyłanie...')
	}
	console.log(errorCount)
}

// backhand

async function getData(url) {
	return fetch(url)
		.then(response => response.json())
		.catch(error => console.log(`Błąd: ${error}`))
}

function clearSelectAndBookInfo() {
	selectBook.value = 'Wybierz książkę'
	clearBookInfo()
}

function displayBookInfo(book) {
	infoBookContainer.innerHTML = `
	<div>
		<p>autor: ${book.autor}</p>
		<p>data_wydania: ${book.data_wydania}</p>
		<p>tytul: ${book.tytul}</p>
		<p>ISBN: ${book.ISBN}</p>
	</div>
	<div class="d-flex">
		<button class="info-book--clearBtn btn btn-primary w-100 m-1 px-4 py-3 fs-4">Wyczyść</button>
		<button class="info-book--sendBtn btn btn-primary w-100 m-1 px-4 py-3 fs-4">Wyślij</button>
	</div>
	`
	const infoBookContainerClearBtn = infoBookContainer.querySelector('.info-book--clearBtn')
	infoBookContainerClearBtn.addEventListener('click', clearSelectAndBookInfo)
}

function clearBookInfo() {
	infoBookContainer.innerHTML = ''
	infoBookContainer.classList.remove('active')
}
function handleSelectChange(books) {
	selectBook.addEventListener('change', () => {
		const selectedTitle = selectBook.value
		if (selectedTitle === 'Wybierz książkę' || formStudent.className === 'form') {
			clearBookInfo()
		} else {
			infoBookContainer.classList.add('active')
			const selectedBook = books.find(book => book.tytul === selectedTitle)
			displayBookInfo(selectedBook)
		}
	})
}

function getDataBooks() {
	const url = 'https://imiki.pl/projekt/API/books'
	getData(url).then(data => {
		const books = data.ksiazki
		books.forEach(book => {
			const optionSelect = document.createElement('option')
			optionSelect.value = book.tytul
			optionSelect.textContent = book.tytul
			selectBook.appendChild(optionSelect)
		})
		handleSelectChange(books)
	})
}

btnAddStudent.addEventListener('click', handleForm)
btnAddBook.addEventListener('click', handleSelect)
btnClear.addEventListener('click', clearForm)
btnSubmit.addEventListener('click', e => {
	e.preventDefault()
	checkForm(inputArr)
	checkLengthInput(inputName, 3)
	checkLengthInput(inputSurname, 3)
	checkLengthInput(inputClass, 2)
	checkDateBirth(inputDateBirth)
	checkErrors()
})
btnShowStudents.addEventListener('click', handleShowStudents)
btnShowBooks.addEventListener('click', handleShowBooks)
getDataBooks()
