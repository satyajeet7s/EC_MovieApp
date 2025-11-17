import { RootState } from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Favorite from '../screens/Favorite';

const STORAGE_KEY = "favoriteMovies";

const FavoriteService = () => {
  const [favorite, setFavorite] = useState([]);
  const favoriteIds = useSelector((s: RootState) => s.favorites.favoriteIds ?? {});

  const loadStoredFavorites = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);

      if (data) {
        const parsed = JSON.parse(data);
        setFavorite(parsed);
        // console.log("📌 STORED FAVORITES:", parsed);
      } else {
        setFavorite([]);
      }
    } catch (err) {
    }
  };

  useEffect(() => {
    loadStoredFavorites();
  }, []);

  // Reload when favoriteIds changes (when favorites are toggled)
  useEffect(() => {
    loadStoredFavorites();
  }, [favoriteIds]);

  // Reload when screen comes into focus (when navigating back)
  useFocusEffect(
    React.useCallback(() => {
      loadStoredFavorites();
    }, [])
  );
  
  return (
    <Favorite
      favorite={favorite}
      setfavorite={setFavorite}
    />
  );
};

export default FavoriteService;

const styles = StyleSheet.create({});