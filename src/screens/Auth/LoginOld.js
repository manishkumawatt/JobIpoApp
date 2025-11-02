/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useRef, useEffect, useState} from 'react';
import Input from '../../components/Auth/Input';
import Button from '../../components/Auth/Button';
import Logo from '../../components/Auth/Logo';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../../context/context';

const LoginOld = ({navigation}) => {
  const {signIn} = useContext(AuthContext);
  const [username, setUsername] = useState('');
  // const [username, setUsername] = useState('9098322385');
  const [agree, setAgree] = useState(false);
  // const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpInputs = useRef([]);

  // const otpInputs = [];
  // useEffect(() => {
  //   setTimeout(async () => {
  //     let userToken;
  //     userToken = null;
  //     try {
  //       userToken = await AsyncStorage.getItem('userToken');
  //     } catch (e) {
  //       // console.log(e);
  //     }
  //     // console.log(userToken);
  //     if(userToken != null){
  //     }
  //     // dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
  //   }, 1);
  // }, []);

  //   const handleOTPChange = (text, index) => {
  //   const newOtp = [...otp];
  //   newOtp[index] = text;
  //   setOtp(newOtp);

  //   if (text && index < 3) {
  //     otpInputs[index + 1]?.focus();
  //   }

  //   if (text && index === 3) {
  //     const fullOtp = newOtp.join('');
  //     if (fullOtp.length === 4) {
  //       Submit(fullOtp);
  //     }
  //   }
  // };
  const handleOTPChange = (text, index) => {
    const newOtp = [...otp];

    // If text is empty (user deleted), move focus back
    if (text === '') {
      newOtp[index] = '';
      setOtp(newOtp);

      if (index > 0) {
        otpInputs.current[index - 1]?.focus();
      }
      return;
    }

    // Accept only digits
    if (!/^\d$/.test(text)) return;

    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input
    if (index < 3) {
      otpInputs.current[index + 1]?.focus();
    }

    // Auto-submit when last digit is entered
    if (index === 3) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === 4) {
        Submit(fullOtp);
      }
    }
  };

  const Submit = async (autoOtp = null) => {
    const currentOtp = autoOtp || otp;

    // // console.log('username', username);
    // // console.log('otp', currentOtp);

    if (username !== '' && currentOtp !== '') {
      const formdata = {username, otp: currentOtp};

      try {
        const response = await fetch('https://jobipo.com/api/v2/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formdata),
        });

        const ResData = await response.json();
        // // console.log('loginresponse', ResData);

        await AsyncStorage.setItem('UserID', String(ResData.user_id));
        const storedUserId = await AsyncStorage.getItem('UserID');
        // // console.log('Saved userId in AsyncStorage:', storedUserId);

        if (ResData.status == 1) {
          Alert.alert(ResData.message);
          let userToken = String(ResData.token);
          let userfullName = String(ResData.name);
          let userreferCode = String(ResData.referCode);
          let usercontactNumber1 = String(username);

          await signIn(userToken, username);
          await AsyncStorage.setItem('contactNumber1', usercontactNumber1);
          await AsyncStorage.setItem('username', userfullName);
          await AsyncStorage.setItem('userreferCode', userreferCode);
        } else {
          Alert.alert(ResData.message);
        }
      } catch (error) {
        // // console.log(error);
        Alert.alert('Network Error', 'Something went wrong!');
      }
    } else {
      Alert.alert('Please Fill All Data');
    }
  };

  const sendOtp = async () => {
    // // console.log(username);
    if (username != '') {
      var formdata = {username: username};
      // // console.log('otp formdata', formdata);

      try {
        const ResData = await fetch(
          'https://jobipo.com/api/v2/send-login-otp',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formdata),
          },
        )
          .then(res => res.json())
          .catch(err => {
            // setPayLoad(false);
            // // console.log('err', err);
          });
        // // console.log('sendotpresponse', ResData);
        if (ResData.status == 1) {
          setTimer(30);
          // Alert.alert(ResData.message);
          setIsOtpSent(true);
        } else {
          Alert.alert(ResData.message);
        }
      } catch (error) {
        // // console.log(error);
      }
    } else {
      Alert.alert('Please Fill All Data');
    }
  };

  // useEffect(() => {
  //   RNOtpVerify.getHash()
  //     .then(hash => {
  //       // console.log('App Hash:', hash);
  //     })
  //     .catch(console.log);
  //   RNOtpVerify.getOtp()
  //     .then(() => {
  //       RNOtpVerify.addListener(message => {
  //         // console.log('Received SMS:', message);
  //         const otpMatch = message.match(/\d{4}/);
  //         if (otpMatch) {
  //           const extractedOtp = otpMatch[0];
  //           setOtp(extractedOtp);
  //         }

  //         RNOtpVerify.removeListener();
  //       });
  //     })
  //     .catch(error => {
  //       // console.log('OTP Listener Error:', error);
  //     });

  //   return () => {
  //     RNOtpVerify.removeListener();
  //   };
  // }, []);

  // useEffect(() => {
  //   RNOtpVerify.getHash()
  //     .then(hash => {
  //       // console.log('App Hash:', hash);
  //     })
  //     .catch(console.log);

  //   RNOtpVerify.getOtp()
  //     .then(() => {
  //       RNOtpVerify.addListener(message => {
  //         // console.log('Received SMS:', message);

  //         const otpMatch = message.match(/\d{4}/);
  //         // console.log('otpMatch SMS:', otpMatch);
  //         if (otpMatch) {
  //           const extractedOtp = otpMatch[0];
  //           setOtp(extractedOtp);

  //           setTimeout(() => {
  //             Submit(extractedOtp);
  //           }, 500);
  //         } else {
  //           Alert.alert('Error', 'OTP not found in message');
  //         }

  //         RNOtpVerify.removeListener();
  //       });
  //     })
  //     .catch(error => {
  //       // console.log('OTP Listener Error:', error);
  //       Alert.alert('Error', 'Failed to start OTP listener');
  //     });

  //   return () => {
  //     RNOtpVerify.removeListener();
  //   };
  // }, []);

  useEffect(() => {
    let interval;
    if (isOtpSent) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev === 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  return (
    <ScrollView
      style={styles.ScrollViewcontainer}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
        <View style={styles.heading}>
          <Text style={styles.h1}>Let’s get started</Text>
          <Text style={styles.h2}>Welcome back</Text>
          <Text style={styles.h2}>You’ve been missed!</Text>
          {/* <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 18 }}>
  Testing Font
</Text> */}
        </View>

        {isOtpSent ? (
          <View style={styles.credContainer}>
            <View style={styles.otpBoxContainer}>
              {Array(4)
                .fill()
                .map((_, index) => (
                  <TextInput
                    key={index}
                    // ref={ref => (otpInputs[index] = ref)}
                    ref={ref => (otpInputs.current[index] = ref)}
                    style={styles.otpInput}
                    keyboardType="numeric"
                    maxLength={1}
                    value={otp[index] || ''}
                    onChangeText={text => handleOTPChange(text, index)}
                    autoFocus={index === 0}
                  />
                ))}
            </View>
            <View
              style={{
                position: 'absolute',
                top: 80,
                left: 0,
                right: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {timer > 0 && (
                <Text style={{fontSize: 14}}>
                  Resend OTP in {Math.floor(timer / 60)}:
                  {String(timer % 60).padStart(2, '0')}
                </Text>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}>
              <Pressable
                disabled={timer > 0}
                style={[
                  {
                    backgroundColor: timer > 0 ? '#ffff' : '#ffff',
                    height: 48,
                    width: '48.5%',
                    marginTop: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#0d4574',
                  },
                ]}
                onPress={() => sendOtp()}>
                <Text
                  style={{
                    color: '#0d4574',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Resend Otp
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.credContainer}>
              <TextInput
                value={username}
                style={styles.textInput}
                placeholder="Mobile Number"
                keyboardType="numeric"
                maxLength={10}
                onChangeText={text => {
                  const cleaned = text.replace(/[^0-9]/g, '');
                  setUsername(cleaned);
                }}
              />
              {/* <View style={styles.button}>
              <Button text="Send OTP" style={styles.cbutton}
                onPress={() => sendOtp()} />
            </View> */}
              <View style={styles.button}>
                <TouchableOpacity
                  style={styles.cbutton}
                  onPress={() => sendOtp()}>
                  <Text style={styles.buttonText}>Send OTP</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.lastInfo}>
              <Text style={styles.lastInfoText}>Don’t have an account?</Text>
              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text
                  style={[
                    styles.lastInfoText,
                    {marginLeft: 10, fontWeight: 'bold'},
                  ]}>
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default LoginOld;

const styles = StyleSheet.create({
  ScrollViewcontainer: {
    // flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    marginTop: 20,
  },

  container: {
    width: '100%',
    paddingHorizontal: 36,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  blacktext: {
    color: '#000',
  },

  heading: {
    // marginTop: 5,
    alignItems: 'center',
    width: '100%',
  },

  h1: {
    fontSize: 35,
    fontWeight: 'bold',
    lineHeight: 56,
    color: '#535353',
  },
  h2: {
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 30,
    color: '#535353',
  },
  credContainer: {
    marginTop: 40,
    width: '100%',
  },
  h3: {
    fontSize: 20,
    color: '#535353',
    fontWeight: 'bold',
  },
  extraInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  button: {
    // marginTop: 18,
    width: '100%',
    borderRadius: 10,
    borderColor: '#0d4574',
  },

  cbutton: {
    color: '#ff0',
    backgroundColor: '#000',
    borderRadius: 10,
    borderColor: '#0d4574',
    borderWidth: 0.7,
  },

  lastInfo: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 26,
  },
  lastInfoText: {
    fontSize: 16,
  },
  textInput: {
    marginVertical: 7.5,
    backgroundColor: '#f8f8f8',
    paddingLeft: 10,
    color: '#333',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 0.7,
  },
  chatBtn: {
    marginBottom: 150,
  },
  otpBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#0d4574',
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    backgroundColor: '#f8f8f8',
    marginHorizontal: 4,
  },

  button: {
    marginTop: 20,
    alignItems: 'center',
  },
  cbutton: {
    backgroundColor: '#0d4574',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
