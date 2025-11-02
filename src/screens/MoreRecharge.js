import React from 'react';
import { View, Text, StyleSheet, Pressable,ScrollView, Image } from 'react-native';
import { Header2 as Header } from '../components/Header';

const MoreRecharge = ({ navigation }) => {
  const options = [
    { image: require('../../assets/B&RIcons/Mobile.png'), text: 'Mobile Recharge', screen: 'MobileRecharge' },
    { image: require('../../assets/B&RIcons/DTH.png'), text: 'DTH', screen: 'DTHRecharge' },
    { image: require('../../assets/B&RIcons/Electricity.png'), text: 'Electricity', screen: 'ElectricityRecharge' },
    { image: require('../../assets/B&RIcons/WATER-BILL-ICON.png'), text: 'Water', screen: 'WaterRecharge' },
    { image: require('../../assets/B&RIcons/RENT.png'), text: 'Rent', screen: 'Rentpay' },
    { image: require('../../assets/B&RIcons/BROADBAND-ICON.png'), text: 'Broadband/ Landline', screen: 'BroadbandRecharge' },
    { image: require('../../assets/B&RIcons/CABLE-TV.png'), text: 'Cable TV', screen: 'CableTVRecharge' },
    { image: require('../../assets/B&RIcons/GAS-CYLENDER.png'), text: 'Book a Cylinder', screen: 'CylinderRecharge' },
    { image: require('../../assets/B&RIcons/LOAN-REPAYMENT.png'), text: 'Laon Repayment', screen: 'CylinderRecharge' },
    { image: require('../../assets/B&RIcons/FASTAG-ICON.png'), text: 'FAST Tag', screen: 'CylinderRecharge' },
    { image: require('../../assets/B&RIcons/GAS-PIPE.png'), text: 'Piped Paid', screen: 'CylinderRecharge' },
    { image: require('../../assets/B&RIcons/CREDIT-CARD-ICON.png'), text: 'Creadit card Payment', screen: 'CylinderRecharge' },
    { image: require('../../assets/B&RIcons/SUBSCRIPTION-ICON.png'), text: 'Subscriptions', screen: 'CylinderRecharge' },

  ];

  return (
    <>
      <Header title="Bills & Recharges" />
      <ScrollView style={styles.ScrollViewcontainer}>
      <View style={styles.container}>
        <View style={styles.containerBox1}>
          {Array.from({ length: 3 }).map((_, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              {options.slice(rowIndex * 4, rowIndex * 4 + 4).map((option, index) => (
                <Pressable
                  style={styles.box}
                  key={index}
                  onPress={() => navigation.navigate(option.screen)}
                >
                  <Image source={option.image} style={styles.image} />
                  <Text style={styles.text}>{option.text}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </View>
      </ScrollView>
    
    </>
  );
};

const styles = StyleSheet.create({
  ScrollViewcontainer:{
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffff',
  },
  containerBox1: {
    padding: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  box: {
    width: '22%',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    borderColor:'#0d4574',
    borderWidth:1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 30,
    height: 30,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});

export default MoreRecharge;
