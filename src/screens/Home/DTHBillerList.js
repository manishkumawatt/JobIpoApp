import React from 'react';
import { View, Text, Image, StyleSheet ,Pressable} from 'react-native';
import { Header2 as Header } from '../../components/Header';

const DTHBillerList = ({ navigation }) => {
  return (
    <>
      <Header title="Select Provider" />
   
      <View style={styles.container}>
        <Pressable style={styles.mainrow} onPress={() => navigation.navigate('AirtelDigitalTV', { title: 'Airtel Digital TV' })}>
          <View style={styles.Imagecontainer}>
            <Image source={require('../../../assets/Image/airtel.jpg')} style={styles.image} resizeMode="contain"/>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Airtel DTH</Text>
          </View>
        </Pressable>

        <Pressable style={styles.mainrow}  onPress={() =>  navigation.navigate('AirtelDigitalTV', { title: 'Dish TV' })}>
          <View style={styles.Imagecontainer}>
            <Image source={require('../../../assets/Image/dishtv.png')} style={styles.image} resizeMode="contain"/>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Dish TV</Text>
          </View>
        </Pressable>

        <Pressable style={styles.mainrow} onPress={() =>  navigation.navigate('AirtelDigitalTV', { title: 'Tata Play (Formerly Tatasky)' })}>
          <View style={styles.Imagecontainer}>
            <Image source={require('../../../assets/Image/tata.jpg')} style={styles.image} resizeMode="contain"/>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Tata Play (Formerly Tatasky)</Text>
          </View>
        </Pressable>

        <Pressable style={styles.mainrow} onPress={() =>  navigation.navigate('AirtelDigitalTV', { title: 'Sun Direct' })}>
          <View style={styles.Imagecontainer}>
            <Image source={require('../../../assets/Image/sunDirect.png')} style={styles.image} resizeMode="contain"/>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Sun Direct</Text>
          </View>
        </Pressable>

        <Pressable style={styles.mainrow} onPress={() =>  navigation.navigate('AirtelDigitalTV', { title: 'Videocon D2H' })}>
          <View style={styles.Imagecontainer}>
            <Image source={require('../../../assets/Image/d2dd.jpg')} style={styles.image} resizeMode="contain"/>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Videocon D2H</Text>
          </View>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  mainrow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    // marginVertical: 5,
    borderRadius: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
  },
  
//   Imagecontainer:{
//     borderWidth:0.1,
//     borderColor:'black',
//     borderRadius:3,
//   },
  
  image: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  imageD: {
    borderWidth:0.1,
    borderColor:'black',
    width: 60,
    height: 60,
    marginRight: 16,
    resizeMode: 'cover',
  },
  textContainer: {
    marginHorizontal: 20,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
});

export default DTHBillerList;
