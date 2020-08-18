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

// returns TRUE if the string contains only digits 0 - 9
function digitsOnly(str) {
    let i;
    for (i = 0; i < str.length; i++) {
        let char = str[i];
        if (!amIaDigit(char)) {
          return false
        }
    }
    return true;
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
    numericalString = this.deleteLeadingZeros(numericalString);
    if (numericalString.length === 0) { // if it was only zeroes
      this.isAMagnitude = true;
      this.zero = true;
      this.firstSigFig = '0';
      this.otherSigFigs = '';
      this.numSigFigs = 1; /// is this true??? how do you determine the number of sig figs of a zero?
    }

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
      let exponent = this.readExponentString(exponentString);
      if (exponent === undefined) {
        this.isAmagnitude = false;
        return false
      } else {
        this.orderOfMagnitude = exponent;
      }
    }

    // values with decimal places
    if (numericalString.indexOf('.') !== -1) {
        console.log('xxx');
        const decimalPoint = numericalString.indexOf('.');
        const beforeDecimal = numericalString.slice(0, decimalPoint);
        let afterDecimal = numericalString.slice(decimalPoint + 1, numericalString.length);
        if (digitsOnly(beforeDecimal) && digitsOnly(afterDecimal) && (beforeDecimal.length > 0 || afterDecimal.length > 0)) {
            this.isAmagnitude = true;
            if (beforeDecimal.length > 0) {
                this.firstSigFig = beforeDecimal[0];
                this.orderOfMagnitude += beforeDecimal.length - 1;
                this.otherSigFigs = beforeDecimal.slice(1, beforeDecimal.length) + afterDecimal;
                this.numSigFigs = 1 + this.otherSigFigs.length;
            } else { // no digits before decimal
                this.orderOfMagnitude -= 1;
                while (afterDecimal[0] === '0') {
                    afterDecimal = afterDecimal.slice(1);
                    this.orderOfMagnitude -= 1;
                }
                this.firstSigFig = afterDecimal[0];
                this.otherSigFigs = afterDecimal.slice(1, afterDecimal.length);
                this.numSigFigs = 1 + this.otherSigFigs.length
            }
        } else {
            this.isAmagnitude = false;
            return false
        }
    } else if (digitsOnly(numericalString) && numericalString.length > 0) { // integers
        this.isAmagnitude = true;
        while (numericalString[numericalString.length - 1] === '0') {
            numericalString = numericalString.slice(0,numericalString.length - 1);
            this.orderOfMagnitude++;
        }
        this.firstSigFig = numericalString[0];
        this.otherSigFigs = numericalString.slice(1,numericalString.length);
        this.numSigFigs = 1 + this.otherSigFigs.length;
        this.orderOfMagnitude += this.otherSigFigs.length;
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


    /// PRIVATE FUNCTION
  deleteLeadingZeros(numString) {
    while (numString[0] === '0') {
        numString = numString.slice(1);
    }
    return numString;
  }

  // PRIVATE FUNCTION
  readExponentString(exponentString) {
    let sign = 1;
    if (exponentString[0] === '+') {
        exponentString = exponentString.slice(1,exponentString.length);
    } else if (exponentString[0] === '-') {
        sign = -1;
        exponentString = exponentString.slice(1,exponentString.length);
    }
    if (!digitsOnly(exponentString)) {
        return undefined
    } else {
        return sign * Number(exponentString)
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
