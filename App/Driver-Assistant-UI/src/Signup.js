import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator, KeyboardAvoidingView, ImageBackground, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';

const Signup = ({ onSignUpSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [emergencyContacts, setEmergencyContacts] = useState([{ name: '', contactNumber: '', email: '' }]);

    const handleAddEmergencyContact = () => {
        if (emergencyContacts.length < 2) {
            setEmergencyContacts([...emergencyContacts, { name: '', contactNumber: '', email: '' }]);
        }
    };

    const handleEmergencyContactChange = (text, index, field) => {
        const updatedContacts = emergencyContacts.map((contact, idx) => {
            if (idx === index) {
                return { ...contact, [field]: text };
            }
            return contact;
        });
        setEmergencyContacts(updatedContacts);
    };

    const signUp = async () => {
        setLoading(true);
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            setLoading(false);
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            const user = userCredential.user;
            // Store additional user information in Firestore
            await addDoc(collection(FIREBASE_DB, 'users'), {
                uid: user.uid,
                email,
                firstName,
                lastName,
                emergencyContacts: emergencyContacts.filter(contact => contact.name !== ''),
                points: 0,
            });
            onSignUpSuccess();
        } catch (error) {
            console.log(error);
            alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled >
      <ImageBackground source={require('../assets/Designer.png')} style={styles.backgroundImage}>
      {/* <Image source={require('../assets/AppLogo.jpg')} style={styles.logo} /> */}
        <ScrollView contentContainerStyle={styles.inputContainer}>
            {/* <Text>Create Account</Text> */}
            <TextInput style={styles.input} placeholder="First Name" onChangeText={setFirstName} value={firstName} />
            <TextInput style={styles.input} placeholder="Last Name" onChangeText={setLastName} value={lastName} />
            <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={setEmail} value={email} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
            <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry onChangeText={setConfirmPassword} value={confirmPassword} />

            {emergencyContacts.map((contact, index) => (
                <View key={index}>
                    <TextInput style={styles.input} placeholder="Emergency Contact Name" onChangeText={(text) => handleEmergencyContactChange(text, index, 'name')} value={contact.name} />
                    <TextInput style={styles.input} placeholder="Emergency Contact Number" onChangeText={(text) => handleEmergencyContactChange(text, index, 'contactNumber')} value={contact.contactNumber} />
                    <TextInput style={styles.input} placeholder="Emergency Contact Email" autoCapitalize="none" onChangeText={(text) => handleEmergencyContactChange(text, index, 'email')} value={contact.email} />
                </View>
            ))}
            {/* <TouchableOpacity onPress={handleAddEmergencyContact} style={styles.button}>
                <Text style={styles.buttonText}>Add Emergency Contact</Text>
            </TouchableOpacity> */}

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator}/>
            ) : (
                <TouchableOpacity onPress={signUp} style={styles.button}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
        </ImageBackground>
    </KeyboardAvoidingView>
    );
};

export default Signup;

const styles = StyleSheet.create({
    // container: {
    //     padding: 20,
    // },
    container: {
        flex: 1,
      },
      backgroundImage: {
        flex: 1,
        resizeMode: 'cover', 
      },
      logo: {
        width: 175,
        height: 175,
        alignSelf: 'center',
       marginTop: 100,
      },
      inputContainer: {
        // flexGrow: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', 
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        marginTop: 20, 
        marginBottom: 20, 
        marginHorizontal: 20,
      },
      input: {
        marginVertical: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#f5f5f5', 
      },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 10,
        marginVertical: 10,
        paddingVertical: 12,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
      },
      loadingIndicator: {
        marginTop: 20,
      },
});
