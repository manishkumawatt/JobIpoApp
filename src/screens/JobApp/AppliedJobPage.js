import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import JobHeader from '../../components/Job/JobHeader';
import JobMenu from '../../components/Job/JobMenu';
import {useFocusEffect} from '@react-navigation/native';
import AppliedJobHeader from '../../components/AppliedJobHeader';

const appliedJobsData = [
  {
    id: '1',
    title: 'Junior Java Developer',
    company: 'Tata Consultancy Services (TCS)',
    location: 'Bangalore, Karnataka',
    status: 'Pending',
    resumeSeen: false,
  },
  {
    id: '2',
    title: 'Data Analyst Trainee',
    company: 'Data Inc.',
    location: 'Bhopal, Madhya Pradesh',
    status: 'Accepted',
    resumeSeen: true,
  },
  {
    id: '3',
    title: 'SQL Developer Apprentice',
    company: 'Zonopact India Pvt. Ltd.',
    location: 'Indore, Madhya Pradesh',
    status: 'Rejected',
    resumeSeen: true,
  },
];

const AppliedJobPage = ({navigation}) => {
  const [appliedJobs, setAppliedJobs] = useState();
  const [isLoading, setisLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {
        try {
          const response = await fetch(
            'https://jobipo.com/api/Agent/myapplied',
            {
              method: 'GET',
            },
          );

          const result = await response.json();
          // // console.log('API Response:', result);

          if (result?.status === 1 && result?.msg) {
            const parsed = JSON.parse(result.msg);
            setAppliedJobs(parsed);
          } else {
            // Alert.alert('No Applied Jobs', result?.msg || 'No jobs found.');
            setAppliedJobs([]);
          }
        } catch (error) {
          // console.error('Fetch error:', error);
          Alert.alert(
            'Connection Issue',
            'Please check your internet connection.',
          );
        } finally {
          setisLoading(false);
        }
      };

      GetDataFunc();

      return () => {};
    }, []),
  );

  const applicationStatus = [
    {
      title: 'Applied',
      style: {backgroundColor: '#0d4574', color: '#fff'},
    },
    {
      title: 'Shortlist',
      style: {backgroundColor: '#007BFF', color: '#fff'},
    },
    {
      title: 'Interview Invite',
      style: {backgroundColor: '#FFA500', color: '#fff'}, // orange
    },
    {
      title: 'Selected',
      style: {backgroundColor: '#28a745', color: '#fff'}, // green
    },
    {
      title: 'Rejected',
      style: {backgroundColor: '#dc3545', color: '#fff'}, // red
    },
  ];

  const renderJobItem = ({item}) => (
    <Pressable
      style={styles.jobBox}
      onPress={() => {
        navigation.navigate('JobDes', {job: item});
      }}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.jobTitle}</Text>
      </View>
      <Text style={styles.jobCompany}>{item?.companyName}</Text>

      <Text style={styles.jobLocation}>{item?.jobLocation}</Text>

      <View style={styles.statusContainer}>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            flexDirection: 'row',
            width: 150,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:
              applicationStatus[Number(item.applicationStatus) - 1].style
                .backgroundColor,
          }}>
          <Text
            style={[
              styles.statusText,
              {
                color:
                  applicationStatus[Number(item.applicationStatus) - 1].style
                    .color,
                backgroundColor:
                  applicationStatus[Number(item.applicationStatus) - 1].style
                    .backgroundColor,
              },
            ]}>
            {applicationStatus[Number(item.applicationStatus) - 1].title}
          </Text>
        </View>
        {/* <Text style={styles.resumeStatus}>
          {item.resumeSeen ? (
            <>
              <Icon name="visibility" size={16} color="#4CAF50" /> Resume Seen
            </>
          ) : (
            <>
              <Icon name="visibility-off" size={16} color="#888" /> Resume Not Seen
            </>
          )}
        </Text> */}
      </View>
    </Pressable>
  );

  // // console.log(appliedJobs, 'appliedJobs')

  return (
    <>
      {/* <JobHeader />
      <View style={styles.container}>
        <Text style={styles.heading}>Applied Jobs</Text>
        <FlatList
          data={appliedJobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJobItem}
          ListEmptyComponent={<Text style={styles.noJobs}>No jobs applied yet.</Text>}
        />
      </View>
      <JobMenu /> */}
      <AppliedJobHeader />
      <View style={styles.container}>
        <Text style={styles.heading}>Applied Jobs</Text>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#0d4574"
            style={{marginTop: 50}}
          />
        ) : (
          <FlatList
            data={appliedJobs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderJobItem}
            ListEmptyComponent={
              <View style={{alignItems: 'center', marginTop: 40}}>
                <Icon name="work-off" size={50} color="#ccc" />
                <Text style={styles.noJobs}>
                  You have not applied for any job yet.
                </Text>
              </View>
            }
          />
        )}
      </View>
      <JobMenu />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  jobBox: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    // elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  jobCompany: {
    fontSize: 14,
    color: '#666',
  },
  jobLocation: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#eee',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  resumeStatus: {
    fontSize: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noJobs: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
});

export default AppliedJobPage;
