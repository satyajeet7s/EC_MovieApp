// import Colors from "@/constants/Colors";
// import apiStrConstants from "@/constants/apiConstants/apiStrConstants";
// import { strings } from "@/constants/strings";
import { strings } from "../../../constants/strings";
// import { AppDispatch, RootState } from "@/store";
// import { loadFavorites, toggleFavoriteWithStorage } from "@/store/favoriteSlice";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import React, { memo, useEffect, useMemo, useRef } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import apiStrConstants from "../../../constants/apiConstants/apiStrConstants";
import Colors from "../../../constants/Colors";
import { AppDispatch, RootState } from "../../../store";
import { loadFavorites, toggleFavoriteWithStorage } from "../../../store/favoriteSlice";

const { width } = Dimensions.get("window");

// Layout config
const HORIZONTAL_PADDING = 12;
const GAP = 8;
const NUM_COLUMNS = 3;
const ITEM_WIDTH = Math.floor((width - HORIZONTAL_PADDING * 2 - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS);
const IMAGE_MULT = 1.4;

type Props = {
  favorite?: any[];
  setfavorite?: (v: any) => void;
};

const animation = require("../../../assets/animations/empty.json");

const SavedEmptyComponent: React.FC<Props> = ({ 
  title = strings.en.favoriteScreen.emptyTitle,
  subtitle = strings.en.favoriteScreen.emptySubtitle,
  loop = true,
  size,
}) => {
  const { width } = useWindowDimensions();

  const dim = useMemo(() => size ?? Math.min(320, Math.floor(width * 0.7)), [size, width]);

  return (
    <View
      style={{ width: "100%", alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}
      pointerEvents="box-none"
      accessibilityRole="image"
      accessibilityLabel={title}
    >
      <LottieView
        source={animation}
        autoPlay
        loop={loop}
        style={{ width: dim, height: dim }}
        resizeMode="contain"
        
      />
      {title.trim().length === 0 ? (
        <Text style={{ marginTop: 12, fontSize: 18, fontWeight: "600", color: "#fff" }}>
          {title}
        </Text>
      ):null}

      <Text style={{ marginTop: 2, fontSize: 12, color: "#D1D5DB", textAlign: "center" }}>
        {subtitle}
      </Text>
    </View>
  );
};

export const SavedEmpty = memo(SavedEmptyComponent, (prev, next) => {
  return prev.title === next.title && prev.subtitle === next.subtitle && prev.loop === next.loop && prev.size === next.size;
});

const Favorite: React.FC<Props> = ({ favorite = [], setfavorite }) => {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteIds = useSelector((s: RootState) => s.favorites.favoriteIds ?? {});

  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  const swipeableRefs = useRef<Map<number | string, Swipeable | null>>(new Map());

  const toggleFavorite = async (item: any) => {
    const movieData = {
      adult: item.adult ?? false,
      backdrop_path: item.backdrop_path ?? "",
      genre_ids: item.genre_ids ?? [],
      id: typeof item.id === "string" ? parseInt(item.id, 10) : item.id,
      media_type: item.media_type ?? "movie",
      original_language: item.original_language ?? "en",
      original_title: item.original_title ?? (item.title || item.name || ""),
      overview: item.overview ?? "",
      popularity: item.popularity ?? 0,
      poster_path: item.poster_path ?? "",
      release_date: item.release_date ?? "",
      title: item.title || item.name || "",
      video: item.video ?? false,
      vote_average: item.vote_average ?? 0,
      vote_count: item.vote_count ?? 0,
    };

    await dispatch(toggleFavoriteWithStorage(movieData));

    const ref = swipeableRefs.current.get(item.id);
    try {
      ref?.close?.();
    } catch (e) {
    }
  };

  const handleCardPress = (item: any) => {
    Alert.alert(
      strings.en.favoriteScreen.cardSelectedTitle, 
      `${item.id} ${strings.en.favoriteScreen.cardSelectedMessage}`
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation,
    dragX: Animated.AnimatedInterpolation,
    item: any
  ) => {
    const scale = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
      extrapolate: "clamp",
    });

    const actionHeight = ITEM_WIDTH * IMAGE_MULT + 48;

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => toggleFavorite(item)}>
        <Animated.View
          style={{
            transform: [{ scale }],
            backgroundColor: "#ff4757",
            width: 88,
            height: actionHeight,
            marginBottom: GAP,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 6,
          }}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 12, marginTop: 6 }}>{strings.en.favoriteScreen.remove}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const endUrl = item?.poster_path ?? item?.backdrop_path ?? null;
    const imageUri = endUrl ? `${apiStrConstants.BASE_IMG_URL}${endUrl}` : item.uri;
    const isFavorite = !!favoriteIds[item.id?.toString?.()];

    return (
      <Swipeable
        ref={(ref) => {
          if (ref) swipeableRefs.current.set(item.id, ref);
          else swipeableRefs.current.delete(item.id);
        }}
        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
        overshootRight={false}
      >
        <View style={{ width: ITEM_WIDTH, marginRight: GAP, marginBottom: GAP }}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => handleCardPress(item)}>
            <View className="rounded-xl overflow-hidden bg-[#0b0b0b] border-[0.2px] border-gray-600" style={styles.cardShadow}>
              <Image
                source={imageUri ? { uri: imageUri } : undefined}
                style={{ width: "100%", height: ITEM_WIDTH * IMAGE_MULT }}
                className="rounded-t-xl"
                resizeMode="cover"
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleFavorite(item)}
                className="absolute top-2 right-2 z-50 bg-black/40 p-1.5 rounded-full"
              >
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={18} color={isFavorite ? "#C4E538" : "#fff"} />
              </TouchableOpacity>

              <View className="px-2 py-2 flex-row items-center">
                <Text numberOfLines={1} ellipsizeMode="tail" className="flex-1 text-white text-sm font-semibold">
                  {item.title || item?.name || ""}
                </Text>

                {item.vote_average ? (
                  <View className="flex-row items-center ml-2">
                    <Ionicons name="star" size={12} color="#FBBF24" />
                    <Text className="text-white text-xs ml-1">{item.vote_average ? item.vote_average.toFixed(1) : "—"}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  return (
    <LinearGradient
      colors={[Colors.favGradientStart, Colors.favGradientEnd]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      className="flex-1"
      style={{ paddingHorizontal: HORIZONTAL_PADDING, paddingTop: 20 }}
    >
      <Text className="text-white text-2xl font-Inter mb-4 mt-6">{strings.en.favoriteScreen.title}</Text>

      <View className="flex-1 w-full">
        <FlatList
          data={favorite}
          keyExtractor={(item) => item.id?.toString?.() ?? Math.random().toString()}
          renderItem={renderItem}
          numColumns={NUM_COLUMNS}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
            paddingTop: 6,
            flexGrow: 1,
            justifyContent: favorite.length === 0 ? "center" : "flex-start",
          }}
          ListEmptyComponent={() => (
            <View className="items-center">
              <SavedEmpty />
            </View>
          )}
        />
      </View>
    </LinearGradient>
  );
};

export default Favorite;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: Colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});