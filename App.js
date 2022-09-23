import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import PlayScreen from "./screens/PlayScreen";
import MenuScreen from "./screens/MenuScreen";
import HowToPlayScreen from "./screens/HowToPlayScreen";
import ModeScreen from "./screens/ModeScreen";

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Menu"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Play" component={PlayScreen} />
        <Stack.Screen name="How to play" component={HowToPlayScreen} />
        <Stack.Screen name="Mode" component={ModeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}