
/*
would it all work if i saved only a float and a number of sig figs???
*/

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

// figure this out!
// convert this to physicsNumbers
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
