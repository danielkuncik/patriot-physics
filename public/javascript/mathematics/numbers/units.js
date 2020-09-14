/*
how do i want unit selection to work?
- you should be able to select a unit by name, by dimensions

1. there are four kinds of units: base units, units with the same dimension as base units that are not base units, SI deri
base units: units of a base dimension that are SI units [meters, seconds, kilograms, kelvin, amperes]
non-base SI units: units of a derived dimension that are SI units [newtons, joules, watts, m/s, m/s^2]
base dimension non-SI units: units of a base dimension that are not SI units [kilometers, minutes, hours, pounds]
non-base non-SI units: units of a non-base dimension that are not SI units []

do I want these all in the same json? probably YES [but all derivations should be in terms of base units, so those should probably be separate?]
having four JSON is too difficult

to 'select' a unit, you can enter its name, a derivation object, or a unit object


TO DO:
For all metric units:
add a section called 'conventionally used prefixes'

- it should automatically convert to 'conventionally used' other units if those produce a simpler answer, out of scientific notation?



how do i select a unit???
- should i ONLY be able to enter a name?
[no, that is not good, i can enter a name or a completed object]

the 'selector' shoudl work as follows:
- if you enter a string, it first detects if there are any metric prefixes, and then it reads the name from the json
- if you enter a completed unit object, it simply returns that object
- if you enter an object that isn't a unit object, or a , it returns undefined

- so the 'constructor' receives a string, or a completed object
- if it receives a completed object, it just returns it
- but if it receveies a string, it processes it

what about a 'derivation'???

constructor(nameOrObject, derivation) {
    = if you giev a name string, it reads it from the lsit
    - if you give a completed unit object, it returns it [this should not be an option!!! if you already have an object, why feed it to a constructor????]
    - if you give a derivation, it creates a new unit with that derivation and gives it the name...this allows new units to be formed??

    - derivation object: for each name, gives a multiplicaiton and a power
    = but, it should be able to find a name for a derivation....if one doesn't currently exist
    [you cannot rename units, if you input a derivation, then it seraches ofr the name, and if it finds it disregards your name]
    [eg. february coudl be a unit consisting of 28 days]

    - in the methods are multiply, divide, inverse, test if the same as another unit, test if the same dimension as another unit
}

- there isn't a unit class, should there be????
= what goal would a unit class serve???
[it would hold all of the unit methods]
 */

const metricPrefixes = {
    "peta":
    {
        "multiplier": 1E15,
        "abbreviation": "P"
    },
    "tera":
    {
        "multiplier": 1E12,
        "abbreviation": "T"
    },
    "giga":
    {
        "multiplier": 1E9,
        "abbreviation": "G"
    },
    "mega":
    {
        "multiplier": 1E6,
        "abbreviation": "M"
    },
    "kilo":
    {
        "multiplier": 1000,
        "abbreviation": "k"
    },
    "hecto":
    {
        "multiplier": 100,
        "abbreviation": "h"
    },
    "deca":
    {
        "multiplier": 10,
        "abbreviation": "da"
    },
    "deci":
    {
        "multiplier": 0.1,
        "abbreviation": "d"
    },
    "centi":
    {
        "multiplier": 0.01,
        "abbreviation": "c"
    },
    "milli":
    {
        "multiplier": 0.001,
        "abbreviation": "m"
    },
    "micro":
    {
        "multiplier": 1E-6,
        "abbreviation": "μ"
    },
    "nano":
    {
        "multiplier": 1E-9,
        "abbreviation": "n"
    },
    "pico":
    {
        "multiplier": 1E-12,
        "abbreviation": "p"
    },
    "femto":
    {
        "multiplier": 1E-15,
        "abbreviation": "f"
    }
};


const baseDimensions = {
    "length": {
        "base": true,
        "SI_unit": "meter",
        "other_units": [
            "foot", "inch", "mile"
        ]
    },
    "mass": {
        "base": true,
        "SI_unit": "kilogram",
        "other_units": [
            "pound"
        ]
    },
    "time": {
        "base": true,
        "SI_unit": "second",
        "other_units": [
            "minute", "hour", "day"
        ]
    },
    "temperature": {
        "base": true,
        "SI_unit": "Kelvin",
        "other_unit": [
            "Rankine"
        ],
        "other_scale": [
            "Celsius", "Fahrenheit"
        ]
    },
    "current": {
        "base": true,
        "SI_unit": "Ampere"
    }
};


const units = {
    "baseDimensionsSI": {
        "meter": {
            "dimension": "length",
            "abbreviation": "m"
        },
        "second": {
            "dimension": "time",
            "abbreviation": "s"
        },
        "Ampere": {
            "dimension": "current",
            "abbreviation": "A"
        },
        "Kelvin": {
            "dimension": "temperature",
            "abbreviation": "K",
            "plural": "Kelvin"
        },
        "kilogram": {
            "dimension": "mass",
            "abbreviation": "kg",
        },
        "mole": {
            "dimension": "amount",
            "abbreviation": "mol"
        },
        "candela": {
            "dimension": "intensity",
            "abbreviation": "cd"
        }
    },
    "baseDimensionsNonSI": {
        "length": {
            "foot": {
                "conversion_factor": '0.3048',
                "abbreviation": "ft",
                "plural": "feet"
            },
            "inch": {
                "abbreviation": "in",
                "conversion_factor": '0.0254',
                "plural": "inches"
            },
            "mile": {
                "abbreviation": "mi",
                "conversion_factor": '1609.34',
            }
        },
        "time": {
            "minute": {
                "abbreviation": "min",
                "conversionFactor": 1/60
            },
            "hour": {
                "abbreviation": "hr",
                "conversionFactor": 1/3600
            },
            "day": {
                "abbreviation": "day",
                "conversionFactor": 1/86400
            }
        },
        "mass": {
            "pound": {
                "dimension": "mass",
                "abbreviation": "lb",
                "conversion_factor": '0.453592'
            }
        },
        "current": {

        },
        "temperature": {
            "Rankine": {
                "conversion_factor": '0.55555555556',
                "abbreviation": "°Ra"
            }
        },
        "amount": {

        },
        "intensity": {

        }
    },
    "derivedSI": {
        "Newton": {
            "dimension": "force",
            "abbreviation": "N",
            "derivation":
            {
                "kilogram":
                {
                    "multiplier": 1,
                    "power": 1
                },
                "meter":
                {
                    "multiplier": 1,
                    "power": 1
                },
                "second":
                {
                    "multiplier": 1,
                    "power": -2
                }
            }
        },
        "Joule": {
            "dimension": "energy",
            "abbreviation": "J",
            "derivation":
            {
                "kilogram":
                    {
                        "multiplier": 1,
                        "power": 1
                    },
                "meter":
                    {
                        "multiplier": 1,
                        "power": 2
                    },
                "second":
                    {
                        "multiplier": 1,
                        "power": -2
                    }
            }
        },
        "Watt": {
            "dimension": "power",
            "abbreviation": "W",
            "derivation":
                {
                    "kilogram":
                        {
                            "multiplier": 1,
                            "power": 1
                        },
                    "meter":
                        {
                            "multiplier": 1,
                            "power": 2
                        },
                    "second":
                        {
                            "multiplier": 1,
                            "power": -3
                        }
                }
        },
        "Coulomb": {
            "dimension": "charge",
            "conversion_factor": 1,
            "abbreviation": "C",
            "derivation":
                {
                    "Ampere":
                        {
                            "multiplier": 1,
                            "power": 1
                        },
                    "second":
                        {
                            "multiplier": 1,
                            "power": 1
                        }
                }

        }
    },
    "derivedNonSI": {
        "Dyne": {
            "dimension": "force",
            "conversion_factor": 0.00001,
            "abbreviation": "dyn"
        },
        "electronVolt": {
            "dimension": "energy",
            "conversion_factor": 1.602E-19,
            "abbreviation": "eV"
        }
    }
};

class Dimension {
    constructor(name, derivation) {
        if (typeof(name) === 'string') { // read name
            this.name = name;
        }
    }
}



// start by coding it without the derivation
class Unit {
    constructor(name, derivation) {
        this.name = name;

        /// analyze metric prefix
        let metricMultiplier, processedName = name;
        Object.keys(metricPrefixes).forEach((prefix) => { // inefficient because there is no break?
            if (name.indexOf(prefix) === 0) {
                metricMultiplier = prefix.multiplier;
                this.metricAbbreviation = prefix.abbreviation;
                processedName = name.replace(prefix, '');
            }
        });

        let referenceInfo;
        if (units.baseDimensionsSI[processedName]) {
            referenceInfo = units.baseDimensionsSI[processedName];
            this.isAunit = true;
            this.conversionFactor = 1;
            this.SI = true;
            this.baseUnit = true;
            this.baseDimension = true;
            this.dimension = {};
            this.dimension[referenceInfo.dimension] = 1;
            this.derivation = {};
            this.derivation[this.name] = 1;
            this.abbreviation = referenceInfo.abbreviation;
            this.plural = referenceInfo.plural ? referenceInfo.plural : `${this.name}s`;
        } else if (units.baseDimensionsNonSI[processedName]) {
            this.isAunit = true;
            referenceInfo = units.baseDimensionsNonSI[processedName];
            this.conversionFactor = 1;
            this.SI = false;
            this.baseUnit = false;
            this.baseDimension = true;
            this.dimension = new Dimension(referenceInfo.dimension);
            this.abbreviation = referenceInfo.abbreviation;
            this.plural = referenceInfo.plural ? referenceInfo.plural : `${this.name}s`;
        } else if (units.derivedSI[processedName]) {
            this.isAunit = true;
            referenceInfo = units.derivedSI[processedName];
            this.conversionFactor = new Measurement(referenceInfo.conversion_factor);
            this.SI = true;
            this.baseUnit = false;
            this.baseDimension = false;
            this.derivation = referenceInfo.derivation;
            this.dimension = new Dimension(referenceInfo.dimension);
            this.abbreviation = referenceInfo.abbreviation;
            this.plural = referenceInfo.plural ? referenceInfo.plural : `${this.name}s`;
        } else if (units.derivedNonSI[processedName]) {
            this.isAunit = true;
            referenceInfo = units.derivedNonSI[processedName];
            this.conversionFactor = new Measurement(referenceInfo.conversion_factor);
            this.SI = false;
            this.baseUnit = false;
            this.baseDimension = false;
            this.derivation = referenceInfo.derivation;
            this.dimension = new Dimension(referenceInfo.dimension);
            this.abbreviation = referenceInfo.abbreviation;
            this.plural = referenceInfo.plural ? referenceInfo.plural : `${this.name}s`;
        } else {
            this.isAunit = false;
        }

        if (metricMultiplier) {
            if (this.dimension === 'mass') {
                metricMultiplier /= 1000; // account for the fact that kg, not grams, are the SI unit for mass
            }
            this.conversionFactor *= metricMultiplier;
            this.abbreviation = this.metricAbbreviation + this.abbreviation;
        }

    }

    getConversionFactor() {
        return this.conversionFactor
    }

    isSI() {
        return this.SI
    }

    isBaseUnit() {
        return this.baseUnit
    }

    getDimension() {
        return this.dimension
    }

    getName() {
        return this.name
    }

    getPluralName() {
        return this.plural
    }

    getAbbreviation() {
        return this.abbreviation
    }

    isSameDimension(anotherUnit) {
        const dim1 = this.dimension;
        const dim2 = anotherUnit.dimension;
        if (dim1["length"] && (!dim2["length"] || (dim1["length"] !== dim2["length"]))) {
            return false
        }
        if (dim1["mass"] && (!dim2["mass"] || (dim1["mass"] !== dim2["mass"]))) {
            return false
        }
        if (dim1["time"] && (!dim2["time"] || (dim1["time"] !== dim2["time"]))) {
            return false
        }
        if (dim1["current"] && (!dim2["current"] || (dim1["current"] !== dim2["current"]))) {
            return false
        }
        if (dim1["temperature"] && (!dim2["temperature"] || (dim1["temperature"] !== dim2["temperature"]))) {
            return false
        }
        if (dim1["intensity"] && (!dim2["intensity"] || (dim1["intensity"] !== dim2["intensity"]))) {
            return false
        }
        if (dim1["amount"] && (!dim2["amount"] || (dim1["amount"] !== dim2["amount"]))) {
            return false
        }
        return true
    }

    deriveConversionFactor(anotherUnit) {
        if (!this.isSameDimension(anotherUnit)) {
            return undefined
        } else {
            return this.conversionFactor.divide(anotherUnit.conversionFactor) // is this right???
        }
    }

    isSameUnit(anotherUnit) {
        if (!this.isSameDimension(anotherUnit)) {
            return false
        } else {
            return ((this.getConversionFactor()).divide(anotherUnit.getConversionFactor())).isEqualTo(new Measurement(1))
        }
    }

    multiply(anotherUnit, newName) { // returns a derivation

    }

    divide(anotherUnit, newName) {

    }

    power(anotherUnit) {

    }

    inverse(newName) {

    }
}

/*
should i just include these above?

how do i deal with derived units???
 */

function readUnitName(unitName) {
    // scan for metric prefix!!!!!!
    if (baseUnits[input]) {
        let unitObject = baseUnits[input];
        unitObject[name] = input;
        unitObject[unit] = true;
        return baseUnits[input]
    } else if (derivedUnits[input]) {
        return derivedUnits[input]
    }
}

function readUnitNameWithNoMetricPrefix(unitName) {

}

function selectUnit(input) {
    if (typeof(input) === 'string') {
    } else if (typeof(input) === 'object') {
        if (true) { // a unit object

        } else if (true) { // a derivation object?

        }
    }
}


function readUnitName(unitName) {
    if (baseUnits[unitName]) {
        let thisUnit = baseUnits[unitName];
        thisUnit.derivation = {};
        thisUnit.derivation[unitName] = 1;
        thisUnit.dimension_derivation = {};
        thisUnit.dimension_derivation[thisUnit.dimension] = 1;
        return thisUnit
    } else {
        console.log('non unit entered');
        return false
    }
}


function readUnitDerivation(unitDerivationObject) {
    let conversionFactor = 1;
    let SI = true;
    let metric = true;
    let dimension = undefined; // need to define this??
    let dimension_derivation = {};
    let abbreviation = '\\(';
    let specialName = undefined; // this should be looked up????
    // add a name object???
    const keyObject = Object.keys(unitDerivationObject);
    const base = (keyObject.length === 1 && unitDerivationObject[keyObject[0]] === 1);
    keyObject.forEach((unitName) => {
        let unit = readUnitName(unitName); // what if it returns false?
        let exponent = unitDerivationObject[unitName];
        dimension_derivation[unit.dimension] = exponent;
        if (unit.SI === false) {
            SI = false;
        }
        if (unit.metric === false) {
            metric = false;
        }
        conversionFactor *= unit.conversion_factor;
        let thisAbbreviation = ''; // flawed, but a start
        if (exponent > 1) {
            thisAbbreviation = `\\text{${unit.abbreviation}^{${exponent}}`;
        } else if (exponent === 1) {
            thisAbbreviation = `\\text{${unit.abbreviation}}`;
        } else if (exponent === -1 ) {
            thisAbbreviation = `\\frac{1}{\\text{${unit.abbreviation}}}`;
        } else if (exponent < -1) {
            thisAbbreviation = `\\frac{1}{\\text{${unit.abbreviation}}^{${Math.abs(exponent)}}`;
        }
        abbreviation = abbreviation + thisAbbreviation;
    });
    abbreviation = abbreviation + '\\)';
    return {
        derivation: unitDerivationObject,
        dimension_derivation: dimension_derivation,
        abbreviation: abbreviation,
        SI: SI,
        metric: metric,
        base: base,
    }
    /// it's progress, not perfect
}

function multiplyUnits(unitObject1, unitObject2) {
    /// figure out what to do here if these are undefined!!!!!
    if (unitObject1 === undefined && unitObject2 === undefined) {
        return undefined
    } else if (unitObject1 === undefined) {
        return unitObject2
    } else if (unitObject2 === undefined) {
        return unitObject1
    } else {
        let newDerivation = unitObject1.derivation;
        Object.keys(unitObject2.derivation).forEach((baseUnit) => {
            if (newDerivation[baseUnit]) {
                newDerivation[baseUnit] += unitObject2.derivation[baseUnit];
            } else {
                newDerivation[baseUnit] = unitObject2.derivation[baseUnit];
            }
        });
        return readUnitDerivation(newDerivation)
    }
}

function divideUnits(unitObject1, unitObject2) {

    /// figure out what to do here if these are undefined!!!!!
    if (unitObject1 === undefined && unitObject2 === undefined) {
        return undefined
    } else if (unitObject1 === undefined) {
        return inverseUnit(unitObject2)
    } else if (unitObject2 === undefined) {
        return unitObject1
    } else {
        let newDerivation = unitObject1.derivation;
        Object.keys(unitObject2.derivation).forEach((baseUnit) => {
            if (newDerivation[baseUnit]) {
                newDerivation[baseUnit] -= unitObject2.derivation[baseUnit];
            } else {
                newDerivation[baseUnit] = -1 * unitObject2.derivation[baseUnit];
            }
        });
        return readUnitDerivation(newDerivation)
    }
}

function inverseUnit(unitObject) {
    const oldDerivation = unitObject.derivation;
    let newDerivation = {};
    Object.keys(oldDerivation).forEach((key) => {
        newDerivation[key] = -1 * oldDerivation[key];
    });
    return newDerivation
}

/*
move this to a true testing html document
 */
// const unit1 = readUnitName('meter');
// const unit2 = readUnitName('second');
// const unit3 = readUnitName('kilogram');
// const unit4 = divideUnits(unit1, unit2);
// const unit5 = divideUnits(unit4, unit2);
// const unit6 = multiplyUnits(unit3, unit5);
// console.log(unit1);
// console.log(unit2);
// console.log(unit3);
// console.log(unit4);
// console.log(unit5);
// console.log(unit6);
/*
qualities of derived units
dimension => look up?
SI => true if all of th
metric => false [sort of]
base => false for all derived units
conversion factor => a magnitude?, derived mathematically from all of the other units
abbreviation => a string created
 */


// check this
function areTwoUnitsTheSameDimension(unit1, unit2) {
    return areTwoDerivationObjectsTheSame(unit1.dimension_derivation, unit2.dimension_derivation)
}

function areTwoDerivationObjectsTheSame(derivationObject1, derivationObject2) {
  const derivation1Keys = Object.keys(derivationObject1);
  const derivation2Keys = Object.keys(derivationObject2);
  if (derivation1Keys.length !== derivation2Keys.length) {
      return false
  } else {
      let i;
      for (i = 0; i < derivation1Keys.length; i++) {
          let thisDerivationKey = derivation1Keys[i];
          if (!(derivationObject2[thisDerivationKey] && dimension1[thisDimensionKey] === dimension2[thisDimensionKey])) {
              return false
          }
      }
      return true
  }
}

// make sure two units are the same unit!
function areSameUnit(unit1, unit2) {
    if (unit1 === undefined && unit2 === undefined) {
        return true
    } else if (unit1 === undefined || unit2 === undefined) {
        return false
    } else {
        return areTwoDerivationObjectsTheSame(unit1.derivation, unit2.derivation)
    }
}

/// what about abbreviations??????
function scanForMetricPrefix(unitName) {
    let k;
    let array = Object.keys(metricPrefixes);
    for (k = 0; k < array.length; k++) {
        const prefix = array[k];
        if (name.indexOf(prefix) === 0) {
            let metricMultiplier = metricPrefixes[prefix].multiplier;
        }

    }
}

// function generateMetricUnit(unitName) { // this function, if given the name of a metric unit, should automatically produce that unit???
//     let k;
//     let array = Object.keys(metricPrefixes);
//     for (k = 0; k < array.length; k++) {
//         let conversionFactor = 1;
//         const prefix = array[k];
//         if (name.indexOf(prefix) === 0) {
//             let originalUnitName = name.replace(prefix, '');
//             if (selectUnit(originalUnitName)) { // gets a unit!
//                 let newUnit = selectUnit(originalUnitName);
//                 if (newUnit.metric) {
//                     newUnit.name = name;
//                     newUnit.conversionFactor *= metricPrefixes[prefix].conversionFactor;
//                     if (newUnit.dimension.name === 'mass') {
//                         newUnit.conversionFactor /= 1000; // because kilograms are the base unit, not grams!
//                     }
//                     return newUnit
//                 }
//             }
//         }
//     }
// }

// can enter a string OR a unit object
function processUnitInput(unitInput) {
    if (typeof(unitInput) === 'string') {
        return new Unit(unitInput)
    } else if (typeof(unitInput) === 'object' && unitInput.isAunit) {
        return unitInput
    }
}



/*
how do i look up the dimension of a derived unit?
it's possible

- look up lessons

 */
