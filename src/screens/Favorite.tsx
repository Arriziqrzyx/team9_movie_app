import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import type { Movie } from '../types/app';
import MovieItem from '../components/movies/MovieItem';
import { API_ACCESS_TOKEN } from '@env';

const Favorite = (): JSX.Element => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchFavoriteMovies();
    }
  }, [isFocused]);

  const fetchFavoriteMovies = async (): Promise<void> => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favoriteMovies');
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        const movies: Movie[] = [];

        for (const id of favoriteIds) {
          const movie = await fetchMovieDetail(id);
          if (movie) {
            movies.push(movie);
          }
        }

        setFavoriteMovies(movies);
      }
    } catch (error) {
      console.log('Error fetching favorite movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetail = async (id: string): Promise<Movie | null> => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${id}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        },
      };

      const response = await fetch(url, options);
      const movie = await response.json();
      return movie;
    } catch (error) {
      console.log('Error fetching movie detail:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.redLabel}></View>
        <Text style={styles.header}>Favorite Movies</Text>
      </View>
      {favoriteMovies.length > 0 ? (
        <View style={[
          styles.movieGrid,
          favoriteMovies.length < 3 ? styles.movieGridLeft : null
        ]}>
          {favoriteMovies.map((movie) => (
            <MovieItem
              key={movie.id}
              movie={movie}
              size={{ width: 120, height: 180 }}
              coverType="poster"
            />
          ))}
        </View>
      ) : (
        <Text style={styles.emptyMessage}>No favorite movies found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: 'gray',
  },
  movieGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    rowGap: 8,
    marginLeft: 15,
  },
  movieGridLeft: {
    justifyContent: 'flex-start',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '900',
  },
  redLabel: {
    width: 20,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DC143C',
    marginRight: 12,
  },
});

export default Favorite;
