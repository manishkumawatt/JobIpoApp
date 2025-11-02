import React, {useCallback, useState, useMemo} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import JobMenu from '../../components/Job/JobMenu';
import {useFocusEffect} from '@react-navigation/native';
import AppliedJobHeader from '../../components/AppliedJobHeader';
import {HeartFilledOrangeIcon, HeartIcon} from '../../screens/JobSvgIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleHeader from '../../components/SimpleHeader';

const applicationStatusMeta = [
  {title: 'Applied', style: {backgroundColor: '#535353', color: '#fff'}},
  {title: 'Shortlist', style: {backgroundColor: '#007BFF', color: '#fff'}},
  {
    title: 'Interview Invite',
    style: {backgroundColor: '#FFA500', color: '#fff'},
  },
  {title: 'Selected', style: {backgroundColor: '#28a745', color: '#fff'}},
  {title: 'Rejected', style: {backgroundColor: '#dc3545', color: '#fff'}},
];

const getStatus = statusId => {
  const idx = Number(statusId) - 1;
  return (
    applicationStatusMeta[idx] || {
      title: 'Unknown',
      style: {backgroundColor: '#ccc', color: '#000'},
    }
  );
};

const FavJobSingle = ({navigation}) => {
  const [favoriteJobs, setFavoriteJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ---------- Fetch Favorite Jobs ----------
  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('UserID');
          if (!storedUserId) return;

          const response = await fetch(
            `https://jobipo.com/api/v3/fetch-favorite?userID=${storedUserId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
              },
            },
          );

          const data = await response.json();
          // // console.log('Favorite Jobs Response:', JSON.stringify(data, null, 2));

          if (data.status === 1) {
            const parsedJobs = JSON.parse(data.jobs);
            // // console.log('Favorite Jobs Response:', JSON.stringify(parsedJobs, null, 2));

            setFavoriteJobs(parsedJobs);
          } else {
            setFavoriteJobs([]);
            // console.warn('No favorite jobs found.');
          }
        } catch (error) {
          // console.error('Error fetching favorite jobs:', error);
          // Alert.alert('Error', 'Failed to fetch favorite jobs.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchFavorites();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const fetchApplied = async () => {
        try {
          const res = await fetch('https://jobipo.com/api/Agent/myapplied', {
            method: 'GET',
          });
          const result = await res.json();
          if (result?.status === 1 && result?.msg) {
            setAppliedJobs(JSON.parse(result.msg));
          } else {
            setAppliedJobs([]);
          }
        } catch (e) {
          // console.error('Error fetching applied jobs:', e);
        }
      };

      fetchApplied();
    }, []),
  );

  const appliedStatusMap = useMemo(() => {
    const map = {};
    appliedJobs?.forEach(j => {
      if (j?.jobId) {
        map[j.jobId] = j.applicationStatus;
      }
    });
    return map;
  }, [appliedJobs]);

  const handleToggleFavorite = async jobId => {
    try {
      const storedUserId = await AsyncStorage.getItem('UserID');
      if (!storedUserId) return;

      const isJobFavorite = favoriteJobs.some(job => job.jobId === jobId);

      const endpoint = isJobFavorite
        ? 'https://jobipo.com/api/v3/remove-favorite'
        : 'https://jobipo.com/api/v3/add-favorite';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
        },
        body: JSON.stringify({
          user_id: storedUserId,
          job_id: jobId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (isJobFavorite) {
          setFavoriteJobs(prev => prev.filter(job => job.jobId !== jobId));
        } else {
          // optionally re-fetch favorites
        }
      } else {
        // console.warn('Favorite action failed:', result.message || result);
      }
    } catch (error) {
      // console.error('Favorite toggle error:', error);
    }
  };

  const renderJobItem = ({item}) => {
    const isFavorite = true;
    const statusId = appliedStatusMap[item?.jobId];
    const statusMeta = statusId ? getStatus(statusId) : null;

    return (
      <View style={styles.jobBox}>
        <Pressable
          style={styles.topLeftArrow}
          onPress={() => navigation.navigate('JobDes', {job: item})}>
          <Image
            source={require('../../../assets/Image/icons/next.png')}
            style={styles.jobImg}
          />
        </Pressable>

        <View style={styles.row}>
          <Image
            source={require('../../../assets/Image/icons/rectangle.png')}
            style={styles.jobImg}
          />
          <Text style={styles.jobTitle}>{item?.jobTitle}</Text>
        </View>

        <View style={styles.row}>
          <Image
            source={require('../../../assets/Image/icons/company.png')}
            style={styles.jobImg}
          />
          <Text style={styles.jobCompany}>{item?.businessName || 'NA'}</Text>
          {/* <Text style={styles.jobCompany}>{item.companyName}</Text> */}
        </View>

        <View style={styles.row}>
          <Image
            source={require('../../../assets/Image/icons/location.png')}
            style={styles.jobImg}
          />
          <Text style={styles.jobLocation}>
            {item?.companyAddress || 'NA'}
            {/* {item.jobLocation || 'Location not updated'} */}
          </Text>
        </View>

        <View style={styles.row}>
          <Image
            source={require('../../../assets/Image/icons/salary.png')}
            style={styles.jobImg}
          />
          <Text style={styles.jobLocation}>
            ₹{item?.salaryFrom} - ₹{item?.salaryTo} per month
          </Text>
        </View>

        <View style={styles.salaryContainer}>
          <Text style={styles.salary}>{item?.jobType}</Text>
          <Text style={styles.salary}>{item?.genderPreferance}</Text>
          <Text style={styles.salary}>Exp. {item?.experienceLevel}</Text>
          <TouchableOpacity onPress={() => handleToggleFavorite(item?.jobId)}>
            {isFavorite ? <HeartFilledOrangeIcon /> : <HeartIcon />}
          </TouchableOpacity>
        </View>

        {statusMeta && (
          <View style={styles.statusContainer}>
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: 10,
                flexDirection: 'row',
                width: 130,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: statusMeta.style.backgroundColor,
              }}>
              <Text
                style={[styles.statusText, {color: statusMeta.style.color}]}>
                {statusMeta.title}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <SimpleHeader title="Favorite Jobs" titleColor="#585858" />
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#535353"
            style={{marginTop: 50}}
          />
        ) : (
          <FlatList
            data={favoriteJobs}
            keyExtractor={item =>
              item.jobId?.toString() ?? Math.random().toString()
            } // ✅ better key
            renderItem={renderJobItem}
            ListEmptyComponent={
              <View style={{alignItems: 'center', marginTop: 40}}>
                <Icon name="favorite-border" size={50} color="#ccc" />
                <Text style={styles.noJobs}>
                  You haven't favorited any jobs yet.
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
    backgroundColor: '#F5F4FD',
    padding: 16,
    marginBottom: 30,
  },
  jobBox: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
  },
  jobImg: {
    width: 20,
    height: 14,
    resizeMode: 'contain',
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  salary: {
    fontSize: 12,
    color: '#333',
    backgroundColor: '#F5F4FD',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF8D53',
  },
  jobCompany: {
    fontSize: 14,
    color: '#535353',
    fontWeight: '500',
  },
  topLeftArrow: {
    position: 'absolute',
    top: 20,
    right: 10,
    zIndex: 1,
  },
  jobLocation: {
    fontSize: 12,
    color: '#535353',
    fontWeight: '400',
  },
  statusContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  noJobs: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FavJobSingle;
