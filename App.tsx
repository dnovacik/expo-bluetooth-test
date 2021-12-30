import { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BleManager, State, Device } from "react-native-ble-plx";

const HomeScreen = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.container}>
      <Text>BT Test</Text>
      <Button title={'Search'} onPress={() => navigation.navigate("Search")}>Search</Button>
      <StatusBar style="auto" />
    </View>
  )
}

const SearchScreen = ({ navigation }: BottomTabBarProps) => {
  const [manager, setManager] = useState<BleManager>()
  const [status, setStatus] = useState<State>(State.PoweredOff)
  const [error, setError] = useState<string>('')
  const [devices, setDevices] = useState<Array<Device>>([])

  useEffect(() => {
    let zidan;
    try {
     zidan = new BleManager()
    } catch(error) {
      console.log(error)
      if (error instanceof Error) {
        setError(error.message)
      }
    }

    if (zidan) {
      setManager(zidan)
    }


    if (manager) {
      const sub = manager.onStateChange((state) => {
        setStatus(state)

        if (state === State.PoweredOn) {
          // scan()
        }

        sub.remove()
      }, true)
    }
  }, [manager])

  const scan = () => {
    let devices: Array<Device> = [];

    if (manager) {
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          return
        }

        if (device) {
          devices.push(device)
        }
      })
      setDevices(devices)
    }
  }

  return (
    <View style={styles.container}>
      <Text>BT Status {status}</Text>
      <Text>Error: {error}</Text>
      <Text>BT Devices should visualize here</Text>
      {
        devices &&
        devices.map((device, index) => {
          return (
            <Text key={`device-${index}`}>{device.name}</Text>
          )
        })
      }
      <StatusBar style="auto" />
    </View>
  );
}

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
