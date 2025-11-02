import React, {useEffect, useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Rupeeicon from 'react-native-vector-icons/FontAwesome';
import Header from '../../components/Header';
import JobHeader from '../../components/Job/JobHeader';
import JobMenu from '../../components/Job/JobMenu';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  BuildingIcon,
  LocationIcon,
  BackArrowIcon,
  HomeIcon,
  InfoIcon,
  SettingsIcon,
  RefreshEyeIcon,
  NetworkIcon,
  GoogleIcon,
  LockShieldIcon,
  SvgHatIcon,
  AddDocumentIcon,
  JobReferenceIcon,
  JobUserNetworkIcon,
  JobMultipleNetworkIcon,
  JobAnalyticsBarGraphIcon,
  JobProfileUserIcon,
  JobBuildingProfileIcon,
  JobWorkIcon,
  LocationSmallIcon,
  ViewIcon,
} from '../JobSvgIcons';
import {useNavigation} from '@react-navigation/native';
import SimpleHeader from '../../components/SimpleHeader';
import {useRoute} from '@react-navigation/native';
import {showToastMessage} from '../../utils/Toast';

const JobDes = ({route}) => {
  const {job, onApplied} = route.params;
  // const { id } = route.params;
  //     // console.log('Received Job in jobId:', job.jobId);

  useEffect(() => {
    // // console.log('Received Job in JobDes:', job);
  }, []);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplied, setIsApplied] = useState(job.jobApplyId !== null);
  // // console.log(job);
  const navigation = useNavigation();

  const handleApply = async () => {
    setIsLoading(true);
    await fetch('https://jobipo.com/api/Agent/doapplyjob', {
      method: 'POST',
      body: JSON.stringify({
        jobId: job.jobId,
      }),
    })
      .then(async response => {
        const data = await response.json();
        // // console.log(data);
        if (response.status === 200 && data.status === 1) {
          setIsApplied(true);
          if (typeof onApplied === 'function') {
            try {
              onApplied(job.jobId);
            } catch (e) {
              // console.warn('onApplied callback failed', e);
            }
          }
          showToastMessage(
            'Your application has been submitted successfully!',
            'success',
          );
          // Optionally navigate back after applying
          // navigation.goBack();
        } else {
          showToastMessage(
            'Failed to submit application. Please try again later.',
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      if (isMounted) {
        // // console.log('jobApplyId', job.jobApplyId);

        setIsApplied(job.jobApplyId !== null);
      }

      return () => {
        isMounted = false;
      };
    }, [job]),
  );

  const handleSave = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      'Job Saved',
      isSaved ? 'Job unsaved!' : 'Job saved successfully!',
    );
  };

  const salary =
    job.salaryType === 'Incentive-Based'
      ? `₹${job.AdditionalPayout}`
      : `₹${job.salaryFrom} - ₹${job.salaryTo} per month`;

  // 1=Applied, 2=Shortlist, 3=Interview Invite, 4=Selected, 5=Rejected
  // 1=Self, 2=Employer

  const applicationStatus = [
    {
      title: 'Applied',
      style: {backgroundColor: '#FF8D53', color: '#fff'},
    },
    {
      title: 'Shortlist',
      style: {backgroundColor: '#007BFF', color: '#fff'},
    },
    {
      title: 'Interview Invite',
      style: {backgroundColor: '#FFA500', color: '#fff'},
    },
    {
      title: 'Selected',
      style: {backgroundColor: '#28a745', color: '#fff'},
    },
    {
      title: 'Rejected',
      style: {backgroundColor: '#dc3545', color: '#fff'},
    },
  ];
  return (
    <>
      <SimpleHeader title={job.jobTitle} />

      {/* <JobHeader /> */}
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {/* <View style={{flex:1, flexDirection: 'row',padding:15, backgroundColor:'#ffffff',lignItems: 'center',  }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <BackArrowIcon size={30} />
        </View>
        </TouchableOpacity>
        <Text style={[styles.jobTitle, { flexShrink: 1 ,marginLeft:20,}]} numberOfLines={1}>
          {job.jobTitle}
        </Text>
      </View> */}

        <View style={styles.container}>
          {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}> */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 10,
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
            {job?.applicationStatus !== null && (
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    applicationStatus[Number(job.applicationStatus) - 1].style
                      .backgroundColor,
                }}>
                <Text
                  style={{
                    color:
                      applicationStatus[Number(job.applicationStatus) - 1].style
                        .color,
                  }}>
                  {applicationStatus[Number(job.applicationStatus) - 1].title}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.jobCard}>
            <Text style={styles.sectionHeader}>Company Details</Text>
            <View style={styles.sectionRow}>
              <BuildingIcon size={16} />
              <Text style={[styles.businessName, {marginLeft: 12}]}>
                {job?.businessName ? job.businessName : 'NA'}
              </Text>
            </View>
            {/* Job Location */}
            <View style={styles.sectionRow}>
              <LocationIcon />
              <Text
                numberOfLines={2}
                style={[styles.location, {marginLeft: 12}]}>
                {job?.jobLocation ? job.jobLocation : 'NA'}
              </Text>
            </View>
            <View style={styles.sectionRow}>
              <HomeIcon />
              {/* <Text style={[styles.location, { marginLeft: 12 }]}>
      <Text style={{ color:'#FF8D53' }}>Industry :  </Text>
      {job?.FirmCategory ? job.FirmCategory : 'NA'}
    </Text> */}
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Industry: </Text>
                {(() => {
                  try {
                    const parsed = JSON.parse(job?.FirmCategory);
                    const fields = [];

                    // Add all available fields to the array (only values, no N/A)
                    if (
                      parsed.constitution_of_business &&
                      parsed.constitution_of_business !== 'N/A'
                    )
                      fields.push(parsed.constitution_of_business);
                    if (
                      parsed.nature_of_core_business_activity_description &&
                      parsed.nature_of_core_business_activity_description !==
                        'N/A'
                    )
                      fields.push(
                        parsed.nature_of_core_business_activity_description,
                      );
                    if (
                      parsed.company_category &&
                      parsed.company_category !== 'N/A'
                    )
                      fields.push(parsed.company_category);
                    if (
                      parsed.company_sub_category &&
                      parsed.company_sub_category !== 'N/A'
                    )
                      fields.push(parsed.company_sub_category);
                    if (
                      parsed.class_of_company &&
                      parsed.class_of_company !== 'N/A'
                    )
                      fields.push(parsed.class_of_company);
                    if (parsed.enterprise && parsed.enterprise !== 'N/A')
                      fields.push(parsed.enterprise);
                    if (
                      parsed.major_activity &&
                      parsed.major_activity !== 'N/A'
                    )
                      fields.push(parsed.major_activity);
                    if (parsed.Company && parsed.Company !== 'N/A')
                      fields.push(parsed.Company);

                    return fields.length > 0 ? fields.join(' | ') : 'NA';
                  } catch (e) {
                    return 'NA';
                  }
                })()}
              </Text>
            </View>
            <View style={styles.sectionRow}>
              <InfoIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>About Company : </Text>
                {job?.cDescription ? job?.cDescription : 'NA'}
              </Text>
            </View>

            {/* Company Type */}
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
    <BackArrowIcon size={14} />
    <Text style={{ marginLeft: 8 }}>
      Company Type: {job?.FirmCategory}
    </Text>
  </View> */}

            {/* Interview Address */}
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
    <BackArrowIcon size={14} />
    <Text style={{ marginLeft: 8 }}>
      Interview Address: {job?.InterviewAddress}
    </Text>
  </View> */}

            {/* Interview Type */}
            {/* {job?.InterviewType && (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
      <BackArrowIcon size={14} />
      <Text style={{ marginLeft: 8 }}>
        Interview Type: {job?.InterviewType}
      </Text>
    </View>
  )} */}

            {/* Interview Date if status == 3 */}
            {/* {job?.applicationStatus == 3 && job?.Interview_Date && (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
      <BackArrowIcon size={14} />
      <Text style={{ marginLeft: 8 }}>
        Interview Date: {new Date(job?.Interview_Date).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
      </Text>
    </View>
  )} */}
          </View>

          <View style={styles.jobCard}>
            <Text style={styles.sectionHeader}>Job Details</Text>

            <View style={styles.sectionRow}>
              <NetworkIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Job Department : </Text>

                {job?.JobIndustry ? job.JobIndustry : 'NA'}
              </Text>
            </View>
            <View style={styles.sectionRow}>
              <SvgHatIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Work Type : </Text>
                {job?.jobType ? job.jobType : 'NA'}
              </Text>
            </View>
            <View style={styles.sectionRow}>
              <SvgHatIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Work Mode : </Text>

                {job?.workLocation ? job.workLocation : 'NA'}
              </Text>
            </View>
            <View style={styles.sectionRow}>
              <RefreshEyeIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Gender : </Text>

                {job?.genderPreferance ? job.genderPreferance : 'NA'}
              </Text>
            </View>
            <View style={styles.sectionRow}>
              <GoogleIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Age : </Text>
                {job?.MinAge ? job.MinAge : 'N/A'}
                {job?.MaxAge ? ` to ${job.MaxAge}` : ''} Years
              </Text>
            </View>
            <View style={styles.sectionRow}>
              <LockShieldIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Salary Type : </Text>

                {job?.salaryType ? job.salaryType : 'NA'}
              </Text>
            </View>
            <View style={styles.sectionRow}>
              <LockShieldIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Salary : </Text>

                {salary}
              </Text>
            </View>
          </View>

          <View style={styles.jobCard}>
            <Text style={styles.sectionHeader}>Additional Details</Text>

            <View style={styles.sectionRow}>
              <AddDocumentIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Qualification : </Text>

                {job?.Qualification ? job.Qualification : 'NA'}
              </Text>
            </View>
            <View style={styles.sectionRow}>
              <JobUserNetworkIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Experience : </Text>

                {job?.experienceLevel ? job.experienceLevel : 'NA'}
              </Text>
            </View>
            <View style={styles.sectionRow}>
              <JobReferenceIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Language : </Text>
                {job?.langaugeRequirenments
                  ? Array.isArray(job.langaugeRequirenments)
                    ? job.langaugeRequirenments.join(', ')
                    : (() => {
                        try {
                          const parsed = JSON.parse(job.langaugeRequirenments);
                          return Array.isArray(parsed)
                            ? parsed.join(', ')
                            : 'NA';
                        } catch {
                          return 'NA';
                        }
                      })()
                  : 'NA'}
              </Text>
            </View>
            <View style={styles.sectionRow}>
              <JobReferenceIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>English Speaking : </Text>

                {job?.englishSpeakingLevel ? job.englishSpeakingLevel : 'NA'}
              </Text>
            </View>
            <View style={styles.sectionRow}>
              <JobMultipleNetworkIcon size={16} />
              <View style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Skills : </Text>

                <View style={styles.skillsContainer}>
                  {(() => {
                    try {
                      const skills = JSON.parse(job?.skillsRequired);
                      return skills?.map((req, index) => (
                        <Text key={index} style={styles.skillItem}>
                          • {req}
                        </Text>
                      ));
                    } catch (error) {
                      // console.warn(
                      //   'Invalid JSON in job.skillsRequired:',
                      //   error,
                      // );
                      return <Text style={styles.skillItem}>NA </Text>;
                    }
                  })()}
                </View>
              </View>
            </View>
            <View style={styles.sectionRow}>
              <JobAnalyticsBarGraphIcon size={16} />
              <View style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Benefits : </Text>

                <View style={styles.benefitsContainer}>
                  {(() => {
                    // // console.log('job.jobBanafits:', job?.jobBanafits);

                    try {
                      const benefits = JSON.parse(job?.jobBanafits);
                      return benefits?.map((req, index) => (
                        <Text key={index} style={styles.benefitItem}>
                          • {req}
                        </Text>
                      ));
                    } catch (error) {
                      // console.warn('Invalid JSON in job.jobBanafits:', error);
                      return <Text style={styles.benefitItem}>NA </Text>;
                    }
                  })()}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.jobCard}>
            <Text style={styles.sectionHeader}>Job Description</Text>

            <View style={styles.sectionRow}>
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>
                  Roles and Responsibilities :{' '}
                </Text>

                {job?.jobDescription ? job.jobDescription : 'NA'}
              </Text>
            </View>
          </View>

          <View style={styles.jobCard}>
            <Text style={styles.sectionHeader}>Interview Details</Text>

            <View style={styles.sectionRow}>
              <JobProfileUserIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Name : </Text>

                {job?.cName ? job.cName : 'NA'}
              </Text>
            </View>
            <View style={styles.sectionRow}>
              <JobBuildingProfileIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Designation : </Text>

                {job?.cDesignation ? job.cDesignation : 'NA'}
              </Text>
            </View>
            <View style={styles.sectionRow}>
              <JobWorkIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Interview Type : </Text>

                {job?.InterviewType ? job.InterviewType : 'NA'}
              </Text>
            </View>
            <View style={styles.sectionRow}>
              <LocationSmallIcon size={16} />
              <Text style={[styles.location, {marginLeft: 12}]}>
                <Text style={{color: '#FF8D53'}}>Interview Location : </Text>

                {job?.InterviewAddress ? job.InterviewAddress : 'NA '}
              </Text>
            </View>
          </View>

          {/* <View style={styles.section}>
            <Text style={styles.sectionHeader}>Job Details</Text>
            <View style={styles.detailItem}>
              <Rupeeicon name="rupee" size={19} color="#444" />
              <Text style={styles.detailText}>{salary}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="work" size={20} color="#444" />
              <Text style={styles.detailText}>{job.jobType}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="schedule" size={20} color="#444" />
              <Text style={styles.detailText}>
                <Text style={styles.tag}>{job?.workLocation}</Text>
              </Text>
            </View>

          </View> */}

          {/* <View style={styles.section}>
            <Text style={styles.sectionHeader}>Location</Text>
            <View style={styles.detailItem}>
              <Icon name="place" size={20} color="#444" />
              <Text style={styles.locationText}>{(job.workLocation == 'On-Site' && job.workLocationAddress + ', ') + job.city + ', ' + job.state}</Text>
            </View>
          </View> */}

          {/* <View style={styles.section}>
  <Text style={styles.sectionHeader}>Benefits</Text>

 <View style={styles.benefitsContainer}>
  {(() => {
    // console.log("job.jobBanafits:", job?.jobBanafits);

    try {
      const benefits = JSON.parse(job?.jobBanafits);
      return benefits?.map((req, index) => (
        <Text key={index} style={styles.benefitItem}>• {req}</Text>
      ));
    } catch (error) {
      console.warn("Invalid JSON in job.jobBanafits:", error);
      return <Text style={styles.benefitItem}>No valid benefits found.</Text>;
    }
  })()}
</View>
</View> */}

          {/* <View style={styles.section}>
            <Text style={styles.sectionHeader}>Skills Required</Text>
            {JSON.parse(job?.skillsRequired)?.map((req, index) => (
              <Text key={index} style={styles.requirementText}>• {req}</Text>
            ))}
          </View> */}

          {/* <View style={styles.section}>
            <Text style={styles.sectionHeader}>Full Job Description</Text>
            <Text style={styles.descriptionText}>{job.jobDescription}
            </Text>
          </View> */}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.applyButton,
                {
                  backgroundColor: isApplied || isLoading ? '#ccc' : '#FF8D53',
                  display: isApplied ? 'none' : 'flex',
                },
              ]}
              onPress={handleApply}
              disabled={isApplied || isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isApplied ? 'Applied' : 'Apply Now'}
                </Text>
              )}
            </TouchableOpacity>

            {isApplied &&
              (job.contactType == 'WhatsApp & Call' ||
                job.contactType == 'WhatsApp Only') && (
                <TouchableOpacity
                  style={[
                    styles.applyButton,
                    {
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#FF8D53',
                    },
                  ]}
                  onPress={() => {
                    Linking.openURL(
                      `https://api.whatsapp.com/send?phone=${job.cWhatsappNo}`,
                    );
                  }}>
                  <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                </TouchableOpacity>
              )}

            {isApplied &&
              (job.contactType == 'WhatsApp & Call' ||
                job.contactType == 'Call Only') && (
                <TouchableOpacity
                  style={[
                    styles.applyButton,
                    {
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#FF8D53',
                    },
                  ]}
                  onPress={() => {
                    Linking.openURL(`tel:${job.cPhoneNo}`);
                  }}>
                  <Ionicons name="call" size={20} color="#fff" />
                </TouchableOpacity>
              )}
          </View>

          {/* <View style={styles.cardHeaderRow}>

    <Text style={styles.relatedHeaderText}>Related Jobs</Text>
    <TouchableOpacity style={styles.viewButton}>

      <Text style={styles.viewButtonText}>See All</Text>
      <ViewIcon size={14} />
    </TouchableOpacity>
  </View> */}

          {/*
        <View style={styles.RealtedJobCard}>
              <Text style={styles.sectionHeader}>Interview Details</Text>
            <View style={styles.sectionRow}>
            <InfoIcon size={16} />
            <Text style={[styles.location, { marginLeft: 12 }]}>
            {job?.jobCompany ? job.jobCompany : 'NA'}
            </Text>
            </View>
            <View style={styles.sectionRow}>
            <InfoIcon size={16} />
            <Text style={[styles.location, { marginLeft: 12 }]}>
            {job?.jobCompany ? job.jobCompany : 'NA'}
            </Text>
            </View>
            <View style={styles.sectionRow}>
            <InfoIcon size={16} />
            <Text style={[styles.location, { marginLeft: 12 }]}>
            {job?.jobCompany ? job.jobCompany : 'NA'}
            </Text>
            </View>
            <View style={styles.sectionRow}>
            <InfoIcon size={16} />
            <Text style={[styles.location, { marginLeft: 12 }]}>
            {job?.jobCompany ? job.jobCompany : 'NA'}
            </Text>
            </View>

        </View> */}
        </View>
      </ScrollView>

      <JobMenu />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F4FD',
    // padding: 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },

  requirementText: {
    //  marginBottom: 4,
    flexDirection: 'row',
    lineHeight: 15,
    paddingBottom: 8,
  },

  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginTop: 10,
  },
  benefitItem: {
    marginRight: 4,
    marginBottom: 4,
    color: '#333',
    fontSize: 12.5,
    paddingHorizontal: 2,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginTop: 10,
  },
  skillItem: {
    marginRight: 4,
    // marginBottom: 5,
    color: '#333',
    fontSize: 12.5,
    paddingHorizontal: 2,
    paddingVertical: 4,
    borderRadius: 12,
  },

  jobTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF8D53',
    textAlign: 'center',
    marginBottom: 10,
  },
  // jobTitle: {
  //   fontSize: 22,
  //   fontWeight: 'bold',
  //   color: '#222',
  //   justifyContent:'center',
  //   alignSelf:'center',
  //   marginBottom: 4,
  //   width: '50%',
  // },
  companyName: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
    flexShrink: 1,
    flexGrow: 1,
    flexWrap: 'nowrap',
  },
  location: {
    fontSize: 12.5,
    color: '#777',
    marginBottom: 4,
    flexShrink: 1,
    flexGrow: 1,
    flexWrap: 'nowrap',
  },
  section: {
    marginBottom: 16,
  },

  sectionRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  sectionSubHeader: {
    fontSize: 14,
    color: '#777',
    marginBottom: 12,
  },
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 8,
  },
  tag: {
    // backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    fontSize: 12,
    color: '#333',
  },
  locationText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionSubHeader: {
    fontSize: 14,
    color: '#777',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 8,
  },
  tag: {
    // backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    fontSize: 12,
    color: '#333',
  },
  locationText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    width: '60%',
    alignSelf: 'center',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#0d4574',
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    alignItems: 'center',
    // width:'50%',
  },

  saveButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveButtonActive: {
    borderColor: '#007BFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  jobCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  RealtedJobCard: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 15,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },

  relatedHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },

  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },

  viewButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#535353',
  },
});

export default JobDes;
