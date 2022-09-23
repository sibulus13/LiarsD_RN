import {
  get_next_valid_claim,
  is_valid_claim,
  random_time_in_range,
  timeout,
} from "./Dice.js";
import {
  calc_at_least_n_dice_likeliness,
  likeliness_of_claim,
  random_choice,
} from "./Stats.js";

export function bot_turn(
  known_dices,
  unknown_dice_count,
  last_claim,
  wild_card_called,
  call_strategy = call_strategy_random,
  claim_strategy = get_next_valid_claim,
  call_strategy_args = {},
  claim_strategy_args = {},
  time_constraint = { min: 2000, max: 5000 }
) {
  console.log("bot turn");
  call_strategy_args.last_claim = last_claim;
  claim_strategy_args.last_claim = last_claim;
  call_strategy_args.known_dices = known_dices;
  claim_strategy_args.known_dices = known_dices;
  call_strategy_args.unknown_dice_count = unknown_dice_count;
  claim_strategy_args.unknown_dice_count = unknown_dice_count;
  call_strategy_args.wild_card_called = wild_card_called;
  claim_strategy_args.wild_card_called = wild_card_called;
  let call = call_strategy_stat(call_strategy_args);
  // let claim = { face: 0, count: 0 };
  let claim = claim_strategy(claim_strategy_args);
  // await timeout(random_time_in_range(time_constraint.min, time_constraint.max));
  let res = { call: call, claim: claim };
  // console.log(response);
  return res;
}

export function call_strategy_random(strategy_args) {
  let last_claim = strategy_args["last_claim"];
  let known_dices = strategy_args["known_dices"];
  let unknown_dice_count = strategy_args["unknown_dice_count"];
  let likeliness = strategy_args["likeliness"]
    ? strategy_args["likeliness"]
    : 0.3;
  let chance = Math.random();
  return chance > likeliness ? true : false;
}

export function claim_strategy_random(strategy_args = {}) {
  let last_claim = strategy_args["last_claim"];
  let known_dices = strategy_args["known_dices"];
  let unknown_dice_count = strategy_args["unknown_dice_count"];
  let likeliness = strategy_args["likeliness"]
    ? strategy_args["likeliness"]
    : 0.3;

  let numDices = len(known_dices) + unknown_dice_count;
  possibleNums = range(max(1, last_claim["num"]), numDices);
  base = strategy_args["base"] ? strategy_args["base"] : 3;
  power = strategy_args["power"] ? strategy_args["power"] : 1;
  weights = power_distribution(len(possibleNums), base, power);
  claim = { num: 1, face: 1 };
  while (!is_valid_claim(lastClaim, claim)) {
    num = random_choice(possibleNums, (weights = weights));
    face = random_choice(DEFAULT_POSSIBLE_ROLLS);
    claim = { num: num, face: face };
  }
  return claim;
}

export function call_strategy_stat(strategy_args) {
  // console.log(strategy_args);
  let last_claim = strategy_args.last_claim;
  let known_dices = strategy_args.known_dices;
  let unknown_dice_count = strategy_args.unknown_dice_count;
  let wild_card_called = strategy_args.wild_card_called;
  let truthOffset = strategy_args.truthOffset
    ? strategy_args["truthOffset"]
    : 0;
  let probability_truth = likeliness_of_claim(
    known_dices,
    last_claim,
    unknown_dice_count,
    wild_card_called
  );
  let chance = Math.random();
  // console.log(chance, probability_truth, truthOffset);
  if (probability_truth == 1) {
    return false;
  }
  if (chance + truthOffset >= probability_truth) {
    return true;
  }
  return false;
}

export function claim_strategy_stat(strategy_args) {
  let last_claim = strategy_args["last_claim"];
  let known_dices = strategy_args["known_dices"];
  let unknown_dice_count = strategy_args["unknown_dice_count"];
  let wild_card_called = strategy_args["wild_card_called"];
  let bluffRatio = strategy_args.bluffRatio ? strategy_args.bluffRatio : 0;
  let baseWeight = strategy_args.baseWeight ? strategy_args.baseWeight : 0.7;

  let chance = Math.random();
  if (chance < bluffRatio) {
    console.log(`bluffing`)
    return claim_strategy_random(strategy_args);
  }

  if (!wild_card_called) {
    baseWeight *= 2;
  }
  let weights = Array(6).fill(baseWeight)
  // console.log(weights)  

  let claim = { face: 1, num: 1 };
  if (last_claim.num === unknown_dice_count) {
    claim.num = unknown_dice_count;
    while (!is_valid_claim(last_claim, claim)) {
      claim.face += 1;
    }
  }
  
  for (let dice of known_dices) {
    weights[dice - 1] += 1;
  }
  // console.log(weights)
  let weightSum = weights.reduce((partialSum, x) => partialSum + x, 0);
  weights = Array.from(weights, (x) => {return x/weightSum})
  let dice_faces = Array.from({ length: 6 }, (_, i) => i + 1);
  claim.face = random_choice(dice_faces, weights);
  claim.num = last_claim.num;
  while (!is_valid_claim(last_claim, claim)) {
    claim.num += 1;
  }
  return claim;
}

export function test_bot_turn() {
  let last_claim = { face: 1, num: 6 };
  let known_dices = [1, 1, 1, 1, 1];
  let unknown_dice_count = 10;
  let wild_card_called = true;
  let call_strategy = call_strategy_stat;
  let claim_strategy = claim_strategy_stat;

  let response = bot_turn(
    known_dices,
    unknown_dice_count,
    last_claim,
    wild_card_called,
    call_strategy_stat,
    claim_strategy
  );
  console.log(response);
}