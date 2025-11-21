// /* eslint-disable prettier/prettier */
// import {
//   StyleSheet,
//   Text,
//   Image,
//   View,
//   FlatList,
//   Pressable,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   ActivityIndicator,
// } from 'react-native';
// import {Picker} from '@react-native-picker/picker';
// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useCallback,
//   useContext,
// } from 'react';
// import Menu from '../components/Menu';
// import {Header2 as Header} from '../components/Header';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Logo from '../components/Auth/Logo';
// import {useFocusEffect} from '@react-navigation/native';
// import {AuthContext} from '../context/context';

// const Myearning = ({navigation}) => {
//   const {signOut} = useContext(AuthContext);
//   const [earning, setEarning] = useState([]);
//   const [totalEarning, setTotalEarning] = useState([]);
//   const [bonus, setBonus] = useState([]);
//   const [paidEarning, setpaidEarning] = useState([]);
//   const [brandsData, setBrandsData] = useState([]);
//   const [isLoading, setisLoading] = useState(true);
//   const [ProductName, setProductName] = useState('');
//   const [ProductOptions, setProductOptions] = useState([]);
//   const [LeadStatus, setLeadStatus] = useState('');
//   const [FilterDisplay, setFilterDisplay] = useState(1);
//   const [selectedButton, setSelectedButton] = useState(null);

//   const GetDataFunc = async () => {
//     var formdata = {ProductName: ProductName, LeadStatus: LeadStatus};
//     setisLoading(true);
//     const sliderDataApi = await fetch(
//       'https://jobipo.com/api/Agent/myearning',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formdata),
//       },
//     )
//       .then(res => res.json())
//       .catch(err => console.log(err));
//     console.log('sliderDataApi========>', sliderDataApi);
//     setisLoading(false);
//     if (sliderDataApi && sliderDataApi.logout != 1) {
//       setEarning(
//         JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).earning,
//       );
//       setBonus(JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).bonus);

//       setTotalEarning(
//         JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).totalEarning,
//       );

//       setpaidEarning(
//         JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).paidEarning,
//       );
//     } else {
//       signOut();
//     }
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       let isActive = true;

//       if (isActive) {
//         GetDataFunc();
//       }

//       return () => {
//         isActive = false;
//       };
//     }, []),
//   );

//   // useEffect(() => {
//   //   GetDataFunc();
//   // }, []);

//   const handleButtonClick = (productName, leadStatus) => {
//     setSelectedButton(productName);
//     setProductName(productName);
//     setLeadStatus(leadStatus);
//     GetDataFuncc(productName, leadStatus);
//   };

//   const GetDataFuncc = async (productName, leadStatus) => {
//     try {
//       setisLoading(true);

//       const formdata = {ProductName: productName, LeadStatus: leadStatus};
//       // // console.log('Payload:', formdata);

//       const response = await fetch('https://jobipo.com/api/Agent/myearning', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formdata),
//       });

//       const sliderDataApi = await response.json();

//       setisLoading(false);

//       if (sliderDataApi?.logout !== 1) {
//         const msg = JSON.parse(sliderDataApi?.msg);
//         setEarning(msg.earning);
//         setBonus(msg.bonus);
//         setTotalEarning(msg.totalEarning);
//         setpaidEarning(msg.paidEarning);

//         // // console.log('API Response Processed:', msg);
//       } else {
//         // // console.log('User is logged out or invalid data.');
//       }
//     } catch (err) {
//       // console.error('Error fetching data:', err);
//       setisLoading(false);
//     }
//   };

//   return (
//     <>
//       <View
//         style={[
//           isLoading == true
//             ? {
//                 position: 'absolute',
//                 height: '100%',
//                 width: '100%',
//                 backgroundColor: 'rgba(0,0,0,0.4)',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 zIndex: 5,
//               }
//             : {
//                 display: 'none',
//               },
//         ]}>
//         {/* <Logo /> */}
//         <ActivityIndicator size="large" />
//       </View>
//       {/* <Header title= 'My Earning' /> */}
//       <ScrollView style={styles.container}>
//         <View style={styles.MainContainer}>
//           <View style={[styles.product]}>
//             <View style={[styles.bigWith]}>
//               <Text style={[styles.Datatitle, styles.DataTitleBig]}>
//                 ₹ {totalEarning}/-
//               </Text>
//               <Text style={styles.DataSmall}>
//                 ₹ {paidEarning} + ₹ {totalEarning - paidEarning} Pending
//               </Text>
//             </View>
//             <View style={styles.productDescBox}>
//               <Pressable
//                 onPress={
//                   () => {
//                     setFilterDisplay(0);
//                   } // navigation.navigate('Trainings')
//                 }
//                 style={styles.customBox}>
//                 <Text color="#535353">
//                   <FontAwesome name="filter" size={20} color="#535353" /> Filter
//                 </Text>
//               </Pressable>
//             </View>
//           </View>
//         </View>

//         {/*
//           <View style={styles.MainContainer}>
//               <View style={[ styles.marginTop10]}>
//                   <View style={styles.cardContainer}>
//                       <Pressable
//                           style={[styles.btnCode, styles.BackgroundBlue]}>
//                           <Text style={[styles.btnCodeText, styles.textwhite]}>Your Earning</Text>
//                       </Pressable>
//                       <Pressable
//                           style={[styles.btnCode, styles.BackgroundWhite]}>
//                           <Text style={[styles.btnCodeText]}>Team Earning</Text>
//                       </Pressable>
//                   </View>
//               </View>
//           </View>
//           */}
//         <View style={styles.Btnrow}>
//           <Pressable
//             style={[
//               styles.button,
//               selectedButton == '1' && styles.selectedButton,
//             ]}
//             onPress={() => handleButtonClick('1', '')}>
//             <Text
//               style={[
//                 styles.buttonText,
//                 selectedButton === '1' && styles.selectedText,
//               ]}>
//               By Self
//             </Text>
//           </Pressable>
//           <Pressable
//             style={[
//               styles.button,
//               selectedButton === '2' && styles.selectedButton,
//             ]}
//             onPress={() => handleButtonClick('2', '')}>
//             <Text
//               style={[
//                 styles.buttonText,
//                 selectedButton === '2' && styles.selectedText,
//               ]}>
//               By Team
//             </Text>
//           </Pressable>
//         </View>
//         {/* <Text style={styles.selectedText}>Selected: {ProductName}</Text>
//       <Text style={styles.selectedText}>Lead Status: {LeadStatus}</Text> */}

//         <FlatList
//           data={earning}
//           style={[styles.pmaincontrainer]}
//           keyExtractor={item => item.transectionId} //has to be unique
//           renderItem={({item}) => (
//             <View style={styles.MainContainer}>
//               <View
//                 style={[
//                   styles.product,
//                   styles.BackgroundWhite,
//                   styles.marginTop10,
//                   styles.paddingTop10,
//                 ]}>
//                 <View style={[styles.bigWith]}>
//                   <Text style={styles.Datatitle}>{item.title}</Text>
//                   <Text style={styles.Datadesc}>{item.AgentName}</Text>
//                   <Text style={styles.Datadesc}>Lead Id : {item.leadId}</Text>
//                 </View>
//                 <View style={styles.productDescBox}>
//                   <Text
//                     style={[styles.status, styles.statusColor[item.Status]]}>
//                     {item.Status == 1 ? 'Paid' : 'Not Paid'}
//                   </Text>
//                   <Text style={styles.LeadId}>Amount : ₹ {item.Amount}/-</Text>
//                 </View>
//               </View>
//               <View style={[styles.product, styles.BackgroundWhite]}>
//                 <View style={[styles.productDescBox, styles.MBackgroundGray]}>
//                   <Text style={[styles.Datadesc, styles.colorblue]}>
//                     Approved Date
//                   </Text>
//                   <Text style={styles.Datatitle}>{item.CreatedAt}</Text>
//                 </View>
//                 <View style={[styles.productDescBox, styles.MBackgroundGray]}>
//                   <Text style={[styles.Datadesc, styles.colorblue]}>
//                     A/C Transfer Date
//                   </Text>
//                   <Text style={styles.Datatitle}>{item.expectedPD}</Text>
//                 </View>
//                 <View style={[styles.productDescBox, styles.MBackgroundGray]}>
//                   <Text style={[styles.Datadesc, styles.colorblue]}>
//                     Work By Friend
//                   </Text>
//                   <Text style={styles.Datatitle}>
//                     {item.AgentName.split(' ')['0']}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           )}
//           horizontal={false}
//           numColumns={1}
//         />

//         <FlatList
//           data={bonus}
//           style={[styles.pmaincontrainer, {marginBottom: 50}]}
//           keyExtractor={item => item.bonusId} //has to be unique
//           renderItem={({item}) => (
//             <View style={styles.MainContainer}>
//               <View
//                 style={[
//                   styles.product,
//                   styles.BackgroundWhite,
//                   styles.marginTop10,
//                   styles.paddingTop10,
//                 ]}>
//                 <View style={[styles.bigWith]}>
//                   <Text style={styles.Datatitle}>
//                     {item.BonusType == 'REFERALBONUS'
//                       ? 'Referal Bonus'
//                       : 'Signup Bonus'}{' '}
//                   </Text>
//                   <Text style={styles.Datadesc}>{item.fullName}</Text>
//                   <Text style={styles.Datadesc}>Lead Id : {item.leadId}</Text>
//                 </View>
//                 <View style={styles.productDescBox}>
//                   <Text
//                     style={[
//                       styles.status,
//                       styles.statusColor[item.PaymentStatus],
//                     ]}>
//                     {item.PaymentStatus == 1 ? 'Paid' : 'Not Paid'}
//                   </Text>
//                   <Text style={styles.LeadId}>Amount : ₹ {item.Amount}/-</Text>
//                 </View>
//               </View>
//               <View style={[styles.product, styles.BackgroundWhite]}>
//                 <View style={[styles.productDescBox, styles.MBackgroundGray]}>
//                   <Text style={[styles.Datadesc, styles.colorblue]}>
//                     Approved Date
//                   </Text>
//                   <Text style={styles.Datatitle}>{item.AprovedOn}</Text>
//                 </View>
//                 <View style={[styles.productDescBox, styles.MBackgroundGray]}>
//                   <Text style={[styles.Datadesc, styles.colorblue]}>
//                     Payment Date
//                   </Text>
//                   <Text style={styles.Datatitle}>{item.PaidOn}</Text>
//                 </View>
//                 <View style={[styles.productDescBox, styles.MBackgroundGray]}>
//                   <Text style={[styles.Datadesc, styles.colorblue]}>
//                     Work By Friend
//                   </Text>
//                   <Text style={styles.Datatitle}>
//                     {item.fullName.split(' ')['0']}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           )}
//           horizontal={false}
//           numColumns={1}
//         />
//       </ScrollView>

//       <View style={[styles.fcontainer, styles.viewFilter[FilterDisplay]]}>
//         <Text style={[styles.ffiltertext]}>Filter Data</Text>

//         <Picker
//           selectedValue={ProductName}
//           mode="cover"
//           dropdownIconColor="#323232"
//           dropdownIconRippleColor="#ccc"
//           style={{
//             width: '100%',
//             color: '#000',
//             backgroundColor: '#FFFFFF',
//             borderWidth: 1,
//             borderColor: '#D9D9D9',
//           }}
//           onValueChange={(itemValue, itemIndex) => {
//             setProductName(itemValue);
//           }}>
//           <Picker label="All Leads" value="" />
//           <Picker.Item label="By Self" value="1" />
//           <Picker.Item label="By Team" value="2" />
//         </Picker>

//         <Picker
//           selectedValue={LeadStatus}
//           mode="cover"
//           dropdownIconColor="#323232"
//           dropdownIconRippleColor="#ccc"
//           style={{
//             width: '100%',
//             color: '#000',
//             backgroundColor: '#FFFFFF',
//             borderWidth: 1,
//             borderColor: '#D9D9D9',
//           }}
//           onValueChange={(itemValue, itemIndex) => {
//             setLeadStatus(itemValue);
//           }}>
//           <Picker label="By Payment Status" value="" />
//           <Picker.Item label="Pending" value="1" />
//           <Picker.Item label="Paid" value="2" />
//         </Picker>
//         <Pressable
//           onPress={() => {
//             setFilterDisplay(1);
//             GetDataFunc();
//           }}
//           style={styles.applybtn}>
//           <Text style={{color: '#fff', textAlign: 'center', fontSize: 15}}>
//             Apply
//           </Text>
//         </Pressable>
//       </View>

//       <Menu />
//     </>
//   );
// };

// export default Myearning;

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     backgroundColor: '#f8f8f8',
//     flex: 1,
//     marginBottom: 50,
//   },
//   product: {
//     alignItems: 'center',
//     textAlignVertical: 'top',
//     paddingTop: 0,
//     paddingBottom: 5,
//     paddingHorizontal: 4,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   image: {
//     width: '100%',
//     backgroundColor: '#edfaff',
//     alignItems: 'center',
//   },
//   title: {
//     color: '#fff',
//     paddingTop: 0,
//     fontSize: 16,
//   },
//   Datatitle: {
//     paddingTop: 0,
//     fontSize: 13,
//   },
//   DataSmall: {
//     fontSize: 10,
//   },
//   DataTitleBig: {
//     fontSize: 25,
//     color: '#0d4574',
//   },
//   Datadesc: {
//     paddingTop: 5,
//     fontSize: 12,
//   },
//   productNo: {
//     color: '#595959',
//     marginVertical: 10,
//     fontSize: 12,
//   },
//   productDescBox: {
//     paddingVertical: 0,
//     borderRadius: 0,
//     flex: 1,
//     paddingLeft: 5,
//     paddingBottom: 5,
//     alignItems: 'center',
//   },
//   viewFilter: [
//     {
//       display: 'flex',
//     },
//     {
//       display: 'none',
//     },
//   ],
//   bigWith: {
//     paddingVertical: 0,
//     borderRadius: 0,
//     flex: 3,
//     paddingLeft: 5,
//     paddingBottom: 5,
//   },
//   productDesc: {
//     textAlign: 'center',
//     color: '#595959',
//     fontSize: 12,
//     textAlignVertical: 'top',
//   },
//   cardIcon: {
//     fontSize: 25,
//   },
//   cardText: {
//     fontSize: 15,
//     color: '#0d4574',
//   },
//   card: {
//     marginTop: 15,
//   },
//   cardContainer: {
//     flexDirection: 'row',
//     marginTop: 5,
//     justifyContent: 'space-between',
//   },
//   btnCode: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 50,
//     height: 40,
//     width: '49%',
//   },

//   btnCodeText: {
//     fontSize: 14,
//   },
//   applybtn: {
//     backgroundColor: '#0d4574',
//     color: '#fff',
//     width: 80,
//     borderRadius: 5,
//     minHeight: 40,
//     marginRight: 10,
//     position: 'absolute',
//     bottom: 50,
//     right: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   customBox: {
//     backgroundColor: '#fff',
//     width: '95%',
//     alignItems: 'center',
//     height: 40,
//     paddingTop: 7,
//   },
//   /*
//       customBox:{
//           width: '95%',
//           alignItems: 'center',
//           height: 40,
//           paddingTop: 7,
//       },*/
//   statusColor: [
//     {
//       // backgroundColor: "#000",
//       fontSize: 10,
//     },
//     {
//       backgroundColor: '#0d4574',
//     },
//   ],
//   SliderImage: {
//     marginLeft: '2.5%',
//     width: '95%',
//     alignItems: 'center',
//   },
//   BackgroundBlue: {
//     backgroundColor: '#0d4574',
//   },
//   colorblue: {
//     color: '#0d4574',
//   },
//   BackgroundYellow: {
//     backgroundColor: '#FFC895',
//   },
//   BackgroundWhite: {
//     backgroundColor: '#fff',
//   },
//   MBackgroundGray: {
//     backgroundColor: '#F8F8F8',
//     margin: 3,
//     height: 45,
//     textAlignVertical: 'center',
//     alignItems: 'center',
//     textAlign: 'center',
//   },
//   MainContainer: {
//     marginLeft: '2.5%',
//     width: '95%',
//     alignItems: 'center',
//   },
//   marginTop10: {
//     marginTop: 10,
//   },
//   paddingTop10: {
//     paddingTop: 10,
//   },
//   marginBottom10: {
//     marginBottom: 30,
//   },
//   textInput: {
//     backgroundColor: '#fff',
//     height: 40,
//   },
//   ffiltertext: {
//     fontSize: 20,
//     color: '#000',
//   },
//   fcontainer: {
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     width: '95%',
//     marginLeft: '2.5%',
//     backgroundColor: '#fff',
//     position: 'absolute',
//     top: 60,
//     left: 0,
//     height: 290,
//     elevation: 10,
//     borderRadius: 15,
//   },
//   status: {
//     backgroundColor: '#FFC895',
//     paddingHorizontal: 15,
//     borderRadius: 15,
//     color: '#fff',
//     paddingBottom: 3,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   statusAction: {
//     backgroundColor: '#62A7E7',
//   },
//   statusApproved: {
//     backgroundColor: '#0d4574',
//     marginLeft: -10,
//   },
//   statusRejected: {
//     backgroundColor: '#535353',
//     marginLeft: -10,
//   },
//   LeadId: {
//     marginLeft: -30,
//     color: '#0d4574',
//   },
//   BoxHeight: {
//     marginTop: 11,
//   },
//   Btnrow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     width: '100%',
//   },
//   button: {
//     backgroundColor: '#fff',
//     paddingVertical: 10,
//     paddingHorizontal: 60,
//     borderRadius: 5,
//     marginHorizontal: 5,
//     borderColor: '#0d4574',
//     borderWidth: 1,
//   },
//   buttonText: {
//     color: '#333',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   selectedButton: {
//     backgroundColor: '#0d4574',
//     borderColor: '#0d4574',
//   },
//   selectedText: {
//     color: '#fff',
//   },
// });
/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  Pressable,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import Menu from '../components/Menu';
import {Header2 as Header} from '../components/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Logo from '../components/Auth/Logo';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/context';

const Myearning = ({navigation}) => {
  const {signOut} = useContext(AuthContext);
  const [earning, setEarning] = useState([]);
  const [totalEarning, setTotalEarning] = useState(0);
  const [bonus, setBonus] = useState([]);
  const [paidEarning, setpaidEarning] = useState(0);
  const [brandsData, setBrandsData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [ProductName, setProductName] = useState('');
  const [ProductOptions, setProductOptions] = useState([]);
  const [LeadStatus, setLeadStatus] = useState('');
  const [FilterDisplay, setFilterDisplay] = useState(1);
  const [selectedButton, setSelectedButton] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const pageLimit = 15;

  useEffect(() => {
    GetDataFunc(1, false, false);
  }, []);
  const GetDataFunc = useCallback(
    async (
      page = 1,
      isRefresh = false,
      append = false,
      productNameOverride = null,
      leadStatusOverride = null,
    ) => {
      try {
        const formdata = new FormData();
        formdata.append(
          'ProductName',
          productNameOverride !== null ? productNameOverride : ProductName,
        );
        formdata.append(
          'LeadStatus',
          leadStatusOverride !== null ? leadStatusOverride : LeadStatus,
        );
        formdata.append('page', page.toString());
        console.log('formdata------', formdata);
        const response = await fetch(
          'https://jobipo.com/api/v3/agent/my-earning',
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
            },
            body: formdata,
          },
        );

        const sliderDataApi = await response.json();
        // console.log('sliderDataApi-=-=-=-=-', sliderDataApi);
        if (sliderDataApi && sliderDataApi.logout != 1) {
          const parsedData = JSON.parse(sliderDataApi.msg);

          if (append) {
            // Append new data for pagination
            setEarning(prev => [...prev, ...(parsedData.earning || [])]);
            setBonus(prev => [...prev, ...(parsedData.bonus || [])]);
          } else {
            // Replace data for refresh or initial load
            setEarning(parsedData.earning || []);
            setBonus(parsedData.bonus || []);
          }

          setTotalEarning(parsedData.totalEarning || 0);
          setpaidEarning(parsedData.paidEarning || 0);

          // Update pagination info
          if (parsedData.pagination) {
            setCurrentPage(parsedData.pagination.page || 1);
            setTotalPages(parsedData.pagination.totalPages || 0);
            setHasMoreData(
              parsedData.pagination.page < parsedData.pagination.totalPages,
            );
          }
        } else {
          signOut();
        }
      } catch (err) {
        console.error('Error fetching earnings:', err);
      } finally {
        setisLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [ProductName, LeadStatus, signOut],
  );

  const handleLoadMore = () => {
    console.log('currentPage------', currentPage);
    if (!isRefreshing && currentPage != totalPages) {
      setCurrentPage(currentPage + 1);
      setIsLoadingMore(true);
      // setisLoading(true);
      GetDataFunc(currentPage + 1, false, true);
    }
  };
  const handleRefresh = () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    GetDataFunc(1, false, false);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 5000);
  };
  // useFocusEffect(
  //   React.useCallback(() => {
  //     let isActive = true;

  //     if (isActive) {
  //       setCurrentPage(1);
  //       setHasMoreData(true);
  //       GetDataFunc(1, false, false);
  //     }

  //     return () => {
  //       isActive = false;
  //     };
  //   }, [GetDataFunc]),
  // );

  // useEffect(() => {
  //   GetDataFunc();
  // }, []);

  const handleButtonClick = useCallback(
    (productName, leadStatus) => {
      setSelectedButton(productName);
      setProductName(productName);
      setLeadStatus(leadStatus);
      setCurrentPage(1);
      setHasMoreData(true);
      // Call GetDataFunc with new filter values
      GetDataFunc(1, false, false, productName, leadStatus);
    },
    [GetDataFunc],
  );

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
      {/* <Header title= 'My Earning' /> */}
      {/* <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }> */}
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
      <View style={styles.Btnrow}>
        <Pressable
          style={[
            styles.button,
            selectedButton == '1' && styles.selectedButton,
          ]}
          onPress={() => handleButtonClick('1', '')}>
          <Text
            style={[
              styles.buttonText,
              selectedButton === '1' && styles.selectedText,
            ]}>
            By Self
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            selectedButton === '2' && styles.selectedButton,
          ]}
          onPress={() => handleButtonClick('2', '')}>
          <Text
            style={[
              styles.buttonText,
              selectedButton === '2' && styles.selectedText,
            ]}>
            By Team
          </Text>
        </Pressable>
      </View>
      {/* <Text style={styles.selectedText}>Selected: {ProductName}</Text>
      <Text style={styles.selectedText}>Lead Status: {LeadStatus}</Text> */}

      <FlatList
        data={earning}
        style={[styles.pmaincontrainer]}
        keyExtractor={item => item.transectionId || `earning-${item.leadId}`}
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
                <Text style={[styles.status, styles.statusColor[item.Status]]}>
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
        contentContainerStyle={{paddingBottom: 50}}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color="#0d4574" />
            </View>
          ) : null
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        keyboardShouldPersistTaps={'handled'}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>
              No data found
            </Text>
          </View>
        }
      />

      {/* <FlatList
        data={bonus}
        style={[styles.pmaincontrainer, {marginBottom: 50}]}
        keyExtractor={item => item.bonusId || `bonus-${item.leadId}`}
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
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color="#0d4574" />
            </View>
          ) : null
        }
        // onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      /> */}
      {/* </ScrollView> */}

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
            setCurrentPage(1);
            setHasMoreData(true);
            GetDataFunc(1, false, false);
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
    width: 80,
    borderRadius: 5,
    minHeight: 40,
    marginRight: 10,
    position: 'absolute',
    bottom: 50,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
    height: 290,
    elevation: 10,
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
  Btnrow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 5,
    marginHorizontal: 5,
    borderColor: '#0d4574',
    borderWidth: 1,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedButton: {
    backgroundColor: '#0d4574',
    borderColor: '#0d4574',
  },
  selectedText: {
    color: '#fff',
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  pmaincontrainer: {
    width: '100%',
  },
});
