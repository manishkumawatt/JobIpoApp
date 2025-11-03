/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
// import 'react-native-gesture-handler';
import React, {useContext, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Pressable,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Login from './src/screens/Auth/Login.js';
import Register from './src/screens/Auth/Register.js';
import LocationPicker from './src/screens/Auth/LocationPicker.js';
import Home from './src/screens/Home.js';
import Kyc from './src/screens/Kyc.js';
import Visiting from './src/screens/Visiting.js';
import ID from './src/screens/ID.js';
import Products from './src/screens/Products.js';
import Product from './src/screens/Product.js';
import Accounts from './src/screens/Accounts.js';
import Trainings from './src/screens/Trainings.js';
import TermsConditions from './src/screens/TermsConditions.js';
import Notifications from './src/screens/Notifications.js';
import Notification from './src/screens/Notification.js';
import Myteam from './src/screens/Myteam.js';
import Leads from './src/screens/Leads.js';
import Myearning from './src/screens/Myearning.js';
import Profile from './src/screens/Profile.js';
import Changepassword from './src/screens/Changepassword.js';
import Paymentsetting from './src/screens/Paymentsetting.js';
import Contactus from './src/screens/Contactus.js';
import Privacy from './src/screens/Privacy.js';
import About from './src/screens/About.js';
import JobPage from './src/screens/JobApp/JobPage.js';
import OneSignal from 'react-native-onesignal';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AuthContext} from './src/context/context.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Menupage from './src/screens/Menupage.js';
import JobDes from './src/screens/JobApp/JobDes.js';
import FavJob from './src/screens/JobApp/FavJob.js';
import Learning from './src/screens/JobApp/Learning.js';
import AppliedJob from './src/screens/JobApp/AppliedJob.js';
import InterviewInvite from './src/screens/JobApp/InterviewInvite.js';
import JobProfile from './src/screens/JobApp/JobProfile.js';
import ExperienceCard from './src/screens/JobApp/JobProfile/AddExperience.js';
import AddEducation from './src/screens/JobApp/JobProfile/AddEducation.js';
import AddExperience from './src/screens/JobApp/JobProfile/AddExperience.js';
import AddLanguage from './src/screens/JobApp/JobProfile/AddLanguage.js';
import AddLocation from './src/screens/JobApp/JobProfile/AddLocation.js';
import AddJobPref from './src/screens/JobApp/JobProfile/AddJobPref.js';
import AddPersonalDetails from './src/screens/JobApp/JobProfile/AddPersonalDetails.js';
import TotalExp from './src/screens/JobApp/JobProfile/TotalExp.js';
import CurrentSal from './src/screens/JobApp/JobProfile/CurrentSal.js';
import NoticePeriod from './src/screens/JobApp/JobProfile/NoticePeriod.js';
import EditSkill from './src/screens/JobApp/JobProfile/EditSkill .js';
import EditExperience from './src/screens/JobApp/JobProfile/EditExperience.js';
import EditEducation from './src/screens/JobApp/JobProfile/EditEducation.js';
import CertificateUpload from './src/screens/JobApp/JobProfile/CertificateUpload.js';
import ResumeUpload from './src/screens/JobApp/JobProfile/ResumeUpload.js';
import Wallet from './src/screens/Wallet.js';
import Withdrawal from './src/screens/Withdrawal.js';
import AddBalance from './src/screens/AddBalance.js';
import EditProfile from './src/screens/LeadOnline.js';
import LeadOnline from './src/screens/LeadOnline.js';
import LeadOffline from './src/screens/LeadOffline.js';
import FullReport from './src/screens/FullReport.js';
import TDSDetails from './src/screens/TDSDetails .js';
import {useNavigation} from '@react-navigation/native';
import Logout from './src/components/Logout.js';
import RechargeNo from './src/screens/Home/RechargeNo.js';
import RechargeDetails from './src/screens/Home/RechargeDetails.js';
import PlanDetails from './src/screens/Home/PlanDetails .js';
import DTHBillerList from './src/screens/Home/DTHBillerList.js';
import AirtelDigitalTV from './src/screens/Home/AirtelDigitalTV.js';
import AirtelPayment from './src/screens/Home/AirtelPayment .js';
import ElectricityBillerList from './src/screens/Home/ElectricityBillerList.js';
import ElectricIVRS from './src/screens/Home/ElectricIVRS.js';
import ElectricPayment from './src/screens/Home/ElectricPayment.js';
import MoreRecharge from './src/screens/MoreRecharge.js';
import GooglePlacesInput from './src/components/GooglePlacesInput.js';
import RegistrationP from './src/screens/Auth/RegistrationP.js';
import RegistrationS from './src/screens/Auth/RegistrationS.js';
import RegisterScreen from './src/screens/Auth/RegisterScreen.js';
import OtpVerifyScreen from './src/screens/Auth/OtpVerifyScreen.js';
import Iconn from 'react-native-vector-icons/MaterialIcons';
import Logo from './src/components/Auth/Logo.js';
import OtpScreen from './src/screens/Auth/OtpScreen.js';
import EditJobDetails from './src/screens/JobApp/JobProfile/EditJobDetails.js';
import FavJobs from './src/screens/JobApp/FavJob.js';
import PdfComponent from './src/screens/JobApp/PdfComponent.js';
import JobipoSupport from './src/screens/JobApp/JobipoSupport.js';
import JobNotification from './src/screens/JobApp/JobNotification.js';
import JobNotificationDetail from './src/screens/JobApp/JobNotificationDetail.js';
import TopHeaderJob from './src/components/TopHeaderJob.js';
import FavJobSingle from './src/screens/JobApp/FavJobSingle.js';
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = {fontFamily: 'Poppins-Regular'};
import {Linking} from 'react-native';
import JobDetails from './src/screens/JobApp/JobDetails.js';
import {Provider} from 'react-native-paper';
import {Provider as ReduxProvider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import LoaderView from './src/utils/loaderView.js';
import AppMaintenance from './src/component/AppMaintenance/index';
import configureStore from './src/appRedux/store';
import SplashScreen from 'react-native-splash-screen';
import ViewImages from './src/component/viewImages/index.js';
import ErrorBoundary from './src/components/ErrorBoundary';
import memoryMonitor from './src/utils/memoryMonitor';
import PointsWallet from './src/screens/JobApp/PointsWallet.js';
import FromShare from './src/screens/JobApp/FromShare.js';
import {requestAndroidNotificationPermission} from './src/utils/NotificationController.js';
import {updateDeviceToken} from './src/utils/deviceDetailFCM.js';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const store = configureStore();

export default function App() {
  const linking = {
    prefixes: ['https://jobipo.com', 'jobipoapp://'],
    config: {
      screens: {
        JobDetails: {
          path: 'job/:jobId',
        },
      },
    },
  };

  const initialLoginState = {
    isLoading: true,
    id: null,
    userToken: null,
  };

  const loginReducer = (state, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...state,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...state,
          id: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...state,
          id: null,
          userToken: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );

  const authContext = useMemo(
    () => ({
      signIn: async (token, email) => {
        let userToken = String(token);
        let userEmail = String(email);
        try {
          await AsyncStorage.setItem('userToken', userToken);
          await AsyncStorage.setItem('email', userEmail);
        } catch (e) {}

        dispatch({type: 'LOGIN', id: userEmail, token: userToken});
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('email');
        } catch (e) {}
        dispatch({type: 'LOGOUT'});
      },
    }),
    [],
  );

  useEffect(() => {
    // Start memory monitoring
    memoryMonitor.startMonitoring();

    setTimeout(async () => {
      let userToken;
      userToken = null;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {}
      dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
    }, 1000);
    generateToken();
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);

    // Cleanup on unmount
    return () => {
      memoryMonitor.stopMonitoring();
    };
  }, []);

  if (loginState.isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const HomeDrawer = ({loginState}) => {
    const screen = [
      {
        id: 7,
        name: 'Accounts',
        component: Accounts,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 8,
        name: 'TermsConditions',
        component: TermsConditions,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 11,
        name: 'Notifications',
        component: Notifications,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 12,
        name: 'Notification',
        component: Notification,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },

      {
        id: 16,
        name: 'PlanDetails',
        component: PlanDetails,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 17,
        name: 'RechargeNo',
        component: RechargeNo,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 18,
        name: 'RechargeDetails',
        component: RechargeDetails,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 19,
        name: 'Menupage',
        component: Menupage,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },

      {
        id: 22,
        name: 'DTHBillerList',
        component: DTHBillerList,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },

      // {
      //   id: 22,
      //   name: 'JobPage',
      //   component: JobPage,
      //   option: ({route}) => ({
      //     headerShown: false,
      //     animation: 'none',
      //   }),
      // },
      {
        id: 23,
        name: 'JobDes',
        component: JobDes,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 24,
        name: 'JobDetails',
        component: JobDetails,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 25,
        name: 'FavJob',
        component: FavJob,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 26,
        name: 'Learning',
        component: Learning,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 27,
        name: 'AppliedJob',
        component: AppliedJob,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 28,
        name: 'InterviewInvite',
        component: InterviewInvite,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },

      {
        id: 29,
        name: 'FavJobs',
        component: FavJobs,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 30,
        name: 'AddExperience',
        component: AddExperience,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 31,
        name: 'AddEducation',
        component: AddEducation,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 32,
        name: 'AddLanguage',
        component: AddLanguage,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 33,
        name: 'AddLocation',
        component: AddLocation,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },

      {
        id: 34,
        name: 'AddJobPref',
        component: AddJobPref,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },

      {
        id: 35,
        name: 'AddPersonalDetails',
        component: AddPersonalDetails,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 36,
        name: 'TotalExp',
        component: TotalExp,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 37,
        name: 'CurrentSal',
        component: CurrentSal,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 38,
        name: 'NoticePeriod',
        component: NoticePeriod,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 39,
        name: 'EditSkill',
        component: EditSkill,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 40,
        name: 'EditExperience',
        component: EditExperience,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },

      {
        id: 41,
        name: 'EditEducation',
        component: EditEducation,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },

      {
        id: 42,
        name: 'CertificateUpload',
        component: CertificateUpload,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 43,
        name: 'ResumeUpload',
        component: ResumeUpload,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },

      {
        id: 44,
        name: 'PdfComponent',
        component: PdfComponent,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 45,
        name: 'Withdrawal',
        component: Withdrawal,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 46,
        name: 'AddBalance',
        component: AddBalance,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 47,
        name: 'LeadOnline',
        component: LeadOnline,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 48,
        name: 'LeadOffline',
        component: LeadOffline,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 49,
        name: 'AirtelDigitalTV',
        component: AirtelDigitalTV,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 50,
        name: 'AirtelPayment',
        component: AirtelPayment,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 51,
        name: 'ElectricityBillerList',
        component: ElectricityBillerList,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 52,
        name: 'ElectricIVRS',
        component: ElectricIVRS,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 53,
        name: 'ElectricPayment',
        component: ElectricPayment,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 54,
        name: 'MoreRecharge',
        component: MoreRecharge,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 55,
        name: 'EditJobDetails',
        component: EditJobDetails,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 56,
        name: 'JobipoSupport',
        component: JobipoSupport,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 57,
        name: 'JobNotification',
        component: JobNotification,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 58,
        name: 'JobNotificationDetail',
        component: JobNotificationDetail,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 59,
        name: 'FavJobSingle',
        component: FavJobSingle,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 60,
        name: 'ViewImages',
        component: ViewImages,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 61,
        name: 'PointsWallet',
        component: PointsWallet,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
      {
        id: 62,
        name: 'FromShare',
        component: FromShare,
        option: ({route}) => ({
          headerShown: false,
          animation: 'none',
        }),
      },
    ];

    return (
      <>
        <SafeAreaProvider>
          <Drawer.Navigator
            initialRouteName={
              loginState?.userToken == null ? 'Login' : 'JobPage'
            }
            backBehavior="history">
            {loginState?.userToken == null ? (
              <Drawer.Group>
                <Drawer.Screen
                  name="Login"
                  component={Login}
                  options={{
                    headerShown: false,
                    drawerStyle: {display: 'none'},
                  }}
                />
                <Drawer.Screen
                  name="Register"
                  component={Register}
                  options={{
                    headerShown: false,
                    drawerStyle: {display: 'none'},
                  }}
                />
                <Drawer.Screen
                  name="RegistrationP"
                  component={RegistrationP}
                  options={{
                    headerShown: false,
                    drawerStyle: {display: 'none'},
                  }}
                />
                <Drawer.Screen
                  name="RegistrationS"
                  component={RegistrationS}
                  options={{
                    headerShown: false,
                    drawerStyle: {display: 'none'},
                  }}
                />
                <Drawer.Screen
                  name="RegisterScreen"
                  component={RegisterScreen}
                  options={{
                    headerShown: false,
                    drawerStyle: {display: 'none'},
                  }}
                />
                <Drawer.Screen
                  name="OtpVerifyScreen"
                  component={OtpVerifyScreen}
                  options={{
                    headerShown: false,
                    drawerStyle: {display: 'none'},
                  }}
                />

                <Drawer.Screen
                  name="OtpScreen"
                  component={OtpScreen}
                  options={{
                    headerShown: false,
                    drawerStyle: {display: 'none'},
                  }}
                />
                <Drawer.Screen
                  name="LocationPicker"
                  component={LocationPicker}
                  options={{
                    headerShown: false,
                    drawerStyle: {display: 'none'},
                  }}
                />
              </Drawer.Group>
            ) : (
              <>
                <Drawer.Group>
                  <Drawer.Screen
                    name="JobPage"
                    component={JobPage}
                    options={{
                      headerShown: false,
                      drawerItemStyle: {display: 'none'},
                    }}
                  />
                  <Drawer.Screen
                    name="Home"
                    component={Home}
                    options={{
                      headerShown: false,
                      drawerIcon: ({color, size}) => (
                        <Icon name="home" size={size} color={color} />
                      ),
                    }}
                  />
                  <Drawer.Screen
                    name="JobProfile"
                    component={JobProfile}
                    options={{
                      title: 'Job Profile',
                      headerShown: false,
                      drawerIcon: ({color, size}) => (
                        <Icon name="person" size={size} color={color} />
                      ),
                    }}
                  />
                  <Drawer.Screen
                    name="Myearning"
                    component={Myearning}
                    options={{
                      title: 'My earning',
                      drawerIcon: ({color, size}) => (
                        <Icon name="attach-money" size={size} color={color} />
                      ),
                    }}
                  />
                  <Drawer.Screen
                    name="Myteam"
                    component={Myteam}
                    options={{
                      title: 'My Team',
                      drawerIcon: ({color, size}) => (
                        <Icon name="group" size={size} color={color} />
                      ),
                    }}
                  />
                  <Drawer.Screen
                    name="Wallet"
                    component={Wallet}
                    options={{
                      drawerItemStyle: {display: 'none'},
                    }}
                  />
                  <Drawer.Screen
                    name="FullReport"
                    component={FullReport}
                    options={{
                      title: 'Full Report',
                      drawerItemStyle: {display: 'none'},
                    }}
                  />
                  <Drawer.Screen
                    name="Leads"
                    component={Leads}
                    options={{
                      headerShown: false,
                      title: 'Leads',
                      drawerIcon: ({color, size}) => (
                        <Icon name="phone" size={size} color={color} />
                      ),
                    }}
                  />
                  <Drawer.Screen
                    name="Kyc"
                    component={Kyc}
                    options={{
                      headerShown: false,
                      drawerItemStyle: {display: 'none'},
                    }}
                  />
                  <Drawer.Screen
                    name="TDSDetails"
                    component={TDSDetails}
                    options={{
                      title: 'TDS Details',
                      drawerItemStyle: {display: 'none'},
                    }}
                  />
                  <Drawer.Screen
                    name="Paymentsetting"
                    component={Paymentsetting}
                    options={{
                      title: 'Payment Settings',
                      headerShown: false,
                      drawerIcon: ({color, size}) => (
                        <Icon name="payment" size={size} color={color} />
                      ),
                    }}
                  />
                  <Drawer.Screen
                    name="Trainings"
                    component={Trainings}
                    options={{
                      title: 'Trainings',
                      headerShown: false,
                      drawerIcon: ({color, size}) => (
                        <Icon name="assignment" size={size} color={color} />
                      ),
                    }}
                  />
                  <Drawer.Screen
                    name="Products"
                    component={Products}
                    options={{
                      drawerItemStyle: {display: 'none'},
                    }}
                  />

                  <Drawer.Screen
                    name="Product"
                    component={Product}
                    options={{
                      headerShown: false,
                      drawerItemStyle: {display: 'none'},
                    }}
                  />

                  <Drawer.Screen
                    name="Contactus"
                    component={Contactus}
                    options={{
                      title: 'Contact Us',
                      headerShown: false,
                      drawerIcon: ({color, size}) => (
                        <Icon name="support-agent" size={size} color={color} />
                      ),
                    }}
                  />

                  <Drawer.Screen
                    name="Logout"
                    component={Logout}
                    options={{
                      title: 'Logout',
                      headerShown: false,
                      drawerIcon: ({color, size}) => (
                        <Icon name="logout" size={size} color={color} />
                      ),
                    }}
                  />
                </Drawer.Group>

                <Drawer.Group
                  screenOptions={{
                    headerShown: false,
                    drawerItemStyle: {display: 'none'},
                  }}>
                  {screen.map(item => (
                    <Drawer.Screen
                      key={item.id}
                      name={item.name}
                      component={item.component}
                      options={item.option}
                    />
                  ))}
                </Drawer.Group>
              </>
            )}
          </Drawer.Navigator>
        </SafeAreaProvider>
      </>
    );
  };

  // OneSignal Initialization
  OneSignal?.setAppId('9c0eaabc-3cad-4696-bd2e-372725daf032');

  // promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
  OneSignal?.promptForPushNotificationsWithUserResponse();

  //Method for handling notifications received while app in foreground
  OneSignal?.setNotificationWillShowInForegroundHandler(
    notificationReceivedEvent => {
      let notification = notificationReceivedEvent.getNotification();
      const data = notification.additionalData;
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    },
  );

  //Method for handling notifications opened
  OneSignal?.setNotificationOpenedHandler(notification => {});
  async function generateToken() {
    if (Platform.OS == 'android') {
      let status = await requestAndroidNotificationPermission();
    }
    let token = await updateDeviceToken();
    // console.log('token-=-=-==-', token);
    // DEVICE_INFO.device_token = token;
  }
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <AuthContext.Provider value={authContext}>
          <StatusBar
            translucent
            backgroundColor={'transparent'}
            barStyle={'dark-content'}
          />

          <SafeAreaView
            style={{flex: 1}}
            edges={['top', 'left', 'right', 'bottom']}>
            <NavigationContainer linking={linking}>
              <HomeDrawer loginState={loginState} />
            </NavigationContainer>
          </SafeAreaView>
        </AuthContext.Provider>
        <FlashMessage
          duration={3000}
          position="top"
          style={{
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          }}
        />
        <LoaderView />
        <AppMaintenance />
      </ReduxProvider>
    </ErrorBoundary>
  );
}
