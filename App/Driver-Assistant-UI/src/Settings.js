import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Button,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";
import {
  signOut,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

const Settings = ({ onSignOut }) => {
  const [isCrashDetectionEnabled, setIsCrashDetectionEnabled] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [userFullName, setUserFullName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userDocId, setUserDocId] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const touchableOpacityValue = 0.5;

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
            setEmail(data.email);
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
      setLoadingUpdate(true);
      try {
        await updateDoc(userRef, {
          firstName: firstName,
          lastName: lastName,
        });
        setUserFullName(`${firstName} ${lastName}`);
        setModalVisible(false);
      } catch (error) {
        console.error(error);
        Alert.alert("Error updating user data");
      } finally {
        setLoadingUpdate(false);
      }
    }
  };

  const handlePasswordChange = async () => {
    setLoadingPassword(true);
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, oldPassword);

    reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, newPassword)
          .then(() => {
            Alert.alert("Success", "Password has been updated successfully.");
            setPasswordModalVisible(false);
          })
          .catch((error) => {
            Alert.alert("Error", error.message);
          });
      })
      .catch((error) => {
        Alert.alert("Error", "The old password is incorrect.");
      })
      .finally(() => {
        setLoadingPassword(false);
      });
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      await signOut(auth);
      onSignOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userHeader}>
        <Ionicons
          name="person-circle"
          size={108}
          color="white"
          style={styles.userIcon}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{userFullName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
      </View>

      <View style={styles.itemTitle}>
        <Text style={styles.itemTitleText}>PROFILE</Text>
      </View>

      <TouchableOpacity
        style={styles.item}
        onPress={() => setModalVisible(true)}
        activeOpacity={touchableOpacityValue}
      >
        <Ionicons name="create" size={24} color="white" style={styles.icon} />
        <Text style={styles.itemText}>Edit Name</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="white"
          style={styles.iconRight}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => setPasswordModalVisible(true)}
        activeOpacity={touchableOpacityValue}
      >
        <Ionicons name="key" size={24} color="white" style={styles.icon} />
        <Text style={styles.itemText}>Change Password</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="white"
          style={styles.iconRight}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        activeOpacity={touchableOpacityValue}
      >
        <Ionicons name="call" size={24} color="white" style={styles.icon} />
        <Text style={styles.itemText}>Emergency Contact(s)</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="white"
          style={styles.iconRight}
        />
      </TouchableOpacity>

      <View style={styles.itemTitle}>
        <Text style={styles.itemTitleText}>PREFERENCE</Text>
      </View>

      <TouchableOpacity
        style={styles.item}
        activeOpacity={touchableOpacityValue}
      >
        <Ionicons
          name="notifications"
          size={24}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.itemText}>Notifications</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="white"
          style={styles.iconRight}
        />
      </TouchableOpacity>

      <View style={styles.item}>
        <Ionicons name="car" size={24} color="white" style={styles.icon} />
        <Text style={styles.itemText}>Crash Detection</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isCrashDetectionEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() =>
            setIsCrashDetectionEnabled((previousState) => !previousState)
          }
          value={isCrashDetectionEnabled}
        />
      </View>

      <View style={styles.itemTitle}>
        <Text style={styles.itemTitleText}>HELP & SECURITY</Text>
      </View>

      <TouchableOpacity
        style={styles.item}
        activeOpacity={touchableOpacityValue}
      >
        <Ionicons
          name="lock-closed"
          size={24}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.itemText}>Privacy & Security</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="white"
          style={styles.iconRight}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        activeOpacity={touchableOpacityValue}
      >
        <Ionicons
          name="help-circle"
          size={24}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.itemText}>Ask a Question</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="white"
          style={styles.iconRight}
        />
      </TouchableOpacity>

      {loadingLogout ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons
            name="log-out"
            size={24}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(!passwordModalVisible)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.centeredView}
        >
          <View style={styles.modalView}>
            <TextInput
              style={styles.modalInput}
              placeholder="Old Password"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor="#999"
            />
            {loadingPassword ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <View style={styles.buttonContainer}>
                <Button
                  title="Cancel"
                  onPress={() => setPasswordModalVisible(false)}
                />
                <Button
                  title="Change Password"
                  onPress={handlePasswordChange}
                />
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.centeredView}
        >
          <View style={styles.modalView}>
            <TextInput
              style={styles.modalText}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.modalText}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#999"
            />
            {loadingUpdate ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <View style={styles.buttonContainer}>
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(!modalVisible)}
                />
                <Button title="Apply" onPress={() => handleUpdateDetails()} />
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 50,
    backgroundColor: "#0f0c29",
    // backgroundColor: '#212121',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
    color: "white",
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 0,
    paddingHorizontal: 25,
    // backgroundColor: '#212121',
    // borderBottomWidth: 1,
    // borderBottomColor: '#414141',
  },
  userDetails: {
    flexDirection: "column",
  },
  userName: {
    // flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "white",
    margin: 3,
  },
  userEmail: {
    // flex: 1,
    fontSize: 14,
    marginLeft: 10,
    color: "white",
    margin: 3,
  },
  userIcon: {
    // width: 48,
    // height: 48,
    // marginRight: 4,
    // margin: 20,
  },
  itemTitle: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 8,
    paddingHorizontal: 30,
    // backgroundColor: '#212121',
    // borderBottomWidth: 1,
    // borderBottomColor: '#414141',
  },
  itemTitleText: {
    flex: 1,
    fontSize: 14,
    // marginLeft: 10,
    color: "white",
    fontFamily: "Montserrat_400Regular",
    // fontFamily: 'Mon'
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
    // backgroundColor: '#212121',
    borderBottomWidth: 1,
    borderBottomColor: "#414141",
  },
  itemText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    color: "white",
  },
  icon: {
    color: "white",
  },
  iconRight: {
    color: "white",
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#D70040",
    borderRadius: 4,
    marginHorizontal: 50,
    // margin: 30,
    marginVertical: 30,
    color: "white",
  },
  logoutButtonText: {
    fontSize: 16,
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
  },
  dropdownContent: {
    backgroundColor: "#333",
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: 16,
    marginVertical: 5,
    color: "white",
  },
  dropdownLinkText: {
    fontSize: 16,
    color: "#1e90ff",
    marginVertical: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#212121",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "85%",
  },
  modalInput: {
    width: "100%",
    padding: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#323232",
    color: "white",
    borderRadius: 5,
  },
  modalText: {
    width: "100%",
    padding: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#323232",
    color: "white",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#757575",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});

export default Settings;
