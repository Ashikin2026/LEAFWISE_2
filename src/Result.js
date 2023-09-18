import { MaterialCommunityIcons } from '@expo/vector-icons';        // library for icons in UI
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, firebase } from '../config';
import {  ref, set } from 'firebase/database';
import * as FileSystem from 'expo-file-system';

function ResultScreen({ route }) {
  const navigation                                  = useNavigation();
  const image                                       = route.params.image;
  const apiresult                                   = route.params.apiresult;
  // const locationData                                  = route.params.locationData;
  // const weatherData                                  = route.params.weatherData;
  var   leafwise_solution                           = "pending"
  const [ uploading, setUploading ]                 = useState(false);
  var timestamp                                     = new Date().getHours() +':' + new Date().getMinutes() +', ' + new Date().getDate() +'/'+ new Date().getMonth() +'/'+ new Date().getFullYear();

  //function to add data to firebase realtime db
  const dataAddOn = () => {
    set(ref(db, 'posts/' + timestamp), {
      image: image,
      disease:apiresult.name,
      probability:(apiresult.prob.toFixed(3))*100,
      // locationData: locationData,
      // weatherData: weatherData
    })
  }

  //upload media files
  const uploadMedia = async () => {
    setUploading(true);

    try {
      //get information about the media file
      const { uri } = await FileSystem.getInfoAsync(image);
      //creating a Blob (Binary Large Object) from the media file.
      //It does this by making a network request to the file's URI
      //and resolving a promise when the request is successful, returning the Blob.
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError('[LOG] Network request failed'));
        }
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
      // extracts the filename from the full path stored in the image variable
      const filename = image.substring(image.lastIndexOf('/') + 1);
      // sets up a reference to the Firebase Storage location where the file will be stored
      const ref = firebase.storage().ref().child(filename);

      // uploads the Blob to the Firebase Storage reference
      await ref.put(blob);
      setUploading(false);
      Alert.alert('Photo Uploaded !!!');
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  }

  console.log("[LOG] Preview Image URL: ", image);  // DEBUG LOGGING

  // HANDLING when Home button is pressed, always waiting
  const handleHomePress = () => {
    dataAddOn();
    uploadMedia();
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
        <Text style={styles.result_text}>{(apiresult.prob.toFixed(3))*100}%</Text>
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

export default ResultScreen

const styles = StyleSheet.create({

  // Style for containers
  CONTAINER: {
    flex                : 1,
    backgroundColor     : 'white',
    justifyContent      : 'space-evenly',
  },
  RESULT_CONTAINER: {
    margin              : 20,
    //backgroundColor     : 'blue',
    height              : '40%',
    alignItems          : 'center',
    justifyContent      : 'center',
  },
  BUTTON_CONTAINER: {
    flexDirection       : 'row',
    justifyContent      : 'space-evenly',
    alignItems          : 'center',
    height              : 90,
    width               : '100%',
    backgroundColor     : 'black',
  },
  PICTURE_CONTAINER: {
    //backgroundColor     : 'blue',
    height              : '40%',
    width               : '100%',
    alignItems          : 'center',
    justifyContent      : 'center',
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
  image: {
    flex:1,
    width               : "100%",
    height              : "100%",
    resizeMode          : 'contain',
  },
});