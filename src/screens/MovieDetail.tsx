import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type HomeStackParamList = {
  Home: undefined
  MovieDetail: undefined
}

type MovieDetailScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'MovieDetail'
>

export default function MovieDetail(): JSX.Element {
  const navigation = useNavigation<MovieDetailScreenNavigationProp>()

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Movie Detail</Text>
      <Button
        title="Go back to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
})