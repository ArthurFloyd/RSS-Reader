/* eslint no-param-reassign: ["error", { "props": true,
"ignorePropertyModificationsFor": ["state", "elements"] }] */
const renderPosts = (state, element, translate) => {
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  state.content.posts.forEach((post) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.classList.add(state.uiState.visitedLinksIds.has(post.id) ? ('fw-normal', 'link-secondary') : 'fw-bold');
    a.href = post.link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('data-id', post.id);
    a.textContent = post.title;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.type = 'button';
    button.setAttribute('data-id', post.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = translate('preview');

    listGroupItem.append(a, button);
    listGroup.append(listGroupItem);
  });
  element.append(listGroup);
};

const renderFeeds = (state, element) => {
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  state.content.feeds.forEach((feed) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;

    listGroupItem.append(h3, p);
    listGroup.append(listGroupItem);
  });
  element.append(listGroup);
};

const makeContainer = (title, state, elements, translate) => {
  const containerMapping = {
    posts: (element) => renderPosts(state, element, translate),
    feeds: (element) => renderFeeds(state, element),
  };
  elements[title].innerHTML = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = translate(title);

  cardBody.append(cardTitle);
  card.append(cardBody);
  elements[title].append(card);
  containerMapping[title](card);
};

const errorHandler = (elements, error, translate) => {
  elements.input.classList.add('is-invalid');
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.add('text-danger');
  elements.feedback.textContent = translate(`errors.${error.replace(/ /g, '')}`);
  elements.btn.disabled = false;
  elements.input.disabled = false;
};

const finisheHandler = (elements, state, translate) => {
  makeContainer('posts', state, elements, translate);
  makeContainer('feeds', state, elements, translate);

  elements.input.focus();
  elements.form.reset();
  elements.btn.disabled = false;
  elements.input.disabled = false;

  elements.input.classList.remove('is-invalid');
  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.add('text-success');
  elements.feedback.textContent = translate('success');
};

const renderModalWindow = (elements, state, postId) => {
  const post = state.content.posts
    .find(({ id }) => id === postId);
  const { title, description, link } = post;
  elements.modal.title.textContent = title;
  elements.modal.body.textContent = description;
  elements.modal.btn.href = link;
};

const render = (state, elements, translate) => (path, value) => {
  const renderMapping = {
    filling: () => {
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.textContent = '';
    },
    sending: () => {
      elements.btn.disabled = false;
      elements.input.disabled = false;
    },
    finished: () => finisheHandler(elements, state, translate),
    error: () => errorHandler(elements, state.process.error, translate),
  };
  switch (path) {
    case 'process.state':
      renderMapping[state.process.state]();
      break;
    case 'uiState.visitedLinksIds':
    case 'content.post':
      makeContainer('posts', state, elements, translate);
      break;
    case 'uiState.modalPostId':
      renderModalWindow(elements, state, value);
      break;
    default:
      break;
  }
};

export default render;
