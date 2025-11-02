import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {
  check,
  request,
  PERMISSIONS,
  openSettings,
} from 'react-native-permissions';
import GetLocation from 'react-native-get-location';

import {Platform} from 'react-native';
import {permissionConfirm, alert} from '../utils/alertController';

import {getDistance} from 'geolib';
import {googlePlaceApiKey} from '../appRedux/apis/commonValue';
import {appLog, methodSecurityDecoded, showErrorMessage} from '../utils/helper';
import {showToastMessage} from '../utils/Toast';

export function checkLocationPermission(cb) {
  check(
    Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
  ).then(result => {
    if (result === 'granted') {
      cb(true);
    } else if (result === 'blocked' || result === 'unavailable') {
      cb(false);
    }
  });
}

export async function geoCurrentLocation(alert = 1, cb) {
  if (Platform.OS == 'android') {
    await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then(data => {
        accessLocation(alert, cb);
      })
      .catch(err => {
        cb({latitude: '', longitude: ''});
      });
  } else {
    accessLocation(alert, cb);
  }
}

export function accessLocation(alert, cb) {
  check(
    Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
  ).then(result => {
    if (result === 'granted') {
      slectLatLong(cb);
      return;
    }
    if (result === 'blocked' || result === 'unavailable') {
      if (alert == 1) {
        permissionConfirm(
          'Dais requests your permission to access your location to show the nearby data.',
          status => {
            if (status) {
              openSettings().catch(() => {});
            } else {
              cb({latitude: '', longitude: ''});
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
        slectLatLong(cb);
      } else {
        cb({latitude: '', longitude: ''});
      }
    });
  });
}

export function GetAddressFromLatLong(latitude, longitude, cb) {
  fetch(
    'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      latitude +
      ',' +
      longitude +
      '&key=' +
      googlePlaceApiKey,
  )
    .then(response => response.json())
    .then(responseJson => {
      // // console.log('responseJson-d----', responseJson);
      if (responseJson && responseJson?.results?.length > 0) {
        let addressComponent = responseJson?.results[0]?.formatted_address;
        cb(addressComponent);
      } else {
        cb(false);
      }
    })
    .catch(err => {
      cb(false);
    });
}

export function GetDisatnceBetweenTwoLocation(fromPos, toPos) {
  return getDistance(fromPos, toPos);
}

export function slectLatLong(cb) {
  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 60000,
  })
    .then(location => {
      if (location.latitude) {
        let form = {
          latitude: location.latitude,
          longitude: location.longitude,
          location: true,
        };
        cb(form);
      }
    })
    .catch(error => {});
}

export function errorCurrentLocation(error) {
  alert('Sorry, something is wrong \nPlease check your Device GPS');
}
let prevLat = null;
let prevLng = null;

function calculateHeading(lat1, lon1, lat2, lon2) {
  const toRad = deg => (deg * Math.PI) / 180;
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.cos(toRad(lon2 - lon1));
  const bearing = Math.atan2(y, x);
  return ((bearing * 180) / Math.PI + 360) % 360; // normalize to 0–360
}
export const methodCurrentLocation = async (alert = 1) => {
  // // console.log("methodCurrentLocation======================", type);

  return new Promise(async (resolve, reject) => {
    let statusPermission = await methodLocationCheckAppPermission(alert);
    // // console.log('statusPermission-==-=-=--=>>', statusPermission);
    if (statusPermission == true) {
      try {
        const loc = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          // timeout: 30000,
          timeout: 1200000,
        });
        // // console.log('loc-==-=-=--==->>', loc);
        let heading = loc?.bearing || loc?.heading;

        // If no heading provided, calculate from previous location
        if (
          (heading === undefined || heading === null) &&
          prevLat !== null &&
          prevLng !== null
        ) {
          heading = calculateHeading(
            prevLat,
            prevLng,
            loc.latitude,
            loc.longitude,
          );
        }

        // Save current as previous for next calculation
        prevLat = loc.latitude;
        prevLng = loc.longitude;

        let form = {
          latitude: loc.latitude,
          longitude: loc.longitude,
          heading: heading || 0,
          loc: true,
        };
        // // console.log('form--==--=-=-=', form);
        resolve(form);
      } catch (err) {
        // // console.log('err-==-=--==--=', err);
        resolve({location: false, status: 'unavailable'});
      } finally {
        resolve({location: false, status: statusPermission});
      }
    } else {
      resolve({location: false, status: statusPermission});
    }
  });
};
export const methodAndroidDevicePermission = async () => {
  return new Promise(async (resolve, reject) => {
    if (Platform.OS == 'ios') {
      resolve(true);
    }
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then(data => {
        resolve(true);
      })
      .catch(err => {
        resolve(false);
      });
  });
};
export const methodLocationCheckAppPermission = async alert => {
  return new Promise(async (resolve, reject) => {
    let checkPermissionStatus = await check(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
    );

    if (checkPermissionStatus === 'granted') {
      resolve(true);
    } else if (
      checkPermissionStatus === 'blocked' ||
      checkPermissionStatus === 'unavailable'
    ) {
      if (alert == 1) {
        permissionConfirm(
          'Dais requests your permission to access your location to show the nearby drivers.',
          status => {
            if (status) {
              openSettings().catch(() => {
                // console.warn('cannot open settings');
              });
            } else {
              resolve(checkPermissionStatus);
            }
          },
        );
        return;
      }
    } else {
      let requestPermissionStatus = await request(
        Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        }),
      );
      if (requestPermissionStatus === 'granted') {
        resolve(true);
      } else {
        // {
        // showToastMessage(
        //   "Please enable location access to view nearby users and posts from users around.",
        //   "info"
        // );
        // }
        resolve(requestPermissionStatus);
      }
    }
  });
};
