const quotesUrl = "http://localhost:3000/quotes"
// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener('DOMContentLoaded', (event) => {
  const ulQuoteList = document.querySelector("#quote-list")
  const newQuoteFormBox = document.querySelector("#new-quote-form")



  fetch(quotesUrl).then(resp => resp.json())
    .then(quotesObj => {
      console.log(quotesObj)
      quotesObj.forEach((quote) => {
        ulQuoteList.innerHTML += `
          <li class='quote-card'>
            <blockquote class="blockquote">
              <p class="mb-0">${quote.quote}</p>
              <footer class="blockquote-footer">${quote.author}</footer>
              <br>
              <button class='btn-success'>Likes: <span id="${quote.id}">${quote.likes}</span></button>
              <button class='btn-danger' id="${quote.id}">Delete</button>
            </blockquote>
          </li>`
      })
    })//FETCH-GET End

    ulQuoteList.addEventListener("click", function(event){
      let onClick = event.target
      //delete check
      let deleteCheck = event.target.innerHTML;
      if (deleteCheck === "Delete") {
      let deleteId = parseInt(onClick.id)
        onClick.parentElement.parentElement.remove()
        fetch(`http://localhost:3000/quotes/${deleteId}`, {method:"DELETE"})
      }
    })//Delete a quote, works for db
    newQuoteFormBox.addEventListener("submit", function(event){
      event.preventDefault()

      let newQuote = document.querySelector("#new-quote")
      let newAuthor = document.querySelector("#new-author")
      fetch(quotesUrl, {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          Accepts: "application/json",
        },
        body: JSON.stringify({
          "quote": newQuote.value,
          "author": newAuthor.value,
          "likes": 0
        })
      })
      .then(resp => resp.json())
      .then((newQuoteItem) => {
        console.log(newQuoteItem)
        ulQuoteList.innerHTML += `
          <li class='quote-card'>
            <blockquote class="blockquote">
              <p class="mb-0">${newQuoteItem.quote}</p>
              <footer class="blockquote-footer">${newQuoteItem.author}</footer>
              <br>
              <button class='btn-success'>Likes: <span id="${newQuoteItem.id}">${newQuoteItem.likes}</span></button>
              <button class='btn-danger' id="${newQuoteItem.id}">Delete</button>
            </blockquote>
          </li>`

      })
      newQuoteFormBox.reset()
    })









}) //DOMContentLoaded END
