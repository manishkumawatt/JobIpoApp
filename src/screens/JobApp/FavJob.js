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
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import JobMenu from '../../components/Job/JobMenu';
import {useFocusEffect} from '@react-navigation/native';
import AppliedJobHeader from '../../components/AppliedJobHeader';
import {HeartFilledOrangeIcon, HeartIcon} from '../../screens/JobSvgIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const FavJob = ({navigation}) => {
  const [favoriteJobs, setFavoriteJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const FavoriteButton = ({isFavorite, onPress}) => {
    const scale = React.useRef(new Animated.Value(1)).current;
    const handlePress = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
      if (typeof onPress === 'function') onPress();
    };
    return (
      <TouchableOpacity
        style={styles.heartButton}
        onPress={handlePress}
        activeOpacity={1}
        hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
        <Animated.View style={[styles.iconShadow, {transform: [{scale}]}]}>
          {isFavorite ? <HeartFilledOrangeIcon /> : <HeartIcon />}
        </Animated.View>
      </TouchableOpacity>
    );
  };

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
          // console.log('Favorite Jobs Response:', JSON.stringify(data, null, 2));
          // console.log('data---2-2--2-', data);
          if (data.status === 1) {
            const parsedJobs = JSON.parse(data.jobs);
            // console.log(
            //   'Favorite Jobs Response:---',
            //   JSON.stringify(parsedJobs),
            // );

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

  // ---------- Fetch Applied Jobs (to show status only for applied favs) ----------
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

  // ✅ Fast lookup table: { [jobId]: applicationStatus }
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
    // Guard against undefined item
    if (!item) {
      return null;
    }

    const isFavorite = true; // This page is only favorites anyway
    const statusId = item?.jobId ? appliedStatusMap[item?.jobId] : null; // ✅ only if applied
    const statusMeta = statusId ? getStatus(statusId) : null;

    return (
      <Pressable
        onPress={() => {
          if (item) {
            navigation.navigate('JobDes', {job: item});
          }
        }} // ✅ keep it consistent with AppliedJob
        style={styles.jobBox}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('../../../assets/Image/icons/rectangle.png')}
            style={styles.jobImg}
            resizeMode="contain"
          />
          <Text numberOfLines={2} style={[styles.jobTitle, {flex: 1}]}>
            {item?.jobTitle}
          </Text>
          <Image
            source={require('../../../assets/Image/icons/next.png')}
            style={styles.jobImg}
            resizeMode="contain"
          />
        </View>

        <View style={styles.row}>
          <Image
            source={require('../../../assets/Image/icons/company.png')}
            resizeMode="contain"
            style={styles.jobImg}
          />
          <Text numberOfLines={2} style={styles.jobCompany}>
            {item?.businessName || 'NA'}
          </Text>
          {/* <Text style={styles.jobCompany}>{item.companyName}</Text> */}
        </View>

        <View style={styles.row}>
          <Image
            resizeMode="contain"
            source={require('../../../assets/Image/icons/location.png')}
            style={styles.jobImg}
          />
          <Text numberOfLines={2} style={[styles.jobLocation, {flex: 1}]}>
            {item?.jobLocation || 'NA'}
            {/* {item.jobLocation || 'Location not updated'} */}
          </Text>
        </View>

        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
          <Image
            source={require('../../../assets/Image/icons/salary.png')}
            style={styles.jobImg}
            resizeMode="contain"
          />
          <Text style={styles.jobLocation}>
            ₹{item?.salaryFrom} - ₹{item?.salaryTo} per month
          </Text>
        </View>

        <View style={styles.salaryContainer}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.salary}>{item?.jobType}</Text>
              <Text style={styles.salary}>{item?.genderPreferance}</Text>
              <Text style={styles.salary}>Exp. {item?.experienceLevel}</Text>
            </View>
          </View>
          <View
            style={{
              height: 50,
              width: 50,
              top: -10,
            }}>
            <FavoriteButton
              isFavorite={isFavorite}
              onPress={() => handleToggleFavorite(item?.jobId)}
            />
          </View>
        </View>

        {statusMeta && (
          <View style={styles.statusContainer}>
            <View
              style={{
                borderRadius: 4,
                paddingHorizontal: 6,
                paddingVertical: 10,
                flexDirection: 'row',
                minWidth: 130,
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
      </Pressable>
    );
  };

  return (
    <>
      <AppliedJobHeader />
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
              item?.jobId?.toString() ?? Math.random().toString()
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
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 16,
  },
  jobBox: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    backgroundColor: '#fff',
    marginVertical: 5,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
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
    // marginTop: -8,
    // marginBottom: -8,
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
    flex: 1,
    paddingRight: 10,
    flexWrap: 'wrap',
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
    flexWrap: 'wrap',
    paddingRight: 25,
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heartButton: {
    backgroundColor: 'transparent',
    padding: 8,
  },
  iconShadow: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
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

export default FavJob;
