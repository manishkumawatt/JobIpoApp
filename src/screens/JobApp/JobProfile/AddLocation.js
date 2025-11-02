import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import JobHeader from '../../../components/Job/JobHeader';
import GooglePlacesInput from '../../../components/GooglePlacesInput';
import {useColorScheme} from 'react-native';
import {showToastMessage} from '../../../utils/Toast';

const AddLocation = ({navigation, route}) => {
  const jobSeekerData = route.params;
  const [formData, setFormData] = useState({
    currentLocation: jobSeekerData?.currentLocation || '',
    hometownLocation: jobSeekerData?.homeTown || '',
    preferredLocations: jobSeekerData?.preferredLocation || '',
    pllat: jobSeekerData?.pllat || '',
    pllng: jobSeekerData?.pllng || '',
    cllat: jobSeekerData?.cllat || '',
    cllng: jobSeekerData?.cllng || '',
  });

  const [newPreferredLocation, setNewPreferredLocation] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const handleAddPreferredLocation = () => {
    if (formData.preferredLocations?.length > 1) {
      Alert.alert('You can only add 1 preferred locations');
      return;
    }

    if (
      newPreferredLocation.trim() !== '' &&
      !formData.preferredLocations.includes(newPreferredLocation.trim())
    ) {
      setFormData(prevData => ({
        ...prevData,
        preferredLocations: [
          ...prevData.preferredLocations,
          newPreferredLocation.trim(),
        ],
      }));
      setNewPreferredLocation('');
    }
  };

  const handleRemovePreferredLocation = index => {
    const updatedPreferredLocations = formData.preferredLocations.filter(
      (_, i) => i !== index,
    );
    setFormData(prevData => ({
      ...prevData,
      preferredLocations: updatedPreferredLocations,
    }));
  };

  const handleSubmit = async () => {
    await fetch(`https://jobipo.com/api/Agent/doupdatejobp`, {
      method: 'POST',
      body: JSON.stringify({
        ...jobSeekerData,
        preferredLocation: formData.preferredLocations,
        pllat: formData.pllat,
        pllng: formData.pllng,
        currentLocation: formData.currentLocation,
        cllat: formData.cllat,
        cllng: formData.cllng,
        homeTown: formData.hometownLocation,
      }),
    })
      .then(res => res.json())
      .then(res => {
        if (res) {
          navigation.goBack();
          showToastMessage('Location Details Updated Successfully');
        }
      })
      .catch(err => {
        Alert.alert('Error updating details');
      });
  };

  // City
  // Latitude
  // Longitude

  return (
    <>
      <JobHeader />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.head}>Preferred Job City</Text>
          <Text style={styles.subhead}>
            Jobs are shown based on your preferred city
          </Text>

          <View style={styles.ContainerDetails}>
            <Text style={styles.label}>Preferred Location</Text>

            {formData.preferredLocations !== '' && (
              <Text
                style={{
                  marginBottom: 10,
                }}>
                {formData.preferredLocations}
              </Text>
            )}

            <GooglePlacesInput
              value={formData.preferredLocations}
              setValue={val => {
                setFormData({
                  ...formData,
                  preferredLocations: val.Locality,
                  pllat: val.lat,
                  pllng: val.lng,
                });
              }}
            />
            {/* <TextInput
              style={styles.input}
              placeholder="Enter your preferred location"
              value={formData.preferredLocations}
              onChangeText={(value) => setFormData({ ...formData, preferredLocations: value })}
            /> */}
          </View>

          {/* <View style={styles.ContainerDetails}>
            <Text style={styles.label}>Preferred Locations</Text>
            <View style={styles.preferredLocationContainer}>
              <TextInput
                style={styles.preferredInput}
                placeholder="Enter preferred location"
                value={newPreferredLocation}
                onChangeText={setNewPreferredLocation}
              />
              <TouchableOpacity
                style={styles.preferredAddButton}
                onPress={handleAddPreferredLocation}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.locationsContainer}>
              {formData.preferredLocations.map((location, index) => (
                <View key={index} style={styles.locationChip}>
                  <Text style={styles.locationText}>{location}</Text>
                  <TouchableOpacity onPress={() => handleRemovePreferredLocation(index)}>
                    <Icon name="close" size={17} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View> */}

          {/* <Text style={styles.head}>Current Location</Text>
          <Text style={styles.subhead}>This is where you are currently living</Text> */}

          <View style={styles.ContainerDetails}>
            <Text style={styles.label}>Current Location</Text>

            {formData.currentLocation !== '' && (
              <Text
                style={{
                  marginBottom: 10,
                }}>
                {formData.currentLocation}
              </Text>
            )}

            <GooglePlacesInput
              value={formData.currentLocation}
              setValue={val => {
                setFormData({
                  ...formData,
                  currentLocation: val.Locality,
                  cllat: val.lat,
                  cllng: val.lng,
                });
              }}
            />

            {/* <TextInput
              style={styles.input}
              placeholder="Enter your current location"
              value={formData.currentLocation}
              onChangeText={(value) => setFormData({ ...formData, currentLocation: value })}
            /> */}
          </View>

          <Text style={styles.head}>Hometown</Text>
          <Text style={styles.subhead}>
            Hometown is the city/village that you are from
          </Text>

          <View style={styles.ContainerDetails}>
            <Text style={styles.label}>Hometown</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your hometown location"
              value={formData.hometownLocation}
              onChangeText={value =>
                setFormData({...formData, hometownLocation: value})
              }
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.ContainerDetails}>
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
    flex: 1,
    padding: 10,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: '#000',
  },
  head: {
    fontSize: 15,
    marginBottom: 2,
    color: '#000',
  },
  subhead: {
    fontSize: 13,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#ebf0fa',
  },
  preferredLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  preferredInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ebf0fa',
    marginRight: 10,
  },
  preferredAddButton: {
    backgroundColor: '#00802b',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  locationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d4574',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    marginRight: 5,
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#00802b',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  ContainerDetails: {
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    paddingBottom: 9,
  },
});

export default AddLocation;
