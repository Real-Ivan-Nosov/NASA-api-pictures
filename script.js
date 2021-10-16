const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

//  NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

const showContent = (page) => {
    window.scrollTo({ top: 0, behavior: 'instant'});
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}


const createDOMNotes = (page) => {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);

    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View full image';
        link.target = '_blank';
        // image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Save text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add to Favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            saveText.textContent = 'Remove Favorites';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // Footer container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date 
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright ===
            undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = `${copyrightResult}`;

        // Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, cardText, saveText, footer);
        link.append(image);
        card.append(link, cardBody);
        imagesContainer.append(card);
    });
}

const updateDOM = (page) => {
    // Get favorites from localStorage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = '';
    createDOMNotes(page);
    showContent(page);
}

// Get 10 images from NASA api
async function getNasaPictures() {
    // Show loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apUrl);
        resultsArray = await response.json();
        updateDOM('results');
    } catch (err) {
        console.log(err)
    }
}

// Add result to favorites
const saveFavorite = (itemUrl) => {
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            saveConfirmed.classList.toggle('hidden');
            setTimeout(() => {
                saveConfirmed.classList.toggle('hidden');
            }, 2000);
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}

const removeFavorite = (itemUrl) => {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites'); 
    }
}

// On load
getNasaPictures();