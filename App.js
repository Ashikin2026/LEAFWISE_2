/*
--Filename   : App.js
--App_name   : Leafwise
--Editor     : Ling Zhe Heng, Nur Ashikin Fatiyah Binti Harun
For Expo Go update,
eas update --branch preview --message "Update"

To start the app : npx expo start

Downloads :
npx expo install expo-image-picker
npx expo install expo-camera
npm i @react-navigation/stack
npx expo install expo-location
npx expo install firebase
npm install typescript --save-dev
npx expo install expo-file-system
*/

import * as Location from 'expo-location';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Button, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';        // library for icons in UI
import * as ImagePicker from 'expo-image-picker';                   // library for uploading picture
import { Camera } from 'expo-camera';                               // library for phone camera usage
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';     // library for app UI navigation customization
import HomeScreen from './src/Home'
import DatabasePreviewScreen from './src/DatabasePreview'
import CameraPreviewScreen from './src/CameraPreview'
import PicturePreviewScreen from './src/PicturePreview'
import ResultScreen from './src/Result'

const Stack = createStackNavigator();
const API_KEYS = 'fcb3f5b17a20b57d5216e9b01692b2ff'

// Four screen is created for Leafwise with the style customised and standardised
export default function App() {
/*
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
    //console.log("[LOG] Location : ", locationData);
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
        });
        //console.log("[LOG] Weather : ", weatherData)
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
*/
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerTitleStyle: { fontWeight: 'bold' }}} />
        <Stack.Screen name="DatabasePreviewScreen" component={DatabasePreviewScreen} options={{ headerTitleStyle: { fontWeight: 'bold' }}} />
        <Stack.Screen name="CameraPreview" component={CameraPreviewScreen} options={{ headerTitleStyle: { fontWeight: 'bold' }}} />
        <Stack.Screen name="PicturePreview" component={PicturePreviewScreen} options={{ headerTitleStyle: { fontWeight: 'bold' }}} />
        <Stack.Screen name="AnalysisResult" component={ResultScreen} options={{ headerTitleStyle: { fontWeight: 'bold' }}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ------------------------- Declaring function for HomeScreen -------------------------
/*
function HomeScreen() {
  const navigation                                  = useNavigation();
  const [showButtons, setShowButtons]               = useState(false);

  // HANDLING when Start button is pressed, always waiting
  // Change Start button to UploadPicture and TakePicture buttons
  const handleStartPress = async () => {
    console.log("[LOG] Function: handleStartPress"); // DEBUG LOGGING
    setShowButtons(true);
  };

  // HANDLING when UploadPicture button is pressed, always waiting
  // Open phone local storage and select picture to be uploaded, cropping is allowed
  const handleUploadPress = async () => {
    console.log("[LOG] Function: handleUploadPress"); // DEBUG LOGGING
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Image,
      allowsEditing: true,
      quality: 1,
    });

    // Fetch the uploaded image and convert to base64 format
    await fetch(result.assets[0].uri)
      .then((response) => response.blob())
      .then((blob) => {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          console.log("[LOG] Image converted to base64 format");  // DEBUG LOGGING
          // NAVIGATE to PicturePreviewScreen with images data variables
          navigation.navigate('PicturePreview', { image: result.assets[0].uri, base64data: reader.result });
        };
      })
      .catch((error) => console.error("Error: ", error));     // DEBUG LOGGING
      console.log("[LOG] Image URL: ",result.assets[0].uri);  // DEBUG LOGGING
  };

  // HANDLING when TakePicture button is pressed, always waiting
  // Go to phone camera screen to take picture
  const handleCameraPress = async () => {
    console.log("[LOG] Function: handleCameraPress"); // DEBUG LOGGING
    // NAVIGATE to CameraPrevieScreen
    navigation.navigate('CameraPreview');
  };

  // RENDERING different buttons before and after Start button is pressed
  // Before press, Start button is displayed in the button container
  // After press, UploadPicture and TakePicture buttons are displayed in the button container
  // Icons of each buttons came from the MaterialCommunityIcons library and being customised
  const changeButtons = () => {
    if (showButtons) {
      return (
        <View style={styles.BUTTON_CONTAINER}>
          <TouchableOpacity style={styles.button} onPress={handleUploadPress}>
            <MaterialCommunityIcons name="upload" size={40} color="green" />
            <Text style={styles.button_text}>Upload</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleCameraPress}>
            <MaterialCommunityIcons name="camera" size={40} color="green" />
            <Text style={styles.button_text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.BUTTON_CONTAINER}>
          <TouchableOpacity style={styles.button} onPress={handleStartPress}>
            <MaterialCommunityIcons name="rocket" size={40} color="green" />
            <Text style={styles.button_text}>Start</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  
  // RENDERING of HomeScreen:
  // Top 80% : info and user guide
  // Bottom 20% : Start, UploadPicture and TakePicture buttons ribbon
  return (
    <View style={styles.CONTAINER}>
      <View style={styles.INFO_CONTAINER}>
        <Text style={styles.info_title}>Leafwise</Text>
        <Text style={styles.info_subtitle}></Text>
        <Text style={styles.info_subtitle}>
          An app to identify durian tree disease through image analysis.
        </Text>
        <Text style={styles.info_subtitle}></Text>
        <Text style={styles.info_subtitle}></Text>
        <Text style={styles.info_text}>How to use: </Text>
        <Text style={styles.info_text}>1. Take/Upload LEAF picture of the durian tree that require analysis.</Text>
        <Text style={styles.info_text}>2. Wait for analysis result to identify any diseases if present.</Text>
      </View>
      {changeButtons()}
    </View>
  );
}
*/
// ------------------------- Declaring function for CameraPreviewScreen -------------------------
/*
function CameraPreviewScreen() {
  const navigation                                  = useNavigation();
  const [permission, requestPermission]             = Camera.useCameraPermissions();
  const cameraRef                                   = useRef(null);

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

  // HANDLING when camera taek picture button is pressed, always waiting
  async function handleTakePicturePress() {
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
            navigation.navigate('PicturePreview', { image: result.uri, base64data: reader.result });
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
*/
// ------------------------- Declaring function for PicturePreviewScreen -------------------------
/*
function PicturePreviewScreen({ route }) {
  const navigation                                  = useNavigation();
  const [loadingPage, setLoadingPage]               = useState(false);
  const image                                       = route.params.image;
  const base64data                                  = route.params.base64data;

  console.log("[LOG] Preview Image URL: ", image);            // DEBUG LOGGING

  // HANDLING when Analyse button is pressed, always waiting
  // Change Analyse button to "LOADING..." text
  const handleAnalyseButtonPress = async () => {
    console.log("[LOG] Function: handleAnalyseButtonPress");  // DEBUG LOGGING
    setLoadingPage(true);

    // Compile the message needed for Ximilar request API
    // const taskId = "bf1ecfa8-0ad8-4538-9d6a-c2d0834adb26"; // task id for premilinary work
    const taskId = "361f39e4-2ce2-42c9-9dc5-5fe459b4948d";    // task id for validation data
    const apiToken = "c35050ee0ee71e838891d5cf75b95046d0a8a73f";
    const endpoint = "https://api.ximilar.com/recognition/v2/classify/";
    const headers = {
      Authorization: `Token ${apiToken}`,
      "Content-Type": "application/json",
    };
    const data = {
      task_id: taskId,
      records: [
        { '_url'    : image },
        { '_base64' : base64data }],
    };
    console.log("[LOG] API Message: ", data.records[0]);      // DEBUG LOGGING
  
    // Make the API request
    fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((results) => {
        console.log("[LOG] API Result: ", results);                     // DEBUG LOGGING
        console.log("----------");                                
        // Print out all the probability of diff category
        results.records[1].labels.forEach((label) => { 
          console.log(`${label.name}: ${label.prob.toFixed(2)}`);       // DEBUG LOGGING
        });
        console.log("----------");                               
        // Print out the result with highest probabilities
        const bestLabel = results.records[1].best_label;
        console.log(`${bestLabel.name}: ${bestLabel.prob.toFixed(2)}`); // DEBUG LOGGING

        // NAVIGATE to AnalysisResultScreen with the Ximilar API result
        navigation.navigate("AnalysisResult", { image: image, apiresult: bestLabel})
      })
      .catch((error) => console.error("[LOG] Error: ", error));         // DEBUG LOGGING
  }

  // RENDERING the bottom ribbon before and after Analyse button is pressed
  // Before press, Analyse button is displayed in the button container
  // After press, "LOADING..." text are displayed in the button container
  const changeButtons = () => {
    if (loadingPage) {
      return (
        <View style={styles.BUTTON_CONTAINER}>
          <Text style={styles.button_text}>LOADING...</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.BUTTON_CONTAINER}>
          <TouchableOpacity style={styles.button} onPress={handleAnalyseButtonPress}>
            <MaterialCommunityIcons name="line-scan" size={40} color="green" />
            <Text style={styles.button_text}>ANALYSE</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  // RENDERING of PicturePreviewScreen:
  // Top 80% : Picture uploaded or captured
  // Bottom 20% : Analyse button or 'LOADING...' text
  return (
    <View style={styles.CONTAINER}>
      <View style={styles.PICTURE_CONTAINER}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
      {changeButtons()}
    </View>
  );
}
*/
// ------------------------- Declaring function for ResultScreen -------------------------
/*
function ResultScreen({ route }) {
  const navigation                                  = useNavigation();
  const image                                       = route.params.image;
  const apiresult                                   = route.params.apiresult;
  var   leafwise_solution                           = "pending"

  console.log("[LOG] Preview Image URL: ", image);  // DEBUG LOGGING

  // HANDLING when Home button is pressed, always waiting
  const handleHomePress = () => {
    // NAVIGATE to HomeScreen
    navigation.navigate('Home');
  };

  // Define the variable based on the diseases result matching cases
  switch (apiresult.name) {
    case "leaf_blight":
      leafwise_solution = "Reducing excessive watering and spacing plants at seedling stage; Spraying of fungicides such as Benomyl, Carbendazim, or Triadimefen.";
      break;
    case "leaf_spot":
      leafwise_solution = "Spraying of systemic fungicide such as benomyl, carbendazim and triophanate methyl as per label recommendations.";
      break;
    case "leaf_anthracnose":
      leafwise_solution = "Prune out the dead wood and destroy the infected leaves; Spraying of bordeaux mix";
      break;
    case "leaf_green_algae_rust":
      leafwise_solution = "Spraying of fungicides such as benomyl, thiophanate-methyl or carbendazim with a combination of chlorothalonil, propineb, menthiram, mancozeb and maneb";
      break;
    case "leaf_yellowing":
      leafwise_solution = "Adding compost or other organic matter to the soil; Ensure proper watering and avoiding overwatering; Prune unhealthy roots and repot the plant in well-draining soil.";
      break;
    default:
      console.log("Error"); // DEBUG LOGGING
      break;
  }

  // RENDERING of PicturePreviewScreen:
  // Top 45% : Picture uploaded or captured
  // Middle 35% : disease result, probability and suggestions to cure
  // Bottom 20% : Home button
  return (
    <View style={styles.CONTAINER}>
      <View style={styles.PICTURE_CONTAINER}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
      <View style={styles.RESULT_CONTAINER}>
        <Text style={styles.result_subtitle}>Name</Text>
        <Text style={styles.result_text}>{apiresult.name}</Text>
        <Text style={styles.result_text}></Text>
        <Text style={styles.result_subtitle}>Probability</Text>
        <Text style={styles.result_text}>{apiresult.prob.toFixed(2)}</Text>
        <Text style={styles.result_text}></Text>
        <Text style={styles.result_subtitle}>Suggestions</Text>
        <Text style={styles.result_text}>{leafwise_solution}</Text>
      </View>
      <View style={styles.BUTTON_CONTAINER}>
        <TouchableOpacity style={styles.button} onPress={handleHomePress}>
          <MaterialCommunityIcons name="home" size={40} color="green" />
          <Text style={styles.button_text}>HOME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
*/
// ------------------------------ Declaring style ------------------------------

const styles = StyleSheet.create({

  // Style for containers
  CONTAINER: {
    flex                : 1,
    backgroundColor     : 'white',
    justifyContent      : 'space-evenly',
  },
  INFO_CONTAINER: {
    flex                : 1,
    margin              : 30,
    justifyContent      : 'center',
  },
  RESULT_CONTAINER: {
    flex                : 1,
    margin              : 20,
    alignItems          : 'center',
    justifyContent      : 'center',
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
  PICTURE_CONTAINER: {
    flex                : 2,
    height              : '100%',
    width               : '100%',
    alignItems          : 'center',
    backgroundColor     : 'white',
  },

  // Style of ResultScreen components
  result_subtitle: {
    color               : 'black',
    fontSize            : 25,
    fontWeight          : 'bold',
  },
  result_text: {
    color               : 'black',
    fontSize            : 18,
    fontWeight          : 'normal',
  },

  // Style of HomeScreen components
  info_title: {
    color               : 'black',
    fontSize            : 50,
    textAlign           : 'center',
    fontWeight          : 'bold',
  },
  info_subtitle: {
    color               : 'black',
    fontSize            : 25,
    textAlign           : 'center',
    fontWeight          : 'normal',
  },
  info_text: {
    color               : 'black',
    fontSize            : 20,
    textAlign           : 'left',
    fontWeight          : 'normal',
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