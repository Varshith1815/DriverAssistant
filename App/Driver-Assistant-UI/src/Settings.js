import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';

const Settings = ({onSignOut}) => {
    const [isCrashDetectionEnabled, setIsCrashDetectionEnabled] = useState(false);
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    // Placeholder for user data, replace with your state management logic
    const userData = { email: 'user@example.com', username: 'User123', points: 1000 }; // Replace with actual user data

    const auth = FIREBASE_AUTH;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            onSignOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, userData.email);
            Alert.alert('Reset Email Sent', 'Please check your email to reset your password.');
        } catch (error) {
            console.error('Error sending password reset email:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <View style={styles.item}>
                <Ionicons name="person-circle" size={24} color="black" style={styles.icon} />
                <Text style={styles.itemText}>{userData.username || "User Name"}</Text>
            </View>

            <TouchableOpacity style={styles.item} onPress={() => setIsProfileVisible(!isProfileVisible)}>
                <Text style={styles.itemText}>Profile</Text>
                <Ionicons name={isProfileVisible ? "chevron-up" : "chevron-forward"} size={24} color="black" style={styles.iconRight} />
            </TouchableOpacity>

            {isProfileVisible && (
                <View style={styles.dropdownContent}>
                    <Text style={styles.dropdownText}>Username: {userData.username}</Text>
                    <Text style={styles.dropdownText}>Points: {userData.points}</Text>
                    <TouchableOpacity onPress={() => {/* Navigate to Edit Profile logic here */}}>
                        <Text style={styles.dropdownLinkText}>Edit Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePasswordReset}>
                        <Text style={styles.dropdownLinkText}>Reset Password</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity style={styles.item}>
                <Text style={styles.itemText}>Emergency Contact(s)</Text>
                <Ionicons name="chevron-forward" size={24} color="black" style={styles.iconRight} />
            </TouchableOpacity>

            <View style={styles.item}>
                <Text style={styles.itemText}>Crash Detection</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isCrashDetectionEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => setIsCrashDetectionEnabled(previousState => !previousState)}
                    value={isCrashDetectionEnabled}
                />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out" size={24} color="white" style={styles.icon} />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#0f0c29', // Assuming a dark theme background color
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
        color: 'white', // Assuming white color for text to contrast with dark background
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#212121', // Darker shade for item background
        borderBottomWidth: 1,
        borderBottomColor: '#414141', // Slightly lighter shade for the bottom border
    },
    itemText: {
        flex: 1,
        fontSize: 18,
        marginLeft: 10,
        color: 'white', // White color for the text
    },
    icon: {
        width: 30,
        color: 'white', // Assuming white color for icons
    },
    iconRight: {
        color: 'white', // White color for arrow icons
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: 'red',
        borderRadius: 4,
        marginHorizontal: 50,
        marginTop: 10,
    },
    logoutButtonText: {
        fontSize: 18,
        color: 'white', // White color for the text on logout button
        marginLeft: 10,
    },
    dropdownContent: {
        backgroundColor: '#333', // Slightly lighter shade for dropdown content
        padding: 10,
        marginHorizontal: 20,
        borderRadius: 5,
        borderBottomWidth: 0, // No bottom border for dropdown content
    },
    dropdownText: {
        fontSize: 16,
        marginVertical: 5,
        color: 'white', // White color for dropdown text
    },
    dropdownLinkText: {
        fontSize: 16,
        color: '#1e90ff', // Highlight color for links (like a light blue)
        marginVertical: 5,
    },
});

export default Settings;
