class Angle {
  constructor(measurementInput, measuredInDegrees = true, inTermsOfPi = !measuredInDegrees ? true : undefined, noRedundancy = true) {
    this.measurement = processMeasurementInput(measurementInput);
    if (typeof(newMeasurement) !== 'object' || !newMeasurement.isAmeasurement) {
      this.invalidate();
      return false
    } else {
      this.isAnAngle = true;
    }
    if (measuredInDegrees) { // three possibilities for units: degrees, radians, and radians in terms of pi
      this.unit = 'deg';
    } else if (inTermsOfPi) {
      this.unit = 'rad_pi';
    } else {
      this.unit = 'rad';
    }

    if (noRedundancy) {
      this.simplify();
    }
  }

  simplify() {
    const fullCircle = this.isInDegrees() ? new Measurement(360) : new Measurement(Math.PI * 2, maxSigFigs);
    while (this.measurement.isNegative()) {
      this.measurement = this.measurement.add(fullCircle);
    }
    while (this.measurement.isGreaterThanOrEqualTo(fullCircle)) {
      this.measurement = this.measurement.subtract(fullCircle);
    }
  }

  invalidate() {
    this.isAnAngle = false;
    this.measurement = undefined;
    this.degrees = undefined;
  }

  duplicate() {
    return new Angle(this.measurement, this.measuredInDegrees);
  }

  isInDegrees() {
    return this.unit === 'deg'
  }
  isInRadiansOfPi() { /// NEED TO INCORPORATE THIS
    return this.unit === 'rad_pi'
  }
  isInRadiansStraight() {
    return this.unit === 'rad'
  }
  isExact() {
    return this.measurement.isExact()
  }
  getUnit() {
    return this.unit
  }

  reverseSign() {
    const fullCircle = this.isInDegrees() ? new Angle(360) : new Angle(new Measurement(Math.PI * 2, maxSigFigs), false);
    return fullCircle.subtract(this)
  }

  convertToDegrees() {
    if (this.isInDegrees()) {
      return this
    } else {
      const newMeasurement = this.measurement.divide(new Measurement(180 / Math.PI, maxSigFigs));
      return new Angle(newMeasurement)
    }
  }
  convertToRadians() {
    if (this.isInRadiansStraight()) {
      return this
    } else {
      const newMeasurement = this.measurement.divide(new Measurement(Math.PI / 180, maxSigFigs));
      return new Angle(newMeasurement, false)
    }
  }

  getQuadrant() {
    if (!this.isAnAngle) { // if invalid => may be necessary for points at the origin
      return undefined
    }
    let temp = (this.duplicate()).convertToDegrees();
    temp.simplify();
    if (temp.isExactlyZero() || temp.isExactly360()) {
      return '+X'
    } else if (temp.isExactly90()) {
      return '+Y'
    } else if (temp.isExactly180()) {
      return '-X'
    } else if (temp.isExactly270()) {
      return '-Y'
    } else if (this.isGreaterThan(0) && this.isLessThan(90)) {
      return '1'
    } else if (this.isGreaterThan(90) && this.isLessThan(180)) {
      return '2'
    } else if (this.isGreaterThan(180) && this.isLessThan(270)) {
      return '3'
    } else if (this.isGreaterThan(270) && this.isLessThan(360)) {
      return '4'
    }
  }


  isEqualTo(anotherAngleInput, numSigFigs = this.measurement.getNumSigFigs()) {
    const anotherAngle = processAngleInput(anotherAngleInput);
    return this.measurement.isEqualTo(anotherAngle.measurement, numSigFigs)
  }
  isGreaterThan(anotherAngleInput, numSigFigs = this.measurement.getNumSigFigs()) {
    const anotherAngle = processAngleInput(anotherAngleInput);
    return this.measurement.isGreaterThan(anotherAngle.measurement, numSigFigs)
  }
  isGreaterThanOrEqualTo(anotherAngleInput, numSigFigs = this.measurement.getNumSigFigs()) {
    const anotherAngle = processAngleInput(anotherAngleInput);
    return this.measurement.isGreaterThanOrEqualTo(anotherAngle.measurement, numSigFigs)
  }
  isLessThan(anotherAngleInput, numSigFigs = this.measurement.getNumSigFigs()) {
    const anotherAngle = processAngleInput(anotherAngleInput);
    return this.measurement.isLessThan(anotherAngle.measurement, numSigFigs)
  }
  isLessThanOrEqualTo(anotherAngleInput, numSigFigs = this.measurement.getNumSigFigs()) {
    const anotherAngle = processAngleInput(anotherAngleInput);
    return this.measurement.isLessThanOrEqualTo(anotherAngle.measurement, numSigFigs)
  }
  isExactlyZero() {
    return this.measurement.isExactlyZero()
  }
  isRight(numSigFigs = this.measurement.getNumSigFigs()) {
    return this.isEqualTo(new Angle(90), numSigFigs)
  }
  isExactly30() { /// add cases for radians in terms of pi
    return this.isEqualTo(new Angle(30)) && this.isExact()
  }
  isExactly45() {
    return this.isEqualTo(new Angle(45)) && this.isExact()
  }
  isExactly60() {
    return this.isEqualTo(new Angle(60)) && this.isExact()
  }
  isExactly90() {
    return this.isEqualTo(new Angle(90)) && this.isExact()
  }
  isExactly120() {
    return this.isEqualTo(new Angle(120)) && this.isExact()
  }
  isExactly135() {
    return this.isEqualTo(new Angle(135)) && this.isExact()
  }
  isExactly150() {
    return this.isEqualTo(new Angle(150)) && this.isExact()
  }
  isExactly180() {
    return this.isEqualTo(new Angle(180)) && this.isExact()
  }
  isExactly210() {
    return this.isEqualTo(new Angle(210)) && this.isExact()
  }
  isExactly225() {
    return this.isEqualTo(new Angle(225)) && this.isExact()
  }
  isExactly240() {
    return this.isEqualTo(new Angle(240)) && this.isExact()
  }
  isExactly270() {
    return this.isEqualTo(new Angle(270)) && this.isExact()
  }
  isExactly300() {
    return this.isEqualTo(new Angle(300)) && this.isExact()
  }
  isExactly315() {
    return this.isEqualTo(new Angle(315)) && this.isExact()
  }
  isExactly330() {
    return this.isEqualTo(new Angle(300)) && this.isExact()
  }
  isExactly360() {
    return this.isEqualTo(new Angle(360)) && this.isExact()
  }


  add(anotherAngleInput) {
    const anotherAngle = processAngleInput(anotherAngleInput);
    if (this.isInDegrees()) {
      const newMeasurement = this.measurement.add((anotherAngle.convertToDegrees()).measurement);
      return new Angle(newMeasurement)
    } else {
      const newMeasurement = this.measurement.add((anotherAngle.convertToRadians()).measurement);
      return new Angle(newMeasurement, false)
    }
  }

  subtract() {
    const anotherAngle = processAngleInput(anotherAngleInput);
    if (this.isInDegrees()) {
      const newMeasurement = this.measurement.subtract((anotherAngle.convertToDegrees()).measurement);
      return new Angle(newMeasurement)
    } else {
      const newMeasurement = this.measurement.subtract((anotherAngle.convertToRadians()).measurement);
      return new Angle(newMeasurement, false)
    }
  }


  sin() {
    // add special cases, when an exactl answer is known!!! no point in losing sig figs
    if (this.isExactlyZero()) {
      return new Measurement(0)
    } else if (this.isExactly30()) {
      return new Measurement(0.5)
    } else if (this.isExactly90()) {
      return new Measurement(1)
    } else if (this.isExactly150()) {
      return new Measurement(0.5)
    } else if (this.isExactly180()) {
      return new Measurement(0)
    } else if (this.isExactly210()) {
      return new Measurement(-0.5)
    } else if (this.isExactly270()) {
      return new Measurement(-1)
    } else if (this.isExactly330()) {
      return new Measurement(-0.5)
    } else if (this.isExactly360()) {
      return new Measurement(0)
    } else {
      const radAngle = this.convertToRadians();
      return radAngle.measurement.sin();
    }
  }
  cos() {
    if (this.isExactlyZero()) {
      return new Measurement(1)
    } else if (this.isExactly60()) {
      return new Measurement(0.5)
    } else if (this.isExactly90()) {
      return new Measurement(0)
    } else if (this.isExactly120()) {
      return new Measurement(-0.5)
    } else if (this.isExactly180()) {
      return new Measurement(-1)
    } else if (this.isExactly240()) {
      return new Measurement(-0.5)
    } else if (this.isExactly270()) {
      return new Measurement(0)
    } else if (this.isExactly300()) {
      return new Measurement(0.5)
    } else if (this.isExactly360()) {
      return new Measurement(1)
    } else {
      const radAngle = this.convertToRadians();
      return radAngle.measurement.cos();
    }
  }
  tan() { // simplify??? use sin/ cos
    if (this.isExactlyZero()) {
      return new Measurement(0)
    } else if (this.isExactly45()) {
      return new Measurement(1)
    } else if (this.isExactly90()) {
      return new Measurement(Infinity)
    } else if (this.isExactly135()) {
      return new Measurement(-1)
    } else if (this.isExactly180()) {
      return new Measurement(0)
    } else if (this.isExactly225()) {
      return new Measurement(1)
    } else if (this.isExactly270()) {
      return new Measurement(-Infinity)
    } else if (this.isExactly315()) {
      return new Measurement(-1)
    } else if (this.isExactly360()) {
      return new Measurement(0)
    } else {
      const radAngle = this.convertToRadians();
      return radAngle.measurement.tan();
    }
  }
  sec() {
    if (this.isExactlyZero()) {
      return new Measurement(1)
    } else if (this.isExactly60()) {
      return new Measurement(2)
    } else if (this.isExactly90()) {
      return new Measurement(Infinity) // undefined?
    } else if (this.isExactly120()) {
      return new Measurement(-2)
    } else if (this.isExactly180()) {
      return new Measurement(-1)
    } else if (this.isExactly240()) {
      return new Measurement(-2)
    } else if (this.isExactly270()) {
      return new Measurement(Infinity)
    } else if (this.isExactly300()) {
      return new Measurement(2)
    } else if (this.isExactly360()) {
      return new Measurement(1)
    } else {
      const radAngle = this.convertToRadians();
      return radAngle.measurement.sec();
    }
  }
  csc() {
    if (this.isExactlyZero()) {
      return new Measurement(Infinity) // undefined?
    } else if (this.isExactly30()) {
      return new Measurement(2)
    } else if (this.isExactly90()) {
      return new Measurement(1)
    } else if (this.isExactly150()) {
      return new Measurement(2)
    } else if (this.isExactly180()) {
      return new Measurement(Infinity)
    } else if (this.isExactly210()) {
      return new Measurement(-2)
    } else if (this.isExactly270()) {
      return new Measurement(-1)
    } else if (this.isExactly330()) {
      return new Measurement(-2)
    } else if (this.isExactly360()) {
      return new Measurement(Infinity)
    } else {
      const radAngle = this.convertToRadians();
      return radAngle.measurement.csc();
    }
  }
  cot() {
    if (this.isExactlyZero()) {
      return new Measurement(Infinity)
    } else if (this.isExactly45()) {
      return new Measurement(1)
    } else if (this.isExactly90()) {
      return new Measurement(0)
    } else if (this.isExactly135()) {
      return new Measurement(-1)
    } else if (this.isExactly180()) {
      return new Measurement(0)
    } else if (this.isExactly225()) {
      return new Measurement(1)
    } else if (this.isExactly270()) {
      return new Measurement(0)
    } else if (this.isExactly315()) {
      return new Measurement(-1)
    } else if (this.isExactly360()) {
      return new Measurement(Infinity)
    } else {
      const radAngle = this.convertToRadians();
      return radAngle.measurement.cot();
    }
  }


  print(inTermsOfPi = false) {
    return `${this.measurement.printStandardNotation()}°`
  }
}

function processAngleInput(angleInput) {
  if (typeof(angleInput) === 'object' && angleInput.isAnAngle) {
    return angleInput
  } else {
    return new Angle(processMeasurementInput(angleInput)) // defaults to degrees
  }
}

function getAngleFromLawOfCosines(oppositeSideMag, adjacentSide1Mag, adjacentSide2Mag) {
    let temp1 = (adjacentSide1Mag.squareMag().addMag(adjacentSide2Mag.squareMag())).subtractMag(oppositeSideMag.squareMag());
    let temp2 = (adjacentSide1Mag.multiplyMag(adjacentSide2Mag)).multiplyMagExactConstant(2);
    let cosine = temp1.divideMag(temp2);
    // while (cosine > 1) {
    //     cosine -= 1;
    // }
    // while (cosine < -1) {
    //     cosine += 1;
    // }
    const angleInRadians = cosine.inverseCosMag();
    return angleInRadians.convertToDegrees();
}


/*
OLD ANGLE
class Angle extends PhysicsNumber {
    constructor(numString, degrees = true, intermediateValue, exact = false) {
        super(numString, intermediateValue, exact);
          // simplify angle should be automatic!

          // get num sig figs
          // get float
          // then remake an angle without that?
        this.degrees = degrees;
        this.isAnAngle = true;

        // add routine to ensure that it is between 0 and 360
        // or some other requirement
    }

    isInDegrees() {
      return this.degrees
    }

    simplifyAngle() { // should be automatic
      let test = (this.convertToDegrees()).getFloat();
      while (test <= 0) {
        test += 360;
      }
      while (test > 360) {
        test -= 360;
      }
      if (!this.degrees) {
        test *= Math.PI;
        test /= 180;
      }
      return constructAngleFromFloat();
    }


    duplicate() {
        const string = !this.zero ? `${this.positive === false ? '-' : ''}${this.firstSigFig}.${this.otherSigFigs}e${this.orderOfMagnitude}` : `${this.firstSigFig}.${this.otherSigFigs}`;
        const exact = this.numSigFigs === Infinity;
        const intermediateValue = this.intermediateValue;
        const degrees = this.degrees;
        return new Angle(string, degrees, intermediateValue, exact)
    }

    reverseSign() { // need to remake this because i needed to remake duplicate
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

    convertToDegrees() {
        if (this.degrees) {
            return this
        } else {
            return constructAngleFloat(this.getFloat() * 180 / Math.PI, this.numSigFigs, true, this.exact, this.zeroLimit);
        }
    }

    convertToRadians() {
        if (!this.degrees) {
            return this
        } else {
            return constructAngleFloat(this.getFloat() * Math.PI / 180, this.numSigFigs, false, this.exact, this.zeroLimit);
        }
    }


    // private method
    // always returns in the same 'unit', degrees or radians, as the original
    addOrSubtractAngle(operation, anotherAngle, zeroLimit = this.zeroLimit) {
        let float1, float2, degrees, newSigFigs, exact;
        if (!this.degrees && !anotherAngle.degrees) { // can be made more efficient, but i like how understandable it is
            float1 = this.getFloat();
            float2 = anotherAngle.getFloat();
            degrees = false;
        } else if (this.degrees && !anotherAngle.degrees) {
            float1 = this.getFloat();
            float2 = anotherAngle.getFloat * 180 / Math.PI;
            degrees = true;
        } else if (!this.degrees && anotherAngle.degrees) {
            float1 = this.getFloat();
            float2 = anotherAngle.getFloat / 180 * Math.PI;
            degrees = false;
        } else if (this.degrees && anotherAngle.degrees) {
            float1 = this.getFloat();
            float2 = anotherAngle.getFloat();
            degrees = true;
        }
        newSigFigs = Math.min(this.numSigFigs, anotherAngle.numSigFigs);
        exact = newSigFigs === Infinity;
        let newFloat;
        if (operation === '+') {
            newFloat = float1 + float2;
        } else if (operation === '-') {
            newFloat = float1 - float2;
        }
        return constructAngleFloat(newFloat, newSigFigs, degrees, exact, zeroLimit)
    }

    addAngle(anotherAngle, zeroLimit) {
        return this.addOrSubtractAngle('+',anotherAngle, zeroLimit)
    }

    subtractAngle(anotherAngle, zeroLimit) {
        return this.addOrSubtractAngle('-',anotherAngle, zeroLimit)
    }

    add90Degrees() {
        return this.addAngle(get90Degrees(undefined,true));
    }
    add180Degrees() {
        return this.addAngle(get180Degrees(undefined,true));
    }

    add270Degrees() {
        return this.addAngle(get270Degrees(undefined,true));
    }

    // make same units
    makeSameUnits(anotherAngle) {
        if (this.degrees) {
            return anotherAngle.convertToDegrees()
        } else {
            return anotherAngle.convertToRadians()
        }
    }


    // testes if equal up to a certain number of sig figs
    isEqualTo(anotherAngle, numSigFigs) {
       const tempAngle = this.makeSameUnits(anotherAngle);
       return super.isEqualTo(tempAngle, numSigFigs)
    }

    isGreaterThan(anotherAngle, numSigFigs) {
        const tempAngle = this.makeSameUnits(anotherAngle);
        return super.isGreaterThan(tempAngle, numSigFigs)
    }

    isLessThan(anotherAngle, numSigFigs) {
        const tempAngle = this.makeSameUnits(anotherAngle);
        return super.isLessThan(tempAngle, numSigFigs)
    }

    isGreaterThanOrEqualTo(anotherAngle, numSigFigs) {
        const tempAngle = this.makeSameUnits(anotherAngle);
        return super.isGreaterThanOrEqualTo(tempAngle, numSigFigs)
    }

    isLessThanOrEqualTo(anotherAngle, numSigFigs) {
        const tempAngle = this.makeSameUnits(anotherAngle);
        return super.isLessThanOrEqualTo(tempAngle, numSigFigs)
    }

    isRight(numSigFigs = this.numSigFigs) {
        return this.isEqualTo(new Angle('90',true, undefined, true), numSigFigs)
    }

    printString() {
        if (this.degrees) {
            return super.printOptimal() + '°'
        } else {
            return super.printOptimal() + ' rad'
        }
    }

    printStringInTermsOfPi() {
        if (this.degrees) {
            return undefined
        } else {

        }
    }

    /// PRIVATE METHOD!!!!!
    trigFunction(trigFunction, zeroLimit) {
      const radiansFloat = this.degrees ? this.getFloat() / 180 * Math.PI : this.getFloat();
      let newFloat;
      if (trigFunction === 'sin') {
        newFloat = Math.sin(radiansFloat);
      } else if (trigFunction === 'cos') {
        newFloat = Math.cos(radiansFloat);
      } else if (trigFunction === 'tan') {
        newFloat = Math.tan(radiansFloat);
      } else if (trigFunction === 'sec') {
        newFloat = 1 / Math.cos(radiansFloat);
      } else if (trigFunction === 'csc') {
        newFloat = 1 / Math.sin(radiansFloat);
      } else if (trigFunction = 'cot') {
        newFloat = 1 / Math.tan(radiansFloat);
      }
      const newSigFigs = this.numSigFigs;
      const exact = newSigFigs === Infinity;
      const newUnit = undefined;
      return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, zeroLimit)

    }

    sinAngle(zeroLimit = this.zeroLimit) {
      return this.trigFunction('sin', zeroLimit)
    }

    cosAngle(zeroLimit = this.zeroLimit) {
      return this.trigFunction('cos', zeroLimit)
    }

    tanAngle(zeroLimit = this.zeroLimit) {
      return this.trigFunction('tan', zeroLimit)
    }

    secAngle(zeroLimit = this.zeroLimit) {
      return this.trigFunction('sec', zeroLimit)
    }

    cscAngle(zeroLimit = this.zeroLimit) {
      return this.trigFunction('csc', zeroLimit)
    }

    cotAngle(zeroLimit = this.zeroLimit) {
      return this.trigFunction('cot', zeroLimit)
    }


}
*/
/*
function get90Degrees(numSigFigs, exact = numSigFigs === undefined) {
    return constructAngleFloat(90,numSigFigs,true, exact);
}
function get180Degrees(numSigFigs, exact = numSigFigs === undefined) {
    return constructAngleFloat(180,numSigFigs,true, exact);
}
function get270Degrees(numSigFigs, exact = numSigFigs === undefined) {
    return constructAngleFloat(270,numSigFigs,true, exact);
}

function constructAngleFloat(float, numSigFigs, degrees = true, exact = false, zeroLimit) {
  return new Angle(float.toExponential(numSigFigs - 1), degrees, float, exact)
}

function constructZeroAngle(numSigFigs, exact = numSigFigs === undefined) {
    let string = '0.';
    if (!exact < numSigFigs !== Infinity) {
        let i;
        for (i = 0; i < numSigFigs - 1; i++) {
            string = string + '0'; /// inefficient? can i bypass the typical constructor?
        }
    }
    return new Angle(string,undefined, undefined,exact);
}

function get360Degrees(numSigFigs, exact = numSigFigs === undefined) {
  return constructAngleFloat(360,numSigFigs,true, exact);
}


/// not yet converted!
// converts an angle that is outside the range of 0 to 2pi into that range
function simplifyAngle(angleInRadians) {
    while (angleInRadians < 0) {
        angleInRadians += 2 * Math.PI;
    }
    while (angleInRadians >= Math.PI * 2) {
        angleInRadians -= 2 * Math.PI;
    }
    return angleInRadians
}
*/
// figure this out!
// convert this to physicsNumbers
