const render = (state, elements) => () => {
  elements.input.focus();
  const { valid } = state.validUrl;
  switch (valid) {
    case true:
      elements.input.classList.remove('is-invalid');
      elements.input.focus();
      elements.form.reset();
      break;
    case false:
      elements.input.classList.add('is-invalid');
      break;
    default:
      break;
  }
};

export default render;
