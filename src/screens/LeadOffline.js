import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Header2 as Header } from '../components/Header';
import ArrowIcon from 'react-native-vector-icons/AntDesign';
import Menu from '../components/Menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Material Icons का उपयोग


const LeadOffline = ({ navigation }) => {
  const [leads, setLeads] = useState([
    {
      id: '1',
      accountType: 'Paytm Money Demat Account',
      name: 'Suresh Kumar',
      phone: '9999999991',
      leadId: '0001',
      creationDate: '01 Aug 2024',
      updateDate: '05 Aug 2024',
      status: 'Pending',
    },
    {
      id: '2',
      accountType: 'Zerodha Demat Account',
      name: 'Ramesh Verma',
      phone: '8888888882',
      leadId: '0002',
      creationDate: '02 Aug 2024',
      updateDate: '06 Aug 2024',
      status: 'Pending',
    },
    {
      id: '3',
      accountType: 'Groww Demat Account',
      name: 'Mohan Sharma',
      phone: '7777777773',
      leadId: '0003',
      creationDate: '03 Aug 2024',
      updateDate: '07 Aug 2024',
      status: 'Approved',
    },
    {
      id: '4',
      accountType: 'ICICI Direct Account',
      name: 'Rajesh Gupta',
      phone: '6666666664',
      leadId: '0004',
      creationDate: '04 Aug 2024',
      updateDate: '08 Aug 2024',
      status: 'Pending',
    },
    {
      id: '5',
      accountType: 'HDFC Securities',
      name: 'Amit Sinha',
      phone: '5555555555',
      leadId: '0005',
      creationDate: '05 Aug 2024',
      updateDate: '09 Aug 2024',
      status: 'Approved',
    },
    {
      id: '6',
      accountType: 'Axis Direct Account',
      name: 'Sunita Devi',
      phone: '4444444446',
      leadId: '0006',
      creationDate: '06 Aug 2024',
      updateDate: '10 Aug 2024',
      status: 'Pending',
    },
    {
      id: '7',
      accountType: 'Kotak Securities',
      name: 'Pooja Mehta',
      phone: '3333333337',
      leadId: '0007',
      creationDate: '07 Aug 2024',
      updateDate: '11 Aug 2024',
      status: 'Approved',
    },
    {
      id: '8',
      accountType: 'Angel Broking',
      name: 'Nitin Jain',
      phone: '2222222228',
      leadId: '0008',
      creationDate: '08 Aug 2024',
      updateDate: '12 Aug 2024',
      status: 'Pending',
    },
    {
      id: '9',
      accountType: '5Paisa Demat Account',
      name: 'Vikas Yadav',
      phone: '1111111119',
      leadId: '0009',
      creationDate: '09 Aug 2024',
      updateDate: '13 Aug 2024',
      status: 'Pending',
    },
    {
      id: '10',
      accountType: 'Edelweiss Broking',
      name: 'Manoj Tiwari',
      phone: '0000000000',
      leadId: '0010',
      creationDate: '10 Aug 2024',
      updateDate: '14 Aug 2024',
      status: 'Approved',
    },
  ]);

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      {/* Row 1 */}
      <View style={styles.cardrow}>
        <Text style={styles.leftText}>{item.accountType}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{item.status}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardrow}>
          <Text style={styles.rightText}>{item.name} dddd</Text>
      </View>
      {/* Row 2 */}
      <View style={styles.cardrow}>
        <Text style={styles.moText}>{item.phone}</Text>
        <Text style={styles.rightText}>Lead ID: {item.leadId}</Text>
      </View>

      {/* Row 3 */}
      <View style={styles.cardrow}>
        <TouchableOpacity style={styles.box}>
          <Text style={styles.boxText}>Creation Date</Text>
          <Text style={styles.dateText}>{item.creationDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <Text style={styles.boxText}>Update Date</Text>
          <Text style={styles.dateText}>{item.updateDate}</Text>
        </TouchableOpacity>
        <View style={styles.boxContent}>
          <Text style={styles.boxText}>Get Help</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#333" style={styles.icon} />
        </View>
      </View>
    </View>
  );

  return (
    <>
            <Header title= 'Lead ' />
    
    <ScrollView style={styles.ScrollViewcontainer}>
    <View style={styles.container}>
      {/* Filter Section */}

      <View style={styles.buttonrow}>

             <Pressable  style={styles.buttonO} onPress={() => navigation.navigate('LeadOnline')} >
                  <Text style={styles.buttonTextO}>Online Conversion</Text>
            </Pressable>  
            <Pressable  style={styles.Bluebutton} onPress={() => navigation.navigate('LeadOffline')} >
                  <Text style={styles.BluebuttonText}>Offline Conversion</Text>
            </Pressable>    
       
      
      </View>

      <View style={styles.filterContainer}>
        <TextInput style={styles.input} placeholder="Enter Name/ Number" />
      
        <TouchableOpacity style={styles.filterButton}>
        <Icon name="filter" size={16} color="#000" style={styles.Filtericon} />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
      </View>

    

      <FlatList
        data={leads}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.container}
      />
      
    </View>
    </ScrollView>
    <Menu/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    padding: 17,
  },
  ScrollViewcontainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    flexGrow: 1,
  },
  buttonrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Bluebutton: {
    borderWidth: 0.7,
    borderColor: '#0d4574',
    backgroundColor: '#0d4574',
    marginHorizontal: 6,
    paddingVertical:10,
    paddingHorizontal:25,
    borderRadius: 10,
  },
  BluebuttonText: {
    color: '#fff',
    fontSize: 16,

  },
  buttonO: {
    borderWidth: 0.7,
    borderColor: '#333',
    backgroundColor: '#fff',
    paddingVertical:10,
    paddingHorizontal:25,
        marginHorizontal: 6,
    borderRadius: 10,
  },
  buttonTextO: {
    color: '#333',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginVertical:10,
  },
  input: {
    flex: 1,
    
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  filterButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
   color: '#000',
    marginRight: 5,
  },
  Filtericon:{
    marginRight: 5,
  },
 
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal:10,
    paddingVertical:10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom:10,
  },
  cardrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 3,
    paddingVertical:2,
  },
  leftText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  moText:{
    fontSize: 14,
    color: '#333',
  },
  rightText: {
    fontSize: 14,
    color: '#555',
  },
  button: {
    backgroundColor: '#ffc266',
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  box: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingVertical:7,
    borderRadius: 25,
    marginRight:2,
    alignItems: 'center',
  },
  boxText: {
    fontSize: 11,
    color: '#0d4574',
  },
  dateText:{
    fontSize: 12,
    color: '#333',
  },
  boxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical:9,
    paddingHorizontal:10,
    borderRadius: 25,
    marginRight:2,
    borderWidth: 0.7,
    borderColor: '#ffc266',
  },
  icon: {
    marginLeft: 5,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 20,
    padding:3,
  },
});

export default LeadOffline;
