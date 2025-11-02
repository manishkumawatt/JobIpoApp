import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SimpleHeader from '../../components/SimpleHeader';
import JobMenu from '../../components/Job/JobMenu';

const JobipoSupport = ({navigation}) => {
  const handleCall = () => {
    Linking.openURL('tel:9351111859');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/919351111859?text=Hello');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@jobipo.com');
  };

  return (
    <>
      <SimpleHeader title="Jobipo Support" />
      <View style={styles.container}>
        {/* Call Now */}
        <TouchableOpacity style={styles.supportItem} onPress={handleCall}>
          <View style={styles.iconWrapper}>
            <View style={styles.iconCircle}>
              <Ionicons name="call" size={20} color="#fff" />
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.supportText}>Call Now</Text>
          </View>
        </TouchableOpacity>

        {/* WhatsApp */}
        <TouchableOpacity style={styles.supportItem} onPress={handleWhatsApp}>
          <View style={styles.iconWrapper}>
            <View style={styles.iconCircle}>
              <FontAwesome name="whatsapp" size={20} color="#fff" />
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.supportText}>Whatsapp</Text>
          </View>
        </TouchableOpacity>

        {/* Email */}
        <TouchableOpacity style={styles.supportItem} onPress={handleEmail}>
          <View style={styles.iconWrapper}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="email" size={20} color="#fff" />
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.supportText}>Email</Text>
          </View>
        </TouchableOpacity>
      </View>
      <JobMenu />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2FF',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8D53',
    marginLeft: 10,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    zIndex: 2,
  },
  iconCircle: {
    backgroundColor: '#FF8D53',
    borderRadius: 25,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  textContainer: {
    backgroundColor: '#fff',
    flex: 1,
    marginLeft: -20, // overlap effect
    paddingVertical: 12,
    paddingLeft: 32,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 8,
  },
  supportText: {
    fontSize: 16,
    color: '#333',
  },
});

export default JobipoSupport;
