import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = 'favoriteMovies';

interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type?: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface FavoriteState {
  favoriteIds: { [key: string]: boolean };
  isLoading: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  favoriteIds: {},
  isLoading: false,
  error: null,
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.favoriteIds = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.favoriteIds[id] = !state.favoriteIds[id];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setFavorites, toggleFavorite, setLoading, setError } = favoriteSlice.actions;

// Thunk actions for AsyncStorage operations
export const loadFavorites = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const storedFavorites = await AsyncStorage.getItem(STORAGE_KEY);
    
    if (storedFavorites) {
      const parsedMovies: Movie[] = JSON.parse(storedFavorites);
      const favoriteIds = parsedMovies.reduce((acc, movie) => {
        acc[movie.id.toString()] = true;
        return acc;
      }, {} as { [key: string]: boolean });
      
      dispatch(setFavorites(favoriteIds));
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError('Failed to load favorites'));
    dispatch(setLoading(false));
  }
};

export const addToFavorites = (movie: Movie) => async (dispatch: any, getState: any) => {
  try {
    const storedFavorites = await AsyncStorage.getItem(STORAGE_KEY);
    let movies: Movie[] = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    // Check if movie already exists
    const existingIndex = movies.findIndex(m => m.id === movie.id);
    
    if (existingIndex === -1) {
      // Add new movie
      movies.push(movie);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
      dispatch(toggleFavorite(movie.id.toString()));
    }
  } catch (error) {
    dispatch(setError('Failed to add favorite'));
    console.error('Error adding to favorites:', error);
  }
};

export const removeFromFavorites = (movieId: string) => async (dispatch: any) => {
  try {
    const storedFavorites = await AsyncStorage.getItem(STORAGE_KEY);
    let movies: Movie[] = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    // Remove movie from array
    movies = movies.filter(m => m.id.toString() !== movieId);
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    dispatch(toggleFavorite(movieId));
  } catch (error) {
    dispatch(setError('Failed to remove favorite'));
    console.error('Error removing from favorites:', error);
  }
};

export const toggleFavoriteWithStorage = (movie: Movie) => async (dispatch: any, getState: any) => {
  const { favoriteIds } = getState().favorites;
  const movieId = movie.id.toString();
  
  if (favoriteIds[movieId]) {
    // Remove from favorites
    await dispatch(removeFromFavorites(movieId));
  } else {
    // Add to favorites
    await dispatch(addToFavorites(movie));
  }
};

export const getFavoriteMovies = async (): Promise<Movie[]> => {
  try {
    const storedFavorites = await AsyncStorage.getItem(STORAGE_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error('Error getting favorite movies:', error);
    return [];
  }
};

export const clearAllFavorites = () => async (dispatch: any) => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    dispatch(setFavorites({}));
  } catch (error) {
    dispatch(setError('Failed to clear favorites'));
    console.error('Error clearing favorites:', error);
  }
};

export default favoriteSlice.reducer;