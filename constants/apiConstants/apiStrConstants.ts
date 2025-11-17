const API_KEY = process.env.API_KEY;
const apiStrConstants ={
    API_KEY : API_KEY,
    BASE_MOVIE_URL: "https://api.themoviedb.org/3/discover/movie",
    TRENDING_MOVIE_URL: "https://api.themoviedb.org/3/trending/movie/day",
    POPULAR_MOVIE_URL :"https://api.themoviedb.org/3/tv/popular",
    BASE_IMG_URL :"https://image.tmdb.org/t/p/w500",
}
export default apiStrConstants;