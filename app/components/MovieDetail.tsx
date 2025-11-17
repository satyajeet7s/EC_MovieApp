import apiStrConstants from '@/constants/apiConstants/apiStrConstants';
import { AppDispatch, RootState } from '@/store';
import { toggleFavoriteWithStorage } from '@/store/favoriteSlice';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  Easing,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { SharedElement } from 'react-native-shared-element';
import { useDispatch, useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');
const POSTER_HEIGHT = height * 0.5;

interface MovieDetailProps {
  route?: {
    params: {
      movie: any;
    };
  };
}

export default function MovieDetail({ route }: MovieDetailProps) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [reviewText, setReviewText] = React.useState('');
  const [rating, setRating] = React.useState(0);

  const movie = route?.params?.movie || (params.movie ? JSON.parse(params.movie as string) : null);
  const favoriteIds = useSelector((state: RootState) => state.favorites.favoriteIds);
  const isFavorite = movie ? favoriteIds[movie.id.toString()] || false : false;
  const [reviews, setReviews] = React.useState<
    { id: number; name: string; rating: number; text: string }[]
  >([]);
  const [localVoteCount, setLocalVoteCount] = React.useState<number>(movie?.vote_count ?? 0);

  const userName = useSelector((state: RootState) => (state as any).auth?.user?.name) || 'You';


  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);
  const reviewSheetY = useSharedValue(height);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    contentOpacity.value = withDelay(
      300,
      withTiming(1, { duration: 400, easing: Easing.ease })
    );

    contentTranslateY.value = withDelay(
      300,
      withSpring(0, {
        damping: 25,
        stiffness: 120,
      })
    );

    buttonOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 300 })
    );
  }, []);

  const contentAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
    opacity: contentOpacity.value,
  }));

  const buttonAnimStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const reviewSheetAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: reviewSheetY.value }],
  }));

  const handleBack = () => {
    router.back();
  };

  const handleAddToWatchlist = async () => {
    if (!movie) return;

    const movieData = {
      adult: movie.adult ?? false,
      backdrop_path: movie.backdrop_path ?? "",
      genre_ids: movie.genre_ids ?? [],
      id: typeof movie.id === 'string' ? parseInt(movie.id) : movie.id,
      media_type: movie.media_type ?? "movie",
      original_language: movie.original_language ?? "en",
      original_title: movie.original_title ?? (movie.title || movie.name || ""),
      overview: movie.overview ?? "",
      popularity: movie.popularity ?? 0,
      poster_path: movie.poster_path ?? "",
      release_date: movie.release_date || movie?.first_air_date || "",
      title: movie.title || movie.name || "",
      video: movie.video ?? false,
      vote_average: movie.vote_average ?? 0,
      vote_count: movie.vote_count ?? 0,
    };

    await dispatch(toggleFavoriteWithStorage(movieData));
  };

  const handleWriteReview = () => {
    reviewSheetY.value = withSpring(0, { damping: 20, stiffness: 90 });
  };

  const handleCloseReviewSheet = () => {
    reviewSheetY.value = withSpring(height, { damping: 20, stiffness: 90 });
  };

  const handleSubmitReview = () => {
    if (!rating || !reviewText.trim()) return;

    const newReview = {
      id: Date.now(),
      name: userName,
      rating,
      text: reviewText.trim(),
    };

    setReviews((p) => [newReview, ...p]);

    setLocalVoteCount((c) => (typeof c === 'number' ? c + 1 : 1));
    Keyboard.dismiss();
    console.log('Review submitted:', { ...newReview, movieId: movie.id });

    setReviewText('');
    setRating(0);
    reviewSheetY.value = withSpring(height, { damping: 20, stiffness: 90 });

  };

  if (!movie) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white text-lg">No movie data available</Text>
      </View>
    );
  }

  const posterUrl = movie.poster_path
    ? `${apiStrConstants.BASE_IMG_URL}${movie.poster_path}`
    : movie.uri;

  const backdropUrl = movie.backdrop_path
    ? `${apiStrConstants.BASE_IMG_URL}${movie.backdrop_path}`
    : posterUrl;

  const releaseDateStr = movie.release_date || movie.first_air_date || "";

  const releaseYear = (() => {
    if (!releaseDateStr) return "N/A";
    const d = new Date(releaseDateStr);
    if (Number.isNaN(d.getTime())) return "N/A"; 
    return d.toLocaleDateString("en-GB"); 
  })();
  const ratings = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <View style={{ flex: 1, backgroundColor: '#111827' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Backdrop with Poster */}
        <View style={{ height: POSTER_HEIGHT }} className="relative">
          {/* Shared Element Backdrop/Poster (fills the header area) */}
          <SharedElement id={`item.${movie.id}.poster`} style={{ width: '100%', height: '100%' }}>
            <Animated.Image
              entering={SlideInUp.springify().delay(200)}
              source={{ uri: backdropUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </SharedElement>

          {/* Gradient Overlay */}
          <View className="absolute inset-0">
            <LinearGradient
              colors={['transparent', 'rgba(17, 24, 39, 0.7)', 'rgba(17, 24, 39, 0.95)', '#111827']}
              locations={[0, 0.5, 0.8, 1]}
              className="flex-1"
            />
          </View>

          {/* Back Button */}
          <View style={{ position: 'absolute', top: 48, left: 16, zIndex: 10 }}>
            <TouchableOpacity
              onPress={handleBack}
              className="bg-black/50 p-2 rounded-full"
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Small Poster (bottom left overlay) */}
          <View
            style={{
              position: 'absolute',
              bottom: -60,
              left: 20,
              width: 130,
              height: 195,
              borderRadius: 12,
              overflow: 'hidden',
              borderWidth: 4,
              borderColor: '#fff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 16,
            }}
          >
            <Animated.Image
              source={{ uri: posterUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Content Section */}
        <Animated.View
          className="px-5 pt-16"
          style={contentAnimStyle}
        >
          {/* Title and Year */}
          <View className="mb-3 mt-8">
            <SharedElement id={`item.${movie.id}.title`}>
              <Text className="text-white text-2xl font-bold mb-1">
                {movie.title || movie.name}
              </Text>
            </SharedElement>
            <View className="flex-row items-center space-x-3 justify-between">
              <Text className="text-gray-400 text-base">{releaseYear}</Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={16} color="#FBBF24" />
                <Text className="text-white text-base font-semibold ml-1">
                  {ratings}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <Animated.View
            className="flex-row space-x-3 mb-6 gap-6"
            style={buttonAnimStyle}
          >
            <TouchableOpacity
              onPress={handleAddToWatchlist}
              activeOpacity={0.8}
              className="flex-1 bg-[#C4E538] py-3.5 rounded-lg flex-row items-center justify-center"
            >
              <Ionicons
                name={isFavorite ? "heart" : "add-circle-outline"}
                size={22}
                color="#000"
              />
              <Text className="text-black font-bold text-base ml-2">
                {isFavorite ? "In Watchlist" : "Add to Watchlist"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleWriteReview}
              activeOpacity={0.8}
              className="flex-1 bg-gray-800 py-3.5 rounded-lg flex-row items-center justify-center border border-gray-700"
            >
              <Ionicons name="create-outline" size={22} color="#fff" />
              <Text className="text-white font-semibold text-base ml-2">
                Write Review
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Overview */}
          <View className="mb-6">
            <Text className="text-white text-lg font-bold mb-2">Overview</Text>
            <Text className="text-gray-300 text-base leading-6">
              {movie.overview || "No overview available."}
            </Text>
          </View>

          {/* Additional Info */}
          <View className="space-y-3">
            {movie.original_language && (
              <View className="flex-row">
                <Text className="text-gray-400 text-base w-32">Language:</Text>
                <Text className="text-white text-base flex-1">
                  {movie.original_language.toUpperCase()}
                </Text>
              </View>
            )}

            {movie.popularity && (
              <View className="flex-row">
                <Text className="text-gray-400 text-base w-32">Popularity:</Text>
                <Text className="text-white text-base flex-1">
                  {movie.popularity.toFixed(0)}
                </Text>
              </View>
            )}

            <View className="flex-row">
              <Text className="text-gray-400 text-base w-32">Vote Count:</Text>
              <Text className="text-white text-base flex-1">
                {localVoteCount.toLocaleString()}
              </Text>
            </View>

            {/* User Reviews (shows immediately after submit) */}
            <View className="mt-6">
              <Text className="text-white text-lg font-bold mb-3">User Reviews</Text>

              {reviews.length === 0 ? (
                <Text className="text-gray-400">No reviews yet. Be the first to review!</Text>
              ) : (
                reviews.map((r) => (
                  <View key={r.id} className="mb-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-white font-semibold">{r.name}</Text>
                      <View className="flex-row items-center">
                        <Ionicons name="star" size={14} color="#FBBF24" />
                        <Text className="text-white ml-1 text-sm font-semibold">{r.rating}{r.rating % 1 === 0 ? '.0' : ''}</Text>
                      </View>
                    </View>
                    <Text className="text-gray-300 text-sm">{r.text}</Text>
                  </View>
                ))
              )}
            </View>

          </View>

        </Animated.View>
      </ScrollView>

      {/* Review Bottom Sheet */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: height * 0.75,
            backgroundColor: '#1F2937',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 20,
          },
          reviewSheetAnimStyle,
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
          keyboardVerticalOffset={0}
        >
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="p-6">
              {/* Sheet Handle */}
              <View className="items-center mb-4">
                <View className="w-12 h-1 bg-gray-600 rounded-full" />
              </View>

              {/* Sheet Header */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-white text-xl font-bold">Write a Review</Text>
                <TouchableOpacity
                  onPress={handleCloseReviewSheet}
                  className="p-2"
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Star Rating */}
              <View className="mb-6">
                <Text className="text-gray-300 text-base mb-3 font-semibold">Your Rating</Text>
                <View className="flex-row space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      activeOpacity={0.7}
                      className="p-1"
                    >
                      <Ionicons
                        name={star <= rating ? "star" : "star-outline"}
                        size={36}
                        color={star <= rating ? "#FBBF24" : "#6B7280"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                {rating > 0 && (
                  <Text className="text-gray-400 text-sm mt-2">
                    {rating} {rating === 1 ? 'star' : 'stars'}
                  </Text>
                )}
              </View>

              {/* Review Text Input */}
              <View className="mb-6">
                <Text className="text-gray-300 text-base mb-3 font-semibold">Your Review</Text>
                <TextInput
                  className="bg-gray-800 p-4 rounded-lg text-white text-base border border-gray-700"
                  style={{
                    minHeight: 150,
                    textAlignVertical: 'top',
                  }}
                  placeholder="Share your thoughts about this movie..."
                  placeholderTextColor="#6B7280"
                  multiline
                  numberOfLines={8}
                  value={reviewText}
                  onChangeText={setReviewText}
                  maxLength={500}
                />
                <Text className="text-gray-500 text-xs mt-2 text-right">
                  {reviewText.length}/500 characters
                </Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmitReview}
                className="bg-[#C4E538] py-4 rounded-lg mb-4"
                activeOpacity={0.8}
                disabled={!rating || !reviewText.trim()}
                style={{
                  opacity: !rating || !reviewText.trim() ? 0.5 : 1,
                }}
              >
                <Text className="text-black font-bold text-center text-base">
                  Submit Review
                </Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                onPress={handleCloseReviewSheet}
                className="bg-gray-800 py-4 rounded-lg border border-gray-700"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-center text-base">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

MovieDetail.sharedElements = (route: any) => {
  const movie = route.params.movie ? JSON.parse(route.params.movie) : null;
  if (!movie) return [];

  return [
    {
      id: `item.${movie.id}.poster`,
      animation: 'move',
      resize: 'clip',
    },
    {
      id: `item.${movie.id}.title`,
      animation: 'fade',
    },
  ];
};