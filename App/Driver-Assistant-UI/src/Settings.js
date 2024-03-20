// Settings.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Settings = () => {
    const [isCrashDetectionEnabled, setIsCrashDetectionEnabled] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>        </Text>

            <View style={styles.item}>
                <Ionicons name="person-circle" size={24} color="black" style={styles.icon} />
                <Text style={styles.itemText}>User Name</Text>
            </View>

            <TouchableOpacity style={styles.item}>
                <Text style={styles.itemText}>Profile</Text>
                <Ionicons name="chevron-forward" size={24} color="black" style={styles.iconRight} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
                <Text style={styles.itemText}>Emergency Contact(s)</Text>
                <Ionicons name="chevron-forward" size={24} color="black" style={styles.iconRight} />
            </TouchableOpacity>

            <View style={styles.item}>
                <Text style={styles.itemText}>Crash Detection</Text>
                <Switch
                    trackColor={{ false: "#ff0000", true: "#00ff00" }}
                    thumbColor={isCrashDetectionEnabled ? "#ffffff" : "#ffffff"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => setIsCrashDetectionEnabled(previousState => !previousState)}
                    value={isCrashDetectionEnabled}
                />
            </View>

            <TouchableOpacity style={styles.logoutButton}>
                <Ionicons name="log-out" size={24} color="black" style={styles.icon} />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'white', // Added white background for consistency
    },
    itemText: {
        flex: 1,
        fontSize: 18,
        marginLeft: 10,
        color: 'black',
    },
    icon: {
        width: 30, // Adjust the width if necessary
    },
    iconRight: {
        marginLeft: 'auto', // Pushes the icon to the right side
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: 'red', // Set background color to red
        borderRadius: 4, // Optional: if you want rounded corners
        marginHorizontal: 50, // Adjust as needed for spacing
        marginTop: 10, // Adjust as needed for spacing
    },
    logoutButtonText: {
        fontSize: 18,
        color: 'black', // Set text color to black
        marginLeft: 10,
    },
});

export default Settings;
