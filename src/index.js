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
            <div edit-quote-id="${quote.id}">
              <p class="mb-0">${quote.quote}</p>
              <button class='btn-edit' edit-btn-id="${quote.id}">Edit</button>
            </div>
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
      }//Delete


      //beginning of Like
      let likeCheck = event.target.innerHTML;
      if (likeCheck === "Likes: ") {
      let spanTag = onClick.children[0]
      let quoteId = parseInt(spanTag.id)
      let numLikes = parseInt(onClick.children[0].innerText)

        spanTag.innerText = `${numLikes + 1}`
      fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          "likes": ++numLikes
        })
      })
      .then(resp => resp.json())
      .then((obj) => {
        obj.likes+=1
        return obj.likes;
      })//END of Like
    }



      //BEG of Edit
      // let editId = parseInt(event.target.id)
      //
      //     const editBtn = document.querySelector( `[edit-btn-id="${editId}"]`)
      //
      //     editBtn.addEventListener("click", function(event){
      //       let editTarget = document.querySelector( `[edit-quote-id="${editId}"]`)
      //       editTarget.innerHTML=``
      //       console.log(event.target)
      //
      //       debugger
      //
      //       editTarget.parentElement.innerHTML=``
      //
      //       editTarget.addEventListener("submit", function(event){
      //
      //       })
      //       editTarget.innerHTML=``
      //     })


      console.log(event.target)

    })//Delete & Like buttons


    newQuoteFormBox.addEventListener("submit", function(event){
      event.preventDefault()

      let newQuote = document.querySelector("#new-quote")
      let newAuthor = document.querySelector("#new-author")
      fetch(quotesUrl, {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          "quote": newQuote.value,
          "author": newAuthor.value,
          "likes": 0
        })
      })
      .then(resp => resp.json())
      .then((quote) => {
        console.log(quote)
        ulQuoteList.innerHTML += `
          <li class='quote-card'>
            <blockquote class="blockquote">
            <div edit-quote-id="${quote.id}">
              <p class="mb-0">${quote.quote}</p>
              <button class="btn-edit" edit-btn-id="${quote.id}">Edit</button>
            </div>
              <footer class="blockquote-footer">${quote.author}</footer>
              <br>
              <button class='btn-success'>Likes: <span id="${quote.id}">${quote.likes}</span></button>
              <button class='btn-danger' id="${quote.id}">Delete</button>
            </blockquote>
          </li>`

      })
      newQuoteFormBox.reset()
    })//AddNewQuote END, adds to DB




}) //DOMContentLoaded END
