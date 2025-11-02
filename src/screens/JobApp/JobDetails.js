import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const dummyJobs = {
  '289': {
    title: 'React Native Developer',
    company: 'Tech Corp',
    location: 'Bangalore',
    description: 'Build and maintain mobile applications using React Native.',
  },
  '123': {
    title: 'Frontend Engineer',
    company: 'Webify Ltd.',
    location: 'Mumbai',
    description: 'Work on web interfaces using React and modern JavaScript.',
  },
};

const JobDetails = ({ route }) => {
  const [job, setJob] = useState(null);

  useEffect(() => {
    const { jobId } = route.params || {};

    if (jobId && dummyJobs[jobId]) {
      setTimeout(() => {
        setJob(dummyJobs[jobId]);
      }, 1000); // Simulate loading
    }
  }, [route.params]);

  if (!job) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF8D53" />
        <Text>Loading job details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.company}>{job.company}</Text>
      <Text style={styles.location}>{job.location}</Text>
      <Text style={styles.description}>{job.description}</Text>
    </View>
  );
};

export default JobDetails;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  company: {
    fontSize: 18,
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    marginBottom: 12,
    color: '#666',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
});
