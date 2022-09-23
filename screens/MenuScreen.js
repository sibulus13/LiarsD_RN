import { View, Text, Button, SafeAreaView } from "react-native";
import { test_bot_turn } from "../utils/Bot";
import styles from "./Styles";

let emoji_title = `🤥🤥🎲🔥`;
let text_title = `Liar Liar Dice on Fire`;

export default function MenuScreen({ navigation }) {
  return (
    <View style={styles.AndroidSafeArea}>
      <View style={styles.menu}>
        <Text style={styles.title}>{emoji_title}</Text>
        <Button
          onPress={() => navigation.navigate("Play", { multiplayer: false })}
          title="Single Player"
          // disabled={false}
          style={styles.menu_button}
        />
        <Button
          onPress={() => navigation.navigate("Play", { mode: "Multi" })}
          title={`Multiplayer \n (Coming Soon!)`}
          disabled={true}
        />
        <Button
          onPress={() => navigation.navigate("How to play", {})}
          title="How to Play"
          // disabled={true}
        />
        {/* <Button
          onPress={() => navigation.navigate("Stats", {})}
          title="Stats"
          // disabled={true}
        /> */}
        {/* <Button
          onPress={() => navigation.navigate("Setting", {})}
          title="Setting"
          disabled={true}
        /> */}

        {/* Heres some manual testing */}
        {/* <Button
          onPress={() => {
            test_bot_turn();
          }}
          title="Test Button"
          // disabled={true}
        /> */}
      </View>
    </View>
  );
}
