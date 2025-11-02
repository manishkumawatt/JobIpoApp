import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TopHeaderJob from '../../components/TopHeaderJob';
import SimpleHeader from '../../components/SimpleHeader';
import JobMenu from '../../components/Job/JobMenu';

const notifications = Array.from({length: 6}).map((_, i) => ({
  id: i + 1,
  title: 'Notification Heading',
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
}));

const JobNotification = ({navigation}) => {
  const renderItem = ({item}) => {
    // Guard against undefined item
    if (!item) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() => {
          if (item) {
            navigation.navigate('JobNotificationDetail', {item});
          }
        }}
        style={styles.card}>
        <Text style={styles.cardTitle}>{item?.title || 'No title'}</Text>
        <Text style={styles.cardText} numberOfLines={3}>
          {item?.description || 'No description'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <SimpleHeader title="Notifications" />
      <View style={styles.container}>
        {/* Notification List */}
        <FlatList
          contentContainerStyle={{padding: 16}}
          data={notifications}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
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
  header: {
    backgroundColor: '#FF8D53',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});

export default JobNotification;
