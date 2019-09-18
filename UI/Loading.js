import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { Text, TextInput, View, StyleSheet, Button, Switch, Image, TouchableHighlight, Dimensions } from 'react-native';

export default class Loading extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/Moments.png')}
          style={styles.image}
          resizeMode='contain'
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: '#f4b52a',
    height: Dimensions.get('window').height,
  },
  image: {
    width: '60%'
  },
})
