// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const allQuotes = `http://localhost:3000/quotes`
// fetch(allQuotes) Populate page w/quotes
const ul = document.getElementById("quote-list")
const form = document.getElementById("new-quote-form")
const inputQuote = document.getElementById("new-quote")
const inputAuthor = document.getElementById("author")

fetch(allQuotes)
.then(res=>res.json())
.then(quotes=>{
  quotes.forEach(quote=>{
    renderQuote(quote)
  })
})

function renderQuote(quote){
  ul.innerHTML +=
  `<li class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>0</span></button>
      <button id='${quote.id}' class='btn-danger'>Delete</button>
    </blockquote>
  </li>`
}

// submit form, create a new quote, adds it to ul.innerHTML
form.addEventListener('submit',e=>{
  e.preventDefault()
  fetch(allQuotes,{
      method: 'POST',
     body: JSON.stringify({
       quote: inputQuote.value,
       author: inputAuthor.value
     }),
     headers:{
       'Content-Type': 'application/json',
       'Accept': 'application/json'
     }
  })
  .then(res=>res.json())
  .then(quote=>{
    renderQuote(quote)
  })
  //after submit, need to clean the content of inputQuote & inputAuthor
 form.reset()
})

ul.addEventListener('click', e=>{
    if(e.target.className == 'btn-danger'){
       let quoteId = e.target.id
      // console.log(e.target.parentElement)
        let li = e.target.parentElement.parentElement
       li.remove();
       fetch(`${allQuotes}/${quoteId}`,{
           method: 'DELETE',
          body: JSON.stringify({
            id: quoteId
          }),
          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
       })
    }
    if(e.target.className == 'btn-success'){
      // debugger
      // console.log(e.target.nextElementSibling)
      let quoteId = e.target.nextElementSibling.id
      let like = e.target.firstElementChild
      let likeNum = parseInt(like.innerText)
      // console.log(likeNum)

      fetch(`${allQuotes}/${quoteId}`,{
          method: 'PATCH',
         body: JSON.stringify({
           likes: ++likeNum
         }),
         headers:{
           'Content-Type': 'application/json',
           'Accept': 'application/json'
         }
      })
      .then(like.innerText = `${likeNum}`)
    }
})
