import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const refs = {
  inputEl: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
};

const notifyOptions = {
  width: '450px',
  position: 'right-top',
  distance: '20px',
  timeout: 1500,
  clickToClose: true,
  fontSize: '20px',
  cssAnimationStyle: 'zoom',
};

Notify.init(notifyOptions);

refs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  const inputValue = evt.target.value.trim();
  refs.listEl.innerHTML = '';
  if (inputValue === '') {
    return;
  }
  fetchCountries(inputValue)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        refs.listEl.innerHTML = createMarkupForCountries(countries);
      } else {
        refs.listEl.innerHTML = createMarkupForOneCountry(countries);
      }
    })
    .catch(err => Notify.failure(`${err}`));
}

function createMarkupForCountries(arr) {
  return arr
    .map(
      el =>
        `<li class="country-item">
        <div class="country-container">
        <img src="${el.flags.svg}" alt="The ${el.name.common} flag" width="50" height="30"><span class="country-maintext">${el.name.common}</span>
        </div>
        </li>`
    )
    .join('');
}

function createMarkupForOneCountry(arr) {
  return arr
    .map(
      el =>
        `<li class="country-item">
        <div class="country-container">
        <img src="${el.flags.svg}" alt="The ${
          el.name.common
        } flag" width="50" height="30">
        <h2 class="country-header">${el.name.common}</h2>
        </div>
          <ul class="country-list">
          <li class="country-item"><p class="country-text"><span class="country-maintext">Capital: </span>${el.capital.join(
            ', '
          )}</p></li>
          <li class="country-item"><p class="country-text"><span class="country-maintext">Population: </span>${
            el.population
          }</p></li>
          <li class="country-item"><p class="country-text"><span class="country-maintext">Languages: </span>${Object.values(
            el.languages
          ).join(', ')}</p></li>
          </ul>
        </li>`
    )
    .join('');
}
