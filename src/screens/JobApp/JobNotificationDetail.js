import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import SimpleHeader from '../../components/SimpleHeader';
import JobMenu from '../../components/Job/JobMenu';

const JobNotificationDetail = ({route}) => {
  const item = route?.params?.item;

  if (!item) {
    return (
      <>
        <SimpleHeader title="Notification Detail" />
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Notification not found</Text>
            <Text style={styles.description}>
              The notification details could not be loaded.
            </Text>
          </ScrollView>
        </View>
        <JobMenu />
      </>
    );
  }

  return (
    <>
      <SimpleHeader title="Notification Detail" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>{item?.title || 'No title'}</Text>
          <Text style={styles.description}>
            {item?.description || 'No description available'}
          </Text>
        </ScrollView>
      </View>
      <JobMenu />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2FF',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default JobNotificationDetail;
