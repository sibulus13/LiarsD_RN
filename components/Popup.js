import {
  View,
  Text,
  Button,
  AsyncStorage,
  TouchableNativeFeedbackBase,
  Alert,
  Modal,
} from "react-native";
import styles from "./Styles";
import { default as screenStyles } from "../screens/Styles";

export default function Popup(props) {
  // console.log(props);
  return (
    <View
    // style={styles.modalContainer}
    >
      <Modal transparent={true} visible={props.resultsVisible}>
        <View style={styles.modalContainer}>
          <View style={{ flex: 1 }}>
            <Text style={[screenStyles.title, styles.centered]}>
              Final Score
            </Text>
            {props.playerNames.map((name, index) => {
              return (
                <Text style={screenStyles.normal_text} key={name + index}>
                  {name}: {props.playerScores[index]} points
                </Text>
              );
            })}
          </View>

          {/* <Text>Now what? Go back to menu or play again?</Text> */}
          <View style={styles.bottom}>
            <Button
              onPress={() => props.backToMenu()}
              title={`Back to Menu`}
              disabled={false}
            />
            <Button
              onPress={props.resetGame}
              title={`Play Again`}
              disabled={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
