
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

/*
how do i set a magnitude to infinity
*/


// look up my previous work on numerical strings!
class Magnitude {
  constructor(numericalString, unitObject, intermediateValue, exact = false) {
    this.firstSigFig = undefined;
    this.otherSigFigs = undefined;
    this.orderOfMagnitude = undefined;
    this.numSigFigs = undefined;
    this.positive = undefined;
    this.isAmagnitude = undefined;
    this.zeroLimit = undefined;

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

    if (exact) {
      this.numSigFigs = Infinity;
      this.exact = true;
    } else {
        this.exact = false;
    }
    this.intermediateValue = intermediateValue ? intermediateValue : undefined; /// in case this magnitude is an 'intermediate step' within a larger problem

    if (this.orderOfMagnitude < -8) { /// for all operations, if it goes below this value, it will round down to zero
        this.zeroLimit = 10**(this.orderOfMagnitude - 3);
    } else {
        this.zeroLimit = 1e-10;
    }
    this.unit = unitObject;

  }

  invalidate() {
      this.isAmagnitude = false;
      this.firstSigFig = undefined;
      this.otherSigFigs = undefined;
      this.orderOfMagnitude = undefined;
      this.numSigFigs = undefined;
      this.positive = undefined;
      this.exact = undefined;
      return false
  }

  setValueZero(numSigFigs = 1, exact = false) {
      this.isAmagnitude = true;
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


/*
this.firstSigFig = undefined;
this.otherSigFigs = undefined;
this.orderOfMagnitude = undefined;
this.numSigFigs = undefined;
this.positive = undefined;
this.isAmagnitude = undefined;
*/

// not done
  setValueInfinity() {
    this.isAmagnitude = true;
    this.infinity = true;
    this.numSigFigs = Infinity;
    this.exact = true;
    this.positive = true;
    this.firstSigFig = undefined;
    this.otherSigFigs = undefined;
    this.orderOfMagnitude = undefined;
  }

  //// PRIVATE METHOD!!! [but i'm using it in the point object]
  reverseSign() {
      if (this.zero) {
          return false
      } else {
          console.log(this.positive);
          this.positive = !this.positive;
          console.log(this.positive);
      }
  }

  abs() {
      this.positive = true;
  }

  setValueNegInfinity() {
    this.setValueInfinity();
    this.reverseSign();
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

  round(newSigFigs) {
    if (newSigFigs > this.numSigFigs) {
        // console.log('unable to add significant figures to a magnitude');
        return this
    } else if (newSigFigs === this.numSigFigs) {
        return this
    } else {
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
  }

  /// rework this to make it works with either names or derivation????
    // check that they have the same DIMENSION, and if they do complete the operation...
  convertUnit(newUnitObject) {
    if (this.unit === undefined) {
        console.log('ERROR: cannot convert a unitless magnitude');
        return false
    } else if (areTwoUnitsTheSameDimension(this.unit, newUnitObject)) {
        console.log('ERROR: cannot convert to unit of a different dimension'); // add some more informaiton
        return false
    } else {
        const conversionFactor = this.unit.conversion_factor / newUnitObject.conversion_factor; // how many sig figs are in this conversion factor? is that being considered???
        const newFloat = this.getFloat() * conversionFactor;
        return constructMagnitudeFromFloat(newFloat, this.numSigFigs, newUnitObject, this.exact, this.zeroLimit);
        // I don't like this!!! I wish it would not create a new magnitude, but it would retain the original one, just with a new unit
        // i could do that if i take most of the constructor function and put it into a function, then run that function
    }
  }

  getString(abbreviateUnit = true) {
    // let printUnit = abbreviateUnit ? this.unit.abbreviation : this.unit.name;  FOR ONCE I FIX THIS!!!!
      let printUnit = this.unit;
      // determine the best way to write it
  }

  // what about signs????
  printStandardNotation() { // returns false if this is impossible to the correct number of significant figures
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

  printScientificNotation() {
      if (this.numSigFigs === 1) {
          return `${this.firstSigFig}e${String(this.orderOfMagnitude)}`;
      } else {
          return `${this.firstSigFig}.${this.otherSigFigs}e${String(this.orderOfMagnitude)}`;
      }
  }

  printOptimal() {
      let standardNot = this.printStandardNotation();
      let sciNot = this.printScientificNotation();
      return standardNot.length <= sciNot.length ? standardNot : sciNot
  }

/// what if negative???
  getFloat(abs = false) { // argument is to get absolute value
      let val;
      let sign = this.positive || abs ? 1 : -1;
      if (this.infinity) {
        val = Infinity * sign;
      } else if (this.zero) {
        val = 0;
      } else if (this.intermediateValue) {
        val = this.intermediateValue;
      } else {
        val = Number(`${this.firstSigFig}.${this.otherSigFigs}e${this.orderOfMagnitude}`) * sign;
      }
      return val
  }

  // see if this works with my changes to the unit object
  testSameUnit(anotherMagnitude) {
      if (this.unit === undefined && anotherMagnitude.unit === undefined) {
          return true
      } else if (this.zero || anotherMagnitude.zero) { // zero can be added to any unit
        return true
      } else if (this.unit === undefined || anotherMagnitude.unit === undefined) {
          return false
      } else {
          return this.unit.name === anotherMagnitude.unit.name // how do i deal with derived units??
      }
  }

  canAddVectors() {

  }

  addMag(anotherMagnitude) {
      if (!this.testSameUnit(anotherMagnitude)) {
          console.log('ERROR: cannot add magnitudes of different unit'); // add an automatic conversion?
          return false
      }
      const newSigFigs = Math.min(this.numSigFigs, anotherMagnitude.numSigFigs);
      let newUnit;
      if (this.zero && anotherMagnitude.zero) { // can add two zeros to get another zero, which is unitless [redundant???]
        newUnit = undefined;
      } else if (this.zero) { // can add this unit to a zero and get this magnitude again [unless the zero has fewer sig figs]
        newUnit = anotherMagnitude.unit;
      } else {
        newUnit = this.unit
      }
      const exact = newSigFigs === Infinity;
      const newFloat = this.getFloat() + anotherMagnitude.getFloat();
      return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, this.zeroLimit)
  }

  ///8-21-2020: several times I've tried to fix this by putting it in terms of addMag,
    // reducing repeated code, but it keeps failing when I do that
  subtractMag(anotherMagnitude) {
      if (!this.testSameUnit(anotherMagnitude)) {
          console.log('ERROR: cannot add magnitudes of different unit'); // add an automatic conversion?
          return false
      }
      const newSigFigs = Math.min(this.numSigFigs, anotherMagnitude.numSigFigs);
      let newUnit;
      if (this.zero && anotherMagnitude.zero) { // can add two zeros to get another zero, which is unitless [redundant???]
          newUnit = undefined;
      } else if (this.zero) { // can add this unit to a zero and get this magnitude again [unless the zero has fewer sig figs]
          newUnit = anotherMagnitude.unit;
      } else {
          newUnit = this.unit
      }
      const exact = newSigFigs === Infinity;
      const newFloat = this.getFloat() - anotherMagnitude.getFloat();
      return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, this.zeroLimit)
  }

  multiplyMag(anotherMagnitude) {
      const newSigFigs = Math.min(this.numSigFigs, anotherMagnitude.numSigFigs);
      const newUnit = multiplyUnits(this.unit, anotherMagnitude.unit);
      const exact = newSigFigs === Infinity;
      const newFloat = this.getFloat() * anotherMagnitude.getFloat();
      return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact)
  }

  divideMag(anotherMagnitude) {
      const newSigFigs = Math.min(this.numSigFigs, anotherMagnitude.numSigFigs);
      const newUnit = divideUnits(this.unit, anotherMagnitude.unit);
      const exact = newSigFigs === Infinity;
      const newFloat = this.getFloat() / anotherMagnitude.getFloat();
      return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, this.zeroLimit)
  }

  multiplyMagExactConstant(exactConstant) {
      return constructMagnitudeFromFloat(this.getFloat() * exactConstant, this.numSigFigs, this.unit, this.exact, this.zeroLimit);
  }

  squareMag() {
    const newSigFigs = this.numSigFigs;
    const newUnit = multiplyUnits(this.unit, this.unit);
    const exact = this.numSigFigs === Infinity;
    const newFloat = this.getFloat()**2;
    return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, this.zeroLimit)
  }

  squareRootMag() {
      const newSigFigs = this.numSigFigs;
      const newUnit = multiplyUnits(this.unit, this.unit);
      const exact = this.numSigFigs === Infinity;
      const newFloat = Math.sqrt(this.getFloat()**2);
      return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, this.zeroLimit)
  }

  powerMag(exponent) {
      const newSigFigs = this.numSigFigs;
      const newUnit = multiplyUnits(this.unit, this.unit);
      const exact = this.numSigFigs === Infinity;
      const newFloat = this.getFloat()**exponent;
      return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, this.zeroLimit)
  }

  pythagoreanAddMag(anotherMagnitude) {
      if (!this.testSameUnit(anotherMagnitude)) {
          console.log('ERROR: cannot add magnitudes of different unit'); // add an automatic conversion?
          return false
      }
      const newSigFigs = Math.min(this.numSigFigs, anotherMagnitude.numSigFigs);
      const newUnit = this.unit;
      const exact = newSigFigs === Infinity;
      const newFloat = Math.sqrt(this.getFloat()**2 + anotherMagnitude.getFloat()**2);
      return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, this.zeroLimit)
  }

    pythagoreanSubtractMag(anotherMagnitude) {
        if (!this.testSameUnit(anotherMagnitude)) {
            console.log('ERROR: cannot add magnitudes of different unit'); // add an automatic conversion?
            return false
        }
        const newSigFigs = Math.min(this.numSigFigs, anotherMagnitude.numSigFigs);
        const newUnit = this.unit;
        const exact = newSigFigs === Infinity;
        const newFloat = Math.sqrt(this.getFloat()**2 - anotherMagnitude.getFloat()**2);
        return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, this.zeroLimit)
    }



  // trig functions: too much repeated code here!!!
    // make a private function that brings these together
  sinMag() {
    if (this.unit !== undefined) {
        console.log('can only complete trig functions on a unitless quantity');
        return false
    }
    const newFloat = Math.sin(this.getFloat());
    const newSigFigs = this.numSigFigs;
    const exact = newSigFigs === Infinity;
    const newUnit = undefined;
    return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, this.zeroLimit)
  }

  cosMag() {
      if (this.unit !== undefined) {
          console.log('can only complete trig functions on a unitless quantity');
          return false
      }
      const newFloat = Math.cos(this.getFloat());
      const newSigFigs = this.numSigFigs;
      const exact = newSigFigs === Infinity;
      const newUnit = undefined;
      return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, this.zeroLimit)
  }

  tanMag() {
      if (this.unit !== undefined) {
          console.log('can only complete trig functions on a unitless quantity');
          return false
      }
      const newFloat = Math.tan(this.getFloat());
      const newSigFigs = this.numSigFigs;
      const exact = newSigFigs === Infinity;
      const newUnit = undefined;
      return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, this.zeroLimit)
  }


    inverseSinMag() {
        if (this.unit !== undefined) {
            console.log('can only complete trig functions on a unitless quantity');
            return false
        }
        const newFloat = Math.asin(this.getFloat());
        const newSigFigs = this.numSigFigs;
        const exact = newSigFigs === Infinity;
        return constructAngleFloat(newFloat, newSigFigs, false, exact, this.zeroLimit)
    }
    inverseCosMag() {
        if (this.unit !== undefined) {
            console.log('can only complete trig functions on a unitless quantity');
            return false
        }
        const newFloat = Math.acos(this.getFloat());
        const newSigFigs = this.numSigFigs;
        const exact = newSigFigs === Infinity;
        const newUnit = undefined;
        return constructAngleFloat(newFloat, newSigFigs, false, exact, this.zeroLimit)

    }
    inverseTanMag() {
        if (this.unit !== undefined) {
            console.log('can only complete trig functions on a unitless quantity');
            return false
        }
        const newFloat = Math.atan(this.getFloat());
        const newSigFigs = this.numSigFigs;
        const exact = newSigFigs === Infinity;
        const newUnit = undefined;
        return constructAngleFloat(newFloat, newSigFigs, false, exact, this.zeroLimit)
    }
}

// keep working
function constructMagnitudeFromFloat(float, numSigFigs = 3, unitObject, exact = false, zeroLimit = 1e-10) {
    if (Math.abs(float) < zeroLimit) {
        return constructZeroMagnitude(numSigFigs, exact);
    } else {
        return new Magnitude(float.toExponential(numSigFigs - 1), unitObject, float, exact) // saves the intermediate value to use in future operations
    }
}
/// a big issue:
/// very small values, made from operating on floating points, are not being roudned to zero
// but i don't want to automatically round them, becuase i don't want to confuse them with actualy very small values!!!
/// this is going to take some thought....
// add a 'zero limit' argument, anything under that is roudned to zero???  think that over

function constructZeroMagnitude(numSigFigs = 3, exact = true) { /// what about intermediate value??? can zero still have intermediate value????
    let string = '0.';
    if (!exact < numSigFigs !== Infinity) {
        string = string + makeStringOfZeros(numSigFigs - 1);
    }
    return new Magnitude(string,undefined,exact);
}


//  constructor(numericalString, unitObject, intermediateValue, exact = false) {
class Angle extends Magnitude {
    constructor(numString, degrees = true, intermediateValue, exact = false) {
        super(numString, undefined, intermediateValue, exact);
        this.degrees = degrees;

        // add routine to ensure that it is between 0 and 360
        // or some other requirement
    }

    getFloat() { /// float is always in radians, even when the information is in degrees
        let float = super.getFloat();
        if (this.degrees) {
            float *= (Math.PI / 180);
        }
        return float
    }
    // add trigonometric functions to replace those above?
    // or do the ones above work fine?????
    // get rid of the 'degree functions' above, and just go with the radian functions

    printString() {

    }

    printStringInTermsOfPi() {

    }

}

//    return new Magnitude(float.toExponential(numSigFigs - 1), unitObject, float, exact) // saves the intermediate value to use in future operations
//     constructor(numString, degrees = true, intermediateValue, exact = false) {

function constructAngleFloat(float, numSigFigs, degrees = true, exact = false, zeroLimit) {
  return new Angle(float.toExponential(numSigFigs - 1), degrees, float, exact)
}

function constructZeroAngle(float, numSigFigs, exact = false) {
    let string = '0.';
    if (!exact < numSigFigs !== Infinity) {
        let i;
        for (i = 0; i < numSigFigs - 1; i++) {
            string = string + '0'; /// inefficient? can i bypass the typical constructor?
        }
    }
    return new Angle(string,undefined, undefined,exact);

}