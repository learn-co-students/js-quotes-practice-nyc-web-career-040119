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
        <a href="#new-quote-form"><button class='btn-info edit-btn'>Edit</button></a>
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
    } else if (e.target.classList.contains("edit-btn")) {
      grab("label", newQuoteForm).innerText = `Edit Quote ${currLi.id}`
      const quoteElt = currLi.querySelector("p")
      const authorElt = currLi.querySelector("footer")

      newQuoteForm.elements[0].value = quoteElt.innerText
      newQuoteForm.elements[1].value = authorElt.innerText
      newQuoteForm.elements[2].value = currLi.id
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
  const id = newQuoteForm.elements[2].value

  if (!id) {
    // IF NO ID (i.e. NEW QUOTE) //////////
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
  } else {
    // IF ID EXISTS (i.e. EDIT QUOTE) //////////
    fetch(`http://localhost:3000/quotes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({quote: quote, author: author, likes: 1}),
      headers:{
        'Content-Type': 'application/json'
      }
    })
      .then(r => r.json())
      .then(editQuote => {
        const quoteListCopy = [...quoteList.children]

        const currLi = quoteListCopy.filter((li) => {
          return li.id == editQuote.id
        })[0]

        currLi.querySelector("p").innerText = editQuote.quote
        currLi.querySelector("footer").innerText = editQuote.author

        grab("label", newQuoteForm).innerText = "New Quote"
        newQuoteForm.querySelector("#id").value = ""
    })
  }
  newQuoteForm.reset()
})


// SORT FUNCTIONALITY ////////////////////
let sortOrder = 0
const sortBtn = grab("#sort-btn")

sortBtn.addEventListener("click", (e) => {
  sortOrder = (sortOrder + 1) % 3

  const sortedUl = [...quoteList.children]


  if (sortOrder === 0) {
    // BY ID ////////////////////
    sortedUl.sort((a,b) => (
      a.id - b.id
    ))
    sortBtn.innerText = "Sorted By Quote ID"
  } else if (sortOrder === 1) {
    // BY AUTHOR ASC ////////////////////
    sortedUl.sort((a,b) => (
      grab("footer", a).innerText.localeCompare(grab("footer", b).innerText)
    ))
    sortBtn.innerText = "Sorted By Author Asc"
  } else if (sortOrder === 2) {
    // BY AUTHOR DESC ////////////////////
    sortedUl.sort((a,b) => (
      grab("footer", b).innerText.localeCompare(grab("footer", a).innerText)
    ))
    sortBtn.innerText = "Sorted By Author Desc"
  }

  // REPLACE WITH SORTED ////////////////////
  for (const li of sortedUl) {
    // IF A CHILD ALREADY EXISTS, .appendChild JUST MOVES THE POSITION OF THAT CHILD.
    // .appendChild ***DOES NOT*** ADD A COPY OF AN EXISTING NODE
    quoteList.appendChild(li)
  }
})
