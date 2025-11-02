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
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Paymentsetting = ({navigation}) => {
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
  const [BankName, setBankName] = useState('');
  const [AccountNo, setAccountNo] = useState('');
  const [BranchName, setBranchName] = useState('');
  const [IfscCode, setIfscCode] = useState('');
  const [AccountHolderName, setAccountHolderName] = useState('');
  const [updatedAt, setupdatedAt] = useState('');

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

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

            // // console.log('uData.NewProduct ss');
            setBankName(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
                .BankName,
            );
            setAccountNo(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
                .AccountNo,
            );
            setBranchName(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
                .BranchName,
            );
            setAccountHolderName(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
                .AccountHolderName,
            );
            setupdatedAt(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
                .updatedAt,
            );
            setIfscCode(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
                .IfscCode,
            );
            setisLoading(false);
            // // console.log(AccountHolderName);
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

      if (isMounted) {
        GetDataFunc();
      }

      return () => {
        isMounted = false;
      };
    }, []),
  );

  // const UpdatePayment = async () => {
  //   setisLoading(true);
  //   try {
  //     var formdat = {
  //       'BankName': BankName,
  //       'AccountNo': AccountNo,
  //       'BranchName': BranchName,
  //       'AccountHolderName': AccountHolderName,
  //       'IfscCode': IfscCode
  //     };

  //     const asd = await fetch(
  //       'https://jobipo.com/api/Agent/doPaymentssettings',
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(formdat),
  //       },
  //     )
  //       .then(res => res.json())
  //       .catch(err => // console.log(err));

  //     // console.log('doPaymentssettings');
  //     // console.log(asd);
  //     setisLoading(false);
  //     if (JSON.parse(JSON.stringify(asd)).status == 'success') {
  //       alert(JSON.parse(JSON.stringify(asd)).msg);
  //     } else {
  //       alert(JSON.parse(JSON.stringify(asd)).msg);
  //     }

  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };

  const UpdatePayment = async () => {
    setisLoading(true);
    try {
      const UserID = await AsyncStorage.getItem('UserID');

      var formdat = {
        BankName,
        AccountNo,
        BranchName,
        AccountHolderName,
        IfscCode,
        UserID: UserID,
      };

      // // console.log('Form Data:', formdat);

      const asd = await fetch(
        'https://jobipo.com/api/v2/do-update-payment-settings',
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

      // // console.log('doPaymentssettings', asd);
      setisLoading(false);

      if (JSON.parse(JSON.stringify(asd)).status == 'success') {
        alert(JSON.parse(JSON.stringify(asd)).msg);
      } else {
        alert(JSON.parse(JSON.stringify(asd)).msg);
      }
    } catch (error) {
      setisLoading(false);
      alert(error.message);
    }
  };

  var options = [
    'AIRTEL PAYMENTS BANK',
    'ALLAHABAD BANK',
    'ANDHRA BANK',
    'AU SMALL FINANCE BANK',
    'AXIS BANK',
    'BANDHAN BANK LIMITED',
    'BANK OF BARODA',
    'BANK OF INDIA',
    'BANK OF MAHARASHTRA',
    'BARODA RAJSTHAN KSHETRIY GRAMIN BANK',
    'CANARA BANK',
    'CAPITAL SMALL FINANCE BANK',
    'CENTRAL BANK OF INDIA',
    'CITIBANK',
    'CITY UNION BANK LTD',
    'CORPORATION BANK',
    'DBS BANK LTD',
    'DCB BANK LIMITED',
    'DENA BANK',
    'EQUITAS SMALL FINANCE BANK',
    'ESAF SMALL FINANCE BANK',
    'FINCARE SMALL FINANCE BANK',
    'FINO PAYMENTS BANK',
    'HDFC BANK LTD',
    'HSBC',
    'ICICI BANK LTD',
    'IDBI BANK LTD',
    'IDFC BANK',
    'INDIA POST PAYMENT BANK',
    'INDIAN BANK',
    'INDIAN OVERSEAS BANK',
    'INDUSIND BANK LTD',
    'JANA SMALL FINANCE BANK',
    'JIO PAYMENTS BANK',
    'KARNATAKA BANK LTD',
    'KERALA GRAMIN BANK',
    'KOTAK MAHINDRA BANK',
    'NSDL PAYMENTS BANK',
    'ORIENTAL BANK OF COMMERCE',
    'PAYTM PAYMENTS BANK',
    'PRATHAMA BANK',
    'PUNJAB AND SIND BANK',
    'PUNJAB NATIONAL BANK',
    'RAJASTHAN MARUDHARA GRAMIN BANK',
    'RBL BANK LIMITED',
    'SOUTH INDIAN BANK',
    'STANDARD CHARTERED BANK',
    'STATE BANK OF INDIA',
    'SURYODAY SMALL FINANCE BANK',
    'TELANGANA STATE COOP APEX BANK',
    'THE FEDERAL BANK LTD',
    'THE JAMMU AND KASHMIR BANK LTD',
    'THE KOLHAPUR URBAN BANK',
    'THE NAINITAL BANK LIMITED',
    'UCO BANK',
    'UJJIVAN SMALL FINANCE BANK',
    'UNION BANK OF INDIA',
    'UNITED BANK OF INDIA',
    'UTKARSH SMALL FINANCE BANK',
    'YES BANK LTD',
  ];

  // // console.log('users', users);

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
      <Header title="Payment Setting" />

      <ScrollView style={styles.container}>
        {users?.ProfileStatus != 1 ? (
          <>
            <Pressable
              onPress={() => navigation.navigate('Kyc')}
              style={{
                backgroundColor: 'orange',
                padding: 10,
                borderRadius: 5,
                margin: 10,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Complete your KYC
              </Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.MainContainer}>
            <View style={[styles.product]}>
              <View style={[styles.bigWith]}>
                <Picker
                  selectedValue={BankName}
                  mode="cover"
                  dropdownIconColor="#323232"
                  dropdownIconRippleColor="#ccc"
                  style={{
                    width: '100%',
                    color: '#000',
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1,
                    borderColor: '#D9D9D9',
                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    setBankName(itemValue);
                  }}>
                  <Picker label="Select Your Bank" value="" />
                  {options.map((item, index) => {
                    return (
                      <Picker.Item label={item} value={item} key={index} />
                    );
                  })}
                </Picker>
                <TextInput
                  placeholder="Account Number"
                  style={styles.textInput}
                  placeholderTextColor="#bbb"
                  value={AccountNo}
                  onChangeText={text => setAccountNo(text)}
                />
                <TextInput
                  placeholder="Confirm Account Number"
                  style={styles.textInput}
                  placeholderTextColor="#bbb"
                  value={AccountNo}
                  onChangeText={text => setAccountNo(text)}
                />
                <TextInput
                  placeholder="Branch Name"
                  style={styles.textInput}
                  placeholderTextColor="#bbb"
                  value={BranchName}
                  onChangeText={text => setBranchName(text)}
                />
                <TextInput
                  placeholder="IFSC Code"
                  style={styles.textInput}
                  placeholderTextColor="#bbb"
                  value={IfscCode}
                  onChangeText={text => setIfscCode(text)}
                />
                <TextInput
                  placeholder="Account Holder Name"
                  style={styles.textInput}
                  placeholderTextColor="#bbb"
                  value={AccountHolderName}
                  onChangeText={text => setAccountHolderName(text)}
                  // editable={false}
                  editable={!AccountHolderName}
                />
                <View style={[styles.cardContainer, styles.textLeft]}>
                  <Text style={styles.colorblue}>
                    Last Update : {updatedAt}
                  </Text>
                </View>
                <View style={styles.cardContainer}>
                  <Pressable
                    onPress={() => UpdatePayment()}
                    style={styles.card}>
                    <Text style={styles.cardText}>Update</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <Menu />
    </>
  );
};

export default Paymentsetting;

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
