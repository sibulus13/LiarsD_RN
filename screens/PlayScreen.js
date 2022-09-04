import { useState } from "react";
import {
  View,
  Text,
  Button,
  AsyncStorage,
  TouchableNativeFeedbackBase,
} from "react-native";
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
} from "../utils/Dice";
import styles from "./Styles";

export default function PlayScreen({ navigation, route }) {
  let mode = route.params.mode ? route.params.mode : "Single";
  let gameType = route.params.mode1 ? route.params.mode : "DM";
  let player_index = route.params.player_index ? route.params.player_index : 0;
  let player_name = route.params.player_name
    ? route.params.player_index
    : `Player 1`;
  let maxGameNum = 10;

  console.log(mode, gameType, player_index, player_name);

  const [CallFlag, setCallFlag] = useState(false);
  const [WildCardCalled, setWildCardCalled] = useState(false);
  const [roundNum, setRoundNum] = useState(0);
  const [GameNum, setGameNum] = useState(0);
  const [lastClaim, setlastClaim] = useState(initial_claim);
  const [count, setCount] = useState(1);
  const [face, setFace] = useState(1);
  const [Dices, setDices] = useState(
    initialize_dices(num_players, dice_per_player)
  );
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

  return (
    <View style={styles.AndroidSafeArea}>
      <Text>{playerNames[roundNum % num_players]}'s Turn</Text>
      <View>
        {Dices.map((player, i) => {
          return (
            <View style={[styles.center_aligned]} key={i.toString()}>
              <Text>
                {playerNames[i]}: {playerScores[i]} points
              </Text>
              <Text>
                {is_not_default_claim(playerLastClaims[i])
                  ? `Last claim: ${playerLastClaims[i].count} ${playerLastClaims[i].face}s`
                  : `No claim`}
              </Text>
              <View style={[styles.dices]}>
                {player.map((num, j) => {
                  return (
                    <View key={`${i}${j}`}>
                      <Dice face={num} visible={facesVisible[i]} />
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.bottom}>
        <Button
          onPress={
            CallFlag
              ? () => reset_round()
              : () => callBluff(player_index, (roundNum - 1) % num_players)
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
          onPress={() => submitClaim(count, face, roundNum)}
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
        <Button onPress={() => reset_game_state()} title={`Reset`} />
      </View>
    </View>
  );

  function callBluff(index_caller, index_claimer) {
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
        console.log("DM case of callBluff");
        let gain = 1;
        // let newScore = playerScores
        playerScores[indexWinner] += gain;
        playerScores[indexLoser] -= gain / 2;

        console.log(playerScores);
        setPlayerScores(playerScores);
        setGameNum(GameNum + 1);
        if (GameNum > maxGameNum) {
          console.log(`Max game num achieved, ending game`);
          // end game
        }
        break;
      default:
        console.log("Default case of callBluff", gameType);
        break;
    }
    // add animation AND delay to signify moving into next round and resetting game state
    setRoundNum(indexLoser);
    // reset_round(indexLoser);
    // reset_game_state();
  }

  function submitClaim(count, face, roundNum) {
    console.log(count, face);
    let validClaim =
      (count >= lastClaim.count && face > lastClaim.face) ||
      count > lastClaim.count;
    let validPlayerRound = num_players % roundNum == 0;
    // && validPlayerRound
    if (validClaim) {
      // console.log(`setting valid claim`);
      if (face == 1) {
        console.log(`wild card called`);
        setWildCardCalled(true);
      }
      let claim = { count: count, face: face };
      setlastClaim(claim);
      setRoundNum(roundNum + 1);
      let next_valid_claim = get_next_valid_claim(claim);
      setCount(next_valid_claim.count);
      setFace(next_valid_claim.face);
      let last_claims = playerLastClaims;
      last_claims[roundNum % num_players] = claim;
      playerLastClaims[roundNum % num_players] = claim;
      // console.log(last_claims);
      setplayerLastClaims(last_claims);
    } else {
      // Should the player be allowed to try and submit a faulty claim?
      // Or should the submit button be blanked out for
    }
  }

  function reset_round(indexLoser = 0) {
    console.log(`prep next round`);
    console.log(num_players, dice_per_player);
    setlastClaim(initial_claim);
    setCount(1);
    setFace(1);
    setWildCardCalled(false);
    setCallFlag(false);
    setDices(initialize_dices(num_players, dice_per_player));
    setFacesVisible([true, false, false]);
    setplayerLastClaims(initialize_players_last_claims(num_players));
  }

  function reset_game_state() {
    console.log(`resetting game state`);
    setplayerNames(initialize_player_names(num_players));
    setPlayerScores(initialize_scores(num_players));
    reset_round();
  }
}
