// app/views/CreateItem.js
import React, { useState } from 'react';
import { StyleSheet, TextInput, View, useColorScheme, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColorPickerComponent from '../components/ColorPicker';
import { CommonActions } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';

const CreateItem = ({ navigation }) => {
    const [name, setName] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [macAddress, setMacAddress] = useState('');
    const [color, setColor] = useState('');
    const [isLocal, setLocal] = useState(false);
    const colorScheme = useColorScheme();

    const saveItem = async () => {
        const newItem = { id: Date.now().toString(), name, ipAddress, macAddress, color, isLocal };
        try {
            const storedData = await AsyncStorage.getItem('items');
            const items = storedData ? JSON.parse(storedData) : [];
            const newData = [...items, newItem];
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
            <View style={styles.checkboxContainer}>
                <Text style={[styles.checkboxLabel, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                    Local Machine
                </Text>
                <Checkbox
                    // style={styles.checkboxContainer}
                    value={isLocal}
                    onValueChange={setLocal}
                    color={isLocal ? '#009B72' : undefined}
                />
            </View>
            <ColorPickerComponent onColorSelected={setColor} />
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkboxLabel: {
        marginRight: 8,
        fontSize: 16,
    },
    darkText: {
        color: '#fff',
    },
    lightText: {
        color: '#00120B',
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
        paddingHorizontal: 8,
        borderRadius: 10,
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

export default CreateItem;