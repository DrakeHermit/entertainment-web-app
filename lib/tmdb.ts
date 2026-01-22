export const getTrending = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`
    }
  };
  const response = await fetch(`https://api.themoviedb.org/3/movie/popular`, options);
  const data = await response.json();
  return data.results;
};