import React from 'react';
import {
  Alert,
  Platform,
  NativeModules,
  PermissionsAndroid,
  Vibration,
} from 'react-native';
import {
  kUserData,
  kUserToken,
  kSorryError,
  kInternetError,
  KAUthToken,
  PASS_KEY,
  googlePlaceApiKey,
} from '../appRedux/apis/commonValue';
import {showToastMessage} from './Toast';
import DeviceInfo from 'react-native-device-info';
import {isNetworkAvailable} from '../appRedux/apis/network';
import base64 from 'react-native-base64';

import imagePath from '../theme/imagePath';
import {setI18nConfig} from '../language/index';
import {removeItemValue, setData} from '../appRedux/apis/keyChain';
// import base64 from "react-native-base64";
import Geolocation from '@react-native-community/geolocation';
import {handleSetRoot} from '../navigation/navigationService';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
} from 'react-native-permissions';
import {permissionConfirm} from './alertController';
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export const loaderRef = ref => {
  globalLoader = ref;
};
export const addReferenceToLoader = ref => {
  globalLoader = ref;
};

export const showLoader = () => {
  globalLoader?.showLoader();
};

export const hideLoader = () => {
  globalLoader?.hideLoader();
};

export const setcommanData = data => {
  commanData = data;
};
export const hasNotchDisplay = val => {
  global.hasNotch = val;
};
export const setDefaultValues = navigation => {
  global.navRef = navigation;
};
export const setUserType = type => {
  global.user_type = type;
};

const setGlobalUserToken = token => {
  global.userToken = token;
};
const setUserData = data => {
  global.userData = data;
};

export const showErrorMessage = message => {
  showToastMessage(message || kSorryError);
};

export const changeLanguage = async lan => {
  // // console.log("inside helper function ------", lan);
  // setI18nConfig(lan);
  // setData('language', lan);
  // global.language = lan;
  // DeviceEventEmitter.emit('change_lang', lan)
  // DeviceEventEmitter.emit('MyPackInfo')
};

export const getDeviceLAnguage = () => {
  const deviceLanguage =
    Platform.OS == 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;
  var strFirstTwo = deviceLanguage.substring(0, 2);
  let phoneDefaultLanguage = strFirstTwo.toLowerCase();
  //// console.log("loggg==", phoneDefaultLanguage);
  return phoneDefaultLanguage;
};
export const logout = async (isLogin = true) => {
  let isLogout = isLogin;
  if (isLogout && !global?.userToken) {
    isLogout = false;
  }
  setGlobalUserToken('');
  setUserData('');
  let removeUser = await removeItemValue(kUserData);
  let removeToken = await removeItemValue(kUserToken);
  let removeAuthToken = await removeItemValue(KAUthToken);
  // if (socketIsConnected()) {
  //   socketCustomLogoutDisconnect();
  // }
  if (isLogin) {
    handleSetRoot({name: 'LoginScreen'});
  }
};
export const socketInstance = {
  socket: null,
  isCustomDisconnect: false,
  isDuringConnection: false,
  launchApp: true,
  deviceTimeCorrect: true,
  backgroundTimerId: '',
  backgroundNewAddTrack: '',
  addNewTrack: false,
  timerLatePlay: '',
  network: false,
  isActiveApplication: true,
};
export const getDeviceUniqueId = async () => {
  let device = await DeviceInfo.getUniqueId();
  return device;
};

export let DEVICE_INFO = {
  device_type: Platform.OS == 'ios' ? 'IOS' : 'ANDROID',
  device_id: DeviceInfo.getDeviceId(),
  device_unique_id: 'simulater',
  device_token: 'simulator',
};

export const saveAuthToken = authToken => {
  global.AuthToken = authToken;
};
export const appLog = (type, data) => {
  if (__DEV__) {
    // // console.log(`${type}------------->`, data ? data : '');
  }
};
export function requestLocationPermission(alert, cb) {
  check(
    Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
  ).then(async result => {
    if (result === 'granted') {
      cb(result);
      return;
    }
    if (result === 'blocked' || result === 'unavailable') {
      if (alert === 1 || alert == 2 || alert == 4 || alert == 5) {
        if (alert == 2) {
          cb(result);
          return;
        }
        permissionConfirm(
          'Jobipo requests your permission to access your location to show you posts nearby.',
          status => {
            if (status) {
              openSettings().catch(() => {
                // console.warn('cannot open settings');
              });
            } else {
              cb(result);
            }
          },
        );
        return;
      }
    }
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
    ).then(status => {
      if (status === 'granted') {
        cb(status);
      } else {
        if (status === 'blocked' || status === 'unavailable') {
          if (alert === 1 || alert == 4 || alert == 5) {
            permissionConfirm(
              'Jobipo requests your permission to access your location to show you posts nearby.',
              status => {
                if (status) {
                  openSettings().catch(() => {
                    // console.warn('cannot open settings');
                  });
                } else {
                  cb(status);
                }
              },
            );
            return;
          } else {
            cb(status);
          }
        } else {
          cb('');
        }
      }
    });
  });
}
export async function getLocationFetch(alert, cb) {
  // const hasPermission = await requestLocationPermission(alert,cb);

  requestLocationPermission(alert, hasPermission => {
    console.log('hasPermission-----', hasPermission);
    if (hasPermission != 'granted') {
      cb('');
    } else {
      Geolocation.getCurrentPosition(
        position => {
          console.log('position-----', position);
          cb(position?.coords);
        },
        error => {
          console.log('error-----', error);
          cb('');
        },
        {
          // distanceFilter: 20,
          enableHighAccuracy: true, // Fast and accurate GPS
          // forceRequestLocation: true, // Forces location request
          // timeout: 10000, // Time to wait before failing
          // maximumAge: 5000, // Cache location for fast retrieval
        },
      );
    }
  });
}
export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const cords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position?.coords?.heading,
        };
        resolve(cords);
      },
      error => {
        reject(error.message);
      },
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
    );
  });
export let isAppInBackGround = false;

export const AppVibration = key => {
  let options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  if (Platform.OS == 'ios') {
    if (key) {
      Vibration.vibrate(90);
    } else {
      // ReactNativeHapticFeedback.trigger('impactHeavy', options);
    }
  } else {
    Vibration.vibrate(90);
  }
};
export const locationPermission = async () =>
  new Promise(async (resolve, reject) => {
    if (Platform.OS === 'ios') {
      try {
        const permissionStatus =
          await Geolocation.requestAuthorization('whenInUse');
        if (permissionStatus === 'granted') {
          return resolve('granted');
        }
        reject('Permission not granted');
      } catch (error) {
        return reject(error);
      }
    }
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
      .then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          resolve('granted');
        }
        return reject('Location Permission denied');
      })
      .catch(error => {
        return reject(error);
      });
  });

export const methodSecurityEncoded = () => {
  let data = '';
  let singleEncode = base64.encode(data);
  let encodeSingleWithPass = base64.encode(singleEncode + PASS_KEY);
  let sendEncode = base64.encode(
    singleEncode + PASS_KEY + encodeSingleWithPass,
  );
  return sendEncode;
};

export const methodSecurityDecoded = data => {
  let doubleDecodeString = base64.decode(data);
  let singleDat = doubleDecodeString.split(PASS_KEY);
  if (singleDat && singleDat?.length > 0) {
    let singleEndCodeData = singleDat[0];
    let singleDecodeString = base64.decode(singleEndCodeData);
    return singleDecodeString;
  }
};
export const emptyCallArray = async () => {
  let request = {
    user_id: global?.userData?.id,
  };
  socketEmit(socketEvent.emptyCallArr, request);
};
const getTravelTimeWithTraffic = async (source, destination) => {
  const mode = 'driving';
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${source.latitude},${source.longitude}&destinations=${destination.latitude},${destination.longitude}&departure_time=now&mode=${mode}&key=${googlePlaceApiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === 'OK') {
      const element = data.rows[0].elements[0];
      if (element.status === 'OK') {
        const durationWithTraffic = element.duration_in_traffic.text;
        // // console.log(`Duration with traffic: ${durationWithTraffic}`);
      } else {
        // console.warn('Element error:', element.status);
      }
    } else {
      // console.warn('Response error:', data.status);
    }
  } catch (error) {
    // console.error('Fetch failed:', error);
  }
};

// ===

export const haversineDistance = (coordinate1, coordinate2) => {
  const toRadians = degree => (degree * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRadians(coordinate2?.latitude - coordinate1?.latitude);
  const dLon = toRadians(coordinate2?.latitude - coordinate1?.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coordinate1?.latitude)) *
      Math.cos(toRadians(coordinate2?.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

export const getTimeInMinutes = (coordinate1, coordinate2, speed = 50) => {
  let distance = haversineDistance(coordinate1, coordinate2);
  const timeInHours = distance / speed; // Time in hours
  return timeInHours > 1 ? timeInHours.toFixed(0) * 60 : 1; // Convert to minutes
};
export const formateSeconds = seconds => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0',
  )}:${String(secs).padStart(2, '0')}`;
};

export const getGroupId = (uId, otherId) => {
  return uId < otherId ? uId + '-' + otherId : otherId + '-' + uId;
};

// for calling ----------------

export var callRing = null;
export const assignSuccessSound = receive => {
  // callRing = new Sound(
  //   receive
  //     ? imagePath.phone_ringtone_bells
  //     : imagePath.phone_ringtone_telephone,
  //   error => {
  //     callRing?.setNumberOfLoops(-1);
  //     if (error) {
  //       return;
  //     }
  //   },
  // );
};

var myInterval = '';
export const ringPlay = receive => {
  assignSuccessSound(receive);

  // callRing??.setNumberOfLoops(-1);
  myInterval = setInterval(() => {
    callRing?.play();
  }, 1000);
};

export const ringStop = () => {
  if (myInterval) {
    clearInterval(myInterval);
  }
  callRing?.stop();
  if (callRing?.isPlaying()) {
    callRing?.stop();
  }
};
export {setGlobalUserToken, setUserData, getTravelTimeWithTraffic};
