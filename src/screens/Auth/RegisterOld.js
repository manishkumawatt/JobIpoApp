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
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Input from '../../components/Auth/Input';
import Button from '../../components/Auth/Button';
import Logo from '../../components/Auth/Logo';

const RegisterOld = ({ navigation }) => {
  const [fullName, setfullName] = useState('');
  const [emailID, setemailID] = useState('');
  const [contactNumber, setcontactNumber] = useState('');
  const [city, setcity] = useState('');
  const [passwordc, setpasswordc] = useState('');
  const [password, setPassword] = useState('');
  const [uniqueCode, setuniqueCode] = useState('');
  const [terms, setterms] = useState(0);
  // const [otp, setotp] = useState('');
  const [otp, setotp] = useState(Array(4).fill(''));
  const [Rotp, setRotp] = useState('');
  const [FilterDisplay, setFilterDisplay] = useState(1);
  const [ShowSubmit, setShowSubmit] = useState(1);
  const [timer, setTimer] = useState(30);
  const [isOtpSent, setIsOtpSent] = useState(false);
const [activeTab, setActiveTab] = useState('signup'); 
const [isNotificationAllowed, setIsNotificationAllowed] = useState(false);



  const FinalSubmit = async () => {
    // // console.log('otp', otp);
    if (fullName != "" && emailID != "" && contactNumber != "" && terms == 1) {
      var formdata = {
        'fullName': fullName,
        'emailID': emailID,
        'contactNumber': contactNumber,
        // 'city': city,
        // 'password': password,
        'uniqueCode': uniqueCode,
        otp: otp.join(''),
      };

      //  const res = await checkOtp()


      const ResData = await fetch(
        'https://jobipo.com/api/Singup/singupFrist',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formdata),
        },
      )
        .then(res => res.json())
        .catch(err => setPayLoad(false));

      // // console.log(ResData);
      if (ResData.status == 1) {
        Alert.alert(String(ResData.msg));
        navigation.navigate('Login')
      } else {
        Alert.alert(String(ResData.msg));
      }
    } else {
      Alert.alert("Please Fill All Data");
    }
  };

  const checkOtp = async () => {
    if (otp != "" && terms == 1) {
      var formdata = {
        'contactNumber': contactNumber,
        otp,
      };

      const res = await fetch(
        'https://jobipo.com/api/Singup/checkOtp',
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
          Alert.alert('An error occurred while verifying OTP.');
        });

      // // console.log('checkotp', res);

      if (res.status == 1) {
        return true
      } else {
        return false
      }
    }
  }



  const handleOTPChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setotp(newOtp);

    if (text && index < 3) {
      otpRefs[index + 1]?.focus();
    }
  };

  const otpRefs = [];

  const varifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp != "" && terms == 1) {
      if (enteredOtp == Rotp) {
        setShowSubmit(0);
        setFilterDisplay(1);
      } else {
        Alert.alert('OTP Not Match.');
      }
    } else {
      Alert.alert("Please Fill All Data");
    }
  };

  const Submit = async () => {
    if (fullName != "" && emailID != "" && contactNumber != "" && terms == 1) {
      var formdata = { 'contactNumber': contactNumber, 'fullName': fullName };

      const ResData = await fetch(
        'https://jobipo.com/api/Singup/sendOtp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formdata),
        },
      )
        .then(res => res.json())
        .catch(err => setPayLoad(false));

      // // console.log('sendotpresponse', ResData);
      if (ResData.status == 1) {
        setRotp(ResData.msg);
        setFilterDisplay(0);
      } else {
        Alert.alert(ResData.msg);
      }

    } else {
      Alert.alert("Please Fill All Data");
    }
  };

  const sendOtp = async () => {
    // // console.log('hello')
    if (fullName != "" && emailID != "" && contactNumber != "" && terms == 1) {
      var formdata = { 'contactNumber': contactNumber, 'fullName': fullName };

      try {
        const ResData = await fetch(
          'https://jobipo.com/api/Singup/sendOtp',
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
            // // console.log('err', err)
          });
        // // console.log('sendotpresponse', ResData);
        if (ResData.status == 1) {
          setTimer(30)
          Alert.alert(ResData.msg);
          setIsOtpSent(true);
        } else {
          Alert.alert(ResData.msg);
        }

      } catch (error) {
        // // console.log(error)
      }

    } else {
      Alert.alert("Please Fill All Data");
    }
  }

  useEffect(() => {
    let interval
    if (isOtpSent) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 0) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isOtpSent, timer])

  // // console.log('isotpsent', isOtpSent)


  return (
    <View style={styles.Viewcontainer}>
      <ScrollView style={styles.ScrollViewcontainer}>
        <View style={styles.container}>
          {/* <Logo /> */}
 <View style={styles.headcontainer}> 
        <Text style={styles.heading}>Get Your Dream Job Today</Text>
        <Text style={styles.subheading}>Connect talent with opportunity</Text>
   </View>
          {/* <View style={styles.toggleContainer}>
          <Pressable style={[styles.toggleBtn, styles.inactive]}><Text style={styles.toggleTextInactive}>Login</Text></Pressable>
          <Pressable style={[styles.toggleBtn, styles.active]}><Text style={styles.toggleTextActive}>Sign Up</Text></Pressable>
        </View> */}

          <View style={styles.card}>
        
        <View style={styles.toggleContainer}>
  <Pressable
  style={[
    styles.toggleBtn,
    styles.inactive, // Always inactive
    { flex: 1 },
  ]}
  onPress={() => {
    navigation.navigate('Login');
  }}
>
  <Text style={styles.toggleTextInactive}>Login</Text>
</Pressable>

<Pressable
  style={[
    styles.toggleBtn,
    styles.active, 
    { flex: 1 },
  ]}
  onPress={() => {
    navigation.navigate('Register'); 
  }}
>
  <Text style={styles.toggleTextActive}>Sign Up</Text>
</Pressable>

</View>

          {!isOtpSent && <>
            <View style={styles.credContainer}>
              <TextInput
                style={styles.textInput}
                value={fullName}
                onChangeText={text => setfullName(text)}
                placeholder="Name"
              />
              <TextInput
                value={emailID}
                onChangeText={text => setemailID(text)}
                placeholder="Email"
                style={styles.textInput}
              />
              <View
                style={[(ShowSubmit == 0) ? { display: 'none' } : { display: 'flex' }]}
              >
                <TextInput
                  value={contactNumber}
                  onChangeText={text => setcontactNumber(text)}
                  placeholder="Mobile Number"
                  style={[styles.textInput]}
                />
              </View>
              {/* <TextInput
              value={city}
              onChangeText={text => setcity(text)}
              placeholder="City"
              style={styles.textInput}
            /> */}
              {/* <TextInput
            value={password}
            onChangeText={text => setPassword(text)}
            placeholder="Password"
            style={styles.textInput}
            secureTextEntry={true}
          /> */}
              {/* <TextInput
              value={passwordc}
              onChangeText={text => setpasswordc(text)}
              placeholder="Confirm Passwordc"
              style={styles.textInput}
              secureTextEntry={true}
            /> */}
              <TextInput
                value={uniqueCode}
                onChangeText={text => setuniqueCode(text)}
                placeholder="Refer Code"
                style={styles.textInput}
              />
            </View>
            <View style={styles.extraInfo}>
              <Pressable
                onPress={() => { (terms == 0) ? setterms(1) : setterms(0) }}
                style={[styles.checkbox, (terms == 0) ? { backgroundColor: '#fff', } : { backgroundColor: '#0d4574', }]}></Pressable>
              <Pressable onPress={() => Linking.openURL('https://www.jobipo.in/termServices')}>
                <Text style={styles.extraText}>
                  By Continuing, you agree to our Privacy Policy and Terms & Conditionds.
                </Text>
              </Pressable>
            </View>
<View style={[styles.extraInfo, { marginTop: 10 }]}>
  <Pressable
   onPress={() => setIsNotificationAllowed(!isNotificationAllowed)}
  style={styles.radioOuter}
  >
  {isNotificationAllowed && <View style={styles.radioInner} />}
  </Pressable>
  <Text style={styles.extraText}>I hereby authorize to send notification on SMS/Messages/Promotional/Informational messages</Text>
</View>



            <View style={[styles.button]}>
              <Button
             
                onPress={() => { sendOtp() }}
                text="Continue" />
                
            </View>
          </>}


  {/* <Pressable
  style={styles.nextbtn}
      onPress={() => {
      navigation.navigate('RegistrationP'); 
    }}
  >   <Text style={styles.nextbtntext}>Next</Text>
  </Pressable> */}

 
          {/* <View style={[styles.button, (ShowSubmit == 1) ? { display: 'none' } : { display: 'flex' }]}>
            <Button
              onPress={() => { FinalSubmit() }}
              text="Final Submit" />
          </View> */}

          <View style={styles.lastInfo}>
            <Text style={styles.lastInfoText}>You have an account?</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text
                style={[
                  styles.lastInfoText,
                  { marginLeft: 10, fontWeight: 'bold' },
                ]}>
                Log In
              </Text>
            </Pressable>
          </View>
          {
            /*
          <Pressable
            style={styles.chatBtn}
            onPress={() => {
              Submit()
            }}>
            <Text style={[{ fontSize: 16, fontWeight: 'bold', backgroundColor: '#F8F8F8', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 5 }]}>Chat Now</Text>
          </Pressable>
            */
          }
        </View>
        </View>

      </ScrollView>

      {isOtpSent &&
        <View style={[styles.fcontainer]}>
          <View style={{ marginLeft: 76, }}>
            <Logo />
          </View>
          <Text style={[styles.ffiltertext]}>Enter OTP</Text>
          {/* <TextInput
            value={otp}
            onChangeText={text => setotp(text)}    
            placeholder="Enter OTP"
            style2={styles.textInput1}
          />           */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                value={digit}
                onChangeText={(text) => handleOTPChange(text, index)}
                maxLength={1}
                keyboardType="numeric"
                style={styles.otpBox}
                ref={(ref) => (otpRefs[index] = ref)}
              />
            ))}
          </View>
          <Pressable
            onPress={() => {
              FinalSubmit()
            }}
            style={styles.applybtn}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 15 }}>Verify</Text>
          </Pressable>

          <View style={{
            flexDirection: 'row',
            gap: 10
          }}>

            <View style={{
              position: 'absolute',
              top: 0
            }}>
              {timer > 0 && (
                <Text style={{ fontSize: 14 }}>
                  Resend OTP in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                </Text>
              )}
            </View>
            <Pressable
              disabled={timer > 0}
              style={[
                {
                  backgroundColor: timer > 0 ? '#0d4574' : '#0d4574',
                  height: 48,
                  width: '48.5%',
                  marginTop: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }
              ]}
              onPress={() => sendOtp()}
            >
              <Text style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
                Resend Otp
              </Text>
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
          </View>

        </View>}

    </View>





  );
};

export default Register;

const styles = StyleSheet.create({
  
  
  Viewcontainer: {
    paddingTop:20,
    flex:1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  headcontainer: {
  marginVertical:30,
  },
  nextbtntext:{
   color: '#ffff',
         textAlign:'center',

  },
  nextbtn:{
    padding:10,
    width: '60%',
    alignSelf:'center',
  // borderRadius: 5,
  borderWidth: 2,
  borderColor: '#0d4574',
  backgroundColor:'#0d4574',

  },
  heading: {
   
    fontSize:40,
    fontWeight:'900',
    color: '#000080',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000080',
    marginVertical: 10,
  },
  // container: {
  //   paddingVertical: 14,
  //   paddingHorizontal: 10,
  //   backgroundColor: '#fffff',
  //   flex: 1,
  //   marginBottom: 50,
  // },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  fcontainer: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: '95%',
    marginLeft: '2.5%',
    backgroundColor: '#fff',
    position: 'absolute',
    top: 10,
    left: 0,
    height: 830,
    borderRadius: 15,
  },
  ffiltertext: {
    // marginTop: 150,
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 20,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 5,
    backgroundColor: '#fff',
    margin: 5,
  },
  // toggleContainer: {
  //   flexDirection: 'row',
  //   borderRadius: 25,
  //   borderWidth: 1,
  //   width:'75%',
  //   borderColor: '#0d4574',
  //   marginTop: 16,
  // },
  // toggleBtn: {
  //   flex: 1,
  //   paddingVertical: 10,
  //   borderRadius: 25,
  //   alignItems: 'center',

  // },
  radioOuter: {
  width: 20,
  height: 20,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: '#0d4574',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 10,
},

radioInner: {
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: '#0d4574',
},

  toggleContainer: {
  flexDirection: 'row',
  borderRadius: 25,
  borderWidth: 1,
  borderColor: '#0d4574',
  marginTop: 16,
  width: '80%',
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
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 38,
  },
  blacktext: {
    color: '#000',
  },
  viewFilter: [{
    display: 'flex'
  }, {
    display: 'none',
  }],

  credContainer: {
    marginTop: 36,
    width: '100%',
  },
  extraInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,

  },

  button: {
         width: '80%',
    alignSelf:'center',
    marginTop: 27,

  },

  lastInfo: {
    flexDirection: 'row',
    marginTop: 23,
    marginBottom: 26,
    alignSelf:'center',
  },
  lastInfoText: {
    fontSize: 16,
  },
  textInput: {
    marginVertical: 5,
    backgroundColor: '#F8F8F8',
    paddingLeft: 10,
    color: '#333',
    borderRadius: 10,
    borderColor: '#cceeff',
    backgroundColor: '#e6f7ff',
    borderWidth: 0.7,
  },
  textInput1: {
    marginVertical: 5,
    backgroundColor: '#F0F0F0',
    paddingLeft: 20,
    width: '70%',
    marginLeft: '15%',
    borderRadius: 10,

  },
  terms: {
    flexDirection: 'row',
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

  extraText: {
    fontSize: 14,
  },
  chatBtn: {
    marginBottom: 150,
  },
});
