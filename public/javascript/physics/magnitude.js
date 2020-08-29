

/*
how do i set a magnitude to infinity
*/

/*
think about how i deal with units of zero,
maybe there should be an 'aspiring unit?????', because in later functions that employ units
having a zero screws it up
*/


// essentially a physics number with units
class Magnitude extends PhysicsNumber {
  constructor(numericalString, unitObject, intermediateValue, exact = false) {
    this.unit = unitObject;

  }


  duplicate() {
    const string = `${this.sign === false ? '-' : ''}${this.firstSigFig}.${this.otherSigFigs}e${this.orderOfMagnitude}`;
    const exact = this.numSigFigs === Infinity;
    const = this.unit;
    const intermediateValue = this.intermediateValue;
    return new Magnitude(string, unit, intermediateValue, exact)

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

  // what about signs?????
  comparisonTest(type, anotherMagnitude, numSigFigs = Math.min(this.numSigFigs, anotherMagnitude.numSigFigs)) {
      if (this.unit !== anotherMagnitude.unit) { // cannot compare magnitudes of different units
          return undefined
      } else if (numSigFigs > Math.min(this.numSigFigs, anotherMagnitude.numSigFigs)) { // asking for more sig figs than you actually have
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
          if (this.compareMagnitudesWithEqualNumbersOfSigFigs('=', tempMag1, tempMag2)) {
              return undefined // if equal when rounded to the same number of significant figures, then you cannot conduct a comparison test
          } else { ///
              return this.compareMagnitudesWithEqualNumbersOfSigFigs(type, tempMag1, tempMag2) // otherwise, you can compare them once they are the same number of sig figs
          }
      } else if (numSigFigs <= Math.min(this.numSigFigs, anotherMagnitude.numSigFigs) && numSigFigs < Infinity) { // asking for fewer sig figs than you have (what about exact????)
          const tempMag1 = this.roundAndDuplicate(numSigFigs);
          const tempMag2 = anotherMagnitude.roundAndDuplicate(numSigFigs); // now they have the same number of sig figs
          return this.compareMagnitudesWithEqualNumbersOfSigFigs(type, tempMag1, tempMag2)
      } else if (numSigFigs <= Math.min(this.numSigFigs, anotherMagnitude.numSigFigs) && numSigFigs === Infinity) {
          // two exact numbers
          return this.compareMagnitudesWithEqualNumbersOfSigFigs(type, this, anotherMagnitude)
          return undefined
      }
  }

  // testes if equal up to a certain number of sig figs
  isEqualTo(anotherMagnitude, numSigFigs) {
          return this.comparisonTest('=', anotherMagnitude, numSigFigs)
  }

  isGreaterThan(anotherMagnitude, numSigFigs) {
      return this.comparisonTest('>', anotherMagnitude, numSigFigs)
  }
  isLessThan(anotherMagnitude, numSigFigs) {
      return this.comparisonTest('<', anotherMagnitude, numSigFigs)
  }
  isGreaterThanOrEqualTo(anotherMagnitude, numSigFigs) {
      return this.comparisonTest('>=', anotherMagnitude, numSigFigs)
  }

  isLessThanOrEqualTo(anotherMagnitude, numSigFigs) {
      return this.comparisonTest('<=', anotherMagnitude, numSigFigs)
  }

  //// PRIVATE FUNCTION!
  compareMagnitudesWithEqualNumbersOfSigFigs(type, tempMag1, tempMag2) {
      const num1 = Number(`${tempMag1.sign===false ? '-' : ''}${tempMag1.firstSigFig}.${tempMag1.otherSigFigs}e${tempMag1.orderOfMagnitude}`); // do not use getFloat(), because intermediate values should not be used for comparison testing
      const num2 = Number(`${tempMag2.sign===false ? '-' : ''}${tempMag2.firstSigFig}.${tempMag2.otherSigFigs}e${tempMag2.orderOfMagnitude}`);
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


  // PRIVATE METHOD!!!!
  // for addition, subtraction, pythagorean addition, pythagorean subtraction
  addOrSubtract(operation, anotherMagnitude, zeroLimit = this.zeroLimit) {
      let canIdoIt; // you can only add or subtract magnitudes of the same unit, but any zero can always be added or subtracted
      if (this.unit === undefined && anotherMagnitude.unit === undefined) { // two undefined functions can be added
          canIdoIt = true;
      } else if (this.zero || anotherMagnitude.zero) { // zero can be added to any unit
          canIdoIt = true;
      } else if (this.unit === undefined || anotherMagnitude.unit === undefined) {
          canIdoIt = false;
      } else {
          canIdoIt = areSameUnit(this.unit, anotherMagnitude.unit)
      }
      if (!canIdoIt) {
          return false
      }

      // get new unit
      let newUnit;
      if (this.zero && anotherMagnitude.zero) { // can add two zeros to get another zero, which is unitless [redundant???]
          newUnit = undefined;
      } else if (this.zero) { // can add this unit to a zero and get this magnitude again [unless the zero has fewer sig figs]
          newUnit = anotherMagnitude.unit;
      } else { // either the same unit, or the other magnitude is zero
          newUnit = this.unit
      }

      const newSigFigs = Math.min(this.numSigFigs, anotherMagnitude.numSigFigs);

      const exact = newSigFigs === Infinity;
      let newFloat;
      if (operation === '+') {
          newFloat = this.getFloat() + anotherMagnitude.getFloat();
      } else if (operation === '-') {
          newFloat = this.getFloat() - anotherMagnitude.getFloat();
      } else if (operation === 'pythagorean_+') {
          newFloat = Math.sqrt(this.getFloat()**2 + anotherMagnitude.getFloat()**2);
      } else if (operation === 'pythagorean_-') {
          newFloat = Math.sqrt(this.getFloat()**2 - anotherMagnitude.getFloat()**2);
      }
      return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, zeroLimit)
  }

  addMag(anotherMagnitude, zeroLimit) {
      return this.addOrSubtract('+', anotherMagnitude, zeroLimit)
  }

  subtractMag(anotherMagnitude, zeroLimit) {
    return this.addOrSubtract('-', anotherMagnitude, zeroLimit)
  }

  pythagoreanAddMag(anotherMagnitude, zeroLimit) {
    return this.addOrSubtract('pythagorean_+', anotherMagnitude, zeroLimit)
  }

  pythagoreanSubtractMag(anotherMagnitude, zeroLimit) {
    return this.addOrSubtract('pythagorean_-', anotherMagnitude, zeroLimit)
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

  inverse() {
    return new Magnitude('1', undefined, undefined, true).divideMag(this);
  }

  multiplyMagExactConstant(exactConstant) {
      return constructMagnitudeFromFloat(this.getFloat() * exactConstant, this.numSigFigs, this.unit, this.exact, this.zeroLimit);
  }

    divideMagExactConstant(exactConstant) {
        return constructMagnitudeFromFloat(this.getFloat() / exactConstant, this.numSigFigs, this.unit, this.exact, this.zeroLimit);
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

    inverseSinMag() {
        if (this.unit !== undefined) {
            console.log('can only complete trig functions on a unitless quantity');
            return false
        }
        const newFloat = Math.asin(this.getFloat());
        const newSigFigs = Math.min(this.numSigFigs, 15);
        const exact = false; // // this operation always reduces the number of sig figs to 15
        return constructAngleFloat(newFloat, newSigFigs, false, exact, this.zeroLimit)
    }
    inverseCosMag() {
        if (this.unit !== undefined) {
            console.log('can only complete trig functions on a unitless quantity');
            return false
        }
        const newFloat = Math.acos(this.getFloat());
        const newSigFigs = Math.min(this.numSigFigs, 15);
        const exact = false; // this operation always reduces the number of sig figs to 15
        const newUnit = undefined;
        return constructAngleFloat(newFloat, newSigFigs, false, exact, this.zeroLimit)

    }
    inverseTanMag() {
        if (this.unit !== undefined) {
            console.log('can only complete trig functions on a unitless quantity');
            return false
        }
        const newFloat = Math.atan(this.getFloat());
        const newSigFigs = Math.min(this.numSigFigs, 15);
        const exact = false; // this operation always reduces the number of sig figs to 15
        const newUnit = undefined;
        return constructAngleFloat(newFloat, newSigFigs, false, exact, this.zeroLimit)
    }
}

// keep working
function constructMagnitudeFromFloat(float, numSigFigs, unitObject, exact = false, zeroLimit = 1e-10) {
    if (numSigFigs === Infinity) {
      numSigFigs = undefined;
      exact = true;
    }
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

function constructZeroMagnitude(numSigFigs, exact = !numSigFigs ? true : false) { /// if nothing is entered, numSigFigs is false
    let string = '0.';
    if (!exact < numSigFigs !== Infinity) {
        string = string + makeStringOfZeros(numSigFigs - 1);
    }
    return new Magnitude(string,undefined,undefined,exact);
}
