// Обработчик ошибок
const errorHandler = (elements, error) => {
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.add('text-danger');
  // elements.feedback.textContent = translate(`errors.${error.replace(/ /g, '')}`);
  if (error !== 'Network Error') elements.input.classList.add('is-invalid');
  // elements.btn.disabled = false;
  // elements.input.disabled = false;
};

// Рендер
const render = (state, elements) => (path) => {
  const renderMapping = {
    filling: () => {
      elements.feedback.classList.remove('text-danger');
      elements.input.classList.remove('is-invalid');
      // elements.feedback.textContent = '';
    },
    // sending: () => {
    //   elements.btn.disabled = true;
    //   elements.input.disabled = true;
    // },
    error: () => errorHandler(elements, state.process.error),
    // finished: () => finishHandler(elements, state, translate),
  };

  switch (path) {
    case 'process.state':
      renderMapping[state.process.state]();
      break;
    default:
      break;
  }
};

export default render;
