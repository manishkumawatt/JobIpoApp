/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Logo from '../components/Auth/Logo';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import Menu from '../components/Menu';
import {Header2 as Header} from '../components/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Changepassword = ({navigation}) => {
  const [password, setpassword] = useState('');
  const [Newpassword, setNewpassword] = useState('');
  const [CNewpassword, setCNewpassword] = useState('');
  const [isLoading, setisLoading] = useState(false);

  const UpdateData = async () => {
    setisLoading(true);
    try {
      var formdat = {password: password, Newpassword: Newpassword};
      if (Newpassword == CNewpassword) {
        const asd = await fetch('https://jobipo.com/api/Agent/dochngpassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formdat),
        })
          .then(res => res.json())
          .catch(err => console.log(err));

        // // console.log('gfdg fgfdgfd');
        // // console.log(asd);
        setisLoading(false);
        if (JSON.parse(JSON.stringify(asd)).status == 'success') {
          setNewpassword('');
          setCNewpassword('');
          setpassword('');
          alert(JSON.parse(JSON.stringify(asd)).msg);
        } else {
          setNewpassword('');
          setCNewpassword('');
          setpassword('');
          alert(JSON.parse(JSON.stringify(asd)).msg);
        }
      } else {
        setisLoading(false);
        alert('Confrim Password is not metch.');
      }
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
      <Header title="Change Password" />
      <ScrollView style={styles.container}>
        <View style={styles.MainContainer}>
          <View style={[styles.product]}>
            <View style={[styles.bigWith]}>
              <TextInput
                placeholder="Old Password"
                style={styles.textInput}
                placeholderTextColor="#bbb"
                value={password}
                onChangeText={text => setpassword(text)}
              />
              <TextInput
                placeholder="New Password"
                style={styles.textInput}
                placeholderTextColor="#bbb"
                value={Newpassword}
                onChangeText={text => setNewpassword(text)}
              />
              <TextInput
                placeholder="Confirm New Password"
                style={styles.textInput}
                placeholderTextColor="#bbb"
                value={CNewpassword}
                onChangeText={text => setCNewpassword(text)}
              />
              <View style={styles.cardContainer}>
                <Pressable onPress={() => UpdateData()} style={styles.card}>
                  <Text style={styles.cardText}>Update</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Menu />
    </>
  );
};

export default Changepassword;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    flex: 1,
    marginBottom: 50,
  },
  product: {
    alignItems: 'center',
    textAlignVertical: 'top',
    paddingTop: 0,
    paddingBottom: 5,
    paddingHorizontal: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: '100%',
    backgroundColor: '#edfaff',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    paddingTop: 0,
    fontSize: 16,
  },
  Datatitle: {
    paddingTop: 0,
    fontSize: 16,
  },
  Datadesc: {
    paddingTop: 0,
    fontSize: 13,
  },
  productNo: {
    color: '#595959',
    marginVertical: 10,
    fontSize: 12,
  },
  productDescBox: {
    paddingVertical: 0,
    borderRadius: 0,
    flex: 1,
    paddingLeft: 5,
    paddingBottom: 5,
    alignItems: 'center',
  },
  bigWith: {
    paddingVertical: 0,
    borderRadius: 0,
    flex: 3,
    paddingLeft: 5,
    paddingBottom: 5,
  },
  productDesc: {
    textAlign: 'center',
    color: '#595959',
    fontSize: 12,
    textAlignVertical: 'top',
  },
  cardIcon: {
    fontSize: 25,
  },
  cardText: {
    fontSize: 15,
    color: '#0d4574',
  },
  card: {
    marginTop: 15,
  },
  customBox: {
    backgroundColor: '#fff',
    width: '95%',
    alignItems: 'center',
    height: 40,
    paddingTop: 7,
  },
  SliderImage: {
    marginLeft: '2.5%',
    width: '95%',
    alignItems: 'center',
  },
  BackgroundBlue: {
    backgroundColor: '#0d4574',
  },
  colorblue: {
    color: '#0d4574',
  },
  BackgroundYellow: {
    backgroundColor: '#FFC895',
  },
  BackgroundWhite: {
    backgroundColor: '#fff',
  },
  MBackgroundGray: {
    backgroundColor: '#F8F8F8',
    margin: 3,
    height: 45,
    textAlignVertical: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  MainContainer: {
    marginLeft: '2.5%',
    width: '95%',
    alignItems: 'center',
  },
  marginTop10: {
    marginTop: 10,
  },
  paddingTop10: {
    paddingTop: 10,
  },
  marginBottom10: {
    marginBottom: 30,
  },
  textInput: {
    backgroundColor: '#fff',
    height: 40,
    marginBottom: 10,
    paddingLeft: 15,
  },
  status: {
    backgroundColor: '#FFC895',
    paddingHorizontal: 15,
    borderRadius: 15,
    color: '#fff',
    paddingBottom: 3,
    alignItems: 'center',
    marginBottom: 8,
  },
  statusAction: {
    backgroundColor: '#62A7E7',
  },
  statusApproved: {
    backgroundColor: '#0d4574',
    marginLeft: -10,
  },
  statusRejected: {
    backgroundColor: '#535353',
    marginLeft: -10,
  },
  LeadId: {
    marginLeft: -30,
  },
  BoxHeight: {
    marginTop: 11,
  },
  cardContainer: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d4574',
    borderRadius: 50,
    height: 40,
    width: '49%',
  },

  cardText: {
    color: '#fff',
    fontSize: 14,
  },
});
