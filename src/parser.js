export default (data) => {
  const domParser = new DOMParser();
  const parserData = domParser.parseFromString(data, 'application/xml');

  const errorNode = parserData.querySelector('parsererror');
  if (errorNode) throw new Error('parseErorr');

  const channel = parserData.querySelector('channel');
  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;
  const feed = { title, description };

  const items = Array.from(parserData.querySelectorAll('item'));

  const posts = items.map((item) => {
    const postLink = item.querySelector('link').textContent;
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    return {
      link: postLink,
      title: postTitle,
      description: postDescription,
    };
  });
  console.log('??', feed, posts);
  return { feed, posts };
};
