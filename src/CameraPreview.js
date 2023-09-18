import { Camera } from 'expo-camera';                               // library for phone camera usage
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';        // library for icons in UI
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button, Alert } from 'react-native';

function CameraPreviewScreen() {
  const navigation                                  = useNavigation();
  const [permission, requestPermission]             = Camera.useCameraPermissions();
  const cameraRef                                   = useRef(null);

  const[locationData, setLocationData] = useState({
    latitude: useState(null),
    longitude: useState(null),
    country: useState(null),
    country_code: useState(null),
    district: useState(null),
    postcode: useState(null),
    state: useState(null),
    town: useState(null),
  });
  const [weatherData, setWeatherData] = useState({
    place: useState(null),
    visibility: useState(null),
    weather: useState(null),
    temp: useState(null),
    humidity: useState(null),
    feels_like: useState(null),
    wind_speed: useState(null),
    sunrise: useState(null),
    sunset: useState(null),
  });
  const [loaded, setLoaded] = useState(false);
  const API_KEYS = 'fcb3f5b17a20b57d5216e9b01692b2ff'

  //contry, district, lat, long, state, postcode
  //Permission to get user location
  const userLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    //If access denied, still can use the app
    if (status !== 'granted'){
      setErrorMsg('Permission to access the location was denied.');
    }
    //If access granted, fetch current coordinate
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    //Getting location detail of passed coordinates using geocoding API
    const url = `https://nominatim.openstreetmap.org//reverse?format=json&lat=${location.coords.latitude}&lon=${location.coords.longitude}`;
    fetch(url).then(res => res.json()).then(data => {
      //console.log(data.address);
      setLocationData({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        country: data.address.country,
        country_code: data.address.country_code,
        district: data.address.district,
        postcode: data.address.postcode,
        state: data.address.state,
        town: data.address.town,   //sometimes the town is not detected
      });
      fetchWeatherData(location.coords.latitude, location.coords.longitude)
    }).catch(() => {
      console.log("[LOG] Error fetching data from API");
    });
    console.log("[LOG] Location : ", locationData);
  }

  //add a function to fetch the weather data
  const fetchWeatherData = async (latitude, longitude) => {
    try {
      setLoaded(false);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEYS}`);
      if (response.status == 200){
        const data = await response.json();

        //convert Kelvin to Celcius for temp
        temp_in_Celcius = Math.round(data['main']['temp']-273.15)
        //convert Kelvin to Celcius for feels_like
        feels_like_in_Celcius = Math.round(data['main']['feels_like']-273.15)
        //convert m to km for visibility (max_visibility = 10km)
        visibility_in_km = data['visibility']/1000
        //convert seconds to H:M:S for sunrise (AM)
        sunrise_in_Day_HMS = new Date(data['sys']['sunrise']*1000).toLocaleString()
        sunrise_split = sunrise_in_Day_HMS.split(" ")
        sunrise_in_HMS = sunrise_split[1]
        //convert seconds to H:M:S for sunset (PM)
        sunset_in_Day_HMS = new Date(data['sys']['sunset']*1000).toLocaleString()
        sunset_split = sunset_in_Day_HMS.split(" ")
        sunset_in_HMS = sunset_split[1]

        setWeatherData({
          place: data.name,
          visibility: visibility_in_km,
          weather: data['weather'][0]['description'],
          temp: temp_in_Celcius,
          humidity: data['main']['humidity'],
          feels_like: feels_like_in_Celcius,
          wind_speed: data['wind']['speed'],
          sunrise: sunrise_in_HMS,
          sunset: sunset_in_HMS,
          //temp, humidity, weather, UV,
        });
        console.log("[LOG] Weather : ", weatherData)
      }
      else {
          setWeatherData(null);
      }
      setLoaded(true);

    } catch(error) {
        Alert.alert('Error', error.message)
    }
}

  //Remember state change,
  useEffect(() => {
    userLocation();
  }, [])

  // Camera permissions are still loading
  if (!permission) {
    return <View />;
  }

  // Camera permissions are not granted yet
  if (!permission.granted) {
    return (
      <View style={styles.CONTAINER}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  // HANDLING when camera take picture button is pressed, always waiting
  async function handleTakePicturePress() {
    userLocation();
    console.log("[LOG] Function: handleTakePicturePress");           // DEBUG LOGGING

    if (cameraRef.current) {
      const options = { allowsEditing: true, aspect: [1, 1], quality: 0.25, base64: true };
      const result = await cameraRef.current.takePictureAsync(options);
      console.log("[LOG] Photo URL: ", result.uri); // DEBUG LOGGING

      // Fetch the captured image and convert to base64 format
      await fetch(result.uri)
        .then((response) => response.blob())
        .then((blob) => {
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            console.log("[LOG] Photo converted to base64 format");  // DEBUG LOGGING
            // NAVIGATE to PicturePreviewScreen with images data variables
            navigation.navigate('PicturePreview', { image: result.uri, base64data: reader.result /*,locationData: locationData.latitude, weatherData: weatherData.temp*/});
          };
        })
        .catch((error) => console.error("Error: ", error));         // DEBUG LOGGING
      console.log("[LOG] Image URL: ", result.uri);                 // DEBUG LOGGING
    }
  }

  // RENDERING of CameraPreviewScreen:
  // Top 80% : Real time camera preview
  // Bottom 20% : Take picture button
  return (
    <View style={styles.CONTAINER}>
      <View style={styles.CAMERA_VIEW_CONTAINER}>
        <Camera style={StyleSheet.absoluteFill} type={Camera.Constants.Type.back} ref={cameraRef}>
          <View style={styles.cameraOverlay} />
        </Camera>
      </View>
      <View style={styles.BUTTON_CONTAINER}>
        <TouchableOpacity style={styles.button} onPress={handleTakePicturePress}>
          <MaterialCommunityIcons name="camera-iris" size={40} color="green" />
          <Text style={styles.button_text}>TAKE PHOTO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CameraPreviewScreen

const styles = StyleSheet.create({
  // Style for containers
  CONTAINER: {
    flex                : 1,
    backgroundColor     : 'white',
    justifyContent      : 'space-evenly',
  },
  BUTTON_CONTAINER: {
    flex                : 0,
    flexDirection       : 'row',
    justifyContent      : 'space-evenly',
    alignItems          : 'center',
    height              : 90,
    width               : '100%',
    backgroundColor     : 'black',
  },
  CAMERA_VIEW_CONTAINER: {
    flex                : 1,
    height              : '100%',
    width               : '100%',
    alignItems          : 'center',
    justifyContent      : 'center',
  },

  // Style of buttons components
  button: {
    alignItems          : 'center',
    justifyContent      : 'center',
  },
  button_text: {
    color               : 'green',
    fontSize            : 18,
    fontWeight          : 'bold',
    textAlign           : 'center',
  },

  // Style of camera and images components
  cameraOverlay: {
    backgroundColor     : 'transparent',
    flexDirection       : 'row',
    width               : "100%",
    height              : "100%",
  },
  image: {
    flex:1,
    width               : "100%",
    height              : "100%",
    resizeMode          : 'contain',
  },
});
