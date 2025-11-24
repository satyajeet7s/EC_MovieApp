// import apiStrConstants from "@/constants/apiConstants/apiStrConstants";
// import Colors from "@/constants/Colors";
import Colors from "../../constants/Colors";
// import { AppDispatch, RootState } from "@/store";
import { AppDispatch, RootState } from "../../store";
// import { loadFavorites, toggleFavoriteWithStorage } from "@/store/favoriteSlice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Layout } from "react-native-reanimated";
import { SharedElement } from 'react-native-shared-element';
import { useDispatch, useSelector } from "react-redux";
import apiStrConstants from "../../constants/apiConstants/apiStrConstants";
import { loadFavorites, toggleFavoriteWithStorage } from "../../store/favoriteSlice";

const { width } = Dimensions.get("window");

const LARGE_WIDTH = Math.round(width * 0.70);
const LARGE_SPACING = (width - LARGE_WIDTH) / 2;
const SMALL_WIDTH = Math.round(width * 0.45);
const SMALL_SPACING = (width - SMALL_WIDTH) / 2;

interface CardItem {
  vote_average: any;
  backdrop_path: any;
  poster_path: any;
  id: string | number;
  title?: string;
  name?: string;
  uri?: string;
  adult?: boolean;
  genre_ids?: number[];
  media_type?: string;
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity?: number;
  release_date?: string;
  video?: boolean;
  vote_count?: number;
}

interface CardsProps {
  data: CardItem[];
  title?: string;
  primary?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
  onCardPress?: (item: CardItem) => void;
}

function CardsComponent({
  data,
  title,
  primary = false,
  onLoadMore,
  isLoading = false,
  onCardPress,
}: CardsProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch<AppDispatch>();
  const favoriteIds = useSelector((state: RootState) => state.favorites.favoriteIds);
  const router = useRouter();

  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  const toggleFavorite = useCallback(async (item: CardItem) => {
    const movieData = {
      adult: item.adult ?? false,
      backdrop_path: item.backdrop_path ?? "",
      genre_ids: item.genre_ids ?? [],
      id: typeof item.id === 'string' ? parseInt(item.id) : item.id,
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
  }, [dispatch]);

  const handleCardPress = useCallback((item: CardItem) => {
    
      router.push({
        pathname: '/components/_MovieDetail',
        params: {
          movie: JSON.stringify(item)
        }
      });
    
  }, [ router]);

  const ITEM_WIDTH = primary ? LARGE_WIDTH : SMALL_WIDTH;
  const ITEM_SPACING = primary ? LARGE_SPACING : SMALL_SPACING;

  const IMAGE_MULT = primary ? 1.25 : 1.2;
  const FOCUSED_SCALE = primary ? [0.88, 1.14, 0.88] : [0.92, 1.00, 0.85];
  const FOCUSED_TRANSLATE = primary ? [26, -14, 26] : [10, 0, 15];

  const getImageUri = useCallback((item: CardItem) => {
    const endUrl = item?.poster_path ?? item?.backdrop_path ?? null;
    return endUrl
      ? `${apiStrConstants.BASE_IMG_URL}${endUrl}`
      : item.uri;
  }, []);

  const renderItem = useCallback(({ item, index }: { item: CardItem; index: number }) => {
    const imageUri = getImageUri(item);
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: FOCUSED_SCALE,
      extrapolate: "clamp",
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: FOCUSED_TRANSLATE,
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: "clamp",
    });

    const imageHeight = ITEM_WIDTH * IMAGE_MULT;
    const isFavorite = favoriteIds[item.id.toString()] || false;

    return (
      <View style={{ width: ITEM_WIDTH }}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => handleCardPress(item)}>
          <Animated.View
            className={`-mt-2 rounded-xl bg-gray-900 overflow-hidden z-[100] border-[0.1px] border-gray-600 ${primary ? '' : 'p-2'
              },${primary ? 'ml-2 mr-4' : 'ml-8'}`}
            style={{
              transform: [{ scale }, { translateY }],
              opacity,
              shadowColor: Colors.black,
              shadowOpacity: 0.25,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 6 },
              elevation: primary ? 24 : 16,
            }}
          >
            {/* Shared Element for Image */}
            <SharedElement id={`item.${item.id}.poster`}>
              <Animated.Image
                layout={Layout.springify()} // Add this
                source={imageUri ? { uri: imageUri } : undefined}
                className={primary ? "w-full" : "w-full rounded-xl"}
                style={{ height: imageHeight }}
                resizeMode="cover"
              />
            </SharedElement>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleFavorite(item)}
              className="absolute top-3 right-3 z-[220] bg-black/35 p-1.5 rounded-[18px]"
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite ? "#C4E538" : "#fff"}
              />
            </TouchableOpacity>

            <View className="p-2 flex-row items-center">
              {/* Shared Element for Title */}
              <SharedElement id={`item.${item.id}.title`}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="flex-1 text-white text-base font-bold"
                >
                  {item.title || item?.name || ""}
                </Text>
              </SharedElement>

              {item.vote_average ? (
                <View className="flex-row items-center flex-shrink-0 ml-2">
                  <Ionicons name="star" size={14} color="#FBBF24" />
                  <Text className="text-white text-xs mr-1 ml-1">
                    {item.vote_average ? item.vote_average.toFixed(1) : "—"}
                  </Text>
                </View>
              ) : null}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }, [primary, ITEM_WIDTH, IMAGE_MULT, FOCUSED_SCALE, FOCUSED_TRANSLATE, scrollX, favoriteIds, getImageUri, handleCardPress, toggleFavorite]);

  const contentContainerStyle = useMemo(() => ({
    paddingHorizontal: ITEM_SPACING,
    paddingTop: Math.abs(FOCUSED_TRANSLATE[1]) + (primary ? 40 : 10),
    paddingBottom: 8,
  }), [primary, ITEM_SPACING, FOCUSED_TRANSLATE]);

  const ListFooterComponent = useMemo(() => 
    isLoading ? (
      <View className="w-20 justify-center items-center flex-1">
        <ActivityIndicator size="small" color="#fff" />
      </View>
    ) : null
  , [isLoading]);

  return (
    <View className="overflow-visible px-0 mt-2">
      {title ? (
        <Text className="text-xl font-bold px-[18px] mb-2 text-white z-[5]">
          {title}
        </Text>
      ) : null}

      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={contentContainerStyle}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        renderItem={renderItem}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
}

export default React.memo(CardsComponent);