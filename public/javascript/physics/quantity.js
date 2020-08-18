/*
This is to create numbers with eignificant figures


Do I need to program all of my other programs, like geometry and functions and problems,
to accept physics numbers as values?????

*/

function isDigit(letter) {
  return (letter === '1' || letter === '2' || letter === '3' || letter === '4' || letter === '5' || letter === '6' || letter ==='7' || letter === '8' || letter === '9' || letter === '0')
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

// look up my previous work on numerical strings!
class Magnitude {
  constructor(numericalString, unit, exact = false) {
    this.isAmagnitude = true;
    this.unit = unit;

    this.firstSigFig = undefined;
    this.otherSigFigs = undefined;
    this.orderOfMagnitude = undefined;
    this.numSigFigs = undefined;


    /// not sure i want this line...
    // this value is used for if a problem calls for continued operations
    this.floatValue = Number(numericalString);

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

class Direction {
  constructor() {

  }
}

// values in physics problems
// allow the mathematical methods to accept these as an input????
class Quantity {
  constructor(variable) {
    this.variable = variable;
  }
  // constructor(variable, unit, firstSigFig, otherSigFigs,exponent = 0, exact = false) {
  //   if (!isStringOfDigits(otherSigFigs) || !isDigit(firstSigFig) || !isInteger(exponent)) {
  //     return false
  //   }
  //   this.quantity = true;
  //   this.unit = unit;
  //   this.variable = variable;
  //   this.firstSigFig = firstSigFig;
  //   this.otherSigFigs = otherSigFigs;
  //   this.exponent = exponent;
  //   if (exact) {
  //     this.numSigFigs = Infinity;
  //   } else {
  //     this.numSigFigs = 1 + this.otherSigFigs.length;
  //   }
  //   // significant figure must be a string of digits
  // }
  //
  // stringSciNot() {
  //   let sign;
  //   if (exponent > 0) {
  //     sign = '+';
  //   } else if (exponent < 0) {
  //     sign = '-';
  //   } else if (exponent === 0) {
  //     sign = '';
  //   }
  //   return `${this.firstSigFig}.${this.otherSigFigs}e${sign}${Math.abs(this.exponent)}`
  // }
  //
  // stringStandardNot() {
  //
  // }
  //
  // getFloatingPoint() {
  //
  // }
  //
  // round() {
  //
  // }
  //
  //
  // /// operations between physics numbers
  // /// => convert to floating points, then round ?
  // multiply(anotherPhysicsNumber) {
  //
  // }
  // divide(anotherPhysicsNumber) {
  //
  // }
}

class ScalarQuantity extends Quantity {
  constructor(variable, numericalString, unit, exact = false) {
    super(variable);
    this.magnitude = new Magnitude(numericalString, unit, exact);
  }
}

class VectorQuantity extends Quantity {

}


function constructPhysicsNumberFromString(string) {
  /// use numerical string methods from before
  // i spent a long time on this in june 2017!
}
