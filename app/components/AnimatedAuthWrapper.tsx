// components/AnimatedAuthWrapper.tsx
import React, { useEffect } from "react";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

interface AnimatedAuthWrapperProps {
  children: React.ReactNode;
  direction?: "left" | "right";
}

export default function AnimatedAuthWrapper({ 
  children, 
  direction = "right" 
}: AnimatedAuthWrapperProps) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(direction === "left" ? -30 : 30);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    // Fade in + slide in + scale animation
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });

    translateX.value = withSpring(0, {
      damping: 20,
      stiffness: 90,
    });

    scale.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      {children}
    </Animated.View>
  );
}