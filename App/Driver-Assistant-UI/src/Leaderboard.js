import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import data from '../assets/data.json'; // Assuming data.json is in the assets folder

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // Set the leaderboard data from the imported JSON file
    setLeaderboardData(data);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.number}</Text>
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
          data={leaderboardData}
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
