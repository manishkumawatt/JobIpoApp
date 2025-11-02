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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Logo from '../components/Auth/Logo';
const Notifications = ({navigation}) => {
  const [isLoading, setisLoading] = useState(true);
  const [brandsData, setBrandsData] = useState([]);

  useEffect(() => {
    const GetDataFunc = async () => {
      const sliderDataApi = await fetch(
        'https://jobipo.com/api/Agent/notification',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
        .then(res => res.json())
        .catch(err => console.log(err));

      setisLoading(false);
      if (sliderDataApi && sliderDataApi.logout != 1) {
        setBrandsData(
          JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg)
            .notification,
        );

        // // console.log(brandsData);
      } else {
        //navigation.navigate('Login');
      }
    };

    GetDataFunc();
  }, []);

  return (
    <>
      <Header title="Notifications" />
      <View style={styles.container}>
        {isLoading ? (
          <View
            style={{
              marginTop: '40%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={brandsData}
            keyExtractor={item => item.ttl}
            renderItem={({item}) => (
              <Pressable
                onPress={() => {
                  navigation.navigate('Notification', {
                    title: item.headings.en,
                    contents: item.contents.en,
                    image: item.global_image,
                  });
                }}
                style={[styles.product]}>
                <View style={styles.productDescBox}>
                  <Text style={styles.title}>{item.headings.en}</Text>
                  <Text style={styles.content}>{item.contents.en}</Text>
                </View>
              </Pressable>
            )}
            horizontal={false}
            numColumns={1}
          />
        )}
      </View>

      <Menu />
    </>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#F5F4FD',
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
    color: '#000000',
    paddingTop: 0,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  content: {
    color: '#535353',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 22,
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
