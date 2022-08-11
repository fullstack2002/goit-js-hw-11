import Notiflix from 'notiflix';
import { fetchImagesNew, PER_PAGE } from './fetchimages';
const galleryNode = document.querySelector('.gallery');

/* ===== ===== ===== ===== ===== */

const refs = {
  form: document.querySelector('#search-form'),
  button: document.querySelector('.load-more'),
};

let page = 1;
let totalPages = 0;

refs.form.addEventListener('submit', e => {
  e.preventDefault();

  if (e.currentTarget.searchQuery.value.trim() == '') return;

  galleryNode.innerHTML = '';
  refs.button.style.display = 'none';

  fetchImagesNew(e.target.searchQuery.value.trim())
    .then(data => {
      if (data.hits.length == 0) {
        Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`,
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        page = 1;
        totalPages = Math.ceil(data.totalHits / PER_PAGE);

        updateGallery(data.hits, galleryNode);

        if (totalPages !== 1) {
          refs.button.style.display = 'block';
        }
      }
    })
    .catch(error => Notiflix.Notify.failure(error));
});

refs.button.addEventListener('click', loadMore);

function loadMore() {
  page += 1;
  fetchImagesNew(refs.form.searchQuery.value.trim(), page)
    .then(data => {
      if (page === totalPages) {
        refs.button.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
      updateGallery(data.hits, galleryNode);
    })
    .catch(error => Notiflix.Notify.failure(error));
}


refs.button.addEventListener('click', loadMore);

function loadMore() {
  page += 1;
  fetchImagesNew(refs.form.searchQuery.value.trim(), page)
    .then(data => {
      if (page === totalPages) {
        refs.button.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
      updateGallery(data.hits, galleryNode);
    })
    .catch(error => Notiflix.Notify.failure(error));
}
