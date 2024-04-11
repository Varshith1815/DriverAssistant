import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { doc, onSnapshot, collection } from 'firebase/firestore';

const Leaderboard = () => {
  const [usersData, setUsersData] = useState([]); 
  const db = FIREBASE_DB;


  useEffect(() => {
    const usersCollection = collection(db, "users"); 
        const unsubscribe = onSnapshot(usersCollection, (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push({ id: doc.id, ...doc.data() });
            });
            setUsersData(users);

        }, (error) => {
            Alert.alert("Error fetching user data");
        });

        return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
    <Text style={styles.cell}>{item.firstName}</Text>
    <Text style={styles.cell}>{item.points? item.points: '0'}</Text>
  </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tableBox}>
        <View style={styles.header}>
          <Text style={styles.headerText}>User</Text>
          <Text style={styles.headerText}>Count</Text>
        </View>
        <FlatList
          data={usersData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29', 
    padding: 16,
  },
  tableBox: {
    backgroundColor: '#333', 
    borderRadius: 10,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center', 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#fff', 
  },
});

export default Leaderboard;

