import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Keyboard,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Button, RadioButton} from 'react-native-paper';
import JobHeader from '../../../components/Job/JobHeader';
import DateTimePicker from '../../../components/DateTimePicker';
import {useColorScheme} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {useFocusEffect} from '@react-navigation/native';
import SimpleHeader from '../../../components/SimpleHeader';
import {KeyboardScroll} from '../../../component';
import {showToastMessage} from '../../../utils/Toast';

export default function EditEducation({navigation, route}) {
  const {jobSeekerData, data, index = null} = route.params;

  useFocusEffect(
    useCallback(() => {
      if (Array.isArray(data) && index != null && index < data.length) {
        setEducationData(data[index]);
      } else if (data && typeof data === 'object') {
        setEducationData(data);
      } else {
      }
    }, [data, index]),
  );

  const fetchedData = {
    educationLevel: '',
    collegeName: '',
    degree: '',
    specialization: '',
    educationType: '',
    startDate: '',
    endDate: '',

    // new
    yearOfCompletion: '',
  };

  // const [educationData, setEducationData] = useState(data | fetchedData);
  const [educationData, setEducationData] = useState(
    data ||
      fetchedData || {
        educationLevel: '',
        collegeName: '',
        degree: '',
        yearOfCompletion: '',
      },
  );

  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#000' : '#000';
  const isDarkMode = useColorScheme() === 'dark';
  const [openYear, setOpenYear] = useState(false);

  function parseIfArrayString(value) {
    if (value === '') {
      return [];
    }

    if (
      typeof value === 'string' &&
      value.trim().startsWith('[') &&
      value.trim().endsWith(']')
    ) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (err) {
        // console.warn('Invalid JSON array string:', value);
      }
    }

    return value;
  }

  const graduationDegrees = [
    {label: 'B.A.', value: 'B.A.'},
    {label: 'B.Sc.', value: 'B.Sc.'},
    {label: 'B.Com.', value: 'B.Com.'},
    {label: 'BBA', value: 'BBA'},
    {label: 'BCA', value: 'BCA'},
    {label: 'B.Tech', value: 'B.Tech'},
    {label: 'B.E.', value: 'B.E.'},
    {label: 'LLB', value: 'LLB'},
    {label: 'B.Ed.', value: 'B.Ed.'},
    {label: 'BFA', value: 'BFA'},
    {label: 'BPT', value: 'BPT'},
    {label: 'BHM', value: 'BHM'},
    {label: 'Other', value: 'Other'},
  ];

  const postGraduationDegrees = [
    {label: 'M.A.', value: 'M.A.'},
    {label: 'M.Sc.', value: 'M.Sc.'},
    {label: 'M.Com.', value: 'M.Com.'},
    {label: 'MBA', value: 'MBA'},
    {label: 'MCA', value: 'MCA'},
    {label: 'M.Tech', value: 'M.Tech'},
    {label: 'M.E.', value: 'M.E.'},
    {label: 'LLM', value: 'LLM'},
    {label: 'M.Ed.', value: 'M.Ed.'},
    {label: 'MPA', value: 'MPA'},
    {label: 'MFA', value: 'MFA'},
    {label: 'Other', value: 'Other'},
  ];

  const showDegreePicker = ['Graduate', 'Post Graduate'].includes(
    educationData.educationLevel,
  );

  const degreeOptions =
    educationData.educationLevel === 'Graduate'
      ? graduationDegrees
      : educationData.educationLevel === 'Post Graduate'
        ? postGraduationDegrees
        : [];
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
  const handleSubmit = async () => {
    if (
      educationData.educationLevel === '' ||
      educationData.collegeName === '' ||
      // educationData.degree === '' ||
      educationData.yearOfCompletion === ''
    ) {
      showToastMessage('Please fill all the fields', 'danger');
      return;
    }
    const raw =
      jobSeekerData && jobSeekerData.education
        ? parseIfArrayString(jobSeekerData.education)
        : [];
    const educationArray = Array.isArray(raw) ? raw : [];

    const hasValidIndex =
      index !== null && index !== undefined && !Number.isNaN(Number(index));
    const updatedEducationData = hasValidIndex
      ? educationArray.length > 0
        ? educationArray.map((item, id) =>
            id === Number(index) ? educationData : item,
          )
        : [educationData]
      : [...educationArray, educationData];

    const payload = {
      ...jobSeekerData,
      education: JSON.stringify(updatedEducationData),
    };

    try {
      const response = await fetch(
        `https://jobipo.com/api/Agent/doupdatejobp`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
      );
      const res = await response.json();
      if (res) {
        showToastMessage('Details updated successfully', 'success');
        navigation.goBack();
      }
    } catch (err) {
      showToastMessage('Error updating details');
    }
  };

  return (
    <>
      <SimpleHeader title="Add Education" titleColor="#585858" />
      <KeyboardScroll
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}>
        <View style={styles.container}>
          <Text style={styles.label}>Qualification</Text>
          <View style={styles.buttonGroup}>
            {[
              ' 10th Below',
              '10th',
              '12th',
              'Graduate',
              'Post Graduate',
              'ITI',
              'DIPLOMA',
            ].map(level => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.button,
                  educationData.educationLevel === level &&
                    styles.buttonSelected,
                ]}
                onPress={() =>
                  setEducationData({...educationData, educationLevel: level})
                }>
                <Text
                  style={[
                    styles.buttonText,
                    educationData.educationLevel === level &&
                      styles.buttonTextSelected,
                  ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* <Text style={styles.labelPicker}>Course Name</Text>
          <View style={styles.pickerWrapper}> 
            <Picker
              selectedValue={educationData.degree}
              onValueChange={(itemValue) =>
                setEducationData({ ...educationData, degree: itemValue })
              }
            style={[styles.picker, { color: textColor }]}
            >
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
          </View> */}
          {showDegreePicker ? (
            <View>
              <Text style={styles.labelPicker}>Course Name</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  enabled={showDegreePicker}
                  selectedValue={showDegreePicker ? educationData.degree : ''}
                  onValueChange={itemValue => {
                    if (showDegreePicker) {
                      setEducationData({...educationData, degree: itemValue});
                    }
                  }}
                  style={[styles.picker, {color: textColor}]}>
                  <Picker.Item label="Select Degree" value="" />
                  {degreeOptions.map(deg => (
                    <Picker.Item
                      key={deg.value}
                      label={deg.label}
                      value={deg.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          ) : (
            <View style={{height: 20}} />
          )}

          {/* <Text style={styles.label}>Year of Completion</Text>
                  <DropDownPicker
                  open={openYear}
                  value={educationData.yearOfCompletion}
                  items={[...Array(60)].map((_, i) => {
                    const year = `${new Date().getFullYear() - i}`; 
                    return { label: year, value: year };
                  })}
                  setOpen={setOpenYear}
                  setValue={(callback) =>
                    setEducationData((prev) => ({
                      ...prev,
                      yearOfCompletion: callback(prev.yearOfCompletion),
                    }))
                  }
                  placeholder="Select Year of Completion"
                  searchable={true}
                  /> */}
          <Text style={styles.label}>Year of Completion</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Year of Completion"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={4}
            value={educationData.yearOfCompletion}
            onChangeText={text =>
              setEducationData(prev => ({
                ...prev,
                yearOfCompletion: text,
              }))
            }
          />

          <Text style={styles.label}>Institute Name</Text>
          <TextInput
            placeholder="e.g. Sage College"
            placeholderTextColor={isDarkMode ? '#555' : '#555'}
            style={styles.input}
            value={educationData.collegeName}
            onChangeText={text =>
              setEducationData({...educationData, collegeName: text})
            }
          />

          {/* <Text style={styles.labelPicker}>Specialization</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={educationData.specialization}
              onValueChange={(itemValue) =>
                setEducationData({ ...educationData, specialization: itemValue })
              }
              style={[styles.picker, { color: textColor }]}
              >
              <Picker.Item label="Select Specialization" value="" />
              <Picker.Item label="Computer Science" value="Computer Science" />
              <Picker.Item label="Electronics" value="Electronics" />
              <Picker.Item label="Mechanical" value="Mechanical" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View> */}

          {/* <Text style={styles.label}>Education Type</Text>
          <RadioButton.Group
            onValueChange={(newValue) =>
              setEducationData({ ...educationData, educationType: newValue })
            }
            value={educationData.educationType}
          >
            <View style={styles.radioGroup}>
              {["Full-time", "Part-time", "Correspondence"].map((type) => (
                <View key={type} style={styles.radioOption}>
                  <RadioButton value={type} color="#0d4574" />
                  <Text>{type}</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group> */}

          {/* <Text style={styles.label}>Start Date</Text>
          <DateTimePicker
            style={styles.input}
            value={educationData.startDate}
            setValue={
              (date) => setEducationData({ ...educationData, startDate: date })
            }
            placeholder="Select Start Date"
          /> */}
          {/* <TextInput
            style={styles.input}
            placeholder="Enter Start Date (YYYY-MM-DD)"
            value={educationData.startDate}
            onChangeText={(text) =>
              setEducationData({ ...educationData, startDate: text })
            }
          /> */}

          {/* <Text style={styles.label}>End Date</Text>
          <DateTimePicker
            style={styles.input}
            value={educationData.endDate}
            setValue={
              (date) => setEducationData({ ...educationData, endDate: date })
            }
            placeholder="Select End Date"
          /> */}
          {/* <TextInput
            style={styles.input}
            placeholder="Enter End Date (YYYY-MM-DD)"
            value={educationData.endDate}
            onChangeText={(text) =>
              setEducationData({ ...educationData, endDate: text })
            }
          /> */}
          <View style={styles.saveContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardScroll>
    </>
  );
}

const styles = StyleSheet.create({
  container: {padding: 20, backgroundColor: '#F5F4FD', flex: 1},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  labelPicker: {
    fontSize: 15,
    color: '#535353',
    fontWeight: '500',
    marginTop: 15,
    marginBottom: 1,
  },
  label: {
    fontSize: 14,
    color: '#535353',
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 8,
  },
  input: {backgroundColor: '#ffffff', borderRadius: 8, padding: 10},
  pickerWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    height: 43,
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    marginTop: 10,
  },
  picker: {height: 50, backgroundColor: '#fff'},
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: "start",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 17,
    borderRadius: 19,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    margin: 4,
  },
  buttonSelected: {backgroundColor: '#FF8D53'},
  buttonText: {color: '#535353', fontWeight: '400'},
  buttonTextSelected: {color: '#fff'},
  radioGroup: {flexDirection: 'row', justifyContent: 'space-around'},
  radioOption: {flexDirection: 'row', alignItems: 'center'},
  saveContainer: {justifyContent: 'center', alignItems: 'center'},
  saveButton: {
    marginVertical: 20,
    backgroundColor: '#FF8D53',
    borderRadius: 25,
    width: '60%',
  },
  saveButtonText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    padding: 8,
  },
});
