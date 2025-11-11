import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import Logo from '../../components/Auth/Logo';
import {ValidateForm} from '../../utils/validation/validation';
import {showToastMessage} from '../../utils/Toast';
import {useDispatch} from 'react-redux';
import {loadingShow} from '../../appRedux/actions/loadingAction';
import {CommonTextInputs, KeyboardScroll} from '../../component';
import SmsRetriever, {
  useSMSRetriever,
} from '@ebrimasamba/react-native-sms-retriever';

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [accountReq, setAccountReq] = useState({
    contactNumber: '',
    validators: {
      contactNumber: {
        type: 'mobile_number',
        error: '',
        required: true,
      },
    },
  });
  // Safe SMS retriever implementation with error handling
  const smsRetrieverData = useSMSRetriever();
  const {appHash, smsCode} = smsRetrieverData || {};

  // Safe logging with null checks
  if (__DEV__) {
    console.log('appHash----login', appHash);
    // console.log('smsCode----', smsCode);
  }

  // Safe SMS retriever start function
  // Note: SMS Retriever API doesn't require SMS permissions
  const startSmsRetriever = async () => {
    if (Platform.OS !== 'android') return;

    try {
      await SmsRetriever.startSmsRetriever();
      if (__DEV__) {
        console.log('SMS retriever started successfully login');
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to start SMS retriever:', error);
      }
    }
  };
  useEffect(() => {
    startSmsRetriever();

    // Fallback: Retry SMS retriever after 2 seconds if it fails initially
    const retryTimeout = setTimeout(() => {
      startSmsRetriever();
    }, 2000);

    return () => clearTimeout(retryTimeout);
  }, []);
  const CreateUser = async () => {
    let validForm = ValidateForm(accountReq);
    setAccountReq({...accountReq}, validForm.value);
    // // console.log('accountReq', accountReq);
    // // console.log('validForm---', validForm);
    if (validForm.status) {
      Keyboard.dismiss();
      let dic = {...accountReq};
      delete dic.validators;

      let obj = {
        username: accountReq?.contactNumber,
        appHash: appHash,
      };
      dispatch(loadingShow(true));
      try {
        const res = await fetch('https://jobipo.com/api/v2/send-login-otp', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(obj),
        });
        console.log('resresresresres', res);
        dispatch(loadingShow(false));
        const resData = await res.json();
        if (resData.status === 1) {
          navigation.navigate('OtpScreen', {
            username: accountReq?.contactNumber,
          });
        } else {
          dispatch(loadingShow(false));
          showToastMessage(resData?.message);
        }
      } catch (err) {
        dispatch(loadingShow(false));
      }
    }
  };

  const methodSetupAccountRequest = (key, value) => {
    let newValue = value.replace(/ /g, '');
    let dic = {...accountReq};
    dic[key] = newValue;
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = '';
    }

    setAccountReq(dic);
  };
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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0d4574" />
      </View>
    );
  }
  return (
    <View
      style={{flex: 1, justifyContent: 'center', backgroundColor: '#F5F4FD'}}>
      <KeyboardScroll
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Logo />
          </View>

          <View style={styles.heading}>
            <Text style={styles.h1}>Let’s get started</Text>
            <Text style={styles.h2}>Welcome Back!</Text>
            <Text style={styles.h2}>You’ve been missed</Text>
          </View>

          <View style={styles.credContainer}>
            <CommonTextInputs
              placeholder="Mobile Number"
              keyboardType={'numeric'}
              returnKeyType={'done'}
              paddingLeft={10}
              onChangeText={value => {
                methodSetupAccountRequest('contactNumber', value);
              }}
              value={accountReq?.contactNumber}
              maxLength={15}
              isErrorMsg={accountReq.validators.contactNumber.error}
            />

            {/* <View style={styles.button}>
                {loading ? (
                  <ActivityIndicator size="large" color="#0d4574" />
                ) : (
                  <TouchableOpacity style={styles.cbutton} onPress={sendOtp}>
                    <Text style={styles.buttonText}>Send OTP</Text>
                  </TouchableOpacity>
                )}
              </View> */}
            <View style={styles.button}>
              <TouchableOpacity style={styles.cbutton} onPress={CreateUser}>
                <Text style={styles.buttonText}>Send OTP</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.lastInfo}>
            <Text style={styles.lastInfoText}>Don’t have an account?</Text>
            {/* <Pressable
              onPress={() =>
                navigation.navigate('RegistrationS', {fromOtpParam: ''})
              }> */}
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text
                style={[
                  styles.lastInfoText,
                  {marginLeft: 5, fontWeight: 'bold'},
                ]}>
                Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardScroll>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F4FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  logoContainer: {
    marginTop: '40%',
  },
  heading: {
    alignItems: 'center',
    width: '100%',
  },
  h1: {
    fontSize: 35,
    fontWeight: 'bold',
    lineHeight: 56,
    color: '#000000',
  },
  h2: {
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 30,
    color: '#585858',
  },
  credContainer: {
    marginTop: 40,
    width: '100%',
  },
  textInput: {
    marginVertical: 7.5,
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    color: '#333',
    // borderRadius: 10,
    // borderColor: '#ccc',
    // borderWidth: 0.7,
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
  },
  cbutton: {
    backgroundColor: '#FF8D53',
    paddingVertical: 10,
    // paddingHorizontal: 10,
    borderRadius: 25,
    width: '70%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  lastInfo: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 26,
  },
  lastInfoText: {
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
