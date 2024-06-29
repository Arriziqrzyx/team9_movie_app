import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import KeywordSearch from '../components/search/KeywordSearch';
import CategorySearch from '../components/search/CategorySearch';

const { width } = Dimensions.get('window');

const Search = (): JSX.Element => {
  const [selectedBar, setSelectedBar] = useState<string>('keyword');
  const animation = useRef(new Animated.Value(0)).current;

  const handleSwitch = (bar: string, index: number) => {
    setSelectedBar(bar);
    Animated.timing(animation, {
      toValue: index * (width / 2),
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const interpolatedTranslateX = animation.interpolate({
    inputRange: [0, width / 2],
    outputRange: [0, width / 2], // Menggunakan nilai numerik
  });

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.topBarContainer}>
          <Animated.View
            style={[
              styles.animatedBackground,
              { transform: [{ translateX: interpolatedTranslateX }] },
            ]}
          />
          {['keyword', 'category'].map((item: string, index: number) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.9}
              style={styles.topBar}
              onPress={() => handleSwitch(item, index)}
            >
              <Text
                style={{
                  ...styles.topBarLabel,
                  color: item === selectedBar ? 'white' : '#e5e5e5',
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedBar === 'keyword' ? <KeywordSearch /> : <CategorySearch />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  topBarContainer: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
    backgroundColor: '#ff6685',
    borderRadius: 50,
    overflow: 'hidden',
  },
  animatedBackground: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: '#DC143C',
    borderRadius: 50,
    zIndex: -1,
  },
  topBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    zIndex: 1,
  },
  topBarLabel: {
    fontSize: 20,
    fontWeight: '400',
    textTransform: 'capitalize',
    paddingHorizontal: 20,
  },
});

export default Search;
