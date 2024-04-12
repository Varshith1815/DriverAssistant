import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Modal, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { signOut, sendPasswordResetEmail, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

const Settings = ({onSignOut}) => {
    const [isCrashDetectionEnabled, setIsCrashDetectionEnabled] = useState(false);
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [userFullName, setUserFullName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userDocId, setUserDocId] = useState(null);


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
                        const data = doc.data();
                        setUserFullName(`${data.firstName} ${data.lastName}`);
                        setFirstName(data.firstName);
                        setLastName(data.lastName);
                        setUserDocId(doc.id);
                    });
                } catch (error) {
                    console.error(error);
                    Alert.alert("Error fetching user data");
                }
            }
        };

        fetchUserData();
    }, [auth.currentUser]);

    const handleUpdateDetails = async () => {
        if (userDocId) {
            const userRef = doc(db, "users", userDocId);
            try {
                await updateDoc(userRef, {
                    firstName: firstName,
                    lastName: lastName
                });
                setUserFullName(`${firstName} ${lastName}`);
                setModalVisible(false);
            } catch (error) {
                console.error(error);
                Alert.alert("Error updating user data");
            }
        }
    };

    const handlePasswordChange = async () => {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, oldPassword);

        reauthenticateWithCredential(user, credential).then(() => {
            updatePassword(user, newPassword).then(() => {
                Alert.alert("Success", "Password has been updated successfully.");
                setPasswordModalVisible(false);
            }).catch(error => {
                Alert.alert("Error", error.message);
            });
        }).catch(error => {
            Alert.alert("Error", "The old password is incorrect.");
        });
    };

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
            <Text style={styles.title}>Settings</Text>

            <TouchableOpacity style={styles.item} onPress={() => setIsProfileVisible(!isProfileVisible)}>
                <Ionicons name="person-circle" size={24} color="white" style={styles.icon} />
                <Text style={styles.itemText}>Profile</Text>
                <Ionicons name={isProfileVisible ? "chevron-up" : "chevron-forward"} size={24} color="white" style={styles.iconRight} />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={passwordModalVisible}
                onRequestClose={() => setPasswordModalVisible(!passwordModalVisible)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Old Password"
                            secureTextEntry
                            value={oldPassword}
                            onChangeText={setOldPassword}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="New Password"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Cancel" onPress={() => setPasswordModalVisible(false)} />
                            <Button title="Change Password" onPress={handlePasswordChange} />
                        </View>
                    </View>
                </View>
            </Modal>

            {isProfileVisible && (
                <View style={styles.dropdownContent}>
                    <Text style={styles.dropdownText}>Full Name: {userFullName}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Text style={styles.dropdownLinkText}>Edit Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setPasswordModalVisible(true)}>
                        <Text style={styles.dropdownLinkText}>Change Password</Text>
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.modalText}
                            placeholder="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <TextInput
                            style={styles.modalText}
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        <Button
                            title="Apply"
                            onPress={() => handleUpdateDetails()}
                        />
                        <Button
                            title="Cancel"
                            onPress={() => setModalVisible(!modalVisible)}
                        />
                    </View>
                </View>
            </Modal>
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalInput: {
        width: '100%',
        padding: 10,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default Settings;