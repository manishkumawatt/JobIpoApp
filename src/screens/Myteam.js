/* eslint-disable prettier/prettier */
// import {
//   StyleSheet,
//   Text,
//   Image,
//   View,
//   FlatList,
//   Pressable,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// // import React from 'react';
// import Menu from '../components/Menu';
// import {Header2 as Header} from '../components/Header';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Video from 'react-native-video';
// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useCallback,
//   useContext,
// } from 'react';
// import Logo from '../components/Auth/Logo';
// import {useFocusEffect} from '@react-navigation/native';
// import {AuthContext} from '../context/context';

// const Myteam = ({navigation}) => {
//   const {signOut} = useContext(AuthContext);
//   const [isLoading, setisLoading] = useState(true);
//   const [brandsData, setBrandsData] = useState([]);
//   const [totalEarning, setTotalEarning] = useState([]);

//   useFocusEffect(
//     useCallback(() => {
//       let isActive = true;
//       const GetDataFunc = async () => {
//         setisLoading(true);
//         const sliderDataApi = await fetch(
//           'https://jobipo.com/api/Agent/myNetwork',
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           },
//         )
//           .then(res => res.json())
//           .catch(err => console.log(err));

//         setisLoading(false);
//         if (sliderDataApi && sliderDataApi.logout != 1) {
//           setBrandsData(
//             JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).myNetwork,
//           );
//           setTotalEarning(
//             JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).data,
//           );
//         } else {
//           signOut();
//         }
//       };

//       if (isActive) {
//         GetDataFunc();
//       }

//       return () => {
//         isActive = false;
//       };
//     }, []),
//   );

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
//       {/* <Header title= 'My Team' /> */}
//       <ScrollView style={styles.container}>
//         {/* <View style={styles.vcustomBox}>
//           <Video
//             controls
//             resizeMode="contain"
//             source={{ uri: 'https://jobipo.com/assets/MOD Network Motion Graphics.m4v' }}
//             style={{ flex: 1, width: '100%', height: 250, padding: 0, margin: 0, }}
//           />
//         </View> */}

//         {/* <Image
//           source={require('../../assets/Image/angelonebaner.png')}
//           resizeMode="contain"
//           style={[styles.SliderImage]}
//         /> */}

//         <View style={styles.MainContainer}>
//           <View style={[styles.product, styles.BackgroundBlue]}>
//             <View style={[styles.bigWith]}>
//               <Text style={styles.title}>Your Friends</Text>
//             </View>
//             <View style={styles.productDescBox}>
//               <Text style={styles.title}>Friends Earning</Text>
//             </View>
//             <View style={styles.productDescBox}>
//               <Text style={styles.title}>Your Earning</Text>
//             </View>
//           </View>
//           <View style={[styles.product, styles.BackgroundYellow]}>
//             <View style={[styles.bigWith]}>
//               <Text style={styles.title}>
//                 {totalEarning.count} in your team
//               </Text>
//             </View>
//             <View style={styles.productDescBox}>
//               <Text style={styles.title}>
//                 ₹ {totalEarning.totalEarning ? totalEarning.totalEarning : 0}
//               </Text>
//             </View>
//             <View style={styles.productDescBox}>
//               <Text style={styles.title}>
//                 ₹{' '}
//                 {totalEarning.totalEarning ? totalEarning.totalEarning / 10 : 0}
//               </Text>
//             </View>
//           </View>

//           <FlatList
//             data={brandsData}
//             style={[styles.pmaincontrainer]}
//             keyExtractor={item => item.userID} //has to be unique
//             renderItem={({item}) => (
//               <View
//                 style={[
//                   styles.product,
//                   styles.BackgroundWhite,
//                   styles.marginTop10,
//                 ]}>
//                 <View style={[styles.bigWith]}>
//                   <Text style={styles.Datatitle}>{item.fullName}</Text>
//                   <Text style={styles.Datadesc}>
//                     Contact : {item.contactNumber1}
//                   </Text>
//                   <Text style={styles.Datadesc}>
//                     Refer Code : {item.uniqueCode}
//                   </Text>
//                 </View>
//                 <View style={styles.productDescBox}>
//                   <Text style={styles.Datatitle}>
//                     ₹ {item.AmountEarn ? item.AmountEarn : 0}
//                   </Text>
//                 </View>
//                 <View style={styles.productDescBox}>
//                   <Text style={styles.Datatitle}>
//                     ₹ {item.AmountEarn ? item.AmountEarn / 10 : 0}
//                   </Text>
//                 </View>
//               </View>
//             )}
//             horizontal={false}
//             numColumns={1}
//           />
//         </View>
//       </ScrollView>
//       <Menu />
//     </>
//   );
// };

// export default Myteam;

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
//     width: '100%',
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
//     textAlignVertical: 'top',
//     justifyContent: 'flex-start',
//   },
//   bigWith: {
//     paddingVertical: 0,
//     borderRadius: 0,
//     flex: 2,
//     paddingLeft: 5,
//     paddingBottom: 5,
//   },
//   pmaincontrainer: {
//     width: '100%',
//     marginBottom: 50,
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
//   customBox: {
//     marginLeft: '2.5%',
//     width: '95%',
//     alignItems: 'center',
//     height: 175,
//     //        backgroundColor: '#ff0',
//   },
//   vcustomBox: {
//     marginLeft: 0,
//     width: '100%',
//     padding: 0,
//     alignItems: 'center',
//     height: 200,
//     borderRadius: 20,
//     // backgroundColor: '#ff0',
//   },
//   SliderImage: {
//     marginLeft: '2.5%',
//     width: '95%',
//     alignItems: 'center',
//   },
//   BackgroundBlue: {
//     backgroundColor: '#0d4574',
//   },
//   BackgroundYellow: {
//     backgroundColor: '#FFC895',
//   },
//   BackgroundWhite: {
//     backgroundColor: '#fff',
//   },
//   MainContainer: {
//     marginLeft: '2.5%',
//     width: '95%',
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   marginTop10: {
//     marginTop: 10,
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
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
// import React from 'react';
import Menu from '../components/Menu';
import {Header2 as Header} from '../components/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import Logo from '../components/Auth/Logo';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/context';

const Myteam = ({navigation}) => {
  const {signOut} = useContext(AuthContext);
  const [isLoading, setisLoading] = useState(true);
  const [brandsData, setBrandsData] = useState([]);
  const [totalEarning, setTotalEarning] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const pageLimit = 15;

  useEffect(() => {
    GetDataFunc(1, false, false);
  }, []);

  const GetDataFunc = useCallback(
    async (page = 1, isRefresh = false, append = false) => {
      try {
        // if (isRefresh) {
        //   setIsRefreshing(true);
        // } else if (append) {
        //   setIsLoadingMore(true);
        // } else {
        //   setisLoading(true);
        // }

        const formdata = new FormData();
        formdata.append('page', page.toString());
        // formdata.append('limit', pageLimit.toString());

        console.log('API Request - Page:', page, 'Limit:', pageLimit);

        const sliderDataApi = await fetch(
          'https://jobipo.com/api/v3/agent/my-network',
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
            },
            body: formdata,
          },
        )
          .then(res => res.json())
          .catch(err => console.log(err));

        console.log('sliderDataApi--e-=-=-=-=-', sliderDataApi);
        if (sliderDataApi && sliderDataApi.logout != 1) {
          const parsedData = JSON.parse(sliderDataApi.msg);

          if (append) {
            // Append new data for pagination
            setBrandsData(prev => [...prev, ...(parsedData.myNetwork || [])]);
          } else {
            // Replace data for refresh or initial load
            setBrandsData(parsedData.myNetwork || []);
          }

          setTotalEarning(parsedData.data || {});

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
        console.error('Error fetching network data:', err);
      } finally {
        setisLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [signOut],
  );

  const handleLoadMore = () => {
    console.log('currentPage------', currentPage);
    if (!isRefreshing && currentPage != totalPages && hasMoreData) {
      setCurrentPage(currentPage + 1);
      setIsLoadingMore(true);
      GetDataFunc(currentPage + 1, false, true);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    setHasMoreData(true);
    GetDataFunc(1, true, false);
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
      {/* <Header title= 'My Team' /> */}
      <View style={styles.container}>
        <View style={styles.MainContainer}>
          <View
            style={[styles.product, styles.BackgroundBlue, styles.headerCard]}>
            <View
              style={{
                paddingVertical: 4,
                borderRadius: 0,
                flex: 1,
              }}>
              <Text style={{color: '#fff', paddingTop: 0, fontSize: 15}}>
                Your Friends
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  paddingVertical: 4,
                }}>
                <Text style={{color: '#fff', paddingTop: 0, fontSize: 15}}>
                  Friends Earning
                </Text>
              </View>
              <View
                style={{
                  paddingVertical: 4,
                }}>
                <Text style={{color: '#fff', paddingTop: 0, fontSize: 15}}>
                  Your Earning
                </Text>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.product,
              styles.BackgroundYellow,
              styles.headerCard,
            ]}>
            <View
              style={{
                paddingVertical: 4,
                borderRadius: 0,
                flex: 1,
                justifyContent: 'center',
              }}>
              <Text style={styles.title}>
                {totalEarning.count || 0} in your team
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  paddingVertical: 4,
                }}>
                <Text style={styles.title}>
                  ₹ {totalEarning.totalEarning ? totalEarning.totalEarning : 0}
                </Text>
              </View>
              <View
                style={{
                  paddingVertical: 4,
                }}>
                <Text style={styles.title}>
                  ₹{' '}
                  {totalEarning.totalEarning
                    ? totalEarning.totalEarning / 10
                    : 0}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <FlatList
          data={brandsData}
          style={[styles.pmaincontrainer]}
          keyExtractor={item => item.userID || `team-${item.fullName}`}
          renderItem={({item}) => (
            <View style={styles.MainContainer}>
              <View style={styles.product_list}>
                <View
                  style={{
                    paddingVertical: 4,
                    borderRadius: 0,
                    flex: 1,
                    paddingRight: 10,
                    justifyContent: 'center',
                  }}>
                  <Text style={styles.Datatitle}>{item.fullName}</Text>
                  <Text style={styles.Datadesc}>
                    Contact : {item.contactNumber1}
                  </Text>
                  <Text style={styles.Datadesc}>
                    Refer Code : {item.uniqueCode}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{paddingVertical: 4}}>
                    <Text style={styles.Datatitle}>
                      ₹ {item.AmountEarn ? item.AmountEarn : 0}
                    </Text>
                  </View>
                  <View style={{paddingVertical: 4}}>
                    <Text style={styles.Datatitle}>
                      ₹ {item.AmountEarn ? item.AmountEarn / 10 : 0}
                    </Text>
                  </View>
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
      <Menu />
    </>
  );
};

export default Myteam;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    flex: 1,
    // marginBottom: 50,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  product: {
    alignItems: 'center',
    textAlignVertical: 'top',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  product_list: {
    alignItems: 'center',
    textAlignVertical: 'top',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 2,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
    paddingVertical: 4,
    borderRadius: 0,
    flex: 1,

    alignItems: 'center',
    textAlignVertical: 'top',
    justifyContent: 'center',
  },
  bigWith: {
    paddingVertical: 4,
    borderRadius: 0,
    flex: 2,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'center',
  },
  pmaincontrainer: {
    width: '100%',
    // marginBottom: 50,
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
    marginLeft: '2.5%',
    width: '95%',
    alignItems: 'center',
    height: 175,
    //        backgroundColor: '#ff0',
  },
  vcustomBox: {
    marginLeft: 0,
    width: '100%',
    padding: 0,
    alignItems: 'center',
    height: 200,
    borderRadius: 20,
    // backgroundColor: '#ff0',
  },
  SliderImage: {
    marginLeft: '2.5%',
    width: '95%',
    alignItems: 'center',
  },
  BackgroundBlue: {
    backgroundColor: '#0d4574',
  },
  BackgroundYellow: {
    backgroundColor: '#FFC895',
  },
  BackgroundWhite: {
    backgroundColor: '#fff',
  },
  MainContainer: {
    marginLeft: '2.5%',
    width: '95%',
    alignItems: 'center',
    marginBottom: 10,
  },
  marginTop10: {
    marginTop: 10,
  },
  headerCard: {
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
