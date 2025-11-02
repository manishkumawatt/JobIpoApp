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
import React, {useState, useEffect, useRef, useCallback} from 'react';
import Menu from '../components/Menu';
import Logo from '../components/Auth/Logo';
import {Header2 as Header} from '../components/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Picker} from '@react-native-picker/picker';

const Kyc = ({navigation}) => {
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
  useEffect(() => {
    const GetDataFunc = async () => {
      const sliderDataApi = await fetch('https://jobipo.com/api/Agent/index', {
        method: 'GET',
      })
        .then(res => res.json())
        .catch(err => console.log(err));

      if (sliderDataApi) {
        if (sliderDataApi.logout != 1) {
          setUsers(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users,
          );

          // // console.log('uData.NewProduct ss');
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

          if (
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
              .ProfileStatus == 1
          ) {
            navigation.navigate('Home');
          }
          setisLoading(false);
        } else {
          navigation.navigate('Login');
        }
      } else {
        Alert.alert(
          'Connection Issue',
          'Please check your internet connection.',
        );
      }
    };

    GetDataFunc();
  }, []);

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
      // // console.log(asd);
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
      // // console.log(asd);
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
      // // console.log(asd);
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
      var formdat = {NamePan: NamePan, PanNo: PanNo};

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

      // // console.log('gfdg fgfdgfd');
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
                position: 'absolute',
                height: '100%',
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0.4)',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
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
              KycStatus == 2
                ? {
                    flex: 1,
                  }
                : {
                    display: 'none',
                  },
              styles.product,
            ]}>
            <View style={[styles.bigWith]}>
              <TextInput
                placeholder="Pan Number"
                style={styles.textInput}
                placeholderTextColor="#bbb"
                value={PanNo}
                onChangeText={text => setPanNo(text)}
              />

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
              <TextInput
                placeholder="Enter Adhaar Number"
                style={styles.textInput}
                placeholderTextColor="#bbb"
                value={AdharNo}
                onChangeText={text => setAdharNo(text)}
              />

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
              <TextInput
                placeholder="Enter OTP"
                style={styles.textInput}
                placeholderTextColor="#bbb"
                value={AdharOTP}
                onChangeText={text => setAdharOTP(text)}
              />

              <View style={styles.cardContainer}>
                <Pressable onPress={() => adhaarVerify()} style={styles.card}>
                  <Text style={styles.cardText}>Verify OTP</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Kyc;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    flex: 1,
    marginBottom: 50,
  },
  product: {
    alignItems: 'center',
    textAlignVertical: 'top',
    paddingTop: 0,
    paddingBottom: 5,
    paddingHorizontal: 4,
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
    paddingLeft: 5,
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
    marginLeft: '2.5%',
    width: '95%',
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
    marginTop: 10,
    paddingLeft: 15,
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
    marginTop: 5,
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d4574',
    borderRadius: 50,
    height: 40,
    width: '49%',
  },

  cardText: {
    color: '#fff',
    fontSize: 14,
  },
  textLeft: {
    justifyContent: 'space-between',
  },
});
