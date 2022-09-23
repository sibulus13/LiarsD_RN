import React, { useState } from "react";
import { View, Text, Switch } from "react-native";
import styles from "./Styles";

export default function ModeScreen({ navigation, route }) {
  let multiplayer = route.params.multiplayer ? route.params.multiplayer : false;
  //   console.log(multiplayer);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={styles.AndroidSafeArea}>
      <Text style={styles.normal_text}>Game Mode</Text>
      <View>
        <Text>{isEnabled ? `Diceth Match` : `Last Die Standing`}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <Text style={styles.normal_text}>Number of Players</Text>
      </View>
      <Text style={styles.normal_text}>Dice Count Per Player</Text>
    </View>
  );
}
