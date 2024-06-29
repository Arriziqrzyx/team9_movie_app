import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, StackActions, useNavigation } from '@react-navigation/native';
import type { Movie } from '../types/app';
import { API_ACCESS_TOKEN } from '@env';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Favorite = (): JSX.Element => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const renderMovieItem = ({ item }: { item: Movie }) => {
    const pushAction = StackActions.push('MovieDetail', { id: item.id });

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(pushAction);
        }}
        style={styles.movieItem}
      >
        <ImageBackground
          resizeMode="cover"
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
          source={{
            uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
          }}
        >
          <LinearGradient
            colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
            locations={[0.6, 0.8]}
            style={styles.gradientStyle}
          >
            <Text style={styles.movieTitle}>{item.title}</Text>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="yellow" />
              <Text style={styles.rating}>{item.vote_average.toFixed(1)}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#DC143C" style={{ transform: [{ scale: 2 }] }}/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.redLabel}></View>
        <Text style={styles.header}>Favorite Movies</Text>
      </View>
      {favoriteMovies.length > 0 ? (
        <FlatList
          data={favoriteMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          numColumns={3}
          columnWrapperStyle={styles.movieGrid}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <Text style={styles.emptyMessage}>No favorite movies found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginVertical: 310,
  },
  movieGrid: {
    justifyContent: 'flex-start',
    paddingLeft: 4,
  },
  flatListContent: {
    paddingBottom: 80,
  },
  movieItem: {
    flex: 1,
    margin: 4,
    maxWidth: '31%',
    flexBasis: '31%',
  },
  backgroundImage: {
    width: '100%',
    height: 180,
    marginBottom: 4,
  },
  backgroundImageStyle: {
    borderRadius: 8,
  },
  gradientStyle: {
    padding: 8,
    height: '100%',
    width: '100%',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  movieTitle: {
    color: 'white',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    color: 'yellow',
    fontWeight: '700',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 6,
  },
  header: {
    fontSize: 20,
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
