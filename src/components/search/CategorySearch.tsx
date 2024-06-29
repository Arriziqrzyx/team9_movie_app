import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { API_ACCESS_TOKEN } from '@env';
import { SearchStackParamList } from '../../navigations/SearchStackNavigation';

interface Category {
  id: number;
  name: string;
}

const CategorySearch = (): JSX.Element => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList>>();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://api.themoviedb.org/3/genre/movie/list', {
        headers: {
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setCategories(data.genres);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleSearchPress = () => {
    if (selectedCategory) {
      navigation.navigate('MovieCategory', {
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.name,
      });
    } else {
      setErrorMessage('Please select a category before searching.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#DC143C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory?.id === category.id && styles.selectedCategoryButton,
            ]}
            onPress={() => {
              setSelectedCategory(category);
              setErrorMessage('');
            }}
          >
            <Text style={styles.categoryLabel}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearchPress}
      >
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginLeft: 6,
    alignItems: 'center',
  },
  loader: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
    rowGap: 8,
  },
  categoryButton: {
    width: '48%',
    height: 50,
    backgroundColor: '#ff6685',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategoryButton: {
    backgroundColor: '#DC143C',
  },
  categoryLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchButton: {
    marginTop: 20,
    width: '80%',
    height: 50,
    backgroundColor: '#DC143C',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'black',
    marginBottom: 16,
    fontSize: 16,
  },
});

export default CategorySearch;
