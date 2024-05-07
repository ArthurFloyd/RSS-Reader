/* eslint no-param-reassign: ["error", { "props": true,
"ignorePropertyModificationsFor": ["state", "elements"] }] */
const render = (state, elements, translate) => () => {
  elements.input.focus();
  switch (state.process.state) {
    case 'filling':
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.textContent = '';
      break;
    case 'sending':
      break;
    case 'finished':
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = translate('loaded');
      elements.input.focus();
      elements.form.reset();
      break;
    case 'error':
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      elements.feedback.textContent = translate(`errors.${state.process.error.replace(/ /g, '')}`);
      console.log('!!!', state.process.error);
      break;
    default:
      break;
  }
};

export default render;
