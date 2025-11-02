import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import JobHeader from '../../../components/Job/JobHeader';

const CurrentSal = () => {
  const [salary, setSalary] = useState('');

  // Function to format salary with commas
  const formatSalary = value => {
    const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
  };

  const handleSalaryChange = value => {
    setSalary(formatSalary(value)); // Update salary state with formatted value
  };

  const handleSave = () => {
    if (!salary) {
      Alert.alert('Error', 'Please fill in the salary field.');
      return;
    }

    // Remove commas before parsing to a number
    const numericSalary = parseFloat(salary.replace(/,/g, ''));

    const formData = {
      salary: numericSalary,
    };

    Alert.alert('Success', 'Current Monthly Salary saved successfully!');
  };

  return (
    <>
      <JobHeader />
      <ScrollView style={styles.ScrollViewcontainer}>
        <View style={styles.container}>
          <View style={styles.jobDetails}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Current Monthly Salary</Text>

                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Current Monthly Salary"
                    keyboardType="numeric"
                    value={salary}
                    onChangeText={handleSalaryChange} // Use the formatting function
                  />
                  <Text style={styles.rupeeSymbol}>₹</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.SaveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ebf0fa',
  },
  ScrollViewcontainer: {
    flex: 1,
    backgroundColor: '#ebf0fa',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  inputContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 30,
    backgroundColor: '#fff',
    color: '#333',
  },
  rupeeSymbol: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{translateY: -12}],
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#2d8659',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  SaveContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  jobDetails: {
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
});

export default CurrentSal;
