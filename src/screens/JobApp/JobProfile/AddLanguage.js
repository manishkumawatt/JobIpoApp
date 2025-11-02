import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import JobHeader from '../../../components/Job/JobHeader';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function parseIfArrayString(value) {
  if (value === '') {
    return [];
  }

  if (
    typeof value === 'string' &&
    value.trim().startsWith('[') &&
    value.trim().endsWith(']')
  ) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (err) {
      // console.warn("Invalid JSON array string:", value);
    }
  }

  return value;
}

const AddLanguage = ({navigation, route}) => {
  const data = route.params;
  // const [selectedLanguages, setSelectedLanguages] = useState([
  //   ...parseIfArrayString(data.languageKnown),
  // ]);

  const [selectedLanguages, setSelectedLanguages] = useState([
    ...parseIfArrayString(data?.languageKnown || '[]'),
  ]);
  const [languages, setLanguages] = useState([]);
  const [englishLevel, setEnglishLevel] = useState('');

  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {
        const langData = await fetch(`https://jobipo.com/api/Agent/jobdata`, {
          method: 'GET',
        }).then(res => res.json());

        const list = JSON.parse(
          JSON.parse(JSON.stringify(langData)).msg,
        ).language?.map(item => item.language);
        // // console.log('sdfdfsdf', list);
        setLanguages(list);
      };

      let mount = true;
      if (mount) {
        GetDataFunc();
      }

      return () => {
        mount = false;
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (!data) return;

      // // console.log('Screen focused. Route data:', data);

      if (data.languageKnown) {
        const langArray = parseIfArrayString(data.languageKnown || '[]');
        const english = langArray.find(item => item.startsWith('English:'));
        const level = english ? english.split(':')[1].trim() : '';

        // // console.log('Parsed level:', level);
        setEnglishLevel(level);
        setSelectedLanguages(
          langArray.filter(item => !item.startsWith('English:')),
        );
      }

      return () => {
        // // console.log('Screen unfocused. Resetting if needed...');
      };
    }, [data]),
  );

  const handleLanguageSelection = language => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(item => item !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  // const handleSave = async () => {

  //   const res = await fetch(`https://jobipo.com/api/Agent/doupdatejobp`, {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       ...data,
  //       languageKnown: JSON.stringify(selectedLanguages)
  //     })
  //   }).then(res => res.json())
  //     .catch(err => {
  //       // console.log('err', err)
  //       Alert.alert('Error updating details')
  //     })

  //   if (res) {
  //     console.log('res', res)
  //     navigation.goBack()
  //     Alert.alert('Languages Updated Successfully')
  //   }

  // };

  const handleSave = async () => {
    try {
      const userID = await AsyncStorage.getItem('UserID');

      if (!userID) {
        Alert.alert('Error', 'UserID not found. Please login again.');
        return;
      }
      // // console.log('languageKnown:', englishLevel);
      // // console.log('selectedLanguages:', selectedLanguages);

      const payload = {
        ...data,
        userID,
        // languageKnown: JSON.stringify(selectedLanguages),
        languageKnown: JSON.stringify([
          ...(englishLevel ? [`English:${englishLevel}`] : []),
          ...selectedLanguages,
        ]),
      };

      // // console.log('languageKnown:', languageKnown);

      const res = await fetch(`https://jobipo.com/api/v2/update-job-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).then(res => res.json());

      if (res?.type === 'success') {
        Alert.alert('Languages Updated Successfully');
        navigation.goBack();
      } else {
        Alert.alert('Update Failed', res?.message || 'Something went wrong.');
      }
    } catch (err) {
      // // console.log('Error:', err);
      Alert.alert('Error updating details');
    }
  };

  return (
    <>
      <JobHeader />
      <View style={styles.container}>
        {/* <Text style={styles.title}>Select Languages You Know</Text> */}
        <ScrollView style={styles.scrollView}>
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#000',
                marginBottom: 6,
                marginLeft: 4,
              }}>
              Language Known
            </Text>

            <View style={styles.cardlView}>
              <Text style={styles.cardlViewText}>English Proficiency</Text>
              <View style={styles.radioGroupRow}>
                {[
                  'Basic Speaking',
                  'Intermediate Speaking',
                  'Fluent Speking',
                ].map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.radioBtn,
                      englishLevel === level && styles.radioBtnActive,
                    ]}
                    onPress={() => setEnglishLevel(level)}>
                    <Text
                      style={[
                        styles.radioText,
                        englishLevel === level && styles.radioTextActive,
                      ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#000',
              marginVertical: 10,
              marginLeft: 4,
            }}>
            Languages Known
          </Text>

          {languages.map((language, index) => (
            <View key={index} style={styles.languageItem}>
              <Text style={styles.languageText}>{language}</Text>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  selectedLanguages.includes(language) && styles.checked,
                ]}
                onPress={() => handleLanguageSelection(language)}>
                {selectedLanguages.includes(language) && (
                  <Icon name="check" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <View style={styles.SaveContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        {/* <Button title="Save" onPress={handleSave} /> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  radioGroupRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // rowGap: 10,
    columnGap: 6,
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    marginTop: 20,
  },
  cardlViewText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginVertical: 10,
    marginLeft: 4,
  },

  cardlView: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
    marginVertical: 10,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
    borderRadius: 5,
  },
  languageText: {
    flex: 1,
    marginRight: 10,
    paddingLeft: 10,
    padding: 5,
    color: '#000',
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  checked: {
    backgroundColor: '#00802b',
  },
  SaveContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    marginVertical: 20,
    backgroundColor: '#0d4574',
    borderRadius: 10,
  },
  saveButtonText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    padding: 8,
  },
  radioBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#f0f8ff',
    alignSelf: 'flex-start',
  },

  radioBtnActive: {
    backgroundColor: '#0d4574',
    borderColor: '#0d4574',
  },

  radioText: {
    color: '#333',
    fontWeight: '600',
  },

  radioTextActive: {
    color: '#fff',
  },
});

export default AddLanguage;
