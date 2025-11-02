import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Menu from '../../components/Menu';
import { Header2 as Header } from '../../components/Header';

const PlanDetails = ({ route }) => {
  const { plan, validity, totalData, highSpeedData, voice, sms, extraPoints } = route.params.plan;

  return (
    <>
          <Header title="Plan Details" />

    <View style={styles.container}>
      {/* <Text style={styles.title}>Plan Details</Text> */}

      {/* Plan Detail Cards */}
      <View style={styles.card}>
      <View  style={[styles.cardbox, { borderTopLeftRadius: 16 }]}>
      <Text style={styles.cardTitle}>Plan</Text>

      </View>
      <View style={[styles.cardbox, { borderTopRightRadius: 16 }]}>
      <Text style={styles.cardValue}>{plan}</Text>

      </View>
      </View>

      <View style={styles.card}>
      <View style={styles.cardbox}>
      <Text style={styles.cardTitle}>Pack Validity</Text>

      </View>
      <View style={styles.cardbox}>
      <Text style={styles.cardValue}>{validity}</Text>

      </View>
      </View>

      <View style={styles.card}>
      <View style={styles.cardbox}>
      <Text style={styles.cardTitle}>Total Data</Text>

      </View>
      <View style={styles.cardbox}>
      <Text style={styles.cardValue}>{totalData}</Text>

      </View>
      </View>

      <View style={styles.card}>
      <View style={styles.cardbox}>
      <Text style={styles.cardTitle}>High Speed Data</Text>

      </View>
      <View style={styles.cardbox}>
      <Text style={styles.cardValue}>{highSpeedData}</Text>

      </View>
      </View>

      <View style={styles.card}>
      <View style={styles.cardbox}>
      <Text style={styles.cardTitle}>Voice</Text>

      </View>
      <View style={styles.cardbox}>
      <Text style={styles.cardValue}>{voice}</Text>

      </View>
      </View>
      <View style={styles.card}>
      <View style={[styles.cardbox, { borderBottomLeftRadius: 16 }]}>
      <Text style={styles.cardTitle}>SMS</Text>

      </View>
      <View  style={[styles.cardbox, { borderBottomRightRadius: 16 }]}>
      <Text style={styles.cardValue}>{sms}</Text>

      </View>
      </View>

    

      {/* Additional Benefits Card */}
      <View style={styles.Additional}>
        {/* <Text style={styles.sectionTitle}>Additional Benefits:</Text> */}
        <FlatList
          data={extraPoints}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.point}>* {item}</Text>}
        />
      </View>
    </View>
    <Menu/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8, 
  },
  cardbox:{
    width:'48%',
    paddingVertical:12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    margin:3,

  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardValue: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  point: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  Additional:{
    marginTop:40,
  },
});

export default PlanDetails;
