// /* eslint-disable prettier/prettier */
// import {
//   StyleSheet,
//   Text,
//   Image,
//   View,
//   FlatList,
//   Pressable,
//   Linking,
//   ActivityIndicator,
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
// import {useFocusEffect} from '@react-navigation/native';
// import {AuthContext} from '../context/context';

// const Trainings = ({navigation}) => {
//   const {signOut} = useContext(AuthContext);
//   const [brandsData, setBrandsData] = useState([]);
//   const [trainingType, settrainingType] = useState(1);
//   const [isLoading, setisLoading] = useState(true);

//   const GetDataFunc = async ttrainingType => {
//     setisLoading(true);
//     const formdata = {trainingType: ttrainingType};
//     const sliderDataApi = await fetch('https://jobipo.com/api/Agent/training', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(formdata),
//     })
//       .then(res => res.json())
//       .catch(err => console.log(err));

//     console.log('sliderDataApi-==-==-', sliderDataApi);

//     setisLoading(false);
//     if (sliderDataApi && sliderDataApi.logout != 1) {
//       setBrandsData(
//         JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).training,
//       );
//     } else {
//       signOut();
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       let isActive = true;

//       if (isActive) {
//         GetDataFunc(1);
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
//       {/* <Header title= 'Trainings' /> */}
//       <View style={styles.container}>
//         <View style={styles.MainContainer}>
//           <View style={[styles.marginTop10]}>
//             <View style={styles.cardContainer}>
//               <Pressable
//                 onPress={() => {
//                   settrainingType(2);
//                   GetDataFunc(2);
//                 }}
//                 style={[
//                   styles.btnCode,
//                   trainingType == 2
//                     ? {
//                         color: '#0d4574',
//                         borderBottomWidth: 1,
//                         borderBottomColor: '#0d4574',
//                       }
//                     : {},
//                 ]}>
//                 <Text
//                   style={[
//                     styles.btnCodeText,
//                     trainingType == 2
//                       ? {
//                           color: '#0d4574',
//                         }
//                       : {},
//                   ]}>
//                   Live Training
//                 </Text>
//               </Pressable>
//               <Pressable
//                 onPress={() => {
//                   settrainingType(1);
//                   GetDataFunc(1);
//                 }}
//                 style={[
//                   styles.btnCode,
//                   trainingType == 1
//                     ? {
//                         color: '#0d4574',
//                         borderBottomWidth: 1,
//                         borderBottomColor: '#0d4574',
//                       }
//                     : {},
//                 ]}>
//                 <Text
//                   style={[
//                     styles.btnCodeText,
//                     trainingType == 1
//                       ? {
//                           color: '#0d4574',
//                         }
//                       : {},
//                   ]}>
//                   Youtube Training
//                 </Text>
//               </Pressable>
//             </View>
//           </View>
//         </View>

//         <FlatList
//           data={brandsData}
//           keyExtractor={item => item.trainingID} //has to be unique
//           renderItem={({item}) => (
//             <Pressable onPress={() => {}} style={[styles.product]}>
//               <Image
//                 source={{uri: item.image}}
//                 style={styles.image}
//                 resizeMode="contain"
//               />
//               <View style={styles.productDescBox}>
//                 <Text style={styles.title}>{item.title}</Text>
//                 <Pressable
//                   onPress={() => {
//                     Linking.openURL(`https://www.jobipo.com/`);
//                   }}
//                   style={styles.card}>
//                   <Text style={styles.cardText}>
//                     <FontAwesome
//                       name="play-circle"
//                       style={styles.cardIcon}
//                       color="#0d4574"
//                     />{' '}
//                     Watch Now
//                   </Text>
//                 </Pressable>
//               </View>
//             </Pressable>
//           )}
//           horizontal={false}
//           numColumns={1}
//         />
//       </View>
//       <Menu />
//     </>
//   );
// };

// export default Trainings;

// var styles = StyleSheet.create({
//   container: {
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     backgroundColor: '#f8f8f8',
//     flex: 1,
//     marginBottom: 50,
//   },
//   product: {
//     backgroundColor: '#fff',
//     width: '95%',
//     margin: 10,
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     paddingTop: 22,
//     paddingBottom: 5,
//     paddingHorizontal: 4,
//     borderRadius: 5,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   btnCode: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 50,
//     height: 40,
//     width: '49%',
//   },
//   textwhite: {
//     color: '#fff',
//   },
//   btnLiveTraining: {
//     color: '#0d4574',
//     borderBottomWidth: 1,
//     borderBottomColor: '#0d4574',
//   },
//   btnYoutubeTraining: {},
//   txtLiveTraining: {
//     color: '#0d4574',
//   },
//   txtYoutubeTraining: {},
//   cardContainer: {
//     flexDirection: 'row',
//     marginTop: 5,
//     justifyContent: 'space-between',
//   },
//   BackgroundBlue: {
//     backgroundColor: '#0d4574',
//   },
//   btnCodeText: {
//     fontSize: 17,
//   },
//   image: {
//     width: 80,
//     height: 80,
//     flex: 2,
//     backgroundColor: '#edfaff',
//     borderRadius: 10,
//     marginRight: 20,
//     alignItems: 'center',
//   },
//   title: {
//     color: '#595959',
//     paddingTop: 0,
//     fontSize: 14,
//   },
//   productNo: {
//     color: '#595959',
//     marginVertical: 10,
//     fontSize: 12,
//   },
//   productDescBox: {
//     width: '80%',
//     paddingVertical: 0,
//     borderRadius: 0,
//     flex: 5,
//     borderLeftWidth: 1,
//     borderLeftColor: '#EDFAFF',
//     paddingLeft: 5,
//     paddingBottom: 5,
//   },
//   productDesc: {
//     textAlign: 'center',
//     color: '#595959',
//     fontSize: 12,
//   },
//   cardIcon: {
//     fontSize: 15,
//   },
//   cardText: {
//     fontSize: 15,
//     color: '#0d4574',
//   },
//   card: {
//     marginTop: 15,
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
  Linking,
  ActivityIndicator,
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
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/context';

const Trainings = ({navigation}) => {
  const {signOut} = useContext(AuthContext);
  const [brandsData, setBrandsData] = useState([]);
  const [trainingType, settrainingType] = useState(1);
  const [isLoading, setisLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const pageLimit = 15;
  const isFetchingRef = useRef(false);

  const GetDataFunc = useCallback(
    async (ttrainingType, page = 1, isRefresh = false, append = false) => {
      // Prevent multiple simultaneous calls
      if (isFetchingRef.current && append) {
        console.log('Already fetching, skipping duplicate request');
        return;
      }

      try {
        isFetchingRef.current = true;
        const formdata = new FormData();
        formdata.append('trainingType', ttrainingType.toString());
        formdata.append('page', page.toString());

        console.log(
          'API Request - Page:',
          page,
          'TrainingType:',
          ttrainingType,
        );

        const response = await fetch(
          'https://jobipo.com/api/v3/agent/training',
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
            },
            body: formdata,
          },
        );

        const sliderDataApi = await response.json();
        console.log('sliderDataApi-=dd=-==-', sliderDataApi);

        if (sliderDataApi && sliderDataApi.logout != 1) {
          const parsedData = JSON.parse(sliderDataApi.msg);
          const trainingData =
            parsedData.training || parsedData.data?.training || [];

          if (append) {
            // Append new data for pagination
            setBrandsData(prev => [...prev, ...trainingData]);
          } else {
            // Replace data for refresh or initial load
            setBrandsData(trainingData);
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
        console.error('Error fetching training data:', err);
      } finally {
        isFetchingRef.current = false;
        setisLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [signOut],
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
    );

    if (
      !isRefreshing &&
      !isLoadingMore &&
      currentPage < totalPages &&
      hasMoreData
    ) {
      setIsLoadingMore(true);
      GetDataFunc(trainingType, nextPage, false, true);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    setHasMoreData(true);
    isFetchingRef.current = false; // Reset the ref
    GetDataFunc(trainingType, 1, true, false);
  };

  useEffect(() => {
    GetDataFunc(trainingType, 1, false, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingType]);

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
      {/* <Header title= 'Trainings' /> */}
      <View style={styles.container}>
        <View style={styles.MainContainer}>
          <View style={[styles.marginTop10]}>
            <View style={styles.cardContainer}>
              <Pressable
                onPress={() => {
                  settrainingType(2);
                  setCurrentPage(1);
                  setHasMoreData(true);
                  isFetchingRef.current = false;
                  GetDataFunc(2, 1, false, false);
                }}
                style={[
                  styles.btnCode,
                  trainingType == 2
                    ? {
                        color: '#0d4574',
                        borderBottomWidth: 1,
                        borderBottomColor: '#0d4574',
                      }
                    : {},
                ]}>
                <Text
                  style={[
                    styles.btnCodeText,
                    trainingType == 2
                      ? {
                          color: '#0d4574',
                        }
                      : {},
                  ]}>
                  Live Training
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  settrainingType(1);
                  setCurrentPage(1);
                  setHasMoreData(true);
                  isFetchingRef.current = false;
                  GetDataFunc(1, 1, false, false);
                }}
                style={[
                  styles.btnCode,
                  trainingType == 1
                    ? {
                        color: '#0d4574',
                        borderBottomWidth: 1,
                        borderBottomColor: '#0d4574',
                      }
                    : {},
                ]}>
                <Text
                  style={[
                    styles.btnCodeText,
                    trainingType == 1
                      ? {
                          color: '#0d4574',
                        }
                      : {},
                  ]}>
                  Youtube Training
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <FlatList
          data={brandsData}
          keyExtractor={item =>
            item.trainingID?.toString() || `training-${item.title}`
          }
          renderItem={({item}) => (
            <Pressable onPress={() => {}} style={[styles.product]}>
              <Image
                source={{uri: item.image}}
                style={styles.image}
                resizeMode="contain"
              />
              <View style={styles.productDescBox}>
                <Text style={styles.title}>{item.title}</Text>
                <Pressable
                  onPress={() => {
                    Linking.openURL(`https://www.jobipo.com/`);
                  }}
                  style={styles.card}>
                  <Text style={styles.cardText}>
                    <FontAwesome
                      name="play-circle"
                      style={styles.cardIcon}
                      color="#0d4574"
                    />{' '}
                    Watch Now
                  </Text>
                </Pressable>
              </View>
            </Pressable>
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
                  paddingVertical: 40,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#999',
                  }}>
                  No training data found
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

export default Trainings;

var styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    flex: 1,
    marginBottom: 50,
  },
  product: {
    backgroundColor: '#fff',
    width: '95%',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 22,
    paddingBottom: 5,
    paddingHorizontal: 4,
    borderRadius: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  btnCode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    height: 40,
    width: '49%',
  },
  textwhite: {
    color: '#fff',
  },
  btnLiveTraining: {
    color: '#0d4574',
    borderBottomWidth: 1,
    borderBottomColor: '#0d4574',
  },
  btnYoutubeTraining: {},
  txtLiveTraining: {
    color: '#0d4574',
  },
  txtYoutubeTraining: {},
  cardContainer: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'space-between',
  },
  BackgroundBlue: {
    backgroundColor: '#0d4574',
  },
  btnCodeText: {
    fontSize: 17,
  },
  image: {
    width: 80,
    height: 80,
    flex: 2,
    backgroundColor: '#edfaff',
    borderRadius: 10,
    marginRight: 20,
    alignItems: 'center',
  },
  title: {
    color: '#595959',
    paddingTop: 0,
    fontSize: 14,
  },
  productNo: {
    color: '#595959',
    marginVertical: 10,
    fontSize: 12,
  },
  productDescBox: {
    width: '80%',
    paddingVertical: 0,
    borderRadius: 0,
    flex: 5,
    borderLeftWidth: 1,
    borderLeftColor: '#EDFAFF',
    paddingLeft: 5,
    paddingBottom: 5,
  },
  productDesc: {
    textAlign: 'center',
    color: '#595959',
    fontSize: 12,
  },
  cardIcon: {
    fontSize: 15,
  },
  cardText: {
    fontSize: 15,
    color: '#0d4574',
  },
  card: {
    marginTop: 15,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
});
