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
}

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

const derivedDimensions = {
    "velocity": {
        "base": false,
        "derivation": {
            "length": 1,
            "time": -1
        }
    },
    "acceleration": {
        "base": false,
        "derivation": {
            "length": 1,
            "time": -2
        }
    },
    "force": {
        "base": false,
        "derivation": {
            "mass": 1,
            "length": 1,
            "time": -2
        },
        "SI_unit_special_name": "Newton",
        "other_unit_names": [
            "Dyne"
        ]
    },
    "momentum": {
        "base": false,
        "derivation": {
            "mass": 1,
            "length": 1,
            "time": -1
        }
    },
    "energy": {
        "base": false,
        "derivation": {
            "mass": 1,
            "length": 2,
            "time": -2
        },
        "SI_unit_special_name": "Joule"
    },
    "power": {
        "base": false,
        "derivation": {
            "mass": 1,
            "length": 2,
            "time": -3
        },
        "SI_unit_special_name": "Watt"
    },
    "charge": {
        "base": false,
        "derivation": {
            "current": 1,
            "time": 1
        },
        "SI_unit_special_name": "Coulomb"
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
        }
    },
    "baseDimensionsNonSI": {
        "foot": {
            "dimension": "length",
            "abbreviation": "ft",
            "plural": "feet",
            "conversion_factor": 0.3048
        },
        "inch": {
            "dimension": "length",
            "abbreviation": "in",
            "conversion_factor": 0.0254
        },
        "mile": {
            "dimension": "length",
            "abbreviation": "in",
            "conversion_factor": 1609.34
        },
        "pound": {
            "dimension": "mass",
            "abbreviation": "lb",
            "conversion_factor": 0.453592
        },
        "gram" : {
            "dimension": "mass",
            "abbreviation": "g",
            "conversion_factor": 0.001
        },
        "minute": {
            "dimension": "time",
            "abbreviation": "min",
            "conversionFactor": 1/60
        },
        "hour": {
            "dimension": "time",
            "abbreviation": "hr",
            "conversionFactor": 1/3600
        },
        "day": {
            "dimension": "time",
            "abbreviation": "day",
            "conversionFactor": 1/86400
        },
        "Rankine": {
            "dimension": "temperature",
            "conversion_factor": 0.555556,
            "abbreviation": "°Ra"
        },
        "Celsius": {
            "dimension": "temperature",
            "conversion_factor": 1,
            "zero_offset": 273.15,
            "abbreviation": "°C"
        },
        "Fahrenheit": {
            "dimension": "temperature",
            "conversion_factor": 0.555556,
            "zero_offset": -459.67,
            "abbreviation": "°F"
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





class Unit {
    constructor(name, derivation) {
        if (name === 'string') { /// read unit
            this.name = name;

            /// analyze metric prefix
            let k, metricMultiplier, processedName = name;
            Object.keys(metricPrefixes).forEach((prefix) => {
                if (name.indexOf(prefix) === 0) {
                    metricMultiplier = prefix.multiplier;
                    this.metricAbbreviation = prefix.abbreviation;
                    processedName = name.replace(prefix, '');
                }
            });

            if (units.baseDimensionsSI[processedName]) {
                this.isAunit = true;
                this.dimension = units.baseDimensionsSI[processedName].dimension;
                this.abbreviation = units.baseDimensionsSI[processedName].abbreviation;
                this.conversionFactor = 1;
                this.SI = true;
                this.baseUnit = true;
                this.baseDimension = true;
            } else if (units.baseDimensionsNonSI[processedName]) {
                this.isAunit = true;
                this.dimension = units.baseDimensionsNonSI[processedName].dimension;
                this.abbreviation = units.baseDimensionsNonSI[processedName].abbreviation;
                this.conversionFactor = 1;
                this.SI = false;
                this.baseUnit = false;
                this.baseDimension = true;
            } else if (units.derivedSI[processedName]) {
                this.isAunit = true;
                this.dimension = units.derivedSI[processedName].dimension;
                this.abbreviation = units.derivedSI[processedName].abbreviation;
                this.conversionFactor = units.derivedSI[processedName].conversion_factor;
                this.SI = true;
                this.baseUnit = false;
                this.baseDimension = false;
                this.derivation = units.derivedSI[processedName].derivation;
            } else if (units.derivedNonSI[processedName]) {
                this.isAunit = true;
                this.dimension = units.derivedNonSI[processedName].dimension;
                this.abbreviation = units.derivedNonSI[processedName].abbreviation;
                this.conversionFactor = units.derivedNonSI[processedName].conversion_factor;
                this.SI = false;
                this.baseUnit = false;
                this.baseDimension = false;
                this.derivation = units.derivedNonSI[processedName].derivation;
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

        if (derivation) {
            /// in order to see a new unit
        }
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

function readUnit(unitNameOrDerivation) {
    if (typeof(unitNameOrDerivation) === 'string') {
        return readUnitName(unitNameOrDerivation)
    } else if (typeof(unitNameOrDerivation) === 'object') {
        return readUnitDerivation(unitNameOrDerivation)
    } else {
        return  undefined
    }
}

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


function generateMetricUnit(unitName) { // this function, if given the name of a metric unit, should automatically produce that unit???
    let k;
    let array = Object.keys(metricPrefixes);
    for (k = 0; k < array.length; k++) {
        let conversionFactor = 1;
        const prefix = array[k];
        if (name.indexOf(prefix) === 0) {
            let originalUnitName = name.replace(prefix, '');
            if (selectUnit(originalUnitName)) { // gets a unit!
                let newUnit = selectUnit(originalUnitName);
                if (newUnit.metric) {
                    newUnit.name = name;
                    newUnit.conversionFactor *= metricPrefixes[prefix].conversionFactor;
                    if (newUnit.dimension.name === 'mass') {
                        newUnit.conversionFactor /= 1000; // because kilograms are the base unit, not grams!
                    }
                    return newUnit
                }
            }
        }
    }
}


/*
how do i look up the dimension of a derived unit?
it's possible

- look up lessons

 */
