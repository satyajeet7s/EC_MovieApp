
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import "../../../global.css";

export default function ServiceLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactive,
        tabBarStyle: {
          position: "absolute",
          bottom: 30,
          left: 0,
          right: 0,
          height: 70,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 15,
          backgroundColor: Colors.black,   // <-- use Colors here
          borderRadius: 9999,
          marginHorizontal: 20,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
      initialRouteName="HomeService"
    >
      <Tabs.Screen
        name="HomeService"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="FavoriteService"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ProfileService"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
