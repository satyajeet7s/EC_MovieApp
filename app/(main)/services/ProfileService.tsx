// import { clearAllFavorites } from '@/store/favoriteSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { clearAuth } from '../../../store/authSlice';
import { clearAllFavorites } from '../../../store/favoriteSlice';
import Profile from '../screens/Profile';


const STORAGE_KEY = "favoriteMovies";
const USERINFO_KEY = "userinfo";
const ProfileService = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [favorite, setFavorite] = useState([]);

 // Load favorites from AsyncStorage
  const loadStoredFavorites = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);

      if (data) {
        const parsed = JSON.parse(data);
        setFavorite(parsed);
        // console.log("📌 STORED FAVORITES:", parsed);
      } else {
        setFavorite([]);
        // console.log("📌 No favorites found in storage.");
      }
    } catch (err) {
      // console.log("❌ Error reading favorites:", err);
    }
  };

  // Load on mount
  useEffect(() => {
    loadStoredFavorites();
  }, []);


  // Reload when screen comes into focus (when navigating back)
  useFocusEffect(
    React.useCallback(() => {
      loadStoredFavorites();
    }, [])
  );


  const handleLogout = async () => {
    try {
      // Clear AsyncStorage
      console.log("Logging out, removing user info from AsyncStorage");
      await AsyncStorage.removeItem(USERINFO_KEY);
      await AsyncStorage.removeItem(STORAGE_KEY);
      
      await dispatch<any>(clearAllFavorites());
      // Clear Redux state
      dispatch(clearAuth());
      
      // Navigate to sign-in (use absolute route to be safe)
      router.replace('/(auth)/sign-in');
      
      Alert.alert("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Logout failed", "Please try again.");
    }
  };

  return (
    <Profile
      handleLogout={handleLogout}
      user={user}
      favorite={favorite}
    />
  )
}

export default ProfileService


