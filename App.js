import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida.', 'Por favor, conceda a permissão para obter a localização.');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);
  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um título de filme válido.');
      return;
    }
    try {
      const apiKey = '9d686f67';
      const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do filme. Tente novamente mais tarde.');
    }
  };
  return (
    <View>
      <Text style={{ fontSize: 21, fontFamily: 'Courier New', fontWeight: 'bold', textAlign: 'center', marginTop: 40, marginBottom: 10}}>
      Cinemapa - Busca de Filmes
      </Text>
      <TextInput
        style={{ borderWidth: 1, margin: 10, padding: 7}}
        placeholder="Digite o nome do filme"
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)}
      />
      <Button title="Procurar" onPress={handleSearch} color="black" />
      
      {movieData && (
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5}}>{movieData.Title}</Text>
          <Text>{movieData.Year}</Text>
          <Text>{movieData.Runtime}{'\n'}</Text>
          
          <Text>Direção: {movieData.Director}</Text>
          <Text>Elenco: {movieData.Actors}</Text>
          <Text>Gênero: {movieData.Genre}</Text>
          <Text>País: {movieData.Country}</Text>
          <Text>Idioma: {movieData.Language}</Text>
        </View>
      )}

      {location && (
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 5, marginTop: 30 }}>Sua Localização</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <MapView
            style={{ alignSelf: 'center', width: '90%', height: 150, marginTop: 30}}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Você está aqui!"
            />
          </MapView>
        </View>
      )}
    </View>
  );
};
export default App;