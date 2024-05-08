import { string, setLocale } from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';

import render from './view.js';
import ru from './locales/ru.js';

const validate = (url, links) => {
  const schema = string().trim().required().url()
    .notOneOf(links);
  return schema.validate(url);
};

const getAxiosResponse = (url) => {
  const allOriginalLink = 'https://allorigins.hexlet.app/get';
  const preparedURL = new URL(allOriginalLink);
  preparedURL.searchParams.set('disableCache', 'true');
  preparedURL.searchParams.set('url', url);
  return axios.get(preparedURL);
};

const app = () => {
  const i18nextInstance = i18next.createInstance();

  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  }).then((translate) => {
    const elements = {
      form: document.querySelector('.rss-form'),
      feedback: document.querySelector('.feedback'),
      input: document.querySelector('#url-input'),
      btn: document.querySelector('button[type="submit"]'),
      posts: document.querySelector('.posts'),
      feeds: document.querySelector('.feeds'),
      modal: {
        modalElement: document.querySelector('.modal'),
        title: document.querySelector('.modal-title'),
        body: document.querySelector('.modal-body'),
        btn: document.querySelector('.full-article'),
      },
    };

    setLocale({
      mixed: { notOneOf: 'existsUrl' },
      string: { url: 'invalidUrl', required: 'mustNotBeEmpty' },
    });

    const initState = {
      process: {
        state: 'filling',
        error: null,
      },
      content: {
        feed: [],
        post: [],
      },
    };

    const watchedState = onChange(initState, render(initState, elements, translate));

    elements.form.addEventListener('input', () => {
      watchedState.process.state = 'filling';
      watchedState.process.error = null;
    });

    elements.form.focus();
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(elements.form);
      // console.log(data.get('url'));
      const url = data.get('url');
      // state.validUrl.links.push(url);
      const addedLinks = watchedState.content.feed;
      // validate(urßl, addedLinks);
      // console.log(validate(url, state.validUrl.links));
      validate(url, addedLinks)
        .then((link) => {
          watchedState.process.state = 'sending';
          return getAxiosResponse(link);
        })
        .then((response) => {
          watchedState.content.feed.push(response);
          watchedState.process.state = 'finished';
          console.log(initState.process.state);
        })
        .catch((error) => {
          const errorMessage = error.message ?? 'defaultError';
          watchedState.process.error = errorMessage;
          watchedState.process.state = 'error';
          console.log(initState.process.state);
        });
    });
  });
};

export default app;
