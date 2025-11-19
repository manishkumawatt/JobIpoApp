import React, {useState, useContext, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  FlatList,
  Platform,
  Keyboard,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'react-native';
import DateTimePicker from '../../../components/DateTimePicker';
import {Picker} from '@react-native-picker/picker';
import JobHeader from '../../../components/Job/JobHeader';
import SimpleHeader from '../../../components/SimpleHeader';
import {KeyboardScroll} from '../../../component';
import {showToastMessage} from '../../../utils/Toast';

const EditExperience = ({navigation, route}) => {
  const {
    jobSeekerData,
    data,
    index = null,
    addNew,
    experience,
    profileJobseekerData,
    jobseekerId,
  } = route.params;
  console.log('experience-=dd-=-dd=-=-=', experience?.experience?.length);
  const dummyData = {
    jobTitle: '',
    jobRole: '',
    companyName: '',
    currentlyWorking: '',
    employmentType: '',
    industry: '',
    startDate: '',
    endDate: '',
    // skills: [],

    // new
    preferred_job_Title: '',
    currentSalary: '',
    workMode: '',
    experienceLevel: '',
    preferred_job_industry: '',
    yearOfCompletion: '',
    totalWorkingMonths: '',
    location: '',
  };
  const [skill, setSkill] = useState('');
  // Initialize formData based on addNew flag
  const getInitialFormData = () => {
    if (addNew) {
      return dummyData;
    }
    return data || dummyData;
  };
  const [formData, setFormData] = useState(getInitialFormData());
  const [formDataa, setFormDataa] = useState({skills: []});
  const [userId, setUserId] = useState();
  // const [selectedSkills, setSelectedSkills] = useState(JSON.parse(data?.skills) || []);
  const [open, setOpen] = useState(false);
  const [currentSalary, setCurrentSalary] = useState('');
  const [jobTitles, setJobTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [filteredIndustries, setFilteredIndustries] = useState([]);
  const [showIndustrySuggestions, setShowIndustrySuggestions] = useState(false);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [industrySearchText, setIndustrySearchText] = useState('');

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

  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#000' : '#000';
  const isDarkMode = useColorScheme() === 'dark';

  const [selectedSkills, setSelectedSkills] = useState(() => {
    try {
      return typeof data?.skills === 'string'
        ? JSON.parse(data.skills)
        : data.skills || [];
    } catch (e) {
      return [];
    }
  });
  // console.log('experience.length-=-=-=-=-=', experience.length);
  // useFocusEffect(
  //   useCallback(() => {
  //     // console.log('Screen focused. Raw skills from backend:', data.skills);

  //     try {
  //       const parsedSkills =
  //         typeof data?.skills === 'string' ? JSON.parse(data.skills) : data.skills || [];

  //       // console.log('Parsed selectedSkills:', parsedSkills);
  //       setSelectedSkills(parsedSkills);
  //     } catch (e) {
  //       // console.log('Error parsing skills:', e);
  //       setSelectedSkills([]);
  //     }

  //     return () => {
  //     };
  //   }, [data])
  // );

  useFocusEffect(
    useCallback(() => {
      if (!data) {
        setSelectedSkills([]);
        return;
      }

      try {
        const parsedSkills =
          typeof data.skills === 'string'
            ? JSON.parse(data.skills)
            : data.skills || [];

        setSelectedSkills(parsedSkills);
      } catch (e) {
        setSelectedSkills([]);
      }

      return () => {};
    }, [data]),
  );
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
  useFocusEffect(
    useCallback(() => {
      if (addNew) {
        setFormData(dummyData);
        setSelectedSkills([]);
        return;
      }

      // Prefill with data from params
      if (data && typeof data === 'object') {
        setFormData(data);
        // Parse skills if present
        try {
          const parsedSkills =
            typeof data.skills === 'string'
              ? JSON.parse(data.skills)
              : data.skills || [];
          setSelectedSkills(parsedSkills);
        } catch (e) {
          setSelectedSkills([]);
        }
      } else if (Array.isArray(data) && index != null && index < data.length) {
        const item = data[index];
        setFormData(item);
        // Parse skills if present
        try {
          const parsedSkills =
            typeof item.skills === 'string'
              ? JSON.parse(item.skills)
              : item.skills || [];
          setSelectedSkills(parsedSkills);
        } catch (e) {
          setSelectedSkills([]);
        }
      } else {
        setFormData(dummyData);
        setSelectedSkills([]);
      }
    }, [data, index, addNew]),
  );

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('UserID');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        // console.error('Error fetching userID from AsyncStorage:', error);
      }
    };
    fetchUserId();
    fetchJobTitles();
  }, []);

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

      if (result?.status === 1 && result?.msg) {
        const parsed = JSON.parse(result.msg);
        setJobTitles(parsed);
      }
    } catch (error) {
      // Silently handle error
    }
  };

  const handleJobChange = text => {
    handleChange('jobTitle', text);
    if (text.length > 0) {
      const filtered = jobTitles.filter(item =>
        item?.jobTitle?.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredTitles(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredTitles([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = item => {
    handleChange('jobTitle', item.jobTitle);
    setShowSuggestions(false);
  };

  const handleIndustryChange = text => {
    handleChange('industry', text);
    if (text.length > 0) {
      const filtered = industries.filter(industry =>
        industry.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredIndustries(filtered);
      setShowIndustrySuggestions(filtered.length > 0);
    } else {
      setFilteredIndustries([]);
      setShowIndustrySuggestions(false);
    }
  };

  const handleIndustrySelect = industry => {
    handleChange('industry', industry);
    setShowIndustrySuggestions(false);
  };

  const handleIndustryModalOpen = () => {
    setIndustrySearchText('');
    setFilteredIndustries(industries);
    setShowIndustryModal(true);
  };

  const handleIndustryModalSearch = text => {
    setIndustrySearchText(text);
    if (text.length > 0) {
      const filtered = industries.filter(industry =>
        industry.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredIndustries(filtered);
    } else {
      setFilteredIndustries(industries);
    }
  };

  const handleIndustryModalSelect = industry => {
    handleChange('industry', industry);
    setShowIndustryModal(false);
    setIndustrySearchText('');
  };

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
        setFormDataa(prevData => ({
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

  const addSkill = () => {
    if (skill.trim() === '') {
      Alert.alert('Error', 'Please enter a skill');
      return;
    }

    if (selectedSkills.length < 10) {
      setSelectedSkills([...selectedSkills, skill]);
      setSkill('');
    } else {
      Alert.alert('Limit reached', 'You can add up to 10 skills only.');
    }
  };

  const removeSkill = item => {
    setSelectedSkills(prev => prev.filter(i => i !== item));
  };

  function searchInArray(input, array) {
    if (!input) return [];

    const regex = new RegExp(input, 'i');

    return array.filter(item => regex.test(item));
  }

  // const handleSubmit = async () => {
  //   try {
  //     const userID = await AsyncStorage.getItem('UserID');

  //     if (!userID) {
  //       Alert.alert('Error', 'User ID not found. Please log in again.');
  //       return;
  //     }

  //     const payload = {
  //       ...formData, // includes all fields from dummyData (like jobTitle, companyName etc.)
  //       userID,
  //       skills: JSON.stringify(selectedSkills), // ensure skills are from user selection
  //     };
  //     // console.log("payload",payload)

  //     const res = await fetch(`https://jobipo.com/api/Agent/doupdatejobp`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload),
  //     })
  //       .then(res => res.json())
  //       .catch(err => {
  //         console.log('API Error:', err);
  //         Alert.alert('Error updating profile');
  //       });

  //     // console.log('API Response:', res);

  //     if (res?.type === 'success') {
  //       Alert.alert('Profile Updated Successfully');
  //       navigation.goBack();
  //     } else {
  //       // console.log('Update Failed:', res?.message || 'No success type');
  //     }
  //   } catch (error) {
  //     console.error('handleSubmit Error:', error);
  //     Alert.alert('Unexpected Error', 'Something went wrong.');
  //   }
  // };

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
  console.log('experience===', experience);
  const handleChange = (key, value) => {
    setFormData({...formData, [key]: value});
  };

  const handleSubmit = async () => {
    try {
      const userID = await AsyncStorage.getItem('UserID');

      if (!userID) {
        showToastMessage('User ID not found. Please log in again.', 'danger');
        return;
      }

      // Validate required fields
      if (!formData?.companyName?.trim()) {
        showToastMessage('Please enter company name', 'danger');
        return;
      }
      if (!formData?.jobTitle?.trim()) {
        showToastMessage('Please enter job title', 'danger');
        return;
      }
      if (!formData?.industry) {
        showToastMessage('Please select industry', 'danger');
        return;
      }
      if (!formData?.totalWorkingMonths?.trim()) {
        showToastMessage('Please enter total working period', 'danger');
        return;
      }

      // Parse skills - handle both string and array formats
      let skillsArray = [];
      try {
        if (typeof selectedSkills === 'string') {
          skillsArray = JSON.parse(selectedSkills);
        } else if (Array.isArray(selectedSkills)) {
          skillsArray = selectedSkills;
        }
      } catch (e) {
        skillsArray = Array.isArray(selectedSkills) ? selectedSkills : [];
      }

      // Create experience payload - matching the Postman example structure
      const experiencePayload = {
        updateIndex: addNew
          ? Array.isArray(experience?.experience)
            ? experience?.experience.length + 1
            : 0
          : index != null
            ? index
            : 0,
        companyName: formData.companyName || '',
        industry: formData.industry || '',
        totalWorkingMonths: formData.totalWorkingMonths || '',
        jobTitle: formData.jobTitle || '',
        // location: formData.location || 'mumbai',
        // jobRole: formData.jobRole || 'SoftwareEngineer',
        // currentlyWorking: formData.currentlyWorking || 'Full-Time',
        // employmentType: formData.employmentType || 'Full-Time',
        // startDate: formData.startDate || '2020-01-01',
        // endDate: formData.endDate || '2021-12-31',
        // currentSalary: formData.currentSalary || '70000',
        // workMode: formData.workMode || 'Remote',
        // experienceLevel: formData.experienceLevel || 'Junior',
        // preferred_job_Title: formData.preferred_job_Title || 'SeniorDeveloper',
        // preferred_job_industry: formData.preferred_job_industry || 'it',
        // yearOfCompletion: formData.yearOfCompletion || '2021',
        // skills: Array.isArray(skillsArray)
        //   ? skillsArray
        //   : ['PHP', 'CodeIgniter', 'MySQL'],
      };
      // let arr = [
      //   {
      //     updateIndex: 0,
      //     companyName: 'TechCorp Pvt Ltd',
      //     industry: 'Information Technology',
      //     totalWorkingMonths: '24',
      //     location: 'Mumbai',
      //     jobTitle: 'tort',
      //     jobRole: 'Software Engineer',
      //     currentlyWorking: 'No',
      //     employmentType: 'Full-Time',
      //     startDate: '2020-01-01',
      //     endDate: '2021-12-31',
      //     currentSalary: '800000',
      //     workMode: 'Remote',
      //     experienceLevel: 'Junior',
      //     preferred_job_Title: 'Senior Developer',
      //     preferred_job_industry: 'IT',
      //     yearOfCompletion: '2021',
      //     skills: ['PHP', 'CodeIgniter', 'MySQL'],
      //   },
      //   {
      //     companyName: 'StartupXYZ',
      //     industry: 'FinTech',
      //     totalWorkingMonths: '12',
      //     location: 'Pune',
      //     jobTitle: 'Full Stack Developer',
      //     currentlyWorking: 'Yes',
      //     employmentType: 'Full-Time',
      //     startDate: '2022-01-01',
      //     endDate: '',
      //     currentSalary: '1200000',
      //     workMode: 'Hybrid',
      //     skills: ['Laravel', 'Vue.js', 'Docker'],
      //   },
      // ];
      const submissionData = new FormData();
      submissionData.append('userID', userID);
      submissionData.append('jobseekerId', jobseekerId);
      // submissionData.append('experiences', arr);
      submissionData.append('experiences', JSON.stringify([experiencePayload]));

      console.log(
        'submissionData Array.isArray(experience)',
        Array.isArray(experience?.experience),
      );
      console.log('submissionData experience', submissionData);
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

      const responseData = await res.json();
      if (responseData?.success) {
        showToastMessage('Experience updated successfully', 'success');
        navigation.goBack();
      } else {
        showToastMessage(
          responseData?.message || 'Something went wrong.',
          'danger',
        );
      }
      console.log('responseData-=-----==-=-=-=', responseData);
    } catch (err) {
      console.log('Error:', err);
      showToastMessage('Something went wrong. Please try again.', 'danger');
    }
  };

  return (
    <>
      <SimpleHeader title="Add Work Experience" titleColor="#585858" />
      <KeyboardScroll
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}>
        <View style={styles.container}>
          <View style={styles.jobDetails}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Company Name"
              placeholderTextColor={isDarkMode ? '#555' : '#555'}
              value={formData?.companyName}
              onChangeText={text => handleChange('companyName', text)}
            />

            <Text style={styles.label}> Job Title</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter Job Title"
                placeholderTextColor={isDarkMode ? '#555' : '#555'}
                value={formData.jobTitle}
                onChangeText={handleJobChange}
                onFocus={() => {
                  setFocusedInput('jobTitle');
                  if (
                    formData.jobTitle?.length > 0 &&
                    filteredTitles.length > 0
                  ) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  // Delay hiding suggestions to allow clicking on them
                  setTimeout(() => {
                    setFocusedInput(null);
                    setShowSuggestions(false);
                  }, 200);
                }}
              />
              {showSuggestions && filteredTitles.length > 0 && (
                <View style={styles.suggestionBox}>
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                    style={styles.suggestionScrollView}>
                    {filteredTitles.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => {
                          handleSuggestionSelect(item);
                          setShowSuggestions(false);
                        }}>
                        <Text style={styles.suggestionText}>
                          {item.jobTitle}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <Text style={styles.label}> Industry</Text>
            <TouchableOpacity
              style={styles.industryInput}
              onPress={handleIndustryModalOpen}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.inputText,
                  !formData?.industry && styles.placeholderText,
                ]}>
                {formData?.industry || 'Select Industry'}
              </Text>
              <Icon name="keyboard-arrow-down" size={24} color="#535353" />
            </TouchableOpacity>

            <Text style={styles.label}>Total Working Period (in Months)</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={isDarkMode ? '#555' : '#555'}
              placeholder="Enter total months of experience"
              keyboardType="numeric"
              value={formData.totalWorkingMonths}
              onChangeText={text => handleChange('totalWorkingMonths', text)}
            />
          </View>

          {/* <Text style={styles.heading}>Employee Details</Text>
          <View style={styles.jobDetails}>
            <Text style={styles.label}>Are you currently working in this company?</Text>
            <View style={styles.buttonGroup}>
              {['Yes', 'No'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.button,
                    formData.currentlyWorking === level && styles.buttonSelected,
                  ]}
                  onPress={() => handleChange('currentlyWorking', level)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      formData.currentlyWorking === level && styles.buttonTextSelected,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Start Date</Text>
            <DateTimePicker
              value={formData?.startDate}
              setValue={(value) => handleChange('startDate', value)}
              placeholder='Enter Start Date'
              placeholderTextColor={isDarkMode ? '#555' : '#555'}
              style={styles.input}
            />


            <Text style={styles.label}>End Date</Text>
            <DateTimePicker
              value={formData?.endDate}
              setValue={(value) => handleChange('endDate', value)}
              placeholder='Enter End Date'
              placeholderTextColor={isDarkMode ? '#555' : '#555'}
              style={styles.input}
            />
          </View> */}
          <View style={styles.SaveContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardScroll>

      {/* Industry Selection Modal */}
      <Modal
        visible={showIndustryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowIndustryModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowIndustryModal(false)}>
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={e => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Industry</Text>
              <TouchableOpacity onPress={() => setShowIndustryModal(false)}>
                <Icon name="close" size={24} color="#535353" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalSearchContainer}>
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search Industry"
                placeholderTextColor="#BABFC7"
                value={industrySearchText}
                onChangeText={handleIndustryModalSearch}
                autoFocus={true}
              />
              <Icon name="search" size={24} color="#535353" />
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={styles.modalOptions}>
              {filteredIndustries.map((industry, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalOption,
                    formData?.industry === industry &&
                      styles.modalOptionSelected,
                  ]}
                  onPress={() => handleIndustryModalSelect(industry)}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      formData?.industry === industry &&
                        styles.modalOptionTextSelected,
                    ]}>
                    {industry}
                  </Text>
                  {formData?.industry === industry && (
                    <Icon name="check" size={20} color="#FF8D53" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#F5F4FD',
  },
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
  jobDetails: {
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F5F4FD',
    paddingBottom: 9,
  },
  SaveContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    color: '#535353',
    fontWeight: '500',
    marginTop: 14,
    marginBottom: 4,
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    height: 43,
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    marginTop: 10,
  },
  inputFlex: {
    flex: 1,

    borderRadius: 5,
    marginVertical: 4,
    backgroundColor: '#ffffff',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#0d4574',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8D53',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  skillText: {
    fontSize: 14,
    marginRight: 5,
    color: '#fff',
  },

  heading: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    padding: 12,
    // marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  industryInput: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginLeft: 9,
    marginBottom: 8,
  },
  buttonText: {color: '#333'},
  buttonTextSelected: {color: '#fff'},
  buttonSelected: {backgroundColor: '#0d4574'},
  inputContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  suggestionBox: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1001,
  },
  suggestionScrollView: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#BABFC7',
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
    maxHeight: '80%',
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
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
    paddingRight: 10,
  },
  modalOptions: {
    maxHeight: 400,
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
});

export default EditExperience;
