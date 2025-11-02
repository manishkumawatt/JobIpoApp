/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Pressable,
  View,
  ActivityIndicator,
} from 'react-native';
import Share from 'react-native-share';
import {captureRef} from 'react-native-view-shot';
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
import Logo from '../components/Auth/Logo';
import {AuthContext} from '../context/context';
import {useFocusEffect} from '@react-navigation/native';

const ID = ({navigation}) => {
  const {signOut} = useContext(AuthContext);

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
      // await Share.open();
      await Share.open({
        url: uri,
        message:
          'Hi,                                                               This is from Jobipo Sales Partner',
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const downloadImage = async () => {
    var uri = await captureRef(viewRef, {
      format: 'png',
      quality: 0.8,
    });
    var date = new Date();
    var image_URL = 'https://www.jobipo.com/logo/logo.png';
    var ext = '.png';
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        Alert.alert('ID Card Downloaded Successfully.');
      });
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
      {/* <Header navigation={navigation} title="ID Card" /> */}
      <ScrollView style={styles.container}>
        <View style={styles.card} ref={viewRef}>
          <View style={styles.ellipse}></View>
          <View style={styles.box}>
            <Image
              style={styles.logo}
              source={require('../../assets/rect_logo.png')}
            />
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

            <View
              style={[
                styles.list,
                {
                  width: '80%',
                },
              ]}>
              <Text style={styles.listText}>
                Partner ID : {users.uniqueCode}
              </Text>
              <Text style={styles.listText}>
                Mobile No. : {users.contactNumber1}
              </Text>
              <Text style={styles.listText}>Email: {users.emailID}</Text>
              <Text
                style={[
                  styles.listText,
                  {
                    textAlign: 'center',
                  },
                ]}>
                Address: {users.address}
              </Text>
            </View>

            <View style={styles.brands}>
              <View style={styles.brand}>
                <Image
                  style={styles.brandImage}
                  source={require('../../assets/Image/brands/brand1.png')}
                />
              </View>
              <View style={styles.brand}>
                <Image
                  style={styles.brandImage}
                  source={require('../../assets/Image/brands/brand2.png')}
                />
              </View>
              <View style={styles.brand}>
                <Image
                  style={styles.brandImage}
                  source={require('../../assets/Image/brands/brand3.png')}
                />
              </View>
              <View style={styles.brand}>
                <Image
                  style={styles.brandImage}
                  source={require('../../assets/Image/brands/brand4.png')}
                />
              </View>
              <View style={styles.brand}>
                <Image
                  style={styles.brandImage}
                  source={require('../../assets/Image/brands/brand5.png')}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.buttonGroup}>
          {/*
            <Pressable 
            style={styles.button}
            onPress={() => downloadImage() }
          >
            <Text style={styles.text}>Download</Text>
          </Pressable>
          */}

          <Pressable style={styles.button} onPress={() => shareImage()}>
            <Text style={styles.text}>Share</Text>
          </Pressable>
        </View>
      </ScrollView>
      <Menu />
    </>
  );
};

export default ID;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 39,
    paddingHorizontal: 32,
  },
  card: {
    borderWidth: 0.1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    elevation: 10,
    shadowRadius: 3,
    width: '100%',
    height: 600,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0d4574',
  },
  ellipse: {
    backgroundColor: '#fff',
    width: 440,
    height: 440,
    borderRadius: 500,
    position: 'absolute',
    top: -140,
    left: -40,
  },
  box: {
    height: '100%',
    alignItems: 'center',
  },
  logo: {
    marginTop: 37,
    width: 140,
    height: 90,
  },
  profContainer: {
    backgroundColor: '#D0BAEA',
    width: 217,
    height: 217,
    marginTop: 18,
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profImg: {
    width: 185,
    height: 185,
    borderRadius: 150,
  },
  bio: {
    // borderLeftWidth: 0.5,
    // borderLeftColor: '#fff',
    marginTop: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingBottom: 5,
  },
  title: {
    fontSize: 22,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#fff',
  },
  desc: {
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: '#fff',
  },
  list: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4.7,
  },
  listText: {
    fontSize: 12,
    marginVertical: 2,
    color: '#fff',
  },
  brands: {
    flexDirection: 'row',
    marginTop: 10,
  },
  brand: {
    borderRadius: 50,
    marginLeft: 11,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F3FD',
  },
  brandImage: {
    width: 30,
    height: 30,
    backgroundColor: '#F8F3FD',
    borderRadius: 50,
  },
  buttonGroup: {
    marginTop: 40,
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
    color: '#fff',
  },
});
