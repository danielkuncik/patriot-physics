
class Angle extends PhysicsNumber {
    constructor(numString, degrees = true, intermediateValue, exact = false) {
        super(numString, intermediateValue, exact);
        this.degrees = degrees;
        this.isAnAngle = true;

        // add routine to ensure that it is between 0 and 360
        // or some other requirement
    }

    duplicate() {
        const string = !this.zero ? `${this.positive === false ? '-' : ''}${this.firstSigFig}.${this.otherSigFigs}e${this.orderOfMagnitude}` : `${this.firstSigFig}.${this.otherSigFigs}`;
        const exact = this.numSigFigs === Infinity;
        const intermediateValue = this.intermediateValue;
        const degrees = this.degrees;
        return new PhysicsNumber(string, degrees, intermediateValue, exact)
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

    // these should only exist in the angles
    // trig functions: too much repeated code here!!!
    // make a private function that brings these together
    sinMag() {
        if (this.unit !== undefined) {
            console.log('can only complete trig functions on a unitless quantity');
            return false
        }
        const radiansFloat = this.degrees ? this.getFloat() / 180 * Math.PI : this.getFloat();
        const newFloat = Math.sin(radiansFloat);
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
        const radiansFloat = this.degrees ? this.getFloat() / 180 * Math.PI : this.getFloat();
        const newFloat = Math.cos(radiansFloat);
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
        const radiansFloat = this.degrees ? this.getFloat() / 180 * Math.PI : this.getFloat();
        const newFloat = Math.tan(radiansFloat);
        const newSigFigs = this.numSigFigs;
        const exact = newSigFigs === Infinity;
        const newUnit = undefined;
        return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, this.zeroLimit)
    }


}

function getZeroDegrees(numSigFigs, exact = true) {
    return constructAngleFloat(0,numSigFigs,true, exact);
}
function get90Degrees(numSigFigs, exact = true) {
    return constructAngleFloat(90,numSigFigs,true, exact);
}
function get180Degrees(numSigFigs, exact = true) {
    return constructAngleFloat(180,numSigFigs,true, exact);
}
function get270Degrees(numSigFigs, exact = true) {
    return constructAngleFloat(270,numSigFigs,true, exact);
}


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
function getAngleFromLawOfCosines(oppositeSide, adjacentSide1, adjacentSide2) {
    let cosine = (adjacentSide1**2 + adjacentSide2**2 - oppositeSide**2) / 2 / adjacentSide1 / adjacentSide2;
    while (cosine > 1) {
        cosine -= 1;
    }
    while (cosine < -1) {
        cosine += 1;
    }
    const angleInRadians = Math.acos(cosine);
    return convertRadiansToDegrees(angleInRadians);
}
