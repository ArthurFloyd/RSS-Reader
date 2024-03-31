import { string } from 'yup';
import onChange from 'on-change';
// import i18n from 'i18next';
// import axios from 'axios';
// import { uniqueId } from 'lodash';

import render from './view.js';
// import ru from './locales/ru.js';

// Валидатор
const validate = (url, links) => {
  const schema = string().trim().required().url()
    .notOneOf(links);
  return schema.validate(url);
};

// Приложение
const app = () => {
  // const i18nInstance = i18n.createInstance();
  // i18nInstance
  //   .init({
  //     lng: 'ru',
  //     debug: false,
  //     resources: { ru },
  //   });

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

  // Состояние
  const state = {
    process: {
      state: 'filling',
      error: null,
    },
    content: {
      feeds: [],
      posts: [],
    },
    form: {
      valid: true,
      errors: {},
      url: '',
    },
    // uiState: {
    //   visitedLinksIds: new Set(),
    //   modalPostId: null,
    // },
  };

  const watchedState = onChange(state, render(state, elements));

  // fetchNewPosts(watchedState);

  // const { form } = elements;

  elements.form.addEventListener('input', () => {
    // const { value } = e.target;
    // watchedState.content.feeds = value;
    // const errors = validate(watchedState.content.feeds);
    // watchedState.form.errors = errors;
    // watchedState.form.valid = isEmpty(errors);
    watchedState.process.error = null;
    watchedState.process.state = 'filling';
  });

  // form.focus();
  // form.reset();
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const addedLinks = watchedState.content.feeds.map(({ link }) => link);

    validate(url, addedLinks)
      .then((validUrl) => {
        if (addedLinks.includes(validUrl)) {
          throw new Error('URL already exists in feeds');
        }

        watchedState.content.feeds.push({ link: validUrl });

        watchedState.process.state = 'sending';
        // return link;
        // })
        // .then((response) => {
        //   const feed = response;
        //   const feedId = uniqueId();

        // watchedState.content.feeds.push({ ...feed, feedId, link: url });
      //   addPosts(feedId, posts, watchedState);
      //   watchedState.process.state = 'finished';
      })
      .catch((error) => {
        const errorMessage = error.message ?? 'defaultError';
        watchedState.process.error = errorMessage;
        watchedState.process.state = 'error';
      });
  });
};

export default app;
