
import Colors from "@/constants/Colors";
import { strings } from "@/constants/strings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
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
import { useDispatch } from "react-redux";
import AnimatedAuthWrapper from "../components/AnimatedAuthWrapper";

const USERINFO_KEY = "userinfo";
const ALL_USERS_KEY = "allUsers";

const isValidEmail = (email) =>
  typeof email === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

const SignUpScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);
  const Strings = strings?.en?.SignInScreen ?? {};

  const setError = (field, message) =>
    setErrors((prev) => ({ ...prev, [field]: message }));
  const clearErrors = () => setErrors({});

  const validate = () => {
    clearErrors();
    let ok = true;
    if (!name.trim()) {
      setError("name", Strings.nameRequired || "Name is required");
      ok = false;
    } else if (name.trim().length < 2) {
      setError("name", Strings.nameMinLength || "Name must be at least 2 characters");
      ok = false;
    }
    if (!email.trim()) {
      setError("email", Strings.emailRequired || "Email is required");
      ok = false;
    } else if (!isValidEmail(email.trim())) {
      setError("email", Strings.emailInvalid || "Invalid email format");
      ok = false;
    }
    if (!password) {
      setError("password", Strings.passwordRequired || "Password is required");
      ok = false;
    } else if (password.length < 6) {
      setError("password", Strings.passwordMinLength || "Password must be at least 6 characters");
      ok = false;
    }
    if (!confirm) {
      setError("confirm", Strings.confirmRequired || "Please confirm password");
      ok = false;
    } else if (password !== confirm) {
      setError("confirm", Strings.passwordsMismatch || "Passwords do not match");
      ok = false;
    }
    return ok;
  };

  const goToLogin = () => {
    try {
      router.replace("/sign-in");
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        createdAt: new Date().toISOString(),
      };

      const allUsersJson = await AsyncStorage.getItem(ALL_USERS_KEY);
      let allUsers = allUsersJson ? JSON.parse(allUsersJson) : [];

      const existingUser = allUsers.find(
        (user) => user.email.toLowerCase() === payload.email.toLowerCase()
      );

      if (existingUser) {
        // User already exists
        Alert.alert(
          "User Already Exists",
          "An account with this email already exists. Please go to Login Screen.",
          [
            {
              text: "Go to Login",
              onPress: () => goToLogin(),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
        setLoading(false);
        return;
      }

      // Add new user to the list
      allUsers.push(payload);
      await AsyncStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));

      Alert.alert(
        Strings.registeredTitle || "Registration Successful",
        Strings.registeredMessage || "Your account has been created successfully!",
        [
          {
            text: Strings.okButton || "OK",
            onPress: () => {
              goToLogin();
            },
          },
        ]
      );
    } catch (e) {
      console.error("AsyncStorage error:", e);
      Alert.alert(
        Strings.errorTitle || "Error",
        "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedAuthWrapper direction="left">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, marginTop: 50 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View className="flex-1  p-4 justify-center">
            {/* Header with staggered animation */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(100)}
              className="items-center mb-8"
            >
              <View className="w-24 h-24 rounded-full bg-white/10 items-center justify-center mb-4">
                <Text className="text-3xl text-white font-bold">🎬</Text>
              </View>
              <Text
                className="text-2xl text-white font-Inter"
                style={{ fontSize: 24 }}
              >
                {Strings.title || "Create Account"}
              </Text>
              <Text className="text-sm text-slate-300 mt-1">
                {Strings.subtitle || "Sign up to get started"}
              </Text>
            </Animated.View>

            {/* Form Card with animation */}
            <Animated.View
              entering={FadeInUp.duration(600).delay(200)}
              className="p-4 rounded-3xl shadow-lg"
            >
              <Text className="text-slate-200 mb-2">
                {Strings.fullNameLabel || "Full Name"}
              </Text>
              <TextInput
                placeholder={Strings.fullNamePlaceholder || "Enter your full name"}
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={(t) => setName(t)}
                className="bg-white/5 px-4 py-3 rounded-lg mb-2 text-white"
                returnKeyType="next"
              />
              {errors.name ? (
                <Text className="text-rose-400 mb-2">{errors.name}</Text>
              ) : null}

              <Text className="text-slate-200 mb-2 mt-2">
                {Strings.emailLabel || "Email"}
              </Text>
              <TextInput
                placeholder={Strings.emailPlaceholder || "Enter your email"}
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={(t) => setEmail(t)}
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-white/5 px-4 py-3 rounded-lg mb-2 text-white"
                returnKeyType="next"
              />
              {errors.email ? (
                <Text className="text-rose-400 mb-2">{errors.email}</Text>
              ) : null}

              <Text className="text-slate-200 mb-2 mt-2">
                {Strings.passwordLabel || "Password"}
              </Text>
              <View className="flex-row items-center bg-white/5 rounded-lg px-2 mb-2">
                <TextInput
                  placeholder={Strings.passwordPlaceholder || "Enter your password"}
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={(t) => setPassword(t)}
                  secureTextEntry={secure}
                  className="flex-1 py-3 px-2 text-white"
                  autoCapitalize="none"
                  returnKeyType="next"
                />
                <TouchableOpacity
                  onPress={() => setSecure((s) => !s)}
                  className="px-2 py-2"
                  accessibilityLabel={
                    secure ? Strings.showPassword : Strings.hidePassword
                  }
                >
                  {secure ? (
                    <Text className="text-slate-300">{Strings.showPassword || "Show"}</Text>
                  ) : (
                    <Text className="text-slate-300">{Strings.hidePassword || "Hide"}</Text>
                  )}
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text className="text-rose-400 mb-2">{errors.password}</Text>
              ) : null}

              <Text className="text-slate-200 mb-2 mt-2">
                {Strings.confirmPasswordLabel || "Confirm Password"}
              </Text>
              <TextInput
                placeholder={Strings.confirmPasswordPlaceholder || "Confirm your password"}
                placeholderTextColor="#94a3b8"
                value={confirm}
                onChangeText={(t) => setConfirm(t)}
                secureTextEntry={secure}
                className="bg-white/5 px-4 py-3 rounded-lg mb-2 text-white"
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />
              {errors.confirm ? (
                <Text className="text-rose-400 mb-2">{errors.confirm}</Text>
              ) : null}

              <Pressable
                onPress={onSubmit}
                disabled={loading}
                style={{
                  backgroundColor: Colors.primary,
                }}
                className="mt-3 py-3 rounded-lg items-center"
              >
                <Text className="text-black font-semibold">
                  {loading ? Strings.loadingButton || "Creating Account..." : Strings.submitButton || "Create Account"}
                </Text>
              </Pressable>
            </Animated.View>

            {/* Footer link with animation */}
            <Animated.View
              entering={FadeIn.duration(600).delay(400)}
              className="mt-2 items-center"
            >
              <Text className="text-slate-400 text-sm">
                {Strings.alreadyRegistered || "Already have an account?"}
              </Text>
              <Link href="/(auth)/sign-in" className="mt-2">
                <Text className="text-white underline font-semibold">
                  {Strings.loginLink || "Login Here"}
                </Text>
              </Link>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedAuthWrapper>
  );
};

export default SignUpScreen;