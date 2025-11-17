
import Colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect } from 'expo-router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Svg, { Defs, G, Rect, Stop, LinearGradient as SvgLinearGradient, Text as SvgText } from 'react-native-svg'

const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
}

// Animated Bar Component
const AnimatedBar = ({ genre, count, maxCount, index, chartWidth, trigger }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current
  const animatedOpacity = useRef(new Animated.Value(0)).current
  
  const genreLabelWidth = 85
  const countWidth = 35
  const availableBarWidth = chartWidth - genreLabelWidth - countWidth - 20
  const targetWidth = (count / maxCount) * availableBarWidth
  const barHeight = 36
  const y = index * 52

  useEffect(() => {
    // Reset animations on trigger change (screen focus)
    animatedWidth.setValue(0)
    animatedOpacity.setValue(0)
    
    Animated.parallel([
      Animated.timing(animatedWidth, {
        toValue: targetWidth,
        duration: 800,
        delay: index * 100,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: false,
      })
    ]).start()
  }, [trigger, targetWidth, index])

  const [currentWidth, setCurrentWidth] = React.useState(0)
  const [currentOpacity, setCurrentOpacity] = React.useState(0)

  useEffect(() => {
    const widthListener = animatedWidth.addListener(({ value }) => setCurrentWidth(value))
    const opacityListener = animatedOpacity.addListener(({ value }) => setCurrentOpacity(value))
    
    return () => {
      animatedWidth.removeListener(widthListener)
      animatedOpacity.removeListener(opacityListener)
    }
  }, [])

  // Truncate long genre names
  const displayGenre = genre.length > 11 ? genre.substring(0, 9) + '..' : genre

  return (
    <G opacity={currentOpacity}>
      {/* Genre Name */}
      <SvgText
        x={5}
        y={y + barHeight / 2 + 5}
        fill="white"
        fontSize="13"
        fontWeight="500"
      >
        {displayGenre}
      </SvgText>
      
      {/* Animated Bar */}
      <Rect
        x={genreLabelWidth}
        y={y}
        width={Math.max(currentWidth, 20)}
        height={barHeight}
        fill="url(#barGradient)"
        rx={8}
      />
      
      {/* Count */}
      <SvgText
        x={genreLabelWidth + Math.max(currentWidth, 20) + 10}
        y={y + barHeight / 2 + 5}
        fill="white"
        fontSize="14"
        fontWeight="700"
      >
        {count}
      </SvgText>
    </G>
  )
}

const Profile = ({
  handleLogout,
  user,
  favorite
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const [animationTrigger, setAnimationTrigger] = useState(0)

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      setAnimationTrigger(prev => prev + 1)
    }, [])
  )

  // Calculate genre frequencies
  const genreStats = useMemo(() => {
    const genreCount = {}
    
    favorite?.forEach(movie => {
      movie.genre_ids?.forEach(genreId => {
        const genreName = GENRE_MAP[genreId] || 'Other'
        genreCount[genreName] = (genreCount[genreName] || 0) + 1
      })
    })
    
    return Object.entries(genreCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
   
  }, [favorite])

  const maxCount = Math.max(...genreStats.map(g => g.count), 1)
  const screenWidth = Dimensions.get('window').width
  const chartWidth = screenWidth - 80
  const chartHeight = genreStats.length * 52 + 20

  return (
    <LinearGradient
      colors={[Colors.profileGradientStart, Colors.profileGradientEnd]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      className="flex-1"
    >
      <View className="px-8 pt-4">
        <TouchableOpacity className="items-end mt-4" onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Avatar */}
        <Animated.View 
          style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
          className="w-full items-center mt-6"
        >
          <View className="w-24 h-24 rounded-full bg-white/10 items-center justify-center mb-4">
            <Text className="text-3xl text-white font-bold">
              {user?.name?.charAt(0).toUpperCase() || ''}
            </Text>
          </View>
          <Text className="text-xl text-white font-semibold">{user?.name || 'User'}</Text>
        </Animated.View>

        {/* Watchlist Stats */}
        <Animated.View 
          style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
          className="mt-8 bg-white/10 rounded-2xl p-6"
        >
          <Text className="text-white text-lg font-semibold mb-4">Watchlist Statistics</Text>
          
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-3xl text-white font-bold">{favorite?.length || 0}</Text>
              <Text className="text-white/70 text-sm mt-1">Total Movies</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-3xl text-white font-bold">{genreStats.length}</Text>
              <Text className="text-white/70 text-sm mt-1">Genres</Text>
            </View>
          </View>
        </Animated.View>

        {/* Genre Preferences Chart */}
        {genreStats.length > 0 && (
          <Animated.View 
            style={{ 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
            className="mt-6 bg-white/10 rounded-2xl p-6"
          >
            <Text className="text-white text-lg font-semibold mb-4">Genre Preferences</Text>
            
            <Svg width={chartWidth} height={chartHeight}>
              <Defs>
                <SvgLinearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="rgba(139, 92, 246, 0.8)" />
                  <Stop offset="100%" stopColor="rgba(236, 72, 153, 0.8)" />
                </SvgLinearGradient>
              </Defs>
              
              {genreStats.map((genre, index) => (
                <AnimatedBar
                  key={genre.name}
                  genre={genre.name}
                  count={genre.count}
                  maxCount={maxCount}
                  index={index}
                  chartWidth={chartWidth}
                  trigger={animationTrigger}  
                />
              ))}
            </Svg>
          </Animated.View>
        )}

        {/* Empty State */}
        {(!favorite || favorite.length === 0) && (
          <Animated.View 
            style={{ opacity: fadeAnim }}
            className="mt-8 bg-white/10 rounded-2xl p-8 items-center"
          >
            <Ionicons name="film-outline" size={48} color="rgba(255,255,255,0.5)" />
            <Text className="text-white/70 text-center mt-4">
              No movies in your watchlist yet.{'\n'}Start adding movies to see your preferences!
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </LinearGradient>
  )
}

export default Profile