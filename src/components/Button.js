/* eslint-disable prettier/prettier */
/* eslint-disable semi */
import { StyleSheet, Text, Pressable } from 'react-native';
import React from 'react';

const Button = ({ text, bgColor, style2 , onPress }) => {
  return (
    <Pressable
     onPress={onPress}
     style={[styles.button, { backgroundColor: bgColor }, style2]}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: 44,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
});
