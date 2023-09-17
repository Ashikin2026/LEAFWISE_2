import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraType } from 'expo-camera';

export default function App() {

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef                       = useRef(null);

  const [image, setImage]                           = useState(null);
  const [base64data, setBase64Data]                 = useState(null);
  const [showButtons, setShowButtons]               = useState(false);
  const [showCameraPreview, setShowCameraPreview]   = useState(false);
  const [showPicturePreview, setShowPicturePreview] = useState(false);
  const [showResult, setShowResult]                = useState(false);

  const fetch       = require("node-fetch");
  const { Buffer }  = require('buffer');
  
  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleStartPress = () => {
    console.log("[LOG] Function: handleStartPress");
    setShowButtons(true);
  };

  const handleUploadPress = async () => {
    console.log("[LOG] Function: handleUploadPress");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Image,
      quality: 1,
    });

    // Fetch the image and convert to base64
    await fetch(result.assets[0].uri)
      .then((response) => response.blob())
      .then((blob) => {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          setBase64Data(reader.result);
          console.log("[LOG] Image converted to base64 format");
        };
      })
      .catch((error) => console.error("Error: ", error));

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setShowCameraPreview(false);
      setShowPicturePreview(true);
      console.log("[LOG] Image URL: ",result.assets[0].uri);
    }
  };
  
  const handleCameraPress = async () => {
    console.log("[LOG] Function: handleCameraPress");
    setShowCameraPreview(true);
    setShowButtons(false);
  };

  const handleTakePicturePress = async () => {
    console.log("[LOG] Function: handleTakePicturePress");

    let base64data    = null;

    if (cameraRef.current) {
      const options = { quality: 1, base64: false };
      const result = await cameraRef.current.takePictureAsync(options);
      console.log("[LOG] Photo URL: ", result.uri);
  
      // Fetch the image and convert to base64
      await fetch(result.uri)
        .then((response) => response.blob())
        .then((blob) => {
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            setBase64Data(reader.result);
            console.log("[LOG] Photo converted to base64 format");
          };
        })
        .catch((error) => console.error("Error: ", error));

      setImage(result.uri);
      setShowCameraPreview(false);
      setShowPicturePreview(true);
    }
  };

  const handleSendPictureButtonPress = async () => {
    console.log("[LOG] Function: handleSendPictureButtonPress");

    // Define all variables needed for Ximilar API
    const taskId = "bf1ecfa8-0ad8-4538-9d6a-c2d0834adb26";
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
    console.log("[LOG] API Message: ", data.records[0]);
  
    // Make the API request
    fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((results) => {
        console.log("[LOG] API Result: ", results);
    
        // Print out all the probability of diff category
        results.records[1].labels.forEach((label) => {
          console.log(`${label.name}: ${label.prob.toFixed(2)}`);
        });
    
        // Print out the result with highest probabilities
        const bestLabel = results.records[1].best_label;
        console.log(`${bestLabel.name}: ${bestLabel.prob.toFixed(2)}`);
      })
      .catch((error) => console.error("[LOG] Error: ", error));
  }

  const renderBottomContent = () => {
    if (showButtons) {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleUploadPress}>
            <MaterialCommunityIcons name="upload" size={40} color="white" />
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCameraPress}>
            <MaterialCommunityIcons name="camera" size={40} color="white" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleStartPress}>
            <MaterialCommunityIcons name="rocket" size={40} color="white" />
            <Text style={styles.buttonText}>Start Analysing</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  if (showCameraPreview) {
    return (
      <View style={styles.cameraPreviewContainer}>
        <Camera style={StyleSheet.absoluteFillObject} type={Camera.Constants.Type.back} ref={cameraRef}>
          <View style={styles.cameraOverlay} />
        </Camera>
        <TouchableOpacity style={styles.takePictureButton} onPress={handleTakePicturePress}>
          <MaterialCommunityIcons name="camera-iris" size={40} color="white" />
        </TouchableOpacity>
      </View>
    );
  } else if (showPicturePreview) {
    return (
      <View style={styles.picturecontainer}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TouchableOpacity style={styles.sendPictureButton} onPress={handleSendPictureButtonPress}>
          <MaterialCommunityIcons name="camera-iris" size={40} color="white" />
          <Text style={styles.buttonText}>Analyse Picture</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (showResult) {
    return (
      <View style={styles.picturecontainer}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TouchableOpacity style={styles.sendPictureButton} onPress={handleSendPictureButtonPress}>
          <MaterialCommunityIcons name="camera-iris" size={40} color="white" />
          <Text style={styles.buttonText}>Analyse Picture</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Leafwise</Text>
          <Text style={styles.infoSeparator}>-----------------------------------</Text>
          <Text style={styles.infoSubTitle}>An app to identify durian tree disease through image analysis.</Text>
          <Text style={styles.infoText}>How to use:</Text>
          <Text style={styles.infoText}>1. Take a picture of the durian leaf that you want to analyze.</Text>
          <Text style={styles.infoText}>2. Wait for the app to identify any diseases present.</Text>
        </View>
        {renderBottomContent()}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex                : 1,
    alignItems          : 'center',
    justifyContent      : 'center',
    backgroundColor     : '#000000',
  },
  picturecontainer: {
    flex                : 1,
    alignItems          : 'center',
    justifyContent      : 'center',
    backgroundColor     : 'black',
  },
  infoContainer: {
    flex                : 1,
    margin              : 30,
    alignItems          : 'center',
    justifyContent      : 'center',
  },
  infoTitle: {
    color               : '#FFFFFF',
    fontSize            : 50,
    fontWeight          : 'bold'
  },
  infoSeparator: {
    color               : '#FFFFFF',
    fontSize            : 25,
  },
  infoSubTitle: {
    color               : '#FFFFFF',
    fontSize            : 20,
    textAlign           : 'center',
    fontWeight          : 'normal',
    marginBottom        : 100,
  },
  infoText: {
    color               : '#FFFFFF',
    fontSize            : 15,
    textAlign           : 'center',
    fontWeight          : 'normal',
    marginVertical      : 1,
  },
  buttonContainer: {
    flex                : 1,
    margin              : 0,
    flexDirection       : 'row',
    justifyContent      : 'space-evenly',
    alignItems          : 'center',
    height              : 80,
    width               : '100%',
    position            : 'absolute',
    bottom              : 0,
    left                : 0,
    right               : 0,
    backgroundColor     : 'green',
  },
  button: {
    alignItems          : 'center',
    justifyContent      : 'center',
  },
  buttonText: {
    color               : 'white',
    fontSize            : 16,
    fontWeight          : 'bold',
    textAlign           : 'center',
  },  
  cameraPreviewContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  cameraOverlay: {
    backgroundColor     : 'transparent',
    flexDirection       : 'row',
  },
  cameraButtonContainer: {
    backgroundColor     : 'transparent',
    flexDirection       : 'row',
    justifyContent      : 'center',
  },
  sendPictureButton: {
    alignItems          : 'center',
    justifyContent      : 'center',
  },
  takePictureButton: {
    marginTop           : '195%',
    alignItems          : 'center',
    justifyContent      : 'center',
    backgroundColor     : 'transparent',
  },
  image: {
    flex:1,
    width               : "100%", 
    height              : "100%", 
    resizeMode          : 'contain',
  },
});
