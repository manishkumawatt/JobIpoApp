import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React from "react";
import Colors from "../theme/colors";
import imagePath from "../theme/imagePath";
import fonts from "../theme/fonts";
import AppButton from "./commonButton";
import { translate } from "../language";
import { changeLanguage } from "../utils/helper";
const PermissionModel = ({
  visible,
  props,
  headingText,
  aboutText,
  buttonTitla,
  centerImage,
  heightImage,
  widthImage,
  setting,
  allowPermissionProps = () => null,
  denyPermissionProps = () => null,
}) => {
  const onChangeLanguage = (lan) => {
    changeLanguage(lan);
    setLanguage(lan);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        // props.onCancel(false);
      }}
    >
      <View style={styles.modal_container}>
        <View style={styles.modal_view}>
          <Image
            resizeMode="contain"
            source={
              centerImage ? centerImage : imagePath.mapImage
            }
            style={[
              styles.imageCenter,
              {
                height: heightImage ? heightImage : 104,
                width: widthImage ? widthImage : 104,
                marginTop:  55,
              },
            ]}
          />
          <Text style={styles.headingText}>
            {translate(
              headingText ? headingText : "Allow_Location"
            )}
          </Text>

          <Text style={styles.aboutText}>
            {translate(
              aboutText ? aboutText : "need_your_permission"
            )}
          </Text>

          <AppButton
            marginTop={29}
            marginBottom={setting?40:22}
            paddingHorizontal={24}
            onPress={() => {
              allowPermissionProps();
            }}
            title={buttonTitla ? buttonTitla : "Allow"}
          />
          {!setting?
          <TouchableOpacity
            onPress={() => {
              denyPermissionProps();
            }}
            activeOpacity={0.8}
            style={styles.denyTouch}
          >
            <Text style={styles.denyText}>Deny</Text>
          </TouchableOpacity>:<View/>}
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modal_container: {
    flex: 1,
    backgroundColor: "#04060cd6",
    justifyContent: "flex-end",
  },

  modal_view: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: Colors.secondary.THEME_BLACK,
  },
  imageCenter: {
    alignSelf: "center",
  },
  headingText: {
    textAlign: "center",
    fontFamily: fonts.Montserrat_SemiBold,
    fontSize: fonts.SIZE_18,
    color: Colors.primary.WHITE,
    marginTop: 37,
  },
  aboutText: {
    textAlign: "center",
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_14,
    color: Colors.secondary.SCAMPI,
    paddingHorizontal: 64,
    marginTop: 9,
    lineHeight: 20,
  },
  denyTouch: {
    alignSelf: "center",
    
    marginBottom: 45,
  },
  denyText: {
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_14,
    color: Colors.primary.WHITE,
  },
});

export default PermissionModel;
