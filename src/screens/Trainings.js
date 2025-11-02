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

  const GetDataFunc = async ttrainingType => {
    setisLoading(true);
    const formdata = {trainingType: ttrainingType};
    const sliderDataApi = await fetch('https://jobipo.com/api/Agent/training', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formdata),
    })
      .then(res => res.json())
      .catch(err => console.log(err));

    // // console.log(sliderDataApi);

    setisLoading(false);
    if (sliderDataApi && sliderDataApi.logout != 1) {
      setBrandsData(
        JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).training,
      );
    } else {
      signOut();
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      if (isActive) {
        GetDataFunc(1);
      }
      return () => {
        isActive = false;
      };
    }, []),
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
      {/* <Header title= 'Trainings' /> */}
      <View style={styles.container}>
        <View style={styles.MainContainer}>
          <View style={[styles.marginTop10]}>
            <View style={styles.cardContainer}>
              <Pressable
                onPress={() => {
                  settrainingType(2);
                  GetDataFunc(2);
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
                  GetDataFunc(1);
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
          keyExtractor={item => item.trainingID} //has to be unique
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
});
