import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native'
import { API_ACCESS_TOKEN } from '@env'
import MovieList from '../components/movies/MovieList'
import type { Movie } from '../types/app'
import { FontAwesome } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigations/HomeStackNavigation';

type MovieDetailProps = NativeStackScreenProps<RootStackParamList, 'MovieDetail'>;

const MovieDetail = ({ route }: MovieDetailProps): JSX.Element => {
  const { id } = route.params
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchMovieDetail()
    checkIfFavorite()
  }, [])

  const fetchMovieDetail = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMovie(response)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
  }

  const checkIfFavorite = async (): Promise<void> => {
    try {
      const favoriteMovies = await AsyncStorage.getItem('favoriteMovies')
      if (favoriteMovies) {
        const parsedFavorites = JSON.parse(favoriteMovies)
        setIsFavorite(parsedFavorites.includes(id.toString()))
      }
    } catch (error) {
      console.log('Error checking favorites:', error)
    }
  }

  const addFavorite = async (): Promise<void> => {
    try {
      let favoriteMovies = await AsyncStorage.getItem('favoriteMovies')
      if (!favoriteMovies) {
        favoriteMovies = JSON.stringify([id.toString()])
      } else {
        const parsedFavorites = JSON.parse(favoriteMovies)
        parsedFavorites.push(id.toString())
        favoriteMovies = JSON.stringify(parsedFavorites)
      }
      await AsyncStorage.setItem('favoriteMovies', favoriteMovies)
      setIsFavorite(true)
    } catch (error) {
      console.log('Error adding to favorites:', error)
    }
  }

  const removeFavorite = async (): Promise<void> => {
    try {
      let favoriteMovies = await AsyncStorage.getItem('favoriteMovies')
      if (favoriteMovies) {
        const parsedFavorites = JSON.parse(favoriteMovies)
        const updatedFavorites = parsedFavorites.filter((movieId: string) => movieId !== id.toString())
        favoriteMovies = JSON.stringify(updatedFavorites)
        await AsyncStorage.setItem('favoriteMovies', favoriteMovies)
        setIsFavorite(false)
      }
    } catch (error) {
      console.log('Error removing from favorites:', error)
    }
  }

  const toggleFavorite = (): void => {
    if (isFavorite) {
      removeFavorite()
    } else {
      addFavorite()
    }
  }

  if (!movie) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            <Text style={styles.title}>{movie.title}</Text>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="yellow" />
              <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
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
      <Text style={styles.overview}>{movie.overview}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Original Language</Text>
          <Text style={styles.infoContent}>{movie.original_language}</Text>
          <Text style={styles.infoLabel}>Release Date</Text>
          <Text style={styles.infoContent}>{new Date(movie.release_date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Popularity</Text>
          <Text style={styles.infoContent}>{movie.popularity}</Text>
          <Text style={styles.infoLabel}>Vote Count</Text>
          <Text style={styles.infoContent}>{movie.vote_count}</Text>
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
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  overview: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoColumn: {
    flex: 1,
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoContent: {
    fontSize: 14,
    marginBottom: 8,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  listSeparator: {
    marginVertical: 10,
  },
})

export default MovieDetail
