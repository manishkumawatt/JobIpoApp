import React, {useState, useEffect, useCallback} from 'react';
import {BackHandler, Keyboard, Modal, Platform} from 'react-native';
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
    appHash: '',
    education_level: '',
    jobTitle: '',
    preferred_job_industry: '',
    collegeName: '',
    degree: '',
    yearOfCompletion: '',
  });
  const {fromOtpParam} = route?.params || {};
  const isDarkMode = useColorScheme() === 'dark';

  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {
        const langData = await fetch(`https://jobipo.com/api/v2/job-data`, {
          method: 'GET',
        }).then(res => res.json());

        const list = JSON.parse(
          JSON.parse(JSON.stringify(langData)).msg,
        ).skill?.map(item => item.skill);
        //  // console.log("list",list)
        setFormData(prevData => ({
          skills: list,
        }));
      };

      let mount = true;
      if (mount) {
        GetDataFunc();
      }

      return () => {
        mount = false;
      };
    }, []),
  );
  function searchInArray(input, array) {
    if (!input) return []; // Return empty if input is empty

    const regex = new RegExp(input, 'i'); // case-insensitive match

    return array.filter(item => regex.test(item));
  }
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
  const data = route.params;

  // const [selectedSkills, setSelectedSkills] = useState(JSON.parse(data?.skills) || []);
  const [open, setOpen] = useState(false);
  const [currentSalary, setCurrentSalary] = useState('');
  const [englishSpeaking, setEnglishSpeaking] = useState('');
  const [skill, setSkill] = useState('');

  const [selectedSkills, setSelectedSkills] = useState(() => {
    try {
      return typeof data?.skills === 'string'
        ? JSON.parse(data.skills)
        : data.skills || [];
    } catch (e) {
      return [];
    }
  });

  // Function to get related skills based on selected skills
  const getRelatedSkills = (selected, allSkills) => {
    if (!allSkills || allSkills.length === 0) return [];

    // If no skills selected, return popular/common skills (first 20)
    if (selected.length === 0) {
      return allSkills.slice(0, 20);
    }

    // Get the last selected skill to find related ones
    const lastSelected = selected[selected.length - 1].toLowerCase();

    // Find skills that contain the selected skill name or are similar
    const related = allSkills.filter(skill => {
      const skillLower = skill.toLowerCase();
      // Check if skill contains the selected skill or vice versa
      return (
        skillLower.includes(lastSelected) ||
        lastSelected.includes(skillLower) ||
        skillLower.startsWith(lastSelected.substring(0, 3))
      );
    });

    // If we have related skills, return them, otherwise return popular ones
    return related.length > 0 ? related.slice(0, 20) : allSkills.slice(0, 20);
  };

  // Function to get available skills (not selected)
  const getAvailableSkills = (searchText, allSkills, selected) => {
    if (!allSkills || allSkills.length === 0) return [];

    // Filter out already selected skills
    let available = allSkills.filter(s => !selected.includes(s));

    // If there's a search text, filter by it
    if (searchText && searchText.trim().length > 0) {
      const regex = new RegExp(searchText, 'i');
      available = available.filter(item => regex.test(item));
    } else {
      // If no search text, show related skills or popular ones
      available = getRelatedSkills(selected, available);
    }

    return available.slice(0, 20);
  };

  // Function to add a skill
  const addSkill = skillToAdd => {
    if (!skillToAdd || skillToAdd.trim() === '') {
      return;
    }

    const trimmedSkill = skillToAdd.trim();

    // Check if already selected
    if (selectedSkills.includes(trimmedSkill)) {
      return;
    }

    // Check limit
    if (selectedSkills.length >= 10) {
      showToastMessage('You can add up to 10 skills only.', 'danger');
      return;
    }

    setSelectedSkills([...selectedSkills, trimmedSkill]);
    setSkill('');
    setOpen(false);
  };

  // Function to remove a skill
  const removeSkill = skillToRemove => {
    setSelectedSkills(prev => prev.filter(s => s !== skillToRemove));
  };
  useFocusEffect(
    useCallback(() => {
      setFormData({
        userId: '',
        appHash: '',
        education_level: '',
        collegeName: '',
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
                'Content-Type': 'application/json',
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
  console.log('fromOtpParam', fromOtpParam);
  const handleSubmit = async () => {
    // Validate required fields
    console.log('formDataformData', formData);
    console.log('educationData', educationData);
    if (!educationData?.educationLevel) {
      showToastMessage('Please select education level.', 'danger');
      return;
    } else if (!selectedSkills || selectedSkills.length === 0) {
      showToastMessage('Please select skills.', 'danger');
      return;
    } else if (!englishSpeaking) {
      showToastMessage('Please select english speaking.', 'danger');
      return;
    }
    //  else if (!formData?.preferred_job_industry) {
    //   showToastMessage('Please select preferred job industry.', 'danger');
    //   return;
    // }
    try {
      const storedUserId = await AsyncStorage.getItem('UserID');
      console.log('storedUserId=--==', storedUserId);
      // Convert "Post Graduate" to "Postgraduate" for API
      let educationLevel = educationData.educationLevel;
      if (educationLevel === 'Post Graduate') {
        educationLevel = 'Postgraduate';
      } else if (educationLevel === 'Graduate') {
        educationLevel = 'Graduate';
      }

      // Prepare the data object matching API format
      const requestData = {
        userId: storedUserId,
        educationLevel: educationLevel,
        collegeName: educationData.collegeName || '',
        degree: educationData.degree || '',
        specialization: educationData.specialization || '',
        educationType: educationData.educationType || '',
        startDate: educationData.startDate || '',
        endDate: educationData.endDate || '',
        skills: selectedSkills || [],
        englishSpeaking: englishSpeaking || '',
        jobseekerId: fromOtpParam?.jobseekerId ? fromOtpParam?.jobseekerId : '',
        // userId: 257355,
        // jobseekerId: 125320,
        // educationLevel: 'Postgraduate',
        // collegeName: 'Mumbai University',
        // degree: 'M.Tech',
        // specialization: 'Information Technology',
        // educationType: 'Full-time',
        // startDate: '2018-06-01',
        // endDate: '2020-05-30',
        // skills: ['Python', 'Data Analysis'],
        // englishSpeaking: 'Basic',
      };

      console.log('API Request Data:----', JSON.stringify(requestData));

      const response = await fetch(
        'https://jobipo.com/api/v3/candidate-update-step-two',
        {
          method: 'POST',
          body: JSON.stringify(requestData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          },
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

      console.log('API response:---', res);

      if (res && res?.success) {
        await AsyncStorage.setItem('UserID', String(res?.userId));

        // Alert.alert('Success', 'Details saved successfully');
        showToastMessage(res?.message, 'success');
        navigation.navigate('RegistrationS', {fromOtpParam: fromOtpParam});
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

  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#000' : '#000';
  // const [educationData, setEducationData] = useState(data | fetchedData);
  const [educationData, setEducationData] = useState(
    fetchedData || {
      educationLevel: '',
      collegeName: '',
      degree: '',
      yearOfCompletion: '',
    },
  );
  // // console.log('formData:', formData);
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
  console.log('educationData.educationLevel', educationData.educationLevel);
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
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.label}>Current Location</Text>
            </View> */}
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
            {/* <PlacesAutocomplete
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
            /> */}

            {/* Education Level Field */}
            <Text style={styles.label}>Education Level</Text>

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
                  onPress={() => {
                    setEducationData({...educationData, educationLevel: level});
                  }}>
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
                    style={[
                      // styles.picker,
                      {
                        color: educationData.degree ? 'black' : '#BABFC7',
                        fontSize: 10,
                      },
                    ]}>
                    <Picker.Item
                      style={[styles.picker, {color: textColor, fontSize: 12}]}
                      label="Select Degree"
                      value=""
                    />
                    {degreeOptions.map(deg => (
                      <Picker.Item
                        style={[
                          styles.picker,
                          {color: textColor, fontSize: 12},
                        ]}
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
            <Text style={styles.label}>Skills (up to 10)</Text>

            <View style={styles.jobDetails}>
              <View style={styles.skillInputContainer}>
                <TextInput
                  style={styles.inputFlex}
                  placeholder="Add only 1 skill at a time"
                  placeholderTextColor="#BABFC7"
                  value={skill}
                  onChangeText={text => {
                    setSkill(text);
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  onBlur={() => {
                    // Delay closing to allow item selection
                    setTimeout(() => setOpen(false), 200);
                  }}
                  onSubmitEditing={() => {
                    if (skill.trim()) {
                      addSkill(skill);
                    } else {
                      setOpen(false);
                    }
                  }}
                />

                {open &&
                  skill.trim().length > 0 &&
                  formData?.skills?.length > 0 &&
                  getAvailableSkills(skill, formData?.skills, selectedSkills)
                    .length > 0 && (
                    <FlatList
                      nestedScrollEnabled={true}
                      style={{
                        position: 'absolute',
                        height: Math.min(
                          getAvailableSkills(
                            skill,
                            formData?.skills,
                            selectedSkills,
                          ).length *
                            50 +
                            10,
                          300,
                        ),
                        top: 50,
                        left: 0,
                        right: 0,
                        backgroundColor: '#fff',
                        zIndex: 1000,
                        borderRadius: 8,
                        elevation: 10,
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                      }}
                      contentContainerStyle={{
                        flexGrow: 1,
                        paddingVertical: 5,
                      }}
                      ItemSeparatorComponent={() => (
                        <View style={{height: 1, backgroundColor: '#eee'}} />
                      )}
                      keyboardShouldPersistTaps="handled"
                      data={getAvailableSkills(
                        skill,
                        formData?.skills,
                        selectedSkills,
                      )}
                      keyExtractor={item => item}
                      renderItem={({item}) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              addSkill(item);
                            }}
                            style={{
                              paddingHorizontal: 15,
                              paddingVertical: 12,
                            }}>
                            <Text style={{color: '#333', fontSize: 14}}>
                              {item}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  )}
              </View>

              {/* Selected Skills - Orange chips with X icon */}
              {selectedSkills?.length > 0 && (
                <View style={styles.skillsContainer}>
                  {selectedSkills.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      onPress={() => removeSkill(item)}
                      style={styles.skillChipSelected}>
                      <Text style={styles.skillTextSelected}>{item}</Text>
                      <Icon
                        name="close"
                        size={16}
                        color="#fff"
                        style={{marginLeft: 6}}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Available Skills - Light chips with + icon */}
              {formData?.skills?.length > 0 && (
                <View style={styles.availableSkillsContainer}>
                  {getAvailableSkills('', formData?.skills, selectedSkills)
                    .slice(0, 6)
                    .map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        onPress={() => addSkill(item)}
                        style={styles.skillChipAvailable}>
                        <Text style={styles.skillTextAvailable}>{item}</Text>
                        <Icon
                          name="add"
                          size={16}
                          color="#FF8D53"
                          style={{marginLeft: 6}}
                        />
                      </TouchableOpacity>
                    ))}
                </View>
              )}
            </View>

            <Text style={styles.label}>English Speaking</Text>

            <View style={styles.englishSpeakingGroup}>
              {['Basic', 'Medium', 'Fluent', 'No English'].map(level => {
                const isSelected = englishSpeaking === level;
                return (
                  <Pressable
                    key={level}
                    style={styles.englishSpeakingOption}
                    onPress={() => setEnglishSpeaking(level)}>
                    <View
                      style={[
                        styles.englishRadioCircle,
                        isSelected && styles.englishRadioCircleActive,
                      ]}>
                      {isSelected && <View style={styles.englishRadioInner} />}
                    </View>
                    <Text
                      style={[
                        styles.englishSpeakingLabel,
                        isSelected && styles.englishSpeakingLabelActive,
                      ]}>
                      {level}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={styles.continueBtn}
            // onPress={() => navigation.navigate('RegistrationS')}
            onPress={handleSubmit}>
            <View style={styles.continueContent}>
              <Text style={styles.continueText}>Next</Text>
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
  skillInputContainer: {
    position: 'relative',
    width: '100%',
    // marginBottom: 16,
  },
  inputFlex: {
    width: '100%',
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addButton: {
    marginLeft: 10,
    height: 40,
    backgroundColor: '#2d8659',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  jobDetails: {
    marginTop: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  availableSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  skillChipSelected: {
    backgroundColor: '#FF8D53',
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  skillChipAvailable: {
    backgroundColor: '#ffffff',
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '#E0E0E0',
    // elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  skillTextSelected: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  skillTextAvailable: {
    color: '#535353',
    fontSize: 14,
    fontWeight: '400',
  },
  removeButton: {
    marginLeft: 5,
    backgroundColor: '#e74c3c',
    padding: 5,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#2d8659',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  pickerContainer: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  // picker: {
  //   height: 50,
  // },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    color: '#D0D0D0',
  },

  selectedText: {
    color: '#000',
    fontFamily: '600',
  },
  pickerContainer: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  // picker: {
  //   height: 50,
  // },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: '70%',
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalOptions: {
    maxHeight: 300,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionSelected: {
    backgroundColor: '#f8f8f8',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalOptionTextSelected: {
    color: '#FF8D53',
    fontWeight: '600',
  },
  englishSpeakingGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 10,
  },
  englishSpeakingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  englishRadioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#535353',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  englishRadioCircleActive: {
    borderColor: '#FF8D53',
    backgroundColor: '#FF8D53',
  },
  englishRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  englishSpeakingLabel: {
    fontSize: 14,
    color: '#535353',
    fontWeight: '400',
  },
  englishSpeakingLabelActive: {
    color: '#535353',
    fontWeight: '500',
  },
});

export default RegistrationP;
