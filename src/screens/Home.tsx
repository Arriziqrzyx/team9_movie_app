import React, { useState, useEffect } from 'react';
import { ScrollView, View, StatusBar, StyleSheet, ActivityIndicator } from 'react-native';
import type { MovieListProps, Movie } from '../types/app';
import { API_ACCESS_TOKEN } from '@env';
import MovieList from '../components/movies/MovieList';
import { useTheme } from '../context/ThemeContext';

const movieLists: MovieListProps[] = [
  {
    title: 'Now Playing in Theater',
    path: 'movie/now_playing?language=en-US&page=1',
    coverType: 'backdrop',
  },
  {
    title: 'Upcoming Movies',
    path: 'movie/upcoming?language=en-US&page=1',
    coverType: 'poster',
  },
  {
    title: 'Top Rated Movies',
    path: 'movie/top_rated?language=en-US&page=1',
    coverType: 'poster',
  },
  {
    title: 'Popular Movies',
    path: 'movie/popular?language=en-US&page=1',
    coverType: 'poster',
  },
];

const Home = (): JSX.Element => {
  const { isDarkMode } = useTheme();

  const [moviesData, setMoviesData] = useState<{ [key: string]: Movie[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllMovies = async (): Promise<void> => {
      const fetchPromises = movieLists.map(async (movieList) => {
        const url = `https://api.themoviedb.org/3/${movieList.path}`;
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_ACCESS_TOKEN}`,
          },
        };
        const response = await fetch(url, options);
        const data = await response.json();
        return { [movieList.title]: data.results };
      });

      try {
        const results = await Promise.all(fetchPromises);
        const movies = results.reduce((acc, result) => ({ ...acc, ...result }), {});
        setMoviesData(movies);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#DC143C" style={{ transform: [{ scale: 2 }] }} />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        {movieLists.map((movieList) => (
          <MovieList
            title={movieList.title}
            path={movieList.path}
            coverType={movieList.coverType}
            key={movieList.title}
          />
        ))}
        <StatusBar 
          barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
          backgroundColor="transparent" 
          translucent={true}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 16,
    backgroundColor: 'white',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: '#151515',
  },
});

export default Home;
