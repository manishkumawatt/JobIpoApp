import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Linking,
  StyleSheet,
  TouchableOpacity,
  Keyboard, // For the custom Button component
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// If you are using react-native-vector-icons for the checkbox checkmark
import Icon from 'react-native-vector-icons/MaterialIcons'; // Or any other icon set you prefer
import StepIndicator, {
  StepIndicator1,
  StepIndicator2,
  StepIndicator3,
} from './StepIndicator';
import LogoS from '../../components/Auth/LogoS';
import {ValidateForm} from '../../utils/validation/validation';
import {checkUserApi} from '../../appRedux/actions/userSessionAction';
import {CommonTextInputs, KeyboardScroll} from '../../component';
import {useDispatch} from 'react-redux';
import {showToastMessage} from '../../utils/Toast';
import {loadingShow} from '../../appRedux/actions/loadingAction';

// Dummy Button Component (Replace with your actual Button component if you have one)
const Button = ({onPress, text, style}) => (
  <TouchableOpacity style={[styles.buttonBase, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const Register = ({navigation}) => {
  const [fullName, setfullName] = useState('');
  const [emailID, setemailID] = useState('');
  const [contactNumber, setcontactNumber] = useState('');
  const [uniqueCode, setuniqueCode] = useState('');
  const [terms, setterms] = useState(0);
  const [otp, setotp] = useState(['', '', '', '']);
  const [Rotp, setRotp] = useState('');
  const [FilterDisplay, setFilterDisplay] = useState(1);
  const [ShowSubmit, setShowSubmit] = useState(1);
  const [timer, setTimer] = useState(30);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const otpRefs = useRef([]);
  const dispatch = useDispatch();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Reset animation values
  const resetAnimations = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    slideAnim.setValue(50);
  };

  useFocusEffect(
    useCallback(() => {
      setIsOtpSent(false);
      setotp(['', '', '', '']);
      setRotp('');
      setTimer(30);
      setFilterDisplay(1);
      setShowSubmit(1);
      setfullName('');
      setemailID('');
      setcontactNumber('');
      setuniqueCode('');
      setterms(0);
      resetAnimations();

      return () => {
        // Cleanup logic if needed
      };
    }, []),
  );

  let reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/; //email

  const [accountReq, setAccountReq] = useState({
    fullName: '',
    emailID: '',
    contactNumber: '',
    uniqueCode: '',
    validators: {
      fullName: {
        type: 'name',
        error: '',
        required: true,
      },
      emailID: {
        type: 'email',
        error: '',
        required: true,
      },
      contactNumber: {
        type: 'mobile_number',
        error: '',
        required: true,
      },

      // terms: {
      //   error: '',
      //   required: true,
      // },
    },
  });

  const CreateUser = async () => {
    let validForm = ValidateForm(accountReq);
    setAccountReq({...accountReq}, validForm.value);
    // // console.log('accountReq', accountReq);
    if (validForm.status) {
      Keyboard.dismiss();
      let dic = {...accountReq};
      delete dic.validators;

      let obj = {
        fullName: accountReq?.fullName,
        email: accountReq?.emailID,
        mobile: accountReq?.contactNumber,
        referCode: accountReq?.uniqueCode,
        notificationConsent: 1,
        is_sms_enable: terms ? 1 : 0,
      };
      // dispatch(loadingShow(true));
      // try {
      //   const ResData = await fetch(
      //     'https://jobipo.com/api/v3/sign-up-process',
      //     {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //         Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      //       },
      //       body: JSON.stringify(dic),
      //     },
      //   );
      //   console.log('checkOtp response:----', ResData);

      //   dispatch(loadingShow(false));
      //   navigation.navigate('OtpScreen', {registerObj: obj});
      //   if (ResData.type === 'success') {
      //     // Alert.alert('OTP Verified Successfully');
      //     navigation.navigate('RegistrationP');
      //     return true;
      //   } else {
      //     showToastMessage(ResData.msg || 'Invalid OTP.');
      //     return false;
      //   }
      // } catch (err) {
      //   dispatch(loadingShow(false));

      //   console.log('checkOtp error:-----', err);
      //   return false;
      // } finally {
      //   dispatch(loadingShow(false));
      // }

      dispatch(checkUserApi(obj)).then(response => {
        if (response?.success) {
          // // console.log('responseresponse', response);
          navigation.navigate('OtpScreen', {registerObj: obj});
          // methodApi(response);
        }
      });
    }
  };

  const methodSetupAccountRequest = (key, value) => {
    let newValue = value;
    let dic = {...accountReq};
    dic[key] = newValue;
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = '';
    }

    setAccountReq(dic);
  };

  const methodApi = async ResData => {
    setIsOtpSent(true);
    setTimer(30);
    // // console.log('methodApi', ResData);
    await AsyncStorage.setItem('Token', String(ResData.token));
    await AsyncStorage.setItem('ContactNumber', String(contactNumber));

    const storedUserId = await AsyncStorage.getItem('UserID');
    const storedToken = await AsyncStorage.getItem('Token');
    const storedContactNumber = await AsyncStorage.getItem('ContactNumber');
    // // console.log('Saved userId in AsyncStorage:', storedUserId);
    // // console.log('Saved storedToken in AsyncStorage:', storedToken);
    // // console.log('Saved contactNumber in AsyncStorage:', storedContactNumber);

    // Animate OTP screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const checkOtp = async () => {
    const enteredOtp = otp.join('').trim();

    if (enteredOtp.length !== 4 || otp.includes('')) {
      showToastMessage('Please enter all 4 digits of OTP.');
      return false;
    }

    const formdata = {
      contact_number: contactNumber,
      otp: enteredOtp,
    };

    // // console.log('FormData being sent to verify-otp API:', formdata);

    try {
      const ResData = await fetch('https://jobipo.com/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      }).then(res => res.json());

      // // console.log('checkOtp response:', ResData);

      if (ResData.type === 'success') {
        // Alert.alert('OTP Verified Successfully');
        navigation.navigate('RegistrationP');
        return true;
      } else {
        showToastMessage(ResData.msg || 'Invalid OTP.');
        return false;
      }
    } catch (err) {
      // // console.log('checkOtp error:', err);
      showToastMessage('An error occurred while verifying OTP.');
      return false;
    }
  };

  // const handleOTPChange = (text, index) => {
  //   const digit = text.replace(/[^0-9]/g, '').trim();
  //   const newOtp = [...otp];
  //   newOtp[index] = digit;
  //   setotp(newOtp);

  //   if (digit && index < otp.length - 1) {
  //     otpRefs.current[index + 1]?.focus();
  //   }
  //   if (!digit && text === '' && index > 0) {
  //     otpRefs.current[index - 1]?.focus();
  //   }

  // };

  const handleOTPChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, '').trim();
    const newOtp = [...otp];
    newOtp[index] = digit;
    setotp(newOtp);

    // Add haptic feedback for better UX
    if (digit) {
      // You can add haptic feedback here if available
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (digit && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
    if (!digit && text === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    const enteredOtp = otp.join('').trim();
    if (otp.every(d => d !== '') && enteredOtp.length === 4) {
      checkOtp();
    }
  }, [otp]);

  /*
  const varifyOtp = async () => {
    const enteredenteredOtp = otp.join('');
    if (enteredenteredOtp !== '') {
      if (enteredenteredOtp === Rotp) { // This comparison should ideally be done on the server
        setShowSubmit(0);
        setFilterDisplay(1);
        Alert.alert('OTP Matched.');
      } else {
        Alert.alert('OTP Not Match.');
      }
    } else {
      Alert.alert('Please Enter OTP.');
    }
  };
  */

  // This `Submit` function seems to be an alternative way to send OTP.
  // I'm assuming `FinalSubmit` is your primary signup/send OTP method.
  // If `Submit` is intended for resending OTP, it should use the `sendOtp` logic.
  /*
  const Submit = async () => {
    if (fullName !== '' && emailID !== '' && contactNumber !== '') {
      var formdata = { contactNumber: contactNumber, fullName: fullName };

      try {
        const ResData = await fetch('https://jobipo.com/api/Signup/sendOtp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formdata),
        }).then(res => res.json());

        // // console.log('Submit sendOtp response:', ResData);
        if (ResData && ResData.status === 1) {
          setRotp(ResData.msg);
          setFilterDisplay(0); // This might mean showing OTP input
        } else {
          Alert.alert(String(ResData.msg || 'Failed to send OTP.'));
        }
      } catch (err) {
        // // console.log('Submit sendOtp error:', err);
        Alert.alert('An error occurred while sending OTP.');
      }
    } else {
      Alert.alert('Please Fill All Data');
    }
  };
  */

  const sendOtp = async () => {
    dispatch(loadingShow(true));
    let obj = {
      fullName: accountReq?.fullName,
      emailID: accountReq?.emailID,
      contactNumber: accountReq?.contactNumber,
      uniqueCode: accountReq?.uniqueCode,
    };
    try {
      const ResData = await fetch('https://jobipo.com/api/Singup/sendOtp', {
        // Note: 'Singup' typo in your original URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      }).then(res => res.json());
      dispatch(loadingShow(false));
      // // console.log('sendOtp (resend) response:', ResData);
      if (ResData && ResData.status === 1) {
        setRotp(ResData.msg); // Store the OTP received from server (if your server returns it)
        setTimer(30); // Reset timer for resend
        setIsOtpSent(true); // Ensure OTP section is visible
        setotp(['', '', '', '']); // Clear previous OTP digits
        showToastMessage(ResData?.msg || 'OTP sent successfully.', 'success'); // Confirm OTP sent
      } else {
        dispatch(loadingShow(false));
        showToastMessage(ResData?.msg || 'Failed to resend OTP.');
      }
    } catch (err) {
      dispatch(loadingShow(false));
      // // console.log('sendOtp (resend) error:', err);
    }
  };

  // Timer useEffect with animation
  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            // Add a subtle animation when timer reaches 0
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 1.05,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
              }),
            ]).start();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer, scaleAnim]);

  // Keyboard event listeners for better Android support
  useEffect(() => {
    if (Platform.OS === 'android') {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          // Optional: Add any specific behavior when keyboard shows
        },
      );
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          // Optional: Add any specific behavior when keyboard hides
        },
      );

      return () => {
        keyboardDidShowListener?.remove();
        keyboardDidHideListener?.remove();
      };
    }
  }, []);

  // // console.log('isOtpSent:', isOtpSent);

  return (
    <View style={styles.Viewcontainer}>
      <KeyboardScroll
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}>
        <View style={styles.container}>
          {!isOtpSent && (
            <View style={{alignItems: 'center', padding: 36}}>
              <StepIndicator1 />

              <LogoS />
              <View style={styles.card}>
                <View style={styles.headcontainer}>
                  <Text style={styles.heading}>Get Your </Text>
                  <Text style={styles.heading}>
                    <Text style={styles.orangeText}>Dream Job</Text>
                    <Text style={styles.normalText}> Today</Text>
                  </Text>
                  <Text style={styles.subheading}>
                    Connect talent with opportunity
                  </Text>
                </View>

                <View style={styles.credContainer}>
                  <View style={styles.fieldContainer}>
                    <CommonTextInputs
                      placeholder="Your Name"
                      keyboardType={'default'}
                      returnKeyType={'done'}
                      paddingLeft={10}
                      onChangeText={value => {
                        methodSetupAccountRequest('fullName', value);
                      }}
                      value={accountReq?.fullName}
                      maxLength={50}
                      isErrorMsg={accountReq.validators.fullName.error}
                      errorFontSize={12}
                    />
                  </View>

                  <View style={styles.fieldContainer}>
                    <CommonTextInputs
                      placeholder="Email"
                      keyboardType={'email-address'}
                      returnKeyType={'done'}
                      paddingLeft={10}
                      onChangeText={value => {
                        methodSetupAccountRequest('emailID', value);
                      }}
                      value={accountReq?.emailID}
                      maxLength={50}
                      isErrorMsg={accountReq.validators.emailID.error}
                      errorFontSize={12}
                    />
                  </View>

                  <View
                    style={[
                      ShowSubmit === 0 ? {display: 'none'} : {display: 'flex'},
                    ]}>
                    <View style={styles.fieldContainer}>
                      <CommonTextInputs
                        placeholder="Mobile Number"
                        keyboardType={'numeric'}
                        returnKeyType={'done'}
                        paddingLeft={10}
                        onChangeText={value => {
                          methodSetupAccountRequest('contactNumber', value);
                        }}
                        fontSize={accountReq?.contactNumber ? 15 : 14}
                        value={accountReq?.contactNumber}
                        maxLength={10}
                        isErrorMsg={accountReq.validators.contactNumber.error}
                        errorFontSize={12}
                      />
                    </View>
                  </View>

                  <View style={styles.fieldContainer}>
                    <CommonTextInputs
                      placeholder="Refer Code (Optional)"
                      keyboardType={'default'}
                      returnKeyType={'done'}
                      paddingLeft={10}
                      onChangeText={value => {
                        methodSetupAccountRequest('uniqueCode', value);
                      }}
                      fontSize={accountReq?.uniqueCode ? 15 : 14}
                      value={accountReq?.uniqueCode}
                      maxLength={50}
                      errorFontSize={12}
                    />
                  </View>
                </View>

                <View style={styles.extraInfo}>
                  <Text style={styles.extraTextt}>
                    By Continuing, you agree to our{' '}
                    <Text
                      style={styles.Textblue}
                      onPress={() =>
                        Linking.openURL(
                          'https://jobipo.com/Account/privacy-policy.html',
                        )
                      }>
                      Privacy Policy
                    </Text>{' '}
                    and{' '}
                    <Text
                      style={styles.Textblue}
                      onPress={() =>
                        Linking.openURL('https://jobipo.com/terms-services')
                      }>
                      Terms & Conditions
                    </Text>
                    .
                  </Text>
                </View>

                <View style={styles.extraInfo}>
                  <Pressable
                    onPress={() => setterms(terms === 0 ? 1 : 0)}
                    style={[
                      styles.checkbox,
                      {backgroundColor: terms === 1 ? '#FF8D53' : '#fff'},
                    ]}>
                    {terms === 1 && (
                      <Icon name="check" size={16} color="#fff" />
                    )}
                  </Pressable>
                  <Text style={styles.extraText}>
                    I hereby authorize to send notification on
                    SMS/Messages/Promotional/Informational messages
                  </Text>
                </View>

                <View style={styles.continuebtn}>
                  <Button
                    style={styles.continuesavebtn}
                    // onPress={() => {
                    //   navigation.navigate('RegistrationP');
                    // }}
                    onPress={CreateUser}
                    text="Continue"
                  />
                </View>

                <View style={styles.lastInfo}>
                  <Text style={styles.lastInfoText}>You have an account?</Text>
                  <Pressable onPress={() => navigation.navigate('Login')}>
                    <Text
                      style={[
                        styles.lastInfoText,
                        {
                          marginLeft: 10,
                          fontWeight: 'bold',
                          backgroundColor: '#ffffff',
                          paddingHorizontal: 8,
                          borderRadius: 10,
                        },
                      ]}>
                      Log In
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          <View>
            {isOtpSent && (
              <Animated.View
                style={[
                  styles.otpMainContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{scale: scaleAnim}, {translateY: slideAnim}],
                  },
                ]}>
                <Animated.View style={styles.otpCard}>
                  {/* Header Section */}
                  <View style={styles.otpHeader}>
                    <View style={styles.otpIconContainer}>
                      <Icon name="sms" size={32} color="#FF8D53" />
                    </View>
                    <Text style={styles.otpTitle}>Verify Your Phone</Text>
                    <Text style={styles.otpSubtitle}>
                      We've sent a 4-digit code to
                    </Text>
                    <View style={styles.phoneNumberContainer}>
                      <Text style={styles.phoneNumber}>
                        +91 - {accountReq?.contactNumber}
                      </Text>
                      <Pressable
                        style={styles.editButton}
                        onPress={() => {
                          setIsOtpSent(false);
                          setotp(['', '', '', '']);
                          setTimer(30);
                        }}>
                        <Icon name="edit" size={16} color="#FF8D53" />
                        <Text style={styles.editText}>Edit</Text>
                      </Pressable>
                    </View>
                  </View>

                  {/* OTP Input Section */}
                  <View style={styles.otpInputSection}>
                    <Text style={styles.otpLabel}>Enter Verification Code</Text>
                    <View style={styles.otpContainer}>
                      {otp.map((digit, index) => (
                        <View key={index} style={styles.otpInputWrapper}>
                          <TextInput
                            value={digit}
                            onChangeText={text => handleOTPChange(text, index)}
                            maxLength={1}
                            keyboardType="numeric"
                            style={[
                              styles.otpBox,
                              digit !== '' && styles.otpBoxFilled,
                              index === otp.findIndex(d => d === '') &&
                                styles.otpBoxActive,
                            ]}
                            ref={ref => (otpRefs.current[index] = ref)}
                            onKeyPress={({nativeEvent}) => {
                              if (
                                nativeEvent.key === 'Backspace' &&
                                otp[index] === '' &&
                                index > 0
                              ) {
                                otpRefs.current[index - 1]?.focus();
                              }
                            }}
                            onFocus={() => {
                              // Clear all digits after current index when focusing
                              const newOtp = [...otp];
                              for (let i = index + 1; i < otp.length; i++) {
                                newOtp[i] = '';
                              }
                              setotp(newOtp);
                            }}
                          />
                          {index < otp.length - 1 && (
                            <View style={styles.otpSeparator} />
                          )}
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Timer and Resend Section */}
                  <View style={styles.timerSection}>
                    {timer > 0 ? (
                      <View style={styles.timerContainer}>
                        <Icon name="access-time" size={16} color="#666" />
                        <Text style={styles.timerText}>
                          Resend code in {Math.floor(timer / 60)}:
                          {String(timer % 60).padStart(2, '0')}
                        </Text>
                      </View>
                    ) : (
                      <Pressable style={styles.resendButton} onPress={sendOtp}>
                        <Icon name="refresh" size={16} color="#FF8D53" />
                        <Text style={styles.resendText}>Resend Code</Text>
                      </Pressable>
                    )}
                  </View>

                  {/* Help Text */}
                  <View style={styles.helpSection}>
                    <Text style={styles.helpText}>
                      Didn't receive the code? Check your SMS or{' '}
                      <Text style={styles.helpLink}>try again</Text>
                    </Text>
                  </View>
                </Animated.View>
              </Animated.View>
            )}
          </View>
        </View>
      </KeyboardScroll>
    </View>
  );
};

const styles = StyleSheet.create({
  Viewcontainer: {
    flex: 1,
    backgroundColor: '#F5F4FD',
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    alignItems: 'center',

    justifyContent: 'center',
  },
  // card: {
  //   width: '90%',
  //   backgroundColor: '#fff',
  //   borderRadius: 10,
  //   padding: 20,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 8,
  //   elevation: 5,
  // },
  headcontainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    color: '#center',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '400',
  },
  orangeText: {
    color: '#FF8D53',
  },

  normalText: {
    color: '#000',
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FF8D53',
    marginTop: 16,
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  active: {
    backgroundColor: '#FF8D53',
    // borderRadius: 25,
  },
  inactive: {
    backgroundColor: '#fff',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  toggleTextInactive: {
    color: '#FF8D53',
    fontWeight: 'bold',
    fontSize: 16,
  },

  credContainer: {
    // marginBottom: 10,
    marginTop: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  textInput: {
    padding: 10,
    fontSize: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
  },
  extraInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap', // Allow text to wrap
  },
  extraTextt: {
    fontSize: 13,
    color: '#585858',
    fontWeight: '400',
  },
  Textblue: {
    color: '#FF8D53',
    fontWeight: '400',
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderWidth: 0.6,
    borderColor: '#FF8D53',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraText: {
    flex: 1,
    fontSize: 10,
    color: '#555',
  },
  continuebtn: {
    marginTop: 20,
  },
  continuesavebtn: {
    backgroundColor: '#FF8D53',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  lastInfoText: {
    fontSize: 14,
    color: '#555',
  },

  // Professional OTP Design Styles
  otpMainContainer: {
    flex: 1,
    // width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    // marginTop: 80,
  },
  otpCard: {
    // width: '90%',
    maxWidth: Dimensions.get('window').width - 60,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 8},
    // shadowOpacity: 0.1,
    // shadowRadius: 20,
    // elevation: 10,
    alignItems: 'center',
    alignSelf: 'center',
    // marginVertical: 20,
  },
  otpHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  otpIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  otpTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  otpSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
    textAlign: 'center',
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#FFF5F0',
  },
  editText: {
    fontSize: 14,
    color: '#FF8D53',
    fontWeight: '500',
    marginLeft: 4,
  },
  otpInputSection: {
    width: '100%',
    marginBottom: 30,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  otpInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#E5E5E5',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  otpBoxFilled: {
    borderColor: '#FF8D53',
    backgroundColor: '#FFF5F0',
    shadowColor: '#FF8D53',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  otpBoxActive: {
    borderColor: '#FF8D53',
    backgroundColor: '#ffffff',
    shadowColor: '#FF8D53',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  otpSeparator: {
    width: 6,
    height: 2,
    backgroundColor: '#E5E5E5',
    borderRadius: 1,
    marginHorizontal: 1,
  },
  timerSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
  },
  timerText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    marginLeft: 6,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF5F0',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF8D53',
  },
  resendText: {
    color: '#FF8D53',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  helpSection: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: 13,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 18,
  },
  helpLink: {
    color: '#FF8D53',
    fontWeight: '500',
  },
  buttonBase: {
    // Base style for the custom Button component
    // Defined in continuesavebtn and applybtn
  },
});

export default Register;
