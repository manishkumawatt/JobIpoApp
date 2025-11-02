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
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import Menu from '../components/Menu';
import {Header2 as Header} from '../components/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Logo from '../components/Auth/Logo';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Picker} from '@react-native-picker/picker';
const Leads = ({navigation}) => {
  const [isLoading, setisLoading] = useState(true);
  const [brandsData, setBrandsData] = useState([]);
  const [BankName, setBankName] = useState('');
  const [ProductName, setProductName] = useState('');
  const [ProductOptions, setProductOptions] = useState([]);
  const [LeadStatus, setLeadStatus] = useState('');
  const [FilterDisplay, setFilterDisplay] = useState(1);
  useEffect(() => {
    const PGetDataFunc = async () => {
      var formdata = {categoryID: ''};
      const ProductData = await fetch(
        'https://jobipo.com/api/Agent/productList',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formdata),
        },
      )
        .then(res => res.json())
        .catch(err => console.log(err));
      setisLoading(false);
      if (ProductData && ProductData.logout != 1) {
        setProductOptions(
          JSON.parse(JSON.parse(JSON.stringify(ProductData)).msg).product,
        );
        GetDataFunc();
      } else {
        //navigation.navigate('Login');
      }
    };

    PGetDataFunc();
  }, []);

  const GetDataFunc = async () => {
    var formdata = {ProductName: ProductName, LeadStatus: LeadStatus};
    // // console.log('this is a the data');
    // // console.log(formdata);
    const sliderDataApi = await fetch('https://jobipo.com/api/Agent/myLeads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formdata),
    })
      .then(res => res.json())
      .catch(err => console.log(err));
    setisLoading(false);
    if (sliderDataApi && sliderDataApi.logout != 1) {
      setBrandsData(
        JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).leads,
      );
      // // console.log('this is a the data 2');
      // // console.log(JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg));
    } else {
      //navigation.navigate('Login');
    }
  };

  const status = ['Pending', 'Approved', 'Rejected', 'Action'];

  const products = [
    {
      id: 0,
      title:
        'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content:
        'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
    {
      id: 1,
      title:
        'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content:
        'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
    {
      id: 2,
      title:
        'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content:
        'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
    {
      id: 3,
      title:
        'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content:
        'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
    {
      id: 4,
      title:
        'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content:
        'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
    {
      id: 5,
      title:
        'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content:
        'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
  ];
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
      <Header title="Leads" />
      <ScrollView style={styles.container}>
        <View style={styles.MainContainer}>
          <View style={[styles.product]}>
            <View style={[styles.bigWith]}>
              {/*
                <TextInput
                    placeholder="Enter Name/ Number"
                    style={styles.textInput}
                    placeholderTextColor="#bbb"
                />
                */}
            </View>
            <View style={styles.buttonrow}>
              <Pressable
                style={styles.buttonO}
                onPress={() => navigation.navigate('LeadOnline')}>
                <Text style={styles.buttonTextO}>Online Conversion</Text>
              </Pressable>
              <Pressable
                style={styles.Bluebutton}
                onPress={() => navigation.navigate('LeadOffline')}>
                <Text style={styles.BluebuttonText}>Offline Conversion</Text>
              </Pressable>
            </View>

            <View style={styles.filterContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter Name/ Number"
              />

              <Pressable
                style={styles.filterButton}
                onPress={() => {
                  setFilterDisplay(0);
                }}>
                <Icon
                  name="filter"
                  size={16}
                  color="#000"
                  style={styles.Filtericon}
                />
                <Text style={styles.filterButtonText}>Filter</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <FlatList
          data={brandsData}
          style={{marginBottom: 50}}
          keyExtractor={item => item.leadId} //has to be unique
          renderItem={({item}) => (
            <View style={styles.MainContainer}>
              <View
                style={[
                  styles.product,
                  styles.BackgroundWhite,
                  styles.marginTop10,
                  styles.paddingTop10,
                ]}>
                <View style={[styles.bigWith]}>
                  <Text style={styles.Datatitle}> {item.title}</Text>
                  <Text style={styles.Datadesc}> {item.name}</Text>
                  <Text style={styles.Datadesc}> {item.contactNo}</Text>
                </View>
                <View style={styles.productDescBox}>
                  <Text style={styles.status[item.status]}>
                    {status[item.status]}
                  </Text>
                  <Text style={styles.LeadId}>Lead Id : {item.leadId}</Text>
                </View>
              </View>
              <View style={[styles.product, styles.BackgroundWhite]}>
                <View style={[styles.productDescBox, styles.MBackgroundGray]}>
                  <Text style={[styles.Datadesc, styles.colorblue]}>
                    Creation Date
                  </Text>
                  <Text style={styles.Datatitle}>{item.CreatedAt}</Text>
                </View>
                <View style={[styles.productDescBox, styles.MBackgroundGray]}>
                  <Text style={[styles.Datadesc, styles.colorblue]}>
                    Pending Date
                  </Text>
                  <Text style={styles.Datatitle}>{item.CreatedAt}</Text>
                </View>
                <View style={[styles.productDescBox, styles.MBackgroundGray]}>
                  <Pressable onPress={() => navigation.navigate('Contactus')}>
                    <Text
                      style={[
                        styles.Datatitle,
                        styles.colorblue,
                        styles.BoxHeight,
                      ]}>
                      Get Help{' '}
                      <FontAwesome
                        name="arrow-circle-right"
                        size={20}
                        color="#535353"
                      />
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          horizontal={false}
          numColumns={1}
        />
      </ScrollView>

      <View style={[styles.fcontainer, styles.viewFilter[FilterDisplay]]}>
        <Text style={[styles.ffiltertext]}>Filter Data</Text>
        <Picker
          selectedValue={ProductName}
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
            setProductName(itemValue);
          }}>
          <Picker label="By Product Name" value="" />
          {ProductOptions.map((item, index) => {
            return (
              <Picker.Item
                label={item.title}
                value={item.productId}
                key={item.productId}
              />
            );
          })}
        </Picker>

        <Picker
          selectedValue={LeadStatus}
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
            setLeadStatus(itemValue);
          }}>
          <Picker label="By Lead Status" value="" />
          <Picker.Item label="Pending" value="1" />
          <Picker.Item label="Approved" value="2" />
          <Picker.Item label="Rejected" value="3" />
          <Picker.Item label="Action" value="4" />
        </Picker>
        <Pressable
          onPress={() => {
            setFilterDisplay(1);
            GetDataFunc();
          }}
          style={styles.applybtn}>
          <Text style={{color: '#fff', textAlign: 'center', fontSize: 15}}>
            Apply
          </Text>
        </Pressable>
      </View>

      <Menu />
    </>
  );
};

export default Leads;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    flex: 1,
    marginBottom: 50,
  },
  ffiltertext: {
    fontSize: 20,
    color: '#000',
  },
  fcontainer: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: '95%',
    marginLeft: '2.5%',
    backgroundColor: '#fff',
    position: 'absolute',
    top: 60,
    left: 0,
    height: 590,
    borderRadius: 15,
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
    width: '80%',
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
  applybtn: {
    backgroundColor: '#0d4574',
    color: '#fff',
    width: 70,
    borderRadius: 5,
    minHeight: 20,
    marginRight: 10,
    position: 'absolute',
    bottom: 50,
    right: 10,
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
  },
  viewFilter: [
    {
      display: 'flex',
    },
    {
      display: 'none',
    },
  ],
  status: [
    {
      backgroundColor: '#FFC895',
      paddingHorizontal: 12,
      borderRadius: 15,
      color: '#fff',
      paddingBottom: 3,
      alignItems: 'center',
      marginBottom: 8,
    },
    {
      backgroundColor: '#0d4574',
      paddingHorizontal: 10,
      borderRadius: 15,
      color: '#fff',
      paddingBottom: 3,
      alignItems: 'center',
      marginBottom: 8,
    },
    {
      backgroundColor: '#535353',
      paddingHorizontal: 12,
      borderRadius: 15,
      color: '#fff',
      paddingBottom: 3,
      alignItems: 'center',
      marginBottom: 8,
    },
    {
      backgroundColor: '#62A7E7',
      paddingHorizontal: 12,
      borderRadius: 15,
      color: '#fff',
      paddingBottom: 3,
      alignItems: 'center',
      marginBottom: 8,
    },
  ],
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

  filterContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  input: {
    flex: 1,

    borderRadius: 5,
    padding: 8,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  filterButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#000',
    marginRight: 5,
  },
  Filtericon: {
    marginRight: 5,
  },
  buttonrow: {
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Bluebutton: {
    borderWidth: 0.7,
    borderColor: '#0d4574',
    backgroundColor: '#0d4574',
    marginHorizontal: 6,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  BluebuttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonO: {
    borderWidth: 0.7,
    borderColor: '#333',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 6,
    borderRadius: 10,
  },
  buttonTextO: {
    color: '#333',
    fontSize: 16,
  },
});
