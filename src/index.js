const grab = (sel, parent = document) => parent.querySelector(sel)

const quoteList = grab("#quote-list")
const newQuoteForm = grab("#new-quote-form")

const addNewQuoteToDOM = (quoteObj) => {
  const currLi = document.createElement("li")
  currLi.className = "quote-card"
  currLi.id = `${quoteObj.id}`

  currLi.innerHTML = `
      <blockquote class="blockquote">
        <p class="mb-0">${quoteObj.quote}</p>
        <footer class="blockquote-footer">${quoteObj.author}</footer>
        <br>
        <button class='btn-success like-btn'>Likes: <span>${quoteObj.likes}</span></button>
        <button class='btn-danger del-btn'>Delete</button>
      </blockquote>
      <hr>
  `
  quoteList.appendChild(currLi)

  currLi.addEventListener("click", (e) => {
    if (e.target.classList.contains("like-btn")) {
      // LIKE BUTTON //////////
      let likeSpan = grab(".like-btn span", currLi)
      likeSpan.innerText = Number(likeSpan.innerText) + 1

      fetch(`http://localhost:3000/quotes/${currLi.id}`, {
        method: "PATCH",
        body: JSON.stringify({likes: likeSpan.innerText}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } else if (e.target.classList.contains("del-btn")) {
      // DELETE BUTTON //////////
      fetch(`http://localhost:3000/quotes/${currLi.id}`, {method: "DELETE"})
      currLi.remove()
    }
  })
}


// ADD EACH QUOTE AS li ON PAGE LOAD ////////////////////
fetch("http://localhost:3000/quotes")
  .then(r => r.json())
  .then(quotesArr => {
    for (const quoteObj of quotesArr) {
      addNewQuoteToDOM(quoteObj)
    }
})


// NEW QUOTE FORM ////////////////////
newQuoteForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const quote = newQuoteForm.elements[0].value
  const author = newQuoteForm.elements[1].value

  fetch("http://localhost:3000/quotes", {
    method: 'POST',
    body: JSON.stringify({quote: quote, author: author, likes: 1}),
    headers:{
      'Content-Type': 'application/json'
    }
  })
    .then(r => r.json())
    .then(newQuote => {
      addNewQuoteToDOM(newQuote)
  })

  newQuoteForm.reset()
})
