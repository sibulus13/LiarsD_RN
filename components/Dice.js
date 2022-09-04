import { View, Text, Button } from "react-native";
// import styles from "./Styles";
import styles from "./Styles";

export default function Dice({ num_sides = 5, face, visible }) {
  //   console.log(face);
  let dice_style = {
    1: styles.one,
    2: styles.two,
    3: styles.three,
    4: styles.four,
    5: styles.five,
    6: styles.six,
  };
  return (
    <View style={styles.dice_container}>
      {/* <Text>A Dice</Text> */}
      <View style={styles.square}>
        <View style={[]}>
          <Text style={[styles.dice_text, styles.centered]}>
            {visible ? face : "?"}
          </Text>
        </View>
      </View>
    </View>
  );
}
