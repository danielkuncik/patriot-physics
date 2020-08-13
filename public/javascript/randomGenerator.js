

function randInt(m,n) {
  return Math.round(Math.random() * (n - m)) + m;
}


function randNumber(m,n,numDecimals) {
  return randInt(m*numDecimals, n*numDecimals) / numDecimals;
}


function coinFlip() {
  return Math.random() > 0.5
}

function randomPythagoreanTripleUnder100() {
  return pythagoreanTriples[randInt(0,15)];
}

function randomComplementaryAngles() {
  return complementaryAngles[randInt(0,complementaryAngles.length - 1)];
}