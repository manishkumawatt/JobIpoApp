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
  const {jobSeekerData, data, index = null} = route.params;
  console.log('jobSeekerData-=-=-=-=-=', jobSeekerData);
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
  };
  const [skill, setSkill] = useState('');
  const [formData, setFormData] = useState(data || dummyData);
  const [formDataa, setFormDataa] = useState({skills: []});
  const [userId, setUserId] = useState();
  // const [selectedSkills, setSelectedSkills] = useState(JSON.parse(data?.skills) || []);
  const [open, setOpen] = useState(false);
  const [currentSalary, setCurrentSalary] = useState('');

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
      setFormData(data || dummyData);
    }, [data]),
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
  }, []);

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

  const handleChange = (key, value) => {
    setFormData({...formData, [key]: value});
  };

  const handleSubmit = async () => {
    if (
      formData?.companyName === '' ||
      formData?.jobTitle === '' ||
      formData?.industry === '' ||
      formData?.totalWorkingMonths === ''
    ) {
      showToastMessage('Please fill all the fields', 'danger');
      return;
    }
    const d = parseIfArrayString(jobSeekerData.experience);
    const experienceArray = Array.isArray(d) ? d : [];

    // const updatedEducationData = index !== null ?
    //   d?.map((item, id) => {
    //     return id == Number(index) ? formData : item
    //   }) : [
    //     ...d,
    //     formData
    //   ];
    //  // console.log('Submitting form data:', updatedEducationData);
    const newEntry = {
      ...formData,
      skills: JSON.stringify(selectedSkills),
    };

    let updatedEducationData;
    const hasValidIndex =
      index !== null && index !== undefined && !Number.isNaN(Number(index));
    if (hasValidIndex) {
      updatedEducationData =
        experienceArray.length > 0
          ? experienceArray.map((item, id) =>
              id === Number(index) ? newEntry : item,
            )
          : [newEntry];
    } else {
      updatedEducationData = [...experienceArray, newEntry];
    }

    await fetch(`https://jobipo.com/api/Agent/doupdatejobp`, {
      method: 'POST',
      body: JSON.stringify({
        ...jobSeekerData,
        experience: JSON.stringify(updatedEducationData),
      }),
    })
      .then(res => res.json())
      .then(res => {
        if (res) {
          showToastMessage('Details updated successfully', 'success');
          navigation.goBack();
        }
      })
      .catch(err => {
        showToastMessage('Error updating details');
      });
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
            <TextInput
              style={styles.input}
              placeholder="Enter Job Title"
              placeholderTextColor={isDarkMode ? '#555' : '#555'}
              value={formData.jobTitle}
              onChangeText={text => handleChange('jobTitle', text)}
            />

            <Text style={styles.label}> Industry</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData?.industry}
                onValueChange={itemValue => handleChange('industry', itemValue)}
                style={{color: textColor}}>
                <Picker.Item label="Select Industry" value="" />
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
});

export default EditExperience;
