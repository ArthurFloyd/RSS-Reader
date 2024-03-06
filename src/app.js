import * as yup from 'yup';

// Валидатор
const validate = (url, links) => {
  const schema = yup.string().trim().required().url()
    .notOneOf(links);
  return schema.validate(url);
};
