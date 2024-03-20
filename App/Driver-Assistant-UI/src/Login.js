import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ActivityIndicator, KeyboardAvoidingView,ImageBackground, Image } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebaseConfig';

const Login = ({ onLogin }) => { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLogin(); 
        } catch (error) {
            console.log(error);
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            onLogin(); 
            alert('Please check your Inbox');
        } catch (error) {
            console.log(error);
            alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled >
      <ImageBackground source={require('../assets/Designer.png')} style={styles.backgroundImage}>
      <Image source={require('../assets/AppLogo.jpg')} style={styles.logo} />
        <View style={styles.inputContainer}>
          {/* <KeyboardAvoidingView behavior="padding" enabled> */}
            <TextInput 
            value={email} 
            style={styles.input} 
            placeholder="Email" 
            autoCapitalize="none" 
            onChangeText={(text) => setEmail(text)} />
            <TextInput 
            secureTextEntry={true}
             value={password} 
             style={styles.input} 
             placeholder="Password" 
             autoCapitalize="none" 
             onChangeText={(text) => setPassword(text)} />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator}/>
            ) : (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={signIn}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={signUp}>
                        <Text style={styles.buttonText}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            )}
          {/* </KeyboardAvoidingView> */}
        </View>
        </ImageBackground>
    </KeyboardAvoidingView>
    );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    marginTop: 'auto', 
    marginBottom: 'auto', 
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
   // marginTop: 100,
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