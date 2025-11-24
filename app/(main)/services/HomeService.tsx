// import { fetchAllMovies } from '@/app/api/MovieApi';
// import { Movie, staticMovies } from '@/app/data/staticMovies';
import { RootState } from '@/store';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { fetchAllMovies } from '../../api/MovieApi';
import { Movie, staticMovies } from '../../data/staticMovies';
import Home from '../screens/Home';

export default function HomeService() {
  const [page, setPage] = useState<number>(1);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trendingMovies, settrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);



  useEffect(() => {
    let isMounted = true;

    async function loadMovies() {
      setLoading(true);
      setError(null);

      let isMounted = true;
      try {
        // Add timeout to prevent hanging
        const timeoutMs = 10000; 
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
        );

        const fetchPromise = fetchAllMovies(page);
        const responses = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (responses.trending?.status === 200) {
          const trendingResults = responses.trending.data?.results ?? [];
          settrendingMovies(prev => (page === 1 ? trendingResults : [...prev, ...trendingResults]));
        } else if (responses.errors?.trending) {
          settrendingMovies(staticMovies);
          console.error('Trending movies error:', responses.errors.trending);
        }

        if (responses.popular?.status === 200) {
          const popularResults = responses.popular.data?.results ?? [];
          setPopularMovies(prev => (page === 1 ? popularResults : [...prev, ...popularResults]));
        } else if (responses.errors?.popular) {
          setPopularMovies(staticMovies);
          console.error('Popular movies error:', responses.errors.popular);
        }

        if (responses.movies?.status === 200) {
          const results: Movie[] = responses.movies.data?.results ?? [];
          setMovies(prev => (page === 1 ? results : [...prev, ...results]));
        } else {
          if (responses.errors?.movies) {
            console.error('Movies error:', responses.errors.movies);
          }
          setError('Failed to fetch movies');
          console.log('Using static movie data due to fetch failure.');
          setMovies(staticMovies);
        }

        const allFailed = !(responses.movies?.status === 200) && !(responses.trending?.status === 200) && !(responses.popular?.status === 200);
        if (allFailed) {
          setError('All movie endpoints failed');
          setMovies(staticMovies);
          settrendingMovies(staticMovies);
          setPopularMovies(staticMovies);
        }

      } catch (err: any) {
        console.error('fetchAllMovies failed:', err);
        if (err.message === 'Request timeout') {
          setError('Request timed out, using static data');
          setMovies(staticMovies);
          settrendingMovies(staticMovies);
          setPopularMovies(staticMovies);
        } else {
          setError(err?.message ?? 'Failed to fetch movies');
          setMovies(staticMovies);
          settrendingMovies(staticMovies);
          setPopularMovies(staticMovies);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadMovies();

    return () => {
      isMounted = false;
    };
  }, [page, refreshTrigger, isAuthenticated]);



  const handleLoadMore = () => {
   console.log('handleLoadMore called. Current page:', page);
    if (!loading) setPage(prev => prev + 1);
  };

  const handleRefresh = () => {
    if (loading) return;
    setMovies([]);
    settrendingMovies([]);
    setPopularMovies([]);
    setError(null);
    setPage(1);
    setRefreshTrigger(prev => prev + 1);
  };

  console.log('isauthenticated:', isAuthenticated);
  console.log('user:', user);

  return (
    <Home
      movies={movies}
      trendingMovies={trendingMovies}
      popularMovies={popularMovies}
      loading={loading}
      error={error}
      onLoadMore={handleLoadMore}
      onRefresh={handleRefresh}
      page={page}
      setPage={setPage}
      setLoading={setLoading}
      handleRefresh={handleRefresh}
    />
  );
}

const styles = StyleSheet.create({});