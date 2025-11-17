
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cards from '../../components/Cards';



export default function Home({
      movies,
      trendingMovies,
      popularMovies,
      loading,
      error,
      onLoadMore,
      onRefresh,
       page,
      setPage,
      setLoading,
      handleRefresh
}) {

  const [movieLoading, setMovieLoading] = useState(false);
  const [trendLoading, setTrendLoading] = useState(false);


  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <LinearGradient
        colors={[Colors.homeGradientStart, Colors.homeGradientEnd]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1"
      >
        <StatusBar barStyle="light-content" />
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={!!loading}
              onRefresh={handleRefresh}
              tintColor="transparent"
              colors={["transparent"]}
              progressViewOffset={Platform.OS === 'ios' ? 50 : 50}
            />
          }
        >


          {/* Primary/Featured Section - Larger cards */}
          <Cards 
            data={movies} 
            title=""
            primary={true}
            onLoadMore={onLoadMore}
            isLoading={movieLoading}
            onCardPress={(item) => console.log('Movie pressed:', item.title)}
          />

          {/* Trending Section - Normal sized cards */}
          {trendingMovies ? (
          <Cards 
            data={trendingMovies} 
            title="Trending"
            primary={false}
            onLoadMore={onLoadMore}
            isLoading={trendLoading}
            onCardPress={(item) => console.log('Trending Movie pressed:', item.title)}
          />
           ) : null} 

          {/* New Releases - Normal sized cards without loading */}
          {popularMovies ? (
          <Cards 
            data={popularMovies} 
            title="Popular"
            primary={false}
             onCardPress={(item) => console.log('popular Movie pressed:', item?.name)}
          />
           ): null}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}