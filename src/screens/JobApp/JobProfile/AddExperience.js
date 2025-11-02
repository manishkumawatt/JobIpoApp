import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import JobHeader from '../../../components/Job/JobHeader';
import JobMenu from '../../../components/Job/JobMenu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RadioButton} from 'react-native-paper';
import {useColorScheme} from 'react-native';

const AddExperience = ({route}) => {
  const jobSeekerData = route.params;
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobRole: '',
    companyName: '',
    industry: '',
    currentlyWorking: '',
    employmentType: '',
    startDate: '',
    endDate: '',
    skills: [],

    currentSalary: '',
    workMode: '',
    experienceLevel: '',
  });

  const [skill, setSkill] = useState('');
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#000' : '#000';
  const isDarkMode = useColorScheme() === 'dark';

  const addSkill = () => {
    if (skill.trim() !== '' && !formData.skills.includes(skill.trim())) {
      setFormData(prevData => ({
        ...prevData,
        skills: [...prevData.skills, skill.trim()],
      }));
      setSkill('');
    }
  };

  const removeSkill = index => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData(prevData => ({
      ...prevData,
      skills: updatedSkills,
    }));
  };

  const handleChange = (key, value) => {
    setFormData({...formData, [key]: value});
  };

  const handleSubmit = () => {
    // // console.log('AddExperience', JSON.stringify(formData, null, 2));
  };

  return (
    <>
      <JobHeader />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.heading}>Job Details</Text>
          <View style={styles.jobDetails}>
            <Text style={styles.label}>Job Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Job Title"
              placeholderTextColor={isDarkMode ? '#555' : '#555'}
              value={formData.jobTitle}
              onChangeText={text => handleChange('jobTitle', text)}
            />

            <Text style={styles.label}>Job Role</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Job Role"
              placeholderTextColor={isDarkMode ? '#555' : '#555'}
              value={formData.jobRole}
              onChangeText={text => handleChange('jobRole', text)}
            />

            <Text style={styles.label}>Work Mode</Text>
            <View style={styles.buttonGroup}>
              {['On-site', 'Remote', 'Hybrid'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.button,
                    formData.workMode === option && styles.buttonSelected,
                  ]}
                  onPress={() => handleChange('workMode', option)}>
                  <Text
                    style={[
                      styles.buttonText,
                      formData.workMode === option && styles.buttonTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Level of Experience</Text>
            <View style={styles.buttonGroup}>
              {['0-1', '1-2', '2-3', '3-5', '5-7', '7-10'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.button,
                    formData.experienceLevel === option &&
                      styles.buttonSelected,
                  ]}
                  onPress={() => handleChange('experienceLevel', option)}>
                  <Text
                    style={[
                      styles.buttonText,
                      formData.experienceLevel === option &&
                        styles.buttonTextSelected,
                    ]}>
                    {option} Year
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Skills (up to 10)</Text>
            <View style={styles.skillInputContainer}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Enter a skill"
                placeholderTextColor={isDarkMode ? '#555' : '#555'}
                value={skill}
                onChangeText={setSkill}
                onSubmitEditing={addSkill}
              />
              <TouchableOpacity style={styles.addButton} onPress={addSkill}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.skillsContainer}>
              {formData.skills.map((item, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeSkill(index)}>
                    <Icon name="close" size={17} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.heading}>Company Details</Text>
          <View style={styles.jobDetails}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Company Name"
              placeholderTextColor={isDarkMode ? '#555' : '#555'}
              value={formData.companyName}
              onChangeText={text => handleChange('companyName', text)}
            />

            <Text style={styles.label}>Preferred Job Industry</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.industry}
                onValueChange={itemValue => handleChange('industry', itemValue)}
                style={{color: textColor}}>
                <Picker.Item label="Select Industry" value="" />
                <Picker.Item label="IT & Software" value="IT & Software" />
                <Picker.Item
                  label="Education & Training"
                  value="Education & Training"
                />
                <Picker.Item label="Transportation" value="Transportation" />
                <Picker.Item
                  label="Facility Management"
                  value="Facility Management"
                />
                <Picker.Item
                  label="Real Estate & Property"
                  value="Real Estate & Property"
                />
                <Picker.Item
                  label="Insurance & Stock Market"
                  value="Insurance & Stock Market"
                />
                <Picker.Item
                  label="E-Commerce Management"
                  value="E-Commerce Management"
                />
                <Picker.Item
                  label="Hospitality & Tourism"
                  value="Hospitality & Tourism"
                />
                <Picker.Item
                  label="Healthcare & Support"
                  value="Healthcare & Support"
                />
                <Picker.Item label="BPO & KPO" value="BPO & KPO" />
                <Picker.Item
                  label="Banking, Financial Services & Insurance"
                  value="Banking, Financial Services & Insurance"
                />
                <Picker.Item
                  label="E-commerce & Retail"
                  value="E-commerce & Retail"
                />
                <Picker.Item
                  label="Healthcare & Pharmaceuticals"
                  value="Healthcare & Pharmaceuticals"
                />
                <Picker.Item
                  label="Engineering & Manufacturing"
                  value="Engineering & Manufacturing"
                />
                <Picker.Item
                  label="Sales & Marketing"
                  value="Sales & Marketing"
                />
                <Picker.Item label="Telecom" value="Telecom" />
                <Picker.Item label="Automobile" value="Automobile" />
                <Picker.Item
                  label="Hospitality & Travel"
                  value="Hospitality & Travel"
                />
                <Picker.Item
                  label="Logistics & Supply Chain"
                  value="Logistics & Supply Chain"
                />
                <Picker.Item
                  label="Construction & Real Estate"
                  value="Construction & Real Estate"
                />
                <Picker.Item
                  label="Legal & Compliance"
                  value="Legal & Compliance"
                />
                <Picker.Item
                  label="Media, Advertising & Entertainment"
                  value="Media, Advertising & Entertainment"
                />
                <Picker.Item
                  label="Agriculture & Rural Development"
                  value="Agriculture & Rural Development"
                />
                <Picker.Item
                  label="Human Resources & Recruitment"
                  value="Human Resources & Recruitment"
                />
                <Picker.Item
                  label="Design & Creative"
                  value="Design & Creative"
                />
                <Picker.Item label="Others" value="Others" />
              </Picker>
            </View>

            <Text style={styles.label}>
              Current Salary per month (Optional){' '}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your current salary"
              keyboardType="numeric"
              value={formData?.currentSalary}
              // onChangeText={setCurrentSalary}
              onChangeText={text => handleChange('currentSalary', text)}
            />
          </View>

          <Text style={styles.heading}>Employee Details</Text>
          <View style={styles.jobDetails}>
            <Text style={styles.label}>
              Are you currently working in this company?
            </Text>
            <View style={styles.buttonGroup}>
              {['Yes', 'No'].map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.button,
                    formData.currentlyWorking === level &&
                      styles.buttonSelected,
                  ]}
                  onPress={() => handleChange('currentlyWorking', level)}>
                  <Text
                    style={[
                      styles.buttonText,
                      formData.currentlyWorking === level &&
                        styles.buttonTextSelected,
                    ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Work Type</Text>
            <View style={styles.buttonGroup}>
              {['Full-time', 'Part-time', 'Internship'].map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.button,
                    formData.employmentType === level && styles.buttonSelected,
                  ]}
                  onPress={() => handleChange('employmentType', level)}>
                  <Text
                    style={[
                      styles.buttonText,
                      formData.employmentType === level &&
                        styles.buttonTextSelected,
                    ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Start Date</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Start Date (YYYY-MM-DD)"
              placeholderTextColor={isDarkMode ? '#555' : '#555'}
              value={formData.startDate}
              onChangeText={text => handleChange('startDate', text)}
            />

            <Text style={styles.label}>End Date</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter End Date (YYYY-MM-DD)"
              placeholderTextColor={isDarkMode ? '#555' : '#555'}
              value={formData.endDate}
              onChangeText={text => handleChange('endDate', text)}
            />
          </View>

          {/* <Button title="Save" onPress={handleSubmit} /> */}
        </View>
      </ScrollView>
      <View style={styles.SaveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      {/* <JobMenu /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    padding: 10,
    backgroundColor: '#ebf0fa',
  },
  saveButton: {
    marginVertical: 20,
    backgroundColor: '#0c6951',
    borderRadius: 10,
  },
  saveButtonText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    padding: 8,
  },
  jobDetails: {
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingBottom: 9,
  },
  SaveContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  skillInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 4,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 5,
    marginBottom: 6,
    backgroundColor: '#ebf0fa',
  },
  inputFlex: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#ebf0fa',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#0d4574',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d4574',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  skillText: {
    fontSize: 14,
    marginRight: 5,
    color: '#fff',
  },

  heading: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#ebf0fa',
    color: '#000',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 9,
  },
  button: {
    //   minWidth: "45%",
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 7,
    paddingHorizontal: 17,
    borderRadius: 19,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginLeft: 9,
  },
  buttonText: {color: '#333'},
  buttonTextSelected: {color: '#fff'},
  buttonSelected: {backgroundColor: '#0d4574'},
});

export default AddExperience;
