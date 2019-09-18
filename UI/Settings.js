import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { Text, TextInput, View, StyleSheet, Button, Switch, Dimensions, TouchableHighlight } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';

const notifications = firebase.notifications();
const db = firebase.firestore();

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointmentNotifications: this.props.user.settings.appointmentNotifications,
      perkNotifications: this.props.user.settings.perkNotifications,
    }
  }

  static navigationOptions = {
    title: 'Settings',
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.settingsCard}>
          <View style={styles.settingsLineTop}>
            <Text style={styles.settingsText}>Booking Reminders</Text>
            <Switch value={this.state.appointmentNotifications} ref={(item) => { this.reminderSwitch = item; }} onValueChange={(value) => { this.toggleAppointmentNotifications(value); }} />
          </View>
          <View style={styles.horizontalLine}></View>
          <View style={styles.settingsLine}>
            <Text style={styles.settingsText}>New Perk Alerts</Text>
            <Switch value={this.state.perkNotifications} ref={(item) => { this.alertSwitch = item; }} onValueChange={(value) => { this.togglePerkNotifications(value) }} />
          </View>
          <View style={styles.horizontalLine}></View>
          <TouchableHighlight onPress={() => { this.props.navigation.navigate('ChangePassword'); }}>
            <View style={styles.settingsLine}>
              <Text style={styles.settingsText}>Change Password</Text>
              <Text>></Text>
            </View>
          </TouchableHighlight>
          <View style={styles.horizontalLine}></View>
          <TouchableHighlight
            onPress={() => {
              firebase.auth().signOut().then(() => {
                this.props.navigation.replace('Home');
              });
            }}
            style={styles.touchableHighlightBottom}
          >
            <View style={styles.settingsLineBottom}>
              <Text style={styles.settingsText}>Log Out</Text>
              <Text>></Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  toggleAppointmentNotifications = async (value) => {
    this.setState({ appointmentNotifications: value });
    db.collection('users').doc(this.props.user.id).update({
      'settings.appointmentNotifications': value,
    });
  };

  togglePerkNotifications = async (value) => {
    this.setState({ perkNotifications: value });
    db.collection('users').doc(this.props.user.id).update({
      'settings.perkNotifications': value,
    });
  };
}

const mapStateToProps = state => {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(Settings);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor: '#cfd2d6',
    height: Dimensions.get('window').height,
  },
  settingsCard: {
    width: '90%',
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  settingsLine: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    padding: 10,
    height: 40,
  },
  settingsLineTop: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    padding: 10,
    height: 40,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  settingsLineBottom: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    padding: 10,
    height: 40,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  touchableHighlightBottom: {
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  settingsText: {
    marginLeft: 20,
  },
  horizontalLine: {
    borderBottomColor: '#cfd2d6',
    borderBottomWidth: 2,
  }
})
