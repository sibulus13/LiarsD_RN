import { View, Text, Button, TextInput } from "react-native";
// import styles from "./Styles";
import styles from "./Styles";
import { IconButton } from "react-native-paper";
import { useState } from "react";

export default function Incrementer({ min, max, getNum }) {
  const [num, setNum] = useState(min);

  return (
    <View
    style={styles.incrementer_container}
    >
      {/* <Text>Incrementer</Text> */}
      <IconButton
        icon="arrow-up-bold"
        disabled={num + 1 > max ? true : false}
        size={20}
        onPress={() => {
          updateNum(num + 1);
        }}
      />
      <TextInput
        // style={styles.input}
        onChangeText={(num) => updateNum(num, min, max)}
        value={num}
        placeholder={num.toString()}
        keyboardType="numeric"
      />
      <IconButton
        icon="arrow-down-bold"
        // iconColor={MD3Colors.error50}
        size={20}
        disabled={num - 1 < min ? true : false}
        onPress={() => {
          updateNum(num - 1);
        }}
      />
    </View>
  );

  function updateNum(num, min, max) {
    if (num >= min && num <= max) {
      getNum(num);
      setNum(num);
    }
  }
}
