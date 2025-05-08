import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        // Kamera izni
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(cameraStatus === 'granted');

        // Konum izni
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        if (locationStatus !== 'granted') {
          Alert.alert(
            'Konum İzni Gerekli',
            'Konum özelliklerini kullanabilmek için izin vermeniz gerekiyor.',
            [{ text: 'Tamam' }]
          );
          return;
        }

        // Konum bilgisini al
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
        setLocation(location);
      } catch (error) {
        console.error('Error:', error);
        Alert.alert(
          'Hata',
          'Bir hata oluştu. Lütfen tekrar deneyin.',
          [{ text: 'Tamam' }]
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleCameraFlip = () => {
    setCameraType(current => (
      current === CameraType.back ? CameraType.front : CameraType.back
    ));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>İzinler kontrol ediliyor...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off" size={50} color="#f4511e" />
        <Text style={styles.text}>Kamera erişimi reddedildi</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => Camera.requestCameraPermissionsAsync()}
        >
          <Text style={styles.buttonText}>İzin Ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={cameraType}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.flipButton} onPress={handleCameraFlip}>
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
      {location && (
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={20} color="white" />
          <Text style={styles.locationText}>
            {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#f4511e',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  flipButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(244, 81, 30, 0.8)',
    padding: 15,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#f4511e',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: '#f4511e',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  locationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
  },
}); 