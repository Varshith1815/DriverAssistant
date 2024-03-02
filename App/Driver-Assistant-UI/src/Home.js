import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Speedometer from './Speedometer';

const Home = () => {
  return (
    <View  style={styles.container}>
      {/* <Text>In Home</Text> */}
      <Speedometer/>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;