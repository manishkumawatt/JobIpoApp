import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import font from '../theme/fonts';
import fonts from '../theme/fonts';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../theme/colors';

const AppButton = props => {
  const appGradient = useSelector(state => state.appSettingReducer.appGradient);
  const primary = useSelector(state => state.appSettingReducer.primary);

  return (
    <TouchableOpacity
      disabled={props?.disabled || props?.isLoading}
      activeOpacity={0.8}
      onPress={() => props.onPress()}
      style={{
        height: props.height ? props.height : 55,
        borderRadius: props.borderRadius ? props.borderRadius : 25,
        marginHorizontal: props.marginHorizontal ? props.marginHorizontal : 24,
        marginVertical: props.marginVertical ? props.marginVertical : 0,
        justifyContent: 'center',
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        borderWidth: props.borderWidth ? props.borderWidth : null,
        borderColor: props.borderColor,
        width: props.width,
        backgroundColor: props.backgroundColor
          ? props.backgroundColor
          : '#FF8D53',
      }}>
      <TouchableOpacity
        onPress={() => props.onPress()}
        style={{
          flex: 1,
          borderRadius: 16,
          justifyContent: 'center',
        }}>
        <Text
          style={[
            props.textStyle
              ? props.textStyle
              : {
                  fontSize: fonts.SIZE_16,
                  fontFamily: fonts.Montserrat_Medium,
                  textAlign: 'center',
                  color: props.color ? props.color : 'white',
                },
          ]}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
export default AppButton;
