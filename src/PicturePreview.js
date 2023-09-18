import { MaterialCommunityIcons } from '@expo/vector-icons';        // library for icons in UI
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function PicturePreviewScreen({ route }) {
  const navigation                                  = useNavigation();
  const [loadingPage, setLoadingPage]               = useState(false);
  const image                                       = route.params.image;
  const base64data                                  = route.params.base64data;
  // const locationData                                  = route.params.locationData;
  // const weatherData                                  = route.params.weatherData;

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
        navigation.navigate("AnalysisResult", { image: image, apiresult: bestLabel/*, locationData: locationData, weatherData: weatherData*/})
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

export default PicturePreviewScreen

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
  PICTURE_CONTAINER: {
    flex                : 2,
    height              : '100%',
    width               : '100%',
    alignItems          : 'center',
    backgroundColor     : 'white',
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