/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import Logo from '../components/Auth/Logo';
import {Header2 as Header} from '../components/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Picker} from '@react-native-picker/picker';
import Menu from '../components/Menu';
import {AuthContext} from '../context/context';
import {useFocusEffect} from '@react-navigation/native';

const Kyc = ({navigation}) => {
  const {signOut} = useContext(AuthContext);
  const products = [
    {
      id: 0,
      title:
        'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content:
        'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
  ];
  const [isLoading, setisLoading] = useState(true);
  const [uData, setUData] = useState([]);
  const [users, setUsers] = useState([]);
  const [NamePan, setNamePan] = useState('');
  const [PanNo, setPanNo] = useState('');
  const [AdharNo, setAdharNo] = useState('');
  const [AdharOTP, setAdharOTP] = useState('');
  const [KycStatus, setKycStatus] = useState('');
  const [updatedAt, setupdatedAt] = useState('');
  const [OTPsent, setOTPsent] = useState(1);
  const [kycId, setkycId] = useState('');
  const [Tokan, setTokan] = useState('');

  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {
        const sliderDataApi = await fetch(
          'https://jobipo.com/api/Agent/index',
          {
            method: 'GET',
          },
        )
          .then(res => res.json())
          .catch(err => console.log(err));

        if (sliderDataApi) {
          if (sliderDataApi.logout != 1) {
            setUsers(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users,
            );

            setNamePan(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
                .NamePan,
            );
            setPanNo(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
                .PanNo,
            );
            setupdatedAt(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
                .updatedAt,
            );
            setKycStatus(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
                .ProfileStatus,
            );
            // // console.log('ProfileStatus:', users?.ProfileStatus);

            if (
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
                .ProfileStatus == 1
            ) {
              navigation.navigate('Home');
            }
            setisLoading(false);
          } else {
            signOut();
            // navigation.navigate('Login');
          }
        } else {
          Alert.alert(
            'Connection Issue',
            'Please check your internet connection.',
          );
        }
      };

      let mount = true;

      if (mount) {
        GetDataFunc();
      }

      return () => {
        mount = false;
      };
    }, []),
  );

  const verifypan = async () => {
    setisLoading(true);
    try {
      var formdat = {PanNo: PanNo};

      const asd = await fetch('https://jobipo.com/api/Singup/panVerify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdat),
      })
        .then(res => res.json())
        .catch(err => console.log(err));
      // // console.log("panVerify",asd);
      setisLoading(false);
      if (JSON.parse(JSON.stringify(asd)).type == 'success') {
        setKycStatus(3);
        alert(JSON.parse(JSON.stringify(asd)).msg);
      } else {
        alert(JSON.parse(JSON.stringify(asd)).msg);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const sendotp = async () => {
    setisLoading(true);
    try {
      var formdat = {AdharNo: AdharNo};

      const asd = await fetch('https://jobipo.com/api/Singup/adhaarOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdat),
      })
        .then(res => res.json())
        .catch(err => console.log(err));

      // // console.log("adhaarOtp",asd);

      setisLoading(false);
      if (JSON.parse(JSON.stringify(asd)).type == 'success') {
        setkycId(JSON.parse(JSON.stringify(asd)).kycId);
        setTokan(JSON.parse(JSON.stringify(asd)).Tokan);
        setKycStatus(3);
        setOTPsent(2);
        alert(JSON.parse(JSON.stringify(asd)).msg);
      } else {
        alert(JSON.parse(JSON.stringify(asd)).msg);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const adhaarVerify = async () => {
    setisLoading(true);
    try {
      var formdat = {
        AdharNo: AdharNo,
        kycId: kycId,
        Tokan: Tokan,
        AdharOTP: AdharOTP,
      };

      const asd = await fetch('https://jobipo.com/api/Singup/adhaarVerify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdat),
      })
        .then(res => res.json())
        .catch(err => console.log(err));
      // // console.log("adhaarVerify",asd);
      setisLoading(false);
      if (JSON.parse(JSON.stringify(asd)).type == 'success') {
        setkycId(JSON.parse(JSON.stringify(asd)).kycId);
        setTokan(JSON.parse(JSON.stringify(asd)).Tokan);
        setKycStatus(1);
        setOTPsent(2);
        navigation.navigate('Home');
        alert(JSON.parse(JSON.stringify(asd)).msg);
      } else {
        alert(JSON.parse(JSON.stringify(asd)).msg);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const ddd = async () => {
    setisLoading(true);
    try {
      var formdat = {
        NamePan: NamePan,
        PanNo: PanNo,
      };

      const asd = await fetch(
        'https://jobipo.com/api/Agent/doPaymentssettings',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formdat),
        },
      )
        .then(res => res.json())
        .catch(err => console.log(err));

      // // console.log('doPaymentssettings',asd);
      // // console.log(asd);
      setisLoading(false);
      if (JSON.parse(JSON.stringify(asd)).status == 'success') {
        alert(JSON.parse(JSON.stringify(asd)).msg);
      } else {
        alert(JSON.parse(JSON.stringify(asd)).msg);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <View
        style={[
          isLoading == true
            ? {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                zIndex: 99999,
                height: '100%',
                backgroundColor: '#fff',
                width: '100%',
              }
            : {
                display: 'none',
              },
        ]}>
        {/* <Logo /> */}
        <ActivityIndicator size="large" />
      </View>
      <Header title="Kyc" />
      <ScrollView style={styles.container}>
        <View style={styles.MainContainer}>
          <View
            style={[
              KycStatus == 2 || KycStatus == 0
                ? {
                    flex: 1,
                  }
                : {
                    display: 'none',
                  },
              styles.product,
            ]}>
            <View style={[styles.bigWith]}>
              <View style={styles.maincontainer}>
                <Text style={styles.heading}>Enter Your PAN Number</Text>
                <TextInput
                  placeholder="Pan Number"
                  style={styles.textInput}
                  placeholderTextColor="#bbb"
                  value={PanNo}
                  onChangeText={text => setPanNo(text)}
                />

                <View style={styles.boxContainer}>
                  <View style={styles.leftBox}>
                    <View style={styles.row}>
                      <Text style={styles.label}>Name</Text>
                      <TextInput
                        // placeholder="Enter Name"
                        style={[styles.textInput, styles.rowInput]}
                        placeholderTextColor="#bbb"
                      />
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Address</Text>
                      <TextInput
                        // placeholder="Enter Address"
                        style={[styles.textInput, styles.rowInput]}
                        placeholderTextColor="#bbb"
                      />
                    </View>
                    <View style={styles.row}>
                      <TextInput
                        // placeholder="Enter Address"
                        style={styles.AddressInput}
                        placeholderTextColor="#bbb"
                      />
                    </View>
                    <View style={styles.row}>
                      <TextInput
                        // placeholder="Enter Address"
                        style={styles.AddressInput}
                        placeholderTextColor="#bbb"
                      />
                    </View>
                  </View>

                  <View style={styles.rightBox}>
                    <Image
                      source={require('../../assets/Image/IDproofBG.png')}
                      style={{
                        width: 130,
                        height: 130,
                        marginTop: 10,
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.cardContainer}>
                <Pressable onPress={() => verifypan()} style={styles.card}>
                  <Text style={styles.cardText}>Submit</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.MainContainer}>
          <View
            style={[
              KycStatus == 3 && OTPsent == 1
                ? {
                    flex: 1,
                  }
                : {
                    display: 'none',
                  },
              styles.product,
            ]}>
            <View style={[styles.bigWith]}>
              <View style={styles.maincontainer}>
                <Text style={styles.heading}>Enter Your Adhaar Number</Text>
                <TextInput
                  placeholder="Enter Adhaar Number"
                  style={styles.textInput}
                  placeholderTextColor="#bbb"
                  value={AdharNo}
                  onChangeText={text => setAdharNo(text)}
                />

                <View style={styles.boxContainer}>
                  <View style={styles.leftBox}>
                    <View style={styles.row}>
                      <Text style={styles.label}>Name</Text>
                      <TextInput
                        // placeholder="Enter Name"
                        style={[styles.textInput, styles.rowInput]}
                        placeholderTextColor="#bbb"
                      />
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Address</Text>
                      <TextInput
                        // placeholder="Enter Address"
                        style={[styles.textInput, styles.rowInput]}
                        placeholderTextColor="#bbb"
                      />
                    </View>
                    <View style={styles.row}>
                      <TextInput
                        // placeholder="Enter Address"
                        style={styles.AddressInput}
                        placeholderTextColor="#bbb"
                      />
                    </View>
                    <View style={styles.row}>
                      <TextInput
                        // placeholder="Enter Address"
                        style={styles.AddressInput}
                        placeholderTextColor="#bbb"
                      />
                    </View>
                  </View>

                  <View style={styles.rightBox}>
                    <Image
                      source={require('../../assets/Image/IDproofBG.png')}
                      style={{
                        width: 130,
                        height: 130,
                        marginTop: 10,
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.cardContainer}>
                <Pressable onPress={() => sendotp()} style={styles.card}>
                  <Text style={styles.cardText}>Send OTP</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.MainContainer}>
          <View
            style={[
              KycStatus == 3 && OTPsent == 2
                ? {
                    flex: 1,
                  }
                : {
                    display: 'none',
                  },
              styles.product,
            ]}>
            <View style={[styles.bigWith]}>
              <Text style={styles.heading}>Enter OTP </Text>
              <Text style={styles.subHeading}>
                Please enter the OTP sent to your registered mobile number.
              </Text>
              <TextInput
                placeholder="Enter OTP"
                style={styles.textInput2}
                placeholderTextColor="#bbb"
                value={AdharOTP}
                onChangeText={text => setAdharOTP(text)}
              />

              <View style={styles.cardContainer}>
                <Pressable onPress={() => adhaarVerify()} style={styles.card}>
                  <Text style={styles.cardText}>Verify OTP</Text>
                </Pressable>
              </View>
              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>
                  Didn't receive the OTP?{' '}
                  <Text style={styles.resendLink} onPress={() => {}}>
                    Resend OTP
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Menu />
    </>
  );
};

export default Kyc;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 5,
    backgroundColor: '#ffff',
    flex: 1,
    marginBottom: 50,
  },
  product: {
    alignItems: 'center',
    textAlignVertical: 'top',
    paddingTop: 0,
    paddingBottom: 5,
    // paddingHorizontal: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: '100%',
    backgroundColor: '#edfaff',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    paddingTop: 0,
    fontSize: 16,
  },
  Datatitle: {
    paddingTop: 0,
    fontSize: 16,
  },
  Datadesc: {
    paddingTop: 0,
    fontSize: 13,
  },
  productNo: {
    color: '#595959',
    marginVertical: 10,
    fontSize: 12,
  },
  productDescBox: {
    paddingVertical: 0,
    borderRadius: 0,
    flex: 1,
    paddingLeft: 5,
    paddingBottom: 5,
    alignItems: 'center',
  },
  bigWith: {
    paddingVertical: 0,
    borderRadius: 0,
    flex: 3,
    // paddingLeft: 5,
    paddingBottom: 5,
  },
  productDesc: {
    textAlign: 'center',
    color: '#595959',
    fontSize: 12,
    textAlignVertical: 'top',
  },
  cardIcon: {
    fontSize: 25,
  },
  cardText: {
    fontSize: 15,
    color: '#0d4574',
  },
  card: {
    marginTop: 15,
  },
  customBox: {
    backgroundColor: '#fff',
    width: '95%',
    alignItems: 'center',
    height: 40,
    paddingTop: 7,
  },
  SliderImage: {
    marginLeft: '2.5%',
    width: '95%',
    alignItems: 'center',
  },
  BackgroundBlue: {
    backgroundColor: '#0d4574',
  },
  colorblue: {
    color: '#0d4574',
  },
  BackgroundYellow: {
    backgroundColor: '#FFC895',
  },
  BackgroundWhite: {
    backgroundColor: '#fff',
  },
  MBackgroundGray: {
    backgroundColor: '#F8F8F8',
    margin: 3,
    height: 45,
    textAlignVertical: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  MainContainer: {
    // marginLeft: '2.5%',
    width: '100%',
    alignItems: 'center',
  },
  marginTop10: {
    marginTop: 10,
  },
  paddingTop10: {
    paddingTop: 10,
  },
  marginBottom10: {
    marginBottom: 30,
  },
  textInput: {
    backgroundColor: '#fff',
    height: 40,
    // marginTop: 10,
    paddingLeft: 15,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  status: {
    backgroundColor: '#FFC895',
    paddingHorizontal: 15,
    borderRadius: 15,
    color: '#fff',
    paddingBottom: 3,
    alignItems: 'center',
    marginBottom: 8,
  },
  statusAction: {
    backgroundColor: '#62A7E7',
  },
  statusApproved: {
    backgroundColor: '#0d4574',
    marginLeft: -10,
  },
  statusRejected: {
    backgroundColor: '#535353',
    marginLeft: -10,
  },
  LeadId: {
    marginLeft: -30,
  },
  BoxHeight: {
    marginTop: 11,
  },
  cardContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d4574',
    borderRadius: 50,
    height: 40,
    width: '90%',
  },

  cardText: {
    color: '#fff',
    fontSize: 14,
  },
  textLeft: {
    justifyContent: 'space-between',
  },
  maincontainer: {
    borderWidth: 0.7,
    borderColor: '#1f2e2e',
    borderStyle: 'dashed',
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftBox: {
    flex: 1,
    marginRight: 10,
  },
  rightBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    marginVertical: 5,
    fontWeight: '500',
  },
  // textInput: {
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   borderRadius: 5,
  //   padding: 10,
  //   marginBottom: 10,
  // },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 5,
  },
  rowInput: {
    flex: 1,
    marginLeft: 10,
    // borderWidth: 1,
    // borderColor: "#ccc",
    // padding: 8,
  },
  AddressInput: {
    backgroundColor: '#fff',
    height: 35,
    flex: 1,
    marginLeft: 10,
    paddingLeft: 15,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  textInput2: {
    borderWidth: 1,
    borderColor: '#000',
    margin: 20,
    padding: 10,
    borderRadius: 10,
  },
  subHeading: {
    fontSize: 13,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
  },
  resendLink: {
    color: '#007BFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resendContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
});
