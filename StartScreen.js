import { View, Text, Button } from "react-native";
// import { Button } from "react-native-paper";

export default function StartScreen({ navigation }) {
  return (
    <View>
      <Button
        onPress={() => navigation.navigate("Play", { mode: "Single" })}
        title="Single Player"
      />
      <Button
        onPress={() => navigation.navigate("Play", { mode: "Multi" })}
        title="Multiplayer"
      />
      <Text>
        Testing Testing
      </Text>
    </View>
  );
}