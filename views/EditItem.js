// app/views/EditItem.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColorPickerComponent from '../components/ColorPicker';
import { CommonActions } from '@react-navigation/native';

const EditItem = ({ route, navigation }) => {
    const { item } = route.params;
    const [name, setName] = useState(item.name);
    const [ipAddress, setIpAddress] = useState(item.ipAddress);
    const [macAddress, setMacAddress] = useState(item.macAddress);
    const [color, setColor] = useState(item.color);
    const colorScheme = useColorScheme();

    const saveItem = async () => {
        const updatedItem = { ...item, name, ipAddress, macAddress, color };
        try {
            const storedData = await AsyncStorage.getItem('items');
            const items = storedData ? JSON.parse(storedData) : [];
            const newData = items.map(i => (i.id === item.id ? updatedItem : i));
            await AsyncStorage.setItem('items', JSON.stringify(newData));
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Machines' }],
                })
            );
        } catch (error) {
            console.error('Failed to save item to storage', error);
        }
    };

    return (
        <View style={[styles.container, colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
            <TextInput
                style={[styles.input, colorScheme === 'dark' ? styles.darkInput : styles.lightInput]}
                placeholder="Name"
                placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#888'}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={[styles.input, colorScheme === 'dark' ? styles.darkInput : styles.lightInput]}
                placeholder="IP Address"
                placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#888'}
                value={ipAddress}
                onChangeText={setIpAddress}
            />
            <TextInput
                style={[styles.input, colorScheme === 'dark' ? styles.darkInput : styles.lightInput]}
                placeholder="MAC Address"
                placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#888'}
                value={macAddress}
                onChangeText={setMacAddress}
            />
            <ColorPickerComponent initialColor={color} onColorSelected={setColor} />
            <TouchableOpacity style={styles.saveButton} onPress={saveItem}>
                <Text style={styles.saveButtonText}>Save Item</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    saveButton: {
        backgroundColor: '#009B72',
        borderRadius: 10,
    },
    saveButtonText: {
        color: '#fff',
        textAlign: 'center',
        padding: 10,
        fontSize: 16,
        fontWeight : 'bold',
    },
    darkContainer: {
        backgroundColor: '#00120B',
    },
    lightContainer: {
        backgroundColor: '#fff',
    },
    input: {
        height: 40,
        borderWidth: 1,
        marginBottom: 12,
        borderRadius: 10,
        paddingHorizontal: 8,
    },
    darkInput: {
        borderColor: '#555',
        color: '#fff',
    },
    lightInput: {
        borderColor: 'gray',
        color: '#00120B',
    },
});

export default EditItem;