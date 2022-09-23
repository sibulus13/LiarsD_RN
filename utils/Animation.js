import { Animated, Easing } from "react-native";
import { diceRollingSound, playSound } from "./Audio";

let rollSegmentTime = 100;
let rollAngle = 0.7;

export async function diceRollingAnimation(animation_ref, dice_sound = null) {
  //   console.log(`rolling dice animation`);
  await diceRollingSound();
//   await playSound(dice_sound);
  Animated.sequence([
    Animated.timing(animation_ref, {
      toValue: rollAngle,
      useNativeDriver: true,
      duration: rollSegmentTime,
      //   easing: Easing.bounce,
    }),
    Animated.timing(animation_ref, {
      toValue: -2 * rollAngle,
      // easing: Easing
      useNativeDriver: true,
      duration: 2 * rollSegmentTime,
    }),
    Animated.timing(animation_ref, {
      toValue: rollAngle,
      // easing: Easing
      useNativeDriver: true,
      duration: rollSegmentTime,
    }),
    Animated.timing(animation_ref, {
      toValue: 0.0,
      // easing: Easing
      useNativeDriver: true,
      duration: rollSegmentTime,
    }),
  ]).start(() => animation_ref.setValue(0));
}
