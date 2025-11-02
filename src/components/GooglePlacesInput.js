import React, {useEffect, useRef, useState} from 'react';
import {ScrollView} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useColorScheme} from 'react-native';

const GooglePlacesInput = ({value, setValue, isHidden = false}) => {
  const [focus, setFocus] = useState(false);
  const ref = useRef(null);
  const isDarkMode = useColorScheme() === 'dark';

  // ✅ Show selected location inside input
  useEffect(() => {
    if (value && ref.current && !focus) {
      ref.current?.setAddressText(value); // Show value in input
    }
  }, [value, focus]);

  return (
    <ScrollView
      scrollEnabled={false}
      contentContainerStyle={{
        position: 'relative',
        flex: 1,
      }}>
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder="Search Location"
        placeholderTextColor={isDarkMode ? '#555' : '#555'}
        keyboardShouldPersistTaps="always"
        predefinedPlaces={[]}
        predefinedPlacesAlwaysVisible={false}
        suppressDefaultStyles={false}
        textInputHide={false}
        timeout={20000}
        textInputProps={{
          onFocus: () => setFocus(true),
          onBlur: () => setFocus(false),
        }}
        styles={{
          textInputContainer: {
            gap: 10,
          },
          container: {
            flex: 1,
            position: 'relative',
          },
          textInput: {
            backgroundColor: '#ffffff',
            color: '#000',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 8,
            marginTop: 8,
          },
          listView: {
            zIndex: 99,
            display: focus ? 'flex' : 'none',
          },
        }}
        fetchDetails={true}
        keepResultsAfterBlur={true}
        debounce={200}
        onPress={(data, details) => {
          const lat = details?.geometry?.location?.lat;
          const lng = details?.geometry?.location?.lng;
          const addressComponents = details?.address_components || [];

          let city = '';
          let state = '';
          let pincode = '';

          addressComponents.forEach(component => {
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
            if (component.types.includes('administrative_area_level_1')) {
              state = component.long_name;
            }
            if (component.types.includes('postal_code')) {
              pincode = component.long_name;
            }
            if (
              !city &&
              component.types.includes('administrative_area_level_2')
            ) {
              city = component.long_name;
            }
          });

          const val = {
            Locality: details?.formatted_address || '',
            lat,
            lng,
            city,
            state,
            pincode,
          };

          setValue(val);
          setFocus(false);
        }}
        query={{
          key: 'AIzaSyDqBEtr9Djdq0b9NTCMmquSrKiPCCv384o',
          language: 'en',
          components: 'country:in',
        }}
      />
    </ScrollView>
  );
};

export default GooglePlacesInput;
