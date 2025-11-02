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

const TotalExp = ({navigation, route}) => {
  const jobSeekerData = route.params;
  const [years, setYears] = useState('');
  const [months, setMonths] = useState('');

  const handleSave = async () => {
    // Validate input
    if (!years || !months) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    await fetch(`https://jobipo.com/api/Agent/doupdatejobp`, {
      method: 'POST',
      body: JSON.stringify({
        ...jobSeekerData,
        totalExperience: String(parseInt(years) * 12 + parseInt(months)),
      }),
    })
      .then(res => res.json())
      .then(res => {
        if (res) {
          navigation.goBack();
          Alert.alert('Changes Saved Successfully');
        }
      })
      .catch(err => {
        Alert.alert('Error updating experience');
      });
  };

  return (
    <>
      <JobHeader />
      <ScrollView style={styles.ScrollViewcontainer}>
        <View style={styles.container}>
          <Text style={styles.heading}>Total Years of Experience</Text>
          <View style={styles.jobDetails}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Years</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Years"
                  keyboardType="numeric"
                  value={years}
                  onChangeText={setYears}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Months</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Months"
                  keyboardType="numeric"
                  value={months}
                  onChangeText={setMonths}
                />
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
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  inputContainer: {
    width: '47%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
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

export default TotalExp;
