import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Pressable, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Header2 as Header } from '../components/Header';
import ArrowIcon from 'react-native-vector-icons/AntDesign';
import Menu from '../components/Menu';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import RubIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Iconstopwatch from 'react-native-vector-icons/Octicons';
import IIcon from "react-native-vector-icons/MaterialIcons";

const LeadOnline = ({ navigation }) => {
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
  const [FilterDisplay, setFilterDisplay] = useState(1);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const offerOptions = ["All", "Kotak 811", "Kotak 812", "Kotak 813", "Kotak 814"];
  const filterOptions = ["Clicks", "Conversions", "Payout", "Status", "Time & Date", "Unique Clicks", "Countries"];
  const eventOptions = ["Default1", "Default2", "Default3", "Default4"];

  const [offerOpen, setOfferOpen] = useState(true);
  const [eventOpen, setEventOpen] = useState(true);

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
  // const toggleSelection = (item, selectedValues, setSelectedValues) => {
  //   setSelectedValues((prev) =>
  //     prev.includes(item)
  //       ? prev.filter((value) => value !== item)
  //       : [...prev, item]
  //   );
  // };


  const toggleSelection = (item, selectedValues, setSelectedValues) => {
    setSelectedValues(selectedValues === item ? null : item);
  };

  const toggleSelection1 = (item) => {
    if (selectedFilters.includes(item)) {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== item));
    } else {
      setSelectedFilters([...selectedFilters, item]);
    }
  };

  const renderOption = (item, selectedValues, setSelectedValues) => (
    <TouchableOpacity
      style={styles.radioButton}
      onPress={() => toggleSelection(item, selectedValues, setSelectedValues)}
    >
      <View
        style={[
          styles.circle,
          selectedValues.includes(item) && styles.selectedCircle,
        ]}
      />
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderFilter = ({ item }) => (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleSelection1(item, selectedFilters, setSelectedFilters)}
      >
        <View
          style={[
            styles.square,
            selectedFilters.includes(item) && styles.selectedSquare,
          ]}
        />
        <Text style={styles.optionText}>{item}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Header title= 'Lead ' />

      <ScrollView style={styles.ScrollViewcontainer}>
        <View style={styles.container}>
          {/* Filter Section */}

          <View style={styles.buttonrow}> 
            <Pressable style={styles.Bluebutton} onPress={() => navigation.navigate('LeadOnline')} >
              <Text style={styles.BluebuttonText}>Online Conversion</Text>
            </Pressable>
            <Pressable style={styles.buttonn} onPress={() => navigation.navigate('Leads')} >
              <Text style={styles.buttonTextt}>Offline Conversion</Text>
            </Pressable>


          </View>

          {/* <View style={styles.filterContainer}>
        <TextInput style={styles.input} placeholder="Enter Name/ Number" />
      
        <Pressable style={styles.filterButton} onPress={() =>{setFilterDisplay(0)}}>
        <Icon name="filter" size={16} color="#000" style={styles.Filtericon} />
            <Text style={styles.filterButtonText}>Filter</Text>
          </Pressable>
      </View> */}


          <View style={styles.rowContainer}>
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Image source={require('../../assets/B&RIcons/Conversion.png')} style={styles.imagecard} />
              </View>
              <View>
                <Text style={styles.cardTitle}>500</Text>
                <Text style={styles.cardValue}>Conversion</Text>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Image source={require('../../assets/B&RIcons/click.png')} style={styles.imagecard} />
              </View>
              <View>
                <Text style={styles.cardTitle}>100</Text>
                <Text style={styles.cardValue}>Clicks</Text>
              </View>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Image source={require('../../assets/B&RIcons/Revenue.png')} style={styles.imagecard} />
              </View>
              <View>
                <Text style={styles.cardTitle}>₹ 500/-</Text>
                <Text style={styles.cardValue}>Revenue</Text>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Image source={require('../../assets/B&RIcons/Impression.png')} style={styles.imagecard} />
              </View>
              <View>
                <Text style={styles.cardTitle}>25</Text>
                <Text style={styles.cardValue}>Impression</Text>
              </View>
            </View>
          </View>



          <View style={styles.CardContainer}>
            {/* Action Row */}
            <View style={styles.actionRowContainer}>
              <View style={styles.exportButtonsContainer}>
                {/* <Text style={styles.actionButtonText}>View Full Reports</Text> */}
              </View>
              {/* <View style={styles.showEntriesContainer}>
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
        </View> */}

            </View>
 
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Campaign</Text>
              <Text style={styles.headerCell}>Clicks</Text>
              <Text style={styles.headerCell}>Total Conversion</Text>
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

      <View style={[styles.fcontainer, styles.viewFilter[FilterDisplay]]}>
        <Text style={[styles.ffiltertext]}>Filter Data</Text>

        <View style={styles.filtercontainer}>

          <Pressable onPress={() => setOfferOpen(!offerOpen)} style={styles.sectionHeader}>
            <View style={styles.sectionHeadericon}>
              <IIcon
                name={offerOpen ? "arrow-drop-up" : "arrow-drop-down"}
                size={34}
                color="#000"
                style={styles.iicon}
              />
              <Text style={styles.sectionTitle}>  Offer</Text>
            </View>

          </Pressable>
          {offerOpen && (
            offerOptions.map((item) => renderOption(item, selectedOffers, setSelectedOffers))
          )}

          <FlatList
            data={filterOptions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderFilter}
            style={{ marginVertical: 10 }} />

          <Pressable onPress={() => setEventOpen(!eventOpen)} style={styles.sectionHeader}>
            <View style={styles.sectionHeadericon}>
              <IIcon
                name={eventOpen ? "arrow-drop-up" : "arrow-drop-down"}
                size={34}
                color="#000"
                style={styles.iicon}
              />
              <Text style={styles.sectionTitle}>  Events</Text>
            </View>

          </Pressable>
          {eventOpen && (
            eventOptions.map((item) => renderOption(item, selectedEvents, setSelectedEvents))
          )}

          <View style={styles.buttonsContainer}>
            <Pressable style={styles.applyButton}>
              <Text style={styles.buttonText}>Apply</Text>
            </Pressable>
            <Pressable
              style={styles.closeButton}
              onPress={() => {
                setFilterDisplay(1);
              }}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>

        </View>
        {/* filtter */}


      </View>
      <Menu />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  filtercontainer: {
    backgroundColor: '#fff',
    padding: 15,
  },
  ScrollViewcontainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    flexGrow: 1,
  },
  imagecard: {
    width: 20,
    height: 20,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  viewFilter: [{
    display: 'flex'
  }, {
    display: 'none',
  }],
  ffiltertext: {
    fontSize: 20,
    color: '#000',
  },
  fcontainer: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: '95%',
    marginLeft: '2.5%',
    backgroundColor: '#fff',
    position: 'absolute',
    top: 60,
    left: 0,
    height: 590,
    borderRadius: 15,
  },
  buttonrow: {
    marginHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Bluebutton: {
    borderWidth: 0.7,
    borderColor: '#0d4574',
    backgroundColor: '#0d4574',
    marginHorizontal: 6,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  BluebuttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonn: {
    borderWidth: 0.7,
    borderColor: '#333',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 6,
    borderRadius: 10,
  },
  buttonTextt: {
    color: '#333',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginVertical: 10,
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
  Filtericon: {
    marginRight: 5,
  },

  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    width: '45%',
    padding: 4,
    alignItems: 'center',
    flexDirection: 'row',
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 10,

  },
  iconContainer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 10,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical: 20,
  },
  cardTitle: {
    fontSize: 22,
    color: '#000',
  },
  cardValue: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },

  CardContainer: {
    backgroundColor: '#fff',
    padding: 13,
    borderRadius: 8,
    marginTop: 9,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 4,
    borderRadius: 5,
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
    paddingLeft: 7,
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
    paddingHorizontal: 15,
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
    padding: 3,
    textAlign: 'center',

  },

  headerCell: {
    flex: 1,
    color: '#0d4574',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 11,
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
  },
  picker: {
    // height: 40,
    // width: 100,
    padding: 17,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    // marginRight:10,
    color: '#000',
  },
  entriesText: {
    paddingLeft: 8,
    color: '#000',
  },



  // checkboxContainer:{
  //   marginVertical:2,
  // },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    // fontWeight: "bold",
    color: 'black',
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    marginLeft: 40,

  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 0.7,
    borderColor: "#1f2e2e",
    marginRight: 10,
    backgroundColor: "#f8f8f8",

  },
  selectedCircle: {
    borderColor: "#0d4574",
    backgroundColor: "#0d4574",
  },
  optionText: {
    fontSize: 16,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  square: {
    width: 20,
    height: 20,
    borderWidth: 0.7,
    borderColor: "#1f2e2e",
    marginRight: 10,
    backgroundColor: "#f8f8f8",

  },
  selectedSquare: {
    borderColor: "#0d4574",
    backgroundColor: "#0d4574",
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 10,
  },
  applyButton: {
    backgroundColor: '#0d4574',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginLeft: 5,
  },
  closeButton: {
    backgroundColor: '#333',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginLeft: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  iicon: {
    alignItems: "center",
    textAlign: 'center',
  },
  sectionHeadericon: {
    flexDirection: "row",

  },
});

export default LeadOnline;
