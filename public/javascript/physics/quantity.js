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

    // (if magnitude = 0, direction = undefined, and unit = undefined)
    if (magnitude.zero) {
      this.direction = undefined;
      this.x = 0;
      this.y = 0;
      this.z = 0;
    } else {
      this.magnitude = mangitude;
      this.direction = direction;
      // should return three magnitudes with the correct number of significant figures
      this.x = this.magnitude.multiplyMag(this.direction.theta.cosMag() * this.direction.phi.cosMag());
      this.y = this.magnitude.multiplyMag(this.direction.theta.sinMag() * this.direction.phi.cosMag());
      this.z = this.magnitude.multiplyMag(this.phi.direction.sinMag());
    }

  }

  function checkSameVariableAndUnit(anotherVector) {
    /// put something here!!!
  }

  /// in these functions I always included "this.variable", but that is wrong!!!
  /// operating on vectors results in a different varaible, as dictated by equation!
  function addVector(newVariable, anotherVector) {
    if (checkSameVariableAndUnit(anotherVector)) {
      return constructVectorFromComponents(this.variable, this.magnitude.unit, this.x + anotherVector.x, this.y + anotherVector.y, this.z + anotherVector.z)
    } else {
      return false
    }
  }

  function subtractVector(newVariable, anotherVector) {
    if (checkSameVariableAndUnit(anotherVector)) {
      return constructVectorFromComponents(this.variable, this.magnitude.unit, this.x - anotherVector.x, this.y - anotherVector.y, this.z - anotherVector.z)
    } else {
      return false
    }
  }

  function multiplyByScalar(newVariable, scalar) { /// creates a new variable!!!!
    const newMagnitude = this.magnitude.multiplyMag(scalar.magnitude);
    return new Vector();
  }

  function divideByScalar(newVariable, scalar) {

  }

  function dotProduct(newVariable, anotherVector) {
    // multipy the varibles to get a new variable
    // then, return a scalar
  }

  function crossProduct(newVariable,anotherVector) {
    // multiply the varaibles to get a new variable
    // then, return a scalar
  }

}


function constructVectorFromComponents(variable, unitObject, xComponent, yComponent, zComponent) {

}

function constructZeroVector(variable, exact) {
  return new Vector(variable, constructZeroMagnitude(exact))
}

/// add some shortcut constructors, to construct simple vectors very fast
