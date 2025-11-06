import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Platform,
  Keyboard,
  AppState,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../../context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {showToastMessage} from '../../utils/Toast';
import {KeyboardScroll} from '../../component';
import BackgroundTimer from 'react-native-background-timer';
import SmsRetriever, {
  useSMSRetriever,
} from '@ebrimasamba/react-native-sms-retriever';

const {width, height} = Dimensions.get('window');

const OtpScreen = ({route, navigation}) => {
  const {username, registerObj} = route?.params || '';
  const {signIn} = useContext(AuthContext);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const otpInputs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const backgroundTimerRef = useRef(null);
  const timerStartTime = useRef(Date.now());
  const backgroundTime = useRef(null);
  const regularTimerRef = useRef(null);

  // Safe SMS retriever implementation with error handling
  const smsRetrieverData = useSMSRetriever();
  const {appHash, smsCode} = smsRetrieverData || {};

  // Safe logging with null checks
  if (__DEV__) {
    console.log('appHash----', appHash);
    // console.log('smsCode----', smsCode);
  }

  // Safe SMS retriever start function
  // Note: SMS Retriever API doesn't require SMS permissions
  const startSmsRetriever = async () => {
    if (Platform.OS !== 'android') return;

    try {
      await SmsRetriever.startSmsRetriever();
      if (__DEV__) {
        // console.log('SMS retriever started successfully');
      }
    } catch (error) {
      if (__DEV__) {
        // console.warn('Failed to start SMS retriever:', error);
      }
    }
  };

  // Handle SMS code changes safely
  useEffect(() => {
    if (smsCode && typeof smsCode === 'string' && smsCode.length >= 4) {
      try {
        // Extract OTP from SMS code (assuming it's a 4-digit number)
        const extractedOtp = smsCode.match(/\d{4}/);
        if (extractedOtp && extractedOtp[0]) {
          const otpDigits = extractedOtp[0].split('');
          if (otpDigits.length === 4) {
            setOtp(otpDigits);
            // Auto-submit OTP after a short delay
            setTimeout(() => {
              Submit(extractedOtp[0]);
            }, 500);
          }
        }
      } catch (error) {
        if (__DEV__) {
          // console.warn('Error processing SMS code:', error);
        }
      }
    }
  }, [smsCode]);

  // Start SMS retriever when component mounts
  useEffect(() => {
    startSmsRetriever();

    // Fallback: Retry SMS retriever after 2 seconds if it fails initially
    const retryTimeout = setTimeout(() => {
      startSmsRetriever();
    }, 2000);

    return () => clearTimeout(retryTimeout);
  }, []);

  // console.log('SmsRetriever----', SmsRetriever.getAppHash().then(console.log));
  // // console.log('OtpScreen - route params:', route?.params);
  // // console.log('OtpScreen - username received:', username);
  const handleOTPChange = (text, index) => {
    const newOtp = [...otp];
    if (text === '') {
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) otpInputs.current[index - 1]?.focus();
      return;
    }
    if (!/^\d$/.test(text)) return;

    newOtp[index] = text;
    setOtp(newOtp);
    if (index < 3) otpInputs.current[index + 1]?.focus();

    if (index === 3) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === 4) Submit(fullOtp);
    }
  };

  const Submit = async (autoOtp = null) => {
    console.log('submit----', registerObj);
    const currentOtp = autoOtp || otp.join('');
    const formdata = {
      username,
      appHash: appHash,
      otp: currentOtp,
      ...registerObj,
    };
    setIsLoading(true);
    let dic = {
      mobile: registerObj?.mobile,
      otp: currentOtp,
      appHash: appHash,
      ...registerObj,
    };

    console.log('1902021091290109', dic);
    if (registerObj) {
      try {
        const ResData = await fetch(
          'https://jobipo.com/api/v3/candidate-verify-otp',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
            },
            body: JSON.stringify(dic),
          },
        );
        const response = await ResData.json();
        if (response?.success) {
          // Alert.alert('OTP Verified Successfully');
          if (response?.userId) {
            await AsyncStorage.setItem('UserID', String(response.userId));
          }
          showToastMessage(response?.message, 'success');

          navigation.navigate('RegistrationP', {fromOtpParam: response});
          return true;
        } else {
          showToastMessage(response?.message || 'Invalid OTP.');
          return false;
        }
      } catch (err) {
        showToastMessage('An error occurred while verifying OTP.');
        return false;
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('formdata-=--=-', formdata);
      try {
        const response = await fetch('https://jobipo.com/api/v2/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formdata),
        });

        const ResData = await response.json();
        if (ResData?.status == 1 || ResData?.type == 'success') {
          showToastMessage(ResData?.message, 'success');

          if (ResData.user_id) {
            await AsyncStorage.setItem('UserID', String(ResData.user_id));
          }
          if (ResData.token) {
            await AsyncStorage.setItem('Token', String(ResData.token));
            await signIn(String(ResData.token), username);
          }
        } else {
          showToastMessage(ResData?.message);
        }
        // // console.log('ResData---1----', ResData);
      } catch (err) {
        // // console.log('errerrerr', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resendSignUpOtp = async () => {
    // // console.log('username-==-==-', username);
    let obj = {
      fullName: registerObj?.fullName,
      email: registerObj?.email,
      mobile: registerObj?.mobile,
      referCode: registerObj?.referCode,
      notificationConsent: 1,
      is_sms_enable: registerObj?.terms ? 1 : 0,
      appHash: appHash,
    };
    try {
      const res = await fetch('https://jobipo.com/api/v3/sign-up-process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
        },
        body: JSON.stringify(obj),
      });
      const data = await res.json();
      if (data?.status === 1 || data?.success) {
        // Clear existing timers before setting new one
        if (backgroundTimerRef.current) {
          BackgroundTimer.clearInterval(backgroundTimerRef.current);
          backgroundTimerRef.current = null;
        }
        if (regularTimerRef.current) {
          clearInterval(regularTimerRef.current);
          regularTimerRef.current = null;
        }
        timerStartTime.current = Date.now();
        setTimer(30);
        showToastMessage(data?.message, 'success');
      } else {
        showToastMessage(data?.message);
      }
    } catch (error) {}
  };
  const resendOtp = async () => {
    let obj = {
      username: username,
      appHash: appHash,
    };
    console.log('obj----', obj);
    try {
      const res = await fetch('https://jobipo.com/api/v2/send-login-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });
      const data = await res.json();
      if (data?.status === 1 || data?.success) {
        // Clear existing timers before setting new one
        if (backgroundTimerRef.current) {
          BackgroundTimer.clearInterval(backgroundTimerRef.current);
          backgroundTimerRef.current = null;
        }
        if (regularTimerRef.current) {
          clearInterval(regularTimerRef.current);
          regularTimerRef.current = null;
        }
        timerStartTime.current = Date.now();
        setTimer(30);
        showToastMessage(data?.message, 'success');
      } else {
        showToastMessage(data?.message);
      }
    } catch (error) {}
  };

  // AppState monitoring for background/foreground transitions
  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'background') {
        backgroundTime.current = Date.now();
      } else if (nextAppState === 'active' && backgroundTime.current) {
        const timeInBackground = Date.now() - backgroundTime.current;
        const elapsedSeconds = Math.floor(timeInBackground / 1000);

        setTimer(prevTimer => {
          const newTimer = prevTimer - elapsedSeconds;
          const finalTimer = newTimer > 0 ? newTimer : 0;
          return finalTimer;
        });

        backgroundTime.current = null;
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, []);

  // Cleanup timer and SMS retriever on component unmount
  useEffect(() => {
    return () => {
      if (backgroundTimerRef.current) {
        BackgroundTimer.clearInterval(backgroundTimerRef.current);
        backgroundTimerRef.current = null;
      }
      if (regularTimerRef.current) {
        clearInterval(regularTimerRef.current);
        regularTimerRef.current = null;
      }

      // Cleanup SMS retriever
      if (Platform.OS === 'android') {
        try {
          SmsRetriever.removeSmsListener();
        } catch (error) {
          if (__DEV__) {
            // console.warn('Error removing SMS listener:', error);
          }
        }
      }
    };
  }, []);

  useEffect(() => {
    // Animation on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Hybrid timer functionality - works in both foreground and background
  useEffect(() => {
    const startTimer = () => {
      // Clear any existing timers
      if (backgroundTimerRef.current) {
        BackgroundTimer.clearInterval(backgroundTimerRef.current);
        backgroundTimerRef.current = null;
      }
      if (regularTimerRef.current) {
        clearInterval(regularTimerRef.current);
        regularTimerRef.current = null;
      }

      if (timer > 0) {
        // Try background timer first
        try {
          backgroundTimerRef.current = BackgroundTimer.setInterval(() => {
            setTimer(prev => {
              if (prev <= 1) {
                BackgroundTimer.clearInterval(backgroundTimerRef.current);
                backgroundTimerRef.current = null;
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } catch (error) {
          // Fallback to regular timer
          regularTimerRef.current = setInterval(() => {
            setTimer(prev => {
              if (prev <= 1) {
                clearInterval(regularTimerRef.current);
                regularTimerRef.current = null;
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      }
    };

    startTimer();

    return () => {
      if (backgroundTimerRef.current) {
        BackgroundTimer.clearInterval(backgroundTimerRef.current);
        backgroundTimerRef.current = null;
      }
      if (regularTimerRef.current) {
        clearInterval(regularTimerRef.current);
        regularTimerRef.current = null;
      }
    };
  }, [timer]);

  const handleEdit = () => {
    setOtp(['', '', '', '']);
    if (registerObj) {
      navigation?.navigate('Register');
    } else {
      navigation?.navigate('Login');
    }
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

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardScroll
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}>
        <View style={{height: '5%'}} />
        {/* <StatusBar barStyle="dark-content" backgroundColor="#faf9f8" /> */}
        <LinearGradient
          colors={['#F8F9FA', '#fdece3']}
          style={styles.gradientContainer}>
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{translateY: slideAnim}],
              },
            ]}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.iconContainer}>
                <View style={styles.otpIcon}>
                  <Text style={styles.otpIconText}>🔐</Text>
                </View>
              </View>
              <Text style={styles.mainTitle}>Verify Your Phone</Text>
              <Text style={styles.subTitle}>
                We've sent a verification code to
              </Text>
              <View style={styles.phoneContainer}>
                <Text style={styles.phoneNumber}>
                  {registerObj ? registerObj?.mobile : username}
                </Text>
                <TouchableOpacity
                  onPress={handleEdit}
                  style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* OTP Input Section */}
            <View style={styles.otpSection}>
              <Text style={styles.otpLabel}>Enter Verification Code</Text>
              <View style={styles.otpBox}>
                {otp.map((digit, index) => (
                  <View key={index} style={styles.otpInputContainer}>
                    <TextInput
                      ref={ref => (otpInputs.current[index] = ref)}
                      value={digit}
                      style={[
                        styles.otpInput,
                        digit ? styles.otpInputFilled : null,
                      ]}
                      keyboardType="numeric"
                      maxLength={1}
                      onChangeText={text => handleOTPChange(text, index)}
                      selectTextOnFocus
                      caretHidden={true}
                      textContentType={
                        Platform.OS === 'ios' ? 'oneTimeCode' : 'none'
                      }
                      autoComplete={Platform.OS === 'ios' ? 'sms-otp' : 'off'}
                    />
                  </View>
                ))}
              </View>
            </View>

            {/* Timer and Resend Section */}
            <View style={styles.timerSection}>
              {timer > 0 ? (
                <View style={styles.timerContainer}>
                  <Text style={styles.timerText}>
                    Resend code in {formatTime(timer)}
                  </Text>
                  <View style={styles.timerBar}>
                    <View
                      style={[
                        styles.timerProgress,
                        {width: `${(timer / 30) * 100}%`},
                      ]}
                    />
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={registerObj ? resendSignUpOtp : resendOtp}
                  disabled={isLoading}>
                  <Text style={styles.resendButtonText}>
                    {isLoading ? 'Sending...' : 'Resend Code'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Loading Indicator */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingSpinner} />
                <Text style={styles.loadingText}>Verifying...</Text>
              </View>
            )}
          </Animated.View>
        </LinearGradient>
      </KeyboardScroll>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  gradientContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },

  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  otpIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  otpIconText: {
    fontSize: 32,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF8D53',
    borderRadius: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // OTP Section
  otpSection: {
    marginBottom: 40,
  },
  otpLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 24,
  },
  otpBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  otpInputContainer: {
    position: 'relative',
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    color: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  otpInputFilled: {
    borderColor: '#FF8D53',
    backgroundColor: '#FFF5F0',
  },

  // Timer Section
  timerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  timerText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  timerBar: {
    width: '80%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    backgroundColor: '#FF8D53',
    borderRadius: 2,
  },
  resendButton: {
    backgroundColor: '#FF8D53',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#FF8D53',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  resendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Loading Section
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: '#E0E0E0',
    borderTopColor: '#FF8D53',
    borderRadius: 20,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
});
