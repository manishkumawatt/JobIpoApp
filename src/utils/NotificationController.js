import {Platform, PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {STORE_TOKEN, UPDATE_DEVICE_TOKEN} from '../appRedux/apis/endpoints';
import {JSON_HEADER} from '../appRedux/apis/commonValue';
import {post} from '../appRedux/apis/apiHelper';
import {DEVICE_INFO} from './helper';
import {showToastMessage} from './Toast';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function updateDeviceToken() {
  let token = null;
  if (Platform.OS === 'android') {
    token = await getToken();
  } else {
    token = await checkPermission();
  }
  return token;
}
export async function getToken() {
  let fcmToken = null;
  // await messaging().deleteToken();
  if (Platform.OS == 'ios') {
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }
  }
  fcmToken = await messaging().getToken();
  // // console.log('fcmToken-------', fcmToken);
  const storedUserId = await AsyncStorage.getItem('UserID');
  // // console.log('storedUserId-=--==-', storedUserId);
  if (fcmToken) {
    DEVICE_INFO.device_token = fcmToken;
    if (storedUserId) {
      let dic = {
        ...DEVICE_INFO,
      };
      updateNotificationToken(dic, fcmToken);
    }
  }
  return fcmToken;
}
export async function checkPermission() {
  return await messaging()
    .hasPermission()
    .then(enabled => {
      if (enabled) {
        return getToken();
      } else {
        return requestPermission();
      }
    });
}
export async function requestPermission() {
  try {
    return messaging()
      .requestPermission()
      .then(enabled => {
        if (enabled) {
          return getToken();
        }
      });
  } catch (error) {}
}
export const requestAndroidNotificationPermission = async () => {
  return new Promise((resolve, reject) => {
    check(
      Platform.select({
        android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      }),
    )
      .then(result => {
        if (
          result === 'blocked' ||
          result === 'unavailable' ||
          result === 'denied'
        ) {
          request(
            Platform.select({
              android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
            }),
          )
            .then(res => {
              resolve(true);
            })
            .catch(e => {
              resolve(false);
            });
        } else {
          resolve(true);
        }
      })
      .catch(e => {
        resolve(false);
      });
  });
};

async function updateNotificationToken(fcmToken) {
  // // console.log('requestrequestrequest', request);
  let dic = {
    user_id: 254932,
    device_id: DeviceInfo.getDeviceId(),
    token: fcmToken,
    platform: 'mobile',
  };
  // // console.log('dic=--==-=-1=--=-==-', dic);
  try {
    const response = await post({
      url: STORE_TOKEN,
      data: JSON.stringify(request),
      header: JSON_HEADER,
    });
    // // console.log('updateNotificationToken-=-==-=-==->>', response);
  } catch (error) {
    // showToastMessage("Sorry, something wrong.");
  }
}
