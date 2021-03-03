const BASE_URL = 'http://localhost:3000/'
const QUOTES_URL = BASE_URL+'quotes/'
const LIKES_URL = BASE_URL+'likes/'
const QUERY_URL = BASE_URL+'quotes?_embed=likes'

init()

function init() {
    fetchQuotes()
    document.getElementById('new-quote-form').addEventListener('submit', newQuote)
}

function fetchQuotes() {
    fetch(QUERY_URL)
        .then(res => res.json())
        .then(quotesData => {
            quotesData.forEach(quote => {
                renderQuote(quote)
            })
        })
}

function renderQuote(quote){
    const quotesList = document.getElementById('quote-list')

    const newCard = document.createElement('li')
        newCard.classList.add('quote-card')
    
    const newBlockquote = document.createElement('blockquote')
        newBlockquote.classList.add('blockquote')
    
    const quoteContent = document.createElement('p')
        quoteContent.classList.add('mb-0')
        quoteContent.innerText = quote.quote
    
    const quoteAuthor = document.createElement('footer')
        quoteAuthor.classList.add('blockquote-footer')
        quoteAuthor.innerText = quote.author
    
    const newBreak = document.createElement('br')

    const likeBtn = document.createElement('button')
        likeBtn.classList.add('btn-success')
        // debugger
        let quoteLikes = 0
        if(quote.likes){
            quoteLikes = quote.likes.length
        }
        likeBtn.innerHTML = `Likes: <span>${quoteLikes}</span>`
        likeBtn.addEventListener('click', (e) => {
            // console.log(quote.likes.length)
            // console.log(e.target.children[0].innerText)
            // alert("This was a like button")
            likeQuote(e, quote)
        })
    
    const deleteBtn = document.createElement('button')
        deleteBtn.classList.add('btn-danger')
        deleteBtn.innerText = "Delete"
        deleteBtn.addEventListener('click', () => {
            deleteQuote(quote, newCard)
        })
    
    newBlockquote.append(quoteContent, quoteAuthor, newBreak, likeBtn, deleteBtn)

    newCard.appendChild(newBlockquote)

    quotesList.appendChild(newCard)

}

function newQuote(event){
    event.preventDefault()
    // console.log(event.target)

    const newQuote = {
        quote: event.target.quote.value,
        author: event.target.author.value
    }
    
    // console.log(newQuote)

    const reqObject = {
        headers: {"Content-Type": 'application/json'},
        method: "POST",
        body: JSON.stringify(newQuote)
    }

    // console.log(reqObject)

    if(newQuote.quote !== "" && newQuote.author !== "") {
        fetch(QUOTES_URL, reqObject)
            .then(res => res.json())
            .then(res => {
                renderQuote(res)
            })
    } else {
        alert('Both a quote and author are needed to submit.')
    }
}

function likeQuote(e, quote) {
    let likesText = e.target.children[0]
    // likesText.innerText = parseInt(likesText.innerText) + 1
    // console.log(quote.likes)
    const newLike = {
        quoteId: quote.id,
        createdAt: Math.floor(Date.now() / 1000)
    }
    
    const reqObj = {
        headers: {"Content-Type": "application/json"},
        method: "POST",
        body: JSON.stringify(newLike)
    }

    fetch(LIKES_URL, reqObj)
        .then(res => res.json())
        .then(res => {
            likesText.innerText = parseInt(likesText.innerText) + 1
        })
}

function deleteQuote(quote, card){
    fetch(QUOTES_URL+quote.id, {method: "DELETE"})
        .then(res => res.json())
        .then(res => {
            card.remove()
        })
}