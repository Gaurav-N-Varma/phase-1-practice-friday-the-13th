// setting movieID

let movieID = 1

fetch('http://localhost:3000/movies')
.then(data => data.json())
// renders movie images
.then(data2 => {
    // loops through each movie object
    data2.forEach(element => {
        // creates img tag
        const img = document.createElement('img')
        // sets src attribute
        img.src = element.image
        // sets id
        img.id = element.id
        // appends new img tag to movie-list nav element
        const movieNav = document.querySelector('#movie-list')
        movieNav.append(img)

        // adds click interactivity for each img tag added
        img.addEventListener('click', () => {
            // renders movie image
            const movImg = document.querySelector('#detail-image')
            movImg.src = element.image

            // renders movie title
            const movTitle = document.querySelector('#title')
            movTitle.textContent = element.title

            // renders movie year released
            const movYear = document.querySelector('#year-released')
            movYear.textContent = element.release_year


            // renders movie description
            const movDescrip = document.querySelector('#description')
            movDescrip.textContent = element.description

            // updates movieID to indicate which movie we are 'in'
            movieID = element.id

            // renders movie watch button label ...
            // ... is handled by a separate function which fetches latest API
            handleButton()

            // renders movie blood amount ...
            // ... is handled by a separate function which fetches latest API
            handleBlood()
        })
    });
    return data2
})
// renders details of the first movie
.then(data3 => {
    // rendering the first movie image
    const firstMovImg = document.querySelector('#detail-image')
    firstMovImg.src = data3[0].image

    // rendering the first movie title
    const firstMovTitle = document.querySelector('#title')
    firstMovTitle.textContent = data3[0].title

    // rendering the first movie year released
    const firstMovYear = document.querySelector('#year-released')
    firstMovYear.textContent = data3[0].release_year

    // rendering the first movie description
    const firstMovDescrip = document.querySelector('#description')
    firstMovDescrip.textContent = data3[0].description

    // rendering the first movie watch button label
    const firstMovWatch = document.querySelector('#watched')
    data3[0].watched ? firstMovWatch.textContent = 'Watched' : firstMovWatch.textContent = 'Unwatched'

    // rendering the first movie blood amount
    const firstMovBloodDrops = document.querySelector('#amount')
    firstMovBloodDrops.textContent = data3[0].blood_amount

    return data3
})
.catch(err => console.log(err))

// adds click interactivity for the watched button
const watchBtn = document.querySelector('#watched')
watchBtn.addEventListener('click', (e) => {
    // flips the watched button label based on watched property of API ...
    // ... and updates API based on new watched label

    // creating variable which will be used to update API
    store = ''
    e.target.textContent === 'Watched' ? store = false : store = true

    // when you hit watched button, update the API
    fetch(`http://localhost:3000/movies/${movieID}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        body: JSON.stringify({
            watched: store
        })
    })
    // API sends back updated object with latest watched value
    .then(data => data.json())
    // updates the watch button based on latest watched property
    .then(data2 => {
        data2.watched ? e.target.textContent = 'Watched' : e.target.textContent = 'Unwatched'
    })
})

// fetches latest watched data so button updates correctly
function handleButton(){
    fetch(`http://localhost:3000/movies/${movieID}`)
    .then(data => data.json())
    .then(data2 => {
        const movWatch = document.querySelector('#watched')
        data2.watched ? movWatch.textContent = 'Watched' : movWatch.textContent = 'Unwatched'
    })
}

// when 'add blood' is hit, updates API with the blood input
const form = document.querySelector('#blood-form')
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const bloodText = document.querySelector('#blood-amount')
    let inputedBlood = bloodText.value

    let bloodStore = parseInt(inputedBlood)

    // updates API with the blood input ...
    // ... first adds in API blood amount with inputed blood amount
    fetch(`http://localhost:3000/movies/${movieID}`)
    .then(data => data.json())
    .then(data2 => {
        bloodStore += parseInt(data2.blood_amount)
    })
    // finally updates API with final blood amount
    .then(() => {
        fetch(`http://localhost:3000/movies/${movieID}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            blood_amount: bloodStore,
          })
        })
        .then(dataParam => dataParam.json())
        .then(dataParam2 => {
            // renders in the latest API blood amount
            const bloodDrops = document.querySelector('#amount')
            bloodDrops.textContent = dataParam2.blood_amount
        })
    })
    // clears out text box
    form.reset()
})

function handleBlood(){
    const movBloodDrops = document.querySelector('#amount')
    fetch(`http://localhost:3000/movies/${movieID}`)
    .then(data => data.json())
    .then(data2 => {
        movBloodDrops.textContent = data2.blood_amount
    })
}