import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  TouchableHighlight,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import JobHeader from '../../../components/Job/JobHeader';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import DateTimePicker from '../../../components/DateTimePicker';
import {Avatar} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showToastMessage} from '../../../utils/Toast';

const AddPersonalDetails = ({navigation, route}) => {
  const {users, jobSeekerData} = route.params;

  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#000' : '#000';

  const [formData, setFormData] = useState({
    Pic:
      users?.Pic ||
      'iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAgMAAACJFjxpAAAADFBMVEXFxcX////p6enW1tbAmiBwAAAFiElEQVR4AezAgQAAAACAoP2pF6kAAAAAAAAAAAAAAIDbu2MkvY0jiuMWWQoUmI50BB+BgRTpCAz4G6C8CJDrC3AEXGKPoMTlYA/gAJfwETawI8cuBs5Nk2KtvfiLW+gLfK9m+r3X82G653+JP/zjF8afP1S//y+An4/i51//AsB4aH+/QPD6EQAY/zwZwN8BAP50bh786KP4+VT+3fs4/noigEc+jnHeJrzxX+NWMDDh4g8+EXcnLcC9T8U5S/CdT8bcUeBEIrwBOiI8ki7Ba5+NrePgWUy89/nYyxQ8Iw3f+pWY4h1gb3eAW7sDTPEOsLc7wK1TIeDuDB+I/OA1QOUHv/dFsZQkhKkh4QlEfOULYz2nGj2/Nn1LmwR/86VxlCoAW6kCsHRGANx1RgCMo5Qh2EsZgrXNQZZShp5Liv7Il8eIc5C91EHY2hxk6bwYmNscZIReDBwtCdhbErC1JGBpScBcOgFMLQsZMQs5Whayd+UQsLYsZGlZyNyykKllISNmIUfAwifw8NXvTojAjGFrdYi11SGWVoeYWx1i6lmQCiEjFkKOVgjZ+xxIhZCtFULWHkCqxCw9gNQKmP9vNHzipdEPrRcxtVbAeDkAvve0iM2QozVD9hfjhp4YP/UrkJYDbD2AtBxgfSkAvvHEeNcDSAsilgtAWxIy91J8AXgZAJ5e33+4tuACcAG4AFwALgBXRXQB6AFcB5MXAuA6nl9/0Vx/011/1V5/1/dfTPJvRtdnu/zL6beeFO/7r+fXBYbrEkt/j+i6ytXfpuvvE/ZXOnsA/a3a/l5xf7O6v1t+Xe/vOyz6HpO8yyboM8o7rfJes77bru83THk48p7TvOs27zvOO6/73vO++z7l4cgnMPQzKPopHC0N9noSSz6LJp/Gk88jyicy5TOp6qlc+VyyfDJbPpuuns6XzyfMJzTmMyrrKZ35nNJ8Ums+q7af1tvPK+4nNodEnPKp3fnc8npyez67/qVP7+/fL8hfcMjfsOhf8cjfMclfcnn9+BkOnLECP8Q58OYeyJ40eoyF6Ee/En/JHlP6mIlRVXprF4BxtAvArV0AxtEuALd2ARhHuwDc2gVgHPX/hFv9fMBddjIGeKg/WCxlCsI46u+Ga5mCcJd+sIG9UkGAW32ZbApFAHhod4Bb3eo04h3god0BbiUHYApVCNjbHeBW+QDAXT4a7qg7r7e214057vg0QhkEHkoSwq0kIdydXw4/Q3H8hjYJ3vL0WConBJhCHQaOToeBrU0BljYFmEoVgHGUKgAPnREAt84IgLuqFgAYSUEOAHszDwuAtSkHAZhLGYIpdCLgKGUIHtocZG1zkLmUIRhxDnJU1RDA1uYga5uDzKUOwhTnIEfnxcDe5iBrcyQAYGlzkKkUYhhxDrKXQgxbSwLWUohhbknA1JKAEZOAvSUBW0sC1pYEzC0JmFoSMMJyCDhaFrK3JGDtyiFgaVnI3LKQqWUhI2YhR8tC9paFrC0LWVoWMrcsZGpZyIhZyNGykL2rSIGtlQHWVgZYWhlgbmWAqZUBRiwDHK0MsLcywNbKAGsOoNUhllaHmFsdYmp1iBHrEEerQ+w5gFYI2VodYm11iKXVIeYcQCuETK0QMmIh5MgBtELI3gohWyuErDmAVolZWiFkzgG0SszUKjGjfj6gVmKOVonZcwCtFbB9HQC+ozWDbz1bvGu9iKW1AuYcQOtFTLEX1GbIaFegN0OOHEBrhuw5gNYM2XIArRuz5gDacoB3bTnAEktxXQ4wfw0AvveM8b4tiJjSJOwLIsbXsAKeNeKCiOO3D+AVbUl0AfjGs8ZPbUnIdgFoa1LWC0BblfMuB9AeC1j6gqQE0J9LmC8AOYD2ZMb7i4bt2ZTpWoHfPoB7Tj2fXzT8N1X41vkq/QHOAAAAAElFTkSuQmCC',
    name: users?.fullName,
    gender: users?.gender,
    dateOfBirth: users?.DOB,
    // mobileNumber: users?.contactNumber1,
    email: users?.emailID,
  });

  const uploadImage = () => {
    let options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      // if (response.didCancel) {
      //   setToastMsg('Cancelled image selection')
      // } else if (response.errorCode == 'permission') {
      //   setToastMsg('permission not satidfied')
      // } else if (response.errorCode == 'others') {
      //   setToastMsg(response.errorMessage);
      // } else if (response.assets[0].filesSize > 2097152) {
      //   Alert.alert('maximum size', [{ text: 'ok' }],
      //   );
      // } else {
      setFormData(prev => ({
        ...prev,
        Pic: response.assets[0].base64,
      }));
      // }
    });
  };

  const handleSubmit = async () => {
    try {
      const userID = await AsyncStorage.getItem('UserID');

      if (!userID) {
        Alert.alert('Error', 'UserID not found. Please login again.');
        return;
      }

      if (!isValidDate(formData.dateOfBirth)) {
        Alert.alert(
          'Invalid Date of Birth',
          'Please enter a valid date in YYYY-MM-DD format.',
        );
        return;
      }
      const payload = {
        ...jobSeekerData,
        userID,
        Pic: formData.Pic,
        fullName: formData.name,
        gender: formData.gender,
        // DOB: '2025-03-03',
        DOB: formData.dateOfBirth,
        contactNumber1: formData.mobileNumber,
        emailID: formData.email,
      };

      const response = await fetch(
        `https://jobipo.com/api/v2/update-job-profile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const res = await response.json();

      if (res?.type === 'success') {
        showToastMessage('Personal Details Updated Successfully', 'success');
        navigation.goBack();
      } else {
        Alert.alert('Update Failed', res?.message || 'Something went wrong.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update personal details');
    }
  };

  const formatDateInput = text => {
    // Remove non-numeric characters
    const cleaned = text.replace(/[^\d]/g, '');

    let formatted = cleaned;

    if (cleaned.length > 4 && cleaned.length <= 6) {
      formatted = cleaned.slice(0, 4) + '-' + cleaned.slice(4);
    } else if (cleaned.length > 6) {
      formatted =
        cleaned.slice(0, 4) +
        '-' +
        cleaned.slice(4, 6) +
        '-' +
        cleaned.slice(6, 8);
    }

    return formatted;
  };

  const isValidDate = dateStr => {
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!dateRegex.test(dateStr)) return false;

    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      date <= today
    );
  };

  return (
    <>
      <JobHeader />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.jobDetails}>
            {/* <View style={styles.profile}>
              <View style={styles.centerContent}>
                <TouchableHighlight onPress={() => uploadImage()}
                  underlayColor="rgba(0,0,0,0)">
                  <View style={styles.button}>
                    <Avatar.Image
                      size={130}
                      source={{ uri: 'data:image/png;base64,' + formData?.Pic }}
                    />
                  </View>
                </TouchableHighlight>
              </View>
            </View> */}

            {/* <View style={styles.fieldContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) =>
                  setFormData((prevData) => ({ ...prevData, name: value }))
                }
               editable={!formData.name}
              />
            </View> */}

            {/* <View style={styles.fieldContainer}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.gender}
                  onValueChange={(value) =>
                    setFormData((prevData) => ({ ...prevData, gender: value }))
                  }
                  style={{ color: textColor }}
                >
                  <Picker.Item label="Select gender" value="" />
                  <Picker.Item label="Male" value="1" />
                  <Picker.Item label="Female" value="2" />
                  <Picker.Item label="Other" value="3" />
                </Picker>
              </View>
            </View> */}

            {/* <View style={styles.fieldContainer}>
              <Text style={styles.label}>Date of Birth</Text>

              <DateTimePicker
                style={[styles.input, { color: textColor }]}
                placeholder="Select Date of Birth"
                value={formData.dateOfBirth}
                setValue={(value) => {
                  setFormData((prevData) => ({ ...prevData, dateOfBirth: value }))
                }}
              />
            </View> */}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, {color: textColor}]}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={value =>
                  setFormData(prevData => ({...prevData, email: value}))
                }
                editable={!formData.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                style={[styles.input, {color: textColor}]}
                placeholder="YYYY-MM-DD"
                value={formData.dateOfBirth}
                onChangeText={value => {
                  const formatted = formatDateInput(value);
                  setFormData(prevData => ({
                    ...prevData,
                    dateOfBirth: formatted,
                  }));
                }}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <Text style={styles.label}>Gender</Text>
            <View style={styles.radioGroup}>
              {[
                {label: 'Male', value: '1'},
                {label: 'Female', value: '2'},
                {label: 'Other', value: '3'},
              ].map(option => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.radioBtn,
                    formData.gender === option.value && styles.radioBtnActive,
                  ]}
                  onPress={() =>
                    setFormData({...formData, gender: option.value})
                  }>
                  <Text
                    style={[
                      styles.radioBtnText,
                      formData.gender === option.value &&
                        styles.radioBtnTextActive,
                    ]}>
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* <View style={styles.fieldContainer}>
              <Text style={styles.label}>Date of Birth</Text>

              <DateTimePicker
                style={[styles.input, { color: textColor }]}
                placeholder="Select Date of Birth"
                value={formData.dateOfBirth}
                setValue={(value) => {
                  setFormData((prevData) => ({ ...prevData, dateOfBirth: value }))
                }}
              />
            </View> */}

            {/* <View style={styles.fieldContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your mobile number"
                keyboardType="numeric"
                value={formData.mobileNumber}
                onChangeText={(value) =>
                  setFormData((prevData) => ({ ...prevData, mobileNumber: value }))
                }
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(value) =>
                  setFormData((prevData) => ({ ...prevData, email: value }))
                }
              />
            </View> */}
          </View>
        </View>
      </ScrollView>
      <View style={styles.saveDetails}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ebf0fa',
  },
  container: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  fieldContainer: {
    marginBottom: 20,
  },

  profile: {
    marginBottom: 40,
  },

  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#0c6951',
    padding: 15,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },

  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 10,
    marginTop: 8,
  },

  radioBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f8ff',
  },

  radioBtnActive: {
    backgroundColor: '#0d4574',
    borderColor: '#0d4574',
  },

  radioBtnText: {
    color: '#333',
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  radioBtnTextActive: {
    color: '#fff',
  },
  jobDetails: {
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingVertical: 13,
  },
  saveDetails: {
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingVertical: 15,
  },
});

export default AddPersonalDetails;
