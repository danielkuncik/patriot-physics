// returns true if 'char' is a single character and a digit 0 - 9
function amIaDigit(char) {
    return char === '0' || char === '1' || char === '2' || char === '3' || char === '4' || char === '5' || char === '6' || char === '7' || char === '8' || char === '9';
}

const maxSigFigs = 15; /// beyond this value, javscript number cannot be confied to be accurate

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

function makeStringOfZeros(numZeros) {
    let k, zeroString = '';
    for (k = 0; k < numZeros; k++) {
        zeroString = zeroString + '0';
    }
    return zeroString
}

function countTrailingZeros(string) {
    let numTrailingZeros = 0;
    let k;
    for (k = string.length - 1; k >= 0; k-- ){
        if (string[k] === '0') {
            numTrailingZeros++;
        } else {
            return numTrailingZeros
        }
    }
    return numTrailingZeros
}

function allNines(numString) {
    let i;
    for (i = 0; i < numString.length; i++) {
        if (numString[i] !== '9') {
            return false
        }
    }
    return true
}

function reassignDigit(numString, index, newDigit) {
    return numString.slice(0,index) + newDigit + numString.slice(index + 1, numString.length);
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

function roundUpDigit(numString, index) {
    return reassignDigit(numString, index, roundUpCharacter(numString[index]))
}

// a number with significant figures accounted for
// this class will really only be used in its subclasses: angle, temperature, and magnitude
class PhysicsNumber {
  constructor(numericalString, intermediateValue, exact = false) {
    this.firstSigFig = undefined;
    this.otherSigFigs = undefined;
    this.orderOfMagnitude = undefined;
    this.numSigFigs = undefined;
    this.positive = undefined;
    this.isAphysicsNumber = undefined;
    this.zeroLimit = undefined;

    this.isAnAngle = false; // used for angles below
    this.degrees = undefined;

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

    if (numericalString === 'Infinity') {
        this.setValueInfinity();
        return false
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
            this.isAphysicsNumber = true;
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
        this.isAphysicsNumber= true;
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

    if (exact) {
      this.numSigFigs = Infinity;
      this.exact = true;
    } else {
        this.exact = false;
        if (this.numSigFigs > 15) { /// beyond 15, javacsript number objects cannot be confirmed to be accurate, so no magnitude may have greater than this number of significant figures unless it is exact
            this.numSigFigs = 15;
        }
    }
    this.intermediateValue = intermediateValue ? intermediateValue : undefined; /// in case this magnitude is an 'intermediate step' within a larger problem

    if (this.orderOfMagnitude < -8) { /// for all operations, if it goes below this value, it will round down to zero
        this.zeroLimit = 10**(this.orderOfMagnitude - 3);
    } else {
        this.zeroLimit = 1e-10;
    }
  }

  invalidate() {
      this.isAphysicsNumber = false;
      this.firstSigFig = undefined;
      this.otherSigFigs = undefined;
      this.orderOfMagnitude = undefined;
      this.numSigFigs = undefined;
      this.positive = undefined;
      this.exact = undefined;
      return false
  }

  setValueZero(numSigFigs = 1, exact = false) {
      this.isAphysicsNumber = true;
      this.zero = true;
      this.positive = undefined;
      this.orderOfMagnitude = undefined;
      this.numSigFigs = numSigFigs;
      this.firstSigFig = '0';
      this.unit = undefined;
      if (exact) {
          this.numSigFigs = Infinity;
          this.otherSigFigs = '';
          this.exact = true;
      } else {
          this.numSigFigs = numSigFigs;
          this.otherSigFigs = makeStringOfZeros(this.numSigFigs - 1);
          this.exact = false;
      }
      return true
  }


// not done
  setValueInfinity() {
    this.isAphysicsNumber = true;
    this.infinity = true;
    this.numSigFigs = Infinity;
    this.exact = true;
    this.firstSigFig = undefined;
    this.otherSigFigs = undefined;
    this.orderOfMagnitude = undefined;
    // positive attribute is set elsewhere is set elsewhere
  }



    duplicate() {
        const string = !this.zero ? `${this.positive === false ? '-' : ''}${this.firstSigFig}.${this.otherSigFigs}e${this.orderOfMagnitude}` : `${this.firstSigFig}.${this.otherSigFigs}`;
        const exact = this.numSigFigs === Infinity;
        const intermediateValue = this.intermediateValue;
        return new PhysicsNumber(string, intermediateValue, exact)
    }

    roundAndDuplicate(numSigFigs) {
        let tempMag = this.duplicate();
        tempMag.round(numSigFigs);
        return tempMag;
    }


  abs() {
      this.positive = true;
  }

  setZeroLimit(newZeroLimit) { // for low values (less than order og magnitude -10; ensures they will not be erased automatically during operations
    this.zeroLimit = newZeroLimit;
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

  /// PRIVATE FUNCTION
  roundToFewerSigFigs(newSigFigs) {
      this.numSigFigs = newSigFigs;
      let numString = this.firstSigFig + this.otherSigFigs;
      let testChar = numString[newSigFigs];
      let numStringNew = numString.slice(0,newSigFigs);
      if (testChar === '0' || testChar === '1' || testChar === '2' || testChar === '3' || testChar === '4') {  // round down
          this.firstSigFig = numStringNew[0];
          this.otherSigFigs = numStringNew.slice(1,newSigFigs); /// chech this
      } else { // round up
          if (allNines(numString)) { // numstring is all 9s
              numStringNew = '1';
              let k;
              for (k = 0; k < this.numSigFigs - 1; k++) {
                  numStringNew = numStringNew + '0';
              }
              this.orderOfMagnitude += 1;
          } else { /// numstring not all 9s
              let index = newSigFigs - 1;
              while (numStringNew[index] === '9') {
                  numStringNew = reassignDigit(numStringNew, index, '0');
                  index--;
              }
              numStringNew = roundUpDigit(numStringNew,index);
          }
          this.firstSigFig = numStringNew[0];
          this.otherSigFigs = numStringNew.slice(1,numStringNew.length);
      }
  }

  round(newSigFigs) {
    if (newSigFigs > this.numSigFigs) {
        // console.log('unable to add significant figures to a magnitude');
        return this
    } else if (newSigFigs === this.numSigFigs) {
        return this
    } else if (this.numSigFigs === Infinity) {
        let i;
        for (i = 0; i < newSigFigs+ 2; i++) {
            this.otherSigFigs = this.otherSigFigs + '0'; // add lots of zeros, then round to fewer sig figs
        }
        this.roundToFewerSigFigs(newSigFigs);
    } else {
        this.roundToFewerSigFigs(newSigFigs)
    }
  }

  // what about signs????
  /// need to work on the 'exactly!!!!'
  printStandardNotation() { // returns false if this is impossible to the correct number of significant figures
      if (this.zero) {
          return this.printZero()
      }
      const sign = !this.positive ? '-' : '';
    if (this.orderOfMagnitude > 0 && this.orderOfMagnitude > this.numSigFigs - 1) {
        if (this.otherSigFigs[this.numSigFigs - 2] === '0') {
            return this.printScientificNotation(); /// in this event, you cannot print a standard notation number with the correct number of significant figures
        }
        return `${sign}${this.firstSigFig}${this.otherSigFigs}${makeStringOfZeros(this.orderOfMagnitude - this.numSigFigs + 1)}` // a special case => what about a number with SIGNIFICANT zeros on the end
    } else if (this.orderOfMagnitude > 0 && this.orderOfMagnitude === this.numSigFigs - 1) {
        return `${sign}${this.firstSigFig}${this.otherSigFigs}${this.otherSigFigs[this.numSigFigs - 2] === '0' ? '.' : ''}`
    } else if (this.orderOfMagnitude > 0 && this.orderOfMagnitude < this.numSigFigs - 1) {
        return `${sign}${this.firstSigFig}${this.otherSigFigs.slice(0,this.orderOfMagnitude)}.${this.otherSigFigs.slice(this.orderOfMagnitude, this.numSigFigs - 1)}`
    } else if (this.orderOfMagnitude === 0) {
        if (this.otherSigFigs.length > 0) {
            return `${sign}${this.firstSigFig}.${this.otherSigFigs}`
        } else {
            return `${sign}${this.firstSigFig}`
        }
    } else if (this.orderOfMagnitude < 0) {
        return `${sign}0.${makeStringOfZeros(Math.abs(this.orderOfMagnitude) - 1)}${this.firstSigFig}${this.otherSigFigs}`
    }
    /// what about zeros???
  }

  /// private function
  printZero() {
    const exactly = (this.numSigFigs === Infinity) ? 'exactly ' : '';
      if (this.zero) {
        if (this.numSigFigs === Infinity || this.numSigFigs === 1) {
            return `${exactly}0`
        } else {
            return `0.${this.otherSigFigs}`
        }
      } else {
          return undefined
      }
  }

  printScientificNotation() {
      if (this.zero) {
          return this.printZero()
      }
      const exactly = (this.numSigFigs === Infinity) ? 'exactly ' : '';
      if (this.numSigFigs === 1) {
          return `${this.firstSigFig}e${String(this.orderOfMagnitude)}`;
      } else {
          return `${exactly}${this.firstSigFig}.${this.otherSigFigs}e${String(this.orderOfMagnitude)}`;
      }
  }

  printOptimal() { // if print exactly is selected, it prints the word exatly
      if (this.zero) {
          return this.printZero()
      }
      let standardNot = this.printStandardNotation();
      let sciNot = this.printScientificNotation();
      return standardNot.length <= sciNot.length ? standardNot : sciNot
  }

/// what if negative???
  getFloat(abs = false) { // argument is to get absolute value
      let sign = this.positive || abs ? 1 : -1;
      if (this.infinity) {
        return Infinity * sign;
      } else if (this.zero) {
        return 0;
      } else if (this.intermediateValue) {
        return this.intermediateValue;
      } else {
        return Number(`${this.firstSigFig}.${this.otherSigFigs}e${this.orderOfMagnitude}`) * sign;
      }
  }


    // what about signs?????
    comparisonTest(type, anotherMagnitude, numSigFigs = Math.min(this.numSigFigs, anotherMagnitude.numSigFigs)) {
      if (numSigFigs > Math.min(this.numSigFigs, anotherMagnitude.numSigFigs)) { // asking for more sig figs than you actually have
            /*
            In this case, i need to figure out if they COULD possibly be equal, or not, to a greater number of sig figs
            example:
            0.5 and 0.456, no
            to one sig fig these are equal
            to two or more sig figs, we are not sure, they could be equal, greater, or less

            but, 8.0 and 4
            no matter how many sig figs you have, will never be equal!
             */
            let tempMag1, tempMag2;
            if (this.numSigFigs < anotherMagnitude.numSigFigs) {
                tempMag1 = this.duplicate();
                tempMag2 = anotherMagnitude.roundAndDuplicate(this.numSigFigs);
            } else if (this.numSigFigs === anotherMagnitude.numSigFigs) {
                tempMag1 = this.duplicate();
                tempMag2 = anotherMagnitude.duplicate();
            } else if (this.numSigFigs > anotherMagnitude.numSigFigs) {
                tempMag1 = this.roundAndDuplicate(anotherMagnitude.numSigFigs);
                tempMag2 = anotherMagnitude.duplicate();
            }
            if (this.comparePhysicsNumbersWithEqualNumbersOfSigFigs('=', tempMag1, tempMag2)) {
                return undefined // if equal when rounded to the same number of significant figures, then you cannot conduct a comparison test
            } else { ///
                return this.comparePhysicsNumbersWithEqualNumbersOfSigFigs(type, tempMag1, tempMag2) // otherwise, you can compare them once they are the same number of sig figs
            }
        } else if (numSigFigs <= Math.min(this.numSigFigs, anotherMagnitude.numSigFigs) && numSigFigs < Infinity) { // asking for fewer sig figs than you have (what about exact????)
            const tempMag1 = this.roundAndDuplicate(numSigFigs);
            const tempMag2 = anotherMagnitude.roundAndDuplicate(numSigFigs); // now they have the same number of sig figs
            return this.comparePhysicsNumbersWithEqualNumbersOfSigFigs(type, tempMag1, tempMag2)
        } else if (numSigFigs <= Math.min(this.numSigFigs, anotherMagnitude.numSigFigs) && numSigFigs === Infinity) {
            // two exact numbers
            return this.comparePhysicsNumbersWithEqualNumbersOfSigFigs(type, this, anotherMagnitude);
            return undefined
        }
    }

    // private function!!!
    compareInfinities(anotherMagnitude) {
      if (this.infinity && anotherMagnitude.infinity) {
          if (this.positive && anotherMagnitude.positive) {
              return '='
          } else if (!this.positive && !anotherMagnitude.positive) {
              return '='
          } else if (this.positive && !anotherMagnitude.positive) {
              return '>'
          } else if (!this.positive && anotherMagnitude.positive) {
              return '<'
          }
      } else if (this.infinity) {
          if (this.positive) {
              return '>'
          } else {
              return '<'
          }
      } else if (anotherMagnitude.infinity) {
          if (anotherMagnitude.positive) {
              return '<'
          } else {
              return '>'
          }
      } else {
          return undefined
      }
    }

    // testes if equal up to a certain number of sig figs
    isEqualTo(anotherMagnitude, numSigFigs) {
        if (this.compareInfinities(anotherMagnitude)) {
            if (this.compareInfinities(anotherMagnitude) === '=') {
                return true
            } else {
                return false
            }
        } else {
            return this.comparisonTest('=', anotherMagnitude, numSigFigs)
        }
    }

    isGreaterThan(anotherMagnitude, numSigFigs) {
        if (this.compareInfinities(anotherMagnitude)) {
            if (this.compareInfinities(anotherMagnitude) === '>') {
                return true
            } else {
                return false
            }
        } else {
            return this.comparisonTest('>', anotherMagnitude, numSigFigs)
        }
    }
    isLessThan(anotherMagnitude, numSigFigs) {
        if (this.compareInfinities(anotherMagnitude)) {
            if (this.compareInfinities(anotherMagnitude) === '<') {
                return true
            } else {
                return false
            }
        } else {
            return this.comparisonTest('<', anotherMagnitude, numSigFigs)
        }
    }
    isGreaterThanOrEqualTo(anotherMagnitude, numSigFigs) {
        if (this.compareInfinities(anotherMagnitude)) {
            let test = this.compareInfinities(anotherMagnitude);
            if (test === '>' || test ==='=') {
                return true
            } else {
                return false
            }
        } else {
            return this.comparisonTest('>=', anotherMagnitude, numSigFigs)
        }
    }

    isLessThanOrEqualTo(anotherMagnitude, numSigFigs) {
        if (this.compareInfinities(anotherMagnitude)) {
            let test = this.compareInfinities(anotherMagnitude);
            if (test === '<' || test ==='=') {
                return true
            } else {
                return false
            }
        } else {
            return this.comparisonTest('<=', anotherMagnitude, numSigFigs)
        }
    }

    //// PRIVATE FUNCTION!
    comparePhysicsNumbersWithEqualNumbersOfSigFigs(type, tempMag1, tempMag2) {
        const string1 = !tempMag1.zero ? `${tempMag1.positive === false ? '-' : ''}${tempMag1.firstSigFig}.${tempMag1.otherSigFigs}e${tempMag1.orderOfMagnitude}` : `${tempMag1.firstSigFig}.${tempMag1.otherSigFigs}`;
        const string2 = !tempMag2.zero ? `${tempMag1.positive === false ? '-' : ''}${tempMag2.firstSigFig}.${tempMag2.otherSigFigs}e${tempMag2.orderOfMagnitude}` : `${tempMag2.firstSigFig}.${tempMag2.otherSigFigs}`;
        const num1 = Number(string1); // do not use getFloat(), because intermediate values should not be used for comparison testing
        const num2 = Number(string2);
        if (type === '=') {
            return num1 === num2
        } else if (type === '>') {
            return num1 > num2
        } else if (type === '<') {
            return num1 < num2
        } else if (type === '>=') {
            return num1 >= num2
        } else if (type === '<=') {
            return num1 <= num2
        }
    }

}
