/*
This is to create numbers with eignificant figures


Do I need to program all of my other programs, like geometry and functions and problems,
to accept physics numbers as values?????

*/

function isDigit(letter) {
  return (letter === '1' || letter === '2' || letter === '3' || letter === '4' || letter === '5' || letter === '6' || letter ==='7 || letter === '8' || letter === '9' || letter === '0')
}

function isStringOfDigits(string) {
  let i;
  let result = true;
  for (i = 0; i < string.length; i++) {
    if (!isDigit(string[i])) {
      result = false;
      break
    }
  }
  return result
}

class PhysicsNumber {
  constructor(firstSigFig, otherSigFigs,exponent = 0, exact = false)
    if (!isStringOfDigits(otherSigFigs) || !isDigit(firstSigFig) || !isInteger(exponent)) {
      return false
    }
    this.firstSigFig = firstSigFig;
    this.otherSigFigs = otherSigFigs;
    this.exponent = exponent;
    if (exact) {
      this.numSigFigs = Infinity;
    } else {
      this.numSigFigs = 1 + this.otherSigFigs.length;
    }
    // significant figure must be a string of digits
  }

  stringSciNot() {
    let sign;
    if (exponent > 0) {
      sign = '+';
    } else if (exponent < 0) {
      sign = '-';
    } else if (exponent === 0) {
      sign = '';
    }
    return `${this.firstSigFig}.${this.otherSigFigs}e${sign}${Math.abs(this.exponent)`
  }

  stringStandardNot() {

  }

  floatingPoint() {

  }

  round() {

  }


  /// operations between physics numbers
  /// => convert to floating points, then round ?
  multiply(anotherPhysicsNumber) {

  }
  divide(anotherPhysicsNumber) {
    
  }
}

function constructPhysicsNumberFromString(string) {
  /// use numerical string methods from before
  // i spent a long time on this in june 2017!
}
