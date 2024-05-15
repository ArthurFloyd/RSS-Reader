/* eslint no-param-reassign: ["error", { "props": true,
"ignorePropertyModificationsFor": ["state", "elements", "watchedState"] }] */
import './styles.scss';
import 'bootstrap';
import { string, setLocale } from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import { uniqueId } from 'lodash';

import render from './view.js';
import ru from './locales/ru.js';
import parser from './parser.js';
// Валидатор
const validate = (url, links) => {
  const schema = string().trim().required().url()
    .notOneOf(links);
  return schema.validate(url);
};
// Запрос
const getAxiosResponse = (url) => {
  const allOriginalLink = 'https://allorigins.hexlet.app/get';
  const preparedURL = new URL(allOriginalLink);
  preparedURL.searchParams.set('disableCache', 'true');
  preparedURL.searchParams.set('url', url);
  return axios.get(preparedURL);
};

const addPost = (feedId, posts, state) => {
  const normalizedPosts = posts.map((post) => ({ ...post, feedId, id: uniqueId() }));
  state.content.posts = [...state.content.posts, ...normalizedPosts];
};

const timeout = 5000;

const searchNewPost = (state) => {
  const promises = state.content.feeds
    .map(({ link, id }) => getAxiosResponse(link)
      .then((response) => {
        const { posts } = parser(response.data.contents);
        const addedLinks = state.content.posts.map((post) => post.link);
        const newPosts = posts.filter((post) => !addedLinks.includes(post.link));
        if (newPosts.length > 0) {
          addPost(id, newPosts, state);
        }
      }));
  Promise.allSettled(promises)
    .finally(() => {
      setTimeout(() => searchNewPost(state), timeout);
    });
};
// Приложение
const app = () => {
  const i18nextInstance = i18next.createInstance();
  // Инициализация
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  }).then((translate) => {
    // Элементы
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
    // Состояние
    const initState = {
      process: {
        state: 'filling',
        error: null,
      },
      content: {
        feeds: [],
        posts: [],
      },
      uiState: {
        visitedLinksIds: new Set(),
        modalPostId: null,
      },
    };

    const watchedState = onChange(initState, render(initState, elements, translate));

    searchNewPost(watchedState);

    elements.form.addEventListener('input', () => {
      watchedState.process.state = 'filling';
      watchedState.process.error = null;
    });

    elements.form.focus();
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(elements.form);
      const url = data.get('url');
      const addedLinks = watchedState.content.feeds.map(({ link }) => link);

      validate(url, addedLinks)
        .then((link) => {
          watchedState.process.state = 'sending';
          return getAxiosResponse(link);
        })
        .then((response) => {
          const { feed, posts } = parser(response.data.contents);
          const feedId = uniqueId;

          watchedState.content.feeds.push({ ...feed, feedId, link: url });
          addPost(feedId, posts, watchedState);
          watchedState.process.state = 'finished';
        })
        .catch((error) => {
          const errorMessage = error.message ?? 'defaultError';
          watchedState.process.error = errorMessage;
          watchedState.process.state = 'error';
        });
    });

    elements.modal.modalElement.addEventListener('show.bs.modal', (e) => {
      const postId = e.relatedTarget.getAttribute('data-id');
      watchedState.uiState.visitedLinksIds.add(postId);
      watchedState.uiState.modalPostId = postId;
    });

    elements.posts.addEventListener('click', (e) => {
      const postId = e.target.dataset.id;
      if (postId) {
        watchedState.uiState.visitedLinksIds.add(postId);
      }
    });
  });
};

export default app;
