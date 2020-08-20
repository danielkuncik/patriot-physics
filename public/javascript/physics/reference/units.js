const dimensions = {
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
    },
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


const baseUnits = {
    "meter": {
        "dimension": "length",
        "SI": true,
        "base": true,
        "metric": true,
        "abbreviation": "m"
    },
    "foot": {
        "dimension": "length",
        "SI": false,
        "metric": false,
        "abbreviation": "ft",
        "plural": "feet",
        "conversion_factor": 0.3048
    },
    "inch": {
        "dimension": "length",
        "SI": false,
        "metric": false,
        "abbreviation": "in",
        "conversion_factor": 0.0254
    },
    "mile": {
        "dimension": "length",
        "SI": false,
        "metric": false,
        "abbreviation": "in",
        "conversion_factor": 1609.34
    },
    "kilogram": {
        "dimension": "mass",
        "SI": true,
        "metric": true,
        "abbreviation": "kg",
        "conversion_factor": 1
    },
    "pound": {
        "dimension": "mass",
        "SI": false,
        "metric": false,
        "abbreviation": "lb",
        "conversion_factor": 0.453592
    },
    "second": {
        "dimension": "time",
        "SI": true,
        "base": true,
        "metric": true,
        "abbreviation": "s"
    },
    "minute": {
        "dimension": "time",
        "SI": false,
        "metric": false,
        "abbreviation": "min"
    },
    "hour": {
        "dimension": "time",
        "SI": false,
        "metric": false,
        "abbreviation": "hr"
    },
    "day": {
        "dimension": "time",
        "SI": false,
        "metric": false,
        "abbreviation": "day"
    },
    "Kelvin": {
        "dimension": "temperature",
        "SI": true,
        "metric": true,
        "base": true,
        "abbreviation": "K"
    },
    "Rankine": {
        "dimension": "temperature",
        "SI": false,
        "metric": false,
        "conversion_factor": 0.555556,
        "abbreviation": "°Ra"
    },
    "Celsius": {
        "dimension": "temperature",
        "SI": false,
        "metric": false,
        "conversion_factor": 1,
        "zero_offset": 273.15,
        "abbreviation": "°C"
    },
    "Fahrenheit": {
        "dimension": "temperature",
        "SI": false,
        "metric": false,
        "conversion_factor": 0.555556,
        "zero_offset": -459.67,
        "abbreviation": "°F"
    },
    "Newton": {
        "dimension": "force",
        "SI": true,
        "metric": true,
        "abbreviation": "N"
    },
    "Dyne": {
        "dimension": "force",
        "SI": false,
        "metric": false,
        "conversion_factor": 0.00001,
        "abbreviation": "dyn"
    },
    "Joule": {
        "dimension": "energy",
        "SI": true,
        "metric": true,
        "abbreviation": "J"
    },
    "electronVolt": {
        "dimension": "energy",
        "SI": false,
        "metric": true,
        "conversion_factor": 1.602E-19,
        "abbreviation": "eV"
    },
    "Watt": {
        "dimension": "power",
        "SI": true,
        "metric": true,
        "abbreviation": "W"
    },
    "Ampere": {
        "dimension": "current",
        "SI": true,
        "base": true,
        "metric": true,
    },
    "Coulomb": {
        "dimension": "charge",
        "SI": true,
        "metric": true,
        "conversion_factor": 1,
        "abbreviation": "C"
    }
};

/*
should i just include these above?

how do i deal with derived units???
 */


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

function divideUnits(unitObject1, unitObject2) {
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

/*
move this to a true testing html document
 */
const unit1 = readUnitName('meter');
const unit2 = readUnitName('second');
const unit3 = readUnitName('kilogram');
const unit4 = divideUnits(unit1, unit2);
const unit5 = divideUnits(unit4, unit2);
const unit6 = multiplyUnits(unit3, unit5);
console.log(unit1);
console.log(unit2);
console.log(unit3);
console.log(unit4);
console.log(unit5);
console.log(unit6);
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
    }
}

// check this
function areTwoUnitsTheSameDimension(unit1, unit2) {
    const dimension1 = unit1.dimension_derivation;
    const dimension2 = unit2.dimension_derivation;
    const dimension1Keys = Object.keys(dimension1);
    const dimension2Keys = Object.keys(dimension2);
    if (dimension1Keys.length !== dimension2Keys.length) {
        return false
    } else {
        let i;
        for (i = 0; i < dimension1Keys.length; i++) {
            let thisDimensionKey = dimension1Keys[i];
            if (!(dimension2[thisDimensionKey] && dimension1[thisDimensionKey] === dimension2[thisDimensionKey])) {
                return false
            }
        }
        return true
    }
}

/*
how do i look up the dimension of a derived unit?
it's possible

- look up lessons

 */