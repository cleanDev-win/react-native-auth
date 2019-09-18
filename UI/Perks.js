import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { Text, TextInput, View, StyleSheet, Button, Switch, TouchableHighlight, Dimensions, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

const storage = firebase.storage();

const IoniconsHeaderButton = props => (
  // the `props` here come from <Item .../>
  // you may access them and pass something else to `HeaderButton` if you like
  <HeaderButton {...props} IconComponent={Icon} iconSize={23} color="#78797c" />
);

class Perks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
    };
    this.getDefaultImage();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Perks',
      headerRight: (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item title="settings" iconName="md-settings" onPress={() => { navigation.navigate('Settings'); }} />
        </HeaderButtons>
      ),
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {this.showPerks(this.props.perks)}
      </ScrollView>
    );
  }


  showPerks = (perks) => {
    if (perks == undefined) return;
    const availablePerks = Object.values(perks).filter(perk => perk.amount > 0);
    return (
      <View style={styles.perksList}>
        {availablePerks.map(perk => this.displayPerk(perk))}
      </View>
    )
  }

  displayPerk = (perk) => {
    return (
      <View key={perk.id} style={styles.perkCard}>
        <View style={styles.perkBody}>
          <Image source={{ uri: perk.image ? perk.image : this.state.image }} style={styles.perkImage} />
          <View style={styles.perkText}>
            <Text style={styles.perkAmountText}>{`${perk.amount} available`}</Text>
            <Text style={styles.perkTitleText}>{perk.name}</Text>
            <Text>{perk.desc}</Text>
          </View>
        </View>
      </View>
    );
  }

  getDefaultImage = async () => {
    const url = await storage.ref('default').getDownloadURL();
    this.setState({ image: url });
  }
}

const mapStateToProps = state => {
  return {
    appointments: state.user ? state.user.appointments : {},
    perks: state.user ? state.user.perks : {},
  };
}

export default connect(mapStateToProps)(Perks);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor: '#cfd2d6',
    minHeight: Dimensions.get('window').height,
  },
  appointmentCard: {
    width: '90%',
    marginTop: 20,
  },
  appointmentHeader: {
    height: 40,
    backgroundColor: '#f4b52a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  appointmentBody: {
    backgroundColor: '#ffffff',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  perk: {
    width: '90%',
    backgroundColor: '#cdd1d4',
    padding: 10,
    paddingLeft: 70,
  },
  dateText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  appointmentTimeText: {
    fontWeight: 'bold',
  },
  appointmentDescription: {
    padding: 10,
    paddingLeft: 70,
  },
  perkButton: {
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
  perkButtonContainer: {
    width: '90%',
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
  perkBody: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  perkAmountText: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  perkFooterSelected: {
    backgroundColor: '#f4b52a',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    display: 'flex',
    alignItems: 'center',
    padding: 5,
  },
  perkFooterDeselected: {
    backgroundColor: '#78797c',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    display: 'flex',
    alignItems: 'center',
    padding: 5,
  },
  perksList: {
    display: 'flex',
    alignItems: 'center',
    width: '90%'
  },
  perkFooterText: {
    color: '#fff',
    fontWeight: 'bold',
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
