import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import RNDateTimePicker from '@react-native-community/datetimepicker';

const DateTimePicker = ({style, placeholder, value, setValue }) => {
    const [dateOpen, setDateOpen] = useState(false);

    return (
        <>
            <TouchableOpacity onPress={() => setDateOpen(true)} style={style}>
                <Text style={{ color: value ? '#000' : '#999' }}>
                    {value ? value : placeholder || 'Select Date'}
                </Text>
            </TouchableOpacity>

            {dateOpen && <RNDateTimePicker
                value={new Date(value || Date.now())}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                    if (event.type === 'set') {
                        setValue(selectedDate.toISOString().split('T')[0])
                    }
                    setDateOpen(false);
                }} />}
        </>
    )
}

export default DateTimePicker

const styles = StyleSheet.create({})