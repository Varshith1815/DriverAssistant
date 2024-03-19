import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Speedometer from './Speedometer';
import { LinearGradient } from 'expo-linear-gradient';

const Home = () => {
  return (
    <LinearGradient
      colors={[ '#0f0c29','#0f0c29', '#121212' ]}
      start={{x: 0, y: 0}} end={{x: 0, y: 1}}
      style={styles.linearGradient}
    >
    <View  style={styles.container}>
      {/* <Text>In Home</Text> */}
      <Speedometer/>
    </View >
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#121212',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  linearGradient: {
    flex: 1,
    // paddingLeft: 15,
    // paddingRight: 15,
    borderRadius: 5
  },
});

export default Home;