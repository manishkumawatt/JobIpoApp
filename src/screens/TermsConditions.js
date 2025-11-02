/* eslint-disable prettier/prettier */
import { StyleSheet, Text, Image, View, Pressable } from 'react-native';
import React from 'react';
import { Header2 as Header } from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/Button';
import Menu from '../components/Menu';

const TermsConditions = ({ navigation }) => {
  const style = {
    marginRight: 9,
  };
  return (
    <>
      <Header navigation={navigation} title="Terms and Condition" />
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.rightCard}>
            <View style={styles.bio}>
              <Text style={styles.title}>AARABH PRAJAPAT</Text>
              <Text style={styles.desc}>SALES PARTNER</Text>
            </View>

            <View style={styles.list}>
              <View style={styles.listItem}>
                <Ionicons name="square-sharp" color="#fff" size={6} />
                <Text style={styles.listText}>Partner ID : MOD377326</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <Menu />
    </>
  );
};

export default TermsConditions;

const styles = StyleSheet.create({
  container: {
    marginTop: 39,
    paddingHorizontal: 10,
  },

  card: {
    width: '100%',
    height: 208,
    //backgroundColor: '#0d4574',
    borderRadius: 15,
    flexDirection: 'row',
    paddingLeft: 5,
  },
  leftCard: {
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
  },
  leftCardBox: {
    marginTop: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftCardTitle: {
    width: 97,
    textAlign: 'center',
    fontSize: 8,
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
  },
  bio: {
    borderLeftWidth: 0.5,
    borderLeftColor: '#fff',
    paddingLeft: 8,
    marginTop: 5,
  },
  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  desc: {
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
    fontSize: 8,
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
    color: '#fff',
  },
});
