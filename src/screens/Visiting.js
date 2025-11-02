/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  Image,
  View,
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
import {Header2 as Header} from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/Button';
import Menu from '../components/Menu';
import Share from 'react-native-share';
import {captureRef} from 'react-native-view-shot';
import Logo from '../components/Auth/Logo';
import {AuthContext} from '../context/context';
import {useFocusEffect} from '@react-navigation/native';

const Visiting = ({navigation}) => {
  const {signOut} = useContext(AuthContext);
  const style = {
    marginRight: 9,
  };
  const viewRef = useRef();
  const [uData, setUData] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const GetDataFunc = async () => {
        setisLoading(true);
        const sliderDataApi = await fetch(
          'https://jobipo.com/api/Agent/index',
          {
            method: 'GET',
          },
        )
          .then(res => res.json())
          .catch(err => console.log(err));
        setisLoading(false);
        if (sliderDataApi) {
          if (sliderDataApi.logout != 1) {
            setUsers(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users,
            );
          } else {
            signOut();
          }
        } else {
          Alert.alert(
            'Connection Issue',
            'Please check your internet connection.',
          );
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

  const shareImage = async () => {
    try {
      var uri = await captureRef(viewRef, {
        format: 'jpg',
        quality: 0.8,
      });
      await Share.open({
        url: uri,
        message:
          'Hi,                                                               This is from Jobipo Sales Partner',
      });
    } catch (error) {
      alert(error.message);
    }
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
      <Header navigation={navigation} title="Visiting Card" />
      <View style={styles.container}>
        <View style={styles.card} ref={viewRef}>
          <View style={styles.leftCard}>
            <View style={styles.logo}>
              <Image
                source={require('../../assets/rect_logo.png')}
                style={{
                  width: 150,
                  height: 50,
                  marginTop: 10,
                }}
              />
            </View>
            <View style={styles.leftCardBox}>
              <Text style={styles.leftCardTitle}>
                We provide a wide range of campaigns accross multiple
                categories.
                {/* We deal in all types of financial products. */}
              </Text>
              <View style={styles.brands}>
                <View style={styles.brand}>
                  <Image
                    style={styles.brandImg}
                    source={require('../../assets/Image/brands/brand1.png')}
                  />
                </View>
                <View style={styles.brand}>
                  <Image
                    style={styles.brandImg}
                    source={require('../../assets/Image/brands/brand2.png')}
                  />
                </View>
                <View style={styles.brand}>
                  <Image
                    style={styles.brandImg}
                    source={require('../../assets/Image/brands/brand3.png')}
                  />
                </View>
                <View style={styles.brand}>
                  <Image
                    style={styles.brandImg}
                    source={require('../../assets/Image/brands/brand4.png')}
                  />
                </View>
                <View style={styles.brand}>
                  <Image
                    style={styles.brandImg}
                    source={require('../../assets/Image/brands/brand5.png')}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.rightCard}>
            <View style={styles.profContainer}>
              <Image
                style={styles.profImg}
                source={{uri: 'data:image/png;base64,' + users['Pic']}}
              />
            </View>
            <View style={styles.bio}>
              <Text style={styles.title}>{users.fullName}</Text>
              <Text style={styles.desc}>AFFILIATE PARTNER</Text>
            </View>

            <View style={styles.list}>
              <View style={styles.listItem}>
                <Ionicons name="square-sharp" color="#fff" size={6} />
                <Text style={styles.listText}>
                  Partner ID : {users.uniqueCode}
                </Text>
              </View>
              <View style={styles.listItem}>
                <Ionicons name="square-sharp" color="#fff" size={6} />
                <Text style={styles.listText}>
                  Mobile No. : {users.contactNumber1}
                </Text>
              </View>
              <View style={styles.listItem}>
                <Ionicons name="square-sharp" color="#fff" size={6} />
                <Text style={styles.listText}>Email: {users.emailID}</Text>
              </View>
              <View style={styles.listItem}>
                <Ionicons name="square-sharp" color="#fff" size={6} />
                <Text style={styles.listText}>Address: {users.address}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.buttonGroup}>
          {/*
                    <Pressable 
                    style={styles.button}>
                      <Text style={styles.text}>Download</Text>
                    </Pressable>
            */}
          <Pressable style={styles.button} onPress={() => shareImage()}>
            <Text
              style={[
                styles.text,
                {
                  color: '#fff',
                },
              ]}>
              Share
            </Text>
          </Pressable>
        </View>
      </View>
      <Menu />
    </>
  );
};

export default Visiting;

const styles = StyleSheet.create({
  container: {
    marginTop: 39,
    paddingHorizontal: 31,
  },

  card: {
    width: '100%',
    height: 208,
    backgroundColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
    paddingLeft: 26,
  },
  leftCard: {
    width: '40%',
    alignItems: 'center',
    marginTop: 31,
  },
  logo: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 97,
    overflow: 'hidden',
  },
  leftCardBox: {
    marginTop: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftCardTitle: {
    color: '#0d4574',
    width: 130,
    textAlign: 'center',
    fontSize: 9,
  },
  brands: {
    flexDirection: 'row',
    marginTop: 10,
  },
  brand: {
    backgroundColor: '#fff',
    borderRadius: 50,
    marginLeft: 5,
  },
  brandImg: {
    width: 23,
    height: 23,
  },
  rightCard: {
    width: '50%',
    marginTop: 31,
    marginLeft: 27,
  },
  profContainer: {
    backgroundColor: '#D0BAEA',
    width: 55,
    height: 55,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profImg: {
    width: 47,
    height: 47,
    borderRadius: 40,
  },
  bio: {
    borderLeftWidth: 0.5,
    borderLeftColor: '#fff',
    paddingLeft: 8,
    marginTop: 5,
  },
  title: {
    color: '#0d4574',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  desc: {
    color: '#0d4574',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listText: {
    color: '#0d4574',
    fontSize: 9,
    marginLeft: 5,
  },
  buttonGroup: {
    marginTop: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 150,
  },
  button: {
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
    width: '45%',
    backgroundColor: '#FFC895',
  },
  text: {
    fontSize: 18,
    color: '#0d4574',
  },
});
