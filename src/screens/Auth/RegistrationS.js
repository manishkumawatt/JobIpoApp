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
  Image,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../context/context';
import {StepIndicator3} from './StepIndicator';
import {Picker} from '@react-native-picker/picker';
import {KeyboardScroll} from '../../component';
import {showToastMessage} from '../../utils/Toast';
import {pick, types} from '@react-native-documents/picker';
import imagePath from '../../theme/imagePath';
import {
  check,
  checkMultiple,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {permissionConfirm} from '../../utils/alertController';
import {AUTH_TOKEN} from '../../appRedux/apis/commonValue';
import PlacesAutocomplete from '../../components/PlacesAutocomplete';
import {handleSetRoot} from '../../navigation/navigationService';

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
  const [focusedInput, setFocusedInput] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [showWorkExperienceForm, setShowWorkExperienceForm] = useState(false);
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
  const methodForPermission = type => {
    try {
      checkMediaPermissions(type, status => {
        if (status) {
          openGalleryView();
          return;
        }
      });
    } catch (err) {
      console.error('Permission method error:', err);
    }
  };

  const checkMediaPermissions = async (type = 'gallery', cb) => {
    try {
      // Determine the appropriate permission based on platform and Android version
      let permission;
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
      } else {
        // For Android 13+ (API 33+), use READ_MEDIA_IMAGES
        // For Android 10-12 (API 29-32), use READ_EXTERNAL_STORAGE
        // For older versions, use READ_EXTERNAL_STORAGE
        if (Platform.Version >= 33) {
          permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
        } else {
          permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        }
      }

      // Check current permission status
      const result = await check(permission);
      console.log('Permission check result:', result);

      if (result === RESULTS.GRANTED) {
        // Permission already granted
        if (cb) cb(true);
        return;
      }

      if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
        // Permission is blocked or unavailable, show settings dialog
        permissionConfirm(
          `Jobipo requires access to your storage so you can select and upload documents. Your documents will only be stored securely on Jobipo servers and used within the app.`,
          status => {
            if (status) {
              openSettings().catch(() => {});
            }
            if (cb) cb(false);
          },
        );
        return;
      }

      // Request permission
      const requestResult = await request(permission);
      console.log('Permission request result:', requestResult);

      if (requestResult === RESULTS.GRANTED) {
        // Permission granted
        if (cb) cb(true);
      } else {
        // Permission denied
        permissionConfirm(
          `Jobipo requires access to your storage so you can select and upload documents. Your documents will only be stored securely on Jobipo servers and used within the app.`,
          status => {
            if (status) {
              openSettings().catch(() => {});
            }
            if (cb) cb(false);
          },
        );
        if (cb) cb(false);
      }
    } catch (error) {
      console.error('Permission error:', error);
      showToastMessage('Error checking permissions', 'danger');
      if (cb) cb(false);
    }
  };
  const openGalleryView = async () => {
    try {
      const res = await pick({
        mode: 'open',
        type: [types.pdf, types.allFiles],
        allowMultiSelection: false,
      });

      if (res && res[0]) {
        const file = res[0];
        const fileSizeInMB = file.size ? file.size / (1024 * 1024) : 0;

        // Validate file size (5MB max)
        // if (fileSizeInMB > 5) {
        //   showToastMessage('File size exceeds 5MB limit', 'danger');
        //   return;
        // }

        // Validate file type
        const fileName = file.name || '';
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        const allowedExtensions = ['pdf', 'doc', 'docx'];

        if (!allowedExtensions.includes(fileExtension)) {
          showToastMessage(
            'Please select PDF, Doc or Docx files only',
            'danger',
          );
          return;
        }

        setResumeFile(file);
        setResumeFileName(fileName);
        showToastMessage('Resume selected successfully', 'success');
      }
    } catch (err) {
      if (err?.message !== 'User canceled document picker') {
        showToastMessage('Error selecting file', 'danger');
      }
    }
  };
  const handleSelectResume = async () => {
    methodForPermission('gallery');
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setResumeFileName('');
  };
  const handleSubmit = async () => {
    if (!experience) {
      showToastMessage('Please select experience', 'danger');
      return;
    } else if (!formData?.jobTitle) {
      showToastMessage('Please enter job title', 'danger');
      return;
    } else if (!formData?.preferred_job_industry) {
      showToastMessage('Please select job industry', 'danger');
      return;
    }

    try {
      const storedUserId = await AsyncStorage.getItem('UserID');
      const jobseekerIdP = await AsyncStorage.getItem('jobseekerId');
      console.log('jobseekerIdP-=-=-=-=-', jobseekerIdP);
      const {fromOtpParam} = route?.params || {};
      const jobseekerId = fromOtpParam?.jobseekerId || jobseekerIdP;
      console.log('fromOtpParam', fromOtpParam);

      const form = new FormData();

      // Add text fields according to API format
      form.append('userId', userId || storedUserId || '');
      form.append('jobseekerId', jobseekerId ? jobseekerId : '');
      form.append('totalExperience', experience);
      form.append('preferredJobIndustry', formData.preferred_job_industry);
      form.append('jobTitle', data?.jobTitle || formData?.jobTitle || '');
      form.append('current_salary', currentSalary || '');

      // Add resume file if selected
      if (resumeFile) {
        const fileUri =
          resumeFile.uri || resumeFile.fileCopyUri || resumeFile.path;
        const fileName = resumeFileName || resumeFile.name || 'resume.pdf';
        const fileType = resumeFile.type || 'application/pdf';

        form.append('cv', {
          uri: fileUri,
          type: fileType,
          name: fileName,
        });
      } else {
        // Append empty file field if no resume selected
        form.append('cv', '');
      }
      console.log('form---1--1---', form);
      // console.log('FormData being sent:', {
      //   userId: userId || storedUserId,
      //   jobseekerId,
      //   totalExperience: experience,
      //   preferredJobIndustry: formData.preferred_job_industry,
      //   jobTitle: data?.jobTitle || formData?.jobTitle,
      //   current_salary: currentSalary,
      //   hasResume: !!resumeFile,
      // });
      const response = await fetch(
        'https://jobipo.com/api/v3/candidate-update-step-three',
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          },
          method: 'POST',
          body: form,
        },
      );
      // headers: {
      //   'Content-Type': 'application/json',
      //   Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      // },
      const rawText = await response.text();
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}');
      const jsonString = rawText.substring(jsonStart, jsonEnd + 1);
      const res = JSON.parse(jsonString);

      console.log('res submit-----', res);
      if (res && res?.success) {
        showToastMessage(res?.message, 'success');
        if (resumeFile) {
          setShowWorkExperienceForm(true);
        }
      }
      // if (res && res.type === 'success') {
      //   if (userId !== '') {
      //     const formdata = {user_id: userId};

      //     try {
      //       const response = await fetch(
      //         'https://jobipo.com/api/v2/auto-login',
      //         {
      //           method: 'POST',
      //           headers: {
      //             'Content-Type': 'application/json',
      //           },
      //           body: JSON.stringify(formdata),
      //         },
      //       );

      //       const ResData = await response.json();

      //       await AsyncStorage.setItem('UserID', String(ResData.user_id));
      //       const storedUserId = await AsyncStorage.getItem('UserID');
      //       // // console.log('Saved userId in AsyncStorage:', storedUserId);

      //       if (ResData.status == 1) {
      //         // Alert.alert(ResData.message);
      //         let userToken = String(ResData.token);
      //         let userfullName = String(ResData.name);
      //         let userreferCode = String(ResData.referCode);
      //         let usercontactNumber1 = String(ResData.contact_number);
      //         showToastMessage(ResData?.message, 'success');
      //         await signIn(userToken, usercontactNumber1);
      //         await AsyncStorage.setItem('contactNumber1', usercontactNumber1);
      //         await AsyncStorage.setItem('username', userfullName);
      //         await AsyncStorage.setItem('userreferCode', userreferCode);
      //       } else {
      //         showToastMessage(ResData.message, 'danger');
      //       }
      //     } catch (error) {
      //       // // console.log(error);
      //       showToastMessage('Network Error', 'danger');
      //     }
      //   } else {
      //     showToastMessage('Please Fill All Data', 'danger');
      //   }
      // } else {
      //   showToastMessage(res?.message || 'Something went wrong', 'danger');
      // }
    } catch (error) {
      // console.error('API Error:', error);
      showToastMessage('Failed to submit. Please try again later.', 'danger');
    }
  };

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

    // Submit the original form with work experience data
    try {
      const storedUserId = await AsyncStorage.getItem('UserID');
      const jobseekerIdP = await AsyncStorage.getItem('jobseekerId');
      const {fromOtpParam} = route?.params || {};
      const jobseekerId = fromOtpParam?.jobseekerId || jobseekerIdP || '';

      // Transform workExperiences to match the expected API format
      const experiences = workExperiences.map((exp, index) => ({
        jobTitle: 'react native developer',
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
        preferred_job_industry: formData.preferred_job_industry || '',
        yearOfCompletion: '',
        totalWorkingMonths: exp.workingDuration || '',
        skills: JSON.stringify(selectedSkills || []),
        location: exp.location || '',
        updateIndex: String(index + 1),
      }));

      // Create the request payload with userId, jobseekerId, and experiences
      const requestPayload = {
        userId: Number(userId || storedUserId || ''),
        jobseekerId: Number(jobseekerId),
        experiences: experiences,
      };
      console.log('requestPayload', JSON.stringify(requestPayload));
      // return;
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
        // navigation.navigate('JobPage');
        // handleSetRoot({name: 'JobPage'});
        // if (userId !== '') {
        //   const formdata = {user_id: Number(userId || storedUserId || '')};
        //   console.log('formdata', formdata);
        //   try {
        //     const response = await fetch(
        //       'https://jobipo.com/api/v2/auto-login',
        //       {
        //         method: 'POST',
        //         headers: {
        //           'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(formdata),
        //       },
        //     );

        //     const ResData = await response.json();
        //     console.log('ResData-=-=-=-=-=', ResData);
        //     return;
        //     await AsyncStorage.setItem('UserID', String(ResData.user_id));
        //     const storedUserId = await AsyncStorage.getItem('UserID');

        //     if (ResData.status == 1) {
        //       let userToken = String(ResData.token);
        //       let userfullName = String(ResData.name);
        //       let userreferCode = String(ResData.referCode);
        //       let usercontactNumber1 = String(ResData.contact_number);
        //       // showToastMessage(ResData?.message, 'success');
        //       await signIn(userToken, usercontactNumber1);
        //       await AsyncStorage.setItem('contactNumber1', usercontactNumber1);
        //       await AsyncStorage.setItem('username', userfullName);
        //       await AsyncStorage.setItem('userreferCode', userreferCode);
        //     } else {
        //       showToastMessage(ResData.message, 'danger');
        //     }
        //   } catch (error) {
        //     showToastMessage('Network Error', 'danger');
        //   }
        // } else {
        //   showToastMessage('Please Fill All Data', 'danger');
        // }
      } else {
        showToastMessage(res?.message || 'Something went wrong', 'danger');
      }
    } catch (error) {
      showToastMessage('Failed to submit. Please try again later.', 'danger');
    }
  };

  const handleSkipWorkExperience = async () => {
    // Submit without work experience data
    try {
      const storedUserId = await AsyncStorage.getItem('UserID');
      const {fromOtpParam} = route?.params || {};
      const jobseekerId = fromOtpParam?.jobseekerId || data?.jobseekerId || '';

      const form = new FormData();

      form.append('userId', userId || storedUserId || '');
      form.append('jobseekerId', jobseekerId ? jobseekerId : '');
      form.append('totalExperience', experience);
      form.append('preferredJobIndustry', formData.preferred_job_industry);
      form.append('jobTitle', data?.jobTitle || formData?.jobTitle || '');
      form.append('current_salary', currentSalary || '');

      if (resumeFile) {
        const fileUri =
          resumeFile.uri || resumeFile.fileCopyUri || resumeFile.path;
        const fileName = resumeFileName || resumeFile.name || 'resume.pdf';
        const fileType = resumeFile.type || 'application/pdf';

        form.append('cv', {
          uri: fileUri,
          type: fileType,
          name: fileName,
        });
      } else {
        form.append('cv', '');
      }

      const response = await fetch(
        'https://jobipo.com/api/v3/candidate-update-step-three',
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          method: 'POST',
          body: form,
        },
      );

      const rawText = await response.text();
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}');
      const jsonString = rawText.substring(jsonStart, jsonEnd + 1);
      const res = JSON.parse(jsonString);

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

            if (ResData.status == 1) {
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
            showToastMessage('Network Error', 'danger');
          }
        } else {
          showToastMessage('Please Fill All Data', 'danger');
        }
      } else {
        showToastMessage(res?.message || 'Something went wrong', 'danger');
      }
    } catch (error) {
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
            {showWorkExperienceForm ? (
              // Work Experience Form
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
                    <View style={styles.dropdownBox}>
                      <Picker
                        style={{
                          color: exp.industry ? '#000' : '#D0D0D0',
                        }}
                        dropdownIconColor="#000"
                        selectedValue={exp.industry}
                        onValueChange={itemValue =>
                          handleWorkExperienceChange(
                            index,
                            'industry',
                            itemValue,
                          )
                        }>
                        <Picker.Item label="Select Industry" value="" />
                        <Picker.Item
                          label="IT & Software"
                          value="IT & Software"
                        />
                        <Picker.Item
                          label="Education & Training"
                          value="Education & Training"
                        />
                        <Picker.Item
                          label="Transportation"
                          value="Transportation"
                        />
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
                        handleWorkExperienceChange(
                          index,
                          'workingDuration',
                          text,
                        )
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
                  // onPress={() => {
                  //   setShowWorkExperienceForm(false);
                  // }}>
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
            ) : (
              // Original Form
              <>
                {/* Toggle */}
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
                        {[
                          'fresher',
                          '0-1',
                          '1-2',
                          '2-3',
                          '3-5',
                          '5-7',
                          '7-10',
                        ].map(exp => (
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
                        ))}
                      </ScrollView>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Modal>

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
                        // setLocationSelected(true); // Prevent location suggestions
                      }}
                      onBlur={() => setFocusedInput(null)}>
                      <Picker.Item
                        label="--Select Preferred Job Industry--"
                        value=""
                      />
                      <Picker.Item
                        label="IT & Software"
                        value="IT & Software"
                      />
                      <Picker.Item
                        label="Education & Training"
                        value="Education & Training"
                      />
                      <Picker.Item
                        label="Transportation"
                        value="Transportation"
                      />
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
                <Text style={styles.label}>Job Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter job title"
                  value={formData?.jobTitle}
                  placeholderTextColor="#BABFC7"
                  onChangeText={text =>
                    setFormData({...formData, jobTitle: text})
                  }
                />

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
                {/* Resume Upload Section */}
                <View style={styles.resumeUploadContainer}>
                  <View style={styles.resumeUploadCard}>
                    {/* <View style={styles.uploadIconContainer}> */}
                    <Image
                      source={imagePath.download}
                      style={{height: 49, width: 49, marginBottom: 10}}
                      resizeMode="contain"
                    />
                    {/* </View> */}
                    <Text style={styles.uploadInstructionText}>
                      Upload PDF, Doc or Docx files only
                    </Text>
                    <Text style={styles.uploadSizeText}>
                      Maximum file size 5MB
                    </Text>

                    {resumeFile ? (
                      <View style={styles.resumeSelectedContainer}>
                        <View style={styles.resumeFileInfo}>
                          <Icon name="description" size={20} color="#FF8D53" />
                          <Text style={styles.resumeFileName} numberOfLines={1}>
                            {resumeFileName}
                          </Text>
                          <TouchableOpacity
                            onPress={handleRemoveResume}
                            style={styles.removeResumeButton}>
                            <Icon name="close" size={18} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.addResumeButton}
                        onPress={handleSelectResume}
                        activeOpacity={0.7}>
                        <Icon name="add" size={20} color="#535353" />
                        <Text style={styles.addResumeButtonText}>
                          Add your resume
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.continueBtn}
                  onPress={handleSubmit}>
                  <Text style={styles.continueText}>
                    {resumeFile ? 'Next' : 'Submit'}
                  </Text>
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
            )}
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
    height: 45,
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
  resumeUploadContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  resumeUploadCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // elevation: 1,
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadInstructionText: {
    fontSize: 10,
    color: '#535353',
    marginBottom: 2,
    textAlign: 'center',
  },
  uploadSizeText: {
    fontSize: 10,
    color: '#535353',
    marginBottom: 10,
    textAlign: 'center',
  },
  addResumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E4F7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
  },
  addResumeButtonText: {
    fontSize: 14,
    color: '#535353',
    fontWeight: '500',
    marginLeft: 8,
  },
  resumeSelectedContainer: {
    width: '100%',
    marginTop: 10,
  },
  resumeFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F4FD',
    padding: 12,
    borderRadius: 8,
  },
  resumeFileName: {
    flex: 1,
    fontSize: 14,
    color: '#535353',
    marginLeft: 10,
  },
  removeResumeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF8D53',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
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
    marginLeft: 5,
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
});

export default RegistrationS;
