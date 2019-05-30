// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
window.addEventListener('DOMContentLoaded', (event) => {
  const allQuotes = "http://localhost:3000/quotes"
  const quotesArray = []
  const quoteList = document.querySelector('#quote-list')

  const showing = function(data) {
    fetch(allQuotes, {method: "GET"})
    .then(respond => respond.json())
    .then(datas => {
      // console.log(quotesArray);
      datas.forEach(quotes => {
        quotesArray.push(quotes)
        quoteList.innerHTML +=
            `<li class='quote-card' id='${quotes.id}'>
          <blockquote class="blockquote">
          <p class="mb-0">${quotes.quote}</p>
          <footer class="blockquote-footer">${quotes.author}</footer>
          <br>
          <button class='btn-success' id='like-${quotes.id}' >Likes: <span id=''>${quotes.likes}</span></button>
          <button class='btn-danger' id='delete-${quotes.id}' >Delete</button>
          </blockquote>
          </li>`
          // console.log(deletebtn);
      })//end of forEach

      //
      // const likebtn = document.querySelector(`.`)
      // const deletebtn = document.querySelector('.btn-danger')
      // console.log(likebtn);
      quoteList.addEventListener('click', (e) => {
        if (e.target.className == 'btn-success') {
          let nodeId = e.target.parentNode.parentNode.id
          let likeNum = e.target.childNodes[1].innerText
          likeNum++
          // debugger
          fetch(`http://localhost:3000/quotes/${nodeId}`, {
              method: "PATCH",
              headers:
              {
                  'Content-Type': 'application/json',
              },
                body: JSON.stringify({
                    likes: likeNum
                })
              })//end of fetch
          }//end of if statment


        else if (e.target.className =='btn-danger') {
          let nodeId = e.target.parentNode.parentNode.id
          // console.log(nodeId);
          fetch(`http://localhost:3000/quotes/${nodeId}`, {method: "DELETE"})
          return rerender()
        }
        })//end of addEventListener

        const quoteForm = document.querySelector('#new-quote-form')
        const newQuote = document.querySelector('#new-quote')
        const newAuthor = document.querySelector('#author')


        console.log(quoteForm);
        quoteForm.addEventListener('submit', (e) => {
          e.preventDefault()
          fetch(allQuotes, {
            method: "POST",
            headers:
            {
                'Content-Type': 'application/json',
            },
              body: JSON.stringify({
                  author: newAuthor.value,
                  quote: newQuote.value,
                  likes: 0
              })
          })//end of fetch
          .then(respond => respond.json())
          .then(quotes => {
          quoteList.innerHTML +=
              `<li class='quote-card' id='${quotes.id}'>
            <blockquote class="blockquote">
            <p class="mb-0">${quotes.quote}</p>
            <footer class="blockquote-footer">${quotes.author}</footer>
            <br>
            <button class='btn-success' id='like-${quotes.id}' >Likes: <span id=''>${quotes.likes}</span></button>
            <button class='btn-danger' id='delete-${quotes.id}' >Delete</button>
            </blockquote>
            </li>`
          })//end of  last then for for submititon
            quoteForm.reset()

        })//end of form addEventListener

    })//end of last then
  }//end of showing


  showing()


});//end of DOM load
