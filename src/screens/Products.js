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
import React, {useState, useEffect, useRef, useCallback} from 'react';
import Menu from '../components/Menu';
import {Header2 as Header} from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../components/Auth/Logo';
import {useFocusEffect} from '@react-navigation/native';
let userToken;
userToken = null;
const Products = ({navigation}) => {
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    setTimeout(async () => {
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // // console.log(e);
      }
      // // console.log(userToken);
      /*if(userToken == null){
        navigation.navigate('Login'); 
      }*/
      //dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1);
  }, []);

  const [brandsData, setBrandsData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const GetDataFunc = async () => {
        setisLoading(true);
        var formdata = {categoryID: ''};
        const sliderDataApi = await fetch(
          'https://jobipo.com/api/Agent/category',
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
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).category,
          );

          // // console.log(' product brandsData', brandsData);
        } else {
          //navigation.navigate('Login');
        }
      };

      if (isActive) {
        GetDataFunc();
      }

      return () => {
        isActive = false;
      };
    }, []),
  );

  const products = [
    {
      id: 0,
      img: require('../../assets/icons/products/saving.png'),
      title: 'Saving Accounts',
      product: '05',
      desc: 'Earn Up to Rs. 1450/-',
    },
    {
      id: 1,
      img: require('../../assets/icons/products/saving.png'),
      title: 'Demate Accounts',
      product: '05',
      desc: 'Earn Up to Rs. 1450/-',
    },
    {
      id: 2,
      img: require('../../assets/icons/products/saving.png'),
      title: 'Personal Loan',
      product: '05',
      desc: 'Earn Up to Rs. 1450/-',
    },
    {
      id: 3,
      img: require('../../assets/icons/products/credit.png'),
      title: 'Credit Cards',
      product: '05',
      desc: 'Earn Up to Rs. 1450/-',
    },
    {
      id: 4,
      img: require('../../assets/icons/products/credit.png'),
      title: 'EMI Cards',
      product: '05',
      desc: 'Earn Up to Rs. 1450/-',
    },
    {
      id: 5,
      img: require('../../assets/icons/products/credit.png'),
      title: 'Credit Cards',
      product: '05',
      desc: 'Earn Up to Rs. 1450/-',
    },
    {
      id: 6,
      img: require('../../assets/icons/products/saving.png'),
      title: 'Recharge and Pay Bills',
      product: '05',
      desc: 'Earn Up to Rs. 1450/-',
    },
    {
      id: 7,
      img: require('../../assets/icons/products/saving.png'),
      title: 'Online Shopping',
      product: '04',
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
      {/* <Header title="Products" /> */}
      <View style={styles.container}>
        <FlatList
          data={brandsData}
          keyExtractor={item => item.categoryID}
          renderItem={({item}) => (
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
              <Text style={styles.productNo}>Product: {item.ProductCount}</Text>
              <View style={styles.productDescBox}>
                <Text style={styles.productDesc}>{item.description}</Text>
              </View>
            </Pressable>
          )}
          horizontal={false}
          numColumns={2}
        />
      </View>
      <Menu />
    </>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 60,
    backgroundColor: '#ffffff',
  },
  product: {
    backgroundColor: '#FFFFFF',
    width: '46%',
    margin: 8,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#FFB26B',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FFE9D6',
    transition: 'all 0.3s',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 12,
    borderRadius: 40,
    backgroundColor: '#FFF2E6',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#33334d',
    textAlign: 'center',
    marginBottom: 4,
  },
  productNo: {
    fontSize: 13,
    fontWeight: '500',
    color: '#33334d',
    marginBottom: 10,
  },
  productDescBox: {
    backgroundColor: '#FFF1E6',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderColor: '#FFE5D0',
    borderWidth: 1,
  },
  productDesc: {
    fontSize: 12,
    color: '#5C3D2E',
    textAlign: 'center',
    lineHeight: 16,
  },
});
