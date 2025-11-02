import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import JobHeader from '../../components/Job/JobHeader';
import JobMenu from '../../components/Job/JobMenu';

const interviewInvitesData = [
  {
    id: '1',
    jobTitle: 'Junior Java Developer',
    company: 'Tata Consultancy Services (TCS)',
    date: '2024-12-20',
    time: '10:00 AM',
    location: 'TCS Office, Bangalore, Karnataka',
    status: 'Upcoming', 
    rsvp: false, 
  },
  {
    id: '2',
    jobTitle: 'Data Analyst Trainee',
    company: 'Data Inc.',
    date: '2024-12-18',
    time: '02:00 PM',
    location: 'Data Inc., Bhopal, Madhya Pradesh',
    status: 'Completed',
    rsvp: true,
  },
  {
    id: '3',
    jobTitle: 'UI/UX Designer',
    company: 'Design Studio',
    date: '2024-12-22',
    time: '11:00 AM',
    location: 'Online (Zoom)',
    status: 'Upcoming',
    rsvp: false,
  },
];

const InterviewInvite = () => {
  const [interviewInvites, setInterviewInvites] = useState(interviewInvitesData);

  const handleRSVP = (id) => {
    const updatedInvites = interviewInvites.map((invite) =>
      invite.id === id ? { ...invite, rsvp: !invite.rsvp } : invite
    );
    setInterviewInvites(updatedInvites);

    const currentInvite = interviewInvites.find((invite) => invite.id === id);
    const message = currentInvite.rsvp
      ? 'RSVP has been withdrawn.'
      : 'RSVP confirmed. Best of luck!';
    Alert.alert('RSVP Updated', message);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return '#4CAF50'; 
      case 'Completed':
        return '#888';
      case 'Cancelled':
        return '#F44336'; 
      default:
        return '#888'; 
    }
  };

  const renderInterviewItem = ({ item }) => (

    <View style={styles.inviteBox}>
      <View style={styles.inviteHeader}>
        <Text style={styles.jobTitle}>{item.jobTitle}</Text>
      </View>
      <Text style={styles.company}>{item.company}</Text>
      <Text style={styles.details}>{item.date} at {item.time}</Text>
      <Text style={styles.details}>{item.location}</Text>

      <View style={styles.statusContainer}>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
        {/* <TouchableOpacity
          style={[styles.rsvpButton, item.rsvp && styles.rsvpButtonActive]}
          onPress={() => handleRSVP(item.id)}
        >
          <Text style={styles.rsvpText}>
            {item.rsvp ? 'RSVP’d' : 'RSVP'}
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );

  return (
    <>
    <JobHeader/>
    <View style={styles.container}>
      <Text style={styles.heading}>Interview Invites</Text>
      <FlatList
        data={interviewInvites}
        keyExtractor={(item) => item.id}
        renderItem={renderInterviewItem}
        ListEmptyComponent={<Text style={styles.noInvites}>No interview invites yet.</Text>}
      />
    </View>
    <JobMenu/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  inviteBox: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    // elevation: 3,
  },
  inviteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  company: {
    fontSize: 14,
    color: '#666',
  },
  details: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  rsvpButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  rsvpButtonActive: {
    backgroundColor: '#4CAF50',
  },
  rsvpText: {
    fontSize: 14,
    color: '#333',
  },
  noInvites: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
});

export default InterviewInvite;
