import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { Header2 as Header } from '../../components/Header';
import Menu from '../../components/Menu';
import { useFocusEffect } from '@react-navigation/native';

const RechargeNo = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  // const [operators, setOperators] = useState();
  // const [isLoading, setisLoading] = useState(true);

  // useFocusEffect(
  //   useCallback(() => {
  //     const GetDataFunc = async () => {

  //       const sliderDataApi = await fetch(
  //         `https://jobipo.com/api/Agent/rechselOperator`,
  //         {
  //           method: 'GET',
  //         },
  //       )
  //         .then(res => res.json())
  //         .catch(err => // console.log(err));

  //       if (sliderDataApi.status === 1) {
  //         setOperators(
  //           JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg),
  //         )

  //         setisLoading(false);
  //       } else {
  //         setOperators([]);
  //       }

  //     };

  //     let mount = true;
  //     if (mount) {
  //       GetDataFunc();
  //     }

  //     return () => {
  //       mount = false;
  //     };
  //   }, [])
  // );


  const handleRecharge = async () => {
    if (!mobileNumber) {
      alert('Please enter a mobile number');
      return;
    }

    if (mobileNumber.length < 10) {
      alert('Please enter a valid mobile number');
      return;
    }

    navigation.navigate('RechargeDetails', {
      mobile: mobileNumber,
    });

  };

  return (
    <>
      <Header title='Recharge' />
      <View style={styles.container}>
        <View style={styles.Imagecontainer}>
          <Image
            source={require('../../../assets/Image/recharge.jpg')}
            style={styles.image}
          />
          <Text style={styles.title}>Recharge Smiles, Anytime, Anywhere!</Text>

        </View>

        {/* <FlatList
          data={operators?.filter((item) => item?.category === "Prepaid")}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                height: 50,
                backgroundColor: '#f0f0f0',
                padding: 10,
                borderRadius: 8,
                marginRight: 10,
                marginBottom: 20,
                alignItems: 'center',
              }}
              onPress={() => {

              }}
            >
              <Text style={{
                fontSize: 16,
                color: '#333',
                fontWeight: 'bold',
              }}>{item?.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item?.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 16, color: '#333' }}>No operators available</Text>
            </View>
          )}
        /> */}

        <View style={styles.lastcontainer}>
          <Text style={styles.label}>Enter Your Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={mobileNumber}
            onChangeText={(text) => setMobileNumber(text)}
            keyboardType="phone-pad"
            placeholder="Enter mobile number"
          />

          <TouchableOpacity style={styles.button} onPress={handleRecharge}>
            <Text style={styles.buttonText}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Menu />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,

    backgroundColor: '#ffff',
  },
  Imagecontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: 290,
    marginBottom: 20,

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0d4574',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  lastcontainer: {
    marginTop: 40,
  },
});

export default RechargeNo;
