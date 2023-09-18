import * as ImagePicker from 'expo-image-picker';                           // library for uploading picture
import { MaterialCommunityIcons } from '@expo/vector-icons';                // library for icons in UI
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function HomeScreen() {
  const navigation                                  = useNavigation();
  const [showButtons, setShowButtons]               = useState(false);
  const [isAdmin, setIsAdmin]                       = useState(true);


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

  const handleDatabasePress = async () => {
    console.log("[LOG] Function: handleCameraPress"); // DEBUG LOGGING
    // NAVIGATE to CameraPrevieScreen
    navigation.navigate('DatabasePreviewScreen');
  };

  // RENDERING different buttons before and after Start button is pressed
  // Before press, Start button is displayed in the button container
  // After press, UploadPicture and TakePicture buttons are displayed in the button container
  // Icons of each buttons came from the MaterialCommunityIcons library and being customised
  const changeButtons = () => {
    if (isAdmin) {
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

            <TouchableOpacity style={styles.button} onPress={handleDatabasePress}>
              <MaterialCommunityIcons name="database-edit" size={40} color="green" />
              <Text style={styles.button_text}>Database</Text>
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
    } else {
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

export default HomeScreen


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
  BUTTON_CONTAINER: {
    flex                : 0,
    flexDirection       : 'row',
    justifyContent      : 'space-evenly',
    alignItems          : 'center',
    height              : 90,
    width               : '100%',
    backgroundColor     : 'black',
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
});
