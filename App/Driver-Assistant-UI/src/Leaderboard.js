import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Leaderboard = () => {
  const [usersData, setUsersData] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const db = FIREBASE_DB;
  const auth = getAuth();
  const currentUser = auth.currentUser; // Current user details

  useEffect(() => {
    const usersCollection = collection(db, "users");
    const unsubscribe = onSnapshot(usersCollection, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      users.sort((a, b) => b.points - a.points);
      setUsersData(users);
      // Find the rank of the current user
      if (currentUser) {
        const rank = users.findIndex(user => user.uid === currentUser.uid) + 1;
        const currentUserData = users.find(user => user.uid === currentUser.uid);
        setCurrentUserRank({
          ...currentUserData,
          rank, // Assign the calculated rank
        });
      }
    }, (error) => {
      Alert.alert("Error fetching user data");
    });

    return () => unsubscribe();
  }, [currentUser]);

  const topThreeIcon = require('../assets/black-cat.png'); // Replace with your top 3 icon path
  const otherIcon = require('../assets/white-cat.png'); // Replace with other ranks icon path

  const renderItem = ({ item, index }) => {
    const isTopThree = index < 3;
    return (
      <View style={[styles.row, isTopThree ? styles.topRow : styles.otherRow]}>
        <Text style={[styles.cell, styles.rankCell, isTopThree && styles.topCellText]}>{index + 1}</Text>
        <Image source={isTopThree ? topThreeIcon : otherIcon} style={styles.icon} />
        <Text style={[styles.cell, styles.userCell, isTopThree && styles.topCellText]}>{item.firstName}</Text>
        <Text style={[styles.cell, styles.pointsCell, isTopThree && styles.topCellText]}>{item.points ? item.points : '0'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.leaderboardContainer}>
        <FlatList
          data={usersData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <View style={styles.currentRankBox}>
        <Text style={styles.currentRankText}>Your Rank</Text>
        <View style={[styles.currentRankRow]}>
          <Text style={[styles.cell, styles.rankCell, styles.topCellText]}>#{currentUserRank?.rank}</Text>
          <Image source={topThreeIcon} style={styles.icon} />
          <Text style={[styles.cell, styles.userCell, styles.topCellText]}>{currentUserRank?.firstName}</Text>
          <Text style={[styles.cell, styles.pointsCell, styles.topCellText]}>{currentUserRank?.points}</Text>
        </View>
      </View>
    </View>
  );
};

// const themeColor = '#7DF9FF';
const themeColor = '#fff';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    height: 50,
    marginBottom: 8,
    borderRadius: 6,
  },
  cell: {
    textAlign: 'left',
    color: themeColor,
    fontSize: 16,
    padding: 8,
  },
  rankCell: {
    width: 40,
    textAlign: 'right',
    padding: 8,
    // paddingLeft: 10,
    marginRight: 8,
  },
  userCell: {
    flex: 1,
    textAlign: 'left',
  },
  pointsCell: {
    flex: 1,
    textAlign: 'right',
    paddingRight: 16,
  },
  topRow: {
    backgroundColor: themeColor,
  },
  otherRow: {
    borderWidth: 1,
    borderColor: themeColor,
  },
  topCellText: {
    fontWeight: 'bold',
    color: '#000',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  leaderboardContainer: {
    flex: 1,
  },
  currentRankBox: {
    backgroundColor: themeColor,
    paddingTop: 12,
    paddingBottom: 12,
    width: '100%',
    height: 'auto',
    margin: 16,
    borderRadius: 6,
    position: 'absolute', // Ensures the box stays at the bottom
    bottom: 20,
  },
  currentRankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    height: 50,
    marginBottom: 8,
  },
  currentRankText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 8,
    marginLeft: 16,
  },
});

export default Leaderboard;
