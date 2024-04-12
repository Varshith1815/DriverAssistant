import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore';

const Settings = ({onSignOut}) => {
    const [isCrashDetectionEnabled, setIsCrashDetectionEnabled] = useState(false);
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [userFullName, setUserFullName] = useState('');

    const auth = FIREBASE_AUTH;
    const db = FIREBASE_DB;

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("uid", "==", auth.currentUser.uid));

                try {
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        const data = doc.data();
                        setUserFullName(`${data.firstName} ${data.lastName}`);
                    });
                } catch (error) {
                    console.error(error);
                    Alert.alert("Error fetching user data");
                }
            }
        };

        fetchUserData();
    }, [auth.currentUser]);

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
            await sendPasswordResetEmail(auth, auth.currentUser.email);
            Alert.alert('Reset Email Sent', 'Please check your email to reset your password.');
        } catch (error) {
            console.error('Error sending password reset email:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <TouchableOpacity style={styles.item} onPress={() => setIsProfileVisible(!isProfileVisible)}>
                <Ionicons name="person-circle" size={24} color="white" style={styles.icon} />
                <Text style={styles.itemText}>Profile</Text>
                <Ionicons name={isProfileVisible ? "chevron-up" : "chevron-forward"} size={24} color="white" style={styles.iconRight} />
            </TouchableOpacity>

            {isProfileVisible && (
                <View style={styles.dropdownContent}>
                    <Text style={styles.dropdownText}>Full Name: {userFullName}</Text>
                    {/* Display additional user data if needed */}
                    <TouchableOpacity onPress={() => {/* Navigate to Edit Profile logic here */}}>
                        <Text style={styles.dropdownLinkText}>Edit Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePasswordReset}>
                        <Text style={styles.dropdownLinkText}>Reset Password</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity style={styles.item}>
                <Ionicons name="call" size={24} color="white" style={styles.icon} />
                <Text style={styles.itemText}>Emergency Contact(s)</Text>
                <Ionicons name="chevron-forward" size={24} color="white" style={styles.iconRight} />
            </TouchableOpacity>

            <View style={styles.item}>
                <Ionicons name="car" size={24} color="white" style={styles.icon} />
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
        backgroundColor: '#0f0c29',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
        color: 'white',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#212121',
        borderBottomWidth: 1,
        borderBottomColor: '#414141',
    },
    itemText: {
        flex: 1,
        fontSize: 18,
        marginLeft: 10,
        color: 'white',
    },
    icon: {
        color: 'white',
    },
    iconRight: {
        color: 'white',
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
        color: 'white',
    },
    logoutButtonText: {
        fontSize: 18,
        color: 'white',
        marginLeft: 10,
    },
    dropdownContent: {
        backgroundColor: '#333',
        padding: 10,
        marginHorizontal: 20,
        borderRadius: 5,
    },
    dropdownText: {
        fontSize: 16,
        marginVertical: 5,
        color: 'white',
    },
    dropdownLinkText: {
        fontSize: 16,
        color: '#1e90ff',
        marginVertical: 5,
    },
});

export default Settings;
