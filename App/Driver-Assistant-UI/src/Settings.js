import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { signOut } from 'firebase/auth'; 
const Settings = ({onSignOut}) => {
    const [isCrashDetectionEnabled, setIsCrashDetectionEnabled] = useState(false);
    const auth = FIREBASE_AUTH;
    const handleLogout = async () => {
        try {
            await signOut(auth);
          onSignOut();
        } catch (error) {
          console.error('Error signing out:', error);
        }
      };

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

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
        backgroundColor: 'white',
    },
    itemText: {
        flex: 1,
        fontSize: 18,
        marginLeft: 10,
        color: 'black',
    },
    icon: {
        width: 30,
    },
    iconRight: {
        marginLeft: 'auto',
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
        color: 'black',
        marginLeft: 10,
    },
});

export default Settings;