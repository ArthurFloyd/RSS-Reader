import { setLocale, string } from 'yup';
import onChange from 'on-change';
import i18n from 'i18next';

import render from './view';
import ru from './locales/ru.js';

// Валидатор
const validate = (url, links) => {
  const schema = yup.string().trim().required().url()
    .notOneOf(links);
  return schema.validate(url);
};

// Приложение
const app = () => {
  const i18nextInstance = i18n.createInstance();
  // Инициализация
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources: { ru },
  });
  // Элементы
  const element = {
    form: document.querySelector('.rss-form'),
    dtn: document.querySelector('button[type="submit"]'),
  };

  setLocale({
    mixed: { notOneOf: 'alreadyAddedRSS' },
    string: { url: 'invalidUrl', requared: 'mustNotBeEmpty' },
  });

  // Состояние
  const state = {
    isValidForm: {
      valide: null,
      error: [],
    },
    content: {
      feeds: [],
      posts: [],
    },
  };
  const watchedState = onChange(state, render(state, element));

  element.form.focus();
  element.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(element.form);
    const url = formData.get('url');
    const addedLinks = watchedState.content.feeds.map(({ link }) => link);
  });
};

export default app;
