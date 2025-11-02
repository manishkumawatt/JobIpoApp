import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import JobHeader from '../../../components/Job/JobHeader';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditSkill = ({navigation, route}) => {
  const {jobSeekerData, data, index = null} = route.params;
  const [skill, setSkill] = useState('');
  const [formData, setFormData] = useState({skills: []});
  // const [selectedSkills, setSelectedSkills] = useState(JSON.parse(data?.skills) || []);
  const [open, setOpen] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  const [selectedSkills, setSelectedSkills] = useState([]);

  // const [selectedSkills, setSelectedSkills] = useState(() => {
  //   try {
  //     const skillsStr = data?.skills || '[]';
  //     // console.log('Raw data.skills:', data?.skills); // 👈 original value

  //     const parsed = JSON.parse(skillsStr);
  //     // console.log('Parsed skills array:', parsed); // 👈 parsed value
  //     return Array.isArray(parsed) ? parsed : [];
  //   } catch (e) {
  //     console.warn('Invalid JSON in data.skills:', data?.skills);
  //     return [];
  //   }
  // });

  useEffect(() => {
    const GetDataFunc = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('UserID');

        if (!storedUserId) {
          Alert.alert('Error', 'UserID not found. Please login again.');
          signOut();
          return;
        }

        const formdata = new FormData();
        formdata.append('user_id', storedUserId);
        formdata.append('action', 'dashboard');

        const response = await fetch('https://jobipo.com/api/v2/dashboard', {
          method: 'POST',
          body: formdata,
        });

        const sliderDataApi = await response.json();

        if (sliderDataApi.logout !== 1) {
          if (!sliderDataApi.msg) {
            throw new Error('msg is missing in API response');
          }

          const parsedMsg = JSON.parse(sliderDataApi.msg);

          const jobSeekerData = parsedMsg?.jobseeker;

          if (jobSeekerData?.skills) {
            const parsedSkills = JSON.parse(jobSeekerData.skills);
            setSelectedSkills(parsedSkills);
          } else {
            setSelectedSkills([]);
          }

          setisLoading(false);
        } else {
          signOut();
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong.');
      }
    };

    GetDataFunc();
  }, []);
  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {
        const langData = await fetch(`https://jobipo.com/api/Agent/jobdata`, {
          method: 'GET',
        }).then(res => res.json());

        const list = JSON.parse(
          JSON.parse(JSON.stringify(langData)).msg,
        ).skill?.map(item => item.skill);

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

  // useEffect(() => {
  //   const fetchedSkills = [
  //     'HTML5',
  //     'CSS',
  //     'JavaScript',
  //     'MySQL',
  //     'AWS',
  //     'GitHub',
  //   ];
  //   setFormData((prevData) => ({
  //     skills: [...prevData.skills, ...fetchedSkills],
  //   }));
  // }, []);

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

  //   const addSkill = () => {
  //   if (!skill || skill.length === 0) {
  //     Alert.alert('Error', 'Please select at least one skill');
  //     return;
  //   }

  //   const newSkills = skill.filter(selected =>
  //     !selectedSkills.some(existing => existing.value === selected.value)
  //   );

  //   if (selectedSkills.length + newSkills.length > 10) {
  //     Alert.alert('Limit reached', 'You can add up to 10 unique skills only.');
  //     return;
  //   }

  //   setSelectedSkills([...selectedSkills, ...newSkills]);
  //   setSkill([]);  // Clear selection after adding
  // };

  // const removeSkill = (item) => {
  //   setSelectedSkills(prev => prev.filter(i => i.value !== item.value));
  // };

  // // console.log(JSON.stringify({
  //   ...data,
  //   skills: selectedSkills
  // }))

  // const handleSave = async () => {
  //   const res = await fetch(`https://jobipo.com/api/v2/update-job-profile`, {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       ...data,
  //       skills: JSON.stringify(selectedSkills)
  //     })
  //   }).then(res => res.json())
  //     .catch(err => {
  //       Alert.alert('Error updating skills');
  //     })

  //     // console.log("res",res)
  //   if (res) {
  //     navigation.goBack()
  //     Alert.alert('Skills Updated Successfully')
  //   }
  // };

  const handleSave = async () => {
    try {
      const userID = await AsyncStorage.getItem('UserID');

      if (!userID) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        return;
      }

      const payload = {
        ...data,
        ...jobSeekerData,
        userID,
        skills: JSON.stringify(selectedSkills),
      };

      const res = await fetch(`https://jobipo.com/api/v2/update-job-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(res => res.json())
        .catch(err => {
          Alert.alert('Error updating skills');
        });

      if (res?.type === 'success') {
        Alert.alert('Skills Updated Successfully');
        navigation.goBack();
      } else {
      }
    } catch (error) {
      Alert.alert('Unexpected Error', 'Something went wrong.');
    }
  };

  function searchInArray(input, array) {
    if (!input) return [];

    const regex = new RegExp(input, 'i');

    return array.filter(item => regex.test(item));
  }

  return (
    <>
      <JobHeader />
      <ScrollView style={styles.ScrollViewcontainer}>
        <View style={styles.container}>
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
                  data={searchInArray(skill, formData.skills)}
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
              {/* <FlatList
                data={selectedSkills}
                initialNumToRender={10}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  return (
                    <View key={item} style={styles.skillChip}>
                      <Text style={styles.skillText}>{item}</Text>
                      <TouchableOpacity onPress={() => removeSkill(index)}>
                        <Icon name="close" size={17} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  )
                }}
              /> */}
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 13,
    marginBottom: 10,
  },
  skillInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputFlex: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
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
    backgroundColor: '#0d4574',
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
  jobDetails: {
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
});

export default EditSkill;
