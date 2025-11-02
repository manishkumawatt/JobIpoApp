import React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import Colors from "../theme/colors";
import {useDispatch, useSelector} from 'react-redux';

const PagingLoader = (props) => {
  const themeColor = useSelector(state => state.appSettingReducer.themeColor);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={themeColor} />
      <SafeAreaView />
    </View>
  );
};
export default PagingLoader;
const styles = StyleSheet.create({
  container: {
    height: 30,
    width: "100%",
    backgroundColor:"#00000001",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    paddingTop:20
  },
});
