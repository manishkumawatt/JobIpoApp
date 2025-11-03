import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const RegisterScreen = ({navigation}) => {
  const [fullName, setfullName] = useState('');
  const [emailID, setemailID] = useState('');
  const [contactNumber, setcontactNumber] = useState('');
  const [uniqueCode, setuniqueCode] = useState('');
  const [terms, setterms] = useState(0);

  const sendOtp = async () => {
    if (fullName && emailID && contactNumber) {
      const formdata = {contactNumber, emailID, fullName};
      try {
        const res = await fetch('https://jobipo.com/api/Singup/sendOtp', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formdata),
        });
        const data = await res.json();
        // // console.log('sendotpresponse', data);

        if (data.status === 1) {
          Alert.alert('OTP Sent', data.msg);
          await AsyncStorage.setItem('UserID', String(data.UserID));
          const storedUserId = await AsyncStorage.getItem('UserID');
          // // console.log('Saved userId in AsyncStorage:', storedUserId);
          navigation.navigate('OtpVerifyScreen', {
            fullName,
            emailID,
            contactNumber,
            uniqueCode,
            otpServer: data.msg,
          });
        } else {
          Alert.alert('Error', data.msg);
        }
      } catch (err) {
        Alert.alert('Network error');
      }
    } else {
      Alert.alert('Please fill all fields');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headcontainer}>
          <Text style={styles.heading}>Get Your Dream Job Today</Text>
          <Text style={styles.subheading}>Connect talent with opportunity</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.toggleContainer}>
            <Pressable
              style={[
                styles.toggleBtn,
                styles.inactive, // Always inactive
                {flex: 1},
              ]}
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Text style={styles.toggleTextInactive}>Login</Text>
            </Pressable>

            <Pressable
              style={[styles.toggleBtn, styles.active, {flex: 1}]}
              onPress={() => {
                navigation.navigate('Register');
              }}>
              <Text style={styles.toggleTextActive}>Sign Up</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setfullName}
            style={styles.input}
            placeholder="Enter your full name"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={emailID}
            onChangeText={setemailID}
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            value={contactNumber}
            onChangeText={setcontactNumber}
            style={styles.input}
            placeholder="Enter mobile number"
            keyboardType="phone-pad"
            maxLength={10}
          />

          <Text style={styles.label}>Referral Code (Optional)</Text>
          <TextInput
            value={uniqueCode}
            onChangeText={setuniqueCode}
            style={styles.input}
            placeholder="Enter referral code"
          />
          <View style={styles.extraInfo}>
            <Pressable
              onPress={() => {
                terms == 0 ? setterms(1) : setterms(0);
              }}
              style={[
                styles.checkbox,
                terms == 0
                  ? {backgroundColor: '#fff'}
                  : {backgroundColor: '#0d4574'},
              ]}></Pressable>

            <Text style={styles.extraText}>
              I hereby authorize to send notification on
              SMS/Messages/Promotional/Informational messages
            </Text>
          </View>

          <Pressable style={styles.button} onPress={sendOtp}>
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    marginLeft: 8,
    fontSize: 12,
    marginBottom: 6,
    color: '#000',
    fontWeight: '700',
    marginTop: 10,
  },
  input: {
    marginVertical: 5,
    backgroundColor: '#F8F8F8',
    paddingLeft: 10,
    color: '#333',
    borderRadius: 10,
    borderColor: '#cceeff',
    backgroundColor: '#e6f7ff',
    borderWidth: 0.7,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headcontainer: {
    marginVertical: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000080',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000080',
    marginVertical: 10,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 5,
  },

  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#0d4574',
    marginTop: 16,
    width: '75%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  active: {
    backgroundColor: '#0d4574',
    borderRadius: 25,
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
    color: '#0d4574',
    fontWeight: 'bold',
    fontSize: 16,
  },
  applybtn: {
    backgroundColor: '#0d4574',
    color: '#fff',
    width: '70%',
    borderRadius: 5,
    minHeight: 20,
    marginLeft: '15%',
    paddingVertical: 10,
    marginVertical: 60,
  },
  checkbox: {
    width: 22,
    height: 22,
    marginRight: 11,
    borderRadius: 4,
    elevation: 4,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowRadius: 0.6,
    backgroundColor: '#f8f8f8',
    borderColor: '#ccc',
    borderWidth: 0.7,
  },
  extraInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  extraText: {
    fontSize: 10,
  },
});

export default RegisterScreen;
