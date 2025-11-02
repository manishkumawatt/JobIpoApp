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
  Button,
  TouchableHighlight,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import Menu from '../components/Menu';
import {Header2 as Header} from '../components/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Logo from '../components/Auth/Logo';
import {Avatar} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';

const Profile = ({navigation}) => {
  const [openDate, setOpenDate] = useState(false);
  const [uData, setUData] = useState([]);
  const [users, setUsers] = useState([]);
  const [fullName, setfullName] = useState('');
  const [DOB, setDOB] = useState('');
  const [address, setaddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [occupation, setOccupation] = useState('');
  const [qualification, setQualification] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [Pic, SetPic] = React.useState(
    'iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAgMAAACJFjxpAAAADFBMVEXFxcX////p6enW1tbAmiBwAAAFiElEQVR4AezAgQAAAACAoP2pF6kAAAAAAAAAAAAAAIDbu2MkvY0jiuMWWQoUmI50BB+BgRTpCAz4G6C8CJDrC3AEXGKPoMTlYA/gAJfwETawI8cuBs5Nk2KtvfiLW+gLfK9m+r3X82G653+JP/zjF8afP1S//y+An4/i51//AsB4aH+/QPD6EQAY/zwZwN8BAP50bh786KP4+VT+3fs4/noigEc+jnHeJrzxX+NWMDDh4g8+EXcnLcC9T8U5S/CdT8bcUeBEIrwBOiI8ki7Ba5+NrePgWUy89/nYyxQ8Iw3f+pWY4h1gb3eAW7sDTPEOsLc7wK1TIeDuDB+I/OA1QOUHv/dFsZQkhKkh4QlEfOULYz2nGj2/Nn1LmwR/86VxlCoAW6kCsHRGANx1RgCMo5Qh2EsZgrXNQZZShp5Liv7Il8eIc5C91EHY2hxk6bwYmNscZIReDBwtCdhbErC1JGBpScBcOgFMLQsZMQs5Whayd+UQsLYsZGlZyNyykKllISNmIUfAwifw8NXvTojAjGFrdYi11SGWVoeYWx1i6lmQCiEjFkKOVgjZ+xxIhZCtFULWHkCqxCw9gNQKmP9vNHzipdEPrRcxtVbAeDkAvve0iM2QozVD9hfjhp4YP/UrkJYDbD2AtBxgfSkAvvHEeNcDSAsilgtAWxIy91J8AXgZAJ5e33+4tuACcAG4AFwALgBXRXQB6AFcB5MXAuA6nl9/0Vx/011/1V5/1/dfTPJvRtdnu/zL6beeFO/7r+fXBYbrEkt/j+i6ytXfpuvvE/ZXOnsA/a3a/l5xf7O6v1t+Xe/vOyz6HpO8yyboM8o7rfJes77bru83THk48p7TvOs27zvOO6/73vO++z7l4cgnMPQzKPopHC0N9noSSz6LJp/Gk88jyicy5TOp6qlc+VyyfDJbPpuuns6XzyfMJzTmMyrrKZ35nNJ8Ums+q7af1tvPK+4nNodEnPKp3fnc8npyez67/qVP7+/fL8hfcMjfsOhf8cjfMclfcnn9+BkOnLECP8Q58OYeyJ40eoyF6Ee/En/JHlP6mIlRVXprF4BxtAvArV0AxtEuALd2ARhHuwDc2gVgHPX/hFv9fMBddjIGeKg/WCxlCsI46u+Ga5mCcJd+sIG9UkGAW32ZbApFAHhod4Bb3eo04h3god0BbiUHYApVCNjbHeBW+QDAXT4a7qg7r7e214057vg0QhkEHkoSwq0kIdydXw4/Q3H8hjYJ3vL0WConBJhCHQaOToeBrU0BljYFmEoVgHGUKgAPnREAt84IgLuqFgAYSUEOAHszDwuAtSkHAZhLGYIpdCLgKGUIHtocZG1zkLmUIRhxDnJU1RDA1uYga5uDzKUOwhTnIEfnxcDe5iBrcyQAYGlzkKkUYhhxDrKXQgxbSwLWUohhbknA1JKAEZOAvSUBW0sC1pYEzC0JmFoSMMJyCDhaFrK3JGDtyiFgaVnI3LKQqWUhI2YhR8tC9paFrC0LWVoWMrcsZGpZyIhZyNGykL2rSIGtlQHWVgZYWhlgbmWAqZUBRiwDHK0MsLcywNbKAGsOoNUhllaHmFsdYmp1iBHrEEerQ+w5gFYI2VodYm11iKXVIeYcQCuETK0QMmIh5MgBtELI3gohWyuErDmAVolZWiFkzgG0SszUKjGjfj6gVmKOVonZcwCtFbB9HQC+ozWDbz1bvGu9iKW1AuYcQOtFTLEX1GbIaFegN0OOHEBrhuw5gNYM2XIArRuz5gDacoB3bTnAEktxXQ4wfw0AvveM8b4tiJjSJOwLIsbXsAKeNeKCiOO3D+AVbUl0AfjGs8ZPbUnIdgFoa1LWC0BblfMuB9AeC1j6gqQE0J9LmC8AOYD2ZMb7i4bt2ZTpWoHfPoB7Tj2fXzT8N1X41vkq/QHOAAAAAElFTkSuQmCC',
  );
  const setToastMsg = msg => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  const EditData = () => {
    // // console.log('Edit button pressed');
    navigation.navigate('EditProfile');
  };

  const SaveData = () => {
    // // console.log('Save button pressed');
    setIsEditing(false);
  };

  const uploadImage = () => {
    let options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        setToastMsg('Cancelled image selection');
      } else if (response.errorCode == 'permission') {
        setToastMsg('permission not satidfied');
      } else if (response.errorCode == 'others') {
        setToastMsg(response.errorMessage);
      } else if (response.assets[0].filesSize > 2097152) {
        Alert.alert('maximum size', [{text: 'ok'}]);
      } else {
        SetPic(response.assets[0].base64);
      }
    });
  };

  const UpdateData = async () => {
    setisLoading(true);
    try {
      var formdat = {
        fullName: fullName,
        DOB: DOB,
        address: address,
        Pic: Pic,
      };

      const asd = await fetch('https://jobipo.com/api/Agent/dochngprofile', {
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
        alert(JSON.parse(JSON.stringify(asd)).msg);
      } else {
        alert(JSON.parse(JSON.stringify(asd)).msg);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const GetDataFunc = async () => {
      setisLoading(true);
      const sliderDataApi = await fetch('https://jobipo.com/api/Agent/index', {
        method: 'GET',
      })
        .then(res => res.json())
        .catch(err => console.log(err));
      setisLoading(false);
      if (sliderDataApi) {
        if (sliderDataApi.logout != 1) {
          setUsers(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users,
          );
          setfullName(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
              .fullName,
          );
          setaddress(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
              .address,
          );
          setDOB(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users.DOB,
          );
          // // console.log(
          // JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users.Pic,
          // );
          if (
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
              .Pic != ''
          ) {
            // // console.log('conrent jfjf');
            SetPic(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
                .Pic,
            );
          }
        } else {
          navigation.navigate('Login');
        }
      } else {
        Alert.alert(
          'Connection Issue',
          'Please check your internet connection.',
        );
      }
    };

    GetDataFunc();
  }, []);

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
      {/* <Header title='Profile' /> */}
      <ScrollView style={styles.container}>
        <View style={styles.profile}>
          <View style={styles.centerContent}>
            <TouchableHighlight
              onPress={() => uploadImage()}
              underlayColor="rgba(0,0,0,0)">
              <View style={styles.button}>
                <Avatar.Image
                  size={130}
                  source={{uri: 'data:image/png;base64,' + Pic}}
                />
              </View>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.MainContainer}>
          <View style={[styles.product]}>
            <View style={[styles.bigWith]}>
              <View style={[styles.inputRow, isEditing && styles.editRow]}>
                <FontAwesome
                  name="user"
                  size={30}
                  color="#0d4574"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={text => setfullName(text)}
                  style={styles.textInput}
                  placeholderTextColor="#333"
                  editable={isEditing}
                />
              </View>

              <View style={[styles.inputRow, isEditing && styles.editRow]}>
                <FontAwesome
                  name="calendar"
                  size={20}
                  color="#0d4574"
                  style={styles.icon}
                />
                <Pressable
                  onPress={() => setOpenDate(true)}
                  style={styles.textInput}
                  disabled={!isEditing}>
                  <Text>{DOB ? DOB : 'Select Date of Birth'}</Text>
                </Pressable>
                {/* <TextInput
                placeholder="DOB"
                value={DOB}
                onChangeText={text => setDOB(text)}
                style={styles.textInput}
                placeholderTextColor="#333"
                editable={isEditing}
              /> */}
              </View>
              {openDate && (
                <RNDateTimePicker
                  value={new Date(DOB || Date.now())}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    const formattedDate = selectedDate
                      ? selectedDate.toISOString().split('T')[0]
                      : DOB;
                    setDOB(formattedDate);
                    setOpenDate(false);
                  }}
                  style={styles.textInput}
                />
              )}

              <View style={[styles.inputRow, isEditing && styles.editRow]}>
                <FontAwesome
                  name="map-marker"
                  size={20}
                  color="#0d4574"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Address"
                  value={address}
                  onChangeText={text => setaddress(text)}
                  style={styles.textInput}
                  placeholderTextColor="#333"
                  editable={isEditing}
                />
              </View>

              <View style={[styles.inputRow, isEditing && styles.editRow]}>
                <FontAwesome
                  name="location-arrow"
                  size={20}
                  color="#0d4574"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Pincode"
                  value={pincode}
                  onChangeText={text => setPincode(text)}
                  style={styles.textInput}
                  placeholderTextColor="#333"
                  editable={isEditing}
                />
              </View>

              <View style={[styles.inputRow, isEditing && styles.editRow]}>
                <FontAwesome
                  name="briefcase"
                  size={20}
                  color="#0d4574"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Occupation"
                  value={occupation}
                  onChangeText={text => setOccupation(text)}
                  style={styles.textInput}
                  placeholderTextColor="#333"
                  editable={isEditing}
                />
              </View>
              <View style={[styles.inputRow, isEditing && styles.editRow]}>
                <FontAwesome
                  name="graduation-cap"
                  size={20}
                  color="#0d4574"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Qualification"
                  value={qualification}
                  onChangeText={text => setQualification(text)}
                  style={styles.textInput}
                  placeholderTextColor="#333"
                  editable={isEditing}
                />
              </View>
              <View style={styles.buttonRow}>
                <Pressable onPress={toggleEditMode} style={styles.editButton}>
                  <Text style={styles.cardText}>
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={SaveData}
                  style={styles.saveButton}
                  disabled={!isEditing}>
                  <Text style={styles.cardText}>Save</Text>
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

export default Profile;

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
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profContainer: {
    width: 140,
    height: 140,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 17,
    borderColor: '#0d4574',
    borderWidth: 2,
    marginBottom: 20,
    padding: 0,
  },
  image: {
    width: '50%',
    height: '50%',
    borderRadius: 100,
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
  // bigWith: {
  //   paddingVertical: 0,
  //   borderRadius: 0,
  //   flex: 3,
  //   paddingLeft: 5,
  //   paddingBottom: 5,
  // },

  productDesc: {
    textAlign: 'center',
    color: '#595959',
    fontSize: 12,
    textAlignVertical: 'top',
  },
  cardIcon: {
    fontSize: 25,
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
    marginTop: 30,
    padding: 20,
    // marginLeft: '2.5%',
    // width: '95%',
    // alignItems: 'center',
    flex: 1,
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
    flex: 1,
    color: '#333',

    // borderWidth: 1,
    // borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },

  bigWith: {
    width: '100%',
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
  // cardText: {
  //     fontSize: 15,
  //     color: '#0d4574',
  //   },
  //   card: {
  //     marginTop: 15,
  //   },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    flex: 0.45,
    backgroundColor: '#0d4574',
    borderRadius: 20,
    alignItems: 'center',
    padding: 10,
  },
  saveButton: {
    flex: 0.45,
    backgroundColor: '#ffc266',
    borderRadius: 20,
    alignItems: 'center',
    padding: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
  },
  editRow: {
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
    backgroundColor: '#f8f8f8',
    // borderWidth: 1,
    // borderColor: '#ddd',
    marginLeft: 7,
    padding: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
