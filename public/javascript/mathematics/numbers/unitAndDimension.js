
/*
dimension n
 */


const canonicalDimensions = {
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
    "velocity": {
        "base": false,
        "derivation": {
            "length": 1,
            "time": -1
        }
    }
};

function searchDimension(name) {
    let dimension = {};
    const index = Object.keys(canonicalDimensions).indexOf(name);
    if(index > -1) {
        dimension.name = name;
        let thisDimension = canonicalDimensions[dimension.name];
        dimension.base = thisDimension.base;
        dimension.SI_unit = thisDimension.SI_unit;
        dimension.otherUnits = thisDimension.other_units;
        dimension.derivation = undefined;
        if (dimension.base) {
            dimension.derivation = {};
            dimension.derivation[this.name] = 1;
        } else {
            dimension.derivation = thisDimension.derivation;
        }
    } else {
        console.log('ERROR: unrecognized unit name entered');
    }
    return dimension
}

function testDerivationObjectsEqual(obj1, obj2) {
    let result = true;
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    if (keys1.length === keys2.length) {
        keys1.forEach((key) => {
            if (keys2.indexOf(key) >= 0) {
                if (obj1[key] === obj2[key]) {

                } else {
                    result = false
                }
            } else {
                result = false
            }
        })
    } else {
        result = false;
    }
    return result
}


class Dimension {
    constructor(derivationOrName) {
        let information = {};
        if (typeof(derivationOrName) === 'string') {
            let name = derivationOrName;
            information = searchDimension(derivationOrName);
        } else if (typeof(derivationOrName) === 'object') {
            let derivation = derivationOrName;
            if (Object.entries(derivationOrName).length === 1 && Object.entries(derivationOrName)[0][1] === 1) {
                let name = Object.keys(derivationOrName)[0];
                information = searchDimension(name);
            } else {
                // test if it is a canonical dimension
                Object.keys(canonicalDimensions).forEach((key) => {
                    let testDimension = canonicalDimensions[key];
                    if (!testDimension.base) {
                        if (testDerivationObjectsEqual(derivation,testDimension.derivation)) {
                            // inefficient??? do i want to include some automatic methods first???
                            information = testDimension;
                        }
                    }
                });

            }

        }
        this.information = information;
    }

    multiply(anotherDimension) {
        let newDerivation = this.derivation;
        Object.keys(anotherDimension.derivation).forEach((key) => {
            if (newDerivation[key]) {
                newDerivation[key] += anotherDimension.derivation[key];
            } else {
                newDerivation[key] = anotherDimension.derivation[key];
            }
        });
        return new Dimension(newDerivation);
    }


    divide(anotherDimension) {
        let newDerivation = this.derivation;
        Object.keys(anotherDimension.derivation).forEach((key) => {
            if (newDerivation[key]) {
                newDerivation[key] -= anotherDimension.derivation[key];
            } else {
                newDerivation[key] = anotherDimension.derivation[key];
            }
        });
        return new Dimension(newDerivation);
    }

    power(exponent) {
        let newDerivation = {};
        Object.keys(this.derivation).forEach((key) => {
            newDerivation[key] = exponent*this.derivation[key];
        });
        return new Dimension(newDerivation)
    }

    inverse() {
        return this.power(-1);
    }
}

let speed = new Dimension({'length':1, "time": -1});
console.log(speed);
