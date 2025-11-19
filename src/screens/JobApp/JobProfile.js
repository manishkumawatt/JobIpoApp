import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  Dimensions,
  Modal,
  Image,
} from 'react-native';
import JobMenu from '../../components/Job/JobMenu';
import IconA from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  PhoneIcon,
  EnvelopeIcon,
  VerticalDashedLine,
  UploadArrowIcon,
  SmallGrayCircle,
  LockIcon,
} from '../JobSvgIcons';
import SimpleHeader from '../../components/SimpleHeader';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardScroll} from '../../component';
import {showToastMessage} from '../../utils/Toast';
import ImageLoadView from '../../utils/imageLoadView';
import DatePicker from 'react-native-date-picker';
import fonts from '../../theme/fonts';
import Pdf from 'react-native-pdf';
import {pick, types} from '@react-native-documents/picker';
import {permissionConfirm} from '../../utils/alertController';
import RNFS from '@exodus/react-native-fs';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import imagePath from '../../theme/imagePath';

const JobProfile = () => {
  const [focusedInput, setFocusedInput] = useState(null);
  const [locationSelected, setLocationSelected] = useState(false);
  const [cv, setCV] = useState('');
  const [cvPdf, setCvPdf] = useState('');
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [fileUri, setFileUri] = useState(null);
  const [fileType, setFileType] = useState('');
  const [fileName, setFileName] = useState('');
  const [isImageFile, setIsImageFile] = useState(false);
  const [isPdfFile, setIsPdfFile] = useState(false);
  const [englishSpeaking, setEnglishSpeaking] = useState('');
  const [preferredLocations, setPreferredLocations] = useState('');
  const [pllat, setPllat] = useState(null);
  const [pllng, setPllng] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPincode, setSelectedPincode] = useState('');
  const [date, setDate] = useState(new Date());
  const [beginDatePicker, setBeginDatePicker] = useState(false);
  const [jobSeekerData, setJobSeekerData] = useState({
    currentLocation: '',
    totalExperience: '',
  });
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [formData, setFormData] = useState({
    photo: '',
    name: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [searchText, setSearchText] = useState('');
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [languageKnown, setLanguageKnown] = useState([]);
  const [employmentType, setEmploymentType] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [preferredJobTitle, setPreferredJobTitle] = useState('');
  const [preferredJobIndustry, setPreferredJobIndustry] = useState('');
  const [currentSalary, setCurrentSalary] = useState('');
  const [jobTitles, setJobTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showJobTitleModal, setShowJobTitleModal] = useState(false);
  const [jobTitleSearchText, setJobTitleSearchText] = useState('');
  const [filteredJobTitles, setFilteredJobTitles] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [profileUserData, setProfileUserData] = useState(null);
  const [profileJobseekerData, setProfileJobseekerData] = useState(null);
  const [jobseekerId, setJobseekerId] = useState('');
  const locationJustUpdatedRef = useRef(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalType, setImageModalType] = useState('profile'); // 'profile' or 'cv'
  const navigation = useNavigation();
  const API_BASE_URL = 'https://jobipo.com/api/v3';
  const AUTH_TOKEN = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';

  // Populate form data when profileUserData is fetched
  useEffect(() => {
    if (profileUserData) {
      // Map gender from API format ("Male"/"Female"/"Other") to form format ("1"/"2"/"3")
      const genderMap = {
        Male: '1',
        Female: '2',
        Other: '3',
      };

      setFormData(prev => ({
        ...prev,
        photo: profileUserData.photo || prev.photo,
        name: profileUserData.fullName || prev.name,
        gender:
          genderMap[profileUserData.gender] ||
          profileUserData.gender ||
          prev.gender,
        dateOfBirth: profileUserData.DOB
          ? convertApiDateToDisplay(profileUserData.DOB)
          : prev.dateOfBirth,
        email: profileUserData.email || prev.email,
      }));
    }
  }, [profileUserData]);

  // Populate jobseeker data when profileJobseekerData is fetched
  useEffect(() => {
    console.log('profileJobseekerDatapppq-----', profileJobseekerData);
    if (profileJobseekerData) {
      // Set employment type, work mode, experience level
      if (profileJobseekerData.preferredEmployementType) {
        setEmploymentType(profileJobseekerData.preferredEmployementType);
      }
      if (profileJobseekerData.workMode) {
        setWorkMode(profileJobseekerData.workMode);
      }
      if (profileJobseekerData.experienceLevel) {
        setExperienceLevel(
          profileJobseekerData.experienceLevel == 'fresher years'
            ? 'fresher'
            : profileJobseekerData.experienceLevel,
        );
      }
      if (profileJobseekerData.jobTitle) {
        setPreferredJobTitle(profileJobseekerData.jobTitle);
      }
      if (profileJobseekerData.preferredJobIndustry) {
        setPreferredJobIndustry(profileJobseekerData.preferredJobIndustry);
      }
      if (
        profileJobseekerData.current_salary ||
        profileJobseekerData.currentSalary
      ) {
        setCurrentSalary(
          profileJobseekerData.current_salary ||
            profileJobseekerData.currentSalary,
        );
      }
      if (
        profileJobseekerData.currentLocation &&
        !locationJustUpdatedRef.current
      ) {
        setPreferredLocations(profileJobseekerData.currentLocation);
      }
      if (
        profileJobseekerData.city &&
        profileJobseekerData.city !== 'undefined'
      ) {
        setSelectedCity(profileJobseekerData.city);
      }
      if (
        profileJobseekerData.state &&
        profileJobseekerData.state !== 'undefined'
      ) {
        setSelectedState(profileJobseekerData.state);
      }
      if (
        profileJobseekerData.pin_code &&
        profileJobseekerData.pin_code !== 'undefined'
      ) {
        setSelectedPincode(profileJobseekerData.pin_code);
      }
      if (profileJobseekerData.englishSpeaking) {
        setEnglishSpeaking(profileJobseekerData.englishSpeaking);
      }
      if (profileJobseekerData.totalExperience) {
        // Update jobSeekerData if needed
        setJobSeekerData(prev => ({
          ...prev,
          totalExperience: profileJobseekerData.totalExperience,
        }));
      }
      if (profileJobseekerData.education) {
        // Update jobSeekerData if needed
        setEducation(prev => ({
          ...prev,
          education: profileJobseekerData.education,
        }));
      }
      console.log(
        'profileJobseekerData.education-=-=-=-=-=',
        profileJobseekerData.education,
      );
      if (profileJobseekerData.experience) {
        // Update jobSeekerData if needed
        setExperience(prev => ({
          ...prev,
          experience: profileJobseekerData.experience,
        }));
      }
      // Parse and set skills
      if (profileJobseekerData.skills) {
        try {
          let parsedSkills = [];
          if (Array.isArray(profileJobseekerData.skills)) {
            parsedSkills = profileJobseekerData.skills;
          } else if (typeof profileJobseekerData.skills === 'string') {
            try {
              const jsonParsed = JSON.parse(profileJobseekerData.skills);
              parsedSkills = Array.isArray(jsonParsed)
                ? jsonParsed
                : jsonParsed.split(',').map(s => s.trim());
            } catch {
              parsedSkills = profileJobseekerData.skills
                .split(',')
                .map(s => s.trim());
            }
          }
          const cleanSkills = parsedSkills
            .map(skill => skill.replace(/^["']|["']$/g, '').trim())
            .filter(skill => skill && skill.length > 0);
          setSelectedSkills(cleanSkills);
        } catch (error) {
          console.error('Error parsing skills:', error);
        }
      }

      // Parse and set language known
      if (profileJobseekerData?.languageKnown) {
        try {
          let parsedLanguages = [];
          const languageData = profileJobseekerData.languageKnown;

          // If already an array, use it directly
          if (Array.isArray(languageData)) {
            parsedLanguages = languageData;
          } else if (typeof languageData === 'string') {
            let jsonString = languageData.trim();

            // Remove outer quotes if present: "\"[...]\"" -> "[...]"
            if (jsonString.startsWith('"') && jsonString.endsWith('"')) {
              jsonString = jsonString.slice(1, -1);
            }

            // Try parsing once
            try {
              let firstParse = JSON.parse(jsonString);

              // If result is still a string, parse again (double-encoded)
              if (typeof firstParse === 'string') {
                try {
                  const secondParse = JSON.parse(firstParse);
                  parsedLanguages = Array.isArray(secondParse)
                    ? secondParse
                    : [];
                } catch {
                  // If second parse fails, check if it's a comma-separated string
                  parsedLanguages = firstParse
                    .split(',')
                    .map(l => l.trim())
                    .filter(l => l);
                }
              } else if (Array.isArray(firstParse)) {
                parsedLanguages = firstParse;
              } else {
                parsedLanguages = [];
              }
            } catch (firstParseError) {
              // If first parse fails, try parsing the original string directly
              try {
                const directParse = JSON.parse(languageData);
                parsedLanguages = Array.isArray(directParse) ? directParse : [];
              } catch {
                // If all parsing fails, treat as comma-separated string
                parsedLanguages = languageData
                  .split(',')
                  .map(l => l.trim())
                  .filter(l => l);
              }
            }
          }

          // Clean up the languages array (remove quotes, trim, filter empty)
          parsedLanguages = parsedLanguages
            .map(lang => {
              if (typeof lang === 'string') {
                return lang.replace(/^["']|["']$/g, '').trim();
              }
              return lang;
            })
            .filter(lang => lang && lang.length > 0);

          setLanguageKnown(parsedLanguages);
          console.log('Parsed languages:', parsedLanguages);
        } catch (error) {
          console.error('Error parsing languages:', error);
          setLanguageKnown([]);
        }
      }

      // Set location coordinates if available
      if (profileJobseekerData.cllat) {
        setPllat(profileJobseekerData.cllat);
      }
      if (profileJobseekerData.cllng) {
        setPllng(profileJobseekerData.cllng);
      }

      // Set current location if available
      if (
        profileJobseekerData.currentLocation &&
        profileJobseekerData.currentLocation !== 'undefined'
      ) {
        setJobSeekerData(prev => ({
          ...prev,
          currentLocation: profileJobseekerData.currentLocation,
        }));
      }
      console.log('profileJobseekerData.cv', profileJobseekerData.cv);
      if (profileJobseekerData.cv && profileJobseekerData.cv !== 'undefined') {
        setCV(profileJobseekerData.cv);
        // Check if CV is an image file
        const cvUrl = profileJobseekerData.cv.toLowerCase();
        const imageExtensions = ['.jpg', '.jpeg', '.png'];
        const isImage = imageExtensions.some(ext => cvUrl.includes(ext));
        setIsImageFile(isImage);
        // Check if CV is a PDF file
        const isPdf = cvUrl.includes('.pdf');
        setIsPdfFile(isPdf);
      }

      // Set city, state, pincode from jobseekerData if available
      if (
        profileJobseekerData.city &&
        profileJobseekerData.city !== 'undefined'
      ) {
        setSelectedCity(profileJobseekerData.city);
        setFormData(prev => ({
          ...prev,
          city: profileJobseekerData.city,
        }));
      }
      if (
        profileJobseekerData.state &&
        profileJobseekerData.state !== 'undefined'
      ) {
        setSelectedState(profileJobseekerData.state);
        setFormData(prev => ({
          ...prev,
          state: profileJobseekerData.state,
        }));
      }
      if (
        profileJobseekerData.pin_code &&
        profileJobseekerData.pin_code !== 'undefined'
      ) {
        setSelectedPincode(profileJobseekerData.pin_code);
        setFormData(prev => ({
          ...prev,
          pincode: profileJobseekerData.pin_code,
        }));
      }
    }
  }, [profileJobseekerData]);

  useEffect(() => {
    fetchSkills();
    fetchJobTitles();
    fetchJobCategories();
  }, []);

  // Update filteredJobTitles when jobTitles changes
  useEffect(() => {
    if (showJobTitleModal) {
      setFilteredJobTitles(jobTitles);
    }
  }, [jobTitles, showJobTitleModal]);
  // Fetch skill options
  useFocusEffect(
    useCallback(() => {
      methodGetProfile();
      // fetchSkills();
      // fetchJobTitles();
      // fetchJobCategories();
    }, []),
  );
  useEffect(() => {
    if (searchText.length >= 2) {
      const filtered = skillOptions.filter(skill =>
        skill.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills([]);
    }
  }, [searchText, skillOptions]);

  const fetchSkills = async () => {
    try {
      const res = await fetch(`https://jobipo.com/api/v2/job-data`, {
        method: 'GET',
      });
      const langData = await res.json();
      const list = JSON.parse(langData?.msg)?.skill?.map(item => item.skill);
      setSkillOptions(list || []);
    } catch (error) {
      // Silently handle error
    }
  };
  const handleSelectSkill = skill => {
    setSearchText('');
    setFilteredSkills([]);

    if (!selectedSkills.includes(skill)) {
      const updated = [...selectedSkills, skill];
      setSelectedSkills(updated);
    }
  };
  const handleRemoveSkill = skillToRemove => {
    const updatedSkills = selectedSkills.filter(
      skill => skill !== skillToRemove,
    );
    setSelectedSkills(updatedSkills);
  };

  const methodGetProfile = async () => {
    try {
      const userID = await AsyncStorage.getItem('UserID');

      if (!userID) {
        showToastMessage('User ID not found. Please login again.', 'danger');
        return;
      }

      const form = new FormData();
      form.append('userID', userID); // Changed to uppercase UserID as API expects

      const response = await fetch(
        `https://jobipo.com/api/v3/view-candidate-profile`,
        {
          headers: {
            // Don't set Content-Type manually - fetch will set it automatically with boundary
            Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          },
          method: 'POST',
          body: form,
        },
      );

      console.log('form-----=--==-=--=-=1', form);
      const data = await response.json();
      console.log('getProfile-----=--==-=--=-=1', data);

      if (data?.success && data?.userData) {
        setProfileUserData(data.userData);
      }
      setJobseekerId(data?.jobseekerId);
      if (data?.success && data?.jobseekerData) {
        setProfileJobseekerData(data?.jobseekerData);
      }

      return data;
    } catch (error) {
      console.error('Error in methodGetProfile:', error);
      showToastMessage('Failed to fetch profile data.', 'danger');
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
  // Language options - can be fetched from API if needed
  const languageOptions = [
    'Hindi',
    'English',
    'Panjabi',
    'Gujarati',
    'Bengali',
    'Tamil',
    'Telugu',
    'Marathi',
    'Kannada',
    'Malayalam',
    'Odia',
    'Assamese',
    'Urdu',
    'Sanskrit',
  ];

  const filteredLanguages = languageOptions.filter(
    lang =>
      lang.toLowerCase().includes(searchText.toLowerCase()) &&
      !languageKnown.includes(lang),
  );

  const handleSelect = lang => {
    setLanguageKnown(prev => [...prev, lang]);
    setSearchText('');
    Keyboard.dismiss();
  };

  const handleRemove = lang => {
    setLanguageKnown(prev => prev.filter(item => item !== lang));
  };

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

  const formatDateInput = text => {
    const cleaned = text.replace(/[^\d]/g, '');

    let formatted = cleaned;

    if (cleaned.length > 2 && cleaned.length <= 4) {
      formatted = cleaned.slice(0, 2) + ' ' + cleaned.slice(2);
    } else if (cleaned.length > 4) {
      formatted =
        cleaned.slice(0, 2) +
        '-' +
        cleaned.slice(2, 4) +
        '-' +
        cleaned.slice(4, 8);
    }

    return formatted;
  };

  // Convert API date format (YYYY-MM-DD) to display format (DD-MM-YYYY)
  function convertApiDateToDisplay(apiDate) {
    if (!apiDate) return '';
    if (/^\d{2}-\d{2}-\d{4}$/.test(apiDate)) return apiDate;
    if (/^\d{4}-\d{2}-\d{2}$/.test(apiDate)) {
      const [year, month, day] = apiDate.split('-');
      return `${day}-${month}-${year}`;
    }
    return apiDate;
  }

  // Convert display format (DD-MM-YYYY) back to API format (YYYY-MM-DD)
  function convertDisplayDateToApi(displayDate) {
    if (!displayDate) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(displayDate)) return displayDate;
    if (/^\d{2}-\d{2}-\d{4}$/.test(displayDate)) {
      const [day, month, year] = displayDate.split('-');
      return `${year}-${month}-${day}`;
    }
    return displayDate;
  }
  console.log('profileJobseekerData', profileJobseekerData);
  const handleSubmit = async () => {
    console.log('selectedSkills-==-=--=-=', selectedSkills);

    // Generate file name with correct extension based on file type
    let fileNameD;
    if (fileName && fileName.includes('.')) {
      // Preserve the original file extension from the selected file
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      fileNameD = `${new Date().getTime()}.${fileExtension}`;
    } else if (isImageFile) {
      // Default to jpg for images if extension not available
      fileNameD = `${new Date().getTime()}.jpg`;
    } else {
      // Default to pdf for documents
      fileNameD = `${new Date().getTime()}.pdf`;
    }
    try {
      const userID = await AsyncStorage.getItem('UserID');

      if (!userID) {
        showToastMessage('User ID not found. Please log in again.', 'danger');
        return;
      }

      const submissionData = new FormData();

      submissionData.append('userID', userID);
      submissionData.append('jobseekerId', jobseekerId);
      submissionData.append('preferredEmployementType', employmentType);
      submissionData.append('workMode', workMode);
      submissionData.append('experienceLevel', experienceLevel);
      submissionData.append('jobTitle', preferredJobTitle);
      submissionData.append('preferredJobIndustry', preferredJobIndustry);
      submissionData.append('current_salary', currentSalary);
      selectedSkills.forEach(skill => {
        submissionData.append('skills[]', skill);
      });
      submissionData.append('currentLocation', preferredLocations);
      submissionData.append('pllat', pllat);
      submissionData.append('pllng', pllng);
      submissionData.append('englishSpeaking', englishSpeaking);
      submissionData.append('languageKnown', JSON.stringify(languageKnown));
      submissionData.append(
        'DOB',
        convertDisplayDateToApi(formData.dateOfBirth),
      );
      submissionData.append('gender', formData.gender);
      submissionData.append('city', formData.city || selectedCity || '');
      submissionData.append('state', formData.state || selectedState || '');
      submissionData.append(
        'pin_code',
        formData.pincode || selectedPincode || '',
      );
      if (photo && photo.uri) {
        submissionData.append('photo', {
          uri: photo.uri,
          name: photo.fileName || 'photo.jpg',
          type: photo.type || 'image/jpeg',
        });
      }
      if (cvPdf && cvPdf !== 'undefined') {
        submissionData.append('cv', {
          uri: cvPdf,
          name: fileNameD,
          type: fileType || 'application/pdf',
        });
      }
      console.log('submissionDatasubmissionData', submissionData);
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

      const data = await res.json();
      console.log('data-=-----==-=-=-=', data);
      if (data?.success) {
        showToastMessage('Profile updated successfully', 'success');
        navigation.navigate('JobPage');
      } else {
        showToastMessage(data?.message || 'Something went wrong.', 'danger');
      }
    } catch (err) {
      showToastMessage('Something went wrong. Please try again.', 'danger');
    }
  };

  const handleJobChange = text => {
    setPreferredJobTitle(text);

    if (text.length > 0) {
      const filtered = jobTitles.filter(item =>
        item?.jobTitle?.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredTitles(filtered);
      setShowSuggestions(true);
    } else {
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
    setShowJobTitleModal(false);
    setJobTitleSearchText('');
  };

  const makeApiRequest = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
          ...options.headers,
        },
        ...options,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // console.error('API request failed:', error);
      throw error;
    }
  };
  const handleSuggestionSelect = item => {
    setPreferredJobTitle(item.jobTitle);
    setShowSuggestions(false);
  };
  const fetchJobCategories = useCallback(async () => {
    try {
      const result = await makeApiRequest('/fetch-job-industry');
      if (result?.status == 1 && result?.data) {
        // const parsed = JSON.parse(result.data);
        // console.log('parsedparsedparsed', parsed);
        setJobCategories(result?.data);
      }
    } catch (error) {
      // console.error('Error fetching job titles:', error);
    }
  }, []);

  // Handle location selection - can be called from location picker screen/modal
  const handleLocationSelect = useCallback(() => {
    setLocationSelected(true);
  }, []);

  // Handle location selection callback from LocationPicker screen
  const handleLocationPickerResult = useCallback(
    (current_location, lat, lng, city, state, pincode, area, selectedState) => {
      console.log(
        'current_locationcurrent_locationcurrent_location',
        current_location,
      );
      console.log('latlatlatlat', lat);
      console.log('lnglnglnglng', lng);
      console.log('citycitycitycity', city);
      console.log('statestatestatestate', state);
      console.log('pincodepincodepincode', pincode);
      console.log('areaareaareaarea', area);
      console.log('selectedStateselectedStateselectedState', selectedState);
      locationJustUpdatedRef.current = true;
      setPreferredLocations(current_location);
      setPllat(lat);
      setPllng(lng);
      setLocationSelected(true); // Mark location as selected
      setSelectedState(state || selectedState);
      setSelectedCity(city);
      setSelectedPincode(pincode);

      setFormData(prev => ({
        ...prev,
        address: area,
        state: state || selectedState,
        city: city,
        pincode: pincode,
      }));

      // Reset the flag after a delay to allow API updates later
      setTimeout(() => {
        locationJustUpdatedRef.current = false;
      }, 2000);
    },
    [handleLocationSelect],
  );

  const pickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
        cropperStatusBarColor: '#000000',
        cropperToolbarColor: '#000000',
        cropperActiveWidgetColor: '#FF8D53',
        cropperToolbarWidgetColor: '#FFFFFF',
        cropperToolbarTitle: 'Edit Photo',
        cropperCancelText: '✕',
        cropperChooseText: '✓',
        hideBottomControls: false,
        showCropGuidelines: true,
        enableRotationGesture: true,
        freeStyleCropEnabled: true,
        cropperCircleOverlay: false,
        includeBase64: false,
        includeExif: true,
        avoidEmptySpaceAroundImage: true,
      });
      console.log('image.path=-=--=--', image.path);
      setPhoto({
        uri: image.path,
        type: image.mime,
        fileName: image.filename,
      });
    } catch (error) {
      console.log('Image pick cancelled or failed:', error);
    }
  };
  const handleUpload = async (uri, type, name) => {
    try {
      const userID = await AsyncStorage.getItem('UserID');
      if (!userID) {
        showToastMessage('User ID not found. Please login again.', 'danger');
        return;
      }

      if (!uri || !type || !name) {
        showToastMessage('Please select a file first', 'danger');
        return;
      }

      const resumeFormData = new FormData();
      resumeFormData.append('image', {
        uri: uri,
        type: type,
        name: name,
      });
      resumeFormData.append('userID', userID);
      console.log('resumeFormData-=-=-=-=-', resumeFormData);
      const updateRes = await fetch(`https://jobipo.com/api/v2/resume-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: resumeFormData,
      });

      const updateJson = await updateRes.json();
      console.log('updateJson-==-=-=d--==-', updateJson);
      if (updateJson && updateJson.status === 1) {
        // await AsyncStorage.setItem('cv', fileName);
        showToastMessage('Resume uploaded successfully!', 'success');
        // Refresh CV state after successful upload
        // Construct proper URL - check if it's already a full URL or just a filename
        let cvUrl = '';
        if (updateJson.data?.cv) {
          const cvPath = updateJson.data.cv;
          if (cvPath.startsWith('http://') || cvPath.startsWith('https://')) {
            cvUrl = cvPath;
          } else {
            // Remove leading slash if present and construct full URL
            const cleanPath = cvPath.startsWith('/')
              ? cvPath.substring(1)
              : cvPath;
            cvUrl = `https://jobipo.com/jobipo.com/public/uploads/users/${cleanPath}`;
          }
        } else if (updateJson.cv) {
          cvUrl = updateJson.cv;
        }
        setCV(cvUrl);
        setPdfLoadError(false); // Reset error state for new CV
      }
    } catch (err) {
      console.error('Error uploading resume:', err);
    }
  };
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

        // Validate file type
        const fileName = file.name || '';
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
        const imageExtensions = ['jpg', 'jpeg', 'png'];

        if (!allowedExtensions.includes(fileExtension)) {
          showToastMessage(
            'Please select PDF, JPG, JPEG or PNG files only',
            'danger',
          );
          return;
        }

        // Check if it's an image file
        const isImage = imageExtensions.includes(fileExtension);
        setIsImageFile(isImage);
        // Check if it's a PDF file (for preview purposes)
        const isPdf = fileExtension === 'pdf';
        setIsPdfFile(isPdf);

        // Store file information in state
        // Prioritize fileCopyUri as it's already a file URI (document picker provides this)
        let fileUri = file.fileCopyUri || file.uri || file.path;
        const fileType = file.type || file.mime || 'application/pdf';

        console.log('Original file URI:', fileUri);
        console.log('fileCopyUri:', file.fileCopyUri);
        console.log('file.uri:', file.uri);
        console.log('File object:', JSON.stringify(file, null, 2));

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

        setFileUri(fileUri);
        setFileType(fileType);
        setFileName(fileName);
        console.log('fileUri-d=-=-=-=-', file);
        setCvPdf(fileUri);
        setCV(fileUri); // Set CV for preview
        setPdfLoadError(false); // Reset error state for new file
        // Automatically upload after selection
        // await handleUpload(fileUri, fileType, fileName);
      }
    } catch (err) {
      if (err?.message !== 'User canceled document picker') {
        // showToastMessage('Error selecting file', 'danger');
      }
    }
  };
  console.log('education-===--==-', education);
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
  const handleSelectResume = async () => {
    methodForPermission('gallery');
  };
  console.log(
    'profileUserData?.photo-=-=-=-=-',
    profileUserData?.photo,
    photo?.uri,
  );
  return (
    <>
      {/* <JobHeader /> */}
      <SimpleHeader title=" Profile" titleColor="#585858" />
      <KeyboardScroll
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}>
        <View style={styles.container}>
          <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
              <View style={styles.profileImageWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    const imageUri =
                      photo?.uri || profileUserData?.photo || formData?.photo;
                    // Only show modal if there's an actual image URI (not default placeholder)
                    if (
                      imageUri &&
                      typeof imageUri === 'string' &&
                      (imageUri.startsWith('http') ||
                        imageUri.startsWith('file://') ||
                        imageUri.startsWith('content://'))
                    ) {
                      setImageModalType('profile');
                      setShowImageModal(true);
                    }
                  }}
                  activeOpacity={0.8}>
                  <ImageLoadView
                    resizeMode="cover"
                    source={
                      photo?.uri || profileUserData?.photo || formData?.photo
                        ? {
                            uri:
                              photo?.uri ||
                              profileUserData?.photo ||
                              formData?.photo,
                          }
                        : imagePath.user
                    }
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.svgBadge}
                  onPress={() => pickImage()}>
                  <LockIcon />
                </TouchableOpacity>
              </View>

              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>
                  {profileUserData?.fullName}
                </Text>
                <View style={styles.profileRow}>
                  <PhoneIcon />
                  <Text style={styles.profileValue}>
                    {' '}
                    {profileUserData?.mobile}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.PersonalContainer}>
            <Text style={styles.header}>Personal Details</Text>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={value =>
                  setFormData(prevData => ({...prevData, email: value}))
                }
                editable={false}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => {
                  setFocusedInput('email');
                  setLocationSelected(true); // Prevent location suggestions
                }}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={formData?.dateOfBirth ? formData?.dateOfBirth : ''}
                onChangeText={value => {
                  const formatted = formatDateInput(value);
                  console.log('formatted', formatted);
                  setFormData(prevData => ({
                    ...prevData,
                    dateOfBirth: formatted,
                  }));
                }}
                keyboardType="numeric"
                maxLength={10}
                onFocus={() => {
                  setFocusedInput('dateOfBirth');
                  setLocationSelected(true); // Prevent location suggestions
                }}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.radioGroup}>
              {[
                {label: 'Male', value: '1'},
                {label: 'Female', value: '2'},
                {label: 'Other', value: '3'},
              ].map(option => (
                <Pressable
                  key={option.value}
                  style={styles.radioWrapper}
                  onPress={() =>
                    setFormData({...formData, gender: option.value})
                  }>
                  <View
                    style={[
                      styles.outerCircle,
                      formData.gender === option.value &&
                        styles.outerCircleActive,
                    ]}>
                    {formData.gender === option.value && (
                      <View style={styles.innerDot} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.PersonalContainer}>
            <Text style={styles.header}>Preferred Job Details</Text>
            <View style={styles.PrefrredjobDetails}>
              <Text style={styles.label}>Work Type</Text>
              <View style={styles.buttonGroup}>
                {['Full Time', 'Part Time', 'Both'].map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.button,
                      employmentType === level && styles.buttonSelected,
                    ]}
                    onPress={() => setEmploymentType(level)}>
                    <Text
                      style={[
                        styles.buttonText,
                        employmentType === level && styles.buttonTextSelected,
                      ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Work Mode</Text>
              <View style={styles.buttonGroup}>
                {['Work from Home', 'On-site', 'Hybrid'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.button,
                      workMode === option && styles.buttonSelected,
                    ]}
                    onPress={() => setWorkMode(option)}>
                    <Text
                      style={[
                        styles.buttonText,
                        workMode === option && styles.buttonTextSelected,
                      ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Skills (up to 10)</Text>
              {/* <Text style={styles.sublabel}>Add only 1 skill at a time</Text> */}

              <TextInput
                placeholder="Add only 1 skill at a time"
                placeholderTextColor="#D0D0D0"
                style={styles.input}
                value={searchText}
                onChangeText={setSearchText}
                onFocus={() => {
                  setFocusedInput('skills');
                  setLocationSelected(true); // Prevent location suggestions
                }}
                onBlur={() => setFocusedInput(null)}
              />

              {filteredSkills.length > 0 && (
                <FlatList
                  data={filteredSkills}
                  keyboardShouldPersistTaps="handled"
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => handleSelectSkill(item)}
                      style={styles.suggestion}>
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  )}
                  style={styles.dropdown}
                />
              )}

              <View style={styles.selectedSkillContainer}>
                {selectedSkills.map((item, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillText}>{item}</Text>
                    <TouchableOpacity onPress={() => handleRemoveSkill(item)}>
                      <Icon name="close" size={17} color="#fff" />\{' '}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <Text style={styles.label}>Total Year of Experience</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={experienceLevel}
                  onValueChange={value => setExperienceLevel(value)}
                  style={{
                    color: experienceLevel ? '#000' : '#D0D0D0',
                  }}
                  dropdownIconColor="#000">
                  <Picker.Item label="Select Experience" value="" />
                  <Picker.Item label="Fresher" value="fresher" />
                  <Picker.Item label="0-1 Years" value="0-1 years" />
                  <Picker.Item label="1-2 Years" value="1-2 years" />
                  <Picker.Item label="2-3 Years" value="2-3 years" />
                  <Picker.Item label="3-5 Years" value="3-5 years" />
                  <Picker.Item label="5-7 Years" value="5-7 years" />
                  <Picker.Item label="7-10 Years" value="7-10 years" />
                </Picker>
              </View>

              <Text style={styles.label}>Preferred Job Title</Text>
              <TouchableOpacity
                style={styles.jobTitleInput}
                onPress={handleJobTitleModalOpen}>
                <Text
                  style={[
                    preferredJobTitle
                      ? styles.inputText
                      : styles.placeholderText,
                  ]}>
                  {preferredJobTitle || 'Select Job Title'}
                </Text>
                <Icon name="arrow-drop-down" size={24} color="#535353" />
              </TouchableOpacity>

              <Text style={styles.label}>Preferred Job Industry</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={preferredJobIndustry}
                  onValueChange={value => setPreferredJobIndustry(value)}
                  style={{
                    color: preferredJobIndustry ? '#000' : '#D0D0D0',
                  }}
                  dropdownIconColor="#000">
                  <Picker.Item
                    label="Select Industry"
                    value=""
                    color="#D0D0D0"
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

              <Text style={styles.label}>
                Current Salary Per Month (Optional){' '}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter current salary"
                keyboardType="numeric"
                placeholderTextColor="#D0D0D0"
                value={currentSalary}
                onChangeText={value => setCurrentSalary(value)}
                onFocus={() => {
                  setFocusedInput('currentSalary');
                  setLocationSelected(true); // Prevent location suggestions
                }}
                onBlur={() => setFocusedInput(null)}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>Preferred Location</Text>
              </View>

              <View style={{}}>
                <Pressable
                  style={styles.locationInput}
                  onPress={() => {
                    navigation.navigate('LocationPicker', {
                      fromEdit: true,
                      current_location: preferredLocations || '',
                      onLocationSelect: handleLocationPickerResult,
                    });
                  }}>
                  <View style={styles.locationTextContainer}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.locationInputText,
                        !preferredLocations && styles.locationPlaceholder,
                      ]}>
                      {preferredLocations || 'Current Location'}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.PersonalContainer}>
            <Text style={styles.header}>Language Known</Text>

            <View style={styles.cardlView}>
              <Text style={styles.cardlViewText}>English Speaking</Text>
              <View style={styles.radioGroupRow}>
                {['Basic', 'Medium', 'Fluent', 'No'].map(level => (
                  //  {['Basic Speaking', 'Intermediate Speaking', 'Fluent Speking'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.radioBtn,
                      englishSpeaking === level && styles.radioBtnActive,
                    ]}
                    onPress={() => setEnglishSpeaking(level)}>
                    <Text
                      style={[
                        styles.radioText,
                        englishSpeaking === level && styles.radioTextActive,
                      ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Search Input */}
            <Text style={styles.label}>Other Languages</Text>

            <TextInput
              style={styles.input}
              placeholder="Type to search and add..."
              value={searchText}
              onChangeText={setSearchText}
            />

            {searchText.length > 0 && filteredLanguages.length > 0 && (
              <FlatList
                data={filteredLanguages}
                keyExtractor={(item, index) => index.toString()}
                style={styles.suggestionList}
                keyboardShouldPersistTaps="handled" // <-- Important fix
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    style={styles.suggestionItem}>
                    <Text style={styles.suggestionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <View style={styles.selectedWrapper}>
              {languageKnown.map((lang, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{lang}</Text>
                  <TouchableOpacity onPress={() => handleRemove(lang)}>
                    <Text style={styles.removeIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.PersonalContainer}>
            <View
              style={[
                styles.ExperienceSection,
                {
                  marginTop: 10,
                },
              ]}>
              <Text style={styles.Experience}>Education Details</Text>
              <View style={styles.infoValue}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    navigation.navigate('EditEducation', {
                      jobSeekerData: education,
                      experience: experience,
                      profileJobseekerData: profileJobseekerData,
                      data: null,
                      addNew: true,
                      jobseekerId: jobseekerId,
                    });
                  }}>
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              ListEmptyComponent={() => (
                <View style={styles.card}>
                  <Text style={styles.skillsText}>No education added yet.</Text>
                </View>
              )}
              data={parseIfArrayString(profileJobseekerData?.education)}
              keyExtractor={item => item?.id}
              renderItem={({item, index}) => {
                return (
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.mainContainer}>
                        <View style={styles.iconContainer}>
                          <EnvelopeIcon />
                        </View>
                        <View style={{marginBottom: 6}}>
                          <VerticalDashedLine height={30} />
                        </View>
                        <SmallGrayCircle />
                      </View>
                      <View style={styles.jobDetails}>
                        <Text style={styles.jobTitle}>
                          {item?.degree ? item.degree : 'Degree Not Mentioned'}
                        </Text>
                        <Text style={styles.companyName}>
                          {item?.collegeName
                            ? item.collegeName
                            : 'Institute Name  Not Mentioned'}
                        </Text>

                        <View style={styles.section}>
                          <Text style={styles.sectionValue}>
                            Session - {item?.yearOfCompletion}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.jobEdit}
                        onPress={() =>
                          navigation.navigate('EditEducation', {
                            jobSeekerData: education,
                            experience: experience,
                            profileJobseekerData: profileJobseekerData,
                            data: item,
                            index,
                            jobseekerId: jobseekerId,
                          })
                        }>
                        <IconA name="edit" size={12} color="#FF8D53" />
                        <Text style={styles.jobEditB}>Edit</Text>
                      </TouchableOpacity>
                    </View>

                    {/* <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>Batch of {item?.startDate}</Text>
                  </View> */}
                  </View>
                );
              }}
            />
          </View>

          <View style={styles.PersonalContainer}>
            <View
              style={[
                styles.ExperienceSection,
                {
                  marginTop: 10,
                },
              ]}>
              <Text style={styles.Experience}>Work Experience</Text>
              <View style={styles.infoValue}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() =>
                    navigation.navigate('EditExperience', {
                      jobSeekerData: education,
                      experience: experience,
                      profileJobseekerData: profileJobseekerData,
                      data: null,
                      addNew: true,
                      jobseekerId: jobseekerId,
                    })
                  }>
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              ListEmptyComponent={() => (
                <View style={styles.card}>
                  <Text style={styles.skillsText}>
                    No experience added yet.
                  </Text>
                </View>
              )}
              data={parseIfArrayString(profileJobseekerData?.experience)}
              keyExtractor={item => item?.id}
              renderItem={({item, index}) => {
                return (
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.mainContainer}>
                        <View style={styles.iconContainer}>
                          <EnvelopeIcon />
                        </View>
                        <View style={{marginBottom: 6}}>
                          <VerticalDashedLine height={40} />
                        </View>
                        <SmallGrayCircle />
                      </View>
                      <View style={styles.jobDetails}>
                        <View style={styles.jobDetailsCard}>
                          <Text style={styles.jobTitle}>
                            {item?.jobTitle
                              ? item.jobTitle
                              : 'Job Title  Not Mentioned'}
                          </Text>
                          <TouchableOpacity
                            style={styles.jobEdit}
                            onPress={() =>
                              navigation.navigate('EditExperience', {
                                jobSeekerData: education,
                                experience: experience,
                                profileJobseekerData: profileJobseekerData,
                                data: item,
                                index,
                                jobseekerId: jobseekerId,
                              })
                            }>
                            <IconA name="edit" size={12} color="#FF8D53" />
                            <Text style={styles.jobEditB}>Edit</Text>
                          </TouchableOpacity>
                        </View>

                        <Text style={styles.companyName}>
                          {item?.companyName
                            ? item.companyName
                            : 'Company Name  Not Mentioned'}
                        </Text>

                        <View style={styles.sectionContainerIt}>
                          <View style={styles.section}>
                            <Text style={styles.sectionValue}>
                              {item?.industry
                                ? item.industry
                                : 'Industry Name  Not Mentioned'}{' '}
                            </Text>
                          </View>
                          <View style={styles.section}>
                            <Text style={styles.sectionValue}>
                              {item?.totalWorkingMonths
                                ? `${item.totalWorkingMonths} Months`
                                : '0 Month'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>

          <View style={styles.resumecontainer}>
            {cv ? (
              <>
                {/* File Preview - PDF or Image */}
                <TouchableOpacity
                  style={styles.pdfPreviewContainer}
                  onPress={() => {
                    if (cv) {
                      // Check if cv is an image URL or file
                      const isImageUrl =
                        isImageFile ||
                        (cv &&
                          (cv.includes('.jpg') ||
                            cv.includes('.jpeg') ||
                            cv.includes('.png')));

                      // Check if cv is a PDF URL or file
                      const isPdfUrl =
                        isPdfFile ||
                        (cv &&
                          (cv.includes('.pdf') ||
                            cv.toLowerCase().includes('pdf')));

                      if (isImageUrl) {
                        setImageModalType('cv');
                        setShowImageModal(true);
                      } else if (isPdfUrl || cv) {
                        // Open PDF modal for PDFs or any other file type
                        setShowPdfModal(true);
                      }
                    }
                  }}
                  activeOpacity={0.8}>
                  {isImageFile && cv ? (
                    <Image
                      source={{uri: cv}}
                      style={styles.pdfPreview}
                      resizeMode="cover"
                    />
                  ) : (isPdfFile || cv?.includes('.pdf')) &&
                    !pdfLoadError &&
                    cv &&
                    (cv.startsWith('file://') ||
                      cv.startsWith('http://') ||
                      cv.startsWith('https://')) ? (
                    <Pdf
                      source={{uri: cv, cache: true}}
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
                        // Set error state to show fallback UI when PDF fails to load
                        // This handles trust manager errors and other PDF loading issues
                        setPdfLoadError(true);
                      }}
                    />
                  ) : (
                    <View style={styles.pdfErrorContainer}>
                      <Icon name="description" size={48} color="#FF8D53" />
                      <Text style={styles.pdfErrorSubText}>Tap to view</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {/* Update Resume Button */}
                <TouchableOpacity
                  style={styles.updateResumeButton}
                  onPress={handleSelectResume}
                  // onPress={() =>
                  //   navigation.navigate('ResumeUpload', jobSeekerData)
                  // }
                >
                  <Icon name="edit" size={18} color="#fff" />
                  <Text style={styles.updateResumeText}>Update Resume</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Icon + Dashed Line */}
                <View style={styles.iconWrapper}>
                  <View style={styles.circle}>
                    <UploadArrowIcon size={24} />
                  </View>
                </View>
                {/* Info Text */}
                <Text style={styles.infoText}>
                  Upload PDF, JPG, JPEG or PNG files
                </Text>
                <Text style={styles.infoText}>Maximum file size 5MB</Text>

                {/* Upload Button */}
                <TouchableOpacity
                  style={styles.uploadBox}
                  onPress={
                    () => handleSelectResume()
                    // navigation.navigate('ResumeUpload', jobSeekerData)
                  }>
                  <Text style={styles.uploadText}>+ Add your resume</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* <View style={styles.sectionContainer}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <IconD name="file-pdf-o" size={24} color="#0d4574" />

              </View>
              <View style={styles.jobDetails}>
                <Text style={styles.jobTitle}>Upload Your Resume</Text>
                <Text style={styles.companyName}>{cv}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('ResumeUpload', jobSeekerData)}>
                <IconA name="edit" size={20} color="#2d8659" />
              </TouchableOpacity>
            </View>
          </View> */}

          <TouchableOpacity
            style={styles.uploadDetailsBox}
            onPress={handleSubmit}>
            <Text style={styles.uploadDetailsText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </KeyboardScroll>

      {beginDatePicker && (
        <DatePicker
          modal
          title={'Select date of birth'}
          mode="date"
          open={beginDatePicker}
          date={date}
          onConfirm={date => {
            const formatted = convertApiDateToDisplay(
              date.toISOString().split('T')[0],
            );
            setFormData(prev => ({
              ...prev,
              dateOfBirth: formatted,
            }));
            setBeginDatePicker(false);
          }}
          onCancel={() => {
            setBeginDatePicker(false);
          }}
          theme="light"
          maximumDate={new Date()}
          buttonColor={'#0095FF'}
        />
      )}

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
            {cv &&
            (isImageFile ||
              cv.includes('.jpg') ||
              cv.includes('.jpeg') ||
              cv.includes('.png')) ? (
              <Image
                source={{uri: cv}}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            ) : cv &&
              (isPdfFile ||
                cv.includes('.pdf') ||
                cv.startsWith('file://') ||
                cv.startsWith('http://') ||
                cv.startsWith('https://')) ? (
              <Pdf
                source={{uri: cv, cache: true}}
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

      {/* Job Title Selection Modal */}
      <Modal
        visible={showJobTitleModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowJobTitleModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowJobTitleModal(false)}>
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={e => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Job Title</Text>
              <TouchableOpacity onPress={() => setShowJobTitleModal(false)}>
                <Icon name="close" size={24} color="#535353" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalSearchContainer}>
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search Job Title"
                placeholderTextColor="#BABFC7"
                value={jobTitleSearchText}
                onChangeText={handleJobTitleModalSearch}
                autoFocus={true}
              />
              <Icon name="search" size={24} color="#535353" />
            </View>
            <ScrollView style={styles.modalOptions}>
              {filteredJobTitles.length > 0 ? (
                filteredJobTitles.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modalOption,
                      preferredJobTitle === item.jobTitle &&
                        styles.modalOptionSelected,
                    ]}
                    onPress={() => handleJobTitleModalSelect(item)}>
                    <Text
                      style={[
                        styles.modalOptionText,
                        preferredJobTitle === item.jobTitle &&
                          styles.modalOptionTextSelected,
                      ]}>
                      {item.jobTitle}
                    </Text>
                    {preferredJobTitle === item.jobTitle && (
                      <Icon name="check" size={20} color="#FF8D53" />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No job titles found</Text>
                </View>
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Fullscreen Image Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}>
        <View style={styles.fullscreenModal}>
          <View style={styles.fullscreenHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowImageModal(false)}>
              <Icon name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.fullscreenContent}>
            {imageModalType === 'cv' && cv ? (
              <Image
                source={{uri: cv}}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={{
                  uri:
                    photo?.uri ||
                    profileUserData?.photo ||
                    formData?.photo ||
                    imagePath.user,
                }}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </Modal>

      <JobMenu />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F4FD',
    padding: 16,
    paddingBottom: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
    width: 24,
  },
  text: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  skillsList: {
    justifyContent: 'space-between',
  },
  skillBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  skillText: {
    fontSize: 14,
    color: '#333',
  },
  profileImageWrapper: {
    position: 'relative', // Needed for absolute positioning inside it
    width: 80,
    height: 80,
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  svgBadge: {
    position: 'absolute',
    right: 2,
    bottom: -4,
    backgroundColor: 'white', // Optional: To make it pop
    borderRadius: 30,
    padding: 6,
    backgroundColor: '#FF8D53',
  },
  profileSection: {
    // marginTop: 6,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  // profileImage: {
  //   width: 70,
  //   height: 70,
  //   borderRadius: 50,
  //   marginRight: 16,
  // },

  profileTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8D53',
    marginBottom: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileIcon: {
    marginRight: 8,
  },
  profileValue: {
    color: '#000',
  },
  profileshare: {
    marginTop: 7,
    color: '#2d8659',
  },
  sectionContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },

  experienceItem: {
    marginBottom: 8,
  },
  roleName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },

  industry: {
    fontSize: 13,
    color: '#777',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skill: {
    backgroundColor: '#FF8D53',
    color: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  educationItem: {
    marginBottom: 8,
  },
  degree: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  institution: {
    fontSize: 14,
    color: '#555',
  },
  graduationYear: {
    fontSize: 13,
    color: '#777',
  },
  Experience: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  Arrow: {
    flexDirection: 'row',
  },
  ExperienceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 6,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    margin: 5,
    paddingTop: 15,
    marginBottom: 10,
    color: '#535353',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    margin: 5,
    marginBottom: 20,
  },
  suggestionBoxContainer: {
    zIndex: 1000,
    elevation: 5,
  },
  suggestionBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    maxHeight: 300,
    // margin: 5,
    // marginBottom: 20,
  },
  jobTitleInput: {
    paddingLeft: 8,
    paddingRight: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingVertical: 10,
    // borderWidth: 1,
    // borderColor: '#D0D0D0',
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
    color: '#D0D0D0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#535353',
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F4FD',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalSearchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  modalOptions: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionSelected: {
    backgroundColor: '#FFF5F0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalOptionTextSelected: {
    color: '#FF8D53',
    fontWeight: '500',
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
  },
  PrefrredjobDetails: {
    paddingBottom: 10,
  },
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between'},
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconContainer: {
    backgroundColor: '#F5F4FD',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    alignItems: 'center',
  },

  jobTitle: {fontSize: 16, fontWeight: 'bold', color: '#222'},
  companyName: {fontSize: 14, color: '#555', paddingVertical: 10},
  jobDetails: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 4,
  },
  jobDetailsCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionContainerIt: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // gap: 4,
  },

  section: {
    marginTop: 6,
    // flexBasis: '50%',
  },

  sectionValue: {
    fontSize: 12,
    color: '#535353',
    fontWeight: '400',
    backgroundColor: '#F5F4FD',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    flexShrink: 1,
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
  },

  skillsText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    marginTop: 12,
    marginLeft: 54,
    backgroundColor: '#F1F1F1',
    borderRadius: 5,
    padding: 6,
  },
  dateText: {fontSize: 12, color: '#555', textAlign: 'center'},
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  infoLabel: {fontSize: 14, color: '#555'},
  infoValue: {fontSize: 14, fontWeight: '600', color: '#222'},
  educationHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 16,
    marginBottom: 8,
    color: '#222',
  },
  addButton: {alignSelf: 'flex-start', marginLeft: 16, marginTop: 8},
  addButtonText: {fontSize: 14, color: '#535353', fontWeight: '400'},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    // elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FF8D53',
    textAlign: 'center',
  },
  input: {
    // borderWidth: 1,
    // borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    width: '100%',
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: '#ffffff',
  },
  input_state: {
    // borderWidth: 1,
    // borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    width: '100%',
    // marginBottom: 20,
    marginTop: 10,
    backgroundColor: '#ffffff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  modalButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#FF8D53',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    // elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skillsContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  dotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // dotIcon: {
  //   marginHorizontal: 1,
  // },

  radioGroup: {
    flexDirection: 'row',
    marginVertical: 10,
  },

  radioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },

  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#585858',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  outerCircleActive: {
    borderColor: '#FF8D53',
    backgroundColor: '#FF8D53',
  },

  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },

  radioLabel: {
    marginLeft: 8,
    color: '#333',
    fontSize: 14,
  },
  label: {
    marginLeft: 4,
    color: '#535353',
    fontSize: 15,
    fontWeight: '500',
  },
  dropdown: {
    marginTop: 5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    maxHeight: 350,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  inputFlex: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 4,
    backgroundColor: '#ffffff',
  },
  selectedSkillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 4,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8D53',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    // margin: 5,
  },

  skillText: {
    fontSize: 14,
    marginRight: 5,
    color: '#fff',
  },
  removeText: {
    fontWeight: 'bold',
    color: 'red',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 9,
  },
  button: {
    //   minWidth: "45%",
    // borderWidth: 1, borderColor: "#ccc",
    paddingVertical: 7,
    paddingHorizontal: 17,
    borderRadius: 19,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    marginLeft: 9,
    marginBottom: 8,
  },
  buttonText: {color: '#333'},
  buttonTextSelected: {color: '#fff'},
  buttonSelected: {backgroundColor: '#FF8D53'},

  pickerWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    height: 45,
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    marginVertical: 10,
  },

  picker: {
    color: '#585858',
    width: '100%',
    marginTop: -4,
    paddingHorizontal: 10,
  },

  PersonalContainer: {
    width: '96%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#D0D0D0',
    alignSelf: 'center',
    // paddingVertical: 2,
  },
  radioGroupRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // rowGap: 10,
    columnGap: 6,
  },

  radioBtn: {
    // borderWidth: 1,
    // borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
  },
  cardlViewText: {
    fontSize: 15,
    color: '#000',
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 4,
  },

  radioBtnActive: {
    backgroundColor: '#FF8D53',
  },

  radioText: {
    color: '#333',
    fontWeight: '600',
  },

  radioTextActive: {
    color: '#fff',
  },
  jobEdit: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  jobEditB: {
    color: '#FF8D53',
    fontSize: 10,
  },
  resumecontainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    // elevation: 2,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 8,
  },
  circle: {
    backgroundColor: '#F5F4FD',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  uploadBox: {
    marginTop: 12,
    backgroundColor: '#F5F4FD',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
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
  updateResumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF8D53',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    gap: 8,
  },
  updateResumeText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    fontFamily: fonts.Montserrat_SemiBold,
  },
  pdfErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
    height: 100,
  },
  pdfErrorText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginTop: 12,
    fontFamily: fonts.Montserrat_SemiBold,
  },
  pdfErrorSubText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontFamily: fonts.Montserrat_Regular,
  },
  uploadDetailsBox: {
    marginTop: 12,
    backgroundColor: '#FF8D53',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '70%',
    alignSelf: 'center',
  },
  uploadDetailsText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '900',
    alignSelf: 'center',
  },
  suggestionList: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 14,
  },
  selectedWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8D53',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {color: 'white', fontSize: 14, marginRight: 6},
  removeIcon: {color: 'white', fontWeight: 'bold', fontSize: 14},
  locationInput: {
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    marginHorizontal: 1,
    height: 45,
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginVertical: 5,
    // borderColor: '#C7CACB',
    // borderWidth: 1,
    justifyContent: 'flex-start',
  },
  locationTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  locationInputText: {
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 11,
    fontFamily: fonts.Montserrat_Regular,
  },
  locationPlaceholder: {
    color: '#BABFC7',
  },
  locationSubText: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 11,
    marginTop: 2,
    fontFamily: fonts.Montserrat_Regular,
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
});

export default JobProfile;
