export const updateCache = (cache, query, bookAdded) => {
  const uniqueById = (books) => {
    let seen = new Set();

    return books.filter((book) => {
      let id = book.id
      return seen.has(id) ? false : seen.add(id);
    });
  };

  cache.updateQuery(
    query,
    ({ allBooks }) => {
      console.log(uniqueById(allBooks.concat(bookAdded)));
      return {
        allBooks: uniqueById(allBooks.concat(bookAdded)),
      }
  });
};
