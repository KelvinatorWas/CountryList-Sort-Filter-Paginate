import axios from 'axios';
import { appendChildern, createElement } from './utils/sum/helperFuncs';

// Types

type Currency = {
  code: string;
  name: string;
  symbol: string;
};

type Language = {
  code: string;
  name: string;
};

type CountryData = {
  name: string;
  code: string;
  capital: string;
  region: string;
  currency: Currency;
  language: Language;
  flag: string;
  dialling_code: string;
  isoCode: string;
};

const createTh = (title:string, img = ''): HTMLElement => {
  let th = createElement('th');
  if (img.length) {
    th = createElement('th', 'country-wrapper');
    const text = createElement('div');
    text.textContent = title;

    const flag = new Image();
    flag.src = img;
    appendChildern(th, flag, text);
  } else {
    th.textContent = title;
  }
  return th;
};

// Class Country List

class CountryList {
  private countryListWrapper: HTMLElement;
  private maxTableAmount: number;
  private page = 1;
  private dataSize = 0;

  constructor() {
    this.countryListWrapper = document.querySelector('.country-list-wrapper');
    this.maxTableAmount = 20;

    // call the init method
    this.init();
  }

  private async init() {
    this.initHeader();

    const data = await this.fetchData('');

    if (data) this.initTable(data);

    this.initPageing();
  }

  private initPageing() {
    const paginateWrapper = createElement('div', 'paginate-wrapper');
    const backButton = createElement('button', 'page-button') as HTMLButtonElement;
    const toButton = createElement('button', 'page-button') as HTMLButtonElement;

    backButton.textContent = '←';
    toButton.textContent = '→';

    appendChildern(paginateWrapper, backButton, toButton);
    this.countryListWrapper.appendChild(paginateWrapper);

    backButton.addEventListener('click', () => {
      this.page -= this.page ? 1 : 0;
      if (this.page) this.updateTable();
    });

    toButton.addEventListener('click', () => {
      if (this.dataSize >= 1) {
        this.page += 1;
        this.updateTable();
      }
    });
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

    this.searchListener(submitButton);
  }

  private initSearchButton():HTMLInputElement {
    const submitButton = createElement('input', 'search-button', 'js-search-main') as HTMLInputElement;
    submitButton.type = 'submit';
    submitButton.value = 'Search';
    return submitButton;
  }

  private async updateTable() {
    let rules = '';

    if (Number.isNaN(this.dataSize)) {
      this.page = 1;
    }

    const form = document.getElementById('inputSearch') as HTMLFormElement;

    if (form) {
      for (const input of form.elements) {
        const sortBy = input as HTMLInputElement;

        if (sortBy.id === 'name-search' && sortBy.value.length) {
          rules += `name_like=${sortBy.value}&_start=${sortBy.value}`;
        }
        if (sortBy.id === 'currency-name' && sortBy.value.length) {
          if (rules.length) rules += '&';
          rules += `currency.name_like=${sortBy.value}`;
        }
        if (sortBy.id === 'capital-name' && sortBy.value.length) {
          if (rules.length) rules += '&';
          rules += `capital_like=${sortBy.value}&_start=${sortBy.value}`;
        }
        if (sortBy.id === 'lang-name' && sortBy.value.length) {
          if (rules.length) rules += '&';
          rules += `language.name_like=${sortBy.value}&q=${sortBy.value}`;
        }
      }
    }

    this.maxTableAmount = 20;
    const data = await this.fetchData(rules);

    if (data) {
      if (data.length - 1 < this.maxTableAmount) {
        this.maxTableAmount = data.length;
      }
      this.initTable(data);
    }
  }

  private searchListener(searchButton:HTMLInputElement) {
    if (searchButton) {
      searchButton.addEventListener('click', async (event) => {
        this.page = 1;
        event.preventDefault();
        this.updateTable();
      });
    }
  }

  private initTable(data:CountryData[]) {
    const clRect = this.countryListWrapper.querySelector('.country-list__cl-rect');

    const tableHead = (table:HTMLElement) => {
      const thead = createElement('thead');
      const tr = createElement('tr');

      // header
      const countryName = createTh('Country Name');
      const capitalName = createTh('Capital Name');
      const currencyName = createTh('Currency Name');
      const languageName = createTh('Language Name');

      appendChildern(tr, countryName, capitalName, currencyName, languageName);
      thead.appendChild(tr);
      table.appendChild(thead);
    };

    const tableBody = (table:HTMLElement) => {
      const tbody = createElement('tbody');

      for (let i = 0; i < this.maxTableAmount; i += 1) {
        const trBody = createElement('tr');

        const cy = createTh(data[i].name, data[i].flag);
        const cl = createTh(data[i].capital);
        const cr = createTh(data[i].currency.name);
        const lang = createTh(data[i].language.name);

        appendChildern(trBody, cy, cl, cr, lang);

        tbody.appendChild(trBody);
      }

      table.appendChild(tbody);
    };

    if (clRect) {
      clRect.innerHTML = '';
      const table = createElement('table', 'table is-fullwidth');

      // Head of Table
      tableHead(table);

      // Body of Table
      tableBody(table);

      clRect.appendChild(table);
    }
  }

  private initGridInputs(grid:HTMLElement) {
    const makeInput = (labelText:string, js = '') => {
      const inputContainer = createElement('div', 'input-container');
      const label = createElement('label', 'input-container__label');
      const inputBox = createElement('input', 'input-container__input-box', undefined, js) as HTMLInputElement;

      label.textContent = labelText;
      appendChildern(inputContainer, label, inputBox);
      return inputContainer;
    };
    appendChildern(grid, makeInput('Nosaukums', 'name-search'), makeInput('Galvas pilsēta', 'capital-name'), makeInput('Valūta', 'currency-name'), makeInput('Valoda', 'lang-name'));
  }

  private async fetchData(info = ''):Promise<CountryData[]> {
    try {
      const test = info.length ? `${info}&` : '';
      const link = `http://localhost:3004/countries?${test}_page=${this.page}&_limit=${this.maxTableAmount}`;
      const data = await axios.get<CountryData[]>(link);
      this.dataSize = data.data.length / 20;
      return data.data;
    } catch (error) {
      console.log('Error while trying to fetch data:', error);
      return [];
    }
  }
}

// eslint-disable-next-line no-new
new CountryList();
