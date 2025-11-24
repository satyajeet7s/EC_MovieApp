import Colors from "@/constants/Colors";
import { strings } from "@/constants/strings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import AnimatedAuthWrapper from "../components/AnimatedAuthWrapper";

const USERINFO_KEY = "userinfo";
const ALL_USERS_KEY = "allUsers";

const isValidEmail = (email) =>
  typeof email === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);
  const Strings = strings?.en?.SignUpScreen ?? {};

  const setError = (field, message) =>
    setErrors((prev) => ({ ...prev, [field]: message }));
  const clearErrors = () => setErrors({});

  const validate = () => {
    clearErrors();
    let ok = true;

    if (!email.trim()) {
      setError("email", Strings.emailRequired);
      ok = false;
    } else if (!isValidEmail(email.trim())) {
      setError("email", Strings.emailInvalid);
      ok = false;
    }

    if (!password) {
      setError("password", Strings.passwordRequired);
      ok = false;
    } else if (password.length < 6) {
      setError("password", Strings.passwordMinLength);
      ok = false;
    }

    return ok;
  };

  const goToHomeService = () => {
    try {
      console.log("navigate -> homeService");
      router.replace("/(main)/services/HomeService");
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };

  const onLogin = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const allUsersJson = await AsyncStorage.getItem(ALL_USERS_KEY);

      if (!allUsersJson) {
        Alert.alert(
          Strings.noAccountTitle,
          Strings.noAccountMessage,
          [
            {
              text: Strings.createAccountButton,
              onPress: () => router.push("/(auth)/sign-up"),
            },
            { text: Strings.okButton, style: "cancel" },
          ]
        );
        return;
      }

      const allUsers = JSON.parse(allUsersJson);
      const inputEmail = email.trim().toLowerCase();

      const foundUser = allUsers.find(
        (user) => user.email.toLowerCase() === inputEmail
      );

      if (!foundUser) {
        Alert.alert(
          Strings.accountNotFoundTitle,
          Strings.accountNotFoundMessage,
          [
            {
              text: Strings.createAccountButton,
              onPress: () => router.push("/(auth)/sign-in"),
            },
            { text: Strings.okButton, style: "cancel" },
          ]
        );
        return;
      }

      if (foundUser.password !== password) {
        setError("password", Strings.incorrectPassword);
        Alert.alert(Strings.loginFailedTitle, Strings.loginFailedMessage);
        return;
      }

      // Store individual user info after successful login
      await AsyncStorage.setItem(USERINFO_KEY, JSON.stringify(foundUser));

      Alert.alert(
        Strings.welcomeTitle,
        `${Strings.welcomeMessage}${foundUser.name ?? Strings.userFallback}!`,
        [{ text: Strings.okButton, onPress: () => goToHomeService() }]
      );
    } catch (e) {
      console.error("AsyncStorage error:", e);
      Alert.alert(Strings.errorTitle, Strings.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const existing = await AsyncStorage.getItem(USERINFO_KEY);
        if (existing) {
          const s = JSON.parse(existing);
          if (s.email) setEmail(s.email);
        }
      } catch (e) {
      }
    })();
  }, []);

  return (
    <AnimatedAuthWrapper direction="right">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View className="flex-1 p-4 justify-center">
            {/* Header with staggered animation */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(100)}
              className="items-center mb-8"
            >
              <View className="w-24 h-24 rounded-full bg-white/10 items-center justify-center mb-4">
                <Text className="text-3xl text-white font-bold">🎬</Text>
              </View>
              <Text className="text-2xl text-white font-semibold">
                {Strings.title}
              </Text>
              <Text className="text-sm text-slate-300 mt-1">
                {Strings.subtitle}
              </Text>
            </Animated.View>

            {/* Form Card with animation */}
            <Animated.View
              entering={FadeInUp.duration(600).delay(200)}
              className="p-4 rounded-3xl shadow-lg bg-white/3"
            >
              <Text className="text-slate-200 mb-2">{Strings.emailLabel}</Text>
              <TextInput
                placeholder={Strings.emailPlaceholder}
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={(t) => setEmail(t)}
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-white/5 px-4 py-3 rounded-lg mb-2 text-white"
                returnKeyType="next"
                onSubmitEditing={() => {
                  // Focus on password field if needed
                }}
              />
              {errors.email ? (
                <Text className="text-rose-400 mb-2">{errors.email}</Text>
              ) : null}

              <Text className="text-slate-200 mb-2 mt-2">
                {Strings.passwordLabel}
              </Text>
              <View className="flex-row items-center bg-white/5 rounded-lg px-2 mb-2">
                <TextInput
                  placeholder={Strings.passwordPlaceholder}
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={(t) => setPassword(t)}
                  secureTextEntry={secure}
                  className="flex-1 py-3 px-2 text-white"
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={onLogin}
                />
                <TouchableOpacity
                  onPress={() => setSecure((s) => !s)}
                  className="px-2 py-2"
                  accessibilityLabel={
                    secure ? Strings.showPassword : Strings.hidePassword
                  }
                >
                  {secure ? (
                    <Text className="text-slate-300">{Strings.showPassword}</Text>
                  ) : (
                    <Text className="text-slate-300">{Strings.hidePassword}</Text>
                  )}
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text className="text-rose-400 mb-2">{errors.password}</Text>
              ) : null}


              <Pressable
                onPress={onLogin}
                disabled={loading}
                style={{
                  backgroundColor: Colors.primary,
                }}
                className="mt-3 py-3 rounded-lg items-center"
              >
                <Text className="text-white font-semibold">
                  {loading ? Strings.loadingButton : Strings.loginButton}
                </Text>
              </Pressable>
            </Animated.View>

            {/* Footer link with animation */}
            <Animated.View
              entering={FadeIn.duration(600).delay(400)}
              className="mt-6 items-center"
            >
              <Text className="text-slate-400 text-sm">
                {Strings.noAccountText}
              </Text>
              <Link href="/(auth)/sign-up" className="mt-2">
                <Text className="text-white underline font-semibold">
                  {Strings.createOneLink}
                </Text>
              </Link>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedAuthWrapper>
  );
}