import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const KEY = '29208432-6a5cd8309506d586e27a98af9';
const BASE_URL = 'https://pixabay.com/api';
let page = 0;
let totalInfo = 0;

const onSubmitClick = async e => {
  e.preventDefault();
  refs.loadMoreBtn.style.display = 'none';
  refs.gallery.innerHTML = '';
  page = 1;
  totalInfo = 40;

  const data = await fetchItems(refs.input.value);
  if (data) {
    await renderGallery(data);

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    const lightbox = new SimpleLightbox('.gallery a');
  }
};

const fetchItems = async query => {
  const searchQuery = query.trim();
  try {
    if (searchQuery) {
      const responce = await axios.get(
        `${BASE_URL}/?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
      );

      if (responce.data.total === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      if (responce.data.totalHits <= totalInfo) {
        refs.loadMoreBtn.style.display = 'none';
      } else {
        refs.loadMoreBtn.style.display = 'block';
      }

      return responce.data;
    } else {
      Notiflix.Notify.failure('Enter your search query.');
    }
  } catch (error) {
    console.log(error);
  }
};

const renderGallery = async data => {
  try {
    const gallery = data?.hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) =>
          `<a href="${largeImageURL}" class="link">
      <div class="photo-card">
  <img src="${webformatURL}" width="320" heigth="210" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes <br> <span class="info-number">${likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views <br> <span class="info-number">${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments <br> <span class="info-number">${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads <br> <span class="info-number">${downloads}</span></b>
    </p>
  </div>
</div>
</a>`
      )
      .join('');
    refs.gallery.insertAdjacentHTML('beforeend', gallery);
  } catch (error) {
    console.log(error);
  }
};

const onLoadMoreClick = async () => {
  page += 1;
  const data = await fetchItems(refs.input.value);
  await renderGallery(data);
  totalInfo += 40;

  if (data.totalHits <= totalInfo) {
    refs.loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }
};

refs.form.addEventListener('submit', onSubmitClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);