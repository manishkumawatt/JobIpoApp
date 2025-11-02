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
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../context/context';
import {StepIndicator3} from './StepIndicator';
import {Picker} from '@react-native-picker/picker';
import {KeyboardScroll} from '../../component';
import {showToastMessage} from '../../utils/Toast';

const RegistrationS = ({navigation, route}) => {
  const {signIn} = useContext(AuthContext);

  const data = route.params;
  const [skill, setSkill] = useState('');
  const [formData, setFormData] = useState({skills: []});
  const [experience, setExperience] = useState('');
  const [userId, setUserId] = useState();
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEnglishModal, setShowEnglishModal] = useState(false);
  // const [selectedSkills, setSelectedSkills] = useState(JSON.parse(data?.skills) || []);
  const [open, setOpen] = useState(false);
  const [currentSalary, setCurrentSalary] = useState('');
  const [englishSpeaking, setEnglishSpeaking] = useState('');

  const [selectedSkills, setSelectedSkills] = useState(() => {
    try {
      return typeof data?.skills === 'string'
        ? JSON.parse(data.skills)
        : data.skills || [];
    } catch (e) {
      return [];
    }
  });

  // const [selectedSkills, setSelectedSkills] = useState(() => {
  //   try {
  //     if (typeof data?.skills === 'string') {
  //       const parsed = JSON.parse(data.skills);
  //       if (Array.isArray(parsed)) return parsed;
  //       return data.skills.split(',').map(s => s.trim());
  //     }
  //     return Array.isArray(data?.skills) ? data.skills : [];
  //   } catch (e) {
  //     if (typeof data?.skills === 'string') {
  //       return data.skills.split(',').map(s => s.trim());
  //     }
  //     return [];
  //   }
  // });

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('UserID');
        if (storedUserId) {
          setUserId(storedUserId);
          // // console.log('storedUserId', storedUserId);
        }
      } catch (error) {
        // console.error('Error fetching userID from AsyncStorage:', error);
      }
    };
    fetchUserId();
  }, []);

  // // console.log(data);
  // // console.log('editprofile');

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

  const addSkill = () => {
    if (skill.trim() === '') {
      showToastMessage('Please enter a skill', 'danger');
      return;
    }

    if (selectedSkills.length < 10) {
      setSelectedSkills([...selectedSkills, skill]);
      setSkill('');
    } else {
      showToastMessage('Limit reached', 'danger');
    }
  };

  const removeSkill = item => {
    setSelectedSkills(prev => prev.filter(i => i !== item));
  };

  function searchInArray(input, array) {
    if (!input) return []; // Return empty if input is empty

    const regex = new RegExp(input, 'i'); // case-insensitive match

    return array.filter(item => regex.test(item));
  }

  const handleSubmit = async () => {
    if (!experience) {
      showToastMessage('Please select experience', 'danger');
      return;
    } else if (!selectedSkills) {
      showToastMessage('Please select skills', 'danger');
      return;
    } else if (!englishSpeaking) {
      showToastMessage('Please select english speaking', 'danger');
      return;
    }
    const form = new FormData();
    form.append('userId', userId);
    // form.append('skills', selectedSkills.join(', '));
    form.append('skills', JSON.stringify(selectedSkills));
    form.append('experience', experience);
    form.append('current_salary', currentSalary);
    form.append('englishSpeaking', englishSpeaking);

    try {
      const response = await fetch(
        'https://jobipo.com/api/v2/update-step-three',
        {
          method: 'POST',
          body: form,
        },
      );

      const rawText = await response.text();
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}');
      const jsonString = rawText.substring(jsonStart, jsonEnd + 1);
      const res = JSON.parse(jsonString);

      // // console.log('res submit', res);

      if (res && res.type === 'success') {
        if (userId !== '') {
          const formdata = {user_id: userId};

          try {
            const response = await fetch(
              'https://jobipo.com/api/v2/auto-login',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formdata),
              },
            );

            const ResData = await response.json();

            await AsyncStorage.setItem('UserID', String(ResData.user_id));
            const storedUserId = await AsyncStorage.getItem('UserID');
            // // console.log('Saved userId in AsyncStorage:', storedUserId);

            if (ResData.status == 1) {
              // Alert.alert(ResData.message);
              let userToken = String(ResData.token);
              let userfullName = String(ResData.name);
              let userreferCode = String(ResData.referCode);
              let usercontactNumber1 = String(ResData.contact_number);
              showToastMessage(ResData?.message, 'success');
              await signIn(userToken, usercontactNumber1);
              await AsyncStorage.setItem('contactNumber1', usercontactNumber1);
              await AsyncStorage.setItem('username', userfullName);
              await AsyncStorage.setItem('userreferCode', userreferCode);
            } else {
              showToastMessage(ResData.message, 'danger');
            }
          } catch (error) {
            // // console.log(error);
            showToastMessage('Network Error', 'danger');
          }
        } else {
          showToastMessage('Please Fill All Data', 'danger');
        }
      } else {
        showToastMessage(res?.message || 'Something went wrong', 'danger');
      }
    } catch (error) {
      // console.error('API Error:', error);
      showToastMessage('Failed to submit. Please try again later.', 'danger');
    }
  };
  // // console.log('formData?.skills-==>', formData?.skills);
  return (
    <>
      <KeyboardScroll
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}>
        <View style={styles.container}>
          <StepIndicator3 />
          <View style={styles.card}>
            {/* Toggle */}

            <Text style={styles.label}>
              Current Salary Per Month (Optional)
            </Text>
            <TextInput
              style={styles.input}
              placeholder="₹ 00,000"
              keyboardType="numeric"
              value={currentSalary}
              placeholderTextColor="#BABFC7"
              onChangeText={setCurrentSalary}
            />

            {/* <Text style={styles.label}>Total years of Experience</Text>
          <View style={styles.radioGroup}>
            {['0-1','1-2', '2-3','3-5','5-7','7-10'].map((exp) => (
              <Pressable
                key={exp}
                style={[styles.radioBtn, experience === exp && styles.radioBtnActive]}
                onPress={() => setExperience(exp)}
              >
                <Text style={[styles.radioBtnText, experience === exp && styles.radioBtnTextActive]}>
                  {exp} Year
                </Text>
              </Pressable>
            ))}
          </View> */}

            <Text style={styles.label}>Total years of Experience</Text>

            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowExperienceModal(true)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.pickerText,
                  experience === ''
                    ? styles.placeholderText
                    : styles.selectedText,
                ]}>
                {experience === ''
                  ? 'Select Experience'
                  : experience === 'fresher'
                    ? 'Fresher'
                    : `${experience} Year`}
              </Text>
              <Icon name="keyboard-arrow-down" size={24} color="#535353" />
            </TouchableOpacity>

            {/* Experience Modal */}
            <Modal
              visible={showExperienceModal}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowExperienceModal(false)}>
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowExperienceModal(false)}>
                <TouchableOpacity
                  style={styles.modalContent}
                  activeOpacity={1}
                  onPress={e => e.stopPropagation()}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select Experience</Text>
                    <TouchableOpacity
                      onPress={() => setShowExperienceModal(false)}>
                      <Icon name="close" size={24} color="#535353" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={styles.modalOptions}>
                    {['fresher', '0-1', '1-2', '2-3', '3-5', '5-7', '7-10'].map(
                      exp => (
                        <TouchableOpacity
                          key={exp}
                          style={[
                            styles.modalOption,
                            experience === exp && styles.modalOptionSelected,
                          ]}
                          onPress={() => {
                            setExperience(exp);
                            setShowExperienceModal(false);
                          }}>
                          <Text
                            style={[
                              styles.modalOptionText,
                              experience === exp &&
                                styles.modalOptionTextSelected,
                            ]}>
                            {exp === 'fresher' ? 'Fresher' : `${exp} Year`}
                          </Text>
                          {experience === exp && (
                            <Icon name="check" size={20} color="#FF8D53" />
                          )}
                        </TouchableOpacity>
                      ),
                    )}
                  </ScrollView>
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>

            <Text style={styles.label}>Skills (up to 10)</Text>

            <View style={styles.jobDetails}>
              {/* <Text style={styles.sublabel}>Add only 1 skill at a time</Text> */}

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
                  onSubmitEditing={() => {
                    // addSkill();
                    setOpen(false);
                  }}
                />
                {/* <TouchableOpacity style={styles.addButton} onPress={addSkill}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity> */}

                {open &&
                  formData?.skills?.length > 0 &&
                  searchInArray(skill, formData?.skills).length > 0 && (
                    <FlatList
                      nestedScrollEnabled={true}
                      style={{
                        position: 'absolute',
                        height: Math.min(
                          searchInArray(skill, formData?.skills).length * 50 +
                            10,
                          300,
                        ),
                        top: 50,
                        left: 0,
                        right: 0,
                        backgroundColor: '#fff',
                        zIndex: 1,
                        borderRadius: 5,
                        elevation: 10,
                      }}
                      contentContainerStyle={{
                        flexGrow: 1,
                      }}
                      ItemSeparatorComponent={() => (
                        <View style={{height: 1, backgroundColor: '#ccc'}} />
                      )}
                      keyboardShouldPersistTaps="handled"
                      data={searchInArray(skill, formData?.skills)}
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

              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => removeSkill(item)}
                style={styles.skillsContainer}>
                {selectedSkills?.map((item, index) => (
                  <View key={index} style={styles.skillChip}>
                    <Text style={styles.skillText}>{item}</Text>
                    <View>
                      <Icon name="close" size={17} color="#fff" />
                    </View>
                  </View>
                ))}
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>English Speaking</Text>

            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowEnglishModal(true)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.pickerText,
                  englishSpeaking === ''
                    ? styles.placeholderText
                    : styles.selectedText,
                ]}>
                {englishSpeaking === ''
                  ? 'Add your English Speaking Level'
                  : englishSpeaking}
              </Text>
              <Icon name="keyboard-arrow-down" size={24} color="#535353" />
            </TouchableOpacity>

            {/* English Speaking Modal */}
            <Modal
              visible={showEnglishModal}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowEnglishModal(false)}>
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowEnglishModal(false)}>
                <TouchableOpacity
                  style={styles.modalContent}
                  activeOpacity={1}
                  onPress={e => e.stopPropagation()}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      English Speaking Level
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowEnglishModal(false)}>
                      <Icon name="close" size={24} color="#535353" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={styles.modalOptions}>
                    {['Basic', 'Medium', 'Fluent', 'No'].map(level => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.modalOption,
                          englishSpeaking === level &&
                            styles.modalOptionSelected,
                        ]}
                        onPress={() => {
                          setEnglishSpeaking(level);
                          setShowEnglishModal(false);
                        }}>
                        <Text
                          style={[
                            styles.modalOptionText,
                            englishSpeaking === level &&
                              styles.modalOptionTextSelected,
                          ]}>
                          {level}
                        </Text>
                        {englishSpeaking === level && (
                          <Icon name="check" size={20} color="#FF8D53" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>

            <TouchableOpacity style={styles.continueBtn} onPress={handleSubmit}>
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
          </View>
        </View>
      </KeyboardScroll>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,

    backgroundColor: '#F5F4FD',
  },
  // ScrollViewcontainer: {
  //   flex: 1,
  //   backgroundColor: '#ebf0fa',
  // },

  input: {
    marginVertical: 5,
    marginBottom: 10,
    backgroundColor: '#F8F8F8',
    paddingLeft: 10,
    color: '#333',
    backgroundColor: '#ffffff',
    // borderRadius: 10,
    // borderColor: '#ccc',
    // borderWidth: 0.7,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#535353',
    marginBottom: 4,
    marginLeft: 4,
  },
  sublabel: {
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 4,
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
  // card: {
  //   width: '100%',
  //   backgroundColor: '#ffffff',
  //   padding: 20,
  //   borderRadius: 15,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowRadius: 5,
  //   elevation: 5,
  // },
  card: {
    marginTop: 100,
  },
  tabContainer: {
    width: '80%',
    flexDirection: 'row',
    borderRadius: 25,
    alignSelf: 'center',
    overflow: 'hidden',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#0071a9',
  },
  tabLeft: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  tabRightActive: {
    flex: 1,
    backgroundColor: '#004e92',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25,
  },
  tabText: {
    color: '#004e92',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  skillInputContainer: {
    position: 'relative',
    width: '100%',
    // marginBottom: 16,
  },
  inputFlex: {
    width: '100%',
    height: 40,
    // borderColor: '#ccc',
    // borderWidth: 1,
    // borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#333',
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
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  skillChip: {
    backgroundColor: '#FF8D53',
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 5,
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

  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FF8D53',
    // marginTop: 16,
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
    color: '#FF8D53',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // radioGroup: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginBottom: 15,
  // },

  // radioBtn: {
  //   paddingVertical: 10,
  //   paddingHorizontal: 10,
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   borderRadius: 20,
  //   backgroundColor: '#e6f7ff',
  //     margin:2,

  // },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  radioBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 8,
    marginBottom: 10,
  },

  radioBtnActive: {
    backgroundColor: '#FF8D53',
    borderColor: '#FF8D53',
  },

  radioBtnText: {
    color: '#FF8D53',
    fontWeight: '600',
  },

  radioBtnTextActive: {
    color: '#fff',
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
});

export default RegistrationS;
