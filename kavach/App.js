import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  Image,
  TouchableOpacity
} from 'react-native'

import * as tf from '@tensorflow/tfjs';
import { fetch } from '@tensorflow/tfjs-react-native'
//Loading MobileNet Model
import * as mobilenet from '@tensorflow-models/mobilenet'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import * as jpeg from 'jpeg-js'
import * as ImagePicker from 'expo-image-picker'
// import { RNCamera } from 'react-native-camera-tflite';
// import _ from 'lodash';

class App extends React.Component {
  state = {
    isTfReady: false,
    isModelReady: false,
    //isCustomModelReady: false,
    predictions: null,
    image: null
  }

  async componentDidMount() {
    await tf.ready()
    this.setState({
      isTfReady: true
    })
    this.model = await mobilenet.load()
    //this.model = await tf.loadLayersModel('./assets/');

    this.setState({ isModelReady: true })
    //Output in Expo console
    console.log(this.state.isTfReady)
    console.log(this.state.isModelReady)

    // ask for camera permission iOS
    this.getPermissionAsync()
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
  }


  //Model Raw Image to Tensor

  imageToTensor(rawImageData) {
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0 // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]

      offset += 4
    }

    return tf.tensor3d(buffer, [height, width, 3])
  }

  classifyImage = async () => {
    try {
      const imageAssetPath = Image.resolveAssetSource(this.state.image)
      const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
      const rawImageData = await response.arrayBuffer()
      const imageTensor = this.imageToTensor(rawImageData)
      const predictions = await this.model.classify(imageTensor)
      this.setState({ predictions })
      console.log(predictions)
    } catch (error) {
      console.log(error)
    }
  }

  selectImage = async () => {
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3]
      })

      if (!response.cancelled) {
        const source = { uri: response.uri }
        this.setState({ image: source })
        this.classifyImage()
      }
    } catch (error) {
      console.log(error)
    }
  }

  renderPrediction = prediction => {
    return (
        <Text key={prediction.className} style={styles.text}>
          {prediction.className}
        </Text>
    )
  }

  render() {
    const { isTfReady, isModelReady, predictions, image } = this.state
    return (
        <View style={styles.container}>
          <StatusBar barStyle='light-content' />
          <View style={styles.loadingContainer}>
            <Text style={styles.text}>
              TFJS ready? {isTfReady ? <Text>✅</Text> : ''}
            </Text>

            <View style={styles.loadingModelContainer}>
              <Text style={styles.text}>Model ready? </Text>
              {isModelReady ? (
                  <Text style={styles.text}>✅</Text>
              ) : (
                  <ActivityIndicator size='small' />
              )}
            </View>
          </View>
          {/*<View style={styles.container}>*/}
          {/*  <RNCamera*/}
          {/*      ref={ref => {*/}
          {/*        this.camera = ref;*/}
          {/*      }}*/}
          {/*      style = {styles.preview}*/}
          {/*      type={RNCamera.Constants.Type.back}*/}
          {/*      flashMode={RNCamera.Constants.FlashMode.on}*/}
          {/*      permissionDialogTitle={'Permission to use camera'}*/}
          {/*      permissionDialogMessage={'We need your permission to use your camera phone'}*/}
          {/*      onModelProcessed={data => this.processOutput(data)}*/}
          {/*      modelParams={modelParams}*/}
          {/*  >*/}
          {/*    <Text style={styles.cameraText}>{this.state.output}</Text>*/}
          {/*  </RNCamera>*/}
          {/*</View>*/}

          <TouchableOpacity
              style={styles.imageWrapper}
              onPress={isModelReady ? this.selectImage : undefined}>
            {image && <Image source={image} style={styles.imageContainer} />}

            {isModelReady && !image && (
                <Text style={styles.transparentText}>Tap to choose image</Text>
            )}
          </TouchableOpacity>
          <View style={styles.predictionWrapper}>
            {isModelReady && image && (
                <Text style={styles.text}>
                  Predictions: {predictions ? '' : 'Predicting...'}
                </Text>
            )}
            {isModelReady &&
            predictions &&
            predictions.map(p => this.renderPrediction(p))}
          </View>
          <View style={styles.footer}>
            <Text style={styles.poweredBy}>    Kavach.AI </Text>
            <Image source={require('./assets/tfjs.jpg')} style={styles.tfLogo} />
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171f24',
    alignItems: 'center'
  },
  loadingContainer: {
    marginTop: 80,
    justifyContent: 'center'
  },
  text: {
    color: '#ffffff',
    fontSize: 16
  },
  loadingModelContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  imageWrapper: {
    width: 280,
    height: 280,
    padding: 10,
    borderColor: '#cf667f',
    borderWidth: 5,
    borderStyle: 'dashed',
    marginTop: 40,
    marginBottom: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    width: 250,
    height: 250,
    position: 'absolute',
    top: 10,
    left: 10,
    bottom: 10,
    right: 10
  },
  predictionWrapper: {
    height: 100,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center'
  },
  transparentText: {
    color: '#ffffff',
    opacity: 0.7
  },
  footer: {
    marginTop: 40
  },
  poweredBy: {
    fontSize: 20,
    color: '#e69e34',
    marginBottom: 6
  },
  tfLogo: {
    width: 125,
    height: 70
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
})

export default App