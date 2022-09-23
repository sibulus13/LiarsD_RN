// import { Audio } from "expo-av";

let random_names = [`Hamid`, `Michael`, `Valerie`, `Shaz`, `Brett`];

export function getRndInteger(min, max) {
  let num = Math.floor(Math.random() * (max - min + 1)) + min;
  // console.log(num);
  return num;
}

export function initialize_dices(
  num_players,
  dice_per_player,
  dice_distribution = []
) {
  let dices = [num_players];
  let num_dices = 0;
  for (var i = 0; i < num_players; i++) {
    dices[i] = [];
    if (dice_distribution.length != 0) {
      dice_per_player = dice_distribution[i];
    }
    for (var j = 0; j < dice_per_player; j++) {
      dices[i][j] = getRndInteger(1, 6);
      num_dices += 1;
    }
  }
  // console.log(dices);
  return { dices: dices, num_dices: num_dices };
}

export function initialize_visibility(num_players, index_player = 0) {
  let visiblity = new Array(num_players).fill(false);
  visiblity[index_player] = true;
  return visiblity;
}

export function initialize_player_names(
  num_players,
  index_player = 0,
  player_name = `Player1`
) {
  let player_names = Array(num_players);
  for (let i = 0; i < num_players; i++) {
    let rand_num = Math.floor(Math.random() * random_names.length);
    player_names[i] = random_names[rand_num];
    if (i == index_player) {
      player_names[i] = player_name;
    }
  }
  // console.log(player_names);
  return player_names;
}

export function initialize_players_last_claims(num_players) {
  let players_last_claims = new Array(num_players).fill(initial_claim);
  return players_last_claims;
}

export function initialize_scores(num_players) {
  let player_scores = new Array(num_players).fill(0);
  return player_scores;
}

export function set_dices_visible(num_players) {
  let visiblity = new Array(num_players).fill(true);
  // console.log(visiblity);
  return visiblity;
}

export function initialize_dices_visibility(num_players) {
  let visiblity = new Array(num_players).fill(false);
  visiblity[0] = true;
  // console.log(visiblity);
  return visiblity;
}

export function is_not_default_claim(claim) {
  if (claim.count == 1 && claim.face == 0) {
    return false;
  }
  return true;
}

export function get_random_player_index(num_players) {
  let rand_index = Math.floor(Math.random() * num_players);
  // console.log(rand_index);
  return rand_index;
}

export function is_turn_after_player(num_players, roundNum) {
  // console.log(`is_not_turn_after_player:`)
  // console.log(num_players, roundNum);
  let not_turn_after_player = roundNum % num_players == 1;
  // console.log((roundNum % num_players) - 1);
  return not_turn_after_player;
}

export function get_next_valid_claim(claim) {
  let count = claim.count;
  let face = claim.face + 1;
  if (face > 6) {
    face = 1;
    count += 1;
  }
  let new_claim = { count: count, face: face };
  // console.log(claim, new_claim);
  return new_claim;
}

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function random_time_in_range(min, max) {
  return Math.random() * (max - min) + min;
}

export function is_valid_claim(
  last_claim,
  curr_claim,
  max_num_dices = 15,
  dice_range = { min: 1, max: 6 }
) {
  let validNum =
    curr_claim["num"] >= last_claim["num"] && curr_claim["num"] <= max_num_dices
      ? true
      : false;

  let validFace =
    curr_claim["face"] > last_claim["face"] ||
    curr_claim["num"] > last_claim["num"]
      ? true
      : false;
  if (validNum && validFace) {
    return true;
  }
  return false;
}

export const DEFAULT_DICE = { min: 1, max: 6 };
export const dice_per_player = 5;
export const num_players = 3;
export const initial_claim = { count: 1, face: 0 };
// max player 5, max dice/ player 8 to fit on screen with current ratios
