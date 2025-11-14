import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  memo,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Carousel from 'react-native-reanimated-carousel';
// import notifee from '@notifee/react-native';

import JobMenu from '../../components/Job/JobMenu';
import TopHeaderJob from '../../components/TopHeaderJob';
import MemoryOptimizedFlatList from '../../components/MemoryOptimizedFlatList';
import ScratchCardComponent from '../../components/ScratchCardComponent';
import PointsWallet from './PointsWallet';
import {AuthContext} from '../../context/context';
import {HeartIcon, HeartFilledOrangeIcon} from '../JobSvgIcons';
import {updateDeviceToken} from '../../utils/deviceDetailFCM';
import {
  generateRandomPoints,
  calculatePointsValue,
  isRedeemable,
  updateUserPoints,
  getReferralStats,
} from '../../utils/referralUtils';
import {
  AuthorizationStatus,
  getMessaging,
} from '@react-native-firebase/messaging';
import {navigationRef} from '../../navigation/navigationRef';
import imagePath from '../../theme/imagePath';
// Constants
const API_BASE_URL = 'https://jobipo.com/api/v3';
const AUTH_TOKEN = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
const JOBS_PER_PAGE = 10;

// Animated Favorite Button Component
const FavoriteButton = memo(({isFavorite, onPress}) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
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
  }, [onPress, scale]);

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
});

// JobBox Component - Memoized for performance
const JobBox = memo(
  ({item, isActive, onPress, onToggleFavorite, isFavorite}) => {
    const salary =
      item.salaryType === 'Incentive-Based'
        ? item.AdditionalPayout
        : `₹${item.salaryFrom} - ₹${item.salaryTo} per month`;

    const handlePress = useCallback(() => {
      onPress(item);
    }, [onPress, item]);

    const handleToggleFavorite = useCallback(() => {
      onToggleFavorite(item.jobId);
    }, [onToggleFavorite, item.jobId]);
    console.log('item===', item);
    return (
      <View style={[styles.jobBox, isActive && styles.activeJobBox]}>
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          <View>
            <View style={styles.topLeftArrow}>
              <Image
                source={require('../../../assets/Image/icons/next.png')}
                style={styles.jobImg}
              />
            </View>

            <View style={styles.row}>
              <Image
                source={require('../../../assets/Image/icons/rectangle.png')}
                style={styles.jobImg}
              />
              <Text style={styles.jobTitle}>{item.jobTitle}</Text>
            </View>

            <View style={styles.row}>
              <Image
                source={require('../../../assets/Image/icons/company.png')}
                style={styles.jobImg}
              />
              <Text style={styles.jobCompany}>{item.businessName || 'NA'}</Text>
            </View>

            <View style={styles.row}>
              <Image
                source={require('../../../assets/Image/icons/location.png')}
                style={styles.jobImg}
              />
              <Text numberOfLines={2} style={styles.jobLocation}>
                {item?.jobLocation || 'Location not updated'}
              </Text>
            </View>

            <View style={styles.rowS}>
              <Image
                source={require('../../../assets/Image/icons/salary.png')}
                style={styles.jobImg}
              />
              <Text style={styles.jobLocation}>{salary}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.salaryContainer}>
          <View style={styles.salaryDetails}>
            <Text style={styles.salary}>{item.jobType}</Text>
            <Text style={styles.salary}>{item.genderPreferance}</Text>
            <Text style={styles.salary}>Exp. {item.experienceLevel}</Text>
          </View>
          <View
            style={{
              height: 50,
              width: 50,
              top: -10,
            }}>
            <FavoriteButton
              isFavorite={isFavorite}
              onPress={handleToggleFavorite}
            />
          </View>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for better performance
    return (
      prevProps.item.jobId === nextProps.item.jobId &&
      prevProps.isActive === nextProps.isActive &&
      prevProps.isFavorite === nextProps.isFavorite
    );
  },
);

const JobPage = ({navigation, route}) => {
  const {signOut} = useContext(AuthContext);
  const notificationListenersSet = useRef(false);
  const onMessageUnsubscribeRef = useRef(null);
  const onNotificationOpenedAppUnsubscribeRef = useRef(null);

  // Core state
  const [searchQuery, setSearchQuery] = useState(
    route.params?.searchQuery || '',
  );
  const [jobs, setJobs] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const [page, setPage] = useState(1);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const fetchTimeoutRef = useRef(null);
  const currentPageRef = useRef(1);
  const isFetchingRef = useRef(false);

  // Search suggestions
  const [suggestion, setSuggestion] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(false);

  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [formData, setFormData] = useState({
    location: null,
    title: null,
    experience: null,
    age: [18, 52],
    salary: [0, 200000],
    gender: 'Male',
    jobPosted: 'All',
    nearest_job: '',
  });

  // Location data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [jobTitles, setJobTitles] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Favorites
  const [favoriteJobs, setFavoriteJobs] = useState([]);

  // Referral system state
  const [userPoints, setUserPoints] = useState(0);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [showPointsWallet, setShowPointsWallet] = useState(false);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalPoints: 0,
    todayReferrals: 0,
  });

  // Carousel data for promotional banners
  const carouselData = [
    {
      id: 1,
      title: 'Find Your Dream Job',
      subtitle: 'Browse thousands of opportunities',
      image: require('../../../assets/Image/banner.png'),
      backgroundColor: '#FF6B35',
    },
    {
      id: 2,
      title: 'Refer & Earn',
      subtitle: 'Earn for every successful referral',
      image: require('../../../assets/Image/rechargebanner.jpg'),
      backgroundColor: '#28a745',
    },
    {
      id: 3,
      title: 'Premium Jobs',
      subtitle: 'Access exclusive job opportunities',
      image: require('../../../assets/Image/DTHbanner.jpg'),
      backgroundColor: '#007bff',
    },
  ];

  // Filter state
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categorySearchText, setCategorySearchText] = useState('');
  const [showStateModal, setShowStateModal] = useState(false);
  const [stateSearchText, setStateSearchText] = useState('');
  const [showCityModal, setShowCityModal] = useState(false);
  const [citySearchText, setCitySearchText] = useState('');
  const [showNearestJobModal, setShowNearestJobModal] = useState(false);
  const [selectedNearestJob, setSelectedNearestJob] = useState('');
  const [photo, setPhoto] = useState('');

  // Navigation state
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isReturningFromDetail, setIsReturningFromDetail] = useState(false);

  // Sticky header scroll state
  const lastScrollY = useRef(0);
  const carouselTranslateY = useRef(new Animated.Value(0)).current;
  const carouselOpacity = useRef(new Animated.Value(1)).current;
  const searchBarMarginTop = useRef(new Animated.Value(90)).current;
  const listPaddingTop = useRef(new Animated.Value(86)).current;
  const [listPaddingTopValue, setListPaddingTopValue] = useState(1);
  const [isCarouselVisible, setIsCarouselVisible] = useState(true);
  const isScrollingDown = useRef(false);
  const scrollOffset = useRef(0);
  const isAnimating = useRef(false);

  // Job type filter buttons state
  const [selectedJobType, setSelectedJobType] = useState('Near by Jobs');

  // Constants
  const screenHeight = Dimensions.get('window').height;

  // Utility functions
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

  const fetchFavorites = useCallback(async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('UserID');
      if (!storedUserId) return;
      const ResData = await fetch(
        `https://jobipo.com/api/v3/fetch-favorite?userID=${storedUserId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          },
          body: '',
        },
      );
      const data = await ResData.json();

      if (data.status === 1) {
        let parsedJobs;
        if (typeof data.jobs === 'string') {
          parsedJobs = JSON.parse(data?.jobs);
        } else if (Array.isArray(data.jobs)) {
          parsedJobs = data.jobs;
        } else {
          setFavoriteJobs([]);
          return;
        }

        const favJobIds = parsedJobs.map(job => job.jobId);
        setFavoriteJobs(favJobIds);
      }
    } catch (error) {
      // console.error('Error fetching favorites:', error);
    }
  }, []);

  const handleToggleFavorite = useCallback(
    async jobId => {
      try {
        const storedUserId = await AsyncStorage.getItem('UserID');
        if (!storedUserId) return;

        const isJobFavorite = favoriteJobs.includes(jobId);
        const endpoint = isJobFavorite ? '/remove-favorite' : '/add-favorite';

        await makeApiRequest(endpoint, {
          method: 'POST',
          body: JSON.stringify({
            user_id: storedUserId,
            job_id: jobId,
          }),
        });

        setFavoriteJobs(prev =>
          isJobFavorite ? prev.filter(id => id !== jobId) : [...prev, jobId],
        );
      } catch (error) {
        // console.error('Favorite toggle error:', error);
      }
    },
    [favoriteJobs],
  );
  useEffect(() => {
    setTimeout(() => {
      updateDeviceToken();
    }, 3000);
    if (Platform.OS == 'ios') {
      requestUserPermission();
    } else {
      createNotificationListeners();
    }

    // clearNotification();
    return () => {};
  }, []);
  //

  // Effects
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setShowSuggestion(false);
      setSuggestion([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);
  // Data fetching functions
  const fetchJobTitles = useCallback(async () => {
    try {
      const result = await makeApiRequest('/fetch-job-industry');
      if (result?.status == 1 && result?.data) {
        // const parsed = JSON.parse(result.data);
        // console.log('parsedparsedparsed', parsed);
        setJobTitles(result?.data);
      }
    } catch (error) {
      // console.error('Error fetching job titles:', error);
    }
  }, []);

  const fetchStates = useCallback(async () => {
    setLoadingStates(true);
    try {
      const data = await makeApiRequest('/fetch-states');

      const parsedStates = JSON.parse(data.msg);
      setStates(parsedStates);
    } catch (error) {
      // console.error('Failed to fetch states', error);
    } finally {
      setLoadingStates(false);
    }
  }, []);

  const fetchCities = useCallback(async stateId => {
    if (!stateId) {
      setCities([]);
      setSelectedCity('');
      setLoadingCities(false);
      return;
    }

    setLoadingCities(true);
    try {
      const data = await makeApiRequest(`/fetch-cities?stateId=${stateId}`);
      const parsedCities = JSON.parse(data.msg);
      setCities(parsedCities);
    } catch (error) {
      // console.error('Failed to fetch cities', error);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  // Referral system functions
  const loadReferralData = useCallback(async () => {
    try {
      const stats = await getReferralStats();
      setReferralStats(stats);
      setUserPoints(stats.totalPoints || 0);
    } catch (error) {
      console.error('Failed to load referral data:', error);
    }
  }, []);

  const handlePointsEarned = useCallback(points => {
    setUserPoints(prev => prev + points);
    setReferralStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + points,
    }));
    // Add activity for earning points
    addReferralActivity('referral', points, `Scratch Card Bonus`);
  }, []);

  const addReferralActivity = useCallback(async (type, points, description) => {
    try {
      const newActivity = {
        id: Date.now().toString(),
        type,
        points,
        description,
        timestamp: new Date().toISOString(),
      };

      const existingActivities =
        await AsyncStorage.getItem('referral_activity');
      const activities = existingActivities
        ? JSON.parse(existingActivities)
        : [];

      const updatedActivities = [newActivity, ...activities].slice(0, 50);
      await AsyncStorage.setItem(
        'referral_activity',
        JSON.stringify(updatedActivities),
      );
    } catch (error) {
      console.error('Failed to save activity:', error);
    }
  }, []);

  const handleRedeemPoints = useCallback(amount => {
    setUserPoints(prev => prev - amount);
    setShowPointsWallet(false);
    Alert.alert('Success', `₹${amount} redeemed successfully!`);
  }, []);

  const handleReferPress = useCallback(() => {
    setShowPointsWallet(true);
  }, []);

  const simulateReferral = useCallback(() => {
    setShowScratchCard(true);
  }, []);

  const handleScratchCardClose = useCallback(() => {
    setShowScratchCard(false);
  }, []);

  const fetchJobs = useCallback(
    async (reset = false, showLoading = true, isClear = false) => {
      // Prevent multiple simultaneous calls using ref
      if (isFetchingRef.current) {
        return;
      }

      // Clear any existing timeout
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }

      // Debounce non-reset calls
      if (!reset) {
        return new Promise(resolve => {
          fetchTimeoutRef.current = setTimeout(async () => {
            await performFetch(reset, showLoading, isClear);
            resolve();
          }, 500);
        });
      }

      // For reset calls, execute immediately
      return performFetch(reset, showLoading, isClear);
    },
    [searchQuery, isFilterActive, currentFilter, selectedJobType],
  );

  const performFetch = useCallback(
    async (reset = false, showLoading = true, isClear = false) => {
      // Double check with ref to prevent race conditions
      if (isFetchingRef.current) {
        return;
      }

      isFetchingRef.current = true;
      setIsFetchingMore(true);

      if (reset && showLoading) {
        setIsLoading(true);
      }
      try {
        const storedUserId = await AsyncStorage.getItem('UserID');
        const currentPage = reset ? 1 : currentPageRef.current;

        // Map selectedJobType to API filter key
        const jobTypeFilterMap = {
          'Near by Jobs': 'nearby',
          'Latest Jobs': 'latest',
          'Trending Jobs': 'trending',
        };
        const jobTypeFilter = jobTypeFilterMap[selectedJobType];

        // Prepare request body based on whether filter is active
        let requestBody = {
          title: isClear === '' ? '' : isClear ? isClear : searchQuery,
          page: currentPage,
          limit: JOBS_PER_PAGE,
          user_id: storedUserId,
        };

        // Add job type filter if selected
        if (jobTypeFilter) {
          requestBody[jobTypeFilter] = jobTypeFilter;
        }

        // If filter is active, include filter parameters
        if (isFilterActive && currentFilter) {
          requestBody = {
            ...requestBody,
            ...currentFilter,
          };
        }
        console.log('requestBody-==-==-', requestBody);
        const data = await makeApiRequest('/view-job-list-new', {
          // const data = await makeApiRequest('/view-job-list-new', {
          method: 'POST',
          body: JSON.stringify(requestBody),
        });
        setTotalRecords(data?.pagination?.total_records);
        console.log('datadata', data);
        if (data?.status === 1) {
          const newJobs = data?.jobs || [];
          if (reset) {
            setJobs(newJobs);
            currentPageRef.current = 2; // Set to 2 since we just loaded page 1
            setPage(2);
          } else {
            // Deduplicate when adding new jobs to prevent duplicates
            setJobs(prev => {
              const existingIds = new Set(
                prev.map(
                  job => `${job.jobId}_${job.businessName}_${job.jobTitle}`,
                ),
              );
              const uniqueNewJobs = newJobs.filter(job => {
                const key = `${job.jobId}_${job.businessName}_${job.jobTitle}`;
                return !existingIds.has(key);
              });
              return [...prev, ...uniqueNewJobs];
            });
            currentPageRef.current = currentPageRef.current + 1;
            setPage(currentPageRef.current);
          }
          // Set hasMoreJobs based on whether we got a full page of results
          setHasMoreJobs(newJobs.length === JOBS_PER_PAGE);
        } else {
          if (reset) setJobs([]);
          setHasMoreJobs(false);
        }
      } catch (error) {
        if (reset) setJobs([]);
        setHasMoreJobs(false);
      } finally {
        isFetchingRef.current = false;
        setIsFetchingMore(false);
        setIsLoading(false);
      }
    },
    [searchQuery, isFilterActive, currentFilter, selectedJobType],
  );

  const fetchJobTitleSuggestions = useCallback(async text => {
    if (text.trim() === '') return [];

    try {
      const json = await makeApiRequest('/fetch-job-titles', {
        method: 'GET',
      });
      const jobTitleList = JSON.parse(json.msg || '[]');
      return jobTitleList.filter(item =>
        item.jobTitle?.toLowerCase().includes(text.toLowerCase()),
      );
    } catch (error) {
      return [];
    }
  }, []);
  // Effects
  useFocusEffect(
    useCallback(() => {
      // Only fetch data if not returning from detail screen and not already initialized
      if (!isReturningFromDetail && !hasInitialized) {
        if (
          route.params?.filteredJobs &&
          route.params.filteredJobs.length > 0
        ) {
          setJobs(route.params.filteredJobs);
          setHasMoreJobs(false);
        } else {
          fetchJobs(true);
        }
        setHasInitialized(true);
      }

      // Reset returning flag
      if (isReturningFromDetail) {
        setIsReturningFromDetail(false);
      }

      // Load referral data
      loadReferralData();

      // Always fetch static data (job titles, states) but only once
      if (!hasInitialized) {
        fetchJobTitles();
        fetchStates();
      }
    }, [
      route.params,
      isReturningFromDetail,
      hasInitialized,
      fetchJobs,
      fetchJobTitles,
      fetchStates,
    ]),
  );

  useEffect(() => {
    fetchCities(selectedState);
  }, [selectedState, fetchCities]);

  // Fetch jobs when job type filter changes
  useEffect(() => {
    if (hasInitialized) {
      // Reset and fetch jobs when job type changes
      fetchJobs(true, true);
    }
  }, [selectedJobType, hasInitialized, fetchJobs]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  // Listen to listPaddingTop animated value changes
  useEffect(() => {
    const listenerId = listPaddingTop.addListener(({value}) => {
      console.log('value-----', value);
      setListPaddingTopValue(value);
    });
    return () => {
      listPaddingTop.removeListener(listenerId);
    };
  }, [listPaddingTop]);

  const requestUserPermission = async () => {
    const authStatus = await getMessaging().requestPermission();
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // StatusMethods.createNotificationListeners(props.navigation);
      createNotificationListeners(props.navigation);
    }
  };
  const navigateNotification = (item, navigation) => {
    if (navigationRef.isReady()) {
      const route = navigationRef.getCurrentRoute();
    }

    // navigation.navigate('ChatScreen', {
    //   notificationSide: true,
    //   fromFadeNotification: true,
    //   fromInbox: {user_id: parseFloat(item?.sender_user_id)},
    // });
  };
  const createNotificationListeners = async navigation => {
    // console.log('createNotificationListeners------', navigation);
    if (notificationListenersSet.current) {
      return;
    }
    notificationListenersSet.current = true;

    onNotificationOpenedAppUnsubscribeRef.current =
      getMessaging().onNotificationOpenedApp(async remoteMessage => {
        if (remoteMessage) {
          // background
          // console.log('remoteMessage------', remoteMessage);
          navigateNotification(remoteMessage?.data, navigation);
        }
      });

    onMessageUnsubscribeRef.current = getMessaging().onMessage(
      async remoteMessage => {
        // console.log('remoteMessage-for-----', remoteMessage);
        // fore
      },
    );

    getMessaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        // kill
        // console.log('remoteMessage-for-kill-----', remoteMessage);
        if (remoteMessage) {
          navigateNotification(remoteMessage?.data, navigation);
        }
      });
  };
  // const handleSearch = useCallback(text => {
  //   setSearchQuery(text);
  //   setPage(1);
  //   setHasMoreJobs(true);
  //   setIsFetchingMore(false);
  //   // Clear filters when searching
  //   setIsFilterActive(false);
  //   setCurrentFilter(null);
  // }, []);

  const handleSearch = useCallback(text => {
    setSearchQuery(text);
    currentPageRef.current = 1;
    setPage(1);
    setHasMoreJobs(true);
    setIsFetchingMore(false);
    isFetchingRef.current = false;
    setIsFilterActive(false);
    setCurrentFilter(null);
  }, []);
  const handleJobApplied = useCallback(appliedJobId => {
    setJobs(prev => prev.filter(job => job.jobId !== appliedJobId));
  }, []);
  const navigateToDescription = useCallback(
    job => {
      setIsReturningFromDetail(true);
      navigation.navigate('JobDes', {job, onApplied: handleJobApplied});
    },
    [navigation, handleJobApplied],
  );

  // Memoized renderItem function for better performance
  const renderJobItem = useCallback(
    ({item}) => (
      <JobBox
        item={item}
        isActive={false}
        onPress={navigateToDescription}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={favoriteJobs.includes(item.jobId)}
      />
    ),
    [navigateToDescription, handleToggleFavorite, favoriteJobs],
  );

  // Robust keyExtractor to handle duplicate jobIds
  const keyExtractor = useCallback((item, index) => {
    // Use jobId if available, otherwise fallback to index
    // Add index to ensure uniqueness even with duplicate jobIds
    return `${item.jobId || 'job'}_${index}`;
  }, []);

  // Deduplicate jobs array to prevent duplicate keys
  const deduplicatedJobs = useMemo(() => {
    const seen = new Set();
    return jobs.filter(job => {
      const key = `${job.jobId}_${job.businessName}_${job.jobTitle}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, [jobs]);

  // Check if any filters are active
  const isAnyFilterActive = useMemo(() => {
    return (
      formData.location ||
      formData.title ||
      formData.experience ||
      formData.gender !== 'Male' ||
      formData.jobPosted !== 'All' ||
      formData.age[0] !== 18 ||
      formData.age[1] !== 52 ||
      formData.salary[0] !== 0 ||
      formData.salary[1] !== 200000 ||
      formData.nearest_job ||
      selectedState ||
      selectedCity
    );
  }, [formData, selectedState, selectedCity]);
  const handleFilter = useCallback(async () => {
    const payload = {
      location: formData?.location ? formData?.location : '',
      jobPosted: formData?.jobPosted ? formData?.jobPosted : '',
      industry: formData?.title ? formData?.title : '',
      state: selectedState ? selectedState : '',
      city: selectedCity ? selectedCity : '',
      ageMin: formData?.age[0] ? formData?.age[0] : '',
      ageMax: formData?.age[1] ? formData?.age[1] : '',
      salaryMin: formData?.salary[0] ? formData?.salary[0] : '',
      salaryMax: formData?.salary[1] ? formData?.salary[1] : '',
      gender: formData?.gender ? formData?.gender : '',
      experience: formData?.experience ? formData?.experience : '',
      nearest_job: formData?.nearest_job ? formData?.nearest_job : '',
    };

    // Set filter state for pagination
    setIsFilterActive(true);
    setCurrentFilter(payload);
    currentPageRef.current = 1;
    setPage(1);
    setHasMoreJobs(true);
    setIsFetchingMore(false);
    isFetchingRef.current = false;
    try {
      const storedUserId = await AsyncStorage.getItem('UserID');
      const data = await makeApiRequest('/view-job-list-new', {
        method: 'POST',
        body: JSON.stringify({
          title: '',
          page: 1,
          limit: JOBS_PER_PAGE,
          user_id: storedUserId,
          ...payload,
        }),
      });
      setTotalRecords(data?.pagination?.total_records);
      if (data.status === 1) {
        const jobs = data?.jobs || [];
        setJobs(jobs);
        currentPageRef.current = 2; // Set to 2 since we just loaded page 1
        setPage(2);
        setHasMoreJobs(jobs.length === JOBS_PER_PAGE);
      } else {
        setJobs([]);
        setHasMoreJobs(false);
      }
    } catch (error) {
      setJobs([]);
      setHasMoreJobs(false);
    }
  }, [formData, selectedState, selectedCity]);

  const clearFilters = useCallback(async () => {
    // Reset all filter states
    setIsFilterActive(false);
    setCurrentFilter(null);
    currentPageRef.current = 1;
    setPage(1);
    setHasMoreJobs(true);
    setIsFetchingMore(false);
    isFetchingRef.current = false;
    setFormData(prev => ({
      ...prev,
      location: null,
      title: null,
      experience: null,
      salary: [0, 200000],
      age: [18, 52],
      gender: 'Male',
      jobPosted: 'All',
      nearest_job: '',
    }));
    setSelectedState('');
    setSelectedCity('');
    setSelectedNearestJob('');
    setShowFilter(false); // Close filter modal

    // Reset search query as well
    setSearchQuery('');

    // Fetch fresh jobs without filters
    try {
      const storedUserId = await AsyncStorage.getItem('UserID');
      console.log('JOBS_PER_PAGEJOBS_PER_PAGE', JOBS_PER_PAGE);
      const data = await makeApiRequest('/view-job-list-new', {
        method: 'POST',
        body: JSON.stringify({
          title: '',
          page: 1,
          limit: JOBS_PER_PAGE,
          user_id: storedUserId,
        }),
      });
      setTotalRecords(data?.pagination?.total_records);
      if (data?.status === 1) {
        const newJobs = data?.jobs || [];
        setJobs(newJobs);
        currentPageRef.current = 2; // Set to 2 since we just loaded page 1
        setPage(2);
        setHasMoreJobs(newJobs.length === JOBS_PER_PAGE);
      } else {
        setJobs([]);
        setHasMoreJobs(false);
      }
    } catch (error) {
      setJobs([]);
      setHasMoreJobs(false);
    }
  }, []);

  // Manual refresh function
  const handleRefresh = useCallback(async () => {
    if (isFetchingMore) return;

    currentPageRef.current = 1;
    setPage(1);
    setHasMoreJobs(true);
    setIsFetchingMore(false);
    isFetchingRef.current = false;
    await fetchJobs(true);
  }, [fetchJobs, isFetchingMore]);

  // Handle scroll for sticky carousel
  const handleScroll = useCallback(
    event => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      scrollOffset.current = currentScrollY;
      const scrollDifference = currentScrollY - lastScrollY.current;

      // Prevent animation if already animating
      if (isAnimating.current) {
        lastScrollY.current = currentScrollY;
        return;
      }

      // Only trigger if scroll difference is significant (more than 8 pixels)
      if (Math.abs(scrollDifference) > 8) {
        const scrollingDown = scrollDifference > 0;

        // Only animate if direction changed or at the top
        if (scrollingDown !== isScrollingDown.current || currentScrollY < 10) {
          isScrollingDown.current = scrollingDown;
          isAnimating.current = true;

          // Show carousel when scrolling up or at the top
          if (!scrollingDown || currentScrollY < 10) {
            // Show carousel and adjust search bar/list
            Animated.parallel([
              Animated.timing(carouselTranslateY, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(carouselOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(searchBarMarginTop, {
                toValue: 90, // Original position (carousel height + margin)
                duration: 200,
                useNativeDriver: false,
              }),
              Animated.timing(listPaddingTop, {
                toValue: 1, // Original padding (carousel height + margin)
                duration: 200,
                useNativeDriver: false,
              }),
            ]).start(() => {
              isAnimating.current = false;
              setIsCarouselVisible(true);
            });
          } else {
            // Hide carousel when scrolling down and adjust search bar/list
            Animated.parallel([
              Animated.timing(carouselTranslateY, {
                toValue: -86, // Hide completely (70px height + 16px top margin)
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(carouselOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(searchBarMarginTop, {
                toValue: 4, // Small margin to account for container padding
                duration: 200,
                useNativeDriver: false,
              }),
              Animated.timing(listPaddingTop, {
                toValue: 0, // No padding when carousel is hidden
                duration: 200,
                useNativeDriver: false,
              }),
            ]).start(() => {
              isAnimating.current = false;
              setIsCarouselVisible(false);
            });
          }
        }
      }

      lastScrollY.current = currentScrollY;
    },
    [carouselTranslateY, carouselOpacity, searchBarMarginTop, listPaddingTop],
  );

  const FilterButton = memo(() => (
    <TouchableOpacity
      style={styles.searchButton}
      onPress={() => setShowFilter(!showFilter)}>
      <View style={styles.filterIconContainer}>
        <Image
          source={require('../../../assets/Image/icons/filter.png')}
          style={styles.jobImg1}
        />
        {isAnyFilterActive && <View style={styles.filterIndicator} />}
      </View>
    </TouchableOpacity>
  ));
  const JobHeader = memo(() => (
    <View style={{backgroundColor: '#F5F4FD'}}>
      <Carousel
        loop
        width={Dimensions.get('window').width - 30}
        height={70}
        autoPlay={true}
        autoPlayInterval={3000}
        data={carouselData}
        scrollAnimationDuration={1000}
        onSnapToItem={index => console.log('current index:', index)}
        renderItem={({item}) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('FromShare');
              // navigation.navigate('PointsWallet');
            }}
            style={[
              styles.carouselItem,
              {backgroundColor: item.backgroundColor},
            ]}>
            <Image source={item.image} style={styles.carouselImage} />
            <View style={styles.carouselContent}>
              <Text style={styles.carouselTitle}>{item.title}</Text>
              <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={[styles.row, {marginTop: 15, paddingHorizontal: 8}]}>
        <View style={styles.inputWithIcon}>
          <TextInput
            style={styles.input}
            placeholder="Job Title, Skills, Location"
            placeholderTextColor="#D0D0D0"
            value={searchQuery}
            onChangeText={async text => {
              handleSearch(text);
              if (text == '') {
                setTimeout(() => {
                  setShowSuggestion(false);
                }, 1000);
                setSuggestion([]);
                // Fetch fresh jobs when search text is cleared
                await fetchJobs(true, false, '');
                return;
              } else {
                if (text) {
                  const filteredSuggestions =
                    await fetchJobTitleSuggestions(text);
                  if (text.trim() === '') return;

                  setSuggestion(filteredSuggestions);
                  setShowSuggestion(filteredSuggestions.length > 0);
                }
              }
            }}
          />

          <Image
            source={require('../../../assets/Image/icons/search.png')}
            style={styles.jobImg1}
            resizeMode="contain"
          />

          {showSuggestion && (
            <FlatList
              keyboardShouldPersistTaps="handled"
              style={styles.suggestionList}
              ItemSeparatorComponent={() => (
                <View style={styles.suggestionSeparator} />
              )}
              data={suggestion}
              renderItem={({item}) => (
                <Pressable
                  style={styles.suggestionItem}
                  onPress={async () => {
                    setSearchQuery(item?.jobTitle);
                    setShowSuggestion(false);
                    // Clear filters when searching
                    setIsFilterActive(false);
                    setCurrentFilter(null);
                    // Fetch jobs without showing loading indicator for suggestion selection
                    await fetchJobs(true, false, item?.jobTitle);
                  }}>
                  <Text>{item?.jobTitle}</Text>
                </Pressable>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
        <FilterButton />
      </View>
      {totalRecords > 0 && (
        <View
          style={{
            marginHorizontal: 15,
            marginBottom: 10,
          }}>
          <Text style={styles.recordsSummaryText}>
            {`${'we have found ' + `${totalRecords}` + ' ' + (totalRecords === 1 ? 'job' : 'jobs') + ' for you.'}`}
          </Text>
        </View>
      )}
      {/* <LoadingModal /> */}
      <View style={styles.jobTypeButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.jobTypeButton,
            selectedJobType === 'Near by Jobs' && styles.jobTypeButtonSelected,
          ]}
          onPress={() => {
            setSelectedJobType('Near by Jobs');
          }}>
          <Text
            style={[
              styles.jobTypeButtonText,
              selectedJobType === 'Near by Jobs' &&
                styles.jobTypeButtonTextSelected,
            ]}>
            Near by Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.jobTypeButton,
            selectedJobType === 'Latest Jobs' && styles.jobTypeButtonSelected,
          ]}
          onPress={() => {
            setSelectedJobType('Latest Jobs');
          }}>
          <Text
            style={[
              styles.jobTypeButtonText,
              selectedJobType === 'Latest Jobs' &&
                styles.jobTypeButtonTextSelected,
            ]}>
            Latest Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.jobTypeButton,
            selectedJobType === 'Trending Jobs' && styles.jobTypeButtonSelected,
          ]}
          onPress={() => {
            setSelectedJobType('Trending Jobs');
          }}>
          <Text
            style={[
              styles.jobTypeButtonText,
              selectedJobType === 'Trending Jobs' &&
                styles.jobTypeButtonTextSelected,
            ]}>
            Trending Jobs
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ));

  // const LoadingModal = memo(() => (
  //   <Modal visible={isLoading} transparent={true} animationType="fade">
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#34348fff" />
  //     </View>
  //   </Modal>
  // ));
  return (
    <View style={{flex: 1, backgroundColor: '#F5F4FD'}}>
      <TopHeaderJob handleReferPress={handleReferPress} />

      <View style={styles.container}>
        {showFilter && (
          <View
            style={[styles.filterContainerFull, {height: screenHeight - 260}]}>
            <ScrollView
              style={{flex: 1}}
              contentContainerStyle={{
                paddingBottom: 30,
                flexGrow: 1,
              }}
              showsVerticalScrollIndicator={true}
              bounces={true}
              scrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}>
              <View style={{flex: 1, backgroundColor: '#fff'}}>
                <Text style={styles.sectionTitleJob}>Job Posted</Text>
                <View style={styles.rowWrap}>
                  {[
                    'All',
                    'Last 24 Hours',
                    'Last 03 Days',
                    'Last 07 Days',
                    'Last 15 Days',
                    'Last 01 Month',
                  ].map(option => (
                    <TouchableOpacity
                      key={option}
                      style={styles.radioOption}
                      onPress={() =>
                        setFormData(prev => ({...prev, jobPosted: option}))
                      }>
                      <View
                        style={[
                          styles.radioCircle,
                          formData.jobPosted === option && styles.radioSelected,
                        ]}>
                        {formData.jobPosted === option && (
                          <View style={styles.innerDot} />
                        )}
                      </View>
                      <Text>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Nearby job</Text>
                  <TouchableOpacity
                    style={styles.pickerWrapper}
                    onPress={() => setShowNearestJobModal(true)}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.pickerText,
                        selectedNearestJob === ''
                          ? styles.placeholderText
                          : styles.selectedText,
                      ]}>
                      {selectedNearestJob === ''
                        ? 'Nearest job'
                        : `${selectedNearestJob}Km`}
                    </Text>
                    <Image
                      source={require('../../../assets/Image/icons/next.png')}
                      style={[styles.jobImg, {transform: [{rotate: '90deg'}]}]}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Select State</Text>
                  {loadingStates && !isLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <TouchableOpacity
                      style={styles.pickerWrapper}
                      onPress={() => {
                        setShowStateModal(true);
                        setStateSearchText('');
                      }}
                      activeOpacity={0.7}>
                      <Text
                        style={[
                          styles.pickerText,
                          selectedState === ''
                            ? styles.placeholderText
                            : styles.selectedText,
                        ]}>
                        {selectedState === ''
                          ? 'Choose a State'
                          : selectedState}
                      </Text>
                      <Image
                        source={require('../../../assets/Image/icons/next.png')}
                        style={[
                          styles.jobImg,
                          {transform: [{rotate: '90deg'}]},
                        ]}
                      />
                    </TouchableOpacity>
                  )}

                  {/* State Modal */}
                  <Modal
                    visible={showStateModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowStateModal(false)}>
                    <TouchableOpacity
                      style={styles.modalOverlay}
                      activeOpacity={1}
                      onPress={() => setShowStateModal(false)}>
                      <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                          <Text style={styles.modalTitle}>Select State</Text>
                          <TouchableOpacity
                            onPress={() => setShowStateModal(false)}
                            style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                          </TouchableOpacity>
                        </View>

                        {/* Search Input */}
                        <View style={styles.searchContainer}>
                          <Image
                            source={require('../../../assets/Image/icons/search.png')}
                            style={styles.jobImg1}
                          />
                          <TextInput
                            style={styles.searchInput}
                            placeholder="Search state..."
                            value={stateSearchText}
                            onChangeText={setStateSearchText}
                            placeholderTextColor="#999"
                          />
                          {stateSearchText.length > 0 && (
                            <TouchableOpacity
                              onPress={() => setStateSearchText('')}
                              style={styles.clearSearchButton}>
                              <Text style={styles.clearSearchText}>✕</Text>
                            </TouchableOpacity>
                          )}
                        </View>

                        <View style={styles.modalOptionsContainer}>
                          <ScrollView
                            style={styles.modalOptions}
                            showsVerticalScrollIndicator={true}
                            contentContainerStyle={styles.modalOptionsContent}>
                            {states
                              .filter(state =>
                                state.state
                                  ?.toLowerCase()
                                  .includes(stateSearchText.toLowerCase()),
                              )
                              .map(state => (
                                <TouchableOpacity
                                  key={state.stateId}
                                  style={[
                                    styles.modalOption,
                                    selectedState === state.state &&
                                      styles.modalOptionSelected,
                                  ]}
                                  onPress={() => {
                                    setSelectedState(state.state);
                                    setShowStateModal(false);
                                  }}>
                                  <Text
                                    style={[
                                      styles.modalOptionText,
                                      selectedState === state.state &&
                                        styles.modalOptionTextSelected,
                                    ]}>
                                    {state.state}
                                  </Text>
                                  {selectedState === state.state && (
                                    <Text style={styles.tickMark}>✓</Text>
                                  )}
                                </TouchableOpacity>
                              ))}
                          </ScrollView>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Modal>
                  {selectedState !== '' && selectedState !== null && (
                    <>
                      <Text style={styles.sectionTitle}>Select City</Text>
                      <TouchableOpacity
                        style={styles.pickerWrapper}
                        onPress={() => {
                          setShowCityModal(true);
                          setCitySearchText('');
                        }}
                        activeOpacity={0.7}>
                        <Text
                          style={[
                            styles.pickerText,
                            selectedCity === '' || !selectedCity
                              ? styles.placeholderText
                              : styles.selectedText,
                          ]}>
                          {selectedCity === '' || !selectedCity
                            ? 'Choose a City'
                            : selectedCity}
                        </Text>
                        <Image
                          source={require('../../../assets/Image/icons/next.png')}
                          style={[
                            styles.jobImg,
                            {transform: [{rotate: '90deg'}]},
                          ]}
                        />
                      </TouchableOpacity>

                      {/* City Modal */}
                      <Modal
                        visible={showCityModal}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setShowCityModal(false)}>
                        <TouchableOpacity
                          style={styles.modalOverlay}
                          activeOpacity={1}
                          onPress={() => setShowCityModal(false)}>
                          <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                              <Text style={styles.modalTitle}>Select City</Text>
                              <TouchableOpacity
                                onPress={() => setShowCityModal(false)}
                                style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>✕</Text>
                              </TouchableOpacity>
                            </View>

                            {/* Search Input */}
                            <View style={styles.searchContainer}>
                              <Image
                                source={require('../../../assets/Image/icons/search.png')}
                                style={styles.jobImg1}
                              />
                              <TextInput
                                style={styles.searchInput}
                                placeholder="Search city..."
                                value={citySearchText}
                                onChangeText={setCitySearchText}
                                placeholderTextColor="#999"
                              />
                              {citySearchText.length > 0 && (
                                <TouchableOpacity
                                  onPress={() => setCitySearchText('')}
                                  style={styles.clearSearchButton}>
                                  <Text style={styles.clearSearchText}>✕</Text>
                                </TouchableOpacity>
                              )}
                            </View>

                            <View style={styles.modalOptionsContainer}>
                              <ScrollView
                                style={styles.modalOptions}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={
                                  styles.modalOptionsContent
                                }>
                                {cities
                                  .filter(city =>
                                    city.city
                                      ?.toLowerCase()
                                      .includes(citySearchText.toLowerCase()),
                                  )
                                  .map(city => (
                                    <TouchableOpacity
                                      key={city.cityId}
                                      style={[
                                        styles.modalOption,
                                        selectedCity === city.city &&
                                          styles.modalOptionSelected,
                                      ]}
                                      onPress={() => {
                                        setSelectedCity(city.city);
                                        setShowCityModal(false);
                                      }}>
                                      <Text
                                        style={[
                                          styles.modalOptionText,
                                          selectedCity === city.city &&
                                            styles.modalOptionTextSelected,
                                        ]}>
                                        {city.city}
                                      </Text>
                                      {selectedCity === city.city && (
                                        <Text style={styles.tickMark}>✓</Text>
                                      )}
                                    </TouchableOpacity>
                                  ))}
                              </ScrollView>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </Modal>
                    </>
                  )}
                </View>

                <Text style={styles.sectionTitle}>Job Category</Text>
                <TouchableOpacity
                  style={styles.pickerWrapper}
                  onPress={() => {
                    setShowCategoryModal(true);
                    setCategorySearchText('');
                  }}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.pickerText,
                      !formData.title || formData.title === ''
                        ? styles.placeholderText
                        : styles.selectedText,
                    ]}>
                    {formData.title === '' || !formData.title
                      ? 'Select Category'
                      : formData.title}
                  </Text>
                  <Image
                    source={require('../../../assets/Image/icons/next.png')}
                    style={[styles.jobImg, {transform: [{rotate: '90deg'}]}]}
                  />
                </TouchableOpacity>

                {/* Job Category Modal */}
                <Modal
                  visible={showCategoryModal}
                  transparent={true}
                  animationType="fade"
                  onRequestClose={() => setShowCategoryModal(false)}>
                  <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowCategoryModal(false)}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                          Select Job Category
                        </Text>
                        <TouchableOpacity
                          onPress={() => setShowCategoryModal(false)}
                          style={styles.closeButton}>
                          <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Search Input */}
                      <View style={styles.searchContainer}>
                        <Image
                          source={require('../../../assets/Image/icons/search.png')}
                          style={styles.jobImg1}
                        />
                        <TextInput
                          style={styles.searchInput}
                          placeholder="Search category..."
                          value={categorySearchText}
                          onChangeText={setCategorySearchText}
                          placeholderTextColor="#999"
                        />
                        {categorySearchText.length > 0 && (
                          <TouchableOpacity
                            onPress={() => setCategorySearchText('')}
                            style={styles.clearSearchButton}>
                            <Text style={styles.clearSearchText}>✕</Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <View style={styles.modalOptionsContainer}>
                        <ScrollView
                          style={styles.modalOptions}
                          showsVerticalScrollIndicator={true}
                          contentContainerStyle={styles.modalOptionsContent}>
                          {jobTitles
                            .filter(item =>
                              item.Industry?.toLowerCase().includes(
                                categorySearchText.toLowerCase(),
                              ),
                            )
                            .map(item => (
                              <TouchableOpacity
                                key={item.IndustryId}
                                style={[
                                  styles.modalOption,
                                  formData.title === item.Industry &&
                                    styles.modalOptionSelected,
                                ]}
                                onPress={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    title: item.Industry,
                                  }));
                                  setShowCategoryModal(false);
                                }}>
                                <Text
                                  style={[
                                    styles.modalOptionText,
                                    formData.title === item.Industry &&
                                      styles.modalOptionTextSelected,
                                  ]}>
                                  {item.Industry}
                                </Text>
                                {formData.title === item.Industry && (
                                  <Text style={styles.tickMark}>✓</Text>
                                )}
                              </TouchableOpacity>
                            ))}
                        </ScrollView>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>

                {/* Nearest Job Modal */}
                <Modal
                  visible={showNearestJobModal}
                  transparent={true}
                  animationType="fade"
                  onRequestClose={() => setShowNearestJobModal(false)}>
                  <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowNearestJobModal(false)}>
                    <View
                      style={[
                        styles.modalContent,
                        {maxHeight: '50%', height: '50%'},
                      ]}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Distance</Text>
                        <TouchableOpacity
                          onPress={() => setShowNearestJobModal(false)}
                          style={styles.closeButton}>
                          <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.modalBody}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                          {['5', '10', '20', '30', '40', '50'].map(distance => (
                            <TouchableOpacity
                              key={distance}
                              style={[
                                styles.optionItem,
                                selectedNearestJob === distance &&
                                  styles.selectedOption,
                              ]}
                              onPress={() => {
                                setSelectedNearestJob(distance);
                                setFormData(prev => ({
                                  ...prev,
                                  nearest_job: distance,
                                }));
                                setShowNearestJobModal(false);
                              }}>
                              <Text
                                style={[
                                  styles.optionText,
                                  selectedNearestJob === distance &&
                                    styles.selectedOptionText,
                                ]}>
                                {distance}Km
                              </Text>
                              {selectedNearestJob === distance && (
                                <Text style={styles.checkmark}>✓</Text>
                              )}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>

                <View style={{width: '100%'}}>
                  <View style={{marginLeft: 26}}>
                    <Text style={styles.sectionTitle}>Age </Text>
                    <Text style={styles.sliderLabel}>
                      {formData.age[0]} years - {formData.age[1]} years
                    </Text>
                  </View>

                  <View style={{width: '100%', alignItems: 'center'}}>
                    <MultiSlider
                      values={[formData.age[0], formData.age[1]]}
                      onValuesChange={values =>
                        setFormData(prev => ({...prev, age: values}))
                      }
                      min={18}
                      max={60}
                      step={1}
                      selectedStyle={{backgroundColor: '#FF8D53'}}
                      markerStyle={{
                        backgroundColor: '#FF8D53',
                        height: 14,
                        width: 14,
                      }}
                    />
                  </View>
                </View>

                <View style={{width: '100%'}}>
                  <View style={{marginLeft: 26}}>
                    <Text style={styles.sectionTitle}>Salary (₹)</Text>
                    <Text style={styles.sliderLabel}>
                      ₹{formData.salary[0]} - ₹{formData.salary[1]}
                    </Text>
                  </View>
                  <View style={{width: '100%', alignItems: 'center'}}>
                    <MultiSlider
                      values={[formData.salary[0], formData.salary[1]]}
                      onValuesChange={values =>
                        setFormData(prev => ({...prev, salary: values}))
                      }
                      min={0}
                      max={200000}
                      step={500}
                      selectedStyle={{backgroundColor: '#FF8D53'}}
                      markerStyle={{
                        backgroundColor: '#FF8D53',
                        height: 14,
                        width: 14,
                      }}
                      // containerStyle={{ marginTop: 8,width: '100%'}}
                    />
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Gender</Text>
                <View style={styles.rowWrapp}>
                  {['Male', 'Female', 'Both'].map(option => (
                    <TouchableOpacity
                      key={option}
                      style={styles.radioOptionG}
                      onPress={() =>
                        setFormData(prev => ({...prev, gender: option}))
                      }>
                      <View
                        style={[
                          styles.radioCircle,
                          formData.gender === option && styles.radioSelected,
                        ]}>
                        {formData.gender === option && (
                          <View style={styles.innerDot} />
                        )}
                      </View>
                      <Text>{option == 'Both' ? 'All' : option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.sectionTitle}>Experience</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={formData.experience}
                    onValueChange={itemValue =>
                      setFormData(prev => ({...prev, experience: itemValue}))
                    }
                    style={styles.picker}>
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
                <View
                  style={[
                    styles.footerButtons,
                    {marginTop: 20, marginBottom: 20},
                  ]}>
                  <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={clearFilters}>
                    <Text style={styles.clearBtnText}>Clear Filter</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => {
                      setShowFilter(false);
                      handleFilter();
                    }}>
                    <Text style={{color: '#fff', alignSelf: 'center'}}>
                      Apply Filter
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        )}

        {!showFilter && (
          <MemoryOptimizedFlatList
            data={deduplicatedJobs}
            keyExtractor={keyExtractor}
            contentContainerStyle={[
              styles.listContainer,
              {paddingTop: listPaddingTopValue},
            ]}
            renderItem={renderJobItem}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onEndReached={() => {
              if (
                hasMoreJobs &&
                !isFetchingMore &&
                !isLoading &&
                !isFetchingRef.current
              ) {
                fetchJobs(false);
              }
            }}
            onEndReachedThreshold={0.1}
            refreshing={isLoading}
            onRefresh={handleRefresh}
            loading={isFetchingMore}
            hasMore={hasMoreJobs}
            HeaderComponent={() => <JobHeader />}
          />
        )}
      </View>
      <JobMenu />

      {/* Scratch Card Modal */}
      <ScratchCardComponent
        isVisible={showScratchCard}
        onClose={handleScratchCardClose}
        onPointsEarned={handlePointsEarned}
        totalPoints={userPoints}
        isRedeemable={isRedeemable(userPoints)}
      />

      {/* Points Wallet Modal */}
      {/* <PointsWallet
        isVisible={showPointsWallet}
        onClose={() => setShowPointsWallet(false)}
        totalPoints={userPoints}
        onRedeem={handleRedeemPoints}
        onRefer={handleReferPress}
        onPointsEarned={handlePointsEarned}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F4FD',
    paddingTop: 16,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },

  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    // marginBottom:20,
  },
  topLeftArrow: {
    position: 'absolute',
    top: 10,
    right: -5,
    zIndex: 1,
  },

  iconn: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    color: '#000',
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginRight: 8,
  },
  icon: {
    padding: 8,
  },
  jobImg: {
    width: 20,
    height: 14,
    resizeMode: 'contain',
    marginRight: 8,
  },
  jobImg1: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  searchButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    //  alignSelf:'center',
  },
  filterIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIndicator: {
    position: 'absolute',
    top: -4,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50', // Green color
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  jobBox: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    // borderWidth: 1,
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 4,
  },
  activeJobBox: {
    borderColor: '#007BFF',
    shadowColor: '#007BFF',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    // elevation: 5,
  },
  saveIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF8D53',
    // marginBottom: 4,
    flexShrink: 1,
    flexGrow: 1,
    flexWrap: 'nowrap',
  },
  jobCompany: {
    fontSize: 13,
    fontWeight: '500',
    color: '#535353',
    flexShrink: 1,
    flexGrow: 1,
    flexWrap: 'nowrap',
  },
  jobLocation: {
    fontSize: 11,
    color: '#535353',
    fontWeight: '400',
    flexShrink: 1,
    // marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rowS: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  jobType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d4574',
  },
  requirementsContainer: {
    marginTop: 12,
  },
  requirementText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },

  filterContainerFull: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 6,
    flex: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  sectionTitle: {fontWeight: '600', marginTop: 16, marginBottom: 8},
  sectionTitleJob: {fontWeight: '600', marginTop: 6, marginBottom: 8},
  sliderLabel: {
    fontSize: 14,
    color: '#333',
    textAlign: 'start',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  rowWrapp: {flexDirection: 'row', flexWrap: 'wrap'},
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    width: '48%',
  },
  radioOptionG: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    margin: 6,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioSelected: {
    borderColor: '#FF8D53',
    backgroundColor: '#FF8D53',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  dropdown: {
    marginBottom: 10,
    borderColor: '#ccc',
    height: 45,
  },
  pickerWrapper: {
    backgroundColor: '#F5F4FD',
    borderRadius: 8,
    height: 45,
    width: '95%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginLeft: 6,
  },

  picker: {
    color: '#585858',
    width: '100%',
    marginTop: -4,
    paddingHorizontal: 10,
  },

  sliderContainer: {
    marginVertical: 10,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    // marginBottom:100,
  },
  clearBtn: {
    padding: 12,
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    width: '47%',
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
  },

  clearBtnText: {
    color: 'black',
    alignSelf: 'center',
  },

  applyBtn: {
    padding: 12,
    backgroundColor: '#FF8D53',
    borderRadius: 8,
    width: '47%',
  },
  noResults: {
    textAlign: 'center',
    marginTop: '40%',
    fontSize: 16,
    color: '#888',
  },
  // salaryContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginTop: 10,
  // },
  // salary: {
  //   fontSize: 12,
  //   color: '#333',
  //   backgroundColor: '#F5F4FD',
  //   paddingVertical: 4,
  //   paddingHorizontal: 14,
  //   borderRadius: 20,
  //   marginRight: 10,
  // },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginTop: 4,
    marginTop: -8,
    marginBottom: -10,
  },

  salaryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  salary: {
    fontSize: 11,
    color: '#535353',
    backgroundColor: '#F5F4FD',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 4,
  },
  // New optimized styles
  suggestionList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    maxHeight: 300,
    zIndex: 1,
    elevation: 4,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  suggestionItem: {
    padding: 10,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  listContainer: {
    paddingBottom: 2,
  },
  footerLoader: {
    marginVertical: 10,
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
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  selectedText: {
    color: '#000',
    // fontWeight: '600',
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
    maxHeight: '85%',
    height: '85%',
    width: '100%',
    // maxWidth: 400,
    overflow: 'hidden',
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  clearSearchButton: {
    padding: 5,
    marginLeft: 5,
  },
  modalOptionsContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  modalOptions: {
    flex: 1,
  },
  modalOptionsContent: {
    paddingBottom: 20,
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
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  clearSearchText: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
  },
  tickMark: {
    fontSize: 20,
    color: '#FF8D53',
    fontWeight: 'bold',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f8f8f8',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#FF8D53',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    color: '#FF8D53',
    fontWeight: 'bold',
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recordsSummaryContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8D53',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recordsSummaryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#495057',
    // textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Carousel styles
  carouselContainer: {
    position: 'absolute',
    top: 16,
    left: 15,
    right: 15,
    zIndex: 1000,
    marginHorizontal: 0,
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  carouselItem: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.3,
  },
  carouselContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  carouselTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  carouselSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  jobTypeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  jobTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  jobTypeButtonSelected: {
    backgroundColor: '#FF8D53',
    borderColor: '#FF8D53',
  },
  jobTypeButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  jobTypeButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default JobPage;
