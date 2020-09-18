
class Magnitude {
    constructor(measurementInput, unitInput) {
        let measurement = processMeasurementInput(measurementInput);
        if (typeof(measurement) === 'object' && measurement.isAmeasurement) {
            this.measurement = measurement;
            this.isAmagnitude = true;
        } else {
            this.invalidate();
            return undefined
        }

        if (this.isExactlyZero()) { // exactly zero can have no unit; inexactly zero CAN have a unit
            this.unit = undefined
        } else {
            this.unit = processUnitInput(unitInput);
        }
    }

    invalidate() {
        this.isAmagnitude = false;
        this.measurement = new Measurement();
        this.unit = undefined; // make it an invalid unit?
    }

    getMeasurement() {
      return this.measurement()
    }

    getUnit() {
      return this.unit()
    }

    duplicate() {
        return new Magnitude(this.getMeasurement(), this.getUnit())
    }

    isZero() {
        return this.getMeasurement().isZero()
    }

    isExactlyZero() {// can be simplified?
        return this.getMeasurement().isZero() && this.getMeasurement().isExact()
    }

    isUnitless() {
        return this.getUnit() === undefined
    }

    getSIfloat(abs = false) {
        if (this.isUnitless()) {
            return this.getMeasurement().getFloat()
        } else {
            return this.getMeasurement().getFloat(abs) * this.unit.conversionFactor
        }
    }

    // PRIVATE METHOD
    /*
    combine(type, anotherMagnitude) {
        if (this.isUnitless() && anotherMagnitude.isUnitless())

        let newUnit, mag1, mag2;
        if (areTwoUnitsTheSameDimension(this.unit, anotherMagnitude.unit)) {
            return this.combineWithSameUnit(type, anotherMagnitude.convertToNewUnit(this.unit));
        } else if (this.unit === undefined && anotherMagnitude.unit === undefined) {
            return (this.measurement.combine(type, anotherMagnitude.measurement), undefined);
        } else if (this.unit !== undefined && this.measurement.isZero()) {
            return this
        } else if (anotherMagnitude.unit !== undefined && this.measurement.isZero()) {
            return anotherMagnitude
        } else {
            return undefined
        }
    }
    */

    // PRIVATE METHOD
    combineWithSameUnit(type, anotherMagnitude) {
        return (this.measurement.combine(type, anotherMagnitude.measurement), this.unit);
    }

    // you could lose sig figs on some conversions, like feet to inches, with this method
    convertToSI() {
        const conversionFactor = this.unit.conversionFactorExact ? new Measurement(this.unit.conversionFactor) : new Measurement(String(this.unit.conversionFactor));
        let newUnit = this.unit.dimension.SI_unit; // is this a thing?
        let newMeasurement = this.measurement.multiply(conversionFactor);
        return new MagnitudeNew(newMeasurement, newUnit)
    }


    convertToNewUnit(newUnitInput) {
        let newUnit = processUnitInput(newUnitInput);
        if (newUnit.SI) {
            return this.convertToSI()
        } else {
            let temp = this.convertToSI();
            const conversionFactor = newUnit.conversionFactorExact ? new Measurement(newUnit.conversionFactor) : new Measurement(String(newUnit.conversionFactor));
            let newMeasurement = temp.measurement.multiply(conversionFactor);
            return new MagnitudeNew(newMeasurement, newUnit)
        }
    }

    addMag(anotherMagnitude) {
        if (this.isExactlyZero() && anotherMagnitude.isExactlyZero()) {
            return new Magnitude(0)
        }else if (this.isExactlyZero()) {
            return anotherMagnitude
        } else if (anotherMagnitude.isExactlyZero()) {
            return this
        } else if (this.isUnitless() && anotherMagnitude.isUnitless()) {
            return new Magnitude(this.measurement.add(anotherMagnitude.measurement))
        } else if (areSameUnit(this.unit, anotherMagnitude.unit)) {
            return new MagnitudeNew(this.measurement.add(anotherMagnitude.measurement), this.unit)
        } else if (areTwoUnitsTheSameDimension(this.unit, anotherMagnitude.unit)) {
            let temp = anotherMagnitude.convertToNewUnit(this.unit);
            return new MagnitudeNew(this.measurement.add(temp.measurement), this.unit)
        } else {
            return undefined
        }
    }
    subtractMag(anotherMagnitude) {
        if (areSameUnit(this.unit, anotherMagnitude.unit)) {
            return new MagnitudeNew(this.measurement.subtract(anotherMagnitude.measurement), this.unit)
        } else if (areTwoUnitsTheSameDimension(this.unit, anotherMagnitude.unit)) {
            let temp = anotherMagnitude.convertToNewUnit(this.unit);
            return new MagnitudeNew(this.measurement.subtract(temp.measurement), this.unit)
        } else {
            return undefined
        }
    }
    pythagoreanAddMag(anotherMagnitude) {
        if (areSameUnit(this.unit, anotherMagnitude.unit)) {
            return new MagnitudeNew(this.measurement.pythagoreanAdd(anotherMagnitude.measurement), this.unit)
        } else if (areTwoUnitsTheSameDimension(this.unit, anotherMagnitude.unit)) {
            let temp = anotherMagnitude.convertToNewUnit(this.unit);
            return new MagnitudeNew(this.measurement.pythagoreanAdd(temp.measurement), this.unit)
        } else {
            return undefined
        }
    }
    pythagoreanSubtractMag(anotherMagnitude) {
        if (areSameUnit(this.unit, anotherMagnitude.unit)) {
            return new MagnitudeNew(this.measurement.pythagoreanSubtract(anotherMagnitude.measurement), this.unit)
        } else if (areTwoUnitsTheSameDimension(this.unit, anotherMagnitude.unit)) {
            let temp = anotherMagnitude.convertToNewUnit(this.unit);
            return new MagnitudeNew(this.measurement.pythagoreanSubtract(temp.measurement), this.unit)
        } else {
            return undefined
        }
    }

    multiplyMag(anotherMagnitude) {
      if (this.isUnitless() && anotherMagnitude.isUnitless()) {
        return new Magnitude((this.getMeasurement()).multiply(anotherMagnitude.getMeasurement()))
      }
      // other options
    }

    divideMag(anotherMagnitude) {
      if (this.isUnitless() && anotherMagnitude.isUnitless()) {
        return new Magnitude((this.getMeasurement()).divide(anotherMagnitude.getMeasurement()))
      }
    }

    /// inverse sine
    // inverse cosine
    /// inverse tangent

}
