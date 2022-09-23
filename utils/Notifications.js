import { Alert } from "react-native";

export function endOfGame(playerNames, playerScores, goBack, restart) {
  let title = `Result \n`;
  for (var i = 0; i < playerNames.length; i++) {
    title += `${playerNames[i]}: ${playerScores[i]} points \n`;
  }
  console.log(title);
  Alert.alert({title}, "Now what?", [
    { text: "Go Back", onPress: () => goBack },
    { text: "Restart Game", onPress: () => restart },
  ]);
}
 