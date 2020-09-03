

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
    super(numericalString, intermediateValue, exact);
    this.isAmagnitude = this.isAphysicsNumber; // will need to consider units here!!
    this.unit = unitObject;

  }


  duplicate() {
    const string = !this.zero ? `${this.positive === false ? '-' : ''}${this.firstSigFig}.${this.otherSigFigs}e${this.orderOfMagnitude}` : `${this.firstSigFig}.${this.otherSigFigs}`;
    const exact = this.numSigFigs === Infinity;
    const unit = this.unit;
    const intermediateValue = this.intermediateValue;
    return new Magnitude(string, unit, intermediateValue, exact)
  }

  roundAndDuplicate(numSigFigs) {
      let tempMag = this.duplicate();
      tempMag.round(numSigFigs);
      return tempMag;
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

    // testes if equal up to a certain number of sig figs
    isEqualTo(anotherMagnitude, numSigFigs) {
      if (this.testSameUnit(anotherMagnitude)) { // it should really compare different units that are the same dimension, eg. metesr and feet can be compared
        return super.isEqualTo(anotherMagnitude, numSigFigs)
      }
    }

    isGreaterThan(anotherMagnitude, numSigFigs) {
        if (this.testSameUnit(anotherMagnitude)) { // it should really compare different units that are the same dimension, eg. metesr and feet can be compared
            return super.isGreaterThan(anotherMagnitude, numSigFigs)
        }
    }

    isLessThan(anotherMagnitude, numSigFigs) {
        if (this.testSameUnit(anotherMagnitude)) { // it should really compare different units that are the same dimension, eg. metesr and feet can be compared
            return super.isLessThan(anotherMagnitude, numSigFigs)
        }
    }

    isGreaterThanOrEqualTo(anotherMagnitude, numSigFigs) {
        if (this.testSameUnit(anotherMagnitude)) { // it should really compare different units that are the same dimension, eg. metesr and feet can be compared
            return super.isGreaterThanOrEqualTo(anotherMagnitude, numSigFigs)
        }
    }

    isLessThanOrEqualTo(anotherMagnitude, numSigFigs) {
        if (this.testSameUnit(anotherMagnitude)) { // it should really compare different units that are the same dimension, eg. metesr and feet can be compared
            return super.isLessThanOrEqualTo(anotherMagnitude, numSigFigs)
        }
    }


    reverseSign() {
        let newNumber = this.duplicate();
        if (newNumber.zero) {
            return newNumber
        } else {
            newNumber.positive = !newNumber.positive;
            if (this.intermediateValue) {
                newNumber.intermediateValue *= -1; // this was a good bug to find! 8-31-2020, 2:30 pm!
            }
            return newNumber
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
      if (!this.infinity && anotherMagnitude.infinity) {
          return constructZeroMagnitude()
      } else if (this.infinity && anotherMagnitude.infinity) {
          return constructInvalidMagnitude()
      }
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
    if (isNaN(float)) {
        return constructInvalidMagnitude
    }
    if (float === Infinity) {
        return constructInfinity(unitObject)
    } else if (float === -Infinity) {
        return constructNegativeInfinity(unitObject)
    }
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

function constructZeroMagnitude(numSigFigs, exact = numSigFigs === undefined) { /// if nothing is entered, numSigFigs is false
    let string = '0.';
    if (!exact < numSigFigs !== Infinity) {
        string = string + makeStringOfZeros(numSigFigs - 1);
    }
    return new Magnitude(string,undefined,undefined,exact);
}

function constructInfinity(unitObject) {
    return new Magnitude('+Infinity', unitObject, undefined, undefined)
}

function constructNegativeInfinity(unitObject) {
    return new Magnitude('-Infinity', unitObject, undefined, undefined)
}

function constructInvalidMagnitude() {
    return new Magnitude('NaN');ss
}