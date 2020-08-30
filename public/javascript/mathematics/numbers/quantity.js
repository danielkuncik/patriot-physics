/*
This is to create numbers with eignificant figures


Do I need to program all of my other programs, like geometry and functions and problems,
to accept physics numbers as values?????

*/


// values in physics problems
// allow the mathematical methods to accept these as an input????
class Quantity {
  constructor(variableKey) {
    this.variableKey = variableKey;
    this.variableObject = selectVariable(key);
  }
}
/// what about variable keys???? those are needed in order to use formulas

function findVariableInQuantityList(variableKey, quantityList) {
  let i;
  for (i = 0; i < quantityList.length; i++) {
    if (quantityList[i].variableKey === variableKey) {
      return quantityList[i]
    }
  }
  return undefined
}

class ScalarQuantity extends Quantity {
  constructor(variableKey, magnitudeObject) {
    super(variableKey);
    if (this.variableObject.vector) {
      console.log('cannot create scalar quantity object for vector variable');
      return false
    }
    this.magnitude = magnitudeObject;

    /// I need to incldue a check that the magnitude object has the correct units!!!
  }

  printAsEquation(prtintFullName) {
    let variablePrint = printName ? this.varaible.name : this.variable.abbreviation;
    return `${variablePrint} = ${this.magnitude.printOptimal()}`
  }

  printMagnitude() {
    return this.magnitude.printOptimal();
  }

  addScalar(anotherScalar, variableKey = "intermediate") { // i need to confirm that the addition is sanctioned by a formula???
    return new ScalarQuantity(variableObject, this.magnitudeObject.addMag(anotherScalar.magnitude))
  }

  subtractScalar(anotherScalar, variableKey = "intermediate") { // i need to confirm that the addition is sanctioned by a formula???
    return new ScalarQuantity(variableObject, this.magnitudeObject.subtractMag(anotherScalar.magnitude))
  }

  multiplyScalar(anotherScalar, variableKey = "intermediate") { /// i need to confirm that the multiplication is sanctioned by a formula
    return new ScalarQuantity(variableObject, this.magnitudeObject.multiplyMag(anotherScalar.magnitude))
  }

  divideScalar(anotherScalar, variableKey = "intermediate") { /// i need to confirm that the multiplication is sanctioned by a formula
    return new ScalarQuantity(variableObject, this.magnitudeObject.divideMag(anotherScalar.magnitude))
  }
}

class VectorQuantity extends Quantity {
  constructor(variableKey, magnitude, direction) {
    super(variableKey);
    if (!this.variable.vector) {
      console.log('cannot create vector quantity from scalar variable');
    }

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

  checkSameVariableAndUnit(anotherVector) {
    /// put something here!!!
  }

  /// in these functions I always included "this.variable", but that is wrong!!!
  /// operating on vectors results in a different varaible, as dictated by equation!
  addVector(newVariable, anotherVector) {
    if (checkSameVariableAndUnit(anotherVector)) {
      return constructVectorFromComponents(this.variable, this.magnitude.unit, this.x + anotherVector.x, this.y + anotherVector.y, this.z + anotherVector.z)
    } else {
      return false
    }
  }

  subtractVector(newVariable, anotherVector) {
    if (checkSameVariableAndUnit(anotherVector)) {
      return constructVectorFromComponents(this.variable, this.magnitude.unit, this.x - anotherVector.x, this.y - anotherVector.y, this.z - anotherVector.z)
    } else {
      return false
    }
  }

  multiplyByScalar(newVariable, scalar) { /// creates a new variable!!!!
    const newMagnitude = this.magnitude.multiplyMag(scalar.magnitude);
    return new Vector();
  }

  divideByScalar(newVariable, scalar) {

  }

  dotProduct(newVariable, anotherVector) {
    // multipy the varibles to get a new variable
    // then, return a scalar
  }

  crossProduct(newVariable,anotherVector) {
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
