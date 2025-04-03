// app/components/Item.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, useColorScheme } from 'react-native';

const Item = ({ name, ipAddress, macAddress, color, status, isLocal, onPress, onLongPress }) => {
    const colorScheme = useColorScheme();

    const getStatusStyle = () => {
        switch (status) {
            case 'active':
                return { color: 'green', text: 'Active' };
            case 'offline':
                return { color: 'red', text: 'Offline' };
            case 'unknown':
            default:
                return { color: 'grey', text: 'Unknown' };
        }
    };

    const { color: statusColor, text: statusText} = getStatusStyle();

    return (
        <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
                styles.item,
                colorScheme === 'dark' ? styles.darkItem : styles.lightItem,
            ]}
        >
            <View style={[styles.colorCircle, { backgroundColor: color }]} />
            <View style={styles.textContainer}>
                <Text style={[styles.name, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                    {name}
                </Text>
                <Text style={[styles.subText, colorScheme === 'dark' ? styles.darkSubText : styles.lightSubText]}>
                    IP: {ipAddress}
                </Text>
                <Text style={[styles.subText, colorScheme === 'dark' ? styles.darkSubText : styles.lightSubText]}>
                    MAC: {macAddress}
                </Text>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusIcon, { backgroundColor: statusColor }]} />
                    <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
                    <Text style={[styles.localText]}>{ isLocal ? 'Local' : 'API'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        padding: 20,
        marginVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
    },
    darkItem: {
        backgroundColor: '#333',
    },
    lightItem: {
        backgroundColor: '#f0f0f0',
    },
    colorCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    darkText: {
        color: '#fff',
    },
    lightText: {
        color: '#00120B',
    },
    subText: {
        fontSize: 14,
    },
    darkSubText: {
        color: '#ccc',
    },
    lightSubText: {
        color: '#555',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    statusIcon: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    statusText: {
        fontSize: 14,
    },
    localText: {
        fontSize: 14,
        color: 'green',
        marginLeft: 10,
        borderRadius: 5,
        borderColor: 'green',
        borderWidth: 1,
        padding: 2,
    },
});

export default Item;