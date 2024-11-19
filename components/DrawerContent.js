// components/DrawerContent.js
import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';

const DrawerContent = (props) => {
    const colorScheme = useColorScheme();

    return (
        <DrawerContentScrollView
            {...props}
            style={[styles.drawerView, { backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' }]}
        >
            <View style={styles.drawerContent}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon
                            name="settings-outline"
                            color={'#fff'}
                            size={size}
                        />
                    )}
                    label="Settings"
                    labelStyle={{color: '#fff'}}
                    onPress={() => {
                        props.navigation.navigate('Home', { screen: 'Settings' });
                    }}
                    style={styles.drawerItem}

                />
            </View>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    drawerView: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    drawerItem: {
        borderRadius: 10,
        backgroundColor: '#009B72',
    },
    darkText: {
        color: '#fff',
    },
    lightText: {
        color: '#00120B',
    },
});

export default DrawerContent;