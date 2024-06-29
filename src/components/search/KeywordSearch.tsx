import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, StackActions } from '@react-navigation/native';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

const KeywordSearch = (): JSX.Element => {
  const [keyword, setKeyword] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = async (): Promise<void> => {
    if (keyword.trim() === '') {
      setMovies([]);
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${API_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (text: string) => {
    setKeyword(text);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (text.trim() === '') {
      setMovies([]);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      handleSubmit();
    }, 1000);
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

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Keyword"
          value={keyword}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSubmit}>
          <FontAwesome name="search" size={24} color="#888" style={styles.searchIcon} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#DC143C" />
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          numColumns={3}
          columnWrapperStyle={styles.movieGrid}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#dbdbdb',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 16,
  },
  loader: {
    marginTop: 20,
    justifyContent: 'center',
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
  movieGrid: {
    justifyContent: 'flex-start',
  },
  flatListContent: {
    paddingBottom: 350,
  },
});

export default KeywordSearch;
