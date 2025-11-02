import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import fonts from '../theme/fonts';
import imagePath from '../theme/imagePath';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../global/styles';
import {responsiveWidth, WINDOW_WIDTH} from '../theme/mixins';

const EmptyComponent = props => {
  const themeColor = useSelector(state => state.appSettingReducer.themeColor);
  const {title, description, image} = props;
  return (
    <View style={styles.container}>
      {image && <Image source={image} style={styles.image} />}
      <Text style={styles.title}>{title || 'Data not found'}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};
export default EmptyComponent;
const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  image: {alignSelf: 'center'},
  title: {
    fontFamily: fonts.Montserrat_SemiBold,
    color: colors.white,
    fontSize: fonts.SIZE_20,
    textAlign: 'center',
    marginTop: 46,
  },
  description: {
    fontFamily: fonts.Montserrat_Medium,
    color: colors.lightText,
    fontSize: fonts.SIZE_17,
    textAlign: 'center',
    width: responsiveWidth(WINDOW_WIDTH / 1.6),
    marginTop: 10,
  },
});
