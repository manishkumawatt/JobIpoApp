import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {pick, types} from '@react-native-documents/picker';
import Icon from 'react-native-vector-icons/Octicons';
import UploadIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PdfIcon from 'react-native-vector-icons/FontAwesome';

import JobHeader from '../../../components/Job/JobHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CertificateUpload = ({navigation, route}) => {
  const jobSeekerData = route.params;
  const [fileUri, setFileUri] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');

  const handleSelectFile = async () => {
    try {
      const res = await pick({
        allowMultiSelection: false,
        mode: 'open',
        type: [types.images],
      });
      setFileUri(res[0].uri);
      setFileName(res[0].name);
      setFileType(res[0].type);
    } catch (err) {
      Alert.alert('Error selecting file', err.message);
    }
  };

  const uploadImageOnServer = async imageData => {
    try {
      let response = await fetch('https://jobipo.com/api/Agent/imageUpload', {
        method: 'POST',
        body: imageData,
        headers: {'Content-Type': 'multipart/form-data'},
      }).then(res => res.json());
      return response;
    } catch (error) {}
  };

  const handleUpload = async () => {
    if (fileUri) {
      const formData = new FormData();
      formData.append('image', {
        uri: fileUri,
        type: fileType,
        name: fileName,
      });
      const fileRes = await uploadImageOnServer(formData);

      await fetch(`https://jobipo.com/api/Agent/doupdatejobp`, {
        method: 'POST',
        body: JSON.stringify({
          ...jobSeekerData,
          certification: fileRes.message,
        }),
      })
        .then(res => res.json())
        .then(async res => {
          if (res) {
            await AsyncStorage.setItem('certification', fileName);
            Alert.alert('Certificate uploaded successfully!');
            setFileUri(null);
            setFileName('');
            navigation.goBack();
          }
        })
        .catch(err => {
          Alert.alert('Error updating details');
        });
    } else {
      Alert.alert('Please select a file to upload!');
    }
  };

  const handleCancel = () => {
    setFileUri(null);
    setFileName('');
  };

  return (
    <>
      <JobHeader />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Upload Certificate</Text>

        <TouchableOpacity
          style={styles.selectButtonpdf}
          onPress={handleSelectFile}>
          <PdfIcon name="file-pdf-o" size={50} color="#0d4574" />
          <Text style={styles.selectText}>Select Certificate (PDF)</Text>
        </TouchableOpacity>

        {fileUri && (
          <View style={styles.fileDetails}>
            <Text style={styles.fileName}>File {fileName}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.removeContainer}>
        <TouchableOpacity style={styles.removeButton} onPress={handleCancel}>
          <Icon name="trash" size={22} color="#2d8659" style={styles.icon} />
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.SaveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleUpload}>
          <UploadIcon
            name="upload"
            size={27}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.saveButtonText}>Upload Certificate</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectButton: {
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  selectButtonpdf: {
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
  },
  selectText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#0c6951',
  },
  fileDetails: {
    marginVertical: 15,
    alignItems: 'center',
  },
  fileName: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d8659',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
  },
  SaveContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingBottom: 15,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#2d8659',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#2d8659',
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
  },
  removeContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  icon: {
    marginRight: 10,
  },
});

export default CertificateUpload;
