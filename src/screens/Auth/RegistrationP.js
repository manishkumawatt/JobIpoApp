import React, {useState, useEffect, useCallback} from 'react';
import {BackHandler, Keyboard, Platform} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GooglePlacesInput from '../../components/GooglePlacesInput';
import {useColorScheme} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StepIndicator2} from './StepIndicator';
import {KeyboardScroll} from '../../component';
import PlacesAutocomplete from '../../components/PlacesAutocomplete';
import {showToastMessage} from '../../utils/Toast';

const RegistrationP = ({navigation, route}) => {
  // const jobSeekerData = route.params || {};
  const [formData, setFormData] = useState({
    userId: '',
    current_location: '',
    cllat: '',
    cllng: '',
    city: '',
    state: '',
    pincode: '',
    dob: '',
    gender: '',
    education_level: '',
    jobTitle: '',
    preferred_job_industry: '',
  });

  const isDarkMode = useColorScheme() === 'dark';

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchUserId = async () => {
  //       try {
  //         const storedUserId = await AsyncStorage.getItem('UserID');
  //         if (storedUserId) {
  //           // console.log('Stored UserID:', storedUserId);
  //           setFormData((prevFormData) => ({
  //             ...prevFormData,
  //             userId: storedUserId,
  //           }));
  //         } else {
  //           // console.log('UserID not found in storage.');
  //         }
  //       } catch (error) {
  //         console.error('Error fetching UserID from AsyncStorage:', error);
  //       }
  //     };

  //     fetchUserId();
  //   }, [])
  // );

  useFocusEffect(
    useCallback(() => {
      setFormData({
        userId: '',
        current_location: '',
        cllat: '',
        cllng: '',
        city: '',
        state: '',
        pincode: '',
        dob: '',
        gender: '',
        education_level: '',
        jobTitle: '',
        preferred_job_industry: '',
      });

      const fetchUserId = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('UserID');
          if (storedUserId) {
            setFormData(prev => ({...prev, userId: storedUserId}));
          }
        } catch (error) {
          // console.error('Error fetching UserID from AsyncStorage:', error);
        }
      };

      fetchUserId();
    }, []),
  );

  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [filteredJobTitles, setFilteredJobTitles] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedPincode, setSelectedPincode] = useState('');
  const [locationSelected, setLocationSelected] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  // Helper function to extract pincode from address string
  const extractPincodeFromAddress = address => {
    if (!address) return '';

    const patterns = [
      /\b\d{6}\b/g, // 6 digits
      /\b\d{5,6}\b/g, // 5-6 digits
      /pincode[:\s]*(\d{6})/i, // "pincode: 123456"
      /pin[:\s]*(\d{6})/i, // "pin: 123456"
      /(\d{6})/g, // any 6 digits
    ];

    for (const pattern of patterns) {
      const matches = address.match(pattern);
      if (matches && matches.length > 0) {
        const sixDigitMatch = matches.find(match => match.length === 6);
        if (sixDigitMatch) {
          return sixDigitMatch;
        }
      }
    }

    return '';
  };

  useFocusEffect(
    useCallback(() => {
      const fetchJobTitles = async () => {
        try {
          const response = await fetch(
            'https://jobipo.com/api/v3/fetch-job-titles',
            {
              method: 'GET',
              headers: {
                Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
              },
            },
          );

          const result = await response.json();
          // // console.log('job result', result);

          if (result?.status === 1 && result?.msg) {
            const parsed = JSON.parse(result.msg);
            // // console.log('Parsed jobTitles:', parsed);

            if (Array.isArray(parsed)) {
              setJobTitles(parsed);
            } else {
            }
          }
        } catch (error) {}
      };

      fetchJobTitles();
    }, []),
  );

  const handleJobTitleChange = text => {
    // // console.log('Typed text:', text);
    // console.log('Current jobTitles:', jobTitles); // 🔍 Check array content
    setFormData({...formData, jobTitle: text});

    if (text.length >= 1) {
      const filtered = jobTitles.filter(item => {
        // console.log('Item:', item); // 🧪 check each object
        if (!item.jobTitle) {
          // console.warn('No jobTitle field in:', item);
          return false;
        }

        return item.jobTitle.toLowerCase().includes(text.toLowerCase());
      });

      // // console.log('Filtered:', filtered);
      setFilteredJobTitles(filtered);
    } else {
      setFilteredJobTitles([]);
    }
  };

  const handleSuggestionPress = selectedTitle => {
    setFormData({...formData, jobTitle: selectedTitle});
    setFilteredJobTitles([]);
  };
  // Keyboard event listeners for better Android support
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
    // Validate required fields

    if (!formData.current_location) {
      showToastMessage('Please select a valid location.', 'danger');
      return;
    } else if (!formData?.gender) {
      showToastMessage('Please select your gender.', 'danger');
      return;
    } else if (!formData?.dob) {
      showToastMessage('Please select a valid date of birth.', 'danger');
      return;
    } else if (!formData?.education_level) {
      showToastMessage('Please select education level.', 'danger');
      return;
    } else if (!formData?.jobTitle) {
      showToastMessage('Please select job title.', 'danger');
      return;
    } else if (!formData?.preferred_job_industry) {
      showToastMessage('Please select preferred job industry.', 'danger');
      return;
    }
    try {
      const storedUserId = await AsyncStorage.getItem('UserID');
      const form = new FormData();
      form.append('userId', formData.userId || storedUserId);
      form.append('current_location', formData.current_location);
      form.append('lat', formData.cllat);
      form.append('lng', formData.cllng);
      form.append('city', formData.city);
      form.append('state', formData.state);
      form.append('pincode', formData.pincode);
      form.append('dob', formData.dob);
      form.append('gender', formData.gender);
      form.append('education_level', formData.education_level);
      form.append('jobTitle', formData.jobTitle);
      form.append('preferred_job_industry', formData.preferred_job_industry);

      // // console.log('FormData payload:', form);

      const response = await fetch(
        'https://jobipo.com/api/v2/update-step-two',
        {
          method: 'POST',
          body: form,
        },
      );

      const rawText = await response.text();

      let res;
      try {
        const jsonStart = rawText.indexOf('{');
        const jsonEnd = rawText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          const jsonString = rawText.substring(jsonStart, jsonEnd + 1);
          res = JSON.parse(jsonString);
        } else {
          throw new Error('No valid JSON found');
        }
      } catch (e) {
        showToastMessage(
          'Invalid server response. Please contact support.',
          'danger',
        );

        return;
      }

      // // console.log('API response:', res);

      if (res && res.type === 'success') {
        // Alert.alert('Success', 'Details saved successfully');
        navigation.navigate('RegistrationS');
      } else {
        const message =
          typeof res.message === 'string'
            ? res.message
            : 'Something went wrong';
        showToastMessage(message, 'danger');
      }
    } catch (error) {
      showToastMessage(
        'Failed to update details. Check your internet connection.',
        'danger',
      );
    }
  };

  // // console.log('formData:', formData);

  return (
    <KeyboardScroll
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={20}>
      <View style={styles.container}>
        <StepIndicator2 />
        <View style={styles.card}>
          <View style={styles.ContainerDetails}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.label}>Current Location</Text>
            </View>
            {/* <GooglePlacesInput
              value={formData.current_location}
              setValue={val => {
                setFormData({
                  ...formData,
                  current_location: val.Locality,
                  cllat: val.lat,
                  cllng: val.lng,
                  city: val.city,
                  state: val.state,
                  pincode: val.pincode,
                });
              }}
            /> */}
            <PlacesAutocomplete
              apiKey={'AIzaSyDqBEtr9Djdq0b9NTCMmquSrKiPCCv384o'}
              onPlaceSelected={(address, placeId, val) => {
                // Extract state and pincode with fallbacks
                const extractedState = val.state || '';
                const extractedPincode =
                  val.pincode || extractPincodeFromAddress(address);

                setSelectedState(extractedState);
                setSelectedPincode(extractedPincode);
                setLocationSelected(true);

                setFormData({
                  ...formData,
                  current_location: val.Locality,
                  cllat: val.lat,
                  cllng: val.lng,
                  city: val?.city,
                  state: extractedState,
                  pincode: extractedPincode,
                });
              }}
              showSuggestions={focusedInput === 'location' && !locationSelected}
              onFocus={() => {
                setFocusedInput('location');
                // If location is already selected, allow editing by resetting the selection
                if (locationSelected) {
                  setLocationSelected(false);
                }
              }}
              onBlur={() => setFocusedInput(null)}
            />

            {/* State Field */}
            {/* {selectedState ? (
              <View>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={[
                    styles.input,
                    {backgroundColor: '#ffffff', color: '#333'},
                  ]}
                  placeholder="State"
                  value={selectedState}
                  editable={false}
                />
              </View>
            ) : null} */}

            {/* {selectedPincode ? (
              <View>
                <Text style={styles.label}>Pincode</Text>
                <TextInput
                  style={[
                    styles.input,
                    {backgroundColor: '#ffffff', color: '#333'},
                  ]}
                  placeholder="Pincode"
                  value={selectedPincode}
                  editable={false}
                />
              </View>
            ) : null} */}

            <Text style={styles.label}>Gender</Text>

            <View style={styles.genderGroup}>
              {[
                {label: 'Male', value: '1'},
                {label: 'Female', value: '2'},
                {label: 'Other', value: '3'},
              ].map(option => {
                const isActive = formData.gender === option.value;
                return (
                  <Pressable
                    key={option.value}
                    style={styles.genderOption}
                    onPress={() => {
                      setFormData({...formData, gender: option.value});
                      setFocusedInput('gender');
                      setLocationSelected(true); // Prevent location suggestions
                    }}>
                    <View
                      style={[
                        styles.outerCircle,
                        isActive && styles.outerCircleActive,
                      ]}>
                      {isActive && <View style={styles.innerDot} />}
                    </View>
                    <Text
                      style={[
                        styles.genderLabel,
                        isActive && styles.genderLabelActive,
                      ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Gender Field */}
            {/* <Text style={styles.label}>Gender</Text>
            <View style={styles.radioGroup}>
              {[
                { label: 'Male', value: '1' },
                { label: 'Female', value: '2' },
                { label: 'Other', value: '3' },
              ].map((option) => (
                <Pressable
                  key={option.value}
                  style={[styles.radioBtn, formData.gender === option.value && styles.radioBtnActive]}
                  onPress={() => setFormData({ ...formData, gender: option.value })}
                >
                  <Text
                    style={[styles.radioBtnText, formData.gender === option.value && styles.radioBtnTextActive]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View> */}

            {/* Date of Birth Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Date Of Birth</Text>
              <TextInput
                placeholder="dd/mm/yyyy"
                value={formData.dob}
                onChangeText={text => {
                  const cleaned = text.replace(/[^\d]/g, '');
                  let formatted = '';
                  if (cleaned.length <= 2) {
                    formatted = cleaned;
                  } else if (cleaned.length <= 4) {
                    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
                  } else {
                    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
                  }
                  setFormData({...formData, dob: formatted});
                }}
                placeholderTextColor="#BABFC7"
                keyboardType="number-pad"
                maxLength={10}
                style={styles.input}
                onFocus={() => {
                  setFocusedInput('dateOfBirth');
                  setLocationSelected(true); // Prevent location suggestions
                }}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* Education Level Field */}
            <Text style={styles.label}>Education Level</Text>
            <View style={styles.radioGroup}>
              {[
                '10th_below',
                '10th',
                '12th',
                'graduate',
                'postgraduate',
                'iti',
                'diploma',
              ].map(option => (
                <Pressable
                  key={option}
                  style={[
                    styles.radioBtn,
                    formData.education_level === option &&
                      styles.radioBtnActive,
                  ]}
                  onPress={() => {
                    setFormData({...formData, education_level: option});
                    setFocusedInput('education');
                    setLocationSelected(true); // Prevent location suggestions
                  }}>
                  <Text
                    style={[
                      styles.radioBtnText,
                      formData.education_level === option &&
                        styles.radioBtnTextActive,
                    ]}>
                    {option === '10th_below'
                      ? '10th Below'
                      : option === '10th'
                        ? '10th'
                        : option === '12th'
                          ? '12th'
                          : option === 'graduate'
                            ? 'Graduate'
                            : option === 'postgraduate'
                              ? 'Post Graduate'
                              : option === 'iti'
                                ? 'ITI'
                                : 'Diploma'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Job Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Job Title"
              value={formData.jobTitle}
              onChangeText={handleJobTitleChange}
              placeholderTextColor="#BABFC7"
              keyboardType="default"
              returnKeyType="next"
              maxLength={100}
              onFocus={() => {
                setFocusedInput('jobTitle');
                setLocationSelected(true); // Prevent location suggestions
              }}
              onBlur={() => setFocusedInput(null)}
            />

            {filteredJobTitles.length > 0 && (
              <View style={styles.suggestionBox}>
                <FlatList
                  data={filteredJobTitles}
                  keyboardShouldPersistTaps="handled"
                  keyExtractor={item => item.jobTitleId}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => handleSuggestionPress(item.jobTitle)}>
                      <Text>{item.jobTitle}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
            {/* 
  <Text style={styles.label}> Job Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Job Title"
              placeholderTextColor={isDarkMode ? '#555' : '#555'}
              value={formData.jobTitle}
            onChangeText={(text) => setFormData({ ...formData, jobTitle: text })}
            /> */}
            {/* Preferred Job Industry */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Preferred Job Industry</Text>
              <View style={styles.dropdownBox}>
                <Picker
                  style={{
                    color: formData?.preferred_job_industry
                      ? '#000'
                      : '#D0D0D0',
                  }}
                  dropdownIconColor="#000"
                  selectedValue={formData.preferred_job_industry}
                  onValueChange={itemValue =>
                    setFormData({
                      ...formData,
                      preferred_job_industry: itemValue,
                    })
                  }
                  onFocus={() => {
                    setFocusedInput('jobIndustry');
                    setLocationSelected(true); // Prevent location suggestions
                  }}
                  onBlur={() => setFocusedInput(null)}>
                  <Picker.Item
                    label="--Select Preferred Job Industry--"
                    value=""
                  />
                  <Picker.Item label="IT & Software" value="IT & Software" />
                  <Picker.Item
                    label="Education & Training"
                    value="Education & Training"
                  />
                  <Picker.Item label="Transportation" value="Transportation" />
                  <Picker.Item
                    label="Facility Management"
                    value="Facility Management"
                  />
                  <Picker.Item
                    label="Real Estate & Property"
                    value="Real Estate & Property"
                  />
                  <Picker.Item
                    label="Insurance & Stock Market"
                    value="Insurance & Stock Market"
                  />
                  <Picker.Item
                    label="E-Commerce Management"
                    value="E-Commerce Management"
                  />
                  <Picker.Item
                    label="Hospitality & Tourism"
                    value="Hospitality & Tourism"
                  />
                  <Picker.Item
                    label="Healthcare & Support"
                    value="Healthcare & Support"
                  />
                  <Picker.Item label="BPO & KPO" value="BPO & KPO" />
                  <Picker.Item
                    label="Banking, Financial Services & Insurance"
                    value="Banking, Financial Services & Insurance"
                  />
                  <Picker.Item
                    label="E-commerce & Retail"
                    value="E-commerce & Retail"
                  />
                  <Picker.Item
                    label="Healthcare & Pharmaceuticals"
                    value="Healthcare & Pharmaceuticals"
                  />
                  <Picker.Item
                    label="Engineering & Manufacturing"
                    value="Engineering & Manufacturing"
                  />
                  <Picker.Item
                    label="Sales & Marketing"
                    value="Sales & Marketing"
                  />
                  <Picker.Item label="Telecom" value="Telecom" />
                  <Picker.Item label="Automobile" value="Automobile" />
                  <Picker.Item
                    label="Hospitality & Travel"
                    value="Hospitality & Travel"
                  />
                  <Picker.Item
                    label="Logistics & Supply Chain"
                    value="Logistics & Supply Chain"
                  />
                  <Picker.Item
                    label="Construction & Real Estate"
                    value="Construction & Real Estate"
                  />
                  <Picker.Item
                    label="Legal & Compliance"
                    value="Legal & Compliance"
                  />
                  <Picker.Item
                    label="Media, Advertising & Entertainment"
                    value="Media, Advertising & Entertainment"
                  />
                  <Picker.Item
                    label="Agriculture & Rural Development"
                    value="Agriculture & Rural Development"
                  />
                  <Picker.Item
                    label="Human Resources & Recruitment"
                    value="Human Resources & Recruitment"
                  />
                  <Picker.Item
                    label="Design & Creative"
                    value="Design & Creative"
                  />
                  <Picker.Item label="Others" value="Others" />
                </Picker>
              </View>
            </View>
          </View>
          {/* 
          <TouchableOpacity style={styles.continueBtn} onPress={handleSubmit}>
            <Text style={styles.continueText}>Next </Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.continueBtn} onPress={handleSubmit}>
            <View style={styles.continueContent}>
              <Text style={styles.continueText}>Next</Text>
              {/* <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.iconStyle} /> */}
            </View>
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
        </View>
      </View>
    </KeyboardScroll>
  );
};

const styles = StyleSheet.create({
  // scrollContainer: {
  //   flex: 1,
  //   backgroundColor: '#ebf0fa',
  // },
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#F5F4FD',
    //  alignItems: 'center',
    // justifyContent: 'center',
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
  //   input: {
  //     borderWidth: 1,
  //     borderColor: '#ccc',
  //     padding: 8,
  //     marginVertical: 5,
  //     borderRadius: 5,
  //  borderColor: '#cceeff',
  //     backgroundColor: '#e6f7ff',
  //     },
  input: {
    marginVertical: 5,
    paddingLeft: 10,
    color: '#333',
    // borderRadius: 10,
    // borderColor: '#ccc',
    backgroundColor: '#ffffff',
    // borderWidth: 0.7,
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
    // backgroundColor: '#ebf0fa',
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
    backgroundColor: '#FF8D53',
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
    // paddingHorizontal: 10,
    borderRadius: 10,
    // marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#F5F4FD',
    paddingBottom: 9,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#535353',
    fontWeight: '500',
  },
  headcontainer: {
    marginVertical: 30,
  },
  heading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FF8D53',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF8D53',
    marginVertical: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 25,
    overflow: 'hidden',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#0071a9',
  },
  tabLeft: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    alignItems: 'center',
  },
  lastInfo: {
    flexDirection: 'row',
    marginTop: 23,
    marginBottom: 26,
    alignSelf: 'center',
  },
  lastInfoText: {
    fontSize: 16,
  },
  tabRightActive: {
    flex: 1,
    backgroundColor: '#004e92',
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabText: {
    color: '#004e92',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#cceeff',
    backgroundColor: '#e6f7ff',
    marginBottom: 8,
    height: 50,
    marginTop: 8,
  },

  dropdownBox: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    justifyContent: 'center',
    height: 45,
  },

  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FF8D53',
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  active: {
    backgroundColor: '#FF8D53',
    // borderRadius: 25,
  },
  inactive: {
    backgroundColor: '#fff',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  toggleTextInactive: {
    color: '#0d4574',
    fontWeight: 'bold',
    fontSize: 16,
  },

  continueBtn: {
    backgroundColor: '#FF8D53',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 16,
    width: '60%',
  },

  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  iconStyle: {
    marginLeft: 8,
    marginTop: 1,
  },

  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
    fontWeight: '600',
  },

  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 4,
    marginTop: 8,
  },

  radioBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    // borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ffffff',
  },

  radioBtnActive: {
    backgroundColor: '#FF8D53',
    borderColor: '#FF8D53',
  },

  radioBtnText: {
    color: '#333',
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  radioBtnTextActive: {
    color: '#fff',
  },
  genderGroup: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    marginVertical: 8,
    gap: 9,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#585858',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  outerCircleActive: {
    borderColor: '#FF8D53',
    backgroundColor: '#FF8D53',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  genderLabel: {
    color: '#333',
    fontSize: 16,
    fontWeight: '400',
  },
  genderLabelActive: {
    color: '#FF8D53',
    fontWeight: '500',
  },
  suggestionBox: {
    backgroundColor: '#ffffff',
    marginTop: 6,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    maxHeight: 250,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});

export default RegistrationP;
