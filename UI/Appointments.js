import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { Text, TextInput, View, StyleSheet, Button, Switch, TouchableHighlight, Dimensions, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { addDefaultPerkImage } from '../State';
import moment from 'moment';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

const db = firebase.firestore();
const storage = firebase.storage();

const IoniconsHeaderButton = props => (
  // the `props` here come from <Item .../>
  // you may access them and pass something else to `HeaderButton` if you like
  <HeaderButton {...props} IconComponent={Icon} iconSize={23} color="#78797c" />
);

class Appointments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visiblePerks: 1,
      image: null,
    };
    this.getDefaultImage();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Appointments',
      headerRight: (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item title="perks" iconName="diamond" onPress={() => { navigation.navigate('Perks'); }} />
          <Item title="settings" iconName="gear" onPress={() => { navigation.navigate('Settings'); }} />
        </HeaderButtons>
      ),
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {this.displayAppointments(this.props.appointments)
        }
      </ScrollView>
    );
  }

  displayAppointments = (appointments) => {
    if (appointments !== undefined) {
      return Object.values(appointments).map(appointment => this.displayAppointment(appointment))
    }
    return null
  }

  displayAppointment = (appointment) => {
    const date = new moment(appointment.startDateTime)
    if (moment().isAfter(date)) return;
    return (
      <View key={appointment.id} style={styles.appointment}>
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <View style={styles.dateContainer}>
              <Icon name='calendar' style={styles.calendarIcon} />
              <Text style={styles.dateText}>{date.format('MMMM Do, YYYY')}</Text>
            </View>
            <Text style={styles.appointmentTimeText}>{date.format('h:mm a')}</Text>
          </View>
          <View style={styles.appointmentBody}>
            <View style={styles.appointmentDescription}>
              <Text>{appointment.name}</Text>
              {/* {appointment.services.map(service => <Text key={service}>{service}</Text>)} */}
              {appointment.perk ?
                <Text style={styles.perk}>{this.props.perks[appointment.perk].name}</Text>
                : null}
            </View>
            <View style={styles.perkButtonContainer}>
              <TouchableHighlight
                onPress={() => { this.toggleShowPerksOnAppointment(appointment); }}
                style={this.arePerksVisible(appointment) ? styles.perkButtonHide : appointment.perk ? styles.perkButtonHide : styles.perkButtonShow}
              >
                <Text style={styles.perkButtonText}>{this.arePerksVisible(appointment) ? 'Hide Perks' : appointment.perk ? 'Edit Perk' : 'Choose Perk'}</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>

        {this.arePerksVisible(appointment) ? this.showPerks(this.props.perks, appointment) : null}
      </View>
    );
  }

  arePerksVisible = (appointment) => {
    return appointment.id == this.state.visiblePerks;
  }

  toggleShowPerksOnAppointment = (appointment) => {
    if (this.state.visiblePerks == appointment.id) {
      this.setState({ visiblePerks: null });
    } else {
      this.setState({ visiblePerks: appointment.id });
    }
  }

  showPerks = (perks, appointment) => {
    if (perks == undefined) return;
    const availablePerks = Object.values(perks).filter(perk => perk.amount > 0 || appointment.perk == perk.id);
    const onPerkSelected = (perk) => {
      if (appointment.perk !== null) {
        if (appointment.perk == perk.id) {
          db.collection('users').doc(firebase.auth().currentUser.uid).update({
            [`appointments.${appointment.id}.perk`]: null,
            [`perks.${perk.id}.amount`]: perk.amount + 1,
          });
        } else {
          db.collection('users').doc(firebase.auth().currentUser.uid).update({
            [`appointments.${appointment.id}.perk`]: perk.id,
            [`perks.${perk.id}.amount`]: perk.amount - 1,
            [`perks.${appointment.perk}.amount`]: perks[appointment.perk].amount + 1,
          });
        }
      } else {
        db.collection('users').doc(firebase.auth().currentUser.uid).update({
          [`appointments.${appointment.id}.perk`]: perk.id,
          [`perks.${perk.id}.amount`]: perk.amount - 1,
        });
      }
    }
    return (
      <View style={styles.perksList}>
        {availablePerks.map(perk => this.displayPerk(perk, appointment.perk == perk.id, (perk) => { onPerkSelected(perk); }))}
      </View>
    )
  }

  displayPerk = (perk, added, onPress) => {
    return (
      <TouchableHighlight key={perk.id} style={styles.perkTouchable} onPress={() => { onPress(perk); }}>
        <View style={styles.perkCard}>
          <View style={added ? styles.perkFooterSelected : styles.perkFooterDeselected}>
            <Text style={styles.perkFooterText}>{added ? 'Selected' : 'Select'}</Text>
          </View>
          <View style={styles.perkBody}>
            <Image source={{ uri: perk.image ? perk.image : this.props.defaultPerkImage }} style={styles.perkImage} />
            <View style={styles.perkText}>
              <Text style={styles.perkAmountText}>{`${perk.amount} available`}</Text>
              <Text style={styles.perkTitleText}>{perk.name}</Text>
              <Text>{perk.desc}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  getDefaultImage = async () => {
    const url = await storage.ref('default').getDownloadURL();
    this.props.onDefaultPerkImageLoaded(url);
  }
}

const mapStateToProps = state => {
  return {
    appointments: state.user ? state.user.appointments : {},
    perks: state.user ? state.user.perks : {},
    defaultPerkImage: state.defaultPerkImage,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onDefaultPerkImageLoaded: url => {
      dispatch(addDefaultPerkImage(url));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Appointments);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor: '#cfd2d6',
    minHeight: Dimensions.get('window').height,
  },
  appointment: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  appointmentCard: {
    width: '90%',
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
  appointmentHeader: {
    height: 50,
    backgroundColor: '#f4b52a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  appointmentBody: {
    backgroundColor: '#EEEFF1',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  perk: {
    color: '#6EAAB8',
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    fontSize: 20,
  },
  dateText: {
    color: '#ffffff',
    fontSize: 20,
    marginLeft: 5,
  },
  appointmentTimeText: {
    fontSize: 20,
  },
  appointmentDescription: {
    padding: 10,
    paddingLeft: 70,
  },
  perkButtonShow: {
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
  perkButtonHide: {
    width: '45%',
    height: 32,
    backgroundColor: '#6EAAB8',
    borderColor: '#6EAAB8',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkButtonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  perkButtonText: {
    color: '#ffffff',
  },
  perkCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  perkTouchable: {
    width: '90%',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  perkBody: {
    backgroundColor: '#D5D7DA',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 15,
    width: '92%',
    borderTopColor: '#979797',
    borderRightColor: '#979797',
    borderBottomColor: '#979797',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  perkAmountText: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  perkFooterSelected: {
    backgroundColor: '#6EAAB8',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 0,
    width: '8%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  perkFooterDeselected: {
    backgroundColor: '#78797c',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 0,
    width: '8%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  perksList: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
    paddingBottom: 15,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 10,
    width: '100%',
  },
  perkFooterText: {
    color: '#fff',
    fontWeight: 'bold',
    width: 80,
    transform: [
      { rotate: "-90deg" },
    ],
    textAlign: 'center',
  },
  perkFooterTextTransform: {
    // transform: [
    //   { translateY: 20 },
    // ]
  },
  perkTitleText: {
    fontWeight: 'bold',
  },
  perkImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  perkText: {
    flexShrink: 2,
    paddingLeft: 5,
    width: '100%',
    height: '100%',
  },
})


