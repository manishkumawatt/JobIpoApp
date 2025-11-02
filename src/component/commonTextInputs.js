import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableNativeFeedback,
} from 'react-native';
import Colors from '../theme/colors';
import imagePath from '../theme/imagePath';
import {useDispatch, useSelector} from 'react-redux';
import fonts from '../theme/fonts';

const AppInput = props => {
  const [isTextInputFocused, setTextInputFocused] = useState(false);
  const findColor = useSelector(state => state.appSettingReducer);

  return (
    <View>
      <TouchableOpacity
        activeOpacity={props.activeOpacity ? props.activeOpacity : 1}
        onPress={props.allClickOn}
        style={{
          borderRadius: props.borderRadius ? props.borderRadius : 10,
          alignSelf: 'center',
          alignItems: 'center',
          marginHorizontal: props.marginHorizontal ? props.marginHorizontal : 1,
          height: props.height ? props.height : 55,
          backgroundColor: 'white',
          flexDirection: 'row',
          paddingHorizontal: props.paddingHorizontal
            ? props.paddingHorizontal
            : 18,
          marginVertical: props.marginVertical ? props.marginVertical : 5,
          marginTop: props.marginTop,
          marginBottom: props.marginBottom,
          borderColor: '#C7CACB',
          borderWidth: 1,
        }}>
        {props.leftIcon ? (
          <Image
            source={props.leftIcon}
            style={{
              height: 24,
              width: 24,
              resizeMode: 'contain',
            }}
          />
        ) : null}
        {props.leftRow ? (
          <View
            style={{
              height: 20,
              width: 1,
              backgroundColor:
                isTextInputFocused == true
                  ? findColor?.themeColor
                  : Colors.secondary.RIVER_BED,
              marginLeft: 10,
            }}
          />
        ) : (
          <View />
        )}
        {props.country_code && (
          <TouchableOpacity
            disabled={props.disabled}
            activeOpacity={0.6}
            onPress={() => props.click_code()}
            hitSlop={{top: 8, bottom: 8}}
            style={styles.view_code}>
            <Text style={styles.text_code}>{props.country_text}</Text>
            <Image
              source={imagePath.angle_down}
              resizeMode="contain"
              style={styles.img_down}
            />
            <View style={styles.view_bar} />
          </TouchableOpacity>
        )}
        {props.label ? (
          <View
            style={[styles.label_view, {backgroundColor: findColor.primary}]}>
            <Text style={[styles.label_txt, {color: findColor.secondary}]}>
              {props.label}
            </Text>
          </View>
        ) : (
          <View />
        )}
        {props.enableText ? (
          <View style={{paddingHorizontal: 11, flex: 1}}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.Montserrat_Regular,
                fontSize: fonts.SIZE_14,
                color: props.value
                  ? findColor?.secondary
                  : Colors.secondary.RIVER_BED,
              }}>
              {props.value ? props.value : props.showText}
            </Text>
          </View>
        ) : (
          <TextInput
            style={{
              height: props.inputHeight,
              fontFamily: props.fontFamily
                ? props.fontFamily
                : fonts.Montserrat_Regular,
              flex: 1,
              fontSize: props.fontSize ? props.fontSize : fonts.SIZE_16,
              color: props.colorText ? props.colorText : 'black',
              paddingHorizontal: 11,
            }}
            onFocus={() => setTextInputFocused(true)}
            value={props.value}
            placeholder={props.placeholder}
            placeholderTextColor={'#BABFC7'}
            numberOfLines={props.numberOfLines}
            secureTextEntry={props.secureTextEntry}
            onChangeText={props.onChangeText}
            blurOnSubmit={props.blurOnSubmit}
            keyboardType={props.keyboardType || 'default'}
            returnKeyType={props.returnKeyType}
            underlineColorAndroid="transparent"
            autoFocus={props.autoFocus}
            maxLength={props.maxLength}
            multiline={props.multiline}
            ref={props.getFocus}
            onSubmitEditing={props.setFocus}
            editable={props.editable}
            textAlignVertical={props.textAlignVertical}
            onBlur={() => setTextInputFocused(false)}
          />
        )}
        {props.rightIcon ? (
          <TouchableOpacity
            onPress={() => props.onPressEye()}
            hitSlop={{right: 20, left: 20, top: 10, bottom: 10}}
            style={{justifyContent: 'center', marginRight: 1}}>
            <Image
              source={props.rightIcon}
              resizeMode="contain"
              style={{
                height: props?.img_height ? props?.img_height : 24,
                width: props?.img_width ? props?.img_width : 24,

                // tintColor: "#6F7281",
              }}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </TouchableOpacity>
      {props.isErrorMsg ? (
        <Text
          style={[
            styles.error,
            {marginHorizontal: props.errorMargin ? props.errorMargin : 20},
          ]}>
          {props.isErrorMsg}
        </Text>
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_17,
    color: '#E01E61',
    marginHorizontal: 10,
    bottom: 2,
  },

  label_txt: {
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_16,
  },
  text_code: {
    fontFamily: fonts.Montserrat_SemiBold,
    fontSize: fonts.SIZE_18,
    color: Colors.primary.WHITE,
    marginLeft: 10,
  },
  label_view: {
    left: 58,
    position: 'absolute',
    top: 0,
    zindex: 5,
    top: -11,
    paddingHorizontal: 3,
  },
  // view_bar: {
  //   height: 20,
  //   width: 2,
  //   backgroundColor: Colors.primary.GRAYISH,
  // },
  view_code: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img_down: {
    height: 15,
    width: 13,
    tintColor: Colors.primary.WHITE,
    marginLeft: 10,
  },
});

export default AppInput;
