// import apiStrConstants from '@/constants/apiConstants/apiStrConstants';
import axios from 'axios';
import apiStrConstants from '../../constants/apiConstants/apiStrConstants';

//fallback if api does not fetchh from @env file if process.env.API_KEY is undefined
const API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZWIyY2QwYTI4YjZkMDRkZTI4MGNkYjA1MzkyMmNiMyIsIm5iZiI6MTc2MzA1ODE0NS42NDYwMDAxLCJzdWIiOiI2OTE2MjFlMTk2NWIzNWJiMjM5YWQ3NDMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.1Ls2HAi9hZYBVaZtZXghsAaEkg0fl59yGKyCbOQFTM8';

export async function fetchAllMovies(page: number) {
  const headers = {
    Accept: 'application/json',
    Authorization: API_KEY,
  };

  const params = new URLSearchParams({ page: page.toString() });

  const urls = {
    movies: `${apiStrConstants.BASE_MOVIE_URL}?${params.toString()}`,
    trending: `${apiStrConstants.TRENDING_MOVIE_URL}?${params.toString()}`,
    popular: `${apiStrConstants.POPULAR_MOVIE_URL}?${params.toString()}`,
  };

  try {
    const [moviesResponse, trendingResponse, popularResponse] = await Promise.allSettled([
      axios.get(urls.movies, { headers }),
      axios.get(urls.trending, { headers }),
      axios.get(urls.popular, { headers }),
    ]);

    return {
      movies: moviesResponse.status === 'fulfilled' ? moviesResponse.value : null,
      trending: trendingResponse.status === 'fulfilled' ? trendingResponse.value : null,
      popular: popularResponse.status === 'fulfilled' ? popularResponse.value : null,
      errors: {
        movies: moviesResponse.status === 'rejected' ? moviesResponse.reason : null,
        trending: trendingResponse.status === 'rejected' ? trendingResponse.reason : null,
        popular: popularResponse.status === 'rejected' ? popularResponse.reason : null,
      },
    };
  } catch (error) {
    console.error('Unexpected error in fetchAllMovies:', error);
    throw error;
  }
}