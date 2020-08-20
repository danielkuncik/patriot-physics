/*
This is to create numbers with eignificant figures


Do I need to program all of my other programs, like geometry and functions and problems,
to accept physics numbers as values?????

*/


// values in physics problems
// allow the mathematical methods to accept these as an input????
class Quantity {
  constructor(variableObject) {
    this.variable = variable;
  }
}

class ScalarQuantity extends Quantity {
  constructor(variable, magnitude) {
    super(variable);
    this.magnitude = magnitude;
  }
}

class VectorQuantity extends Quantity {
  constructor(variable, magnitude, direction) {
    super(variable);
    this.magnitude = mangitude;
    this.direction = direction;

    // (if magnitude = 0, direction = undefined, and unit = undefined)

    // should return three magnitudes with the correct number of significant figures
    this.x = this.magnitude.multiplyMag(this.direction.theta.cosMag() * this.direction.phi.cosMag());
    this.y = this.magnitude.multiplyMag(this.direction.theta.sinMag() * this.direction.phi.cosMag());
    this.z = this.magnitude.multiplyMag(this.phi.direction.sinMag());
  }

  function checkSameVariableAndUnit(anotherVector) {
    /// put something here!!!
  }

  function addVector(anotherVector) {
    if (checkSameVariableAndUnit(anotherVector)) {
      return constructVectorFromComponents(this.variable, this.magnitude.unit, this.x + anotherVector.x, this.y + anotherVector.y, this.z + anotherVector.z)
    } else {
      return false
    }
  }

  function subtractVector(anotherVector) {
    if (checkSameVariableAndUnit(anotherVector)) {
      return constructVectorFromComponents(this.variable, this.magnitude.unit, this.x - anotherVector.x, this.y - anotherVector.y, this.z - anotherVector.z)
    } else {
      return false
    }
  }

  function dotProduct(anotherVector) {
    // multipy the varibles to get a new variable
    // then, return a scalar
  }

  function crossProduct(anotherVector) {
    // multiply the varaibles to get a new variable
    // then, return a scalar
  }

}


function constructVectorFromComponents(variable, unitObject, xComponent, yComponent, zComponent) {

}

/// add some shortcut constructors, to construct simple vectors very fast
