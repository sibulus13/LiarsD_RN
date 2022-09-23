import { View, Text, Button, SafeAreaView } from "react-native";

import styles from "./Styles";

export default function HowToPlayScreen({ navigation }) {
  return (
    <View style={styles.flex}>
      <View style={styles.AndroidSafeArea}>
        <Text style={styles.h1}>How to Play</Text>
        <Text style={styles.normal_text}>
          The goal of the game is to call the bluff on another player's claim.
          Each turn players will take turn claiming two numbers: the number of
          specified faces and the specific face of the dice. When a bluff is
          called, if the bluff caller is correct, they win the round, otherwise
          they lose. Effects of wins and losses differ depending on the game
          mode played.
          {"\n"}
          {"\n"}
          For example, in a game of 3 people with 5 dices each (the default game
          mode with 15 dices in play), if a player calls 3 6s, they are claiming
          that out of all 15 dices in all player hands, there are at least 3
          dice with the 6 face showing.
          {"\n"}
        </Text>
        <Text style={styles.h1}>How Wild Cards Work</Text>
        <Text style={styles.normal_text}>
          The face value of 1s goes toward any other face accumulated towards
          the called face, however if 1s are called in which case their value
          sets to 1.
          {"\n"}
          {"\n"}
          For example, in the above case, if there are 2 3s and 4 1s in
          everyone's hand when the bluff is called, if 1s have been called then
          the caller would lose, if the wild card was in play then the caller
          would win.
        </Text>
      </View>
      <Button
        onPress={() => navigation.navigate("Menu", { mode: "Single" })}
        title="Back to menu"
        // disabled={false}
        style={[styles.menu_button, styles.bottom]}
      />
    </View>
  );
}
