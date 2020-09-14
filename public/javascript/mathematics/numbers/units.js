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

const units = {
    "length": {
        "meter":
            {
                'SI': true,
                "abbreviation": "m"
            },
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
        "second":
            {
                "SI": true,
                "abbreviation": "s"
            },
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
        "kilogram":
            {
                "SI": true,
                "abbreviation": "kg"
            }
    },
    "current": {
        "Ampere":
            {
                "SI": true,
                "abbreviation": "A"
            },
        "pound": {
            "dimension": "mass",
            "abbreviation": "lb",
            "conversion_factor": '0.453592'
        }
    },
    "temperature": {
        "Kelvin":
            {
                "SI": true,
                "abbreviation": "K",
                "plural": "Kelvin"
            },
        "Rankine": {
            "conversion_factor": '0.55555555556',
            "abbreviation": "°Ra"
        }
    },
    "intensity": {
        "candela":
            {
                "SI": true,
                "abbreviation": "cd"
            }
    },
    "amount": {
        "mole":
            {
                "SI": true,
                "abbreviation": "mol"
            }
    },
    "area": {

    },
    "volume": {

    },
    "velocity": {

    },
    "acceleration": {

    },
    "force": {
        "Newton": {
            "SI": true,
            "abbreviation": "N"
        },
        "dyne": {
            "conversion_factor": 0.00001,
            "abbreviation": "dyn"
        }
    },
    "energy": {
        "Joule": {
            "SI": true,
            "abbreviation": "J"
        },
        "electronVolt": {
            "conversion_factor": "1.602E-19",
            "abbreviation": "eV"
        }
    },
    "power": {
        "Watt": {
            "SI": true,
            "abbreviation": "W"
        }
    },
    "charge": {
        "Coulomb": {
            "SI": true,
            "abbreviation": "C"
        }
    },
    "spring_constant": {

    },
    "potential_difference": {
        "Volt": {
            "SI": true,
            "abbreviation": "V"
        }
    },
    "resistance": {
        "Ohm": {
            "SI": true,
            "abbreviation": "Ω"
        }
    },
    "specific_heat": {

    },
    "gravitational_constant": {

    },
    "electrostatic_constant": {

    },
    "permittivity": {

    }
};



// start by coding it without the derivation
class Unit {
    constructor(name, dimensionObject, conversionFactor,derivation) { // derivation is optional and is used to print the name of a unit in the event there is no official name, such as m/s or m/s^2
        this.name = name;

        /// analyze metric prefix
        let metricMultiplier, processedName = name;
        if (processedName) {
            Object.keys(metricPrefixes).forEach((prefix) => { // inefficient because there is no break?
                if (name.indexOf(prefix) === 0) {
                    metricMultiplier = prefix.multiplier;
                    this.metricAbbreviation = prefix.abbreviation;
                    processedName = name.replace(prefix, '');
                }
            });
        }

        /// LOOK UP NAME
        let u, done = false;
        const dimensionList = Object.keys(units);
        for (u = 0; u < dimensionList.length; u++) {
            const dimensionName = dimensionList[u];
            const dimensionUnits = units[dimensionName];
            Object.keys(dimensionUnits).forEach((unitName) => {
                if (processedName === unitName) {
                    const referenceInfo = dimensionUnits[unitName];
                    if (referenceInfo.SI) {
                        this.SI = true;
                        this.conversion_factor = new Measurement(1);
                    } else {
                        this.SI = false;
                        this.conversion_factor = new Measurement(referenceInfo.conversionFactor);
                    }
                    this.abbreviation = referenceInfo.abbreviation;
                    if (referenceInfo.plural) {
                        this.pluralName = referenceInfo.plural;
                    } else {
                        this.pluralName = this.name + 's';
                    }
                    this.dimension = new Dimension(dimensionName);
                    done = true;
                }
            });
            if (done) {
                break;
            }
        }

        if (metricMultiplier) {
            if (this.dimension === 'mass') {
                metricMultiplier /= 1000; // account for the fact that kg, not grams, are the SI unit for mass
            }
            this.conversionFactor = this.conversionFactor.multiply(new Measurement(metricMultiplier));
            this.abbreviation = this.metricAbbreviation + this.abbreviation;
        }


        // process if a dimension and a conversion factor was inputted




    }

    getConversionFactor() {
        return this.conversionFactor
    }

    isSI() {
        return this.SI
    }

    getDimension() {
        return this.dimension
    }

    isBaseDimension() {
        return this.getDimension.isBase()
    }

    isBaseUnit() {
        return this.isSI() && this.isBaseDimension()
    }

    getDimensionName() {
        this.getDimension().getName()
    }

    getName() {
        return this.name
    }

    getPluralName() {
        return this.pluralName
    }

    getAbbreviation() {
        return this.abbreviation
    }

    isSameDimension(anotherUnit) {
        return this.getDimensionName() === anotherUnit.getDimensionName()
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

