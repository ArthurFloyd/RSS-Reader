import { string } from 'yup';
import onChange from 'on-change';

import render from './view.js';

const validate = (url, links) => {
  const schema = string().trim().required().url()
    .notOneOf(links);
  return schema.validate(url);
};

const app = () => {
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

  const state = {
    validUrl: {
      links: [],
      valid: true,
      error: null,
    },
  };

  const watchedState = onChange(state, render(state, elements));

  // elements.form.addEventListener('click', () => {
  //   state = 'filling';
  //   state = null;
  // });

  elements.form.focus();
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(elements.form);
    // console.log(data.get('url'));
    const url = data.get('url');
    // state.validUrl.links.push(url);
    const addedLinks = watchedState.validUrl.links;
    // validate(url, addedLinks);
    // console.log(validate(url, state.validUrl.links));
    validate(url, addedLinks)
      .then((link) => {
        watchedState.validUrl.links.push(link);
        watchedState.validUrl.valid = true;
        console.log(state.validUrl.valid);
      })
      .catch((error) => {
        const errorMessage = error.message ?? 'defaultError';
        watchedState.validUrl.error = errorMessage;
        watchedState.validUrl.valid = false;
        console.log(state.validUrl.valid);
      });
  });
};

export default app;
