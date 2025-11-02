import React, { useState } from 'react';
import { View, Text, TextInput,Image, StyleSheet, ScrollView, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { Header2 as Header } from '../../components/Header';

const AirtelDigitalTV = ({ route, navigation }) => {
    const { title } = route.params; 
  const [mobileNo, setMobileNo] = useState('');

  const handleConfirm = () => {
    // // console.log('Confirm button pressed');
    navigation.navigate('AirtelPayment');

  };

  return (
    <>
   <Header title={title || 'Airtel Digital TV'} />     

        <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <View style={styles.container} >

          <View style={styles.imageContainer}>
              <Image 
                       source={require('../../../assets/Image/rechargebanner.jpg')} 
                       style={styles.logo}
                       resizeMode="contain"
                     />
              </View>

            <View style={styles.card}>
              <Text style={styles.label}>Subscriber ID/Registered Mobile Number</Text>

              <TextInput
                style={styles.input}
                value={mobileNo}
                onChangeText={setMobileNo}
                keyboardType="phone-pad"
                // placeholder="Enter Registered Mobile No"
              />

              <Text style={styles.note}>
                Press the menu button on your Airtel DTH remote and select My Account to get your subscriber ID.
              </Text>
            </View>
            </View>

        </ScrollView>

        
      <TouchableOpacity
          style={[styles.confirmButton, mobileNo ? styles.confirmButtonActive : null]}
          onPress={handleConfirm}
          disabled={!mobileNo}
        >
          <Text style={[styles.confirmButtonText, mobileNo ? styles.confirmButtonTextActive : null]}>
            CONFIRM
          </Text>
        </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 6,
  },
  scrollContainer: {
    flexGrow: 1, 
    justifyContent: 'space-between',  
  },
  logo: {
    width: '100%',
    height: 170,
    marginBottom: 10,
    borderWidth: 0.1,
    borderColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20, 
marginTop:9,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  note: {
    fontSize: 12,
    color: '#888',
  },
  confirmButton: {
    backgroundColor: '#dcdcdc',
    paddingVertical: 22,
    justifyContent: 'center',
    alignItems: 'center',

  },
  confirmButtonActive: {
    backgroundColor: '#0d4574', 
  },
  confirmButtonText: {
    color: '#808080',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButtonTextActive: {
    color: '#fff', 
  },

});

export default AirtelDigitalTV;
