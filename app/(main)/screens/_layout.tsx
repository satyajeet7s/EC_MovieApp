import { Stack } from "expo-router";
import '../../../global.css';


export default function ScreenLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" options={{ headerShown: false }} />
            <Stack.Screen name="Favorite" options={{ headerShown: false }} />
            <Stack.Screen name="Profile" options={{ headerShown: false }} />
        </Stack>
    )
}