import React, {useState} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
// import FastImage from 'react-native-fast-image';
import FastImage from '@d11/react-native-fast-image';

const ImageLoadView = props => {
  const [loading, setLoading] = useState(true);

  return (
    <View>
      <FastImage
        {...props}
        onLoadStart={e => {
          setLoading(true);
        }}
        onLoadEnd={e => {
          setLoading(false);
        }}
        resizeMode={props.resizeMode}
      />
      {loading ? (
        <ActivityIndicator
          style={{position: 'absolute', bottom: 0, left: 0, right: 0, top: 0}}
          size={props.loaderSize || 'small'}
          color={props.loaderColor || '#919191'}
        />
      ) : null}
    </View>
  );
};

export default ImageLoadView;

const styles = StyleSheet.create({});
