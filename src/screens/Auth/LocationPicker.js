import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  InteractionManager,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {CommonTextInputs, KeyboardScroll} from '../../component';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {showToastMessage} from '../../utils/Toast';
import {loadingShow} from '../../appRedux/actions/loadingAction';
import {useDispatch} from 'react-redux';
import fonts from '../../theme/fonts';
import Geolocation from 'react-native-geolocation-service';
import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useFocusEffect} from '@react-navigation/native';
import PlacesAutocomplete from '../../components/PlacesAutocomplete';
import {isLocationEnabled} from 'react-native-device-info';
import {getLocationFetch} from '../../utils/helper';

const LocationPicker = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showCityModal, setShowCityModal] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedLat, setSelectedLat] = useState('');
  const [selectedLng, setSelectedLng] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedPincode, setSelectedPincode] = useState('');
  const [locationSelected, setLocationSelected] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  // API data
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  let fromEdit = route?.params?.fromEdit || false;
  // Fetch states
  const fetchStates = useCallback(async () => {
    try {
      const response = await fetch('https://jobipo.com/api/v3/fetch-states', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
        },
      });

      const result = await response.json();
      if (result?.status === 1 && result?.msg) {
        const parsed = JSON.parse(result.msg);
        if (Array.isArray(parsed)) {
          setStates(parsed);
        }
      }
    } catch (error) {
      console.log('Error fetching states:', error);
    }
  }, []);

  // Fetch all cities
  const fetchAllCities = useCallback(async () => {
    setLoadingCities(true);
    try {
      const response = await fetch(
        'https://jobipo.com/api/v3/fetch-all-cities',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          },
        },
      );

      const result = await response.json();
      console.log('cities data', result);

      if (result?.success && result?.data && Array.isArray(result.data)) {
        setCities(result.data);
        setFilteredCities(result.data);
      } else if (result?.status === 1 && result?.msg) {
        const parsed = JSON.parse(result.msg);
        if (Array.isArray(parsed)) {
          setCities(parsed);
          setFilteredCities(parsed);
        }
      }
    } catch (error) {
      console.log('Error fetching cities:', error);
      showToastMessage('Failed to load cities', 'danger');
    } finally {
      setLoadingCities(false);
    }
  }, []);

  // Filter cities based on search query
  useEffect(() => {
    if (citySearchQuery.trim()) {
      const filtered = cities.filter(cityItem => {
        const cityName = (cityItem.city || '').toLowerCase();
        return cityName.includes(citySearchQuery.toLowerCase().trim());
      });
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  }, [citySearchQuery, cities]);

  // Load cities and states on focus
  useFocusEffect(
    useCallback(() => {
      fetchStates();
      fetchAllCities();
    }, [fetchStates, fetchAllCities]),
  );

  useEffect(() => {
    // Set initial values from route params if needed
    if (route?.params?.current_location) {
      const locationParts = route.params.current_location.split(',');
      if (locationParts.length >= 2) {
        setCity(locationParts[0]?.trim() || '');
        const areaPart = locationParts.slice(1).join(',').trim() || '';
        setArea(areaPart);
        // If coming from JobProfile (fromEdit), set location as selected
        if (fromEdit && areaPart) {
          setLocationSelected(true);
        }
      } else if (locationParts.length === 1) {
        // If only one part, treat it as area (for backward compatibility)
        const areaPart = locationParts[0]?.trim() || '';
        setArea(areaPart);
        if (fromEdit && areaPart) {
          setLocationSelected(true);
        }
      }
    }
  }, [route?.params, fromEdit]);

  const handleUseCurrentLocation = async () => {
    setIsGettingLocation(true);
    dispatch(loadingShow(true));

    // Wait for next tick to ensure Activity is attached
    requestAnimationFrame(() => {
      // Use InteractionManager to ensure Activity is ready
      InteractionManager.runAfterInteractions(() => {
        // Add delay to ensure Activity is fully attached
        setTimeout(async () => {
          try {
            // Check and request location permission
            const permission = Platform.select({
              android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
              ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            });

            let permissionStatus;
            try {
              permissionStatus = await check(permission);
            } catch (checkError) {
              console.log('Permission check error:', checkError);
              permissionStatus = RESULTS.DENIED;
            }

            if (permissionStatus !== RESULTS.GRANTED) {
              // Wait a bit more before requesting permission
              await new Promise(resolve => setTimeout(resolve, 200));

              try {
                const requestResult = await request(permission);
                if (requestResult !== RESULTS.GRANTED) {
                  showToastMessage('Location permission is required', 'danger');
                  setIsGettingLocation(false);
                  dispatch(loadingShow(false));
                  return;
                }
              } catch (requestError) {
                console.log('Permission request error:', requestError);
                showToastMessage(
                  'Error requesting location permission',
                  'danger',
                );
                setIsGettingLocation(false);
                dispatch(loadingShow(false));
                return;
              }
            }

            Geolocation.getCurrentPosition(
              async position => {
                console.log('position---dd--', position);
                const {latitude, longitude} = position.coords;
                // Reverse geocode to get address
                try {
                  const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDqBEtr9Djdq0b9NTCMmquSrKiPCCv384o`,
                  );
                  const data = await response.json();

                  if (data.results && data.results.length > 0) {
                    const addressComponents =
                      data.results[0].address_components;
                    let cityName = '';
                    let areaName = '';

                    // Extract city
                    const cityComponent = addressComponents.find(
                      component =>
                        component.types.includes('locality') ||
                        component.types.includes('administrative_area_level_2'),
                    );
                    if (cityComponent) {
                      cityName = cityComponent.long_name;
                      setCity(cityName);
                      setSelectedCity(cityName);
                    }

                    // Extract area/neighborhood
                    const areaComponent = addressComponents.find(
                      component =>
                        component.types.includes('sublocality') ||
                        component.types.includes('neighborhood') ||
                        component.types.includes('sublocality_level_1'),
                    );
                    if (areaComponent) {
                      areaName = areaComponent.long_name;
                      setArea(areaName);
                    } else {
                      // Use formatted address as fallback
                      const formattedAddress =
                        data.results[0].formatted_address;
                      const addressParts = formattedAddress.split(',');
                      if (addressParts.length > 1) {
                        setArea(addressParts[0]?.trim() || '');
                      }
                    }

                    // Extract pincode
                    const postalCodeComponent = addressComponents.find(
                      component => component.types.includes('postal_code'),
                    );
                    const pincode = postalCodeComponent
                      ? postalCodeComponent.long_name
                      : '';

                    // Extract state
                    const stateComponent = addressComponents.find(component =>
                      component.types.includes('administrative_area_level_1'),
                    );
                    const stateName = stateComponent
                      ? stateComponent.long_name
                      : '';

                    // Return location data immediately after GPS fetch
                    const fullLocation = `${cityName}, ${areaName}`;
                    if (route?.params?.onLocationSelect) {
                      route.params.onLocationSelect(
                        fullLocation, // current_location
                        latitude, // lat
                        longitude, // lng
                        cityName, // city
                        stateName, // state
                        pincode, // pincode
                        areaName, // area
                      );
                      // Navigate back after setting data
                      // setTimeout(() => {
                      //   navigation.goBack();
                      // }, 500);
                    }

                    showToastMessage(
                      'Location fetched successfully',
                      'success',
                    );
                  } else {
                    showToastMessage(
                      'Unable to get location details',
                      'danger',
                    );
                  }
                } catch (geocodeError) {
                  console.log('Geocode error:', geocodeError);
                  showToastMessage('Error fetching address details', 'danger');
                } finally {
                  setIsGettingLocation(false);
                  dispatch(loadingShow(false));
                }
              },
              error => {
                console.log('error-----', error);
              },
              {
                // distanceFilter: 20,
                enableHighAccuracy: true, // Fast and accurate GPS
                // forceRequestLocation: true, // Forces location request
                // timeout: 10000, // Time to wait before failing
                // maximumAge: 5000, // Cache location for fast retrieval
              },
            );

            // // Get current position
            // Geolocation.getCurrentPosition(
            //   async position => {
            //     const {latitude, longitude} = position.coords;

            //     // Reverse geocode to get address
            //     // try {
            //     //   const response = await fetch(
            //     //     `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDqBEtr9Djdq0b9NTCMmquSrKiPCCv384o`,
            //     //   );
            //     //   const data = await response.json();

            //     //   if (data.results && data.results.length > 0) {
            //     //     const addressComponents =
            //     //       data.results[0].address_components;
            //     //     let cityName = '';
            //     //     let areaName = '';

            //     //     // Extract city
            //     //     const cityComponent = addressComponents.find(
            //     //       component =>
            //     //         component.types.includes('locality') ||
            //     //         component.types.includes('administrative_area_level_2'),
            //     //     );
            //     //     if (cityComponent) {
            //     //       cityName = cityComponent.long_name;
            //     //       setCity(cityName);
            //     //       setSelectedCity(cityName);
            //     //     }

            //     //     // Extract area/neighborhood
            //     //     const areaComponent = addressComponents.find(
            //     //       component =>
            //     //         component.types.includes('sublocality') ||
            //     //         component.types.includes('neighborhood') ||
            //     //         component.types.includes('sublocality_level_1'),
            //     //     );
            //     //     if (areaComponent) {
            //     //       areaName = areaComponent.long_name;
            //     //       setArea(areaName);
            //     //     } else {
            //     //       // Use formatted address as fallback
            //     //       const formattedAddress =
            //     //         data.results[0].formatted_address;
            //     //       const addressParts = formattedAddress.split(',');
            //     //       if (addressParts.length > 1) {
            //     //         setArea(addressParts[0]?.trim() || '');
            //     //       }
            //     //     }

            //     //     // Extract pincode
            //     //     const postalCodeComponent = addressComponents.find(
            //     //       component => component.types.includes('postal_code'),
            //     //     );
            //     //     const pincode = postalCodeComponent
            //     //       ? postalCodeComponent.long_name
            //     //       : '';

            //     //     // Extract state
            //     //     const stateComponent = addressComponents.find(component =>
            //     //       component.types.includes('administrative_area_level_1'),
            //     //     );
            //     //     const stateName = stateComponent
            //     //       ? stateComponent.long_name
            //     //       : '';

            //     //     // Return location data immediately after GPS fetch
            //     //     const fullLocation = `${cityName}, ${areaName}`;
            //     //     if (route?.params?.onLocationSelect) {
            //     //       route.params.onLocationSelect(
            //     //         fullLocation, // current_location
            //     //         latitude, // lat
            //     //         longitude, // lng
            //     //         cityName, // city
            //     //         stateName, // state
            //     //         pincode, // pincode
            //     //         areaName, // area
            //     //       );
            //     //       // Navigate back after setting data
            //     //       setTimeout(() => {
            //     //         navigation.goBack();
            //     //       }, 500);
            //     //     }

            //     //     showToastMessage(
            //     //       'Location fetched successfully',
            //     //       'success',
            //     //     );
            //     //   } else {
            //     //     showToastMessage(
            //     //       'Unable to get location details',
            //     //       'danger',
            //     //     );
            //     //   }
            //     // } catch (geocodeError) {
            //     //   console.log('Geocode error:', geocodeError);
            //     //   showToastMessage('Error fetching address details', 'danger');
            //     // } finally {
            //     //   setIsGettingLocation(false);
            //     //   dispatch(loadingShow(false));
            //     // }
            //   },
            //   error => {
            //     console.log('Location error:', error);
            //     showToastMessage(
            //       'Unable to get your current location',
            //       'danger',
            //     );
            //     setIsGettingLocation(false);
            //     dispatch(loadingShow(false));
            //   },
            //   {
            //     enableHighAccuracy: true,
            //     timeout: 15000,
            //     maximumAge: 10000,
            //   },
            // );
          } catch (error) {
            console.log('Permission error:', error);
            showToastMessage('Error requesting location permission', 'danger');
            setIsGettingLocation(false);
            dispatch(loadingShow(false));
          }
        }, 300); // Increased delay to ensure Activity is ready
      });
    });
  };

  const handleCitySelect = cityName => {
    setCity(cityName);
    setSelectedCity(cityName);
    setShowCityModal(false);
    setCitySearchQuery('');
  };

  const handleOpenCityModal = () => {
    console.log('=== handleOpenCityModal called ===');
    console.log('Cities count:', cities.length);
    console.log('Current showCityModal state:', showCityModal);

    // Dismiss keyboard first
    Keyboard.dismiss();

    // Clear search query
    setCitySearchQuery('');

    // Initialize filteredCities if cities are available
    if (cities.length > 0) {
      console.log('Setting filteredCities to', cities.length, 'cities');
      setFilteredCities([...cities]);
    } else {
      console.log('No cities available, setting empty array');
      setFilteredCities([]);
    }

    // Use requestAnimationFrame to ensure state update happens
    requestAnimationFrame(() => {
      console.log('Setting showCityModal to true');
      setShowCityModal(true);
    });
  };

  const handleSubmit = () => {
    Keyboard.dismiss();

    // Find selected city data from API
    const selectedCityData = cities.find(cityItem => cityItem.city === city);

    // Find state name from stateId
    const stateData = states.find(
      stateItem => stateItem.stateId === selectedCityData?.stateId,
    );
    const stateName = stateData?.stateName || '';

    // Combine city and area into full location string
    const fullLocation = `${city}, ${area}`;

    if (route?.params?.onLocationSelect) {
      route.params.onLocationSelect(
        fullLocation, // current_location
        selectedLat, // lat - empty for manual selection
        selectedLng, // lng - empty for manual selection
        city, // city
        stateName, // state
        selectedPincode, // pincode - not available from manual selection
        area, // area
        selectedState, // state
        selectedPincode, // pincode
      );
    }
    navigation.goBack();
  };
  // console.log('countryName====', countryName);
  const methodGPSPermission = () => {
    if (Platform.OS === 'android') {
      Alert.alert(
        'Location Unavailable',
        'Please enable GPS or set location mode to High Accuracy in settings.',
        [
          // { text: "Open Settings", onPress: () => Linking.openSettings() },
          {text: 'OK', style: 'cancel'},
        ],
      );
    } else {
      Alert.alert(
        'Location Unavailable',
        'Please enable Location Services in iPhone Settings.',
        [{text: 'OK'}],
      );
    }
  };
  const methodPermission = async type => {
    console.log('methodPermission-=-=-=-=-=-=-=-');
    const checkEnabled = await isLocationEnabled();
    if (!checkEnabled) {
      setTimeout(() => {
        methodGPSPermission();
      }, 200);
    } else {
      getLocationFetch(1, async currentLocationGet => {
        const {latitude, longitude} = currentLocationGet;
        console.log('currentLocationGet-=-==-=--=', currentLocationGet);
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDqBEtr9Djdq0b9NTCMmquSrKiPCCv384o`,
          );
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const addressComponents = data.results[0].address_components;
            let cityName = '';
            let areaName = '';

            // Extract city
            const cityComponent = addressComponents.find(
              component =>
                component.types.includes('locality') ||
                component.types.includes('administrative_area_level_2'),
            );
            if (cityComponent) {
              cityName = cityComponent.long_name;
              setCity(cityName);
              setSelectedCity(cityName);
            }

            // Extract area/neighborhood
            const areaComponent = addressComponents.find(
              component =>
                component.types.includes('sublocality') ||
                component.types.includes('neighborhood') ||
                component.types.includes('sublocality_level_1'),
            );
            if (areaComponent) {
              areaName = areaComponent.long_name;
              setArea(areaName);
            } else {
              // Use formatted address as fallback
              const formattedAddress = data.results[0].formatted_address;
              const addressParts = formattedAddress.split(',');
              if (addressParts.length > 1) {
                setArea(addressParts[0]?.trim() || '');
              }
            }

            // Extract pincode
            const postalCodeComponent = addressComponents.find(component =>
              component.types.includes('postal_code'),
            );
            const pincode = postalCodeComponent
              ? postalCodeComponent.long_name
              : '';

            // Extract state
            const stateComponent = addressComponents.find(component =>
              component.types.includes('administrative_area_level_1'),
            );
            const stateName = stateComponent ? stateComponent.long_name : '';

            // Return location data immediately after GPS fetch
            const fullLocation = `${cityName}, ${areaName}`;
            if (route?.params?.onLocationSelect) {
              route.params.onLocationSelect(
                fullLocation, // current_location
                latitude, // lat
                longitude, // lng
                cityName, // city
                stateName, // state
                pincode, // pincode
                areaName, // area
              );
              // Navigate back after setting data
              setTimeout(() => {
                navigation.goBack();
              }, 500);
            }

            showToastMessage('Location fetched successfully', 'success');
          } else {
            showToastMessage('Unable to get location details', 'danger');
          }
        } catch (geocodeError) {
          console.log('Geocode error:', geocodeError);
          showToastMessage('Error fetching address details', 'danger');
        } finally {
          setIsGettingLocation(false);
          dispatch(loadingShow(false));
        }
      });
    }
  };
  return (
    <>
      {/* Custom Overlay Modal - Using absolute positioning instead of Modal */}
      {showCityModal && (
        <View style={styles.customModalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => {
              console.log('Overlay pressed, closing modal');
              setShowCityModal(false);
              setCitySearchQuery('');
            }}></TouchableOpacity>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Your City</Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => {
                  setShowCityModal(false);
                  setCitySearchQuery('');
                }}>
                <Icon name="close" size={24} color="#000" />
              </Pressable>
            </View>

            {/* Search Input */}
            <View style={styles.modalSearchContainer}>
              <Icon
                name="search"
                size={20}
                color="#999"
                style={styles.modalSearchIcon}
              />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search city..."
                value={citySearchQuery}
                onChangeText={setCitySearchQuery}
                autoFocus={false}
              />
            </View>

            {/* Cities List */}
            {loadingCities ? (
              <ActivityIndicator color="#FF8D53" style={{marginVertical: 20}} />
            ) : filteredCities.length > 0 ? (
              <ScrollView
                style={styles.modalCitiesList}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled">
                {filteredCities.map((cityItem, index) => {
                  const cityName = cityItem.city || cityItem;
                  const isSelected = selectedCity === cityName;
                  return (
                    <Pressable
                      key={cityItem.cityId || index}
                      style={[
                        styles.modalCityItem,
                        isSelected && styles.modalCityItemActive,
                      ]}
                      onPress={() => handleCitySelect(cityName)}>
                      <Text
                        style={[
                          styles.modalCityText,
                          isSelected && styles.modalCityTextActive,
                        ]}>
                        {cityName}
                      </Text>
                      {isSelected && (
                        <Icon name="check" size={20} color="#FF8D53" />
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : (
              <View style={styles.modalEmptyContainer}>
                <Text style={styles.modalEmptyText}>
                  {citySearchQuery
                    ? 'No cities found matching your search'
                    : 'No cities available'}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#000" />
          </Pressable>
          <Text style={styles.headerTitle}>Select Location</Text>
          <View style={styles.placeholder} />
        </View>

        <KeyboardScroll
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraScrollHeight={20}>
          <View style={styles.card}>
            <Text style={styles.title}>Choose Your Location</Text>
            <Text style={styles.subtitle}>
              Select your city and enter your area to continue
            </Text>

            {/* Use Current Location Button */}
            <Pressable
              style={[
                styles.currentLocationButton,
                isGettingLocation && styles.currentLocationButtonDisabled,
              ]}
              onPress={handleUseCurrentLocation}
              // onPress={() => methodPermission(true)}
              // disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <ActivityIndicator color="#FF8D53" />
              ) : (
                <Icon name="my-location" size={20} color="#FF8D53" />
              )}
              <Text style={styles.currentLocationText}>
                {isGettingLocation
                  ? 'Getting Location...'
                  : 'Use Your Current Location'}
              </Text>
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* City Selection */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Select Your City</Text>

              {/* City Input Field - Opens Modal */}
              <Pressable
                style={styles.cityInputField}
                onPress={() => {
                  console.log('=== CITY FIELD PRESSED ===');
                  console.log('Current showCityModal:', showCityModal);
                  Keyboard.dismiss();
                  handleOpenCityModal();
                }}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Text
                  style={[
                    styles.cityInputFieldText,
                    !city && styles.cityInputFieldPlaceholder,
                  ]}>
                  {city || 'Select your city'}
                </Text>
                <Icon name="arrow-drop-down" size={24} color="#666" />
              </Pressable>

              {city ? (
                <View style={styles.selectedCityContainer}>
                  <Text style={styles.selectedCityText}>
                    Selected City: {city}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Area Input */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Enter Your Area</Text>
              <PlacesAutocomplete
                apiKey={'AIzaSyDqBEtr9Djdq0b9NTCMmquSrKiPCCv384o'}
                value={area}
                onPlaceSelected={(address, placeId, val) => {
                  console.log('address=-=-=-=-', val);

                  setSelectedLat(val.lat);
                  setSelectedLng(val.lng);
                  setSelectedState(val.state);
                  setSelectedPincode(val.pincode);
                  setLocationSelected(true);
                  setArea(val.Locality);
                }}
                showSuggestions={
                  focusedInput === 'location' && !locationSelected
                }
                onFocus={() => {
                  setFocusedInput('location');
                  // If location is already selected, allow editing by resetting the selection
                  if (locationSelected) {
                    setLocationSelected(false);
                  }
                }}
                onBlur={() => setFocusedInput(null)}
              />
              {/* <CommonTextInputs
                placeholder="Enter your area, locality, or street"
                keyboardType={'default'}
                returnKeyType={'done'}
                paddingLeft={10}
                onChangeText={value => setArea(value)}
                value={area}
                maxLength={100}
              /> */}
            </View>

            {/* Submit Button */}
            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          </View>
        </KeyboardScroll>
      </View>

      {/* City Selection Modal - Must be outside all Views for navigation screens */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F4FD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: '#F5F4FD',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: fonts.Montserrat_Bold,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 65,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    fontFamily: fonts.Montserrat_Bold,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
    fontFamily: fonts.Montserrat_Regular,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F0',
    borderWidth: 1.5,
    borderColor: '#FF8D53',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  currentLocationButtonDisabled: {
    opacity: 0.6,
  },
  currentLocationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8D53',
    marginLeft: 10,
    fontFamily: fonts.Montserrat_SemiBold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: '#999',
    fontFamily: fonts.Montserrat_Regular,
  },
  fieldContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    fontFamily: fonts.Montserrat_SemiBold,
  },
  cityInputContainer: {
    marginBottom: 15,
  },
  popularCitiesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 10,
    fontFamily: fonts.Montserrat_Medium,
  },
  citiesWrapper: {
    height: 200,
    marginBottom: 10,
  },
  citiesContainer: {
    flex: 1,
  },
  citiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 15,
    paddingRight: 5,
  },
  cityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 8,
  },
  cityButtonActive: {
    backgroundColor: '#FF8D53',
    borderColor: '#FF8D53',
  },
  cityButtonText: {
    fontSize: 14,
    color: '#333',
    marginRight: 6,
    fontFamily: fonts.Montserrat_Regular,
  },
  cityButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: fonts.Montserrat_SemiBold,
  },
  selectedCityContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#FFF5F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF8D53',
  },
  selectedCityText: {
    fontSize: 14,
    color: '#FF8D53',
    fontWeight: '500',
    fontFamily: fonts.Montserrat_Medium,
  },
  submitButton: {
    backgroundColor: '#FF8D53',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: fonts.Montserrat_Bold,
  },
  helperText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 10,
    fontFamily: fonts.Montserrat_Regular,
  },
  cityInputField: {
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    marginHorizontal: 1,
    height: 55,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginVertical: 5,
    borderColor: '#C7CACB',
    borderWidth: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  cityInputFieldText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    paddingHorizontal: 11,
    fontFamily: fonts.Montserrat_Regular,
  },
  cityInputFieldPlaceholder: {
    color: '#BABFC7',
  },
  customModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
    width: '100%',
    minHeight: 300,
    zIndex: 10000,
    elevation: 10000,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: fonts.Montserrat_Bold,
  },
  modalCloseButton: {
    padding: 5,
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
  },
  modalSearchIcon: {
    marginRight: 10,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontFamily: fonts.Montserrat_Regular,
  },
  modalCitiesList: {
    maxHeight: 400,
    paddingHorizontal: 20,
  },
  modalCityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalCityItemActive: {
    backgroundColor: '#FFF5F0',
  },
  modalCityText: {
    fontSize: 16,
    color: '#333',
    fontFamily: fonts.Montserrat_Regular,
  },
  modalCityTextActive: {
    color: '#FF8D53',
    fontWeight: '600',
    fontFamily: fonts.Montserrat_SemiBold,
  },
  modalEmptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  modalEmptyText: {
    fontSize: 14,
    color: '#999',
    fontFamily: fonts.Montserrat_Regular,
  },
});

export default LocationPicker;
