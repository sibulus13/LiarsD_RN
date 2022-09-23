export function power_distribution(count, base, power, inverse = True) {
  let polarity = inverse ? -1 : 1;
  // let weights = [base**(polarity*power*x) for x in range(count)]
  let weights = Array.from(
    { length: length(count) },
    (_, i) => base ** (polarity * power * i)
  );
  console.log(power_distribution.name, count, weights);
  // console.log(normalize_distribution(weights))
  return normalize_distribution(weights);
}

export function normalize_distribution(distribution) {
  const total = distribution.reduce((partialSum, a) => partialSum + a, 0);
  const normalized_distribution = distribution.map((x) => x / total);
  return normalized_distribution;
}

export function random_choice(choices, weights = null) {
  let chance = Math.random();
  if (weights === null) {
    weights = Array.from({ length: length(choices) }, 1);
  }
  // console.log(random_choice.name, weights, chance);
  for (let i = 0; i < choices.length; i++) {
    // console.log(chance, weights[i])
    if (chance <= 0) {
      return choices[i];
    }
    chance -= weights[i];
  }
  return choices[choices.length - 1];
}

/** Calculate the likeliness of a claim
 * @param {*} knownDices
 * @param {*} claim
 * @param {*} unknown_dice_count
 * @param {*} wild_card_called
 */
export function likeliness_of_claim(
  own_dices,
  claim,
  unknown_dice_count,
  wild_card_called
) {
  // console.log(claim);
  // console.log(own_dices,claim,unknown_dice_count,wild_card_called, claim.face)
  let face = claim["face"];
  let num_hand = own_dices.reduce(
    (total, x) => (x == face ? total + 1 : total),
    0
  );
  // console.log(`numhand`, num_hand, face);
  let num_claim = claim["num"];
  let num_unclaimed = num_claim - num_hand;
  if (num_unclaimed <= 0) {
    return 1;
  }
  let p = 1 / 6;
  if (!wild_card_called && claim["face"] != 1) {
    p = 1 / 3;
  }
  let prob = calc_at_least_n_dice_likeliness(
    unknown_dice_count,
    num_unclaimed,
    p
  );
  // console.log(prob, unknown_dice_count, num_unclaimed, p);
  return prob;
}

// calculate the likeliness that out of n dices at least x dices are the same with probability p
export function calc_at_least_n_dice_likeliness(n, x, p) {
  let prob = 0;
  if (x > n) {
    return 0;
  }
  for (var i = x; i < n; i++) {
    let p1 = calc_dice_likeliness(n, i, p);
    prob += p1;
    // console.log( p1, n, i, p, prob);
  }
  return prob;
}

// Calculate the probability that out of n dices x are the same, with p allowing for 1/2
export function calc_dice_likeliness(n, x, p) {
  let prob = binomial(n, x) * p ** x * (1 - p) ** (n - x);
  // console.log(prob);
  return prob;
}

export function binomial(n, k) {
  var coeff = 1;
  for (var x = n - k + 1; x <= n; x++) coeff *= x;
  for (x = 1; x <= k; x++) coeff /= x;
  return coeff;
}