import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';

// Helper hook to debounce a value
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function PlacesAutocomplete({
  hideBorder = false,
  apiKey,
  onPlaceSelected,
  placeholder = 'Search Location',
  showSuggestions = true,
  onFocus,
  onBlur,
  value = '',
}) {
  const [input, setInput] = useState(value);
  const debouncedInput = useDebounce(input, 300);
  const [predictions, setPredictions] = useState([]);
  const sessionToken = useRef(Math.random().toString(36).substr(2, 10));
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Sync input with value prop
  useEffect(() => {
    if (value !== input) {
      setInput(value);
    }
  }, [value]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setIsKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setIsKeyboardVisible(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    async function fetchPredictions() {
      if (!debouncedInput.trim()) {
        setPredictions([]);
        return;
      }
      const qs = new URLSearchParams({
        input: debouncedInput,
        key: apiKey,
        sessiontoken: sessionToken.current,
        types: 'geocode',
        components: 'country:in',
        language: 'en',
      }).toString();

      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?${qs}`,
        );
        const json = await res.json();
        if (json.status === 'OK') {
          setPredictions(json.predictions || []);
        } else {
          // console.warn(
          //   'Places Autocomplete error',
          //   json.status,
          //   json.error_message,
          // );
          setPredictions([]);
        }
      } catch (err) {
        // console.error('Network error fetching places', err);
      }
    }
    fetchPredictions();
  }, [debouncedInput, apiKey]);

  // Build a concise suggestion label from prediction
  const getShortSuggestion = pred => {
    const main = pred?.structured_formatting?.main_text || '';
    const secondary = pred?.structured_formatting?.secondary_text || '';
    if (main && secondary) {
      const tail = secondary
        .split(',')
        .map(s => s.trim())
        .slice(-2)
        .join(', ');
      return tail ? `${main}, ${tail}` : main;
    }
    if (pred?.description) {
      return pred.description
        .split(',')
        .map(s => s.trim())
        .slice(-3)
        .join(', ');
    }
    return main || secondary || '';
  };

  const handleSelect = async (pred, chosenShortText) => {
    setPredictions([]);
    try {
      const qs = new URLSearchParams({
        place_id: pred.place_id,
        key: apiKey,
        sessiontoken: sessionToken.current,
        fields: 'formatted_address,geometry,address_component',
      }).toString();

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?${qs}`,
      );
      const json = await res.json();
      const result = json?.result || {};
      // Prefer concise city/state/country from components
      const components = result?.address_components || [];
      const byType = type =>
        components.find(c => (c.types || []).includes(type))?.long_name;
      const city = byType('locality') || byType('administrative_area_level_2');
      const state = byType('administrative_area_level_1');
      const pincode = byType('postal_code');
      const country = components.find(c =>
        (c.types || []).includes('country'),
      )?.short_name;

      // Enhanced pincode extraction with multiple methods
      let extractedPincode = pincode;

      // Method 1: Try different postal code types
      if (!extractedPincode) {
        const postalCodeTypes = [
          'postal_code',
          'postal_code_prefix',
          'postal_code_suffix',
        ];
        for (const type of postalCodeTypes) {
          const found = components.find(c => c.types.includes(type));
          if (found && found.long_name) {
            extractedPincode = found.long_name;
            break;
          }
        }
      }

      // Method 2: Extract from formatted address using multiple patterns
      if (!extractedPincode) {
        const formatted = result?.formatted_address || '';

        // Try different pincode patterns
        const patterns = [
          /\b\d{6}\b/g, // 6 digits
          /\b\d{5,6}\b/g, // 5-6 digits
          /pincode[:\s]*(\d{6})/i, // "pincode: 123456"
          /pin[:\s]*(\d{6})/i, // "pin: 123456"
          /(\d{6})/g, // any 6 digits
        ];

        for (const pattern of patterns) {
          const matches = formatted.match(pattern);
          if (matches && matches.length > 0) {
            // Get the first 6-digit match
            const sixDigitMatch = matches.find(match => match.length === 6);
            if (sixDigitMatch) {
              extractedPincode = sixDigitMatch;
              break;
            }
          }
        }
      }

      // Method 3: Extract from description
      if (!extractedPincode) {
        const description = pred.description || '';
        const pincodeMatch = description.match(/\b\d{6}\b/);
        if (pincodeMatch) {
          extractedPincode = pincodeMatch[0];
        }
      }

      const shortFromComponents = [city, state, country]
        .filter(Boolean)
        .join(', ');

      const formatted = result?.formatted_address || pred.description;
      const shortFromFormatted = formatted
        ?.split(',')
        .map(s => s.trim())
        .slice(-3)
        .join(', ');

      const display =
        chosenShortText ||
        shortFromComponents ||
        shortFromFormatted ||
        formatted;

      const lat = result?.geometry?.location?.lat ?? null;
      const lng = result?.geometry?.location?.lng ?? null;

      setInput(display);
      setPredictions([]);
      onPlaceSelected?.(display, pred.place_id, {
        lat,
        lng,
        result,
        Locality: display,
        city: city,
        state: state,
        pincode: extractedPincode,
      });
    } catch (e) {
      const fallback =
        chosenShortText || getShortSuggestion(pred) || pred.description;

      // Try to extract pincode from fallback description with multiple patterns
      let fallbackPincode = null;

      const fallbackPatterns = [
        /\b\d{6}\b/g, // 6 digits
        /\b\d{5,6}\b/g, // 5-6 digits
        /pincode[:\s]*(\d{6})/i, // "pincode: 123456"
        /pin[:\s]*(\d{6})/i, // "pin: 123456"
        /(\d{6})/g, // any 6 digits
      ];

      for (const pattern of fallbackPatterns) {
        const matches = fallback.match(pattern);
        if (matches && matches.length > 0) {
          const sixDigitMatch = matches.find(match => match.length === 6);
          if (sixDigitMatch) {
            fallbackPincode = sixDigitMatch;
            break;
          }
        }
      }

      setInput(fallback);
      setPredictions([]);
      onPlaceSelected?.(fallback, pred.place_id, {
        Locality: fallback,
        city: null,
        state: null,
        pincode: fallbackPincode,
      });
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.pickerWrapper,
          {
            height: hideBorder ? 45 : 55,
            borderWidth: hideBorder ? 0 : 1,
            borderColor: hideBorder ? 'transparent' : '#C7CACB',
          },
        ]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={input}
          onChangeText={setInput}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          placeholderTextColor="#BABFC7"
          keyboardType="default"
          maxLength={100}
        />
      </View>

      {predictions.length > 0 &&
        showSuggestions &&
        (isKeyboardVisible || isFocused) && (
          <FlatList
            style={styles.dropdown}
            data={predictions
              .filter(() => true)
              .reduce(
                (acc, p) => {
                  const label = (
                    getShortSuggestion(p) ||
                    p.description ||
                    ''
                  ).toLowerCase();
                  if (!acc._seen.has(label)) {
                    acc._seen.add(label);
                    acc.items.push(p);
                  }
                  return acc;
                },
                {_seen: new Set(), items: []},
              )
              .items.slice(0, 8)}
            keyExtractor={item => item.place_id}
            renderItem={({item}) => {
              const shortText = getShortSuggestion(item);
              return (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    setIsFocused(false);
                    Keyboard.dismiss(); // ✅ Dismiss the keyboard immediately
                    handleSelect(item, shortText);
                  }}>
                  <Text>{shortText || item.description}</Text>
                </TouchableOpacity>
              );
            }}
            keyboardShouldPersistTaps="always"
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {marginTop: 8},
  input: {
    paddingHorizontal: 10,
  },
  dropdown: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 4,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    height: 55,
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    marginVertical: 10,

    borderColor: '#C7CACB',
  },
});
