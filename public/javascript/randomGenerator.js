

function randInt(m,n) {
  return Math.round(Math.random() * (n - m)) + m;
}


function randNumber(m,n,numDecimals) {
  return randInt(m*numDecimals, n*numDecimals) / numDecimals;
}
