export default (data) => {
  const domParser = new DOMParser();
  const parserData = domParser.parseFromString(data, 'application/xml');

  const errorNode = parserData.querySelector('parsererror');
  if (errorNode) throw new Error('parserErorr');

  const channel = parserData.querySelector('channel');
  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;
  const feed = { title, description };

  const items = Array.from(parserData.querySelector('item'));

  const posts = items.map((item) => {
    const postsLink = item.querySelector('link').textContent;
    const postsTitle = item.querySelector('title').textContent;
    const postsDescription = item.querySelector('description').textContent;
    return {
      link: postsLink,
      title: postsTitle,
      description: postsDescription,
    };
  });

  return { feed, posts };
};
