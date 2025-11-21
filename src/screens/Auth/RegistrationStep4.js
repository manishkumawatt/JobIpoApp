import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../context/context';
import {StepIndicator4} from './StepIndicator';
import {KeyboardScroll} from '../../component';
import {showToastMessage} from '../../utils/Toast';
import {AUTH_TOKEN} from '../../appRedux/apis/commonValue';
import PlacesAutocomplete from '../../components/PlacesAutocomplete';

const RegistrationStep4 = ({navigation, route}) => {
  const {signIn} = useContext(AuthContext);
  const data = route.params || {};

  const [workExperiences, setWorkExperiences] = useState([
    {
      companyName: '',
      industry: '',
      location: '',
      jobRole: '',
      workingDuration: '',
    },
  ]);
  const [focusedWorkExpInput, setFocusedWorkExpInput] = useState(null);
  const [locationSelected, setLocationSelected] = useState({});
  const [showWorkExpIndustryModal, setShowWorkExpIndustryModal] =
    useState(false);
  const [workExpIndustrySearchText, setWorkExpIndustrySearchText] =
    useState('');
  const [filteredWorkExpIndustries, setFilteredWorkExpIndustries] = useState(
    [],
  );
  const [currentWorkExpIndex, setCurrentWorkExpIndex] = useState(0);

  // Industry list
  const industries = [
    'IT & Software',
    'Education & Training',
    'Transportation',
    'Facility Management',
    'Real Estate & Property',
    'Insurance & Stock Market',
    'E-Commerce Management',
    'Hospitality & Tourism',
    'Healthcare & Support',
    'BPO & KPO',
    'Banking, Financial Services & Insurance',
    'E-commerce & Retail',
    'Healthcare & Pharmaceuticals',
    'Engineering & Manufacturing',
    'Sales & Marketing',
    'Telecom',
    'Automobile',
    'Hospitality & Travel',
    'Logistics & Supply Chain',
    'Construction & Real Estate',
    'Legal & Compliance',
    'Media, Advertising & Entertainment',
    'Agriculture & Rural Development',
    'Human Resources & Recruitment',
    'Design & Creative',
    'Others',
  ];

  const handleAddMoreExperience = () => {
    setWorkExperiences([
      ...workExperiences,
      {
        companyName: '',
        industry: '',
        location: '',
        jobRole: '',
        workingDuration: '',
      },
    ]);
  };

  const handleWorkExperienceChange = (index, field, value) => {
    const updated = [...workExperiences];
    updated[index][field] = value;
    setWorkExperiences(updated);
  };

  const handleWorkExperienceSubmit = async () => {
    // Validate all work experiences
    for (let i = 0; i < workExperiences.length; i++) {
      const exp = workExperiences[i];
      if (!exp.companyName) {
        showToastMessage(
          `Please enter company name for experience ${i + 1}`,
          'danger',
        );
        return;
      }
      if (!exp.industry) {
        showToastMessage(
          `Please select industry for experience ${i + 1}`,
          'danger',
        );
        return;
      }
      if (!exp.location) {
        showToastMessage(
          `Please enter location for experience ${i + 1}`,
          'danger',
        );
        return;
      }
      if (!exp.jobRole) {
        showToastMessage(
          `Please enter job role for experience ${i + 1}`,
          'danger',
        );
        return;
      }
      if (!exp.workingDuration) {
        showToastMessage(
          `Please enter working duration for experience ${i + 1}`,
          'danger',
        );
        return;
      }
    }

    // Submit the form with work experience data
    try {
      const storedUserId = await AsyncStorage.getItem('UserID');
      const jobseekerIdP = await AsyncStorage.getItem('jobseekerId');
      const {fromOtpParam} = route?.params || {};
      const jobseekerId = fromOtpParam?.jobseekerId || jobseekerIdP || '';

      // Get data from route params
      const currentSalary = data?.currentSalary || '';
      const preferredJobIndustry = data?.preferredJobIndustry || '';
      const selectedSkills = data?.selectedSkills || [];

      // Transform workExperiences to match the expected API format
      const experiences = workExperiences.map((exp, index) => ({
        jobTitle: '',
        jobRole: exp.jobRole || '',
        companyName: exp.companyName || '',
        currentlyWorking: '',
        employmentType: '',
        industry: exp.industry || '',
        startDate: '',
        endDate: '',
        preferred_job_Title: '',
        currentSalary: currentSalary || '',
        workMode: '',
        experienceLevel: '',
        preferred_job_industry: preferredJobIndustry || '',
        yearOfCompletion: '',
        totalWorkingMonths: exp.workingDuration || '',
        skills: JSON.stringify(selectedSkills || []),
        location: exp.location || '',
        updateIndex: String(index + 1),
      }));

      // Create the request payload with userId, jobseekerId, and experiences
      const requestPayload = {
        userId: Number(data?.userId || storedUserId || 275618),
        jobseekerId: Number(jobseekerId || 136503),
        experiences: experiences,
      };
      console.log('requestPayload', JSON.stringify(requestPayload));

      const response = await fetch(
        'https://jobipo.com/api/v3/candidate-update-step-four',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          method: 'POST',
          body: JSON.stringify(requestPayload),
        },
      );

      const rawText = await response.text();
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}');
      const jsonString = rawText.substring(jsonStart, jsonEnd + 1);
      const res = JSON.parse(jsonString);
      if (res && res?.success) {
        console.log('res--1-1---dd--', res);
        let username = await AsyncStorage.getItem('username');
        console.log('username-=-=-=-=-', username);
        let Token = await AsyncStorage.getItem('Token');
        console.log('Token-=-=-=-=-', Token);

        showToastMessage(res?.message, 'success');

        await signIn(String(Token), username);
      } else {
        showToastMessage(res?.message || 'Something went wrong', 'danger');
      }
    } catch (error) {
      showToastMessage('Failed to submit. Please try again later.', 'danger');
    }
  };

  const handleSkipWorkExperience = async () => {
    // Submit without work experience data - just sign in
    try {
      let username = await AsyncStorage.getItem('username');
      let Token = await AsyncStorage.getItem('Token');
      showToastMessage('Registration completed successfully', 'success');
      await signIn(String(Token), username);
    } catch (error) {
      showToastMessage('Failed to complete registration.', 'danger');
    }
  };

  // Handler functions for work experience industry modal
  const handleWorkExpIndustryModalOpen = index => {
    setCurrentWorkExpIndex(index);
    setWorkExpIndustrySearchText('');
    setFilteredWorkExpIndustries(industries);
    setShowWorkExpIndustryModal(true);
  };

  const handleWorkExpIndustryModalSearch = text => {
    setWorkExpIndustrySearchText(text);
    if (text.length > 0) {
      const filtered = industries.filter(industry =>
        industry.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredWorkExpIndustries(filtered);
    } else {
      setFilteredWorkExpIndustries(industries);
    }
  };

  const handleWorkExpIndustryModalSelect = industry => {
    handleWorkExperienceChange(currentWorkExpIndex, 'industry', industry);
    setShowWorkExpIndustryModal(false);
    setWorkExpIndustrySearchText('');
  };

  return (
    <>
      <KeyboardScroll
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}>
        <View style={styles.container}>
          <StepIndicator4 />
          <View style={styles.card}>
            {/* Work Experience Form */}
            <>
              {workExperiences.map((exp, index) => (
                <View key={index} style={styles.workExpContainer}>
                  {workExperiences.length > 1 && (
                    <Text style={styles.workExpTitle}>
                      Experience {index + 1}
                    </Text>
                  )}
                  <Text style={styles.label}>Company Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your company name"
                    value={exp.companyName}
                    placeholderTextColor="#BABFC7"
                    onChangeText={text =>
                      handleWorkExperienceChange(index, 'companyName', text)
                    }
                  />

                  <Text style={styles.label}>Industry</Text>
                  <TouchableOpacity
                    style={styles.industryInput}
                    onPress={() => handleWorkExpIndustryModalOpen(index)}>
                    <Text
                      style={[
                        exp.industry
                          ? styles.industryInputText
                          : styles.industryPlaceholderText,
                      ]}>
                      {exp.industry || 'Select Industry'}
                    </Text>
                    <Icon name="arrow-drop-down" size={24} color="#535353" />
                  </TouchableOpacity>

                  <Text style={styles.label}>Location</Text>
                  <PlacesAutocomplete
                    hideBorder={true}
                    apiKey={'AIzaSyDqBEtr9Djdq0b9NTCMmquSrKiPCCv384o'}
                    placeholder="Search Location"
                    value={exp.location}
                    onPlaceSelected={(address, placeId, val) => {
                      handleWorkExperienceChange(index, 'location', address);
                      setLocationSelected({
                        ...locationSelected,
                        [index]: true,
                      });
                    }}
                    showSuggestions={
                      focusedWorkExpInput === `location-${index}` &&
                      !locationSelected[index]
                    }
                    onFocus={() => {
                      setFocusedWorkExpInput(`location-${index}`);
                      if (locationSelected[index]) {
                        setLocationSelected({
                          ...locationSelected,
                          [index]: false,
                        });
                      }
                    }}
                    onBlur={() => setFocusedWorkExpInput(null)}
                  />

                  <Text style={styles.label}>Job Role</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your Job Role"
                    value={exp.jobRole}
                    placeholderTextColor="#BABFC7"
                    onChangeText={text =>
                      handleWorkExperienceChange(index, 'jobRole', text)
                    }
                  />

                  <Text style={styles.label}>Working Duration</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Total Months"
                    value={exp.workingDuration}
                    placeholderTextColor="#BABFC7"
                    keyboardType="numeric"
                    onChangeText={text =>
                      handleWorkExperienceChange(index, 'workingDuration', text)
                    }
                  />
                </View>
              ))}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <TouchableOpacity
                  onPress={handleAddMoreExperience}
                  style={styles.addMoreBtn}>
                  <Icon name="add" size={20} color="#FF8D53" />
                  <Text style={styles.addMoreText}>Add more experience</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.skipBtn}
                  onPress={handleSkipWorkExperience}>
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.continueBtn}
                onPress={handleWorkExperienceSubmit}>
                <Text style={styles.continueText}>Submit</Text>
              </TouchableOpacity>

              <View style={styles.lastInfo}>
                <Text style={styles.lastInfoText}>You have an account?</Text>
                <Pressable onPress={() => navigation.navigate('Login')}>
                  <Text
                    style={[
                      styles.lastInfoText,
                      {
                        marginLeft: 10,
                        fontWeight: 'bold',
                        backgroundColor: '#ffffff',
                        paddingHorizontal: 8,
                        borderRadius: 10,
                      },
                    ]}>
                    Log In
                  </Text>
                </Pressable>
              </View>
            </>
          </View>
        </View>
      </KeyboardScroll>

      {/* Work Experience Industry Selection Modal */}
      <Modal
        visible={showWorkExpIndustryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWorkExpIndustryModal(false)}>
        <TouchableOpacity
          style={styles.industryModalOverlay}
          activeOpacity={1}
          onPress={() => setShowWorkExpIndustryModal(false)}>
          <TouchableOpacity
            style={styles.industryModalContent}
            activeOpacity={1}
            onPress={e => e.stopPropagation()}>
            <View style={styles.industryModalHeader}>
              <Text style={styles.industryModalTitle}>Select Industry</Text>
              <TouchableOpacity
                onPress={() => setShowWorkExpIndustryModal(false)}>
                <Icon name="close" size={24} color="#535353" />
              </TouchableOpacity>
            </View>
            <View style={styles.industryModalSearchContainer}>
              <TextInput
                style={styles.industryModalSearchInput}
                placeholder="Search Industry"
                placeholderTextColor="#BABFC7"
                value={workExpIndustrySearchText}
                onChangeText={handleWorkExpIndustryModalSearch}
                autoFocus={true}
              />
              <Icon name="search" size={24} color="#535353" />
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={styles.industryModalOptions}>
              {filteredWorkExpIndustries.length > 0 ? (
                filteredWorkExpIndustries.map((industry, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.industryModalOption,
                      workExperiences[currentWorkExpIndex]?.industry ===
                        industry && styles.industryModalOptionSelected,
                    ]}
                    onPress={() => handleWorkExpIndustryModalSelect(industry)}>
                    <Text
                      style={[
                        styles.industryModalOptionText,
                        workExperiences[currentWorkExpIndex]?.industry ===
                          industry && styles.industryModalOptionTextSelected,
                      ]}>
                      {industry}
                    </Text>
                    {workExperiences[currentWorkExpIndex]?.industry ===
                      industry && (
                      <Icon name="check" size={20} color="#FF8D53" />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.industryNoResultsContainer}>
                  <Text style={styles.industryNoResultsText}>
                    No industries found
                  </Text>
                </View>
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#F5F4FD',
  },
  card: {
    marginTop: 100,
  },
  input: {
    marginVertical: 5,
    marginBottom: 10,
    backgroundColor: '#F8F8F8',
    paddingLeft: 10,
    color: '#333',
    backgroundColor: '#ffffff',
    height: 45,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#535353',
    marginBottom: 4,
    marginLeft: 4,
  },
  workExpContainer: {
    marginBottom: 20,
  },
  workExpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#535353',
    marginBottom: 15,
  },
  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addMoreText: {
    fontSize: 14,
    color: '#535353',
  },
  skipBtn: {
    backgroundColor: '#FF8D53',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  skipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  continueBtn: {
    backgroundColor: '#FF8D53',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    width: '60%',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 30,
  },
  lastInfo: {
    flexDirection: 'row',
    marginTop: 23,
    marginBottom: 26,
    alignSelf: 'center',
  },
  lastInfoText: {
    fontSize: 14,
  },
  industryInput: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 10,
    height: 45,
  },
  industryInputText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  industryPlaceholderText: {
    flex: 1,
    fontSize: 16,
    color: '#D0D0D0',
  },
  industryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  industryModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  industryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  industryModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#535353',
  },
  industryModalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F4FD',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  industryModalSearchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  industryModalOptions: {
    maxHeight: 400,
  },
  industryModalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  industryModalOptionSelected: {
    backgroundColor: '#FFF5F0',
  },
  industryModalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  industryModalOptionTextSelected: {
    color: '#FF8D53',
    fontWeight: '500',
  },
  industryNoResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  industryNoResultsText: {
    fontSize: 16,
    color: '#999',
  },
});

export default RegistrationStep4;
