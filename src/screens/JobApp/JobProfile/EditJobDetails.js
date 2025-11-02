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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {showToastMessage} from '../../../utils/Toast';

const EditJobDetails = ({navigation, route}) => {
  const {jobSeekerData, data, index = null} = route.params;
  const dummyData = {
    jobTitle: '',
    jobRole: '',
    companyName: '',
    currentlyWorking: '',
    // employmentType: '',
    industry: '',
    startDate: '',
    endDate: '',

    preferred_job_Title: '',
    currentSalary: '',
    workMode: '',
    // experienceLevel: '',
    totalExperience: '',
    // preferred_job_industry: '',
    preferredJobIndustry: '',
    yearOfCompletion: '',
    totalWorkingMonths: '',
    preferredEmployementType: '',
  };
  const [skill, setSkill] = useState('');
  const [formData, setFormData] = useState(data || dummyData);
  const [formDataa, setFormDataa] = useState({skills: []});
  const [userId, setUserId] = useState();
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
      } catch (error) {}
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
      } catch (err) {}
    }

    return value;
  }

  const handleChange = (key, value) => {
    setFormData({...formData, [key]: value});
  };

  const handleSubmit = async () => {
    const d = parseIfArrayString(jobSeekerData.experience);

    const updatedEducationData =
      index !== null
        ? d.map((item, id) =>
            id === Number(index)
              ? {...formData, skills: JSON.stringify(selectedSkills)}
              : item,
          )
        : [...d, {...formData, skills: JSON.stringify(selectedSkills)}];

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
        Alert.alert('Error updating details');
      });
  };

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.heading}> Preferred Job Details</Text>

          <View style={styles.jobDetails}>
            <Text style={styles.label}>Work Type</Text>
            <View style={styles.buttonGroup}>
              {['Full-time', 'Part-time'].map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.button,
                    formData.preferredEmployementType === level &&
                      styles.buttonSelected,
                  ]}
                  onPress={() =>
                    handleChange('preferredEmployementType', level)
                  }>
                  <Text
                    style={[
                      styles.buttonText,
                      formData.preferredEmployementType === level &&
                        styles.buttonTextSelected,
                    ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Work Mode</Text>
            <View style={styles.buttonGroup}>
              {['On-site', 'Remote', 'Hybrid'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.button,
                    formData.workMode === option && styles.buttonSelected,
                  ]}
                  onPress={() => handleChange('workMode', option)}>
                  <Text
                    style={[
                      styles.buttonText,
                      formData.workMode === option && styles.buttonTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.jobDetails}>
              <Text style={styles.label}>Skills (up to 10)</Text>
              <Text style={styles.sublabel}>Add only 1 skill at a time</Text>

              <View style={styles.skillInputContainer}>
                <TextInput
                  style={styles.inputFlex}
                  placeholder="Enter a skill"
                  value={skill}
                  onChangeText={text => {
                    setSkill(text);
                    setOpen(true);
                  }}
                  onSubmitEditing={() => {
                    addSkill();
                    setOpen(false);
                  }}
                />
                {/* <TouchableOpacity style={styles.addButton} onPress={addSkill}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity> */}

                {open && (
                  <FlatList
                    nestedScrollEnabled={true}
                    style={{
                      position: 'absolute',
                      height: 300,
                      top: 50,
                      left: 0,
                      right: 0,
                      backgroundColor: '#fff',
                      zIndex: 1,
                      borderRadius: 5,
                      // elevation: 10
                    }}
                    contentContainerStyle={{
                      flex: 1,
                      height: 300,
                    }}
                    ItemSeparatorComponent={() => (
                      <View style={{height: 1, backgroundColor: '#ccc'}} />
                    )}
                    data={searchInArray(skill, formDataa.skills)}
                    keyExtractor={item => item}
                    renderItem={({item}) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            setSkill(item);
                            setSelectedSkills([...selectedSkills, item]);
                            setOpen(false);
                          }}
                          key={item}
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                          }}>
                          <Text>{item}</Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                )}
              </View>

              <View style={styles.skillsContainer}>
                {selectedSkills?.map((item, index) => (
                  <View key={index} style={styles.skillChip}>
                    <Text style={styles.skillText}>{item}</Text>
                    <TouchableOpacity onPress={() => removeSkill(item)}>
                      <Icon name="close" size={17} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.label}>Level of Experience</Text>
            <View style={styles.buttonGroup}>
              {['0-1', '1-2', '2-3', '3-5', '5-7', '7-10'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.button,
                    formData.totalExperience === option &&
                      styles.buttonSelected,
                  ]}
                  onPress={() => handleChange('totalExperience', option)}>
                  <Text
                    style={[
                      styles.buttonText,
                      formData.totalExperience === option &&
                        styles.buttonTextSelected,
                    ]}>
                    {option} Year
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Preferred Job Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Job Title"
              placeholderTextColor={isDarkMode ? '#555' : '#555'}
              value={formData.preferred_job_Title}
              onChangeText={text => handleChange('preferred_job_Title', text)}
            />

            {/* <Text style={styles.label}>Job Role</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Job Role"
              placeholderTextColor={isDarkMode ? '#555' : '#555'}
              value={formData.jobRole}
              onChangeText={(text) => handleChange('jobRole', text)}
            /> */}
            <Text style={styles.label}>Preferred Job Industry</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData?.preferredJobIndustry}
                onValueChange={itemValue =>
                  handleChange('preferredJobIndustry', itemValue)
                }
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

            <Text style={styles.label}>Current Salary per month </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your current salary"
              keyboardType="numeric"
              value={formData?.currentSalary}
              // onChangeText={setCurrentSalary}
              onChangeText={text => handleChange('currentSalary', text)}
            />

            {/* <Text style={styles.label}>Skills (up to 10)</Text>
            <View style={styles.skillInputContainer}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Enter a skill"
                placeholderTextColor={isDarkMode ? '#555' : '#555'}
                value={skill}
                onChangeText={setSkill}
                onSubmitEditing={addSkill}
              />
              <TouchableOpacity style={styles.addButton} onPress={addSkill}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.skillsContainer}>
              {formData?.skills?.map((item, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeSkill(index)}>
                    <Icon name="close" size={17} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View> */}
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
        </View>
      </ScrollView>
      <View style={styles.SaveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#ebf0fa',
  },
  saveButton: {
    marginVertical: 20,
    backgroundColor: '#0c6951',
    borderRadius: 10,
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
    backgroundColor: '#fff',
    paddingBottom: 9,
  },
  SaveContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  skillInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 5,
    marginBottom: 6,
    backgroundColor: '#ebf0fa',
  },
  inputFlex: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 4,
    backgroundColor: '#ebf0fa',
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
    backgroundColor: '#0d4574',
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
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#ebf0fa',
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

export default EditJobDetails;
