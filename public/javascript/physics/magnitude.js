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


function roundUpCharacter(char) {
    switch (char) {
        case '0':
            return '1';
        case '1':
            return '2';
        case '2':
            return '3';
        case '3':
            return '4';
        case '4':
            return '5';
        case '5':
            return '6';
        case '6':
            return '7';
        case '7':
            return '8';
        case '8':
            return '9';
        case '9':
            return '0';
        default:
            return null;
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
      return this.invalidate()
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
        return this.invalidate()
      } else {
        this.orderOfMagnitude = exponent;
      }
    }

      // delete leading zeros
      let leadingZeros = 0;
      while (numericalString[0] === '0') {
          numericalString = numericalString.slice(1);
          leadingZeros++;
      }
      if ((numericalString.length === 0 || numericalString === '.') && leadingZeros > 0) { // if it was only zeroes
          return this.setValueZero(1,exact);
      }


    if (numericalString.indexOf('.') !== -1) {  // values with decimal places
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
                let leadingZerosAfterDecimal = 0;
                // this.orderOfMagnitude -= 1;
                while (afterDecimal[0] === '0') {
                    afterDecimal = afterDecimal.slice(1);
                    // this.orderOfMagnitude -= 1;
                    leadingZerosAfterDecimal++;
                }
                if (afterDecimal.length === 0) { // if it was only zeros
                    return this.setValueZero(1 + leadingZerosAfterDecimal, exact);
                } else {
                    this.orderOfMagnitude -= 1 + leadingZerosAfterDecimal;
                    this.firstSigFig = afterDecimal[0];
                    this.otherSigFigs = afterDecimal.slice(1, afterDecimal.length);
                    this.numSigFigs = 1 + this.otherSigFigs.length
                }
            }
        } else {
            return this.invalidate();
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
        return this.invalidate()
    }
    this.unit = unit;

    if (exact) {
      this.numSigFigs = Infinity;
    }
    this.intermediateValue = undefined; /// a float value used for calculations, but not presentation
      // for problems

  }

  invalidate() {
      this.isAmagnitude = false;
      this.firstSigFig = undefined;
      this.otherSigFigs = undefined;
      this.orderOfMagnitude = undefined;
      this.numSigFigs = undefined;
      this.positive = undefined;
      return false
  }

  setValueZero(numSigFigs = 1, exact = false) {
      this.isAmagnitude = true;
      this.zero = true;
      this.positive = undefined;
      this.orderOfMagnitude = undefined;
      this.numSigFigs = numSigFigs;
      this.firstSigFig = '0';
      if (exact) {
          this.numSigFigs = Infinity;
          this.otherSigFigs = '';
      } else {
          this.numSigFigs = numSigFigs;
          this.otherSigFigs = '';
          let i;
          for (i = 1; i < this.numSigFigs; i++) {
              this.otherSigFigs = this.otherSigFigs + '0';
          }
      }
      return true
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

  round(newSigFigs) {
    if (newSigFigs > this.numSigFigs) {
        // console.log('unable to add significant figures to a magnitude');
        return this
    } else if (newSigFigs === this.numSigFigs) {
        return this
    } else {
        let numString = this.firstSigFig + this.otherSigFigs;
        let characterArray = numString.slice(newSigFigs).split("");

        // the next string
        let testChar = numString[newSigFigs];
        if (testChar === '5' || testChar === '6' || testChar === '7' || testChar === '8' || testChar === '9') {

        }
    }
  }

  getString() {

  }

  getFloat() {

  }

  getValue() {
      return this.intermediateValue ? this.intermediateValue : this.getFloat()
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

