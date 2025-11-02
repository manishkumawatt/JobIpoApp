import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const OtpVerifyScreen = ({ route, navigation }) => {
  const { fullName, emailID, contactNumber, uniqueCode, otpServer } = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const otpRefs = useRef([]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 3) otpRefs.current[index + 1]?.focus();
  };

  const handleVerify = async () => {
    if (otp.join('') === otpServer) {
      const formData = {
        fullName,
        emailID,
        contactNumber,
        uniqueCode,
        otp: otp.join(''),
      };
      try {
        const res = await fetch('https://jobipo.com/api/v2/sign-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.status === 1) {
          await AsyncStorage.setItem('UserID', String(data.UserID));
          Alert.alert('Registration successful');
          navigation.replace('RegistrationP'); 
        } else {
          Alert.alert(data.msg);
        }
      } catch (err) {
        Alert.alert("Error submitting form");
      }
    } else {
      Alert.alert("OTP not matched");
    }
  };
useFocusEffect(
  React.useCallback(() => {
    // Reset state when coming back to screen
    setOtp(['', '', '', '']);
    setTimer(30);

    // Optional: Focus the first input again
    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 100);

    return () => {}; // cleanup if needed
  }, [])
);

  const sendOtp = async () => {
  try {
    const res = await fetch('https://jobipo.com/api/Singup/sendOtp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactNumber,
        emailID,
        fullName
      }),
    });
    const data = await res.json();
    if (data.status === 1) {
      Alert.alert('OTP Sent', data.msg);

      // Reset OTP input
      setOtp(['', '', '', '']);
      setTimer(30);
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
      setIsOtpSent(true);
    } else {
      Alert.alert('Error', data.msg);
    }
  } catch (error) {
    Alert.alert('Network Error');
  }
};


  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>Enter the 4-digit code sent to your mobile</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              ref={ref => otpRefs.current[index] = ref}
              style={styles.otpInput}
            />
          ))}
        </View>

        <Text style={styles.timerText}>
          {timer > 0 ? `Resend OTP in ${timer}s` : 'Didn’t receive OTP? Resend'}
        </Text>
       <Pressable
        disabled={timer > 0}
        style={[
          styles.resendButton,
          { opacity: timer > 0 ? 0.5 : 1 }
        ]}
        onPress={sendOtp}>
        <Text style={styles.verifyButtonText}>Resend OTP</Text>
      </Pressable>
      
      <Pressable
                    onPress={() => {
                      setotp('');
                      setIsOtpSent(false);
                    }}
                    style={{
                      backgroundColor: '#0d4574',
                      height: 48,
                      width: '48.5%',
                      marginTop: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff', textAlign: 'center', fontSize: 15 }}>Edit Detials</Text>
                  </Pressable>
        <Pressable style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Verify OTP</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OtpVerifyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  resendButton: {
  marginTop: 20,
  backgroundColor: '#0d4574',
  paddingVertical: 14,
  borderRadius: 8,
  alignItems: 'center',
},

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  otpInput: {
    borderBottomWidth: 2,
    borderColor: '#007AFF',
    width: 50,
    height: 60,
    textAlign: 'center',
    fontSize: 22,
    borderRadius: 8,
  },
  timerText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#888',
  },
  verifyButton: {
    marginTop: 30,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
