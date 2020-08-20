/*
This is to create numbers with eignificant figures


Do I need to program all of my other programs, like geometry and functions and problems,
to accept physics numbers as values?????

*/


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
