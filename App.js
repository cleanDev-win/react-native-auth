import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, Button, StatusBar, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';
import { createAppContainer, createStackNavigator, NavigationActions } from 'react-navigation';
import { Provider, connect } from 'react-redux'
import { createStore } from 'redux'
import axios from 'axios';

import { HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons';
import Login from './UI/Login';
import ResetPassword from './UI/ResetPassword';
import Appointments from './UI/Appointments';
import Settings from './UI/Settings';
import ChangePassword from './UI/ChangePassword';
import Loading from './UI/Loading';
import Register from './UI/Register';
import Perks from './UI/Perks';
import Store, { setUser } from './State';

const db = firebase.firestore();
const messaging = firebase.messaging();
const notifications = firebase.notifications();
let unsubUser;

const store = createStore(Store);

class App extends React.Component {
  constructor() {
    super();
    this.state = { error: "none" };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        // if (user) {
        if (unsubUser == null) {
          unsubUser = db.collection('users').doc(user.uid).onSnapshot(snapshot => {
            store.dispatch(setUser(snapshot.id, snapshot.data()));
          });
        }
        setupNotifs(user);
        this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Appointments' })]);
      } else {
        if (unsubUser) {
          unsubUser();
          unsubUser = null;
        }
        this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Login' })]);
      }
    });
  }

  static navigationOptions = {
    headerTransparent: 'true',
  }


  render() {
    return (
      <Loading />
    );
  }
}

const mapStateToProps = state => {
  return {

  };
}

const mapDispatchToProps = dispacth => {
  return {
    onAppointmentAdded: (appointment) => {
      dispacth(addAppointment(appointment));
    }
  }
}

export default class ProviderApp extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}

const setupNotifs = async (user) => {
  // Build a channel
  const channel = new firebase.notifications.Android.Channel('appointments', 'Appointments', firebase.notifications.Android.Importance.Min)
    .setDescription('Appointment Reminders');
  // Create the channel
  firebase.notifications().android.createChannel(channel);

  let permission = await messaging.hasPermission();
  if (permission == false) {
    try {
      permission = await messaging.requestPermission();
      if (permission) {
        const token = await messaging.getToken();
        db.collection('users').doc(user.uid).update({
          messagingToken: token,
        });
        receiveNotifs();
      }
    } catch (err) {
    }
  } else {
    const token = await messaging.getToken();
    db.collection('users').doc(user.uid).update({
      messagingToken: token,
    });
    receiveNotifs();
  }
}

const receiveNotifs = () => {
  messaging.onMessage(message => {
    notifications.displayNotification(message);
  });
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4BA17',
    height: Dimensions.get('window').height,
  },
});

const AppNavigator = createAppContainer(createStackNavigator({
  Home: {
    screen: connect(mapStateToProps, mapDispatchToProps)(App)
  },
  Login: {
    screen: Login
  },
  ResetPassword: {
    screen: ResetPassword
  },
  Appointments: {
    screen: Appointments
  },
  Settings: {
    screen: Settings
  },
  ChangePassword: {
    screen: ChangePassword
  },
  Register: {
    screen: Register
  },
  Perks: {
    screen: Perks
  },
}));

// export default createAppContainer(AppNavigator);
