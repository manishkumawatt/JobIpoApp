import React, {useState, useEffect, useRef} from 'react';
import {
  Platform,
  View,
  Text,
  Linking,
  Dimensions,
  Alert,
  Image,
  StyleSheet,
  ImageBackground,
  AppState,
} from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import Colors from '../../theme/colors';
import fonts from '../../theme/fonts';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout} from '../../utils/helper';
import Logo from '../../components/Auth/Logo';

const titleAlert = (title, alertMessage, cb) => {
  Alert.alert(
    title,
    alertMessage,
    [
      {
        text: 'OK',
        onPress: () => {
          if (cb) cb(true);
        },
      },
    ],
    {cancelable: false},
  );
};

const titleConfirm = (title, alertMessage, cb) => {
  Alert.alert(
    title,
    alertMessage,
    [
      {
        text: 'OK',
        onPress: () => {
          if (cb) cb(true);
        },
      },
      {
        text: 'Cancel',
        onPress: () => {
          if (cb) cb(false);
        },
        style: 'cancel',
      },
    ],
    {cancelable: false},
  );
};

const AppMaintenanceDialog = props => {
  const [isShow, setIsShow] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      getAppVersionCall();
      // dispatch(getCoustmerSettingApi());
    }, 2000);
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        getAppVersionCall();
        // dispatch(getCoustmerSettingApi());
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const getAppVersionCall = async () => {
    try {
      // https://jobipo.com/api/v3/get-app-versions

      const ResData = await fetch(
        'https://jobipo.com/api/v3/get-app-versions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
          },
          body: '',
        },
      ).then(res => res?.json());

      if (ResData?.status == 'success') {
        let appVersion = '';
        let appMaintenance = '';
        let maintenanceMassage = '';
        let checkVersion = '';
        let updateForce = '';
        let LinkingUrl = '';
        let alert_msg = '';
        if (Platform.OS == 'android') {
          appVersion = deviceInfoModule?.getVersion();
          appMaintenance = ResData?.data[0]?.maintenance;
          maintenanceMassage = ResData?.data[0]?.maintenance_message;
          alert_msg = ResData?.data[0]?.alert_msg;
          checkVersion = ResData?.data[0]?.version;
          updateForce = ResData?.data[0]?.force_update;
          LinkingUrl = ResData?.data[0]?.link;
        } else {
          // appVersion = deviceInfoModule.getVersion();
          // appMaintenance = ResData?.data[0]?.ios_maintenance;
          // maintenanceMassage = ResData?.data[0]?.maintenance_message;
          // checkVersion = ResData?.data[0]?.ios_version;
          // updateForce = ResData?.data[0]?.ios_force_update;
          // LinkingUrl = ResData?.data[0]?.ios_app_link;
        }
        if (appMaintenance && (appMaintenance == '1' || appMaintenance === 1)) {
          setIsShow(true);
        } else {
          setIsShow(false);
        }
        let sendData = {
          version: checkVersion,
          maintenance: appMaintenance,
          force_update: updateForce,
          link: LinkingUrl,
          maintenance_h2:
            "Sorry for the inconvenience. We'll be back and running as fast as possible.",
          maintenance_h1: "We're undergoing a bit of Scheduled Maintenance",
          alert_title: 'Update',
          alert_msg: alert_msg,
          logout: logout,
          // last_force_update: last_force_update,
        };
        checkUpdateValidation(sendData);
      } else {
      }
    } catch (error) {}
  };

  // /* Update Available App Version Validation Function */
  const checkUpdateValidation = async response => {
    let appVersion = deviceInfoModule.getVersion();

    if (appVersion < response?.version && response?.force_update == 1) {
      titleAlert(response?.alert_title, response?.alert_msg, async cb => {
        if (cb) {
          Linking.openURL(response?.link).catch(err =>
            console.error('An error occurred', err),
          );
        }
      });
    } else {
      if (appVersion < response?.version) {
        titleConfirm(response?.alert_title, response?.alert_msg, cb => {
          if (cb) {
            Linking.openURL(response?.link).catch(err =>
              console.error('An error occurred'),
            );
          }
        });
      }
    }
  };

  return (
    <>
      {isShow ? (
        <View style={styles.container}>
          <View style={styles.back_ground_img}>
            <View style={{}}>
              <Logo />
            </View>
            <View style={{marginHorizontal: 25}}>
              <Text style={styles.under_going_txt}>
                We're undergoing a bit of Scheduled Maintenance
              </Text>
              <View style={{marginHorizontal: 25, marginTop: 20}}>
                <Text style={styles.sorry_txt}>
                  Sorry for the inconvenience. we'll be back and running as fast
                  as possible.
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default React.memo(AppMaintenanceDialog);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#e59f7c',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  back_ground_img: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  under_going_txt: {
    fontSize: fonts.SIZE_18,
    color: Colors.primary.WHITE,
    textAlign: 'center',
    fontFamily: fonts.Urbanist_Bold,
  },
  sorry_txt: {
    fontSize: fonts.SIZE_14,
    color: Colors.primary.WHITE,
    textAlign: 'center',
    fontFamily: fonts.Urbanist_Medium,
  },
});
