import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import MovieList from '../components/movies/MovieList';
import type { Movie } from '../types/app';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigations/HomeStackNavigation';
import { useTheme } from '../context/ThemeContext';

type MovieDetailProps = NativeStackScreenProps<RootStackParamList, 'MovieDetail'>;

const MovieDetail = ({ route }: MovieDetailProps): JSX.Element => {
  const { id } = route.params;
  const { isDarkMode } = useTheme();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchMovieDetail();
    checkIfFavorite();
  }, []);

  const fetchMovieDetail = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMovie(response);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };

  const checkIfFavorite = async (): Promise<void> => {
    try {
      const favoriteMovies = await AsyncStorage.getItem('favoriteMovies');
      if (favoriteMovies) {
        const parsedFavorites = JSON.parse(favoriteMovies);
        setIsFavorite(parsedFavorites.includes(id.toString()));
      }
    } catch (error) {
      console.log('Error checking favorites:', error);
    }
  };

  const addFavorite = async (): Promise<void> => {
    try {
      let favoriteMovies = await AsyncStorage.getItem('favoriteMovies');
      if (!favoriteMovies) {
        favoriteMovies = JSON.stringify([id.toString()]);
      } else {
        const parsedFavorites = JSON.parse(favoriteMovies);
        parsedFavorites.push(id.toString());
        favoriteMovies = JSON.stringify(parsedFavorites);
      }
      await AsyncStorage.setItem('favoriteMovies', favoriteMovies);
      setIsFavorite(true);
    } catch (error) {
      console.log('Error adding to favorites:', error);
    }
  };

  const removeFavorite = async (): Promise<void> => {
    try {
      let favoriteMovies = await AsyncStorage.getItem('favoriteMovies');
      if (favoriteMovies) {
        const parsedFavorites = JSON.parse(favoriteMovies);
        const updatedFavorites = parsedFavorites.filter((movieId: string) => movieId !== id.toString());
        favoriteMovies = JSON.stringify(updatedFavorites);
        await AsyncStorage.setItem('favoriteMovies', favoriteMovies);
        setIsFavorite(false);
      }
    } catch (error) {
      console.log('Error removing from favorites:', error);
    }
  };

  const toggleFavorite = (): void => {
    if (isFavorite) {
      removeFavorite();
    } else {
      addFavorite();
    }
  };

  if (!movie) {
    return (
      <View style={[styles.loader, isDarkMode && styles.darkLoader]}>
        <Text style={[styles.loaderText, isDarkMode && styles.darkLoaderText]}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.posterContainer}>
        <ImageBackground
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` }}
          style={styles.poster}
        >
          <LinearGradient
            colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
            locations={[0.6, 1.0]}
            style={styles.gradientStyle}
          >
            <Text style={[styles.title, isDarkMode && styles.darkTitle]}>{movie.title}</Text>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="yellow" />
              <Text style={[styles.rating, isDarkMode && styles.darkRating]}>{movie.vote_average.toFixed(1)}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <FontAwesome
            name={isFavorite ? 'heart' : 'heart-o'}
            size={24}
            color={isFavorite ? 'red' : 'white'}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.overview, isDarkMode && styles.darkOverview]}>{movie.overview}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoColumn}>
          <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>Original Language</Text>
          <Text style={[styles.infoContent, isDarkMode && styles.darkInfoContent]}>{movie.original_language}</Text>
          <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>Release Date</Text>
          <Text style={[styles.infoContent, isDarkMode && styles.darkInfoContent]}>{new Date(movie.release_date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>Popularity</Text>
          <Text style={[styles.infoContent, isDarkMode && styles.darkInfoContent]}>{movie.popularity}</Text>
          <Text style={[styles.infoLabel, isDarkMode && styles.darkInfoLabel]}>Vote Count</Text>
          <Text style={[styles.infoContent, isDarkMode && styles.darkInfoContent]}>{movie.vote_count}</Text>
        </View>
      </View>
      <MovieList
        title="Recommended Movies"
        path={`movie/${movie.id}/recommendations`}
        coverType="poster"
      />
      <View style={styles.listSeparator}></View>
      <MovieList
        title="Popular Movies"
        path="movie/popular"
        coverType="poster"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#151515',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  darkLoader: {
    backgroundColor: '#000',
  },
  loaderText: {
    color: '#000',
  },
  darkLoaderText: {
    color: '#fff',
  },
  posterContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  gradientStyle: {
    padding: 8,
    height: '100%',
    width: '100%',
    borderRadius: 8,
    justifyContent: 'flex-end',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  darkTitle: {
    color: 'lightgray',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    color: 'yellow',
    fontWeight: '700',
    marginLeft: 4,
  },
  darkRating: {
    color: 'lightyellow',
  },
  overview: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 16,
    color: '#000',
  },
  darkOverview: {
    color: '#fff',
  },
  infoContainer: {
    width: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoColumn: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  darkInfoLabel: {
    color: '#fff',
  },
  infoContent: {
    fontSize: 14,
    marginBottom: 8,
    color: '#000',
  },
  darkInfoContent: {
    color: '#ccc',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  listSeparator: {
    marginVertical: 10,
  },
});

export default MovieDetail;
