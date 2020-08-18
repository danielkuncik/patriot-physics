function lookUpUnit(unit) {

}


function convertUnitToSI(unit) {
  /// look up information from the JSON file

}

function multiplySIUnits(dimension1, dimension2) {

}

function multiplyUnits(unit1, unit2) {

}


function constructMagnitudeFromFloat(float, unit, numSigFigs, exact = false) {

}

// returns true if 'char' is a single character and a digit 0 - 9
function amIaDigit(char) {
    return char === '0' || char === '1' || char === '2' || char === '3' || char === '4' || char === '5' || char === '6' || char === '7' || char === '8' || char === '9';
}

function amIaNonZeroDigit(char) {
  return char === '1' || char === '2' || char === '3' || char === '4' || char === '5' || char === '6' || char === '7' || char === '8' || char === '9';
}


function deleteLeadingZeros(numString) {
    while (numString[0] === '0') {
        numString = numString.slice(1);
    }
    return numString;
}

// returns TRUE if the string contains only digits 0 - 9
function digitsOnly(str) {
    var i;
    for (i = 0; i < str.length; i++) {
        let char = str[i];
        if (!amIaDigit(char)) {
          return false
        }
    }
    return true;
}

// for integers only
function deleteTrailingZeros(numString) {
  while (numString[numString.length - 1] === '0') {
    numString.slice(0,numString.length - 1);
    console.log(numString)
  }
  return numString
}

function amIaSign(char) {
    return (char === '+' || char === '-');
}


// returns TRUE if the first character of the string entered is a positive or negative sign
function amIsigned(str) {
    return amIaSign(str[0]);
}

function readExponentString(exponentString) {
  let sign = 1;
  if (exponentString[0] === '+') {
    exponentString = exponentString.slice(1,exponentString.length);
  } else if (exponentString[0] === '+') {
    sign = -1;
    exponentString = exponentString.slice(1,exponentString.length);
  }
  if (!digitsOnly(exponentString)) {
    return undefined
  } else {
    return sign * Number(exponentString)
  }
}


// returns true if the string contains
// a + or - character first (or not)
// only digits, but at least one decimal point
// returns true if the number is a decimal string, signed or unsigned
function standardNotationDecimalString(str) {

    var decimalLocation = str.indexOf('.');
    var beforeDecimal, afterDecimal, beforeOK, afterOK, beforeOKbutWeird, afterOKbutWeird, allOK;
    // the 'but werid' options are things that can be true for one side, but not both sides

    if (decimalLocation === false) {
        return false
    } else {
        if (str.length == -1) { // ensures the string '.' is false
            return false
        }
        beforeDecimal = str.slice(0,decimalLocation);
        afterDecimal = str.slice(decimalLocation + 1);

        if (digitsOnly(beforeDecimal)) {
          // good!
        }  else if (beforeDecimal.length === 0) {
          beforeDecimal = '0';
        } else {
          return false
        }

        if (digitsOnly(afterDecimal)) {
          // good!
        } else if (afterDecimal.length === 0) {

        } else {
          return false
        }

        afterOK = digitsOnly(afterDecimal);
        afterOKbutWeird = afterDecimal.length === 0; // a decimal point at the end of a whole number should count!

        if (beforeOK && afterOK) {
            return true;
        } else if (beforeOK && afterOKbutWeird) {
            return true;
        } else if (beforeOKbutWeird && afterOK) {
            return true;
        } else {
            return false;
        }

    }
}


// returns TRUE if the string represents an integer
// and is in standard notation
function amIaStandardNotationInteger(str) {
    var newStr;
    if (amIsigned(str)) {
        newStr = str.slice(1);
    } else {
        newStr = str;
    }
    if (digitsOnly(newStr)) {
        return true;
    } else if (amIaStandardNotationDecimalString(newStr)) {
        var decimalLocation = newStr.indexOf('.');
        if (decimalLocation === newStr.length - 1) { // if the decimal is the last character
            return true;
        } else {
            var i;
            for (i = decimalLocation + 1; i < newStr.length; i++ ) { // if all characters afte the decimal are zeroes
                if (newStr[i] !== '0') {
                    return false
                }
            }
            return true;
        }
    } else {
        return false;
    }
}



// returns true if the string is any form of numerical string in standard notation
function amIaStandardNotationNumString(str) {
    var newStr;
    if (amIsigned(str)) {
        newStr = str.slice(1);
    } else {
        newStr = str;
    }
    return amIDigitsOnly(newStr) || amIaStandardNotationDecimalString(newStr);
}

// returns true if the string is a numerical string in exponent form
// does not require that the string is in proper scientific notation
function amIanExponentFormNumString(str) {
    var eLocation = findE(str);
    var beforeE, afterE, beforeOK, afterOK;
    if (eLocation === false) {
        return false
    } else {
        beforeE = str.slice(0, eLocation);
        afterE = str.slice(eLocation + 1);
        beforeOK = amIaStandardNotationNumString(beforeE);
        if (amIsigned(afterE)) {
            afterE = afterE.slice(1);
        }
        afterOK = amIDigitsOnly(afterE);
        return beforeOK && afterOK;
    }
}

// returns true if the numerical string is in proper scientific notation
function amIinScientificNotation(str) {
    if (!amIanExponentFormNumString(str)) {
        return false
    } else {
        var coefficient = str.slice(0, findE(str));
        if (amIsigned(coefficient)) {
            coefficient = coefficient.slice(1);
        }
        if (amIaDigit(coefficient)) { // if the coefficient is a single digit, with no decimal, its weird but OK
            return true;
        }
        var decimalLocation = findCharacter(coefficient,'.');

        return (decimalLocation === 1 && amIaDigit(coefficient[0])); // this catches the case that the decimal is not there
    }
}

// returns true if the string is any type of numerical string
function amIaNumString(str) {
    if (amIanExponentFormNumString(str)) {
      return 'exponentForm'
    } else if (amIaStandardNotationNumString(str)) {
      return 'standardNot'
    } else {
      return false
    }
}
// no tests yet exist for this!

// returns the first instance of e or E
// returns false if it is not found
function findE(numString) {
    var k;
    for (k = 0; k < numString.length; k++) {
        if (numString[k] === 'E' || numString[k] === 'e') {
            return k;
        }
    }
    return false;
}

// finds the index of the first significant figure of a numerical string
function findFirstSigFig(numString) {
    var q, firstSigFig;
    // find the location of the first signinicant figure
    for (q = 0; q < numString.length; q++ ) {
        if (numString[q] !== '0' && numString[q] !== '.' && numString[q] !== '-') {
            return q;
        }
    }
    return false;
}

function countSigFigs(numString) {

    if (amIsigned(numString)) {
        numString = numString.slice(1);
    }

    var eLocation = findE(numString);
    if (eLocation !== false) {
        numString = numString.slice(0,eLocation);
    }


    var firstSigFigLocation = findFirstSigFig(numString);
    if (firstSigFigLocation === false) {
        return 0;
    }

    var decimalLocation = findCharacter(numString,'.');

    if (decimalLocation !== false) { // numbers with decimals
        if (decimalLocation < firstSigFigLocation) { // numbers less than 1
            return (numString.length - firstSigFigLocation);
        } else { // numbers greater than 1
            return (numString.length - firstSigFigLocation - 1);
        }
    } else { // whole numbers
        var k, extraZeroes = 0;
        for (k = numString.length - 1; k >= 0; k -= 1 ){
            if (numString[k] === '0') {
                extraZeroes += 1
            } else {
                break
            }
        }
        return (numString.length - firstSigFigLocation - extraZeroes)
    }

}



// look up my previous work on numerical strings!
class Magnitude {
  constructor(numericalString, unit, exact = false) {
    this.firstSigFig = undefined;
    this.otherSigFigs = undefined;
    this.orderOfMagnitude = undefined;
    this.numSigFigs = undefined;
    this.positive = undefined;
    this.isAmagnitude = undefined;

    // invalid types
    if ((typeof(numericalString) !== 'string') || numericalString.length === 0) {
      this.isAmagnitude = false;
      return false
    }

    // sign
    if (numericalString[0] === '+') {
      this.positive = true;
      numericalString = numericalString.slice(1);
    } else if (numericalString[0] === '-') {
      this.positive = false;
      numericalString = numericalString.slice(1);
    } else {
      this.positive = true;//default
    }

    // delete leading zeros
    numericalString = deleteLeadingZeros(numericalString);

    // deal with E
    let exponentString = undefined;
    let eLocation = numericalString.indexOf('e');
    if (eLocation === -1) {
      eLocation = numericalString.indexOf('E');
    }
    if (eLocation === -1) { /// no exponent given
      this.orderOfMagnitude = 0;
      this.exponentString = '';
    } else {
      exponentString = numericalString.slice(eLocation + 1, numericalString.length);
      numericalString = numericalString.slice(0,eLocation);
      let exponent = readExponentString(exponentString);
      if (exponent === undefined) {
        this.isAmagnitude = false;
        return false
      } else {
        this.orderOfMagnitude = exponent
      }
    }

    // integers without a deicmal place
    /// do extra zeroes before an exponent count???
    if (digitsOnly(numericalString)) {
      this.isAmagnitude = true;
      while (numericalString[numericalString.length - 1] === '0') {
        numericalString = numericalString.slice(0,numericalString.length - 1);
        this.orderOfMagnitude++;
      }
      this.firstSigFig = numericalString[0];
      this.otherSigFigs = numericalString.slice(1,numericalString.length);
      this.numSigFigs = 1 + this.otherSigFigs.length;
      this.orderOfMagnitude += this.otherSigFigs.length;

      // deal with decimals!!!
    } else if (standardNotationDecimalString(numericalString)) {
      this.isAmagnitude = true;


    } else {
      this.isAmagnitude = false;
      return false
    }

    this.unit = unit;



    /// not sure i want this line...
    // this value is used for if a problem calls for continued operations
    // this.floatValue = Number(numericalString);

    // this.firstSigFig = firstSigFig;
    // this.otherSigFigs = otherSigFigs;
    // this.exponent = exponent;

    if (exact) {
      this.numSigFigs = Infinity;
    } else {

    }

  }

  round(numSigFigs) {

  }

  // will be used for more exact results in operations
  setFloatValue(float) {
    this.floatValue = float;
  }

  addZeroes(numZeroes) {

  }

  multiply(anotherMagnitude) {

  }

  divide(anotherMagnitude) {

  }

  square() {

  }

  add(anotherMagnitude) { /// returns result in the unit of this magnitude!

  }

  subtract(anotherMagnitude) {

  }

  convertToSIUnit() {

  }

  convertToAnotherUnit(anotherUnit) {

  }

}
