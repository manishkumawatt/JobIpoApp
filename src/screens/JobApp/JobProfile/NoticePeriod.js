import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import JobHeader from '../../../components/Job/JobHeader';

const NoticePeriod = () => {
  const [noticePeriod, setNoticePeriod] = useState('');

  const handleSave = () => {
    if (!noticePeriod) {
      Alert.alert('Error', 'Please select a notice period.');
      return;
    }

    const formData = {
      noticePeriod: noticePeriod,
    };

    Alert.alert('Success', 'Notice Period saved successfully!');
  };

  return (
    <>
      <JobHeader />
      <ScrollView style={styles.ScrollViewcontainer}>
        <View style={styles.container}>
          <Text style={styles.heading}>Select Notice Period</Text>
          <View style={styles.jobDetails}>
            <View style={styles.buttonGroup}>
              {[
                'No Notice Period',
                'Less than 15 days',
                '1 month',
                '2 months',
                '3 or more month',
              ].map(period => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.button,
                    noticePeriod === period && styles.buttonSelected,
                  ]}
                  onPress={() => setNoticePeriod(period)}>
                  <Text
                    style={[
                      styles.buttonText,
                      noticePeriod === period && styles.buttonTextSelected,
                    ]}>
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
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
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    // marginBottom: 16,
  },

  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 9,
  },
  button: {
    //   minWidth: "45%",
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 7,
    paddingHorizontal: 17,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginLeft: 9,
    marginBottom: 10,
  },
  buttonText: {color: '#333'},
  buttonTextSelected: {color: '#fff'},
  buttonSelected: {backgroundColor: '#0d4574'},

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

export default NoticePeriod;
