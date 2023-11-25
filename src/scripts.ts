import axios from 'axios';
import { appendChildern, createElement } from './utils/sum/helperFuncs';

type CountryData = {
  name: string;
  code: string;
  capital: string;
  region: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  language: {
    code: string;
    name: string;
  };
  flag: string;
  dialling_code: string;
  isoCode: string;
};

class CountryList {
  private countryListWrapper: HTMLElement | null;
  private maxTableAmount: number;

  constructor() {
    this.countryListWrapper = document.querySelector('.country-list-wrapper');
    this.maxTableAmount = 20;

    // call the init method
    this.init();
  }

  private init() {
    this.initHeader();
  }

  private initHeader() {
    const clTitle = createElement('p', 'country-list__title-header');
    const inputGrid = createElement('div', 'country-list__input-grid');
    const form = createElement('form', 'form-input', undefined, 'inputSearch') as HTMLFormElement;
    const submitButton = this.initSearchButton();

    clTitle.textContent = 'Country List';
    const countryListRect = createElement(undefined, 'country-list__cl-rect');

    this.initGridInputs(inputGrid);

    appendChildern(form, inputGrid, submitButton);
    appendChildern(this.countryListWrapper, clTitle, form, countryListRect);
  }

  private initSearchButton():HTMLInputElement {
    const submitButton = createElement('input', 'search-button') as HTMLInputElement;
    submitButton.type = 'submit';
    submitButton.value = 'Search';

    submitButton.addEventListener('click', (event) => {
      event.preventDefault();
    });

    return submitButton;
  }

  private initGridInputs(grid:HTMLElement) {
    const makeInput = (labelText:string) => {
      const inputContainer = createElement('div', 'input-container');
      const label = createElement('label', 'input-container__label');
      const inputBox = createElement('input', 'input-container__input-box') as HTMLInputElement;

      label.textContent = labelText;
      appendChildern(inputContainer, label, inputBox);
      return inputContainer;
    };
    appendChildern(grid, makeInput('Nosaukums'), makeInput('Galvas pilsēta'), makeInput('Valūta'), makeInput('Valoda'));
  }

  private async fetchData() {
    try {
      const data = await axios.get('http://localhost:3004/countries');
      return data;
    } catch (error) {
      console.log('Error while trying to fetch data:', error);
    }
  }
}

// eslint-disable-next-line no-new
new CountryList();
