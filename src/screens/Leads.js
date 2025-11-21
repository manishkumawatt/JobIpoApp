// /* eslint-disable prettier/prettier */
// import {
//   StyleSheet,
//   Text,
//   Image,
//   View,
//   FlatList,
//   Pressable,
//   ScrollView,
//   TextInput,
//   ActivityIndicator,
//   TouchableOpacity,
// } from 'react-native';
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
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import {Picker} from '@react-native-picker/picker';
// import {AuthContext} from '../context/context';
// import {useFocusEffect} from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Leads = ({navigation}) => {
//   const {signOut} = useContext(AuthContext);
//   const [isLoading, setisLoading] = useState(true);
//   const [brandsData, setBrandsData] = useState([]);
//   const [BankName, setBankName] = useState('');
//   const [ProductName, setProductName] = useState('');
//   const [ProductOptions, setProductOptions] = useState([]);
//   const [LeadStatus, setLeadStatus] = useState('');
//   const [FilterDisplay, setFilterDisplay] = useState(1);

//   const [page, setPage] = useState(1);
//   const [hasMoreData, setHasMoreData] = useState(true);
//   const [isFetchingMore, setIsFetchingMore] = useState(false);

//   useFocusEffect(
//     useCallback(() => {
//       let isActive = true;
//       const PGetDataFunc = async () => {
//         setisLoading(true);
//         var formdata = {categoryID: ''};
//         const ProductData = await fetch(
//           'https://jobipo.com/api/Agent/productList',
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formdata),
//           },
//         )
//           .then(res => res.json())
//           .catch(err => console.log(err));
//         setisLoading(false);
//         if (ProductData && ProductData.logout != 1) {
//           setProductOptions(
//             JSON.parse(JSON.parse(JSON.stringify(ProductData)).msg).product,
//           );
//           GetDataFunc();
//         } else {
//           signOut();
//           //navigation.navigate('Login');
//         }
//       };

//       PGetDataFunc();
//       return () => {
//         isActive = false;
//       };
//     }, []),
//   );

//   //  const GetDataFunc = async () => {
//   //   try {
//   //     const userID = await AsyncStorage.getItem('UserID');
//   //           // console.log('my UserID', userID);

//   //     if (!userID) {
//   //       console.warn('User ID not found in AsyncStorage');
//   //       return;
//   //     }

//   //     const formdata = {
//   //       user_id: userID,
//   //       ProductName: ProductName,
//   //       LeadStatus: LeadStatus,
//   //     };
//   //     // console.log("user_id",formdata.user_id)

//   //     const response = await fetch('https://jobipo.com/api/v2/my-leads', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify(formdata),
//   //     });

//   //     const sliderDataApi = await response.json();

//   //     setisLoading(false);

//   //     if (sliderDataApi && sliderDataApi.logout != 1) {
//   //       // console.log('leads data', sliderDataApi);
//   //       setBrandsData(
//   //         JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).leads,
//   //       );
//   //     } else {
//   //       signOut();
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching leads data:', error);
//   //   }
//   // };

//   const GetDataFunc = async (pageNumber = 1) => {
//     if (isFetchingMore) return;

//     try {
//       const userID = await AsyncStorage.getItem('UserID');
//       if (!userID) return;

//       setIsFetchingMore(true);

//       const formdata = {
//         user_id: userID,
//         ProductName: ProductName,
//         LeadStatus: LeadStatus,
//         page: pageNumber, // make sure API accepts this
//       };
//       console.log('formdata-==-==-', formdata);
//       const response = await fetch('https://jobipo.com/api/v2/my-leads', {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify(formdata),
//       });

//       const responseData = await response.json();
//       setIsFetchingMore(false);

//       if (responseData && responseData.logout != 1) {
//         const newLeads = JSON.parse(
//           JSON.parse(JSON.stringify(responseData)).msg,
//         ).leads;

//         if (newLeads.length > 0) {
//           if (pageNumber === 1) {
//             setBrandsData(newLeads);
//           } else {
//             setBrandsData(prev => [...prev, ...newLeads]);
//           }
//           setPage(pageNumber + 1);
//         } else {
//           setHasMoreData(false); // no more leads
//         }
//       } else {
//         signOut();
//       }
//     } catch (err) {
//       // console.error('Error fetching leads:', err);
//       setIsFetchingMore(false);
//     }
//   };

//   const status = ['Pending', 'Approved', 'Rejected', 'Action'];

//   const products = [
//     {
//       id: 0,
//       title:
//         'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
//       content:
//         'Click on the “Share Now” button to share the tracking link with interested customers.',
//     },
//     {
//       id: 1,
//       title:
//         'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
//       content:
//         'Click on the “Share Now” button to share the tracking link with interested customers.',
//     },
//     {
//       id: 2,
//       title:
//         'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
//       content:
//         'Click on the “Share Now” button to share the tracking link with interested customers.',
//     },
//     {
//       id: 3,
//       title:
//         'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
//       content:
//         'Click on the “Share Now” button to share the tracking link with interested customers.',
//     },
//     {
//       id: 4,
//       title:
//         'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
//       content:
//         'Click on the “Share Now” button to share the tracking link with interested customers.',
//     },
//     {
//       id: 5,
//       title:
//         'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
//       content:
//         'Click on the “Share Now” button to share the tracking link with interested customers.',
//     },
//   ];
//   var options = [
//     'AIRTEL PAYMENTS BANK',
//     'ALLAHABAD BANK',
//     'ANDHRA BANK',
//     'AU SMALL FINANCE BANK',
//     'AXIS BANK',
//     'BANDHAN BANK LIMITED',
//     'BANK OF BARODA',
//     'BANK OF INDIA',
//     'BANK OF MAHARASHTRA',
//     'BARODA RAJSTHAN KSHETRIY GRAMIN BANK',
//     'CANARA BANK',
//     'CAPITAL SMALL FINANCE BANK',
//     'CENTRAL BANK OF INDIA',
//     'CITIBANK',
//     'CITY UNION BANK LTD',
//     'CORPORATION BANK',
//     'DBS BANK LTD',
//     'DCB BANK LIMITED',
//     'DENA BANK',
//     'EQUITAS SMALL FINANCE BANK',
//     'ESAF SMALL FINANCE BANK',
//     'FINCARE SMALL FINANCE BANK',
//     'FINO PAYMENTS BANK',
//     'HDFC BANK LTD',
//     'HSBC',
//     'ICICI BANK LTD',
//     'IDBI BANK LTD',
//     'IDFC BANK',
//     'INDIA POST PAYMENT BANK',
//     'INDIAN BANK',
//     'INDIAN OVERSEAS BANK',
//     'INDUSIND BANK LTD',
//     'JANA SMALL FINANCE BANK',
//     'JIO PAYMENTS BANK',
//     'KARNATAKA BANK LTD',
//     'KERALA GRAMIN BANK',
//     'KOTAK MAHINDRA BANK',
//     'NSDL PAYMENTS BANK',
//     'ORIENTAL BANK OF COMMERCE',
//     'PAYTM PAYMENTS BANK',
//     'PRATHAMA BANK',
//     'PUNJAB AND SIND BANK',
//     'PUNJAB NATIONAL BANK',
//     'RAJASTHAN MARUDHARA GRAMIN BANK',
//     'RBL BANK LIMITED',
//     'SOUTH INDIAN BANK',
//     'STANDARD CHARTERED BANK',
//     'STATE BANK OF INDIA',
//     'SURYODAY SMALL FINANCE BANK',
//     'TELANGANA STATE COOP APEX BANK',
//     'THE FEDERAL BANK LTD',
//     'THE JAMMU AND KASHMIR BANK LTD',
//     'THE KOLHAPUR URBAN BANK',
//     'THE NAINITAL BANK LIMITED',
//     'UCO BANK',
//     'UJJIVAN SMALL FINANCE BANK',
//     'UNION BANK OF INDIA',
//     'UNITED BANK OF INDIA',
//     'UTKARSH SMALL FINANCE BANK',
//     'YES BANK LTD',
//   ];
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
//       <Header title="Leads" />
//       <View style={styles.container}>
//         {/* <ScrollView style={styles.container}> */}

//         <View style={styles.MainContainer}>
//           <View style={[styles.product]}>
//             <View style={[styles.bigWith]}>
//               {/*
//                 <TextInput
//                     placeholder="Enter Name/ Number"
//                     style={styles.textInput}
//                     placeholderTextColor="#bbb"
//                 />
//                 */}
//             </View>
//             <View style={styles.buttonrow}>
//               {/* <Pressable style={styles.buttonO} onPress={() => navigation.navigate('LeadOnline')} >
//                 <Text style={styles.buttonTextO}>Online Conversion</Text>
//               </Pressable>
//               <Pressable style={styles.Bluebutton} onPress={() => navigation.navigate('LeadOffline')} >
//                 <Text style={styles.BluebuttonText}>Offline Conversion</Text>
//               </Pressable> */}
//             </View>

//             <View style={styles.filterContainer}>
//               {/* <TextInput style={styles.input} placeholder="Enter Name/ Number" /> */}

//               <Pressable
//                 style={styles.filterButton}
//                 onPress={() => {
//                   setFilterDisplay(0);
//                 }}>
//                 <Icon
//                   name="filter"
//                   size={16}
//                   color="#000"
//                   style={styles.Filtericon}
//                 />
//                 <Text style={styles.filterButtonText}>Filter</Text>
//               </Pressable>
//             </View>
//           </View>
//         </View>

//         {/* {
//     brandsData.length === 0 && !isLoading ? (
//       <View style={{ padding: 20, alignItems: 'center' }}>
//         <Text style={{ fontSize: 16, color: '#999' }}>Leads Not Found</Text>
//       </View>
//     ) : null
//   } */}

//         {isLoading && brandsData.length === 0 ? (
//           <View style={{padding: 20, alignItems: 'center'}}>
//             <Text style={{fontSize: 16, color: '#666'}}>Lead Loading...</Text>
//           </View>
//         ) : null}

//         {!isLoading && brandsData.length === 0 ? (
//           <View style={{padding: 20, alignItems: 'center'}}>
//             <Text style={{fontSize: 16, color: '#999'}}>Leads Not Found</Text>
//           </View>
//         ) : null}

//         <FlatList
//           data={brandsData}
//           style={{marginBottom: 50}}
//           keyExtractor={item => item.leadId.toString()}
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
//                   <Text style={styles.Datatitle}> {item.title}</Text>
//                   <Text style={styles.Datadesc}> {item.name}</Text>
//                   <Text style={styles.Datadesc}> {item.contactNo}</Text>
//                 </View>
//                 <View style={styles.productDescBox}>
//                   <Text style={styles.status[item.status]}>
//                     {status[item.status]}
//                   </Text>
//                   <Text style={styles.LeadId}>Lead Id : {item.leadId}</Text>
//                 </View>
//               </View>
//               {item.LeadRemark != '' ? (
//                 <View style={[styles.product, styles.BackgroundWhite]}>
//                   <View style={[styles.bigWith]}>
//                     <Text style={styles.Datadesc}>
//                       {' '}
//                       <Text style={[styles.Datadesc, {fontWeight: '700'}]}>
//                         Remark:
//                       </Text>{' '}
//                       {item.LeadRemark}
//                     </Text>
//                   </View>
//                 </View>
//               ) : (
//                 <></>
//               )}
//               <View style={[styles.product, styles.BackgroundWhite]}>
//                 <View style={[styles.productDescBox, styles.MBackgroundGray]}>
//                   <Text style={[styles.Datadesc, styles.colorblue]}>
//                     Creation Date
//                   </Text>
//                   <Text style={styles.Datatitle}>{item.CreatedAt}</Text>
//                 </View>
//                 <View style={[styles.productDescBox, styles.MBackgroundGray]}>
//                   <Text style={[styles.Datadesc, styles.colorblue]}>
//                     Pending Date
//                   </Text>
//                   <Text style={styles.Datatitle}>{item.CreatedAt}</Text>
//                 </View>
//                 <View style={[styles.productDescBox, styles.MBackgroundGray]}>
//                   <Pressable onPress={() => navigation.navigate('Contactus')}>
//                     <Text
//                       style={[
//                         styles.Datatitle,
//                         styles.colorblue,
//                         styles.BoxHeight,
//                       ]}>
//                       Get Help{' '}
//                       <FontAwesome
//                         name="arrow-circle-right"
//                         size={20}
//                         color="#535353"
//                       />
//                     </Text>
//                   </Pressable>
//                 </View>
//               </View>
//             </View>
//           )}
//           // horizontal={false}
//           // numColumns={1}
//           onEndReachedThreshold={0.5}
//           onEndReached={() => {
//             if (hasMoreData && !isFetchingMore) {
//               GetDataFunc(page);
//             }
//           }}
//           ListFooterComponent={() =>
//             isFetchingMore ? (
//               <ActivityIndicator
//                 size="small"
//                 color="#000"
//                 style={{margin: 10}}
//               />
//             ) : null
//           }
//           initialNumToRender={5}
//           maxToRenderPerBatch={5}
//           windowSize={10}
//           removeClippedSubviews={true}
//         />
//       </View>

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
//           <Picker label="By Product Name" value="" />
//           {ProductOptions.map((item, index) => {
//             return (
//               <Picker.Item
//                 label={item.title}
//                 value={item.productId}
//                 key={item.productId}
//               />
//             );
//           })}
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
//           <Picker label="By Lead Status" value="" />
//           <Picker.Item label="Pending" value="1" />
//           <Picker.Item label="Approved" value="2" />
//           <Picker.Item label="Rejected" value="3" />
//           <Picker.Item label="Action" value="4" />
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

// export default Leads;

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 0,
//     paddingHorizontal: 10,
//     backgroundColor: '#f8f8f8',
//     flex: 1,
//     marginBottom: 50,
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
//     top: 100,
//     elevation: 10,
//     left: 0,
//     height: 290,
//     borderRadius: 15,
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
//     width: '80%',
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
//     fontSize: 16,
//   },
//   Datadesc: {
//     paddingTop: 0,
//     fontSize: 13,
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
//     marginTop: 0,
//     marginLeft: '2.5%',
//     width: '95%',
//     alignItems: 'center',
//     marginBottom: 5,
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
//   viewFilter: [
//     {
//       display: 'flex',
//     },
//     {
//       display: 'none',
//     },
//   ],
//   status: [
//     {
//       backgroundColor: '#FFC895',
//       paddingHorizontal: 12,
//       borderRadius: 15,
//       color: '#fff',
//       paddingBottom: 3,
//       alignItems: 'center',
//       marginBottom: 8,
//     },
//     {
//       backgroundColor: '#0d4574',
//       paddingHorizontal: 10,
//       borderRadius: 15,
//       color: '#fff',
//       paddingBottom: 3,
//       alignItems: 'center',
//       marginBottom: 8,
//     },
//     {
//       backgroundColor: '#535353',
//       paddingHorizontal: 12,
//       borderRadius: 15,
//       color: '#fff',
//       paddingBottom: 3,
//       alignItems: 'center',
//       marginBottom: 8,
//     },
//     {
//       backgroundColor: '#62A7E7',
//       paddingHorizontal: 12,
//       borderRadius: 15,
//       color: '#fff',
//       paddingBottom: 3,
//       alignItems: 'center',
//       marginBottom: 8,
//     },
//   ],
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
//   },
//   BoxHeight: {
//     marginTop: 11,
//   },

//   filterContainer: {
//     flexDirection: 'row',
//     marginVertical: 10,
//   },
//   input: {
//     flex: 1,

//     borderRadius: 5,
//     padding: 8,
//     marginRight: 10,
//     backgroundColor: '#fff',
//   },
//   filterButton: {
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     marginLeft: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   filterButtonText: {
//     color: '#000',
//     marginRight: 5,
//   },
//   Filtericon: {
//     marginRight: 5,
//   },
//   buttonrow: {
//     marginHorizontal: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   Bluebutton: {
//     borderWidth: 0.7,
//     borderColor: '#0d4574',
//     backgroundColor: '#0d4574',
//     marginHorizontal: 6,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//   },
//   BluebuttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   buttonO: {
//     borderWidth: 0.7,
//     borderColor: '#333',
//     backgroundColor: '#fff',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     marginHorizontal: 6,
//     borderRadius: 10,
//   },
//   buttonTextO: {
//     color: '#333',
//     fontSize: 16,
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
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
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
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Picker} from '@react-native-picker/picker';
import {AuthContext} from '../context/context';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Leads = ({navigation}) => {
  const {signOut} = useContext(AuthContext);
  const [isLoading, setisLoading] = useState(true);
  const [brandsData, setBrandsData] = useState([]);
  const [BankName, setBankName] = useState('');
  const [ProductName, setProductName] = useState('');
  const [ProductOptions, setProductOptions] = useState([]);
  const [LeadStatus, setLeadStatus] = useState('');
  const [FilterDisplay, setFilterDisplay] = useState(1);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const pageLimit = 15;
  const isFetchingRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const PGetDataFunc = async () => {
        setisLoading(true);
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
        console.log('ProductData-==-==-', ProductData);
        if (ProductData && ProductData.logout != 1) {
          setProductOptions(
            JSON.parse(JSON.parse(JSON.stringify(ProductData)).msg).product,
          );
          GetDataFunc(1, false, false);
        } else {
          signOut();
          //navigation.navigate('Login');
        }
      };

      PGetDataFunc();
      return () => {
        isActive = false;
      };
    }, []),
  );

  //  const GetDataFunc = async () => {
  //   try {
  //     const userID = await AsyncStorage.getItem('UserID');
  //           // console.log('my UserID', userID);

  //     if (!userID) {
  //       console.warn('User ID not found in AsyncStorage');
  //       return;
  //     }

  //     const formdata = {
  //       user_id: userID,
  //       ProductName: ProductName,
  //       LeadStatus: LeadStatus,
  //     };
  //     // console.log("user_id",formdata.user_id)

  //     const response = await fetch('https://jobipo.com/api/v2/my-leads', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formdata),
  //     });

  //     const sliderDataApi = await response.json();

  //     setisLoading(false);

  //     if (sliderDataApi && sliderDataApi.logout != 1) {
  //       // console.log('leads data', sliderDataApi);
  //       setBrandsData(
  //         JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).leads,
  //       );
  //     } else {
  //       signOut();
  //     }
  //   } catch (error) {
  //     console.error('Error fetching leads data:', error);
  //   }
  // };

  const GetDataFunc = useCallback(
    async (
      page = 1,
      isRefresh = false,
      append = false,
      productNameOverride = null,
      leadStatusOverride = null,
    ) => {
      // Prevent multiple simultaneous calls
      if (isFetchingRef.current && append) {
        console.log('Already fetching, skipping duplicate request');
        return;
      }

      try {
        isFetchingRef.current = true;
        const userID = await AsyncStorage.getItem('UserID');
        if (!userID) {
          console.warn('User ID not found in AsyncStorage');
          return;
        }

        const formdata = new FormData();
        formdata.append('user_id', userID);
        formdata.append(
          'ProductName',
          productNameOverride !== null ? productNameOverride : ProductName,
        );
        formdata.append(
          'LeadStatus',
          leadStatusOverride !== null ? leadStatusOverride : LeadStatus,
        );
        formdata.append('page', page.toString());

        console.log('API Request - Page:', formdata);

        const response = await fetch('https://jobipo.com/api/v3/my-leads', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          },
          body: formdata,
        });

        const responseData = await response.json();
        console.log('responseData-==-==-', responseData);

        if (responseData && responseData.logout != 1) {
          const parsedData = responseData?.data || {};

          if (append) {
            // Append new data for pagination
            setBrandsData(prev => [...prev, ...(parsedData.leads || [])]);
          } else {
            // Replace data for refresh or initial load
            setBrandsData(parsedData.leads || []);
          }

          // Update pagination info
          if (parsedData.pagination) {
            const responsePage = parsedData.pagination.page || page;
            setCurrentPage(responsePage);
            setTotalPages(parsedData.pagination.totalPages || 0);
            setHasMoreData(responsePage < parsedData.pagination.totalPages);
          } else {
            // Fallback: update page if no pagination info
            setCurrentPage(page);
          }
        } else {
          signOut();
        }
      } catch (err) {
        console.error('Error fetching leads data:', err);
      } finally {
        isFetchingRef.current = false;
        setisLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [ProductName, LeadStatus, signOut],
  );

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    console.log(
      'handleLoadMore - currentPage:',
      currentPage,
      'nextPage:',
      nextPage,
      'totalPages:',
      totalPages,
      'hasMoreData:',
      hasMoreData,
      'isLoadingMore:',
      isLoadingMore,
      'isRefreshing:',
      isRefreshing,
    );

    if (
      !isRefreshing &&
      !isLoadingMore &&
      currentPage < totalPages &&
      hasMoreData
    ) {
      setIsLoadingMore(true);
      GetDataFunc(nextPage, false, true);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    setHasMoreData(true);
    isFetchingRef.current = false; // Reset the ref
    GetDataFunc(1, true, false);
  };

  const status = ['Pending', 'Approved', 'Rejected', 'Action'];
  console.log('ProductOptions-==-==-', ProductOptions);
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
      <View style={styles.container}>
        {/* <ScrollView style={styles.container}> */}

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
              {/* <Pressable style={styles.buttonO} onPress={() => navigation.navigate('LeadOnline')} >
                <Text style={styles.buttonTextO}>Online Conversion</Text>
              </Pressable>
              <Pressable style={styles.Bluebutton} onPress={() => navigation.navigate('LeadOffline')} >
                <Text style={styles.BluebuttonText}>Offline Conversion</Text>
              </Pressable> */}
            </View>

            <View style={styles.filterContainer}>
              {/* <TextInput style={styles.input} placeholder="Enter Name/ Number" /> */}

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

        {/* {
    brandsData.length === 0 && !isLoading ? (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#999' }}>Leads Not Found</Text>
      </View>
    ) : null
  } */}

        {isLoading && brandsData.length === 0 ? (
          <View style={{padding: 20, alignItems: 'center'}}>
            <Text style={{fontSize: 16, color: '#666'}}>Lead Loading...</Text>
          </View>
        ) : null}

        {!isLoading && brandsData.length === 0 ? (
          <View style={{padding: 20, alignItems: 'center'}}>
            <Text style={{fontSize: 16, color: '#999'}}>Leads Not Found</Text>
          </View>
        ) : null}

        <FlatList
          data={brandsData}
          // style={{marginBottom: 50}}
          keyExtractor={item => item.leadId?.toString() || `lead-${item.title}`}
          renderItem={({item}) => (
            <View style={styles.MainContainer}>
              <View style={styles.leadCard}>
                {/* Header Section */}
                <View style={styles.cardHeader}>
                  <View style={styles.leadInfo}>
                    <Text style={styles.leadTitle}>{item.title}</Text>
                    <Text style={styles.leadName}>{item.name}</Text>
                    <Text style={styles.leadContact}>{item.contactNo}</Text>
                  </View>
                  <View style={styles.statusContainer}>
                    <View style={styles.statusBadge}>
                      <Text style={styles.status[item.status]}>
                        {status[item.status]}
                      </Text>
                    </View>
                    <Text style={styles.leadIdText}>
                      Lead Id: {item.leadId}
                    </Text>
                  </View>
                </View>

                {/* Remark Section */}
                {item.LeadRemark != '' && (
                  <View style={styles.remarkSection}>
                    <Text style={styles.remarkLabel}>Remark :</Text>
                    <Text style={styles.remarkText}> {item.LeadRemark}</Text>
                  </View>
                )}

                {/* Details Section */}
                <View style={styles.detailsSection}>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Creation Date</Text>
                    <Text style={styles.detailValue}>{item.CreatedAt}</Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Pending Date</Text>
                    <Text style={styles.detailValue}>{item.CreatedAt}</Text>
                  </View>
                  <Pressable
                    style={styles.helpButton}
                    onPress={() => navigation.navigate('Contactus')}>
                    <Text style={styles.helpButtonText}>Get Help</Text>
                    <FontAwesome
                      name="arrow-circle-right"
                      size={18}
                      color="#0d4574"
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          horizontal={false}
          numColumns={1}
          contentContainerStyle={{paddingBottom: 20}}
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
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={
            !isLoading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  No data found
                </Text>
              </View>
            ) : null
          }
        />
      </View>

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
            setCurrentPage(1);
            setHasMoreData(true);
            isFetchingRef.current = false; // Reset the ref
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

export default Leads;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
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
    top: 100,
    elevation: 10,
    left: 0,
    height: 290,
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
    marginTop: 0,
    marginLeft: '2.5%',
    width: '95%',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  leadCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 5,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0.4,
    borderWidth: 1,
    borderColor: 'white',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leadInfo: {
    flex: 1,
    paddingRight: 12,
    alignItems: 'flex-start',
  },
  leadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    textAlign: 'left',
  },
  leadName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'left',
  },
  leadContact: {
    fontSize: 13,
    color: '#888',
    textAlign: 'left',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    marginBottom: 8,
  },
  leadIdText: {
    fontSize: 12,
    color: '#0d4574',
    fontWeight: '500',
  },
  remarkSection: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderLeftColor: '#0d4574',
  },
  remarkLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'left',
  },
  remarkText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    textAlign: 'left',
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailBox: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    // alignItems: 'center',
    // minHeight: 60,
    // justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: '#0d4574',
    fontWeight: '600',
    marginBottom: 4,
    // textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  helpButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  helpButtonText: {
    fontSize: 13,
    color: '#0d4574',
    fontWeight: '600',
    marginRight: 6,
  },
  marginTop10: {
    marginTop: 10,
  },
  paddingTop10: {
    paddingTop: 10,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
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
    marginHorizontal: 0,
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
