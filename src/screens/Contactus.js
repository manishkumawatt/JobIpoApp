/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  Pressable,
  Linking,
} from 'react-native';
import React from 'react';
import Menu from '../components/Menu';
import {Header2 as Header} from '../components/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {SafeAreaView} from 'react-native-safe-area-context';

const Contactus = ({navigation}) => {
  const products = [
    {
      id: 0,
      img: require('../../assets/Image/brands/axisIcon.png'),
      title: 'How to open Angel One Demat Account',
      content: 'Refer and Earn Rs. 350/- Each Successful Account Opened',
      desc: 'Earn Up to Rs. 1450/-',
    },
  ];
  return (
    <SafeAreaView style={{flex: 1}}>
      <Header title="Jobipo Support" textColor="#0d4574" />
      <View style={styles.container}>
        <Pressable
          onPress={() => {
            Linking.openURL(`tel:9351111859`);
          }}
          style={[styles.product]}>
          <FontAwesome name="phone" style={styles.image} />
          <Text style={styles.title}> Call Now </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Linking.openURL(`https://wa.me/919351111859ext=Hello`);
          }}
          style={[styles.product]}>
          <FontAwesome name="whatsapp" style={styles.image} />
          <Text style={styles.title}> Whatsapp </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Linking.openURL(`mailto:support@jobipo.com`);
          }}
          style={[styles.product]}>
          <FontAwesome name="envelope" style={styles.image} />
          <Text style={styles.title}> Email </Text>
        </Pressable>
      </View>
      <Menu />
    </SafeAreaView>
  );
};

export default Contactus;

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
    justifyContent: 'flex-start',
    alignContent: 'center',
    textAlignVertical: 'center',
    borderRadius: 200,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 0,
  },
  image: {
    fontSize: 30,
    color: '#fff',
    borderRadius: 50,
    padding: 10,
    paddingHorizontal: 12,
    backgroundColor: '#0d4574',
  },
  title: {
    color: '#595959',
    paddingTop: 0,
    paddingLeft: 10,
    fontSize: 18,
  },
  productNo: {
    color: '#595959',
    marginVertical: 10,
    fontSize: 12,
  },
  productDescBox: {
    borderRadius: 50,
    borderLeftWidth: 1,
    borderLeftColor: '#000',
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
