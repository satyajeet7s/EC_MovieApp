// import { setAuth } from '@/store/authSlice';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Stack, useRouter } from 'expo-router';
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';

// const USERINFO_KEY = "userinfo";

// export default function MainLayout() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     checkAuthAndRestore();
//   }, []);

//   const checkAuthAndRestore = async () => {
//     try {
//       const stored = await AsyncStorage.getItem(USERINFO_KEY);

//       if (stored) {
//         const userData = JSON.parse(stored);
//         // Restore auth state from AsyncStorage
//         dispatch(setAuth({
//           name: userData.name,
//           email: userData.email,
//           createdAt: userData.createdAt,
//         }));
//       } else {
//         // No user data, redirect to auth
//         router.replace('../(auth)/sign-in');
//       }
//     } catch (error) {
//       console.error('Auth check error:', error);
//       router.replace('../(auth)/sign-in');
//     }
//   };

//   return (
//     <Stack screenOptions={{ headerShown: false }} initialRouteName='services'>
//       <Stack.Screen name="screens" options={{ headerShown: false }} />
//       <Stack.Screen name="services" options={{ headerShown: false }} />
//     </Stack>
//   );
// }

// import { setAuth } from '@/store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../store/authSlice';

const USERINFO_KEY = "userinfo";

export default function MainLayout() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    checkAuthAndRestore();
  }, []);

  const checkAuthAndRestore = async () => {
    try {
      const stored = await AsyncStorage.getItem(USERINFO_KEY);

      if (stored) {
        const userData = JSON.parse(stored);
        dispatch(setAuth({
          name: userData.name,
          email: userData.email,
          createdAt: userData.createdAt,
        }));
      } else {
        router.replace('/(auth)/sign-in');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.replace('/(auth)/sign-in');
    }
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none', // Disable default animation
      }}
      initialRouteName='services'
    >
      <Stack.Screen name="screens" options={{ headerShown: false }} />
      <Stack.Screen name="services" options={{ headerShown: false }} />

      <Stack.Screen
        name="components/MovieDetail"
        options={{
          headerShown: false,
          presentation: 'modal', // or 'transparentModal'
          animation: 'slide_from_bottom', // or 'fade'
        }}
      />
    </Stack>
  );
}