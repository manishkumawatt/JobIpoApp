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
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditEducation({navigation, route}) {
  const {
    jobSeekerData,
    data,
    index = null,
    addNew,
    experience,
    profileJobseekerData,
    jobseekerId,
  } = route.params;
  console.log('jobSeekerData=====', jobSeekerData);
  console.log('data=====', data);
  console.log('profileJobseekerData=====', profileJobseekerData);
  console.log('addNew=====', addNew);

  // data===== {educationLevel: "Bachelor's", collegeName: 'abc University', degree: 'G.Tech', specialization: '', educationType: '', startDate: '', endDate: '', yearOfCompletion: '2017'}
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#000' : '#000';
  const isDarkMode = useColorScheme() === 'dark';

  const [graduationDegrees, setGraduationDegrees] = useState([]);
  const [postGraduationDegrees, setPostGraduationDegrees] = useState([]);
  const [diplomaDegrees, setDiplomaDegrees] = useState([]);
  const [loadingDegrees, setLoadingDegrees] = useState(false);
  const [showDegreeModal, setShowDegreeModal] = useState(false);
  const [degreeSearchText, setDegreeSearchText] = useState('');
  const [filteredDegrees, setFilteredDegrees] = useState([]);

  // Helper function to map education level from API format to UI format
  const mapEducationLevel = level => {
    if (!level) return '';
    // Map API formats to UI formats
    if (
      level.includes("Bachelor's") ||
      level === 'Bachelor' ||
      level === 'Graduate'
    ) {
      return 'Graduate';
    }
    if (
      level.includes("Master's") ||
      level === 'Master' ||
      level === 'Postgraduate'
    ) {
      return 'Postgraduate';
    }
    // Return as-is for other levels
    return level;
  };

  // Helper function to map education level from UI format back to API format
  const mapEducationLevelToAPI = level => {
    if (!level) return '';
    // Map UI formats back to API formats
    if (level === 'Graduate') {
      return "Bachelor's";
    }
    if (level === 'Postgraduate') {
      return "Master's";
    }
    // Return as-is for other levels
    return level;
  };

  // Initialize educationData state with all fields
  const getInitialEducationData = () => {
    if (addNew) {
      return {
        educationLevel: '',
        collegeName: '',
        degree: '',
        specialization: '',
        educationType: '',
        startDate: '',
        endDate: '',
        yearOfCompletion: '',
      };
    }

    if (data && typeof data === 'object') {
      // Map education level from API format to UI format
      const mappedLevel = mapEducationLevel(data.educationLevel);

      return {
        educationLevel: mappedLevel || data.educationLevel || '',
        collegeName: data.collegeName || '',
        degree: data.degree || '',
        specialization: data.specialization || '',
        educationType: data.educationType || '',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        yearOfCompletion: data.yearOfCompletion || '',
      };
    }

    return {
      educationLevel: '',
      collegeName: '',
      degree: '',
      specialization: '',
      educationType: '',
      startDate: '',
      endDate: '',
      yearOfCompletion: '',
    };
  };

  const [educationData, setEducationData] = useState(getInitialEducationData());

  // Prefill data when screen is focused or data changes
  useFocusEffect(
    useCallback(() => {
      if (addNew) {
        setEducationData({
          educationLevel: '',
          collegeName: '',
          degree: '',
          specialization: '',
          educationType: '',
          startDate: '',
          endDate: '',
          yearOfCompletion: '',
        });
        return;
      }

      // Prefill with data from params
      if (data && typeof data === 'object') {
        const mappedLevel = mapEducationLevel(data.educationLevel);
        setEducationData({
          educationLevel: mappedLevel || data.educationLevel || '',
          collegeName: data.collegeName || '',
          degree: data.degree || '',
          specialization: data.specialization || '',
          educationType: data.educationType || '',
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          yearOfCompletion: data.yearOfCompletion || '',
        });
      } else if (Array.isArray(data) && index != null && index < data.length) {
        const item = data[index];
        const mappedLevel = mapEducationLevel(item.educationLevel);
        setEducationData({
          educationLevel: mappedLevel || item.educationLevel || '',
          collegeName: item.collegeName || '',
          degree: item.degree || '',
          specialization: item.specialization || '',
          educationType: item.educationType || '',
          startDate: item.startDate || '',
          endDate: item.endDate || '',
          yearOfCompletion: item.yearOfCompletion || '',
        });
      }
    }, [data, index, addNew]),
  );

  // Determine if degree picker should be shown
  const showDegreePicker = ['Graduate', 'Postgraduate', 'DIPLOMA'].includes(
    educationData.educationLevel,
  );

  // Get degree options based on education level
  const degreeOptions =
    educationData.educationLevel === 'Graduate'
      ? graduationDegrees
      : educationData.educationLevel === 'Postgraduate'
        ? postGraduationDegrees
        : educationData.educationLevel === 'DIPLOMA'
          ? diplomaDegrees
          : [];
  console.log('graduationDegrees-=d-----==-=-=-=', graduationDegrees);
  console.log('educationData-=d-----==-=-=-=', educationData);
  console.log('degreeOptions-x=-----==-=-=-=', degreeOptions);
  // Handler functions for degree modal
  const handleDegreeModalOpen = () => {
    setDegreeSearchText('');
    setFilteredDegrees(degreeOptions);
    setShowDegreeModal(true);
  };

  const handleDegreeModalSearch = text => {
    setDegreeSearchText(text);
    if (!text.trim()) {
      setFilteredDegrees(degreeOptions);
    } else {
      const filtered = degreeOptions.filter(
        deg =>
          deg.label.toLowerCase().includes(text.toLowerCase()) ||
          deg.value.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredDegrees(filtered);
    }
  };

  const handleDegreeModalSelect = degree => {
    setEducationData({...educationData, degree: degree.value});
    setShowDegreeModal(false);
    setDegreeSearchText('');
  };

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

  // Fetch degrees from API
  useEffect(() => {
    fetchDegrees();
  }, []);

  // Update filteredDegrees when degreeOptions changes
  useEffect(() => {
    if (showDegreeModal) {
      setFilteredDegrees(degreeOptions);
    }
  }, [degreeOptions, showDegreeModal]);

  const fetchDegrees = async () => {
    try {
      setLoadingDegrees(true);

      // Fetch Graduation degrees (qualification=1)
      const graduationFormData = new FormData();
      graduationFormData.append('qualification', '1');
      const graduationResponse = await fetch(
        'https://jobipo.com/api/v3/fetch-degree',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          },
          body: graduationFormData,
        },
      );
      const graduationResult = await graduationResponse.json();
      console.log('graduationResult-==--=-=-', graduationResult);
      if (graduationResult?.status == 1) {
        const parsed = graduationResult?.data;
        const formatted = Array.isArray(parsed)
          ? parsed.map(item => ({
              label: item.degree || item.name || item,
              value: item.degree || item.name || item,
            }))
          : [];
        console.log('formatted-=d-----==-=-=-=', formatted);
        setGraduationDegrees(formatted);
      }

      // Fetch Post Graduation degrees (qualification=2)
      const postGraduationFormData = new FormData();
      postGraduationFormData.append('qualification', '2');
      const postGraduationResponse = await fetch(
        'https://jobipo.com/api/v3/fetch-degree',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          },
          body: postGraduationFormData,
        },
      );
      const postGraduationResult = await postGraduationResponse.json();
      if (postGraduationResult?.status == 1) {
        const parsed = postGraduationResult?.data;
        const formatted = Array.isArray(parsed)
          ? parsed.map(item => ({
              label: item.degree || item.name || item,
              value: item.degree || item.name || item,
            }))
          : [];
        setPostGraduationDegrees(formatted);
      }

      // Fetch Diploma degrees (qualification=3)
      const diplomaFormData = new FormData();
      diplomaFormData.append('qualification', '3');
      const diplomaResponse = await fetch(
        'https://jobipo.com/api/v3/fetch-degree',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          },
          body: diplomaFormData,
        },
      );
      const diplomaResult = await diplomaResponse.json();
      if (diplomaResult?.status == 1) {
        const parsed = diplomaResult?.data;
        const formatted = Array.isArray(parsed)
          ? parsed.map(item => ({
              label: item.degree || item.name || item,
              value: item.degree || item.name || item,
            }))
          : [];
        setDiplomaDegrees(formatted);
      }
    } catch (error) {
      console.error('Error fetching degrees:', error);
      // Fallback to empty arrays on error
      setGraduationDegrees([]);
      setPostGraduationDegrees([]);
      setDiplomaDegrees([]);
    } finally {
      setLoadingDegrees(false);
    }
  };

  const handleSubmitData = async () => {
    try {
      const userID = await AsyncStorage.getItem('UserID');

      if (!userID) {
        showToastMessage('User ID not found. Please log in again.', 'danger');
        return;
      }

      // Validate required fields
      if (!educationData.educationLevel) {
        showToastMessage('Please select qualification level', 'danger');
        return;
      }
      if (!educationData.collegeName?.trim()) {
        showToastMessage('Please enter institute name', 'danger');
        return;
      }
      if (showDegreePicker && !educationData.degree) {
        showToastMessage('Please select course name', 'danger');
        return;
      }

      // Map education level from UI format to API format
      const apiEducationLevel = mapEducationLevelToAPI(
        educationData.educationLevel,
      );

      const educationPayload = {
        updateIndex: addNew ? jobSeekerData?.length : index != null ? index : 0,
        educationLevel: apiEducationLevel,
        collegeName: educationData.collegeName || '',
        degree: educationData.degree || '',
        specialization: educationData.specialization || '',
        educationType: educationData.educationType || '',
        startDate: educationData.startDate || '',
        endDate: educationData.endDate || '',
        yearOfCompletion: educationData.yearOfCompletion || '',
      };

      const submissionData = new FormData();
      submissionData.append('userID', userID);
      submissionData.append('jobseekerId', jobseekerId);
      submissionData.append(
        'education',
        JSON.stringify(addNew ? [educationPayload] : [educationPayload]),
      );

      console.log('submissionDatasubmissionData', submissionData);
      const res = await fetch(
        'https://jobipo.com/api/v3/update-candidate-profile',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          },
          body: submissionData,
        },
      );

      const data = await res.json();
      if (data?.success) {
        showToastMessage('Education updated successfully', 'success');
        navigation.goBack();
      } else {
        showToastMessage(data?.message || 'Something went wrong.', 'danger');
      }
      console.log('data-=-----==-=-=-=', data);
    } catch (err) {
      showToastMessage('Something went wrong. Please try again.', 'danger');
    }
  };
  console.log('filteredDegrees-=-----==-=-=-=', filteredDegrees);
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
              '10th Below',
              '10th',
              '12th',
              'Graduate',
              'Postgraduate',
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
                  {level == 'Postgraduate' ? 'Post Graduate' : level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {showDegreePicker ? (
            <View>
              <Text style={styles.labelPicker}>Course Name</Text>
              <TouchableOpacity
                style={styles.degreeInput}
                onPress={handleDegreeModalOpen}>
                <Text
                  style={[
                    educationData.degree
                      ? styles.inputText
                      : styles.placeholderText,
                  ]}>
                  {educationData.degree || 'Select Degree'}
                </Text>
                <Icon name="arrow-drop-down" size={24} color="#535353" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{height: 20}} />
          )}

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

          <View style={styles.saveContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSubmitData}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardScroll>

      {/* Degree Selection Modal */}
      <Modal
        visible={showDegreeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDegreeModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDegreeModal(false)}>
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={e => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Degree</Text>
              <TouchableOpacity onPress={() => setShowDegreeModal(false)}>
                <Icon name="close" size={24} color="#535353" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalSearchContainer}>
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search Degree"
                placeholderTextColor="#BABFC7"
                value={degreeSearchText}
                onChangeText={handleDegreeModalSearch}
                autoFocus={true}
              />
              <Icon name="search" size={24} color="#535353" />
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={styles.modalOptions}>
              {filteredDegrees.length > 0 ? (
                filteredDegrees.map((deg, index) => (
                  <TouchableOpacity
                    key={deg.value || index}
                    style={[
                      styles.modalOption,
                      educationData.degree === deg.value &&
                        styles.modalOptionSelected,
                    ]}
                    onPress={() => handleDegreeModalSelect(deg)}>
                    <Text
                      style={[
                        styles.modalOptionText,
                        educationData.degree === deg.value &&
                          styles.modalOptionTextSelected,
                      ]}>
                      {deg.label}
                    </Text>
                    {educationData.degree === deg.value && (
                      <Icon name="check" size={20} color="#FF8D53" />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No degrees found</Text>
                </View>
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  degreeInput: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
    color: '#BABFC7',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#535353',
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F4FD',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalSearchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  modalOptions: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionSelected: {
    backgroundColor: '#FFF5F0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalOptionTextSelected: {
    color: '#FF8D53',
    fontWeight: '500',
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
  },
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
