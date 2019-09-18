import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { Text, TextInput, View, StyleSheet, Button, Switch, Dimensions, TouchableHighlight } from 'react-native';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  }

  static navigationOptions = {
    title: 'Change Password',
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.currentPasswordContainer}>
          <TextInput
            style={styles.textInput}
            autoFocus={true}
            autoCompleteType='password'
            secureTextEntry={true}
            placeholder='Current Password'
            onChangeText={(e) => {
              this.setState({ currentPassword: e });
            }}
          />
        </View>
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          placeholder='New Password'
          onChangeText={(e) => {
            this.setState({ newPassword: e });
          }}
        />
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          placeholder='Confirm New Password'
          onChangeText={(e) => {
            this.setState({ confirmPassword: e });
          }}
        />
        <Text>
          {this.state.message}
        </Text>
        <TouchableHighlight style={styles.changePasswordButton} onPress={() => { this.onResetPassword(); }}>
          <Text style={styles.loginText}>Change Password</Text>
        </TouchableHighlight>
      </View>
    );
  }

  onResetPassword = () => {
    if (this.state.newPassword == this.state.confirmPassword && this.state.newPassword) {
      this.setState({ message: '' });
      firebase.auth().signInWithEmailAndPassword(firebase.auth().currentUser.email, this.state.currentPassword).then((currentUser) => {
        return firebase.auth().currentUser.updatePassword(this.state.confirmPassword).then(() => {
          this.setState({ message: 'Password reset' });
        });
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.setState({ message: errorMessage });
      });
    } else {
      this.setState({ message: 'Passwords do not match' });
    }
  }
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor: '#cfd2d6',
    height: Dimensions.get('window').height,
  },
  changePasswordButton: {
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
  textInput: {
    backgroundColor: '#ffffff',
    height: 36,
    width: '80%',
    padding: 0,
    paddingLeft: 20,
    margin: 6,
    borderRadius: 10,
  },
  loginText: {
    color: '#ffffff',
    fontSize: 10,
  },
  currentPasswordContainer: {
    paddingTop: 100,
    paddingBottom: 30,
    width: '100%',
    display: "flex",
    alignItems: "center",
  }
})
