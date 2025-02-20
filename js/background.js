const images = [
    "0.jpg",
    "1.jpg",
    "2.jpg"
];

const chosenImage = images[Math.floor(Math.random() * images.length)];

const bgImage = document.createElement("img");

bgImage.src = `img/${chosenImage}`;

// document.body.appendChild(bgImage);

/////
const body = document.querySelector("body");


const UNSPLASH_URL = `https://api.unsplash.com/photos/random/?client_id=${SECRET.UNSPLASH_API_KEY}&query=landscape&orientation=landscape`;

function loadBackground() {
    const savedImage = localStorage.getItem("bg");
    if (savedImage === null) {
      getBackground();
    } else {
      const parsedImage = JSON.parse(savedImage);
      const today = new Date();
      if (today > parsedImage.expiresOn) {
        getBackground();
      } else {
        body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.4)), url(${
          parsedImage.url
        })`;
        // locationContainer.innerHTML = `${parsedImage.name}, ${
        //   parsedImage.city
        // }, ${parsedImage.country}`;
      }
    }
    return;
  }


function saveBackground(imageUrl, city, country, name) {
    const savedImage = localStorage.getItem("bg");
    if (savedImage !== null) {
      localStorage.removeItem("bg");
    }
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    const imageObject = {
      url: imageUrl,
      expiresOn: expirationDate,
      city,
      country,
      name
    };
    localStorage.setItem("bg", JSON.stringify(imageObject));
    loadBackground();
    return;
  }

  function getBackground() {
    fetch(UNSPLASH_URL)
      .then(response => response.json())
      .then(json => {
        const image = json;
        if (image.urls && image.urls.full && image.location) {
          const fullUrl = image.urls.full;
          const location = image.location;
          const city = location.city;
          const country = location.country;
          const name = location.name;
          saveBackground(fullUrl, city, country, name);
        } else {
          getBackground();
        }
      });
    return;
  }
  

  loadBackground();
  