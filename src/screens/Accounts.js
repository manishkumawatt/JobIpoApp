/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
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
import RenderHtml from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../components/Auth/Logo';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/context';
const Accounts = ({navigation, route}) => {
  const {params} = route;
  const {signOut} = useContext(AuthContext);
  const [brandsData, setBrandsData] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const GetDataFunc = async () => {
        setisLoading(true);
        var formdata = {categoryID: params.categoryID};
        const sliderDataApi = await fetch(
          'https://jobipo.com/api/Agent/brands',
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
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).brands,
          );

          // // console.log('Account brandsData', brandsData);
        } else {
          signOut();
        }
      };

      if (isActive) {
        GetDataFunc();
      }

      return () => {
        isActive = false;
      };
    }, [params.categoryID]),
  );

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
      <View style={styles.container}>
        <FlatList
          data={brandsData}
          keyExtractor={item => item.productId} //has to be unique
          renderItem={({item}) => (
            <Pressable
              onPress={() => {
                navigation.navigate('Product', {
                  title: params.title,
                  productId: item.productId,
                });
              }}
              style={[styles.product]}>
              <Image
                source={{uri: item.image}}
                style={styles.image}
                resizeMode="contain"
              />
              <View style={styles.productDescBox}>
                <Text style={styles.title}>{item.title}</Text>
                <RenderHtml
                  source={{html: item.OfferContent}}
                  style={styles.htmlContent}
                />
              </View>
            </Pressable>
          )}
          horizontal={false}
          numColumns={1}
        />
      </View>
      <Menu />
    </>
  );
};

export default Accounts;

const styles = StyleSheet.create({
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
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 4,
    borderRadius: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomStartRadius: 200,
  },
  image: {
    width: 70,
    height: 80,
    flex: 2,
    backgroundColor: '#edfaff',
    borderRadius: 100,
    marginRight: 20,
  },
  title: {
    color: '#595959',
    paddingTop: 13,
    fontSize: 16,
  },
  htmlContent: {},
  productNo: {
    color: '#595959',
    marginVertical: 10,
    fontSize: 12,
  },
  productDescBox: {
    width: '80%',
    paddingVertical: 4,
    borderRadius: 5,
    flex: 5,
  },
  productDesc: {
    textAlign: 'center',
    color: '#595959',
    fontSize: 12,
  },
});
