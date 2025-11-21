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
  Dimensions,
} from 'react-native';
import Pdf from 'react-native-pdf';
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
import RNFS from '@exodus/react-native-fs';

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
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isImageFile, setIsImageFile] = useState(false);
  const [isPdfFile, setIsPdfFile] = useState(false);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [resumeFileUri, setResumeFileUri] = useState(null);
  const [preferredJobTitle, setPreferredJobTitle] = useState('');
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(() => {
    try {
      return typeof data?.skills === 'string'
        ? JSON.parse(data.skills)
        : data.skills || [];
    } catch (e) {
      return [];
    }
  });
  const [jobTitles, setJobTitles] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [industrySearchText, setIndustrySearchText] = useState('');
  const [filteredIndustries, setFilteredIndustries] = useState([]);
  const [showJobTitleModal, setShowJobTitleModal] = useState(false);
  const [jobTitleSearchText, setJobTitleSearchText] = useState('');
  const [filteredJobTitles, setFilteredJobTitles] = useState([]);

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
    fetchJobTitles();
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
  console.log('experience----', experience);
  const openGalleryView = async () => {
    try {
      const res = await pick({
        mode: 'open',
        type: [types.pdf, types.images],
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
        const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];

        if (!allowedExtensions.includes(fileExtension)) {
          showToastMessage(
            'Please select PDF, JPG, JPEG or PNG files only',
            'danger',
          );
          return;
        }

        // Check if it's an image file
        const imageExtensions = ['jpg', 'jpeg', 'png'];
        const isImage = imageExtensions.includes(fileExtension);
        setIsImageFile(isImage);
        // Check if it's a PDF file (for preview purposes)
        const isPdf = fileExtension === 'pdf';
        setIsPdfFile(isPdf);

        // Get file URI for preview
        let fileUri = file.fileCopyUri || file.uri || file.path;
        const fileType =
          file.type ||
          file.mime ||
          (isImage ? 'image/jpeg' : 'application/pdf');

        console.log('Original file URI:', fileUri);
        console.log('fileCopyUri:', file.fileCopyUri);
        console.log('file.uri:', file.uri);

        // Handle Android content URIs - convert to file URI for PDF/image preview
        // PDF component requires file:// URIs, not content:// URIs
        if (Platform.OS === 'android' && fileUri) {
          // If we already have a file:// URI, use it directly
          if (fileUri.startsWith('file://')) {
            console.log('Using existing file:// URI:', fileUri);
          } else if (fileUri.startsWith('content://')) {
            // Need to convert content:// URI to file:// URI
            try {
              console.log('Converting content:// URI to file:// URI');
              // Create a temporary file path
              const tempFileName = `resume_${Date.now()}.${fileExtension}`;
              const tempFilePath = `${RNFS.CachesDirectoryPath}/${tempFileName}`;

              // Read file from content URI and write to temporary location
              // Use base64 encoding for binary files like PDFs and images
              const fileData = await RNFS.readFile(fileUri, 'base64');
              await RNFS.writeFile(tempFilePath, fileData, 'base64');

              // Verify file was written
              const fileExists = await RNFS.exists(tempFilePath);
              if (!fileExists) {
                throw new Error('File was not written successfully');
              }

              // Use the file:// URI for preview
              fileUri = `file://${tempFilePath}`;
              console.log(
                'Successfully converted content URI to file URI:',
                fileUri,
              );
            } catch (copyError) {
              console.error('Error copying file from content URI:', copyError);
              // Try fileCopyUri as fallback if it's a file URI
              if (file.fileCopyUri && file.fileCopyUri.startsWith('file://')) {
                fileUri = file.fileCopyUri;
                console.log('Using fileCopyUri as fallback:', fileUri);
              } else {
                // If conversion fails, show error and don't proceed
                console.error(
                  'Failed to convert content URI and no valid fallback available',
                );
                showToastMessage(
                  'Error processing file. Please try selecting the file again.',
                  'danger',
                );
                setPdfLoadError(true);
                return;
              }
            }
          } else {
            // Unknown URI format - try to use fileCopyUri if available
            console.warn('Unknown URI format:', fileUri);
            if (file.fileCopyUri && file.fileCopyUri.startsWith('file://')) {
              fileUri = file.fileCopyUri;
              console.log('Using fileCopyUri for unknown URI format:', fileUri);
            } else {
              showToastMessage(
                'Invalid file format. Please try selecting the file again.',
                'danger',
              );
              setPdfLoadError(true);
              return;
            }
          }
        }

        // Ensure file URI is valid before setting
        if (
          !fileUri ||
          (!fileUri.startsWith('file://') &&
            !fileUri.startsWith('http') &&
            !fileUri.startsWith('https'))
        ) {
          showToastMessage(
            'Invalid file URI. Please try selecting the file again.',
            'danger',
          );
          setPdfLoadError(true);
          return;
        }

        setResumeFileUri(fileUri);
        setPdfLoadError(false);

        setResumeFile(file);
        setResumeFileName(fileName);
        showToastMessage('Resume selected successfully', 'success');
      }
    } catch (err) {
      if (err?.message !== 'User canceled document picker') {
        // showToastMessage('Error selecting file', 'danger');
      }
    }
  };
  const handleSelectResume = async () => {
    methodForPermission('gallery');
  };
  const handleSuggestionSelect = item => {
    setPreferredJobTitle(item.jobTitle);
    setShowSuggestions(false);
    // Also update formData to keep it in sync
    setFormData(prev => ({
      ...prev,
      jobTitle: item.jobTitle,
    }));
  };
  const handleRemoveResume = () => {
    setResumeFile(null);
    setResumeFileName('');
    setIsImageFile(false);
    setIsPdfFile(false);
    setResumeFileUri(null);
    setPdfLoadError(false);
  };
  // Determine button text and action based on experience and resume
  const getButtonText = () => {
    if (experience === 'fresher') {
      return 'Submit';
    }
    if (experience && experience !== 'fresher') {
      if (resumeFile) {
        return 'Submit';
      } else {
        return 'Next';
      }
    }
    return 'Submit'; // Default
  };

  const handleButtonPress = async () => {
    const buttonText = getButtonText();
    if (buttonText === 'Submit') {
      await handleSubmit();
    } else {
      await handleNext();
    }
  };

  const handleNext = async () => {
    // When "Next" is clicked (experience selected but no resume),
    // still submit the form but skip work experience form
    await handleSubmit();
  };

  const handleSubmit = async () => {
    if (!experience) {
      showToastMessage('Please select experience', 'danger');
      return;
    } else if (!preferredJobTitle || preferredJobTitle.trim() === '') {
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
      form.append('userId', userId || storedUserId || 278879);
      form.append('jobseekerId', jobseekerId ? jobseekerId : 138674);
      form.append('totalExperience', experience);
      form.append('preferredJobIndustry', formData.preferred_job_industry);
      form.append(
        'jobTitle',
        preferredJobTitle || data?.jobTitle || formData?.jobTitle || '',
      );
      form.append('current_salary', currentSalary || '');

      // Add resume file if selected
      if (resumeFile) {
        // Use the resumeFileUri which is already converted to file:// URI
        let fileUri =
          resumeFileUri ||
          resumeFile.uri ||
          resumeFile.fileCopyUri ||
          resumeFile.path;

        // Get file extension from original file name or determine from file type
        let fileExtension = '';
        const originalFileName = resumeFileName || resumeFile.name || '';
        if (originalFileName) {
          fileExtension =
            originalFileName.split('.').pop()?.toLowerCase() || '';
        }

        // Determine correct MIME type and extension
        let fileType = resumeFile.type || resumeFile.mime;

        // If no file extension detected, use isImageFile state to determine
        if (!fileExtension && isImageFile) {
          fileExtension = 'jpeg'; // Default to jpeg for images
        } else if (!fileExtension && isPdfFile) {
          fileExtension = 'pdf';
        }

        if (!fileType) {
          if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
            fileType = 'image/jpeg';
            fileExtension = 'jpeg'; // Use .jpeg for JPEG files
          } else if (fileExtension === 'png') {
            fileType = 'image/png';
          } else if (fileExtension === 'pdf') {
            fileType = 'application/pdf';
          } else {
            // Fallback based on isImageFile state
            if (isImageFile) {
              fileType = 'image/jpeg';
              fileExtension = 'jpeg';
            } else {
              fileType = 'application/pdf';
              fileExtension = 'pdf';
            }
          }
        } else {
          // If we have MIME type, determine extension from it
          if (fileType === 'image/jpeg' || fileType === 'image/jpg') {
            fileExtension = 'jpeg';
            fileType = 'image/jpeg'; // Normalize to image/jpeg
          } else if (fileType === 'image/png') {
            fileExtension = 'png';
          } else if (fileType === 'application/pdf') {
            fileExtension = 'pdf';
          }
        }

        // Generate filename as timestamp with correct extension
        const timestamp = Date.now();
        const fileName = `${timestamp}.${fileExtension}`;

        form.append('cv', {
          uri: fileUri,
          name: fileName,
          type: fileType,
        });
      } else {
        // Append empty file field if no resume selected
        form.append('cv', '');
      }
      console.log('form---1--1---', form);

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

      const data = await response.json();
      console.log('data-----', data);
      if (data && data?.success) {
        showToastMessage(data?.message, 'success');

        console.log('data--1-1---dd--', data);
        let username = await AsyncStorage.getItem('username');
        console.log('username-=-=-=-=-', username);
        let Token = await AsyncStorage.getItem('Token');
        console.log('Token-=-=-=-=-', Token);
        if (
          experience === 'fresher' ||
          (experience && experience !== 'fresher' && resumeFile)
        ) {
          console.log('inside------- submit');
          await signIn(String(Token), username || data?.userData?.fullName);
        } else {
          console.log('inside------- next');
          // Navigate to step 4 instead of showing inline form
          navigation.navigate('RegistrationStep4', {
            userId: userId || storedUserId,
            jobseekerId: jobseekerId,
            currentSalary: currentSalary,
            preferredJobIndustry: formData.preferred_job_industry,
            selectedSkills: selectedSkills,
            fromOtpParam: route?.params?.fromOtpParam,
          });
        }
      }
    } catch (error) {
      // console.error('API Error:', error);
      showToastMessage('Failed to submit. Please try again later.', 'danger');
    }
  };

  const handleJobChange = text => {
    setPreferredJobTitle(text);
    // Also update formData to keep it in sync
    setFormData(prev => ({
      ...prev,
      jobTitle: text,
    }));

    if (text.length > 0) {
      const filtered = jobTitles.filter(item =>
        item?.jobTitle?.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredTitles(filtered);
      // Show suggestions if there are filtered results
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredTitles([]);
      setShowSuggestions(false);
    }
  };

  // Handler functions for job title modal
  const handleJobTitleModalOpen = () => {
    setJobTitleSearchText('');
    setFilteredJobTitles(jobTitles);
    setShowJobTitleModal(true);
  };

  const handleJobTitleModalSearch = text => {
    setJobTitleSearchText(text);
    if (!text.trim()) {
      setFilteredJobTitles(jobTitles);
    } else {
      const filtered = jobTitles.filter(item =>
        item?.jobTitle?.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredJobTitles(filtered);
    }
  };

  const handleJobTitleModalSelect = item => {
    setPreferredJobTitle(item.jobTitle);
    setFormData(prev => ({
      ...prev,
      jobTitle: item.jobTitle,
    }));
    setShowJobTitleModal(false);
    setJobTitleSearchText('');
  };

  // Handler functions for industry modal
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
    setFormData({
      ...formData,
      preferred_job_industry: industry,
    });
    setShowIndustryModal(false);
    setIndustrySearchText('');
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
            {/* Original Form */}
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
                <TouchableOpacity
                  style={styles.industryInput}
                  onPress={handleIndustryModalOpen}>
                  <Text
                    style={[
                      formData?.preferred_job_industry
                        ? styles.industryInputText
                        : styles.industryPlaceholderText,
                    ]}>
                    {formData?.preferred_job_industry || 'Select Industry'}
                  </Text>
                  <Icon name="arrow-drop-down" size={24} color="#535353" />
                </TouchableOpacity>
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
              <TouchableOpacity
                style={styles.jobTitleInput}
                onPress={handleJobTitleModalOpen}>
                <Text
                  style={[
                    preferredJobTitle
                      ? styles.jobTitleInputText
                      : styles.jobTitlePlaceholderText,
                  ]}>
                  {preferredJobTitle || 'Select Job Title'}
                </Text>
                <Icon name="arrow-drop-down" size={24} color="#535353" />
              </TouchableOpacity>
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
                  {!resumeFile && (
                    <>
                      {/* <View style={styles.uploadIconContainer}> */}
                      <Image
                        source={imagePath.download}
                        style={{height: 49, width: 49, marginBottom: 10}}
                        resizeMode="contain"
                      />
                      {/* </View> */}
                      <Text style={styles.uploadInstructionText}>
                        Upload PDF, JPG, JPEG or PNG files
                      </Text>
                      <Text style={styles.uploadSizeText}>
                        Maximum file size 5MB
                      </Text>
                    </>
                  )}

                  {resumeFile ? (
                    <>
                      {/* File Preview - PDF or Image */}
                      <TouchableOpacity
                        style={styles.pdfPreviewContainer}
                        onPress={() => {
                          if (resumeFileUri) {
                            // Check if resumeFileUri is an image URL or file
                            const isImageUrl =
                              isImageFile ||
                              (resumeFileUri &&
                                (resumeFileUri.includes('.jpg') ||
                                  resumeFileUri.includes('.jpeg') ||
                                  resumeFileUri.includes('.png')));

                            // Check if resumeFileUri is a PDF URL or file
                            const isPdfUrl =
                              isPdfFile ||
                              (resumeFileUri &&
                                (resumeFileUri.includes('.pdf') ||
                                  resumeFileUri.toLowerCase().includes('pdf')));

                            // Open modal for both images and PDFs
                            if (isImageUrl || isPdfUrl || resumeFileUri) {
                              setShowPdfModal(true);
                            }
                          }
                        }}
                        activeOpacity={0.8}>
                        {isImageFile && resumeFileUri ? (
                          <Image
                            source={{uri: resumeFileUri}}
                            style={styles.pdfPreview}
                            resizeMode="cover"
                          />
                        ) : (isPdfFile || resumeFileUri?.includes('.pdf')) &&
                          !pdfLoadError &&
                          resumeFileUri &&
                          (resumeFileUri.startsWith('file://') ||
                            resumeFileUri.startsWith('http://') ||
                            resumeFileUri.startsWith('https://')) ? (
                          <Pdf
                            source={{uri: resumeFileUri, cache: true}}
                            style={styles.pdfPreview}
                            trustAllCerts={false}
                            enablePaging={false}
                            horizontal={false}
                            page={1}
                            fitPolicy={0}
                            spacing={0}
                            onLoadComplete={(numberOfPages, filePath) => {
                              console.log(`Number of pages: ${numberOfPages}`);
                              setPdfLoadError(false);
                            }}
                            onError={error => {
                              console.log('PDF Error:', error);
                              setPdfLoadError(true);
                            }}
                          />
                        ) : (
                          <View style={styles.pdfErrorContainer}>
                            <Icon
                              name="description"
                              size={48}
                              color="#FF8D53"
                            />
                            <Text style={styles.pdfErrorSubText}>
                              Tap to view
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      <View style={styles.resumeSelectedContainer}>
                        <TouchableOpacity
                          style={styles.resumeFileInfo}
                          onPress={() => {
                            const fileUri =
                              resumeFile.uri ||
                              resumeFile.fileCopyUri ||
                              resumeFile.path;
                            if (fileUri) {
                              setShowPdfModal(true);
                            }
                          }}
                          activeOpacity={0.8}>
                          <Icon name="description" size={20} color="#FF8D53" />
                          <Text style={styles.resumeFileName} numberOfLines={1}>
                            {resumeFileName}
                          </Text>
                          <TouchableOpacity
                            onPress={e => {
                              e.stopPropagation();
                              handleRemoveResume();
                            }}
                            style={styles.removeResumeButton}>
                            <Icon name="close" size={18} color="#fff" />
                          </TouchableOpacity>
                        </TouchableOpacity>
                      </View>
                    </>
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
                onPress={handleButtonPress}>
                <Text style={styles.continueText}>{getButtonText()}</Text>
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

      {/* Fullscreen PDF Modal */}
      <Modal
        visible={showPdfModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPdfModal(false)}>
        <View style={styles.fullscreenModal}>
          <View style={styles.fullscreenHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPdfModal(false)}>
              <Icon name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.fullscreenContent}>
            {resumeFileUri &&
            (isImageFile ||
              resumeFileUri.includes('.jpg') ||
              resumeFileUri.includes('.jpeg') ||
              resumeFileUri.includes('.png')) ? (
              <Image
                source={{uri: resumeFileUri}}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            ) : resumeFileUri &&
              (isPdfFile ||
                resumeFileUri.includes('.pdf') ||
                resumeFileUri.startsWith('file://') ||
                resumeFileUri.startsWith('http://') ||
                resumeFileUri.startsWith('https://')) ? (
              <Pdf
                source={{uri: resumeFileUri, cache: true}}
                style={styles.fullscreenPdf}
                trustAllCerts={false}
                enablePaging={true}
                horizontal={false}
                fitPolicy={0}
                onError={error => {
                  console.log('PDF Error:', error);
                  showToastMessage('Failed to load PDF', 'danger');
                  setShowPdfModal(false);
                }}
              />
            ) : (
              <View style={styles.fullscreenContent}>
                <Text style={{color: '#fff', textAlign: 'center'}}>
                  Unable to display file
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Industry Selection Modal */}
      <Modal
        visible={showIndustryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowIndustryModal(false)}>
        <TouchableOpacity
          style={styles.industryModalOverlay}
          activeOpacity={1}
          onPress={() => setShowIndustryModal(false)}>
          <TouchableOpacity
            style={styles.industryModalContent}
            activeOpacity={1}
            onPress={e => e.stopPropagation()}>
            <View style={styles.industryModalHeader}>
              <Text style={styles.industryModalTitle}>Select Industry</Text>
              <TouchableOpacity onPress={() => setShowIndustryModal(false)}>
                <Icon name="close" size={24} color="#535353" />
              </TouchableOpacity>
            </View>
            <View style={styles.industryModalSearchContainer}>
              <TextInput
                style={styles.industryModalSearchInput}
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
              style={styles.industryModalOptions}>
              {filteredIndustries.length > 0 ? (
                filteredIndustries.map((industry, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.industryModalOption,
                      formData?.preferred_job_industry === industry &&
                        styles.industryModalOptionSelected,
                    ]}
                    onPress={() => handleIndustryModalSelect(industry)}>
                    <Text
                      style={[
                        styles.industryModalOptionText,
                        formData?.preferred_job_industry === industry &&
                          styles.industryModalOptionTextSelected,
                      ]}>
                      {industry}
                    </Text>
                    {formData?.preferred_job_industry === industry && (
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

      {/* Job Title Selection Modal */}
      <Modal
        visible={showJobTitleModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowJobTitleModal(false)}>
        <TouchableOpacity
          style={styles.jobTitleModalOverlay}
          activeOpacity={1}
          onPress={() => setShowJobTitleModal(false)}>
          <TouchableOpacity
            style={styles.jobTitleModalContent}
            activeOpacity={1}
            onPress={e => e.stopPropagation()}>
            <View style={styles.jobTitleModalHeader}>
              <Text style={styles.jobTitleModalTitle}>Select Job Title</Text>
              <TouchableOpacity onPress={() => setShowJobTitleModal(false)}>
                <Icon name="close" size={24} color="#535353" />
              </TouchableOpacity>
            </View>
            <View style={styles.jobTitleModalSearchContainer}>
              <TextInput
                style={styles.jobTitleModalSearchInput}
                placeholder="Search Job Title"
                placeholderTextColor="#BABFC7"
                value={jobTitleSearchText}
                onChangeText={handleJobTitleModalSearch}
                autoFocus={true}
              />
              <Icon name="search" size={24} color="#535353" />
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={styles.jobTitleModalOptions}>
              {filteredJobTitles.length > 0 ? (
                filteredJobTitles.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.jobTitleModalOption,
                      preferredJobTitle === item.jobTitle &&
                        styles.jobTitleModalOptionSelected,
                    ]}
                    onPress={() => handleJobTitleModalSelect(item)}>
                    <Text
                      style={[
                        styles.jobTitleModalOptionText,
                        preferredJobTitle === item.jobTitle &&
                          styles.jobTitleModalOptionTextSelected,
                      ]}>
                      {item.jobTitle}
                    </Text>
                    {preferredJobTitle === item.jobTitle && (
                      <Icon name="check" size={20} color="#FF8D53" />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.jobTitleNoResultsContainer}>
                  <Text style={styles.jobTitleNoResultsText}>
                    No job titles found
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
  },
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
  fullscreenModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  fullscreenHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    zIndex: 1000,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenPdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  fullscreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  pdfPreviewContainer: {
    width: '100%',
    height: 100,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pdfPreview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  pdfErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
    height: 100,
  },
  pdfErrorSubText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
  jobTitleInput: {
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
  jobTitleInputText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  jobTitlePlaceholderText: {
    flex: 1,
    fontSize: 16,
    color: '#D0D0D0',
  },
  jobTitleModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobTitleModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  jobTitleModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  jobTitleModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#535353',
  },
  jobTitleModalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F4FD',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  jobTitleModalSearchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  jobTitleModalOptions: {
    maxHeight: 400,
  },
  jobTitleModalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  jobTitleModalOptionSelected: {
    backgroundColor: '#FFF5F0',
  },
  jobTitleModalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  jobTitleModalOptionTextSelected: {
    color: '#FF8D53',
    fontWeight: '500',
  },
  jobTitleNoResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  jobTitleNoResultsText: {
    fontSize: 16,
    color: '#999',
  },
});

export default RegistrationS;
