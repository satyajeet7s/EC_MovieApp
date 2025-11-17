//AuthLayout
import { Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import {
    Easing,
    useSharedValue,
    withTiming
} from "react-native-reanimated";

export default function AuthLayout() {
  const pathname = usePathname();
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);

  useEffect(() => {
    // Trigger animation on route change
    opacity.value = 0;
    translateX.value = pathname.includes("sign-in") ? -20 : 20;
    
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
    
    translateX.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [pathname]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none", 
        contentStyle: { backgroundColor: "#000" },
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}