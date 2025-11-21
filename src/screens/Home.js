/* eslint-disable prettier/prettier */
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   Image,
//   FlatList,
//   Pressable,
//   Share,
//   Linking,
//   Alert,
//   ActivityIndicator,
//   Dimensions,
//   TextInput,
//   TouchableOpacity,
// } from 'react-native';
// import React, {useState, useEffect} from 'react';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Feather from 'react-native-vector-icons/Feather';
// import Icon from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Menu from '../components/Menu';
// import Animated, {
//   FadeIn,
//   FadeInDown,
//   FadeInUp,
//   SlideInRight,
//   ZoomIn,
// } from 'react-native-reanimated';
// import imagePath from '../theme/imagePath';
// import TopHeaderAffiliate from '../components/TopHeaderAffiliate';
// const {width} = Dimensions.get('window');

// const Home = ({navigation}) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [users, setUsers] = useState({});
//   const [products, setProducts] = useState([]);
//   const [suggestionProducts, setSuggestionProducts] = useState([
//     {
//       id: '1',
//       name: 'Portronics Mouse P3515....',
//       image: imagePath.mouse,
//       price: 519,
//       cut_price: 619,
//       backgroundColor: '#E8F4FD',
//     },
//     {
//       id: '2',
//       name: 'Logitech Keyboard L5126...',
//       image: imagePath.mouse_o,
//       price: 816,
//       cut_price: 916,
//       backgroundColor: '#FFF3F3',
//     },
//     {
//       id: '3',
//       name: 'Portronics Mouse P3515....',
//       image: imagePath.keyboard,
//       price: 519,
//       cut_price: 619,
//       backgroundColor: '#EDF7FF',
//     },
//     {
//       id: '4',
//       name: 'Logitech Keyboard L5126...',
//       image: imagePath.mouse_o,
//       price: 500,
//       cut_price: 600,
//       backgroundColor: '#E9FFF0',
//     },
//     {
//       id: '5',
//       name: 'Product 5',
//       image: imagePath.keyboard,
//       price: 600,
//       cut_price: 700,
//       backgroundColor: '#FCF2FF',
//     },
//   ]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const sliderDataApi = await fetch('https://jobipo.com/api/Agent/index', {
//         method: 'GET',
//       }).then(res => res.json());
//       if (sliderDataApi && sliderDataApi.logout != 1) {
//         const parsedMsg = JSON.parse(sliderDataApi.msg);
//         console.log('parsedMsg----', JSON.stringify(parsedMsg));
//         setUsers(parsedMsg.users || {});
//         setProducts(parsedMsg.NewProduct || []);
//       }
//       setIsLoading(false);
//     } catch (error) {
//       console.log(error);
//       setIsLoading(false);
//     }
//   };

//   const onShare = async () => {
//     navigation.navigate('FromShare');
//     // try {
//     //   await Share.share({
//     //     message: `Join Jobipo Now. Refer Code: ${users['uniqueCode']} https://www.jobipo.com/`,
//     //   });
//     // } catch (error) {
//     //   alert(error.message);
//     // }
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4A90E2" />
//       </View>
//     );
//   }

//   const totalEarning = 100000;
//   const earnedAmount = totalEarning;

//   return (
//     <View style={styles.container}>
//       <TopHeaderAffiliate />
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header Section */}

//         {/* <Animated.View
//           entering={FadeInDown.duration(600)}
//           style={styles.header}> */}
//         {/* <View style={styles.headerLeft}>
//             <View style={styles.avatarContainer}>
//               <Image
//                 source={
//                   users['Pic']
//                     ? {uri: 'data:image/png;base64,' + users['Pic']}
//                     : require('../../assets/logo1.png')
//                 }
//                 style={styles.avatar}
//               />
//             </View>
//             <View>
//               <Text style={styles.userName}>
//                 {users['fullName'] || 'User Name'}
//               </Text>
//               <Text style={styles.referCode}>
//                 Refer Code: {users['uniqueCode'] || 'MOD000000'}
//               </Text>
//             </View>
//           </View> */}
//         {/* <View style={styles.headerRight}>
//             <Pressable
//               onPress={() => navigation.navigate('JobipoSupport')}
//               style={styles.headerIcon}>
//               <Image source={imagePath.music} style={{width: 26, height: 26}} />
//             </Pressable>
//             <Pressable
//               onPress={() => navigation.navigate('Notifications')}
//               style={styles.headerIcon}>
//               <Image
//                 source={imagePath.notifi}
//                 style={{width: 26, height: 26}}
//               />
//             </Pressable>
//           </View> */}
//         {/* </Animated.View> */}

//         {/* Earnings Cards */}
//         <Animated.View
//           entering={FadeInDown.duration(600).delay(100)}
//           style={styles.earningsContainer}>
//           <View style={styles.earningCard}>
//             <Text style={styles.earningAmount}>
//               ₹ {earnedAmount.toLocaleString()}/-
//             </Text>
//             <Text style={styles.earningLabel}>Total Earning</Text>
//           </View>
//           <Pressable onPress={onShare} style={styles.referCard}>
//             <Text style={styles.referTitle}>Refer & Earn</Text>
//             <Text style={styles.referSubtitle}>Click Now</Text>
//           </Pressable>
//         </Animated.View>

//         {/* Search Bar */}
//         <Animated.View
//           entering={FadeInUp.duration(600).delay(200)}
//           style={styles.searchContainer}>
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               gap: 10,
//             }}>
//             <View style={styles.searchBar}>
//               <TextInput
//                 placeholder="Search any item"
//                 placeholderTextColor="#999"
//                 style={styles.searchInput}
//               />
//               <Pressable style={styles.searchIconContainer}>
//                 <Icon name="search-outline" size={22} color="#666" />
//               </Pressable>
//             </View>
//             <Image
//               source={imagePath.filter_i}
//               style={{width: 48, height: 40}}
//             />
//           </View>
//         </Animated.View>

//         {/* Promotional Banner */}
//         <Animated.View
//           entering={ZoomIn.duration(600).delay(300)}
//           style={styles.bannerContainer}>
//           <View style={styles.banner}>
//             <Image
//               source={imagePath.banner}
//               style={styles.bannerImage}
//               resizeMode="cover"
//             />
//             {/* <View style={styles.bannerOverlay}>
//               <Text style={styles.bannerTitle}>Edelweiss Demat Account</Text>
//               <Text style={styles.bannerSubtitle}>Refer and earn</Text>
//               <Text style={styles.bannerAmount}>Rs. 300/-</Text>
//               <Text style={styles.bannerTnc}>
//                 on successful account opening and trading.
//               </Text>
//               <Text style={styles.bannerLegends}>T&C Apply</Text>
//             </View> */}
//           </View>
//         </Animated.View>

//         {/* Top Categories */}
//         <Animated.View entering={FadeInDown.duration(600).delay(400)}>
//           <View style={[styles.sectionHeader, {marginVertical: 20}]}>
//             <Text style={[styles.sectionTitle, {marginHorizontal: 20}]}>
//               Top Categories
//             </Text>
//             <Pressable style={styles.seeAllContainer}>
//               <Text style={styles.seeAll}>See All</Text>
//               <Image
//                 source={imagePath.NextButton}
//                 style={{width: 12, height: 12}}
//               />
//             </Pressable>
//           </View>
//           <FlatList
//             data={[
//               {id: '1', name: 'Insurance', icon: imagePath.Insurance},
//               {id: '2', name: 'Online Courses', icon: imagePath.Online_courses},
//               {
//                 id: '3',
//                 name: 'Tech & Job Training',
//                 icon: imagePath.Tech_job_training,
//               },
//               {
//                 id: '4',
//                 name: 'English & Soft Skills',
//                 icon: imagePath.EnglishSoftSkills,
//               },
//               {
//                 id: '5',
//                 name: 'Resume & Interview Pr',
//                 icon: imagePath.ResumeInterviewPrep,
//               },
//             ]}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.categoriesList}
//             renderItem={({item, index}) => (
//               <Animated.View
//                 entering={SlideInRight.duration(400).delay(500 + index * 100)}
//                 style={styles.categoryCard}>
//                 <View style={styles.categoryIcon}>
//                   <Image
//                     source={item?.icon || imagePath.default_img}
//                     style={{width: 70, height: 70}}
//                   />
//                 </View>
//                 <Text style={styles.categoryName}>{item.name}</Text>
//               </Animated.View>
//             )}
//             keyExtractor={item => item.id}
//           />
//         </Animated.View>

//         <View
//           style={{
//             height: 1,
//             backgroundColor: '#E8E8E8',
//             borderBottomWidth: 1,
//             borderBottomColor: '#D0D0D0',
//             marginHorizontal: 20,
//             borderStyle: 'dashed',
//             marginVertical: 25,
//           }}
//         />
//         {/* Suggested for You */}
//         <Animated.View entering={FadeInUp.duration(600).delay(600)}>
//           <Text
//             style={[
//               styles.sectionTitle,
//               {marginHorizontal: 20, marginBottom: 10},
//             ]}>
//             Suggested for You
//           </Text>
//           <FlatList
//             data={suggestionProducts}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.productsList}
//             renderItem={({item, index}) => (
//               <Animated.View
//                 entering={SlideInRight.duration(400).delay(700 + index * 100)}
//                 style={[
//                   styles.productCard,
//                   {backgroundColor: item.backgroundColor},
//                 ]}>
//                 <Image source={item.image} style={styles.productImage} />
//                 <Text style={styles.productName} numberOfLines={2}>
//                   {item.name}
//                 </Text>
//                 <View style={styles.priceContainer}>
//                   <Text style={styles.currentPrice}>₹{item.price}</Text>
//                   <Text style={styles.originalPrice}>₹{item.cut_price}</Text>
//                 </View>
//               </Animated.View>
//             )}
//             keyExtractor={item => item.productId}
//           />
//         </Animated.View>

//         {/* Book Your Travels */}
//         <Animated.View
//           entering={FadeIn.duration(600).delay(800)}
//           style={styles.travelSection}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Book Your Travels</Text>
//             <Icon name="chevron-forward-outline" size={24} color="#4A90E2" />
//           </View>
//           <FlatList
//             data={[
//               {id: '1', name: 'Bus\nTicket', icon: '🚌'},
//               {id: '2', name: 'Train\nTicket', icon: '🚂'},
//               {id: '3', name: 'Cab\nBooking', icon: '🚕'},
//               {id: '4', name: 'Hotel\nBooking', icon: '🏨'},
//             ]}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.travelCardsContainer}
//             renderItem={({item, index}) => (
//               <Animated.View
//                 entering={SlideInRight.duration(400).delay(900 + index * 100)}
//                 style={styles.travelCard}>
//                 <View style={styles.travelIconContainer}>
//                   <Text style={styles.travelIcon}>{item.icon}</Text>
//                 </View>
//                 <Text style={styles.travelCardText}>{item.name}</Text>
//               </Animated.View>
//             )}
//             keyExtractor={item => item.id}
//           />
//         </Animated.View>

//         {/* Divider */}
//         <View
//           style={{
//             height: 1,
//             backgroundColor: '#E8E8E8',
//             borderBottomWidth: 1,
//             borderBottomColor: '#D0D0D0',
//             marginHorizontal: 20,
//             borderStyle: 'dashed',
//             marginTop: 20,
//             // marginVertical: 25,
//           }}
//         />

//         {/* Top Brands */}
//         <Animated.View
//           entering={FadeInDown.duration(600).delay(900)}
//           style={styles.brandsSection}>
//           <View
//             style={[styles.sectionHeader, {marginVertical: 15, marginTop: 20}]}>
//             <Text style={styles.sectionTitle}>Top Brands</Text>
//             <Icon name="chevron-forward-outline" size={24} color="#585858" />
//           </View>
//           <FlatList
//             data={[
//               {id: '1', name: 'Amazon', color: '#000000', logoColor: '#FF9900'},
//               {
//                 id: '2',
//                 name: 'Flipkart',
//                 color: '#146EB4',
//                 logoColor: '#FFFF00',
//               },
//               {id: '3', name: 'AJIO', color: '#585858'},
//               {id: '4', name: 'Amazon', color: '#000000', logoColor: '#FF9900'},
//             ]}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.brandsList}
//             renderItem={({item, index}) => (
//               <Animated.View
//                 entering={SlideInRight.duration(400).delay(1000 + index * 100)}
//                 style={styles.brandCard}>
//                 <View style={styles.brandLogoContainer}>
//                   <Text style={[styles.brandText, {color: item.color}]}>
//                     {item.name}
//                   </Text>
//                   {item.logoColor && item.name === 'Amazon' && (
//                     <View
//                       style={[
//                         styles.amazonLine,
//                         {backgroundColor: item.logoColor},
//                       ]}
//                     />
//                   )}
//                   {item.logoColor && item.name === 'Flipkart' && (
//                     <View style={styles.flipkartIcon}>
//                       <View
//                         style={[
//                           styles.flipkartBag,
//                           {backgroundColor: item.logoColor},
//                         ]}
//                       />
//                     </View>
//                   )}
//                 </View>
//               </Animated.View>
//             )}
//             keyExtractor={item => item.id}
//           />
//         </Animated.View>

//         {/* Divider */}
//         <View
//           style={{
//             height: 1,
//             backgroundColor: '#E8E8E8',
//             borderBottomWidth: 1,
//             borderBottomColor: '#D0D0D0',
//             marginHorizontal: 20,
//             borderStyle: 'dashed',
//             marginVertical: 10,
//           }}
//         />

//         {/* Top Deals */}
//         <Animated.View
//           entering={FadeInDown.duration(600).delay(1100)}
//           style={styles.dealsSection}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Top Deals</Text>
//           </View>
//           <FlatList
//             data={[
//               {id: '1', image: imagePath.product_1},
//               {id: '2', image: imagePath.product_2},
//             ]}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.dealsContainer}
//             renderItem={({item, index}) => (
//               <Animated.View
//                 entering={SlideInRight.duration(400).delay(1200 + index * 100)}
//                 style={styles.dealCard}>
//                 <TouchableOpacity style={{}}>
//                   <Image
//                     resizeMode="cover"
//                     source={item.image}
//                     style={{width: 200, height: 200, borderRadius: 12}}
//                   />
//                 </TouchableOpacity>
//               </Animated.View>
//             )}
//             keyExtractor={item => item.id}
//           />
//         </Animated.View>

//         {/* Divider */}
//         <View
//           style={{
//             height: 1,
//             backgroundColor: '#E8E8E8',
//             borderBottomWidth: 1,
//             borderBottomColor: '#D0D0D0',
//             marginHorizontal: 20,
//             borderStyle: 'dashed',
//             marginVertical: 10,
//           }}
//         />

//         {/* High Cashback Zone */}
//         <Animated.View
//           entering={FadeIn.duration(600).delay(1300)}
//           style={styles.cashbackSection}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>High Cashback Zone</Text>
//           </View>
//           <FlatList
//             data={[
//               {id: '1', discount: '90', label: 'OFF'},
//               {id: '2', discount: '80', label: 'OFF'},
//               {id: '3', discount: '70', label: 'OFF'},
//               {id: '4', discount: '60', label: 'OFF'},
//               {id: '4', discount: '60', label: 'OFF'},
//               {id: '4', discount: '60', label: 'OFF'},
//             ]}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.cashbackContainer}
//             renderItem={({item, index}) => (
//               <View style={styles.cashbackCircle}>
//                 <Text style={styles.cashbackUpTo}>UP TO</Text>
//                 <Text style={styles.cashbackPercent}>
//                   {item.discount}% {item.label}
//                 </Text>
//                 <Icon
//                   name="percent"
//                   size={16}
//                   color="#585858"
//                   style={styles.cashbackIcon}
//                 />
//               </View>
//             )}
//             keyExtractor={item => item.id}
//           />
//         </Animated.View>

//         {/* Download App Banner */}
//         <Animated.View
//           entering={FadeInUp.duration(600).delay(1400)}
//           style={styles.downloadBanner}>
//           <View style={styles.downloadContent}>
//             <View style={styles.downloadTextContainer}>
//               <Text style={styles.downloadText}>Download the</Text>
//               <Text style={styles.downloadTitle}>Jobipo app now</Text>
//               <Text style={styles.downloadSubtext}>From google play store</Text>
//             </View>
//             <View style={styles.downloadImageContainer}>
//               <View style={styles.downloadPhone}>
//                 <Text style={styles.downloadPhoneText}>JOBIFO</Text>
//                 <Text style={styles.downloadPhoneSubtext}>
//                   Let's get started
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </Animated.View>

//         {/* OTT Subscriptions */}
//         <Animated.View
//           entering={FadeInDown.duration(600).delay(1500)}
//           style={styles.ottSection}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>OTT Subscriptions</Text>
//             <Icon name="chevron-forward-outline" size={24} color="#585858" />
//           </View>
//           <FlatList
//             data={[
//               {
//                 id: '1',
//                 name: 'Netflix',
//                 logoColor: '#E8F4FD',
//                 logoText: 'N',
//                 fullText: 'NETFLIX',
//               },
//               {
//                 id: '2',
//                 name: 'Prime Video',
//                 logoColor: '#E8F4FD',
//                 logoText: 'PV',
//               },
//               {
//                 id: '3',
//                 name: 'Jio Hotstar',
//                 logoColor: '#E8F4FD',
//                 logoText: 'JH',
//               },
//               {
//                 id: '4',
//                 name: 'ZEE5',
//                 logoColor: '#E8F4FD',
//                 logoText: 'Z',
//               },
//             ]}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.ottList}
//             renderItem={({item, index}) => (
//               <Animated.View
//                 entering={SlideInRight.duration(400).delay(1600 + index * 100)}
//                 style={styles.ottCard}>
//                 <View
//                   style={[
//                     styles.ottLogoContainer,
//                     {backgroundColor: item.logoColor},
//                   ]}>
//                   <View
//                     style={{
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       top: 23,
//                     }}>
//                     <Text style={styles.ottLogoBigText}>{item.logoText}</Text>

//                     <Text
//                       style={[
//                         styles.ottName,
//                         {marginHorizontal: 20, textAlign: 'center'},
//                       ]}>
//                       {item.name}
//                     </Text>
//                   </View>
//                 </View>
//               </Animated.View>
//             )}
//             keyExtractor={item => item.id}
//           />
//         </Animated.View>

//         {/* Divider */}
//         <View
//           style={{
//             height: 1,
//             backgroundColor: '#E8E8E8',
//             borderBottomWidth: 1,
//             borderBottomColor: '#D0D0D0',
//             marginHorizontal: 20,
//             borderStyle: 'dashed',
//             marginBottom: 10,
//             // marginVertical: 25,
//           }}
//         />

//         {/* Online Learning Platforms */}
//         <Animated.View
//           entering={FadeInDown.duration(600).delay(1700)}
//           style={styles.learningSection}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>
//               Online Learning Platforms (Courses)
//             </Text>
//             <Icon name="chevron-forward-outline" size={24} color="#585858" />
//           </View>
//           <FlatList
//             data={[
//               {id: '1', name: 'Udemy', color: '#A435F0'},
//               {id: '2', name: 'Unacademy', color: '#146EB4'},
//               {id: '3', name: 'Coursera', color: '#146EB4'},
//               {id: '4', name: 'Skillshare', color: '#000000'},
//               {id: '5', name: 'Simplilearn', color: '#FF6B35'},
//             ]}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.learningList}
//             renderItem={({item, index}) => (
//               <Animated.View
//                 entering={SlideInRight.duration(400).delay(1800 + index * 100)}
//                 style={styles.learningCard}>
//                 <View style={styles.learningLogoContainer}>
//                   <Text style={[styles.learningLogoText, {color: item.color}]}>
//                     {item.name}
//                   </Text>
//                 </View>
//               </Animated.View>
//             )}
//             keyExtractor={item => item.id}
//           />
//         </Animated.View>

//         {/* Shop Cashback Repeat Promotional Section */}
//         <Animated.View
//           entering={FadeInUp.duration(600).delay(1900)}
//           style={styles.shopSection}>
//           <View style={styles.shopContent}>
//             <Text style={styles.shopText}>Shop</Text>
//             <Text style={styles.shopText}>Cashback</Text>
//             <View style={styles.repeatContainer}>
//               <Text style={styles.shopText}>Repeat!</Text>
//               <Icon
//                 name="heart"
//                 size={28}
//                 color="#FF6B35"
//                 style={styles.heartIcon}
//               />
//             </View>
//             <Text style={styles.shopTagline}>Designed for smart shoppers.</Text>
//           </View>
//         </Animated.View>
//       </ScrollView>
//       <Menu />
//     </View>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F8F8',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F8F8F8',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     backgroundColor: '#FFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E8E8E8',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   avatarContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#E8F4FD',
//     marginRight: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   referCode: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   headerRight: {
//     flexDirection: 'row',
//     gap: 15,
//   },
//   headerIcon: {
//     padding: 2,
//   },
//   earningsContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     paddingHorizontal: 20,
//     marginTop: 15,
//   },
//   earningCard: {
//     flex: 1,
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#E8F4FD',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   earningAmount: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#585858',
//   },
//   earningLabel: {
//     fontSize: 10,
//     color: '#585858',
//     marginTop: 4,
//     fontWeight: '400',
//   },
//   referCard: {
//     flex: 1,
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#E8F4FD',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   referTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#585858',
//   },
//   referSubtitle: {
//     fontSize: 10,
//     color: '#585858',
//     marginTop: 4,
//     fontWeight: '400',
//   },
//   searchContainer: {
//     paddingHorizontal: 20,
//     marginTop: 15,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF',
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     height: 40,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//     flex: 1,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     color: '#333',
//   },
//   searchIconContainer: {
//     padding: 5,
//     marginHorizontal: 5,
//   },
//   filterIconContainer: {
//     padding: 5,
//   },
//   bannerContainer: {
//     paddingHorizontal: 20,
//     marginTop: 20,
//   },
//   banner: {
//     height: 180,
//     borderRadius: 15,
//     overflow: 'hidden',
//     backgroundColor: '#4A90E2',
//   },
//   bannerImage: {
//     width: '100%',
//     height: '100%',
//   },
//   bannerOverlay: {
//     position: 'absolute',
//     bottom: 15,
//     left: 15,
//     right: 15,
//   },
//   bannerTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#FFF',
//   },
//   bannerSubtitle: {
//     fontSize: 13,
//     color: '#FFF',
//     marginTop: 4,
//   },
//   bannerAmount: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#FFF',
//     marginTop: 5,
//   },
//   bannerTnc: {
//     fontSize: 11,
//     color: '#FFF',
//     marginTop: 4,
//   },
//   bannerLegends: {
//     fontSize: 10,
//     color: '#FFF',
//     transform: [{rotate: '-90deg'}],
//     position: 'absolute',
//     right: -20,
//     top: 30,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     marginVertical: 15,
//   },
//   sectionTitle: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#585858',
//   },
//   seeAllContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     marginRight: 20,
//   },
//   seeAll: {
//     fontSize: 14,
//     color: '#585858',
//     fontWeight: '600',
//   },
//   categoriesList: {
//     paddingHorizontal: 15,
//   },
//   categoryCard: {
//     alignItems: 'center',
//     marginHorizontal: 10,
//     width: 90,
//   },
//   categoryIcon: {
//     marginBottom: 8,
//   },
//   categoryEmoji: {
//     fontSize: 32,
//   },
//   categoryName: {
//     fontSize: 11,
//     color: '#585858',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   productsList: {
//     paddingHorizontal: 15,
//   },
//   productCard: {
//     width: 150,
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     marginHorizontal: 8,
//     padding: 10,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//     marginBottom: 10,
//   },
//   productImage: {
//     width: '100%',
//     height: 120,
//     borderRadius: 8,
//     backgroundColor: '#F0F0F0',
//   },
//   productName: {
//     fontSize: 8,
//     color: '#585858',
//     marginTop: 8,
//     fontWeight: '400',
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginTop: 5,
//   },
//   currentPrice: {
//     fontSize: 11,
//     fontWeight: '500',
//     color: '#585858',
//   },
//   originalPrice: {
//     fontWeight: '500',
//     fontSize: 8,
//     color: '#D0D0D0',
//     textDecorationLine: 'line-through',
//   },
//   travelSection: {
//     // paddingHorizontal: 20,
//   },
//   travelCardsContainer: {
//     paddingHorizontal: 20,
//     marginBottom: 10,
//   },
//   travelCard: {
//     width: 100,
//     backgroundColor: '#E8F4FD',
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 15,
//     height: 140,
//     marginRight: 10,
//     // shadowColor: '#000',
//     // shadowOffset: {width: 0, height: 2},
//     // shadowOpacity: 0.1,
//     // shadowRadius: 4,
//     // elevation: 3,
//   },
//   travelIconContainer: {
//     width: 70,
//     height: 70,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   travelIcon: {
//     fontSize: 50,
//   },
//   travelCardText: {
//     fontSize: 11,
//     fontWeight: '400',
//     color: '#333',
//     textAlign: 'center',
//   },
//   brandsSection: {
//     // paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   brandsList: {
//     paddingHorizontal: 20,
//   },
//   brandCard: {
//     width: 100,
//     height: 100,
//     backgroundColor: '#F0F0F0',
//     borderRadius: 12,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E8E8E8',
//   },
//   brandLogoContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   brandText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   amazonLine: {
//     width: 60,
//     height: 2,
//     marginTop: 2,
//     borderRadius: 1,
//   },
//   flipkartIcon: {
//     marginTop: 4,
//   },
//   flipkartBag: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//   },
//   dealsSection: {
//     marginBottom: 20,
//   },
//   dealsContainer: {
//     paddingHorizontal: 20,
//     marginTop: 10,
//   },
//   dealCard: {
//     marginRight: 10,
//   },
//   dealImageContainer: {
//     height: 150,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dealPlaceholder: {
//     fontSize: 12,
//     color: '#999',
//   },
//   dealBanner: {
//     backgroundColor: '#FF6B35',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 12,
//     borderBottomLeftRadius: 12,
//     borderBottomRightRadius: 12,
//   },
//   dealBrandLogo: {
//     backgroundColor: '#FFF',
//     borderRadius: 6,
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     alignItems: 'center',
//   },
//   dealBrandText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   amazonBannerLine: {
//     width: 40,
//     height: 2,
//     marginTop: 2,
//     borderRadius: 1,
//   },
//   flipkartBannerIcon: {
//     marginTop: 4,
//   },
//   flipkartBannerBag: {
//     width: 16,
//     height: 16,
//     borderRadius: 3,
//   },
//   dealDiscount: {
//     alignItems: 'flex-end',
//   },
//   dealDiscountText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFF',
//   },
//   dealCategory: {
//     fontSize: 8,
//     color: '#FFF',
//     marginTop: 2,
//   },
//   cashbackSection: {
//     marginBottom: 20,
//   },
//   cashbackContainer: {
//     paddingHorizontal: 20,
//     marginTop: 10,
//   },
//   cashbackCircle: {
//     width: 85,
//     height: 85,
//     borderRadius: 85 / 2,
//     backgroundColor: '#E8F4FD',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E8E8E8',
//     marginRight: 10,
//   },
//   cashbackUpTo: {
//     fontSize: 9,
//     color: '#585858',
//     marginBottom: 4,
//   },
//   cashbackPercent: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#585858',
//     marginBottom: 4,
//   },
//   cashbackIcon: {
//     marginTop: 4,
//   },
//   downloadBanner: {
//     backgroundColor: '#4EAED8',
//     borderRadius: 15,
//     marginHorizontal: 20,
//     padding: 10,
//     overflow: 'hidden',
//     paddingLeft: 20,
//     marginTop: 20,
//   },
//   downloadContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   downloadTextContainer: {
//     flex: 1,
//   },
//   downloadText: {
//     fontSize: 14,
//     color: '#FFF',
//     marginBottom: 4,
//   },
//   downloadTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFF',
//     marginBottom: 4,
//   },
//   downloadSubtext: {
//     fontSize: 12,
//     color: '#FFF',
//   },
//   downloadImageContainer: {
//     width: 80,
//     height: 100,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   downloadPhone: {
//     width: 60,
//     height: 80,
//     backgroundColor: '#FFF',
//     borderRadius: 8,
//     padding: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   downloadPhoneText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   downloadPhoneSubtext: {
//     fontSize: 8,
//     color: '#666',
//     textAlign: 'center',
//   },
//   ottSection: {
//     marginBottom: 20,
//     marginTop: 20,
//   },
//   ottList: {
//     paddingHorizontal: 20,
//   },
//   ottCard: {
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   ottLogoContainer: {
//     width: 100,
//     height: 130,
//     borderRadius: 12,
//     // justifyContent: 'center',
//     // alignItems: 'center',
//     marginBottom: 10,
//     // shadowColor: '#000',
//     // shadowOffset: {width: 0, height: 2},
//     // shadowOpacity: 0.1,
//     // shadowRadius: 4,
//     // elevation: 2,
//   },
//   ottLogoBigText: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: 'red',
//     marginBottom: 4,
//   },
//   ottLogoSmallText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#FFF',
//   },
//   ottLogoText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFF',
//   },
//   ottName: {
//     fontSize: 12,
//     color: '#585858',
//     textAlign: 'center',
//     fontWeight: '400',
//   },
//   learningSection: {
//     marginBottom: 20,
//   },
//   learningList: {
//     paddingHorizontal: 20,
//   },
//   learningCard: {
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   learningLogoContainer: {},
//   learningLogoText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     textTransform: 'uppercase',
//   },
//   shopSection: {
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     marginBottom: 60,
//   },
//   shopContent: {marginBottom: 20},
//   shopText: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     color: '#D0D0D0',
//     // textAlign: 'center',
//   },
//   repeatContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   heartIcon: {
//     marginLeft: 10,
//   },
//   shopTagline: {
//     fontSize: 14,
//     color: '#D0D0D0',
//     marginTop: 15,
//     fontWeight: '400',
//   },
// });

/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  Pressable,
  Share,
  Linking,
  Alert,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
//import React from 'react';
import Header from '../components/Header';
import ImageSlider from 'react-native-image-slider';

import Menu from '../components/Menu';
import Logo from '../components/Auth/Logo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Feather from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';

import {withOrientation} from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SliderBox} from 'react-native-image-slider-box';
import {AuthContext} from '../context/context';
import {useColorScheme} from 'react-native';
import TopHeaderAffiliate from '../components/TopHeaderAffiliate';
import imagePath from '../theme/imagePath';

let userToken;
userToken = null;
const Home = ({navigation}) => {
  const {signOut} = React.useContext(AuthContext);
  const [NewProduct, setNewProduct] = useState([]);
  const [eComProduct, seteComProduct] = useState([]);
  const [TopProductData, setTopProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [uData, setUData] = useState([]);
  const [users, setUsers] = useState('');
  const [leader, setLeader] = useState([]);
  const [slider, setSlider] = useState([
    'https://jobipo.com/uploads/users/JobipoImage.png',
  ]);
  const [isLoading, setisLoading] = useState(true);
  const [earning, setEarning] = useState([]);
  const [totalEarning, setTotalEarning] = useState([]);
  const [bonus, setBonus] = useState([]);
  const [paidEarning, setpaidEarning] = useState([]);
  const [LeadStatus, setLeadStatus] = useState('');
  const [ProductName, setProductName] = useState('');
  const [photo, setPhoto] = useState('');

  const colorScheme = useColorScheme();
  const statusBarColor = colorScheme === 'dark' ? '#FF8D53' : '#FF8D53';

  // useEffect(() => {
  //   setTimeout(async () => {
  //     try {
  //       userToken = await AsyncStorage.getItem('userToken');
  //     } catch (e) {
  //       console.log(e);
  //     }
  //     console.log(userToken);
  //     if (userToken == null) {
  //       navigation.navigate('Login');
  //     }
  //     //dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
  //   }, 1);
  // }, []);

  useFocusEffect(
    useCallback(() => {
      methodProfile();
      const GetDataFunc = async () => {
        try {
          setisLoading(true);

          const response = await fetch('https://jobipo.com/api/Agent/index', {
            method: 'GET',
            timeout: 30000, // 30 second timeout
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const responseText = await response.text();
          let sliderDataApi;

          try {
            sliderDataApi = JSON.parse(responseText);
          } catch (parseError) {
            // console.error('JSON parse error:', parseError);
            throw new Error('Invalid response format');
          }
          // console.log('sliderDataApi', sliderDataApi);
          if (sliderDataApi && sliderDataApi.status === 1) {
            try {
              // Safe JSON parsing with error handling
              const msgData =
                typeof sliderDataApi.msg === 'string'
                  ? JSON.parse(sliderDataApi.msg)
                  : sliderDataApi.msg;
              if (!msgData) {
                throw new Error('No data received');
              }

              // Set data with null checks and memory limits
              setNewProduct(
                Array.isArray(msgData.NewProduct)
                  ? msgData.NewProduct.slice(0, 20)
                  : [],
              );
              seteComProduct(
                Array.isArray(msgData.eComProduct)
                  ? msgData.eComProduct.slice(0, 20)
                  : [],
              );
              setTopProductData(
                Array.isArray(msgData.TopProduct)
                  ? msgData.TopProduct.slice(0, 20)
                  : [],
              );
              setCategoryData(
                Array.isArray(msgData.category)
                  ? msgData.category.slice(0, 10)
                  : [],
              );
              setUData(msgData.UData || {});
              setUsers(msgData?.users);
              // setUsers(
              //   Array.isArray(msgData.users) ? msgData.users.slice(0, 50) : [],
              // );
              setLeader(
                Array.isArray(msgData.leader)
                  ? msgData.leader.slice(0, 20)
                  : [],
              );
              setSlider(
                Array.isArray(msgData.slider)
                  ? msgData.slider.slice(0, 10)
                  : [],
              );

              setisLoading(false);
            } catch (dataError) {
              // console.error('Data processing error:', dataError);
              Alert.alert(
                'Data Error',
                'Failed to process server data. Please try again.',
              );
              setisLoading(false);
            }
          } else if (sliderDataApi && sliderDataApi.logout === 1) {
            signOut();
          } else {
            Alert.alert(
              'Connection Issue',
              'Please check your internet connection.',
            );
            setisLoading(false);
          }
        } catch (error) {
          // console.error('API Error:', error);
          Alert.alert(
            'Error',
            error.message || 'Something went wrong. Please try again.',
          );
          setisLoading(false);
        }
      };

      let mount = true;
      if (mount) {
        GetDataFunc();
      }

      return () => {
        mount = false;
      };
    }, [signOut]),
  );

  useFocusEffect(
    useCallback(() => {
      const GetDataFuncc = async () => {
        const formdata = {ProductName, LeadStatus};
        // console.log(ProductName, LeadStatus);
        setisLoading(true);
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
        if (sliderDataApi && sliderDataApi.logout !== 1) {
          setEarning(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).earning,
          );
          setBonus(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).bonus,
          );

          setTotalEarning(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg)
              .totalEarning,
          );

          setpaidEarning(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg)
              .paidEarning,
          );
          // console.log('sliderDataApi  dd');
          // console.log(JSON.parse(JSON.stringify(sliderDataApi)).msg);
        } else {
          // navigation.navigate('Login');
        }
      };

      GetDataFuncc();
    }, [ProductName, LeadStatus]),
  );
  const methodProfile = async () => {
    try {
      const userID = await AsyncStorage.getItem('UserID');

      const response = await fetch(
        `https://jobipo.com/api/v3/view-profile?UserID=${userID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          },
        },
      );

      const data = await response.json();
      console.log('data-d-----1----rr-', data);

      setPhoto(data.data.photo || null);
    } catch (error) {
      // console.error('❌ Error fetching profile:', error);
    }
  };
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Join Jobipo Now.Click On Link.  Refer Code: ' +
          uData?.referCode +
          ' https://play.google.com/store/apps/details?id=com.jobipoapp',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <>
      {/* <StatusBar backgroundColor={statusBarColor} barStyle="light-content" /> */}
      <View
        style={[
          isLoading
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
        <ActivityIndicator size="large" />
      </View>

      <TopHeaderAffiliate />
      {/* <Header /> */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 80,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
          <Pressable
            onPress={() => navigation.navigate('Wallet')}
            style={{
              flex: 1,
              height: 62,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#D0D0D0',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: '#585858',
                fontWeight: '500',
                textAlign: 'center',
              }}>
              ₹ {totalEarning ? totalEarning : 0}
            </Text>
            <Text style={{fontSize: 10, color: '#585858', fontWeight: '400'}}>
              Total Earning
            </Text>
          </Pressable>
          <View style={{width: 10}} />
          <Pressable
            onPress={() => onShare()}
            style={{
              flex: 1,
              height: 62,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#D0D0D0',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: '#585858',
                fontWeight: '500',
                textAlign: 'center',
              }}>
              Refer & Earn
            </Text>
            <Text style={{fontSize: 10, color: '#585858', fontWeight: '400'}}>
              Click Now
            </Text>
          </Pressable>
        </View>
        {/* <View style={styles.profile}>
          <View style={styles.profContainer}>
            <Image
              source={photo ? {uri: photo} : imagePath.default_img}
              style={styles.profimage}
              resizeMode="cover"
            />
          </View>
          <View>
            <Text style={styles.h1}>Hi {users?.fullName}</Text>
            <Text style={styles.h2}>Your Refer Code: {uData?.referCode}</Text>
          </View>
        </View> */}

        {/* <View style={styles.cardContainer}> */}
        {/* <Pressable
            onPress={() => navigation.navigate('Contactus')}
            style={styles.card}>
            <View style={styles.cardIcon}>
              <Image
                source={require('../../assets/B&RIcons/help&support.png')}
                style={styles.imagecard}
              />
            </View>
            <Text style={styles.cardText}>Help and Supports</Text>
          </Pressable> */}

        {/* <Pressable
            onPress={() => navigation.navigate('Wallet')}
            style={styles.card}>
            <View style={styles.cardIcon}>
              <Image
                source={require('../../assets/B&RIcons/wallet.png')}
                style={styles.imagecard}
              />
            </View>
            <Text style={styles.cardTextt}>
              ₹ {totalEarning ? totalEarning : 0}
            </Text>
            <Text style={styles.cardTextsmall}>Total Earning</Text>
          </Pressable> */}

        {/* <Pressable onPress={() => onShare()} style={styles.card}>
            <View style={styles.cardIcon}>
              <Image
                source={require('../../assets/B&RIcons/Refer&earn.png')}
                style={styles.imagecard}
              />
            </View>
            <Text style={styles.cardText}>Refer and Earn </Text>
          </Pressable>
        </View> */}

        {/* <View style={styles.annContainer}>
          <View style={styles.annSlider}>
            <ImageSlider images={slider}
            style = {{width: '100%', height:100}}
          />
          </View>
        </View>  */}

        <View style={styles.annContainer}>
          <View style={styles.annSlider}>
            <Image
              source={{uri: 'https://jobipo.com/uploads/users/JobipoImage.png'}}
              style={{
                width: '100%',
                height: 150,
                resizeMode: 'cover',
                borderRadius: 10,
              }}
            />
          </View>
        </View>

        <Text style={styles.annText}>Sales and Earn</Text>
        <FlatList
          data={categoryData}
          style={[styles.productContainer]}
          keyExtractor={item => item.categoryID}
          renderItem={({item}) => {
            return (
              <>
                {item.title != '' ? (
                  <Pressable
                    onPress={() => {
                      navigation.navigate('Accounts', {
                        title: item.title,
                        categoryID: item.categoryID,
                      });
                    }}
                    style={[styles.product]}>
                    <Image
                      source={{uri: item.image}}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.productNo}>
                      Product: {item.ProductCount}
                    </Text>
                    <View style={styles.productDescBox}>
                      <Text style={styles.productDesc}>{item.description}</Text>
                    </View>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      navigation.navigate('Products');
                    }}
                    style={[styles.product, styles.SeeMore]}>
                    <Text style={[styles.title, styles.seeMoreTitle]}>See</Text>
                    <Text style={[styles.title, styles.seeMoreTitle]}>
                      More
                    </Text>
                  </Pressable>
                )}
              </>
            );
          }}
          horizontal={false}
          numColumns={3}
        />

        {/* <Text style={styles.annText}>Recharge and Pay Bills</Text> */}
        {/* <Pressable
          style={{
            backgroundColor: '#fff',
            padding: 15,
            flexDirection: 'row',
            gap: 20,
            alignItems: 'center',
            marginTop: 10,
            justifyContent: 'space-between',
          }}
          onPress={() => navigation.navigate('RechargeNo')}>
          <View
            style={{
              flexDirection: 'row',
              gap: 20,
              alignItems: 'center',
            }}>
            <View style={styles.cardIconM}>
              <Image
                source={require('../../assets/B&RIcons/Mobile.png')}
                style={styles.imagecard}
              />
            </View>

            <Text
              style={{
                fontSize: 15,
                color: '#333',
              }}>
              Recharge your mobile now
            </Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={20}
            color="#0d4574"
          />
        </Pressable> */}

        <View
          style={[
            styles.cardContainer1,
            {
              display: 'none',
            },
          ]}>
          <Pressable
            onPress={() => navigation.navigate('RechargeNo')}
            style={styles.card1}>
            <View style={styles.cardIconM}>
              <Image
                source={require('../../assets/B&RIcons/Mobile.png')}
                style={styles.imagecard}
              />
            </View>
            <Text style={styles.cardTextt1}>Mobile</Text>
            <Text style={styles.cardTextsmall1}>Recharge</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('DTHBillerList')}
            style={styles.card1}>
            <View style={styles.cardIcon1}>
              <Image
                source={require('../../assets/B&RIcons/DTH.png')}
                style={styles.imagecard}
              />
            </View>
            <Text style={styles.cardTextt1}>DTH</Text>
            <Text style={styles.cardTextsmall1}>Recharge </Text>
          </Pressable>

          <Pressable
            // onPress={() => navigation.navigate('ElectricityBillerList')}
            style={styles.card1}>
            <View style={styles.cardIcon1}>
              <Image
                source={require('../../assets/B&RIcons/LOAN-REPAYMENT.png')}
                style={styles.imagecard}
              />
            </View>
            <Text style={styles.cardTextt1}>Loan</Text>
            <Text style={styles.cardTextsmall1}>Repayment</Text>
          </Pressable>
          {/* <Pressable
            onPress={() => navigation.navigate('MoreRecharge')}
            style={styles.cardMore}>
            <Text style={styles.cardTextMore}>More</Text>
          </Pressable> */}
        </View>

        <Text style={styles.annText}>New Products</Text>
        <FlatList
          data={NewProduct}
          style={[styles.pproductContainer]}
          keyExtractor={item => item.productId}
          renderItem={({item}) => {
            return (
              <Pressable
                onPress={() => {
                  navigation.navigate('Product', {
                    title: item.title,
                    productId: item.productId,
                  });
                }}
                style={[styles.pproduct]}>
                <Image
                  source={{uri: item.image}}
                  style={styles.pimage}
                  resizeMode="contain"
                />
              </Pressable>
            );
          }}
          horizontal={true}
          // numColumns={3}
        />
        <Text style={styles.annText}>Online shopping</Text>
        <FlatList
          data={eComProduct}
          style={[styles.pproductContainer]}
          keyExtractor={item => item.productId}
          renderItem={({item}) => {
            return (
              <Pressable
                onPress={() => {
                  navigation.navigate('Product', {
                    title: item.title,
                    productId: item.productId,
                  });
                }}
                style={[styles.ecomproduct]}>
                <Image
                  source={{uri: item.image}}
                  style={styles.pimage}
                  resizeMode="contain"
                />
              </Pressable>
            );
          }}
          horizontal={true}
          // numColumns={3}
        />

        {/* <Text style={styles.annText}>Online shopping</Text>

        <View style={styles.cardContainer1}>

          <Pressable
             onPress={() => navigation.navigate('Wallet')}
            style={styles.cardConImage}>
            <View style={styles.cardIcon1}>
              <Image
                source={{ uri: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Emblem.png' }}
                style={styles.cardImage1} />
            </View>

          </Pressable>
          <Pressable
              onPress={() => navigation.navigate('Contactus')}
            style={styles.cardConImage}>
            <View style={styles.cardIcon1}>
              <Image
                source={{ uri: 'https://m.media-amazon.com/images/G/31/gc/designs/livepreview/a_for_amazon_default_child_noto_email_in-main._CB485944111_.png' }}
                style={styles.cardImage1} />
            </View>

          </Pressable>

          <Pressable
             onPress={() => navigation.navigate('Myearning')}
            style={styles.cardConImage}>
            <View style={styles.cardIcon1}>
              <Image
                source={{ uri: 'https://brandlogos.net/wp-content/uploads/2022/03/myntra-logo-brandlogos.net_.png' }}
                style={styles.cardImage1} />
            </View>

          </Pressable>
          <Pressable
             onPress={() => navigation.navigate('Myearning')}
            style={styles.cardMore2}>
            { <View style={styles.cardIcon1}>
             <FontAwesome name="users" size={25} color="#fff" />
             </View> }
            <Text style={styles.cardTextMore}>More</Text>
            {<Text style={styles.cardTextsmall1}>Total </Text> }
          </Pressable>
        </View> */}
        {leader.length > 0 ? (
          <>
            <Text style={styles.annText}>Success Story</Text>
            <FlatList
              data={leader}
              style={[styles.leadercontainer]}
              keyExtractor={item => item.leaderId}
              renderItem={({item}) => {
                return (
                  <View style={[styles.leaderdetails]}>
                    {item.image !== '' ? (
                      <View style={[styles.leaderimageCon]}>
                        <Image
                          source={{uri: item.image}}
                          style={styles.leaderimage}
                          resizeMode="contain"
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          marginHorizontal: 20,
                          marginRight: 5,
                        }}>
                        <FontAwesome name="user" size={60} color="#0d4574" />
                      </View>
                    )}
                    {/* <Image
        source={require('../../assets/Image/image2.png')}
        style={styles.leaderimage}
        resizeMode="contain"
      /> */}
                    <View
                      style={{
                        flex: 5,
                        textAlign: 'center',
                        alignContent: 'center',
                        marginLeft: 26,
                        color: '#333',
                      }}>
                      <Text
                        style={{fontSize: 17, marginBottom: 5, color: '#333'}}>
                        {item.name}
                      </Text>
                      <Text style={{fontSize: 12}}>{item.message}</Text>
                    </View>
                  </View>
                );
              }}
              horizontal={true}
              // numColumns={3}
            />
          </>
        ) : (
          <></>
        )}

        <View style={styles.FooterContent}>
          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              color: '#333',
            }}>
            Follow us on social media plateforms.
          </Text>
          <View style={styles.SocialList}>
            <Pressable
              onPress={() => {
                Linking.openURL(
                  `https://www.facebook.com/share/198hRxVnFA/?mibextid=wwXIfr`,
                );
              }}
              style={styles.SocialImage}>
              <FontAwesome name="facebook-f" size={15} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => {
                Linking.openURL(
                  `https://www.instagram.com/jobipo_official?igsh=b2JscG00Y3kweGYw&utm_source=qr`,
                );
              }}
              style={styles.SocialImage}>
              <FontAwesome name="instagram" size={15} color="#fff" />
            </Pressable>
            {/* <Pressable
              onPress={() => {
                Linking.openURL(`https://www.jobipo.com/`)
              }}
              style={styles.SocialImage}
            >
              <FontAwesome name="twitter" size={15} color="#fff" />
            </Pressable> */}
            <Pressable
              onPress={() => {
                Linking.openURL(`https://www.youtube.com/@Jobipo`);
              }}
              style={styles.SocialImage}>
              <FontAwesome name="youtube-play" size={15} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => {
                Linking.openURL(`https://www.linkedin.com/company/jobipo/`);
              }}
              style={styles.SocialImage}>
              <FontAwesome name="linkedin" size={15} color="#fff" />
            </Pressable>
          </View>
          {/* <Pressable
            onPress={() => {
              Linking.openURL(`https://www.jobipo.com/`)
            }}
            style={styles.TeligramLink}
          >
            <FontAwesome name="telegram" size={20} color="#fff" style={{ marginHorizontal: 10, }} />
            <Text style={{ color: '#fff', textAlign: 'center', }}> Live update on Telegram</Text>
          </Pressable> */}
        </View>

        {/*  <View style={styles.annContainer}>
          <Text style={styles.annText}>Trainings</Text>
          <View style={styles.trainingSlider}>
            <View style={styles.trainingImage}>
              <Image source={require('../../assets/Image/training1.png')} />
            </View>
            <View style={styles.trainingBox}>
              <Text style={styles.trainingText}>
                Jobipo Introduction
              </Text>
              <View style={styles.trainingDateContainer}>
                <Text style={styles.trainingDate}>June 05, 2022</Text>
                <View style={styles.trainingDateLine}></View>
                <Text style={styles.trainingDate}>11:30AM- 12:30PM</Text>
              </View>
              <View style={styles.join}>
                <Text style={styles.joinText}>Join Now</Text>
              </View>
            </View>
          </View>
        </View> */}
      </ScrollView>
      <Menu />
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    backgroundColor: '#F8F8F8',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profContainer: {
    width: 82,
    height: 82,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 17,
  },
  h1: {
    fontSize: 20,
    // color: '#595959',
    color: '#333',
  },
  h2: {
    fontSize: 12,
    color: '#595959',
  },
  annContainer: {
    marginTop: 15,
  },
  annText: {
    // backgroundColor:'#FFC895',
    fontSize: 20,
    color: '#333',
    // alignItems: 'center',
    // justifyContent: 'center',
    // textAlign:'center',
    fontWeight: '500',
    marginTop: 10,
    padding: 5,
  },
  annSlider: {
    marginTop: 12,
  },
  boxContainer: {
    marginTop: 3,
  },
  flexBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  box: {
    backgroundColor: '#0d4574',
    borderRadius: 7,
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: '48%',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencyIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyText: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  currencyType: {
    fontSize: 12,
    lineHeight: 23,
    color: '#fff',
  },
  currencyAmount: {
    fontSize: 16,
    lineHeight: 30,
    color: '#fff',
  },
  textone: {
    color: '#fff',
    fontSize: 10,
    lineHeight: 23,
  },
  infoIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  infoImage: {
    width: 13,
    height: 13,
  },
  cardContainer: {
    flexDirection: 'row',
    marginTop: 21,
    justifyContent: 'space-between',
  },
  card: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d4574',
    borderRadius: 6,
    height: 78,
    width: '32%',
    borderColor: '#0d4574',
    borderWidth: 1,
    padding: 10,
  },
  cardIcon: {
    marginTop: 10,
    // marginBottom:5,
  },
  cardText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardTextt: {
    color: '#fff',
    fontSize: 12,
  },
  cardTextsmall: {
    fontSize: 10,
    color: '#fff',
  },
  cardImage: {
    backgroundColor: '#D0BAEA',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    position: 'absolute',
    right: -15,
  },
  cardImage2: {
    backgroundColor: '#D0BAEA',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    position: 'absolute',
    left: -15,
  },
  trainingSlider: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  trainingImage: {
    backgroundColor: '#F8F3FD',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 9,
    marginRight: 20,
  },
  trainingBox: {
    borderLeftWidth: 1.5,
    borderColor: '#D0BAEA',
    height: 96,
    paddingLeft: 20,
    paddingTop: 10,
  },
  trainingText: {
    color: '#595959',
    fontSize: 15,
  },
  trainingDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  trainingDate: {
    color: '#595959',
    fontSize: 12,
  },
  trainingDateLine: {
    height: '70%',
    width: 1,
    backgroundColor: '#595959',
    marginHorizontal: 5,
  },
  join: {
    backgroundColor: '#EF8C8C',
    borderRadius: 8.5,
    width: 69,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    marginTop: 13,
  },
  joinText: {
    fontSize: 12,
  },
  productContainer: {
    marginVertical: 10,
    marginBottom: 10,
    width: '100%',
    paddingRight: 0,
    marginLeft: 0,
  },
  pproductContainer: {
    marginVertical: 10,
    marginBottom: 5,
    width: '100%',
    paddingRight: 0,
    marginLeft: 0,
    backgroundColor: '#ffff',
  },
  leadercontainer: {
    marginVertical: 10,
    marginBottom: 15,
    width: '100%',
    paddingRight: 0,
    marginLeft: 0,
  },
  FooterContent: {
    marginTop: 40,
    marginBottom: 10,
  },
  SocialList: {
    flexDirection: 'row',
    width: '50%',
    marginLeft: '22.5%',
    marginVertical: 13,
  },
  SocialImage: {
    flex: 1,
    backgroundColor: '#535353',
    marginLeft: 10,
    borderRadius: 20,
    padding: 8,
    textAlign: 'center',
    justifyContent: 'center',
  },
  TeligramLink: {
    flexDirection: 'row',
    backgroundColor: '#0d4574',
    marginTop: 5,
    width: '80%',
    marginLeft: '10%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  SeeMore: {
    borderRadius: 90,
    textAlignVertical: 'center',
    justifyContent: 'center',
  },
  product: {
    backgroundColor: '#fff',
    width: '31%',
    margin: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 1,
    borderRadius: 7,
  },
  pproduct: {
    backgroundColor: '#edfaff',
    width: 68,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 50,
  },
  leaderdetails: {
    backgroundColor: '#fff',
    width: 300,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    flexDirection: 'row',
  },
  image: {
    width: 40,
    height: 40,
  },
  pimage: {
    width: 50,
    height: 50,
  },
  leaderimageCon: {
    width: 50,
    maxWidth: 50,
    height: 50,
    flex: 2,
  },
  leaderimage: {
    width: 50,
    maxWidth: 50,
    height: 50,
    flex: 2,
    borderRadius: 50,
    borderColor: '#0d4574',
    borderWidth: 1,
    marginLeft: 10,
  },
  profimage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor: '#0d4574',
    borderWidth: 1,
  },
  title: {
    color: '#595959',
    paddingTop: 2,
    fontSize: 10,
  },
  seeMoreTitle: {
    fontSize: 17,
    paddingTop: 0,
  },
  productNo: {
    color: '#595959',
    marginVertical: 0,
    fontSize: 12,
  },
  productDescBox: {
    backgroundColor: '#F8F3FD',
    width: '100%',
    paddingVertical: 2,
    borderRadius: 5,
  },
  productDesc: {
    textAlign: 'center',
    color: '#595959',
    backgroundColor: '#F8F8F8',
    fontSize: 8,
  },
  content: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 5,
  },
  sectionContainer: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    // justifyContent: 'space-around',
  },
  box1: {
    width: '20%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
    padding: 20,
  },
  boxText: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
  },

  cardContainer1: {
    flexDirection: 'row',
    marginTop: 21,
    justifyContent: 'space-between',
    backgroundColor: '#ffff',
    padding: 20,
  },
  card1: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    height: 76,
    width: '24%',
    borderColor: '#ffff',
    // borderWidth:1,
    // elevation: 3,
  },
  cardMore: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC895',
    borderRadius: 16,
    height: 76,
    width: '24%',
    borderColor: '#FFC895',
    borderWidth: 1,
    // elevation: 3,
  },
  cardIcon1: {
    marginTop: 10,
    marginBottom: 5,
  },
  imagecard: {
    width: 30,
    height: 30,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  cardIconM: {
    marginTop: 10,
    // marginBottom:5,
  },
  cardText1: {
    color: '#333',
    fontSize: 12,
    marginBottom: 10,
  },
  cardTextMore: {
    color: '#ffff',
    fontSize: 12,
    marginBottom: 10,
  },
  cardTextt1: {
    color: '#333',
    fontSize: 12,
  },
  cardTextsmall1: {
    fontSize: 10,
    color: '#333',
  },
  ecomproduct: {
    backgroundColor: '#edfaff',
    width: 68,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    borderColor: '#0d4574',
    borderWidth: 1,
  },
  cardConImage: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 60,
    width: '20%',
    borderColor: '#0d4574',
    borderWidth: 1,
    // elevation: 3,
  },
  cardMore2: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC895',
    borderRadius: 16,
    height: 60,
    width: '20%',
    borderColor: '#FFC895',
    borderWidth: 1,
  },
  cardImage1: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
});
