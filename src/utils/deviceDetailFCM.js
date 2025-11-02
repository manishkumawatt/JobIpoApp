import {DeviceEventEmitter, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import {DEVICE_INFO} from './helper';
import {STORE_TOKEN} from '../appRedux/apis/endpoints';
import {post} from '../appRedux/apis/apiHelper';
import {JSON_HEADER} from '../appRedux/apis/commonValue';
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
      // // console.log('aa gya');
      updateNotificationToken(storedUserId, fcmToken);
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

export async function getDeviceUniqueId() {
  let device = await DeviceInfo.getUniqueId();
  return device;
}
export async function getDeviceId() {
  let deviceId = await DeviceInfo.getDeviceId();
  return deviceId;
}

export async function getDeviceType() {
  let deviceType = Platform.OS == 'ios' ? 'IOS' : 'ANDROID';
  return deviceType;
}

async function updateNotificationToken(storedUserId, fcmToken) {
  let dic = {
    user_id: storedUserId,
    device_id: DeviceInfo.getDeviceId(),
    token: fcmToken,
    platform: 'mobile',
  };
  // // console.log('dic=--==-=-1=--=-==-', dic);

  try {
    const response = await fetch('https://jobipo.com/api/v3/store-token', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      },
      body: JSON.stringify(dic),
    });

    const result = await response.json();
    // // console.log('job result===--=-==--=-=-=-=', result);

    // if (result?.status === 1 && result?.msg) {
    //   const parsed = JSON.parse(result.msg);
    //   // console.log('Parsed jobTitles:=======>>>', parsed);

    //   if (Array.isArray(parsed)) {
    //   } else {
    //     console.warn('Parsed jobTitles is not an array');
    //   }
    // }
  } catch (error) {
    // console.error('Error fetching job titles:', error);
  }

  // try {
  //   const response = await post({
  //     url: STORE_TOKEN,
  //     data: JSON.stringify(dic),
  //     header: JSON_HEADER,
  //   });
  //   // console.log('updateNotificationToken-=-==-=-==->>', response);
  // } catch (error) {
  //   // console.log('error-=-=-=-=-=-=--=-=', error);
  //   // showToastMessage("Sorry, something wrong.");
  // }
}
