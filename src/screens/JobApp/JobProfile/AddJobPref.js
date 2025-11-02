import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Picker } from "@react-native-picker/picker";

import Icon from 'react-native-vector-icons/MaterialIcons';
import JobHeader from '../../../components/Job/JobHeader';

const AddJobPref = ({navigation, route }) => {
  const jobSeekerData = route.params;
  const [formData, setFormData] = useState({
    jobCategories: '',
    jobType: [],
    shiftPreferences: [],
    expectedSalary: '',
    employmentType: [],
    workPlace: [],
    expectedSalary: '',

  });

  const toggleSelection = (field, value) => {
    setFormData((prevData) => {
      const isSelected = prevData[field].includes(value);
      const updatedField = isSelected
        ? prevData[field].filter((item) => item !== value)
        : [...prevData[field], value];
      return {
        ...prevData,
        [field]: updatedField,
      };
    });
  };

  const handleSubmit = async () => {
    await fetch(`https://jobipo.com/api/Agent/doupdatejobp`, {
      method: 'POST',
      body: JSON.stringify({
        ...jobSeekerData,
        preferredJobCategory: formData.jobCategories,
        preferredJobType: JSON.stringify(formData.jobType),
        preferredEmployementType: JSON.stringify(formData.employmentType),
      })
    }).then(res => res.json()).then(res => {
      if (res) {
        navigation.goBack();
        Alert.alert('Your job preferences have been updated successfully!');
      }
    }).catch(err => {
      Alert.alert('Something went wrong. Please try again later.');
    })
  };

  return (
    <>
      <JobHeader />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Preferred Job Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.jobCategories}
                onValueChange={(value) =>
                  setFormData((prevData) => ({ ...prevData, jobCategories: value }))
                }
              >
                <Picker.Item label="Select a category" value="" />
                <Picker.Item label="Sales" value="Sales" />
                <Picker.Item label="Marketing" value="Marketing" />
                <Picker.Item label="IT" value="IT" />
                <Picker.Item label="Delivery" value="Delivery" />
                <Picker.Item label="Office Jobs" value="Office Jobs" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Preferred Job Type</Text>
            <View style={styles.jobDetails}>

              {['Full-Time', 'Part-Time'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.checkboxContainer}
                  onPress={() => toggleSelection('jobType', type)}
                >
                  <Text style={styles.checkboxLabel}>{type}</Text>
                  <Icon
                    name={formData.jobType.includes(type) ? 'check-box' : 'check-box-outline-blank'}
                    size={24}
                    color="#0c6951"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* <View style={styles.fieldContainer}>
            <Text style={styles.label}>Preferred Shift</Text>
            <View style={styles.jobDetails}>

              {['Day Shift', 'Night Shift', 'Rotational'].map((shift) => (
                <TouchableOpacity
                  key={shift}
                  style={styles.checkboxContainer}
                  onPress={() => toggleSelection('shiftPreferences', shift)}
                >
                  <Text style={styles.checkboxLabel}>{shift}</Text>
                  <Icon
                    name={formData.shiftPreferences.includes(shift) ? 'check-box' : 'check-box-outline-blank'}
                    size={24}
                    color="#0c6951"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View> */}

          {/* <View style={styles.fieldContainer}>
            <Text style={styles.label}>Preferred Workplace </Text>
            <View style={styles.jobDetails}>

              {['Work From Home', 'Work From Office'].map((place) => (
                <TouchableOpacity
                  key={place}
                  style={styles.checkboxContainer}
                  onPress={() => toggleSelection('workPlace', place)}
                >
                  <Text style={styles.checkboxLabel}>{place}</Text>
                  <Icon
                    name={formData.workPlace.includes(place) ? 'check-box' : 'check-box-outline-blank'}
                    size={24}
                    color="#0c6951"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View> */}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Preferred Employment Type</Text>
            <View style={styles.jobDetails}>

              {['Permanent', 'Contractual', 'Freelance'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.checkboxContainer}
                  onPress={() => toggleSelection('employmentType', type)}
                >
                  <Text style={styles.checkboxLabel}>{type}</Text>
                  <Icon
                    name={formData.employmentType.includes(type) ? 'check-box' : 'check-box-outline-blank'}
                    size={24}
                    color="#0c6951"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* <View style={styles.fieldContainer}>
            <Text style={styles.label}>Expected Salary (Monthly)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your expected salary"
              keyboardType="numeric"
              value={formData.expectedSalary}
              onChangeText={(value) =>
                setFormData((prevData) => ({ ...prevData, expectedSalary: value }))
              }
            />
          </View> */}


        </View>
      </ScrollView>

      <View style={styles.SubmitDetails}>
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
    padding: 20,
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
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
    fontWeight: '700',

  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000',
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
  jobDetails: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingBottom: 9,

  },
  SubmitDetails: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
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
});

export default AddJobPref;
