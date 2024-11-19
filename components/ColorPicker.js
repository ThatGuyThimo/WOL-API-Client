// app/components/ColorPicker.js
import React, { useState } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, StatusBar, useColorScheme } from 'react-native';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';

const ColorPickerComponent = ({ initialColor, onColorSelected }) => {
    const [showModal, setShowModal] = useState(false);
    const [color, setColor] = useState(initialColor || '#ffffff');
    const colorScheme = useColorScheme();

    const onSelectColor = ({ hex }) => {
        setColor(hex);
        onColorSelected(hex);
    };

    return (
        <View style={styles.container}>
            <View style={[styles.colorPreview,  colorScheme === 'dark' ? styles.darkPreview : styles.lightPreview, { backgroundColor: color}]} />
            <TouchableOpacity style={styles.saveButton} onPress={() => setShowModal(true)}>
                <Text style={styles.saveButtonText}>Select Color</Text>
            </TouchableOpacity>
            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowModal(false)}
            >
                <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, colorScheme === 'dark' ? styles.darkModalContent : styles.lightModalContent]}>
                        <Text style={[styles.modalTitle, colorScheme === 'dark' ? styles.darkModalTitle : styles.lightModalTitle]}>Pick a Color</Text>
                        <ColorPicker
                            style={styles.colorPicker}
                            value={color}
                            onComplete={onSelectColor}
                        >
                            <Preview />
                            <View style={styles.spacing}>
                                <Panel1 />
                            </View>
                            <View style={styles.spacing}>
                                <HueSlider />
                            </View>
                            <View style={styles.spacing}>
                                <OpacitySlider />
                            </View>
                            <Swatches />
                        </ColorPicker>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.saveButton} onPress={() => setShowModal(false)}>
                                <Text style={styles.saveButtonText}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    colorPreview: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        marginBottom: 15,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    darkModalContent: {
        backgroundColor: '#333',
    },
    lightModalContent: {
        backgroundColor: '#fff',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    darkModalTitle: {
        color: '#fff',
    },
    lightModalTitle: {
        color: '#00120B',
    },
    darkPreview: {
        borderColor: '#555',
    },
    lightPreview: {
        borderColor: 'gray',
    },
    colorPicker: {
        width: '100%',
        marginBottom: 20,
    },
    spacing: {
        marginVertical: 10,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 10,
        paddingHorizontal: 20,
    },
});

export default ColorPickerComponent;