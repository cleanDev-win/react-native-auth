import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { Text, TextInput, View, StyleSheet, Button, Switch, Dimensions, Image, TouchableHighlight } from 'react-native';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      message: '',
    }
  }

  static navigationOptions = {
    headerTransparent: 'true',
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/Moments.png')}
          style={styles.image}
          resizeMode='contain'
        />
        <Text>{this.state.message}</Text>
        <TextInput
          autoFocus={true}
          placeholder='your e-mail'
          autoCompleteType='email'
          style={styles.textInput}
          onChangeText={(e) => {
            this.setState({ email: e });
          }}
        />
        <TouchableHighlight
          onPress={() => { this.onResetPassword(this.state.email); }}
          style={styles.loginButton}
        >
          <Text style={styles.loginText}>Reset Password</Text>
        </TouchableHighlight>
      </View>
    );
  }

  onResetPassword = (email) => {
    const that = this;
    firebase.auth().sendPasswordResetEmail(email).then(() => {
      this.setState({ message: 'Password reset email sent.' });
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      that.setState({ message: errorMessage });
      // ...
    });
  }
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor: '#f4b52a',
    height: Dimensions.get('window').height,
    paddingTop: 40,
    // justifyContent: "center",
  },
  image: {
    width: '60%'
  },
  textInput: {
    backgroundColor: '#ffffff',
    height: 36,
    width: '80%',
    padding: 0,
    paddingLeft: 20,
    margin: 6,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 40,
  },
  registerButton: {
    width: '45%',
    height: 32,
    borderColor: '#3a3838',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    width: '45%',
    height: 32,
    backgroundColor: '#3a3838',
    borderColor: '#3a3838',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  loginText: {
    color: '#ffffff',
    fontSize: 10,
  },
  registerText: {
    fontSize: 10,
  },
  forgotPasswordButton: {
    margin: 10,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '80%',
  }
})
