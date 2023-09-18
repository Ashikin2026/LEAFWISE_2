import * as ImagePicker from 'expo-image-picker';                           // library for uploading picture
import { MaterialCommunityIcons } from '@expo/vector-icons';                // library for icons in UI
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import db from '../db/firestore';
import { db, firebase } from '../config';
import {  ref, set } from 'firebase/database';
import * as FileSystem from 'expo-file-system';

function DatabasePreviewScreen() {
  /*
  const navigation                                  = useNavigation();
  const [showButtons, setShowButtons]               = useState(false);

  const [ dummys, setDummy ] = useState({
    id: useState(null),
    username: useState(null),
    createdAt: useState(null),
  });

  useEffect(() => {
    db.collection('dummies')
        .get()
        .then(result => result.docs)
        .then(docs => docs.map(doc => ({
            id: doc.id,
            username: doc.data().username,
            createdAt: doc.data().createdAt
        })))
        .then(task => setDummy(dummys))
  }, [])

  // RENDERING of HomeScreen:
  // Top 80% : info and user guide
  // Bottom 20% : Start, UploadPicture and TakePicture buttons ribbon
  return (
    <View style={styles.CONTAINER}>
      {
        dummys?.map(dummie =>
            <View style={styles.INFO_CONTAINER}>
                <Text style={styles.info_subtitle}>{dummys.username}</Text>
                <Text style={styles.info_subtitle}>{dummys.createdAt}</Text>
            </View>
        )
      }
    </View>
  );
  */



  const [ title, setTitle ] = useState('')
  const [ body, setBody ]   = useState('')

  //function to add data to firebase realtime db
  const dataAddOn = () => {
    set(ref(db, 'posts/' + title), {
      title: title,
      body:body,
    })
    setTitle('')
    setBody('')
  }

  const [ image, setImage ] = useState(null);
  const [ uploading, setUploading ] = useState(false);

  const pickImage = async () => {
    //no permission request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  //upload media files
  const uploadMedia = async () => {
    setUploading(true);

    try {
      const { uri } = await FileSystem.getInfoAsync(image);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError('Network request failed'));
        }
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      const filename = image.substring(image.lastIndexOf('/') + 1);
      const ref = firebase.storage().ref().child(filename);

      await ref.put(blob);
      setUploading(false);
      Alert.alert('Photo Uploaded !!!');
      setImage(null);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  }



  return(
    <View style={styles.INFO_CONTAINER}>
      <Text>AddData</Text>
      <TextInput
        placeholder='Title'
        value={title}
        onChangeText={(text) => setTitle(text)}
        style={styles.input}
      />
      <TextInput
        placeholder='Body'
        value={body}
        onChangeText={(text) => setBody(text)}
        style={styles.input}
      />
      <Button
        title='Add Data'
        onPress={dataAddOn}
      />
      <Text>Upload Media File</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.button_text}>Pick an Image</Text>
      </TouchableOpacity>
      <View style={styles.PICTURE_CONTAINER}>
        {image && <Image
          source={{uri: image}}
          style={{width: 300, height: 300}}
        />}
        <TouchableOpacity style={styles.button} onPress={uploadMedia}>
          <Text style={styles.button_text}>Upload Image</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default DatabasePreviewScreen


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
  PICTURE_CONTAINER: {
    //backgroundColor     : 'blue',
    height              : '40%',
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
