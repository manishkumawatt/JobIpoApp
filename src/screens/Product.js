/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  Pressable,
  ScrollView,
  Share,
  ActivityIndicator,
  Linking,
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
import RenderHtml from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import Logo from '../components/Auth/Logo';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/context';
const Product = ({navigation, route}) => {
  const {params} = route;
  const {signOut} = useContext(AuthContext);
  const [brandsData, setBrandsData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [ActiveDiv, setActiveDiv] = useState(1);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const GetDataFunc = async () => {
        setisLoading(true);
        var formdata = {productId: params.productId};

        const sliderDataApi = await fetch(
          'https://jobipo.com/api/Agent/brand',
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
          setBrandsData(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).brand,
          );

          // // console.log('product brandsData', brandsData);
        } else {
          signOut();
          //navigation.navigate('Login');
        }
      };

      if (isActive) {
        GetDataFunc();
      }

      return () => {
        isActive = false;
      };
    }, [params.productId]),
  );

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: brandsData['shareLink'],
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const products = [
    {
      id: 0,
      img: require('../../assets/Image/brands/axisIcon.png'),
      title: 'AXIS ASAP DIGITAL Saving Acccount',
      content: 'Refer and Earn Rs. 350/- Each Successful Account Opened',
      desc: 'Earn Up to Rs. 1450/-',
    },
    {
      id: 1,
      img: require('../../assets/Image/brands/kotakIcon.png'),
      title: 'KOTAK 811 Saving Account (ONLINE CONVERSION )',
      content:
        'Refer and Earn Rs. 250/- Each Successful Kotak 811 Saving Account Opened',
      desc: 'Earn Up to Rs. 1450/-',
    },
    {
      id: 2,
      img: require('../../assets/Image/brands/niyoxIcon.png'),
      title: 'NIYOX Saving Account (ONLINE CONVERSION )',
      content: 'Refer and Earn Rs. 350/- Each Successful Account Opening',
      desc: 'Earn Up to Rs. 1450/-',
    },
    {
      id: 3,
      img: require('../../assets/Image/brands/indusindIcon.png'),
      title: 'IndusInd Saving Account',
      content: 'Refer and Earn Rs. 170/- Each Successful Account Opened',
      desc: 'Earn Up to Rs. 1450/-',
    },
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
      <Header title={params.title} />
      <ScrollView>
        <View style={styles.container}>
          <View style={[styles.product]}>
            <View style={styles.productImgBox}>
              <Image
                source={{uri: brandsData['image']}}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <View style={styles.productDescBox}>
              <Text style={styles.title}>{brandsData['title']}</Text>
              <Text style={styles.productNo}>{brandsData['title']}</Text>
            </View>
            <View style={styles.cardContainer}>
              <Pressable
                onPress={() => {
                  Clipboard.setString(brandsData['shareLink']);
                  alert('Link Copied.');
                }}
                style={styles.card}>
                <Text style={styles.cardText}>
                  <FontAwesome name="copy" color="#fff" /> Copy Link
                </Text>
              </Pressable>
              <Pressable onPress={() => onShare()} style={styles.card}>
                <Text style={styles.cardText}>
                  <FontAwesome name="share" color="#fff" /> Share
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.optionsBox}>
            <ScrollView horizontal={true}>
              <Pressable
                style={styles.options}
                onPress={() => {
                  setActiveDiv(1);
                }}>
                <Text
                  style={[
                    styles.colorBlack,
                    ActiveDiv == 1
                      ? {
                          color: '#0d4574',
                        }
                      : {},
                  ]}>
                  Product Details
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setActiveDiv(2);
                }}
                style={styles.options}>
                <Text
                  style={[
                    styles.colorBlack,
                    ActiveDiv == 2
                      ? {
                          color: '#0d4574',
                        }
                      : {},
                  ]}>
                  Terms & Conditions
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setActiveDiv(3);
                }}
                style={styles.options}>
                <Text
                  style={[
                    styles.colorBlack,
                    ActiveDiv == 3
                      ? {
                          color: '#0d4574',
                        }
                      : {},
                  ]}>
                  How to Perform
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setActiveDiv(4);
                }}
                style={[
                  styles.options,
                  brandsData['smaterial1'] ? {} : {display: 'none'},
                ]}>
                <Text
                  style={[
                    styles.colorBlack,
                    ActiveDiv == 4
                      ? {
                          color: '#0d4574',
                        }
                      : {},
                  ]}>
                  Sharing Materials
                </Text>
              </Pressable>
            </ScrollView>
          </View>
          <View
            style={[
              styles.product,
              styles.productDetails,
              ActiveDiv != 1
                ? {
                    display: 'none',
                  }
                : {},
            ]}>
            <View style={styles.productDescBox}>
              <Text style={styles.title}>Product Details</Text>
              <RenderHtml
                source={{html: brandsData['content']}}
                style={styles.htmlContent}
              />

              <Text style={styles.title}>SPECIFICATION</Text>
              <RenderHtml
                source={{html: brandsData['specification']}}
                style={styles.htmlContent}
              />

              <Text style={styles.title}>YOUR PROFIT</Text>
              <RenderHtml
                source={{html: brandsData['yourprofit']}}
                style={styles.htmlContent}
              />
            </View>
          </View>

          <View
            style={[
              styles.product,
              styles.termsandCondition,
              ActiveDiv != 2
                ? {
                    display: 'none',
                  }
                : {},
            ]}>
            <View style={styles.productDescBox}>
              <Text style={styles.title}>Terms and Conditions</Text>
              <RenderHtml
                source={{html: brandsData['terms']}}
                style={styles.htmlContent}
              />
            </View>
          </View>

          <View
            style={[
              styles.product,
              styles.termsandCondition,
              ActiveDiv != 3
                ? {
                    display: 'none',
                  }
                : {},
            ]}>
            <View style={styles.productDescBox}>
              <Text style={styles.title}>How to Perform</Text>
              <RenderHtml
                source={{html: brandsData['termHowtoPerformVideos']}}
                style={styles.htmlContent}
              />
              <RenderHtml
                source={{html: brandsData['HowtoPerform']}}
                style={styles.htmlContent}
              />
            </View>
          </View>

          <View
            style={[
              styles.product,
              styles.termsandCondition,
              ActiveDiv != 4
                ? {
                    display: 'none',
                  }
                : {},
            ]}>
            <View style={styles.productDescBox}>
              <View
                style={[
                  {
                    borderColor: '#000',
                    borderRadius: 5,
                    borderWidth: 1,
                    textAlign: 'center',
                    justifyContent: 'center',
                    width: 200,
                  },
                ]}>
                <Image
                  source={{uri: brandsData['image']}}
                  style={[styles.cardDI]}
                  resizeMode="contain"
                />
                <Text style={[styles.cardDText]}>
                  {brandsData['titlesmaterial1']}
                </Text>

                <Pressable
                  onPress={() => {
                    Linking.openURL(
                      `https://jobipo.com/uploads/product/dn.php?path=` +
                        brandsData['smaterial1'],
                    );
                    alert('Link Copied.');
                  }}
                  style={styles.cardD}>
                  <Text style={styles.cardText}>
                    <FontAwesome name="download" color="#fff" /> Download
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Menu />
    </>
  );
};

export default Product;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#F8F8F8',
    flex: 1,
    marginBottom: 50,
  },
  optionsBox: {
    height: 25,
    marginVertical: 10,
  },
  activeOption: {
    color: '#0d4574',
  },
  options: {
    height: 25,
    marginHorizontal: 10,
  },
  colorBlack: {
    color: '#000',
  },
  product: {
    backgroundColor: '#fff',
    width: '98%',
    margin: 0,

    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingBottom: 5,
    paddingHorizontal: 4,
    borderRadius: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: 80,
    height: 80,
    backgroundColor: '#edfaff',
    borderRadius: 100,
    marginBottom: 2,
  },
  productImgBox: {
    flex: 2,
    backgroundColor: '#0d4574',
    borderBottomEndRadius: 100,
    borderBottomStartRadius: 100,
    marginRight: 20,
    marginTop: 0,
    height: 110,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    color: '#595959',
    paddingTop: 13,
    fontSize: 16,
  },
  sharingMText: {
    color: '#000',
    paddingTop: 10,
    fontSize: 10,
    paddingBottom: 10,
  },
  productNo: {
    color: '#595959',
    marginVertical: 10,
    fontSize: 12,
  },
  termsText: {
    color: '#595959',
    marginVertical: 0,
    fontSize: 12,
  },
  htmlContent: {
    color: '#000',
  },
  productDescBox: {
    width: '100%',
    paddingVertical: 4,
    borderRadius: 5,
    flex: 5,
    marginTop: 0,
  },
  productDesc: {
    textAlign: 'center',
    color: '#595959',
    fontSize: 12,
  },
  ListDot: {
    fontSize: 12,
  },
  cardContainer: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'space-between',
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

  cardD: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d4574',
    borderRadius: 50,
    height: 40,
    width: '90%',
    marginLeft: '5%',
    marginTop: 10,
    marginBottom: 10,
  },

  cardDText: {
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginLeft: '5%',
    marginTop: 10,
    marginBottom: 10,
  },

  cardDI: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    height: 100,
    width: '90%',
    marginLeft: '5%',
    marginTop: 10,
    marginBottom: 10,
  },

  cardText: {
    color: '#fff',
    fontSize: 14,
  },
});
