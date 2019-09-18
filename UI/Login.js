import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { Text, TextInput, View, StyleSheet, Button, Switch, Image, TouchableHighlight, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
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
        <TextInput
          autoFocus={true}
          autoCompleteType='email'
          placeholder='your e-mail'
          onChangeText={(e) => {
            this.setState({ email: e });
          }}
          onSubmitEditing={(e) => {
            this.passwordTextInput.focus();
          }}
          style={styles.textInput}
        />
        <TextInput
          secureTextEntry={true}
          autoCompleteType='password'
          placeholder='your password'
          ref={(input) => { this.passwordTextInput = input; }}
          onChangeText={(e) => {
            this.setState({ password: e });
          }}
          style={styles.textInput}
        />
        <Text>{this.state.message}</Text>
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            onPress={() => { this.props.navigation.navigate('Register'); }}
            style={styles.registerButton}
          >
            <Text style={styles.registerText}>Register</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => { this.onLoginSubmit(this.state.email, this.state.password); }}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.forgotPasswordContainer}>
          <TouchableHighlight
            onPress={() => { this.props.navigation.navigate('ResetPassword'); }}
            style={styles.forgotPasswordButton}
          >
            <Text style={styles.loginText}>Forgot password?</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  onLoginSubmit = function onLoginSubmited(email, password) {
    this.setState({ message: null });
    firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
      if (!userCredential.user.emailVerified) {
        userCredential.user.sendEmailVerification();
        this.setState({ message: 'Please check your email for verification' });
      } else {
        this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Appointments' })]);
      }
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      this.setState({ message: errorMessage });
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
