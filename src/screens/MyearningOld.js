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
import {Picker} from '@react-native-picker/picker';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import Menu from '../components/Menu';
import {Header2 as Header} from '../components/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Logo from '../components/Auth/Logo';
const Myearning = ({navigation}) => {
  const [earning, setEarning] = useState([]);
  const [totalEarning, setTotalEarning] = useState([]);
  const [bonus, setBonus] = useState([]);
  const [paidEarning, setpaidEarning] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [ProductName, setProductName] = useState('');
  const [ProductOptions, setProductOptions] = useState([]);
  const [LeadStatus, setLeadStatus] = useState('');
  const [FilterDisplay, setFilterDisplay] = useState(1);
  const GetDataFunc = async () => {
    var formdata = {ProductName: ProductName, LeadStatus: LeadStatus};
    const sliderDataApi = await fetch(
      'https://jobipo.com/api/Agent/myearning',
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
    if (sliderDataApi && sliderDataApi.logout != 1) {
      setEarning(
        JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).earning,
      );
      setBonus(JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).bonus);

      setTotalEarning(
        JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).totalEarning,
      );

      setpaidEarning(
        JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).paidEarning,
      );
      // // console.log('sliderDataApi  dd');
      // // console.log(JSON.parse(JSON.stringify(sliderDataApi)).msg);
    } else {
      //navigation.navigate('Login');
    }
  };

  useEffect(() => {
    GetDataFunc();
  }, []);

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
      <Header title="My Earning" />
      <ScrollView style={styles.container}>
        <View style={styles.MainContainer}>
          <View style={[styles.product]}>
            <View style={[styles.bigWith]}>
              <Text style={[styles.Datatitle, styles.DataTitleBig]}>
                ₹ {totalEarning}/-
              </Text>
              <Text style={styles.DataSmall}>
                ₹ {paidEarning} + ₹ {totalEarning - paidEarning} Pending
              </Text>
            </View>
            <View style={styles.productDescBox}>
              <Pressable
                onPress={
                  () => {
                    setFilterDisplay(0);
                  } // navigation.navigate('Trainings')
                }
                style={styles.customBox}>
                <Text color="#535353">
                  <FontAwesome name="filter" size={20} color="#535353" /> Filter
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/*
              <View style={styles.MainContainer}>
                  <View style={[ styles.marginTop10]}>
                      <View style={styles.cardContainer}>
                          <Pressable
                              style={[styles.btnCode, styles.BackgroundBlue]}>
                              <Text style={[styles.btnCodeText, styles.textwhite]}>Your Earning</Text>
                          </Pressable>
                          <Pressable
                              style={[styles.btnCode, styles.BackgroundWhite]}>
                              <Text style={[styles.btnCodeText]}>Team Earning</Text>
                          </Pressable>
                      </View>                                        
                  </View>  
              </View>
              */}

        <FlatList
          data={earning}
          style={[styles.pmaincontrainer]}
          keyExtractor={item => item.transectionId} //has to be unique
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
                  <Text style={styles.Datatitle}>{item.title}</Text>
                  <Text style={styles.Datadesc}>{item.AgentName}</Text>
                  <Text style={styles.Datadesc}>Lead Id : {item.leadId}</Text>
                </View>
                <View style={styles.productDescBox}>
                  <Text
                    style={[styles.status, styles.statusColor[item.Status]]}>
                    {item.Status == 1 ? 'Paid' : 'Not Paid'}
                  </Text>
                  <Text style={styles.LeadId}>Amount : ₹ {item.Amount}/-</Text>
                </View>
              </View>
              <View style={[styles.product, styles.BackgroundWhite]}>
                <View style={[styles.productDescBox, styles.MBackgroundGray]}>
                  <Text style={[styles.Datadesc, styles.colorblue]}>
                    Approved Date
                  </Text>
                  <Text style={styles.Datatitle}>{item.CreatedAt}</Text>
                </View>
                <View style={[styles.productDescBox, styles.MBackgroundGray]}>
                  <Text style={[styles.Datadesc, styles.colorblue]}>
                    A/C Transfer Date
                  </Text>
                  <Text style={styles.Datatitle}>{item.expectedPD}</Text>
                </View>
                <View style={[styles.productDescBox, styles.MBackgroundGray]}>
                  <Text style={[styles.Datadesc, styles.colorblue]}>
                    Work By Friend
                  </Text>
                  <Text style={styles.Datatitle}>
                    {item.AgentName.split(' ')['0']}
                  </Text>
                </View>
              </View>
            </View>
          )}
          horizontal={false}
          numColumns={1}
        />

        <FlatList
          data={bonus}
          style={[styles.pmaincontrainer, {marginBottom: 50}]}
          keyExtractor={item => item.bonusId} //has to be unique
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
                  <Text style={styles.Datatitle}>
                    {item.BonusType == 'REFERALBONUS'
                      ? 'Referal Bonus'
                      : 'Signup Bonus'}{' '}
                  </Text>
                  <Text style={styles.Datadesc}>{item.fullName}</Text>
                  <Text style={styles.Datadesc}>Lead Id : {item.leadId}</Text>
                </View>
                <View style={styles.productDescBox}>
                  <Text
                    style={[
                      styles.status,
                      styles.statusColor[item.PaymentStatus],
                    ]}>
                    {item.PaymentStatus == 1 ? 'Paid' : 'Not Paid'}
                  </Text>
                  <Text style={styles.LeadId}>Amount : ₹ {item.Amount}/-</Text>
                </View>
              </View>
              <View style={[styles.product, styles.BackgroundWhite]}>
                <View style={[styles.productDescBox, styles.MBackgroundGray]}>
                  <Text style={[styles.Datadesc, styles.colorblue]}>
                    Approved Date
                  </Text>
                  <Text style={styles.Datatitle}>{item.AprovedOn}</Text>
                </View>
                <View style={[styles.productDescBox, styles.MBackgroundGray]}>
                  <Text style={[styles.Datadesc, styles.colorblue]}>
                    Payment Date
                  </Text>
                  <Text style={styles.Datatitle}>{item.PaidOn}</Text>
                </View>
                <View style={[styles.productDescBox, styles.MBackgroundGray]}>
                  <Text style={[styles.Datadesc, styles.colorblue]}>
                    Work By Friend
                  </Text>
                  <Text style={styles.Datatitle}>
                    {item.fullName.split(' ')['0']}
                  </Text>
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
          <Picker label="All Leads" value="" />
          <Picker.Item label="By Self" value="1" />
          <Picker.Item label="By Team" value="2" />
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
          <Picker label="By Payment Status" value="" />
          <Picker.Item label="Pending" value="1" />
          <Picker.Item label="Paid" value="2" />
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

export default Myearning;

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
    fontSize: 13,
  },
  DataSmall: {
    fontSize: 10,
  },
  DataTitleBig: {
    fontSize: 25,
    color: '#0d4574',
  },
  Datadesc: {
    paddingTop: 5,
    fontSize: 12,
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
  viewFilter: [
    {
      display: 'flex',
    },
    {
      display: 'none',
    },
  ],
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
  cardContainer: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'space-between',
  },
  btnCode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    height: 40,
    width: '49%',
  },

  btnCodeText: {
    fontSize: 14,
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
  /*
    customBox:{
        width: '95%',
        alignItems: 'center',
        height: 40,
        paddingTop: 7,
    },*/
  statusColor: [
    {
      // backgroundColor: "#000",
      fontSize: 10,
    },
    {
      backgroundColor: '#0d4574',
    },
  ],
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
  status: {
    backgroundColor: '#FFC895',
    paddingHorizontal: 15,
    borderRadius: 15,
    color: '#fff',
    paddingBottom: 3,
    alignItems: 'center',
    marginBottom: 10,
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
    color: '#0d4574',
  },
  BoxHeight: {
    marginTop: 11,
  },
});
