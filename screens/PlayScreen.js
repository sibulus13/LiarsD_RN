import { useEffect, useRef, useState } from "react";
import { View, Text, Button, Animated } from "react-native";
import Dice from "../components/Dice";
import Slider from "@react-native-community/slider";
import {
  DEFAULT_DICE,
  initialize_dices,
  dice_per_player,
  num_players,
  initial_claim,
  initialize_visibility,
  initialize_player_names,
  initialize_scores,
  initialize_players_last_claims,
  is_not_default_claim,
  set_dices_visible,
  is_turn_after_player,
  get_next_valid_claim,
  initialize_dices_visibility,
  playDiceRollSound,
} from "../utils/Dice";
import styles from "./Styles";
import { bot_turn, call_strategy_random } from "../utils/Bot";
import Popup from "../components/Popup";
import { diceRollingAnimation } from "../utils/Animation";
import { confirmationSound, diceRollingSound } from "../utils/Audio";
import { Audio } from "expo-av";

export default function PlayScreen({ navigation, route }) {
  // let mode = route.params.mode ? route.params.mode : "Single";
  let multiplayer = route.params.multiplayer ? route.params.multiplayer : false;
  let gameType = route.params.mode1 ? route.params.mode : "DM";
  let player_index = route.params.player_index ? route.params.player_index : 0;
  let player_name = route.params.player_name
    ? route.params.player_index
    : `Player 1`;
  let maxGameNum = 10;
  let dices_info = initialize_dices(num_players, dice_per_player);
  // console.log(multiplayer, gameType, player_index, player_name);

  const [CallFlag, setCallFlag] = useState(false);
  const [roundNum, setRoundNum] = useState(0);
  const [GameNum, setGameNum] = useState(7);
  const [WildCardCalled, setWildCardCalled] = useState(false);
  const [lastClaim, setlastClaim] = useState(initial_claim);
  const [callerIndex, setcallerIndex] = useState(initial_claim);
  const [count, setCount] = useState(1);
  const [face, setFace] = useState(1);
  const [NumDices, setNumDices] = useState(dices_info.num_dices);
  const [Dices, setDices] = useState(dices_info.dices);
  const [facesVisible, setFacesVisible] = useState(
    initialize_visibility(num_players)
  );
  const [playerNames, setplayerNames] = useState(
    initialize_player_names(num_players, player_index, playerNames)
  );
  const [playerLastClaims, setplayerLastClaims] = useState(
    initialize_players_last_claims(num_players)
  );
  const [playerScores, setPlayerScores] = useState(
    initialize_scores(num_players)
  );
  const [ResultsVisible, setResultsVisible] = useState(false);
  // const [DiceRollingSound, setDiceRollingSound] = useState(false);
  // const [ActionSound, setActionSound] = useState(false);

  const rotation = useRef(new Animated.Value(0)).current;
  const spin = rotation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [`-30deg`, `0deg`, `30deg`],
  });

  let is_player_round = roundNum % num_players == 0;
  useEffect(() => {
    // const { diceSound } = await Audio.Sound.createAsync(
    //   require("../Statics/diceRolling.mp3")
    // );
    // setDiceRollingSound(diceSound)
    // const { actionSound } = await Audio.Sound.createAsync(
    //   require("../Statics/beepboop.wav")
    // );
    // setDiceRollingSound(actionSound)

    handle_bot_turn(is_player_round);
  });

  return (
    <View style={styles.AndroidSafeArea}>
      {/* Sensors */}
      <View style={[styles.dices_container, { flex: 1 }]}>
        {Dices.map((player, i) => {
          return (
            <View
              style={[
                styles.center_aligned,
                i === roundNum % num_players
                  ? styles.player_container_curr_turn
                  : styles.player_container_not_curr_turn,
              ]}
              key={i.toString()}
            >
              <Text
                style={i == player_index ? [styles.bold] : [styles.normal_text]}
              >
                {playerNames[i]} ({playerScores[i]} points)
              </Text>
              <Text style={[styles.normal_text]}>
                {roundNum % num_players == i
                  ? "Deciding..."
                  : is_not_default_claim(playerLastClaims[i])
                  ? `Last claim: ${playerLastClaims[i].count} ${playerLastClaims[i].face}s`
                  : `No claim`}
              </Text>
              <View style={[styles.dices]}>
                {player.map((num, j) => {
                  return (
                    <Animated.View
                      key={`${i}${j}`}
                      style={{
                        transform: [{ rotate: spin }, { perspective: 1000 }],
                      }}
                    >
                      <Dice face={num} visible={facesVisible[i]} />
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
      {/* Actuators */}
      <View style={styles.bottom}>
        <Button
          onPress={
            CallFlag
              ? async () => {
                  reset_round();
                  await diceRollingAnimation(rotation, diceRollingSound);
                }
              : () =>
                  handle_bluff_called(
                    player_index,
                    (roundNum - 1) % num_players
                  )
          }
          title={
            CallFlag
              ? `On to the next round!`
              : is_not_default_claim(lastClaim)
              ? is_turn_after_player(num_players, roundNum)
                ? `Can't call bluff on yourself!`
                : `Call bluff on ${lastClaim.count} ${lastClaim.face}s`
              : `No claim yet`
          }
          disabled={
            CallFlag
              ? false
              : is_not_default_claim(lastClaim)
              ? is_turn_after_player(num_players, roundNum)
                ? true
                : false
              : true
          }
        />

        <View style={styles.horizontal}>
          <Text>Call count</Text>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={1}
            maximumValue={num_players * dice_per_player}
            value={count}
            onValueChange={setCount}
            step={1}
          />
        </View>
        <View style={styles.horizontal}>
          <Text>Call face</Text>
          <Slider
            style={{ width: 200, height: 15 }}
            minimumValue={DEFAULT_DICE.min}
            maximumValue={DEFAULT_DICE.max}
            // minimumTrackTintColor="#FFFFFF"
            // maximumTrackTintColor="#000000"
            value={face}
            onValueChange={setFace}
            step={1}
          />
        </View>
        <Button
          onPress={async () => await submitClaim(count, face, roundNum)}
          title={
            CallFlag
              ? ``
              : (count >= lastClaim.count && face > lastClaim.face) ||
                count > lastClaim.count
              ? `Claim ${count.toString()}x${face.toString()}s`
              : `Can not claim ${count.toString()}x${face.toString()}s, too low`
          }
          disabled={
            CallFlag
              ? true
              : (count >= lastClaim.count && face > lastClaim.face) ||
                count > lastClaim.count
              ? false
              : true
          }
        />
        <Button
          onPress={async () => await reset_game_state()}
          title={`Reset`}
        />
        <Button
          onPress={async () => await diceRollingAnimation(rotation)}
          title={`Test Button`}
        />
      </View>
      <Popup
        resultsVisible={ResultsVisible}
        playerScores={playerScores}
        playerNames={playerNames}
        backToMenu={() => navigation.navigate("Menu")}
        resetGame={async () => await reset_game_state()}
      ></Popup>
    </View>
  );

  async function handle_bot_turn(
    is_player_round,
    strategy = "",
    strategy_args = {}
  ) {
    if (!is_player_round) {
      console.log(roundNum, "robot round");
      let known_dices = Dices[roundNum % num_players];
      let unknown_dice_count = NumDices - known_dices.length;
      let response = await bot_turn(
        known_dices,
        unknown_dice_count,
        lastClaim,
        call_strategy_random
      );
      if (CallFlag) {
        return;
      }
      if (response.call) {
        let caller_index = roundNum % num_players;
        handle_bluff_called(caller_index, caller_index - 1);
      } else {
        handle_claim(response.claim);
      }
    }
    // return;
  }

  function handle_bluff_called(index_caller, index_claimer) {
    // add animation
    setCallFlag(true);
    setFacesVisible(set_dices_visible(num_players));
    console.log(index_caller, index_claimer);
    console.log(roundNum, num_players, roundNum % num_players);
    let sum = 0;
    for (let i = 0; i < Dices.length; i++) {
      for (let j = 0; j < Dices[i].length; j++) {
        if (Dices[i][j] == lastClaim.face) {
          sum += 1;
        }
        if (
          !WildCardCalled &&
          Dices[i][j] == lastClaim.face &&
          lastClaim.face != 1
        ) {
          sum += 1;
        }
      }
    }

    let indexWinner = -1;
    let indexLoser = -1;
    if (sum >= lastClaim.count) {
      indexWinner = index_claimer;
      indexLoser = index_caller;
    } else {
      indexWinner = index_caller;
      indexLoser = index_claimer;
    }

    switch (gameType) {
      case `DM`:
        console.log("DM case of handle_bluff_called");
        let gain = 1;
        // let newScore = playerScores
        playerScores[indexWinner] += gain;
        playerScores[indexLoser] -= gain / 2;

        console.log(playerScores);
        setPlayerScores(playerScores);
        break;
      default:
        console.log("Default case of handle_bluff_called", gameType);
        break;
    }
    // add animation AND delay to signify moving into next round and resetting game state
    setRoundNum(indexLoser);
    setGameNum(GameNum + 1);
    if (GameNum == maxGameNum - 1) {
      // End of game reached
      setResultsVisible(true);
    }
  }

  async function submitClaim(count, face, roundNum) {
    console.log(count, face);
    let validClaim =
      (count >= lastClaim.count && face > lastClaim.face) ||
      count > lastClaim.count;
    let validPlayerRound = roundNum % num_players == 0;
    if (validClaim && validPlayerRound) {
      // console.log(`setting valid claim`);
      if (face == 1) {
        console.log(`wild card called`);
        setWildCardCalled(true);
      }
      let claim = { count: count, face: face };
      handle_claim(claim);
    }
    // } else {
    //   // Should the player be allowed to try and submit a faulty claim?
    //   // Or should the submit button be blanked out for
    // }
    await confirmationSound();
  }

  function handle_claim(claim) {
    let last_claims = playerLastClaims;
    last_claims[roundNum % num_players] = claim;
    playerLastClaims[roundNum % num_players] = claim;
    // console.log(last_claims);
    setRoundNum(roundNum + 1);
    setplayerLastClaims(last_claims);
    setlastClaim(claim);
    let next_valid_claim = get_next_valid_claim(claim);
    setCount(next_valid_claim.count);
    setFace(next_valid_claim.face);
  }

  function reset_round(indexLoser = 0) {
    console.log(`prep next round`);
    // console.log(num_players, dice_per_player);
    // await diceRollingSound();
    setlastClaim(initial_claim);
    setCount(1);
    setFace(1);
    setWildCardCalled(false);
    setCallFlag(false);
    setFacesVisible(initialize_dices_visibility(num_players));
    let dices_info = initialize_dices(num_players, dice_per_player);
    // await diceRollingAnimation(rotation, diceRollingSound);
    setDices(dices_info.dices);
    setNumDices(dices_info.num_dices);
    setplayerLastClaims(initialize_players_last_claims(num_players));
    setRoundNum(indexLoser);
  }

  async function reset_game_state() {
    console.log(`resetting game state`);
    setGameNum(6);
    await reset_round();
    // setplayerNames(initialize_player_names(num_players));
    setPlayerScores(initialize_scores(num_players));
    setResultsVisible(false);
  }
}
