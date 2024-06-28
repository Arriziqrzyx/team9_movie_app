import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, ScrollView, ImageBackground } from 'react-native'
import { API_ACCESS_TOKEN } from '@env'
import MovieList from '../components/movies/MovieList'
import type { Movie } from '../types/app'
import { FontAwesome } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params
  const [movie, setMovie] = useState<Movie | null>(null)

  useEffect(() => {
    fetchMovieDetail()
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
        path={`movie/${id}/recommendations`}
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
    width: '100%',
    height: 200,
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
})

export default MovieDetail
