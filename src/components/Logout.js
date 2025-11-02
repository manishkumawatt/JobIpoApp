/* eslint-disable prettier/prettier */
/* eslint-disable semi */
import {StyleSheet, Text, Pressable, Alert, View} from 'react-native';
import React, {useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/context';
import Icon from 'react-native-vector-icons/Ionicons';
import {showToastMessage} from '../utils/Toast';

const Logout = ({navigation}) => {
  const {signOut} = useContext(AuthContext);

  const LogoutFunction = async () => {
    var formdata = {action: 'Logout'};
    const ResData = await fetch('https://jobipo.com/api/Agent/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formdata),
    })
      .then(res => res.json())
      .catch(err => console.log(err));

    // console.log({ResData});

    if (ResData.status !== 1) {
      try {
        showToastMessage(ResData?.message || 'Something went wrong');
      } catch (e) {
        // console.log(e);
      }
      navigation.navigate('Login');
    } else {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('contactNumber1');
        await AsyncStorage.removeItem('UserID');
        await AsyncStorage.removeItem('Token');
        await AsyncStorage.removeItem('ContactNumber');
        await signOut();
        const checkUserId = await AsyncStorage.getItem('UserID');
        // console.log('UserID after removal (should be null):', checkUserId);
        showToastMessage(ResData?.message, 'success');

        navigation.navigate('Login');
      } catch (error) {
        // console.error('Logout Error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you sure you want to log out?</Text>
      <Pressable
        style={({pressed}) => [
          styles.button,
          {backgroundColor: pressed ? '#0d4574' : '#0d4574'},
        ]}
        onPress={() => {
          Alert.alert(
            'Logout',
            'Are you sure you want to log out?',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Yes', onPress: LogoutFunction},
            ],
            {cancelable: true},
          );
        }}>
        <View style={styles.buttonContent}>
          <Icon
            name="log-out-outline"
            size={18}
            color="#fff"
            style={{marginRight: 10}}
          />
          <Text style={styles.buttonText}>Log Out </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default Logout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    width: '40%',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
