const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const singleImageDiv = document.getElementById('fullImageShow');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  if (images.length > 0) {
    errorMessage('');
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    singleImageDiv.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = `
      <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}"  alt="${image.tags}">
      <button class="btn btn-outline-info btn-sm btn-block" onclick=fullImage("${image.largeImageURL}","${image.user}")>Show Full Image</button>
      `;
      gallery.appendChild(div);
    })
  } else {
    errorMessage('Sorry...!! Image not found...!!');
    imagesArea.style.display = 'none';
    singleImageDiv.innerHTML = '';
  }
  toggleSpinner(false);
}

const getImages = (query) => {
  toggleSpinner(true);
  const url = `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`;
  fetch(url)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => errorMessage('Something wrong...!! Please try again later...!!') || toggleSpinner(false))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  event.preventDefault();
  let item = sliders.indexOf(img);
  let element = event.target;
  element.classList.toggle('added');
  if (item === -1) {
    sliders.push(img);
  } else {
    if (item > -1) {
      sliders.splice(item, 1)
    }
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria

  const duration = document.getElementById('duration').value || 1000;
  if (duration <= 999) {
    imagesArea.style.display = 'block';
    errorMessage('Please enter valid duration.');
    document.querySelector('.main').style.display = 'none';
  } else {
    sliders.forEach(slide => {
      errorMessage('');
      imagesArea.style.display = 'none';
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }

}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

//added back button, under the slider
document.getElementById('backBtn').addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  let searchArea = document.getElementById("search");
  imagesArea.style.display = 'block';
})

//show full image
const fullImage = (image, user) => {
  toggleSpinner(true);
  imagesArea.style.display = 'none';
  let div = document.createElement('div');
  div.className = 'col-lg-10 col-md-10 col-xs-10 mb-2';
  div.innerHTML = `
      <h6 class="text-center text-capitalize"> User : ${user}</h6>
      <img class="img-fluid" src="${image}"  alt="">
      <div class="d-flex justify-content-center mt-3">
        <button class="btn btn-info mb-3" onclick="backButton()">Back</button>
      </div>
      `;
  singleImageDiv.appendChild(div);
  toggleSpinner(false);
}

//added back button, under the full image
const backButton = () => {
  let searchArea = document.getElementById("search");
  singleImageDiv.innerHTML = '';
  imagesArea.style.display = 'block';
  searchArea.style.display = 'block';
  searchBtn.style.display = 'block';
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

//Trigger a button click with JavaScript on the Enter key
document.getElementById("search").addEventListener("keypress", function (event) {
  if (event.key == 'Enter') {
    document.getElementById("search-btn").click();
  }
});

sliderBtn.addEventListener('click', function () {
  createSlider();
});

const errorMessage = (error) => {
  const errorText = document.getElementById('errorText');
  errorText.innerText = error;
}

//added loading spinner
const toggleSpinner = (show) => {
  const spinner = document.getElementById('loadingSpinner');
  if (show) {
    spinner.classList.remove('d-none');
  } else {
    spinner.classList.add('d-none');
  }

}