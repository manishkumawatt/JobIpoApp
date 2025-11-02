import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  Button,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import JobHeader from '../../components/Job/JobHeader';
import JobMenu from '../../components/Job/JobMenu';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IconA from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import IconD from 'react-native-vector-icons/FontAwesome';
import DotIcon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JobProfileOld = () => {
  const [currentField, setCurrentField] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [certifications, setCertifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [experience, setExperience] = useState('1 year');
  const [salary, setSalary] = useState('₹ 1,20,000');
  const [noticePeriod, setNoticePeriod] = useState('Less than 15 days');
  const [certification, setCertification] = useState('');
  const [cv, setCV] = useState('');
  const [pic, setPic] = useState(
    'iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAgMAAACJFjxpAAAADFBMVEXFxcX////p6enW1tbAmiBwAAAFiElEQVR4AezAgQAAAACAoP2pF6kAAAAAAAAAAAAAAIDbu2MkvY0jiuMWWQoUmI50BB+BgRTpCAz4G6C8CJDrC3AEXGKPoMTlYA/gAJfwETawI8cuBs5Nk2KtvfiLW+gLfK9m+r3X82G653+JP/zjF8afP1S//y+An4/i51//AsB4aH+/QPD6EQAY/zwZwN8BAP50bh786KP4+VT+3fs4/noigEc+jnHeJrzxX+NWMDDh4g8+EXcnLcC9T8U5S/CdT8bcUeBEIrwBOiI8ki7Ba5+NrePgWUy89/nYyxQ8Iw3f+pWY4h1gb3eAW7sDTPEOsLc7wK1TIeDuDB+I/OA1QOUHv/dFsZQkhKkh4QlEfOULYz2nGj2/Nn1LmwR/86VxlCoAW6kCsHRGANx1RgCMo5Qh2EsZgrXNQZZShp5Liv7Il8eIc5C91EHY2hxk6bwYmNscZIReDBwtCdhbErC1JGBpScBcOgFMLQsZMQs5Whayd+UQsLYsZGlZyNyykKllISNmIUfAwifw8NXvTojAjGFrdYi11SGWVoeYWx1i6lmQCiEjFkKOVgjZ+xxIhZCtFULWHkCqxCw9gNQKmP9vNHzipdEPrRcxtVbAeDkAvve0iM2QozVD9hfjhp4YP/UrkJYDbD2AtBxgfSkAvvHEeNcDSAsilgtAWxIy91J8AXgZAJ5e33+4tuACcAG4AFwALgBXRXQB6AFcB5MXAuA6nl9/0Vx/011/1V5/1/dfTPJvRtdnu/zL6beeFO/7r+fXBYbrEkt/j+i6ytXfpuvvE/ZXOnsA/a3a/l5xf7O6v1t+Xe/vOyz6HpO8yyboM8o7rfJes77bru83THk48p7TvOs27zvOO6/73vO++z7l4cgnMPQzKPopHC0N9noSSz6LJp/Gk88jyicy5TOp6qlc+VyyfDJbPpuuns6XzyfMJzTmMyrrKZ35nNJ8Ums+q7af1tvPK+4nNodEnPKp3fnc8npyez67/qVP7+/fL8hfcMjfsOhf8cjfMclfcnn9+BkOnLECP8Q58OYeyJ40eoyF6Ee/En/JHlP6mIlRVXprF4BxtAvArV0AxtEuALd2ARhHuwDc2gVgHPX/hFv9fMBddjIGeKg/WCxlCsI46u+Ga5mCcJd+sIG9UkGAW32ZbApFAHhod4Bb3eo04h3god0BbiUHYApVCNjbHeBW+QDAXT4a7qg7r7e214057vg0QhkEHkoSwq0kIdydXw4/Q3H8hjYJ3vL0WConBJhCHQaOToeBrU0BljYFmEoVgHGUKgAPnREAt84IgLuqFgAYSUEOAHszDwuAtSkHAZhLGYIpdCLgKGUIHtocZG1zkLmUIRhxDnJU1RDA1uYga5uDzKUOwhTnIEfnxcDe5iBrcyQAYGlzkKkUYhhxDrKXQgxbSwLWUohhbknA1JKAEZOAvSUBW0sC1pYEzC0JmFoSMMJyCDhaFrK3JGDtyiFgaVnI3LKQqWUhI2YhR8tC9paFrC0LWVoWMrcsZGpZyIhZyNGykL2rSIGtlQHWVgZYWhlgbmWAqZUBRiwDHK0MsLcywNbKAGsOoNUhllaHmFsdYmp1iBHrEEerQ+w5gFYI2VodYm11iKXVIeYcQCuETK0QMmIh5MgBtELI3gohWyuErDmAVolZWiFkzgG0SszUKjGjfj6gVmKOVonZcwCtFbB9HQC+ozWDbz1bvGu9iKW1AuYcQOtFTLEX1GbIaFegN0OOHEBrhuw5gNYM2XIArRuz5gDacoB3bTnAEktxXQ4wfw0AvveM8b4tiJjSJOwLIsbXsAKeNeKCiOO3D+AVbUl0AfjGs8ZPbUnIdgFoa1LWC0BblfMuB9AeC1j6gqQE0J9LmC8AOYD2ZMb7i4bt2ZTpWoHfPoB7Tj2fXzT8N1X41vkq/QHOAAAAAElFTkSuQmCC',
  );

  const [skills, setSkills] = useState([]);
  const [jobSeekerData, setJobSeekerData] = useState({
    fullName: '',
    gender: '',
    DOB: '',
    contactNumber1: '',
    emailID: '',

    jobseekerId: '',
    userID: users?.userId,
    languageKnown: JSON.stringify([]),
    preferredLocation: '',
    currentLocation: '',
    homeTown: '',
    education: JSON.stringify([]),
    educationLevel: '',
    certification: '',
    skills: JSON.stringify([]),
    jobPreference: '',
    preferredJobCategory: '',
    preferredJobType: '',
    preferredEmployementType: '',
    experience: JSON.stringify([]),
    totalExperience: '',
    cv: '',
  });

  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const fetchedSkills = [
      'HTML5',
      'CSS',
      'JavaScript',
      'MySQL',
      'AWS',
      'GitHub',
    ];
    setSkills(fetchedSkills);
  }, []);

  useFocusEffect(
    useCallback(() => {
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

          // // console.log('API Response:', sliderDataApi);

          if (sliderDataApi.logout !== 1) {
            const parsedMsg = JSON.parse(sliderDataApi?.msg);
            const userData = parsedMsg?.users;
            const jobSeekerData = parsedMsg?.jobseeker;

            // // console.log('Parsed User Data:', userData);
            // // console.log('Parsed Job Seeker Data:', jobSeekerData);

            setUsers(userData);

            const certificationName =
              await AsyncStorage.getItem('certification');
            const cv = await AsyncStorage.getItem('cv');
            setCertification(certificationName);
            setCV(cv);

            if (jobSeekerData) {
              setJobSeekerData({
                ...jobSeekerData,
                userID: userData?.userID,
                fullName: userData?.fullName,
                gender: userData?.gender,
                DOB: userData?.DOB,
                contactNumber1: userData?.contactNumber1,
                emailID: userData?.emailID,
              });
            } else {
              setJobSeekerData({
                fullName: userData?.fullName,
                gender: userData?.gender,
                DOB: userData?.DOB,
                contactNumber1: userData?.contactNumber1,
                emailID: userData?.emailID,

                jobseekerId: '',
                userID: userData?.userID,
                languageKnown: JSON.stringify([]),
                preferredLocation: '',
                currentLocation: '',
                homeTown: '',
                education: JSON.stringify([]),
                educationLevel: '',
                certification: '',
                skills: JSON.stringify([]),
                jobPreference: '',
                preferredJobCategory: '',
                preferredJobType: '',
                preferredEmployementType: '',
                experience: JSON.stringify([]),
                totalExperience: '',
                cv: '',
              });
            }

            setisLoading(false);
          } else {
            signOut();
          }
        } catch (error) {
          Alert.alert('Error', 'Something went wrong.');
        }
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

  const navigation = useNavigation();

  // // console.log(users);

  function convertToYearsAndMonths(totalMonths) {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return {years, months};
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
      } catch (err) {
        // console.warn('Invalid JSON array string:', value);
      }
    }

    return value;
  }

  // // console.log('Gender value:', users?.gender);

  return (
    <>
      {/* <JobHeader /> */}
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
              {users?.Pic ? (
                <Image
                  source={{uri: 'data:image/png;base64,' + users['Pic']}}
                  style={styles.profileImage}
                />
              ) : (
                <Image
                  source={{uri: 'data:image/png;base64,' + pic}}
                  style={styles.profileImage}
                />
              )}
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>{users['fullName']}</Text>
                <View style={styles.profileRow}>
                  <Icon
                    name="briefcase-outline"
                    size={16}
                    color="#555"
                    style={styles.profileIcon}
                  />
                  <Text style={styles.profileValue}>
                    {users['contactNumber1']}
                  </Text>
                </View>
                {/* <View style={styles.profileRow}>
                  <Icon name="location-outline" size={16} color="#555" style={styles.profileIcon} />
                  <Text style={styles.profileValue}>{users?.address}</Text>
                </View> */}
              </View>
            </View>
          </View>

          <Text style={styles.header}>About Me</Text>

          <View style={styles.sectionContainer}>
            <View style={styles.ExperienceSection}>
              <Text style={styles.Experience}>Personal Details</Text>
              <View style={styles.infoValue}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() =>
                    navigation.navigate('AddPersonalDetails', {
                      users,
                      jobSeekerData,
                    })
                  }>
                  <Text style={styles.addButtonText}>
                    <IconA
                      name="keyboard-arrow-right"
                      size={20}
                      color="#2d8659"
                    />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {users?.fullName ||
            users?.gender ||
            users?.DOB ||
            users?.contactNumber1 ||
            users?.emailId ? (
              <View style={{padding: 10}}>
                {/* {users?.fullName && (
    <View style={styles.row}>
      <FontAwesome name="user" size={18} color="#777" style={styles.icon} />
      <Text style={styles.text}>{users.fullName}</Text>
    </View>
  )} */}

                {users?.gender && (
                  <View style={styles.row}>
                    <FontAwesome
                      name="venus-mars"
                      size={18}
                      color="#777"
                      style={styles.icon}
                    />
                    <Text style={styles.text}>
                      {users.gender == '1'
                        ? 'Male'
                        : users.gender == '2'
                          ? 'Female'
                          : ''}
                    </Text>
                  </View>
                )}

                {users?.DOB && (
                  <View style={styles.row}>
                    <FontAwesome
                      name="birthday-cake"
                      size={18}
                      color="#777"
                      style={styles.icon}
                    />
                    <Text style={styles.text}>{users.DOB}</Text>
                  </View>
                )}

                {/* {users?.contactNumber1 && (
    <View style={styles.row}>
      <FontAwesome name="phone" size={18} color="#777" style={styles.icon} />
      <Text style={styles.text}>{users.contactNumber1}</Text>
    </View>
  )} */}

                {users?.emailID && (
                  <View style={styles.row}>
                    <FontAwesome
                      name="envelope"
                      size={18}
                      color="#777"
                      style={styles.icon}
                    />
                    <Text style={styles.text}>{users.emailID}</Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.skillsText}>
                No personal details added yet.
              </Text>
            )}
          </View>

          <View
            style={[
              styles.ExperienceSection,
              {
                marginTop: 10,
              },
            ]}>
            <Text style={styles.Experience}>Preferred Job Details</Text>
            <View style={styles.infoValue}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  navigation.navigate('EditJobDetails', {
                    jobSeekerData,
                    data: null,
                  })
                }>
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            ListEmptyComponent={() => (
              <View style={styles.card}>
                <Text style={styles.skillsText}>No Job Details added yet.</Text>
              </View>
            )}
            data={parseIfArrayString(jobSeekerData?.experience)}
            keyExtractor={item => item?.id}
            renderItem={({item, index}) => {
              return (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                      <IconA name="apartment" size={24} color="#0d4574" />
                    </View>
                    <View style={styles.jobDetails}>
                      <Text style={styles.jobTitle}>
                        {item?.preferred_job_Title}
                      </Text>
                      <Text style={styles.companyName}>
                        {item?.preferred_job_industry}
                      </Text>
                      <Text style={styles.companyName}>{item?.workMode}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('EditJobDetails', {
                          jobSeekerData,
                          data: item,
                          index,
                        })
                      }>
                      <IconA name="edit" size={20} color="#2d8659" />
                    </TouchableOpacity>
                  </View>

                  {/* <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Job role</Text>
                    <Text style={styles.sectionValue}>{item?.jobRole}</Text>
                  </View> */}

                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Industry</Text>
                    <Text style={styles.sectionValue}>{item?.industry}</Text>
                  </View>

                  {/* <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Skills</Text>
                    <Text style={styles.skillsText}>
                      {item?.skills?.join(', ')}
                    </Text>
                  </View> */}
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Skills</Text>
                    <Text style={styles.skillsText}>
                      {(() => {
                        try {
                          const parsed =
                            typeof item?.skills === 'string'
                              ? JSON.parse(item.skills)
                              : item.skills;

                          return Array.isArray(parsed)
                            ? parsed.join(', ')
                            : 'N/A';
                        } catch (e) {
                          return 'N/A';
                        }
                      })()}
                    </Text>
                  </View>

                  {/* <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>
                      {item?.startDate} - {item?.endDate}
                    </Text>
                  </View> */}
                </View>
              );
            }}
          />

          <View style={styles.sectionContainer}>
            <View style={styles.ExperienceSection}>
              <Text style={styles.Experience}>Languages Known</Text>
              <View style={styles.infoValue}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() =>
                    navigation.navigate('AddLanguage', jobSeekerData)
                  }>
                  <Text style={styles.addButtonText}>
                    <IconA name="edit" size={20} color="#2d8659" />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.skillsText}>
              {Array.isArray(parseIfArrayString(jobSeekerData?.languageKnown))
                ? parseIfArrayString(jobSeekerData?.languageKnown).join(', ')
                : 'No languages added yet.'}
            </Text>
          </View>

          {/* <View style={styles.sectionContainer}>
            <View style={styles.ExperienceSection}>
              <Text style={styles.Experience}>Location</Text>
              <View style={styles.infoValue}>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddLocation', jobSeekerData)}  >
                  <Text style={styles.addButtonText}>
                    <IconA name="keyboard-arrow-right" size={20} color="#2d8659" />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.skillsContainer}>
              <Text style={styles.skillText}>Hometown</Text>
              <View style={styles.dotWrapper}>
                <DotIcon name="dot-single" size={15} color="#777" style={styles.dotIcon} />
              </View>
              <Text style={styles.skillText}>Current location</Text>
              <View style={styles.dotWrapper}>
                <DotIcon name="dot-single" size={15} color="#777" style={styles.dotIcon} />
              </View>
              <Text style={styles.skillText}>Preferred location</Text>
            </View>
          </View> */}

          <View
            style={[
              styles.ExperienceSection,
              {
                marginTop: 10,
              },
            ]}>
            <Text style={styles.Experience}>Education</Text>
            <View style={styles.infoValue}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  navigation.navigate('EditEducation', {
                    jobSeekerData,
                    data: null,
                  })
                }>
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
            data={parseIfArrayString(jobSeekerData?.education)}
            keyExtractor={item => item?.id}
            renderItem={({item, index}) => {
              return (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                      <IconD name="graduation-cap" size={24} color="#0d4574" />
                    </View>
                    <View style={styles.jobDetails}>
                      <Text style={styles.jobTitle}>{item?.degree}</Text>
                      <Text style={styles.companyName}>
                        {item?.collegeName}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('EditEducation', {
                          jobSeekerData,
                          data: item,
                          index,
                        })
                      }>
                      <IconA name="edit" size={20} color="#2d8659" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.sectionValue}>
                      {item?.educationLevel}
                    </Text>
                  </View>
                  {/* <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>Batch of {item?.startDate}</Text>
                  </View> */}
                </View>
              );
            }}
          />

          {/* <View style={styles.sectionContainer}>
            <View style={styles.ExperienceSection}>
              <Text style={styles.Experience}>Certifications</Text>
              <View style={styles.infoValue}>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CertificateUpload', jobSeekerData)}>
                  <Text style={styles.addButtonText}>+ Add New</Text>
                </TouchableOpacity>
              </View>

            </View>
            {jobSeekerData?.certification ? <Text style={styles.skillsText}>{certification}</Text> :
              <Text style={styles.skillsText}>
                No Certifications added
              </Text>}
          </View> */}

          {/* <View style={styles.sectionContainer}>
            <View style={styles.ExperienceSection}>
              <Text style={styles.Experience}>Skills</Text>
              <View style={styles.infoValue}>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('EditSkill', { data: jobSeekerData })} >
                  <Text style={styles.addButtonText}><IconA name="edit" size={20} color="#2d8659" /></Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={parseIfArrayString(jobSeekerData?.skills)}
              ListEmptyComponent={() => (
                <Text>
                  No skills added yet.
                </Text>
              )}
              renderItem={({ item }) => (
                <View style={styles.skillBox}>
                  <Text style={styles.skillText}>{item}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3} 
              contentContainerStyle={styles.skillsList}
            />
          </View> */}

          {/* <View style={styles.sectionContainer}>
            <View style={styles.ExperienceSection}>
              <Text style={styles.Experience}>Job Preferences</Text>
              <View style={styles.infoValue}>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddJobPref', jobSeekerData)} >
                  <Text style={styles.addButtonText}>
                    <IconA name="keyboard-arrow-right" size={20} color="#2d8659" /></Text>
                </TouchableOpacity>
              </View>

            </View>

            <View style={styles.skillsContainer}>
              <Text style={styles.skillText}>
                {jobSeekerData?.preferredJobCategory}
              </Text>
              {jobSeekerData?.preferredEmployementType ? <>
                <View style={styles.dotWrapper}>
                  <DotIcon name="dot-single" size={15} color="#777" style={styles.dotIcon} />
                </View>
                <Text style={styles.skillText}>{parseIfArrayString(jobSeekerData?.preferredEmployementType)?.join(', ')}</Text>
                <View style={styles.dotWrapper}>
                  <DotIcon name="dot-single" size={15} color="#777" style={styles.dotIcon} />
                </View>
                <Text style={styles.skillText}>{parseIfArrayString(jobSeekerData?.preferredJobType)?.join(', ')}</Text>
              </> :
                <>
                  <Text style={styles.skillText}>No job preferences added yet.</Text>
                </>}
            </View>
          </View> */}

          <View
            style={[
              styles.ExperienceSection,
              {
                marginTop: 10,
              },
            ]}>
            <Text style={styles.Experience}>Professional Experience</Text>
            <View style={styles.infoValue}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  navigation.navigate('EditExperience', {
                    jobSeekerData,
                    data: null,
                  })
                }>
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            ListEmptyComponent={() => (
              <View style={styles.card}>
                <Text style={styles.skillsText}>No experience added yet.</Text>
              </View>
            )}
            data={parseIfArrayString(jobSeekerData?.experience)}
            keyExtractor={item => item?.id}
            renderItem={({item, index}) => {
              return (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                      <IconA name="apartment" size={24} color="#0d4574" />
                    </View>
                    <View style={styles.jobDetails}>
                      <Text style={styles.jobTitle}>{item?.jobTitle}</Text>
                      <Text style={styles.companyName}>
                        {item?.companyName}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('EditExperience', {
                          jobSeekerData,
                          data: item,
                          index,
                        })
                      }>
                      <IconA name="edit" size={20} color="#2d8659" />
                    </TouchableOpacity>
                  </View>

                  {/* <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Job role</Text>
                    <Text style={styles.sectionValue}>{item?.jobRole}</Text>
                  </View> */}

                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Industry</Text>
                    <Text style={styles.sectionValue}>{item?.industry}</Text>
                  </View>

                  {/* <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Skills</Text>
                    <Text style={styles.skillsText}>
                      {item?.skills?.join(', ')}
                    </Text>
                  </View> */}
                  {/* <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Skills</Text>
                        <Text style={styles.skillsText}>
                        {(() => {
                        try {
                        const parsed = typeof item?.skills === 'string'
                        ? JSON.parse(item.skills)
                        : item.skills;

                        return Array.isArray(parsed) ? parsed.join(', ') : 'N/A';
                        } catch (e) {
                        return 'N/A';
                        }
                        })()}
                        </Text>
                  </View> */}

                  {/* <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>
                      {item?.startDate} - {item?.endDate}
                    </Text>
                  </View> */}
                </View>
              );
            }}
          />

          {/* <TouchableOpacity onPress={() => navigation.navigate('TotalExp', jobSeekerData)} style={styles.infoSection}>
            <Text style={styles.infoLabel}>Total years of experience</Text>
            <View style={styles.Arrow}>
              <Text style={styles.infoValue} >{convertToYearsAndMonths(jobSeekerData?.totalExperience)?.years || 0} years {convertToYearsAndMonths(jobSeekerData?.totalExperience)?.months || 0} months </Text>
              <IconA name="keyboard-arrow-right" size={20} color="#2d8659" />
            </View>
          </TouchableOpacity> */}

          {/* <TouchableOpacity onPress={() => navigation.navigate('CurrentSal')} style={styles.infoSection}>
            <Text style={styles.infoLabel}>Current monthly salary</Text>
            <View style={styles.Arrow}>
              <Text style={styles.infoValue} >₹ 1,20,000</Text>
              <IconA name="keyboard-arrow-right" size={20} color="#2d8659" />
            </View>

          </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={() => navigation.navigate('NoticePeriod')} style={styles.infoSection}>
            <Text style={styles.infoLabel}>Notice Period</Text>
            <View style={styles.Arrow}>
              <Text style={styles.infoValue} >Not Mentioned </Text>
              <IconA name="keyboard-arrow-right" size={20} color="#2d8659" />
            </View>
          </TouchableOpacity> */}

          <View style={styles.sectionContainer}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <IconD name="file-pdf-o" size={24} color="#0d4574" />
              </View>
              <View style={styles.jobDetails}>
                <Text style={styles.jobTitle}>Upload Your Resume</Text>
                <Text style={styles.companyName}>{cv}</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ResumeUpload', jobSeekerData)
                }>
                <IconA name="edit" size={20} color="#2d8659" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* <Modal visible={modalVisible} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Update {currentField}</Text>

      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={(text) => setInputValue(text)}
        placeholder={`Enter ${currentField}`}
        placeholderTextColor="#aaa"
      />

      <View style={styles.modalButtons}>
        <TouchableOpacity style={styles.modalButton} onPress={saveChanges}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, { backgroundColor: '#FF5C5C' }]}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal> */}

      <JobMenu />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 100,
    marginBottom: 30,
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
  profileSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionValue: {
    fontSize: 14,
    color: '#555',
  },
  experienceItem: {
    marginBottom: 8,
  },
  roleName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  companyName: {
    fontSize: 14,
    color: '#555',
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
    backgroundColor: '#0d4574',
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
    fontWeight: 'bold',
    margin: 5,
    paddingTop: 15,
    paddingBottom: 8,
    color: '#2d8659',
    borderBottomColor: '#2d8659',
    borderBottomWidth: 2,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    margin: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {backgroundColor: '#e6ffff', padding: 8, borderRadius: 8},
  jobDetails: {flex: 1, marginLeft: 12},
  jobTitle: {fontSize: 16, fontWeight: 'bold', color: '#222'},
  companyName: {fontSize: 14, color: '#555'},
  section: {marginTop: 12, marginLeft: 54},
  sectionLabel: {fontSize: 12, color: '#888'},
  sectionValue: {fontSize: 14, color: '#444', fontWeight: '500'},
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
  addButtonText: {fontSize: 14, color: '#2d8659', fontWeight: 'bold'},
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
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0d4574',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#0d4574',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
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
});

export default JobProfileOld;
