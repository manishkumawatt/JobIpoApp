import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet ,ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Header2 as Header } from '../components/Header';
import ArrowIcon from 'react-native-vector-icons/AntDesign';
import Menu from '../components/Menu';

const FullReport = () => {
  const [data, setData] = useState([
    {
      campaign: 'Kotak 811',
      clicks: '5',
      conversion: '3',
      payout: '₹ 300/-',
      status: 'Approved',
    },
    {
      campaign: 'Kotak 811',
      clicks: '6',
      conversion: '4',
      payout: '₹ 400/-',
      status: 'Pending',
    },
    {
      campaign: 'Kotak 811',
      clicks: '7',
      conversion: '5',
      payout: '₹ 500/-',
      status: 'Approved',
    },
    {
      campaign: 'Kotak 811',
      clicks: '8',
      conversion: '3',
      payout: '₹ 300/-',
      status: 'Pending',
    },
    {
      campaign: 'Kotak 811',
      clicks: '9',
      conversion: '2',
      payout: '₹ 800/-',
      status: 'Approved',
    },
    {
        campaign: 'Kotak 811',
        clicks: '10',
        conversion: '2',
        payout: '₹ 600/-',
        status: 'Pending',
      },
      {
        campaign: 'Kotak 811',
        clicks: '11',
        conversion: '7',
        payout: '₹ 400/-',
        status: 'Approved',
      },
      {
        campaign: 'Kotak 811',
        clicks: '12',
        conversion: '2',
        payout: '₹ 400/-',
        status: 'Pending',
      },
      {
        campaign: 'Kotak 811',
        clicks: '13',
        conversion: '4',
        payout: '₹ 400/-',
        status: 'Approved',
      },
      {
        campaign: 'Kotak 811',
        clicks: '18',
        conversion: '4',
        payout: '₹ 400/-',
        status: 'Approved',
      },
      {
        campaign: 'Kotak 811',
        clicks: '18',
        conversion: '4',
        payout: '₹ 400/-',
        status: 'Approved',
      },
      {
        campaign: 'Kotak 811',
        clicks: '1',
        conversion: '4',
        payout: '₹ 400/-',
        status: 'Approved',
      },
      {
        campaign: 'Kotak 811',
        clicks: '1',
        conversion: '4',
        payout: '₹ 400/-',
        status: 'Approved',
      },
      {
        campaign: 'Kotak 811',
        clicks: '1',
        conversion: '4',
        payout: '₹ 400/-',
        status: 'Approved',
      },
      {
        campaign: 'Kotak 811',
        clicks: '1',
        conversion: '4',
        payout: '₹ 400/-',
        status: 'Approved',
      },
      {
        campaign: 'Kotak 811',
        clicks: '1',
        conversion: '4',
        payout: '₹ 400/-',
        status: 'Approved',
      },
      {
        campaign: 'Kotak 811',
        clicks: '1',
        conversion: '4',
        payout: '₹ 400/-',
        status: 'Approved',
      },
      {
        campaign: 'Kotak 811',
        clicks: '1',
        conversion: '4',
        payout: '₹ 400/-',
        status: 'Approved',
      },
      {
        campaign: 'Kotak 811',
        clicks: '1',
        conversion: '4',
        payout: '₹ 400/-',
        status: 'Approved',
      },


  ]);

  const [filteredData, setFilteredData] = useState(data);
  const [entries, setEntries] = useState("50");
  const [selectedDate, setSelectedDate] = useState('Today'); 
  const dateFilters = ['Today', 'Yesterday', 'This Week', 'This Month', 'Last Month'];

  const applyFilter = () => {
    const numberOfEntries = parseInt(entries);
    const filtered = data.slice(0, numberOfEntries); 
    setFilteredData(filtered); 
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.campaign}</Text>
      <Text style={styles.cell}>{item.clicks}</Text>
      <Text style={styles.cell}>{item.conversion}</Text>
      <Text style={styles.cell}>{item.payout}</Text>
      <Text style={styles.cell}>{item.status}</Text>
    </View>
  );
  React.useEffect(() => {
    applyFilter();
  }, [entries]);

  return (
    <>
            {/* <Header title= 'Full Report ' /> */}
    
    <ScrollView style={styles.ScrollViewcontainer}>
    <View style={styles.container}>
      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <TextInput style={styles.input} placeholder="Enter Name/ Number" />
      
        <TouchableOpacity style={styles.filterButton}>
        <Icon name="filter" size={16} color="#000" style={styles.Filtericon} />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.CardContainer}>

 {/* Date Filter Buttons */}
 <View style={styles.dateFilterContainer}>
        {dateFilters.map((label) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.dateButton,
              selectedDate === label ? styles.selectedDateButton : null, 
            ]}
            onPress={() => setSelectedDate(label)} 
          >
            <Text
              style={[
                styles.dateButtonText,
                selectedDate === label ? styles.selectedDateText : null,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Row */}
      <View style={styles.actionRowContainer}>
        <View style={styles.showEntriesContainer}>
          <Text style={styles.actionText}>Show Entries</Text>
          <Text style={styles.entriesText}>{entries}</Text>

          <Picker
                  style={styles.picker}
                  selectedValue={entries}  
                  onValueChange={(itemValue) => setEntries(itemValue)} >
                <Picker.Item label="10" value="10" />
                  <Picker.Item label="50" value="50" />
                  <Picker.Item label="100" value="100" />
                  <Picker.Item label="500" value="500" />
                  <Picker.Item label="1000" value="1000" />
                  <Picker.Item label="Above 1000 (CSV)" value="Above 1000 (CSV)" />
                  <Picker.Item label="Above 5000 (CSV)" value="Above 5000 (CSV)" />
                  <Picker.Item label="Above 10000 (CSV)" value="Above 10000 (CSV)" />

                </Picker>
        </View>
        <View style={styles.exportButtonsContainer}>
        <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>CSV</Text>
            <ArrowIcon name="arrowdown" size={14} color="#000" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>PDF</Text>
            <ArrowIcon name="arrowdown" size={14} color="#000" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Campaign</Text>
        <Text style={styles.headerCell}>Clicks</Text>
        <Text style={styles.headerCell}>Conversion</Text>
        <Text style={styles.headerCell}>Payout</Text>
        <Text style={styles.headerCell}>Status</Text>
      </View>

      {/* Table Rows */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />


</View>
    </View>
    </ScrollView>
    <Menu/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    padding: 24,
    paddingBottom:20,
  },
  ScrollViewcontainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    flexGrow: 1,

  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
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
  CardContainer:{
    backgroundColor: '#fff',
padding:13,
borderRadius: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 4,
    borderRadius: 5,
  },
  dateFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  dateButtonText: {
    color: '#333',
    fontSize: 10,
  },
  selectedDateButton: {
    backgroundColor: '#0d4574', 
    color: '#fff',

  },
  selectedDateText: {
    color: '#fff', 
  },
  actionRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  showEntriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
paddingLeft:7,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownButton: {
    backgroundColor: '#e7e7e7',
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  dropdownButtonText: {
    color: '#333',
    fontSize: 12,
  },
  exportButtonsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#000',
    marginRight: 5,
   
  },
  icon: {
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 18,
    padding:3,
    textAlign:'center',

  },
 
  headerCell: {
    flex: 1,
    color: '#0d4574',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize:11,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
    fontSize:11,

  },
  picker: {
    // height: 40,
    // width: 100,
    padding:17,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    // marginRight:10,
    color:'#000',
  },
  entriesText:{
paddingLeft:8,
color:'#000',
  },
});

export default FullReport;
