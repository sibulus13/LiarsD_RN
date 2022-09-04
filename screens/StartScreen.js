import { View, Text, Button, SafeAreaView } from "react-native";
import styles from "./Styles";

export default function StartScreen({ navigation }) {
  return (
    <View style={styles.AndroidSafeArea}>
      <Button
        onPress={() => navigation.navigate("Play", { mode: "Single" })}
        title="Single Player"
        disabled={false}
      />
      <Button
        onPress={() => navigation.navigate("Play", { mode: "Multi" })}
        title="Multiplayer"
        disabled={true}
      />
      <Button
        onPress={() => navigation.navigate("Setting", { })}
        title="Setting"
        disabled={true}
      />
      <Button
        onPress={() => navigation.navigate("How to Play", { })}
        title="How to Play"
        disabled={true}
      />
    </View>
  );
}