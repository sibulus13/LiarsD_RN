import { Audio } from "expo-av";

export async function diceRollingSound() {
  //   console.log("Loading Sound");
  const { sound } = await Audio.Sound.createAsync(
    require("../Statics/diceRolling.mp3")
  );
  await sound.playAsync();
}

export async function confirmationSound() {
  //   console.log("Loading Sound");
  const { sound } = await Audio.Sound.createAsync(
    require("../Statics/beepboop.wav")
  );
  await sound.playAsync();
}

export async function playSound(sound) {
  await sound.playAsync();
}
