import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BackArrowIcon} from '../screens/JobSvgIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SimpleHeader = ({title = 'Default Title', titleColor = '#FF8D53'}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FF8D53" /> */}

      {/* Top orange safe area */}
      <View style={{backgroundColor: '#FF8D53', height: insets.top}} />

      {/* Bottom white header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <BackArrowIcon size={30} />
        </TouchableOpacity>

        <Text style={[styles.title, {color: titleColor}]} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.backButton} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff', // white background for lower section
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default SimpleHeader;
