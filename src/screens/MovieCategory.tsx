import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { API_ACCESS_TOKEN } from '@env';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { Movie } from '../types/app';
import { SearchStackParamList } from '../navigations/SearchStackNavigation';

interface MovieCategoryProps {
  route: { params: { categoryId: number, categoryName: string } };
}

const MovieCategory = ({ route }: MovieCategoryProps): JSX.Element => {
  const { categoryId, categoryName } = route.params;
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList>>();

  useEffect(() => {
    fetchMoviesByCategory();
  }, []);

  const fetchMoviesByCategory = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${categoryId}`, {
        headers: {
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMovies(data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies by category:', error);
      setLoading(false);
    }
  };

  const handleMoviePress = (id: number) => {
    navigation.navigate('MovieDetail', { id });
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      onPress={() => handleMoviePress(item.id)}
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

  const keyExtractor = (item: Movie) => `${item.id}`;

  const flatListKey = useMemo(() => {
    return `category_${categoryId}`;
  }, [categoryId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#DC143C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.redLabel}></View>
        <Text style={styles.categoryTitle}>Genre of {categoryName}</Text>
      </View>
      <FlatList
        key={flatListKey}
        data={movies}
        keyExtractor={keyExtractor}
        renderItem={renderMovieItem}
        numColumns={3} 
        contentContainerStyle={styles.movieList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  movieList: {
    flexGrow: 1,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    color: 'yellow',
    marginLeft: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 6,
  },
  redLabel: {
    width: 20,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DC143C',
    marginRight: 12,
  },
});

export default MovieCategory;
