/* eslint-disable prettier/prettier */
import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';

const Input = ({ style2, secureTextEntry, value, setValue, placeholder }) => {
  // // console.log(style2);
  return (
    <View>
      <TextInput
        value={value}
        onChange={text => setValue(text)}
        style={[styles.textInput, style2]}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  textInput: {
    width: '100%',
    // elevation: 4,
    // shadowColor: 'rgba(0, 0, 0, 0.1)',
    // shadowRadius: 3,
    paddingHorizontal: 13,
    paddingVertical: 13,
  },
});
