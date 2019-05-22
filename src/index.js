// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener("DOMContentLoaded", function(){
  const quoteList = document.querySelector("#quote-list");
  const newQuoteForm = document.querySelector("#new-quote-form");
  const newQuote = document.querySelector("#new-quote");
  const author = document.querySelector("#author");

  fetch('http://localhost:3000/quotes')
    .then(function(res){
      return res.json();
    })
    .then(function(quotes){
      console.log(quotes);

    // RENDERING ALL QUOTES
    quotes.forEach(function(quote){
      quoteList.innerHTML += `
        <li class='quote-card'>
          <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
            <button id=${quote.id} class='btn-danger'>Delete</button>
          </blockquote>
        </li>
      `
    }); // END OF QUOTES ITERATION
  }); // END OF GET QUOTES FETCH


  // ADD QUOTES
  newQuoteForm.addEventListener("submit", function(e){
    e.preventDefault();

    fetch('http://localhost:3000/quotes', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json'
      },
      body: JSON.stringify({
        "quote": newQuote.value,
        "likes": 0,
        "author": author.value
      })
    })
    .then(function(res){
      return res.json();
    })
    .then(function(quote){
      console.log(quote);

      quoteList.innerHTML += `
        <li class='quote-card'>
          <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
            <button id=${quote.id} class='btn-danger'>Delete</button>
          </blockquote>
        </li>
      `
    }); // END OF POSTING NEW QUOTE
    newQuoteForm.reset();
  }); // END OF ADD QUOTE


  // DELETE QUOTE
  quoteList.addEventListener("click", function(e){

    // OPTIMISTICALLY RENDERING
    let theQuote = e.target;
    let theQuoteId = e.target.id;
    let likeQuoteId = theQuote.nextElementSibling.id;
    let likeSpan = theQuote.firstElementChild;
    let likeNum = theQuote.firstElementChild.innerText;

    if (theQuote.className === 'btn-danger') {
      // OPTIMISTICALLY RENDER AND THEN UPDATE THE DATABASE
      theQuote.parentElement.parentElement.remove();
      fetch(`http://localhost:3000/quotes/${theQuoteId}`, {method: "DELETE"});

    } else if (theQuote.className === 'btn-success') {
      // UPDATE THE DOM FIRST THEN UPDATE THE DATABASE
      likeNum++;
      likeSpan.innerText = likeNum;
      fetch(`http://localhost:3000/quotes/${likeQuoteId}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json'
        },
        body: JSON.stringify({
          "likes": likeNum++
        })
      });
    } // END OF IF..ELSE STATEMENT

  }); // END OF DELETE QUOTE

}); // END OF DOM CONTENT LOADED
