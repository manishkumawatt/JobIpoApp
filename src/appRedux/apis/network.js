import NetInfo from '@react-native-community/netinfo';

export const isNetworkAvailable = async () => {
  try {
    const state = await NetInfo.fetch();

    // handle cases where isInternetReachable is null
    const isConnected =
      state.isConnected && (state.isInternetReachable ?? false);

    return isConnected;
  } catch (error) {
    // // console.log('Error checking internet:', error);
    return false;
  }
};
