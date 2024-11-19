// views/Settings.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Notification from '../components/Notification';

const Settings = () => {
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [notification, setNotification] = useState(null);
    const colorScheme = useColorScheme();

    useEffect(() => {
        const loadApiEndpoint = async () => {
            try {
                const storedEndpoint = await AsyncStorage.getItem('apiEndpoint');
                if (storedEndpoint) {
                    setApiEndpoint(storedEndpoint);
                }
            } catch (error) {
                console.error('Failed to load API endpoint from storage', error);
            }
        };

        loadApiEndpoint();
    }, []);

    const saveApiEndpoint = async () => {
        try {
            await AsyncStorage.setItem('apiEndpoint', apiEndpoint);
            // alert('API endpoint saved successfully');
            setNotification('API endpoint saved successfully');
        } catch (error) {
            console.error('Failed to save API endpoint to storage', error);
        }
    };

    return (
        <View style={[styles.container, colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
            <Text style={[styles.label, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>API Endpoint</Text>
            <TextInput
                style={[styles.input, colorScheme === 'dark' ? styles.darkInput : styles.lightInput]}
                placeholder="http://192.168.1.100:8080"
                placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#888'}
                value={apiEndpoint}
                onChangeText={setApiEndpoint}
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveApiEndpoint}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            {notification && (
                <Notification
                    message={notification}
                    onDismiss={() => setNotification(null)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    darkContainer: {
        backgroundColor: '#00120B',
    },
    lightContainer: {
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    darkText: {
        color: '#fff',
    },
    lightText: {
        color: '#000',
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
        color: '#000',
    },
    saveButton: {
        backgroundColor: '#009B72', // Change this to your desired color
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Settings;