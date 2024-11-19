// app/views/ItemList.js
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Text, Alert, TextInput, useColorScheme, StatusBar, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Item from '../components/Item';
import Icon from 'react-native-vector-icons/Ionicons';
import Notification from '../components/Notification';

const ItemList = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const colorScheme = useColorScheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('items');
                if (storedData) {
                    const items = JSON.parse(storedData);
                    setData(JSON.parse(storedData));
                    setFilteredData(items);
                }
            } catch (error) {
                console.error('Failed to load items from storage', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.macAddress.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [searchQuery, data]);
    
    const fetchStatusData = async () => {
        try {
            const apiEndpoint = await AsyncStorage.getItem('apiEndpoint');
            if (!apiEndpoint) {
                Alert.alert('Error', 'API endpoint is not set.');
                return;
            }

            const updatedData = await Promise.all(data.map(async (item) => {
                try {
                    const url = `${apiEndpoint}/WOL/status?MAC_ADDRESS=${item.macAddress}&IP_ADDRESS=${item.ipAddress}`;
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.text();
                    const status = result.trim() === 'true' ? 'active' : 'offline';
                    return { ...item, status };
                } catch (error) {
                    return { ...item, status: 'unknown' };
                }
            }));


            setData(updatedData);
            setFilteredData(updatedData);
        } catch (error) {
            console.error('Failed to fetch status data from API', error);
            Alert.alert('Error', 'Failed to fetch status data from API.');
        }
    };

    useEffect(() => {
        setInterval(fetchStatusData, 30000); // Fetch every 5 seconds
    }, [data]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchStatusData().then(() => setRefreshing(false));
    }, [data]);

    const handleItemPress = async (item) => {
        try {
            const apiEndpoint = await AsyncStorage.getItem('apiEndpoint');
            if (!apiEndpoint) {
                Alert.alert('Error', 'API endpoint is not set.');
                return;
            }

            const response = await fetch(`${apiEndpoint}/WOL/wake?MAC_ADDRESS=${item.macAddress}&IP_ADDRESS=${item.ipAddress}`);
            const result = await response.text();

            if (response.status !== 200) {
                Alert.alert('API Response', result);
            } else {
                setNotification(`${item.name} waking up.`);
            }
        } catch (error) {
            console.log (error);
            if (error.message === 'Network request failed') {
                Alert.alert('Error', 'Failed to fetch data from API. Check your network connection.');
            } else {
            Alert.alert('Error', 'Failed to fetch data from API.');
            }
        }
    };

    const handleItemLongPress = (item) => {
        Alert.alert(
            'Edit or Delete Machine',
            `What would you like to do with ${item.name}?`,
            [
                {
                    text: 'Edit',
                    onPress: () => navigation.navigate('Edit Machine', { item }),
                },
                {
                    text: 'Delete',
                    onPress: () => deleteItem(item.id),
                    style: 'destructive',
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    const deleteItem = async (id) => {
        const newData = data.filter(item => item.id !== id);
        setData(newData);
        try {
            await AsyncStorage.setItem('items', JSON.stringify(newData));
        } catch (error) {
            console.error('Failed to delete item from storage', error);
        }
    };

    const renderItem = ({ item }) => (
        <Item
            name={item.name}
            ipAddress={item.ipAddress}
            macAddress={item.macAddress}
            color={item.color}
            status={item.status}
            onPress={() => handleItemPress(item)}
            onLongPress={() => handleItemLongPress(item)}
        />
    );

    return (
        <View style={[styles.container, colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Add Machine')}>
                <Text style={styles.addButtonText}>Add Machine</Text>
            </TouchableOpacity>
            <View style={[styles.searchContainer, colorScheme === 'dark' ? styles.darkSearchContainer : styles.lightSearchContainer]}>
                <Icon name="search" size={20} color={colorScheme === 'dark' ? '#ccc' : '#888'} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, colorScheme === 'dark' ? styles.darkSearchInput : styles.lightSearchInput]}
                    placeholder="Search..."
                    placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#888'}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colorScheme === 'dark' ? '#fff' : '#000']}
                        progressBackgroundColor={colorScheme === 'dark' ? '#444' : '#f0f0f0'}
                    />
                }
            />
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
        padding: 10,
    },
    addButton: {
        backgroundColor: '#009B72',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    addButtonText: {
        color: '#fff',
        textAlign: 'center',
        padding: 10,
        fontSize: 16,
        fontWeight : 'bold',
    },
        darkSearchInput: {
        color: '#fff',
    },
    lightSearchInput: {
        color: '#00120B',
    },
    darkContainer: {
        backgroundColor: '#00120B',
    },
    lightContainer: {
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    darkSearchContainer: {
        backgroundColor: '#333',
    },
    lightSearchContainer: {
        backgroundColor: '#f0f0f0',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    darkSearchInput: {
        color: '#fff',
    },
    lightSearchInput: {
        color: '#00120B',
    },
});

export default ItemList;