import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Button, RadioButton} from 'react-native-paper';
import JobHeader from '../../../components/Job/JobHeader';
import JobMenu from '../../../components/Job/JobMenu';
import {useColorScheme} from 'react-native';
import {KeyboardScroll} from '../../../component';

export default function AddEducation() {
  const [educationLevel, setEducationLevel] = useState('Post Graduate');
  const [collegeName, setCollegeName] = useState('');
  const [degree, setDegree] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [educationType, setEducationType] = useState('Full-time');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#000' : '#000';
  const isDarkMode = useColorScheme() === 'dark';

  //   const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  //   const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  //   const handleConfirmStartDate = (date) => {
  //     setStartDate(date.toDateString());
  //     setStartDatePickerVisibility(false);
  //   };

  //   const handleConfirmEndDate = (date) => {
  //     setEndDate(date.toDateString());
  //     setEndDatePickerVisibility(false);
  //   };
  useEffect(() => {
    if (Platform.OS === 'android') {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          // Optional: Add any specific behavior when keyboard shows
        },
      );
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          // Optional: Add any specific behavior when keyboard hides
        },
      );

      return () => {
        keyboardDidShowListener?.remove();
        keyboardDidHideListener?.remove();
      };
    }
  }, []);
  const handleSubmit = () => {
    const formData = {
      educationLevel,
      collegeName,
      degree,
      specialization,
      educationType,
      startDate,
      endDate,
    };

    // // console.log('AddEducation', JSON.stringify(formData, null, 2));
  };
  return (
    <>
      <JobHeader />
      <KeyboardScroll
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}>
        <View style={styles.container}>
          <Text style={styles.label}>Level of Education</Text>
          <View style={styles.buttonGroup}>
            {['Diploma', 'ITI', 'Graduate', 'Post Graduate'].map(level => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.button,
                  educationLevel === level && styles.buttonSelected,
                ]}
                onPress={() => setEducationLevel(level)}>
                <Text
                  style={[
                    styles.buttonText,
                    educationLevel === level && styles.buttonTextSelected,
                  ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Institute Name</Text>
          <TextInput
            placeholder="Enter institute name"
            placeholderTextColor={isDarkMode ? '#555' : '#555'}
            style={styles.input}
            value={collegeName}
            onChangeText={setCollegeName}
          />

          <Text style={styles.labelPiker}>Degree</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={degree}
              onValueChange={itemValue => setDegree(itemValue)}
              style={[styles.picker, {color: textColor}]}>
              <Picker.Item label="Select Degree" value="" />
              <Picker.Item label="B.A." value="B.A." />
              <Picker.Item label="B.Sc." value="B.Sc." />
              <Picker.Item label="B.Com." value="B.Com." />
              <Picker.Item label="BBA" value="BBA" />
              <Picker.Item label="BCA" value="BCA" />
              <Picker.Item label="B.Tech" value="B.Tech" />
              <Picker.Item label="B.E." value="B.E." />
              <Picker.Item label="LLB" value="LLB" />
              <Picker.Item label="B.Ed." value="B.Ed." />
              <Picker.Item label="BFA" value="BFA" />
              <Picker.Item label="BPT" value="BPT" />
              <Picker.Item label="BHM" value="BHM" />

              {/* Postgraduate (PG) Degrees */}
              <Picker.Item label="M.A." value="M.A." />
              <Picker.Item label="M.Sc." value="M.Sc." />
              <Picker.Item label="M.Com." value="M.Com." />
              <Picker.Item label="MBA" value="MBA" />
              <Picker.Item label="MCA" value="MCA" />
              <Picker.Item label="M.Tech" value="M.Tech" />
              <Picker.Item label="M.E." value="M.E." />
              <Picker.Item label="LLM" value="LLM" />
              <Picker.Item label="M.Ed." value="M.Ed." />
              <Picker.Item label="MPA" value="MPA" />
              <Picker.Item label="MFA" value="MFA" />

              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          {/* <Text style={styles.labelPiker}>Specialisation</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={specialization}
            onValueChange={(itemValue) => setSpecialization(itemValue)} 
            style={[styles.picker, { color: textColor }]}
          >
          <Picker.Item label="Select Specialisation" value="" />    
            <Picker.Item label="Computer Science" value="Computer Science" />
            <Picker.Item label="Electronics" value="Electronics" />
            <Picker.Item label="Mechanical" value="Mechanical" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View> */}

          <Text style={styles.label}>Education Type</Text>
          <RadioButton.Group
            onValueChange={newValue => setEducationType(newValue)}
            value={educationType}>
            <View style={styles.radioGroup}>
              {['Full-time', 'Part-time', 'Correspondence'].map(type => (
                <View key={type} style={styles.radioOption}>
                  <RadioButton
                    value={type}
                    color="#0d4574"
                    uncheckedColor="#0d4574"
                  />
                  <Text>{type}</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group>

          <Text style={styles.label}>Start Date</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Start Date (YYYY-MM-DD)"
            placeholderTextColor={isDarkMode ? '#555' : '#555'}
            value={startDate}
            onChangeText={setStartDate}
          />

          <Text style={styles.label}>End Date</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter End Date (YYYY-MM-DD)"
            value={endDate}
            onChangeText={setEndDate}
          />
          {/* Start Date */}
          {/* <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity onPress={() => setStartDatePickerVisibility(true)}>
        <Text style={styles.dateInput}>{startDate || "Select Start Date"}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmStartDate}
        onCancel={() => setStartDatePickerVisibility(false)}
      /> */}

          {/* End Date */}
          {/* <Text style={styles.label}>End Date</Text>
      <TouchableOpacity onPress={() => setEndDatePickerVisibility(true)}>
        <Text style={styles.dateInput}>{endDate || "Select End Date"}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmEndDate}
        onCancel={() => setEndDatePickerVisibility(false)}
      /> */}
        </View>
      </KeyboardScroll>
      <View style={styles.SaveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      {/* <JobMenu/> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {padding: 20, backgroundColor: '#fff', flex: 1},
  labelPiker: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 1,
  },
  label: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    marginTop: 23,
    marginBottom: 8,
  },

  input: {borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10},
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  picker: {height: 50, backgroundColor: '#fff'},
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: "start",
  },
  button: {
    //   minWidth: "45%",
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 17,
    borderRadius: 19,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  buttonSelected: {backgroundColor: '#0d4574'},
  buttonText: {color: '#333'},
  buttonTextSelected: {color: '#fff'},
  radioGroup: {flexDirection: 'row', justifyContent: 'space-around'},
  radioOption: {flexDirection: 'row', alignItems: 'center'},
  dateInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#333',
  },
  //   saveButton: { marginVertical: 20, backgroundColor: "#0d4574" },
  SaveContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    marginVertical: 20,
    backgroundColor: '#0c6951',
    borderRadius: 10,
  },
  saveButtonText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    padding: 8,
  },
});
