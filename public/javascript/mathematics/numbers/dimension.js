
const dimensions = {
    "base": ["length", "mass", "time", "temperature", "amount", "intensity"],
    "derived": {
        "area": {
            "length": 2
        },
        "volume": {
            "length": 3
        },
        "frequency": {
            "time": -1
        },
        "velocity": {
            "length": 1,
            "time": -1
        },
        "acceleration": { // gravitational field is here
            "length": 1,
            "time": -2
        },
        "force": {
            "mass": 1,
            "length": 1,
            "time": -2
        },
        "energy": {
            "mass": 1,
            "length": 2,
            "time": -2
        },
        "power": {
            "mass": 1,
            "length": 2,
            "time": -3
        },
        "charge": {
            "current": 1,
            "time": 1
        },
        "spring_constant": {
            "mass": 1,
            "time": -2
        },
        "potential_difference": {
            "mass": 1,
            "length": 2,
            "time": -3,
            "current": -1
        },
        "resistance": {
            "mass": 1,
            "length": 2,
            "time": -3,
            "current": -2
        },
        "specific_heat": {
            "mass": 2,
            "time": -2,
            "temperature": -1
        },
        "gravitational_constant": {
            "mass": -1,
            "length": 3,
            "time": -2
        },
        "electrostatic_constant": {
            "mass": 1,
            "length": 3,
            "current": -2,
            "time": -4
        },
        "permittivity": {
            "mass": -1,
            "length": -3,
            "current": 2,
            "time": 4
        }
    }
};

class Dimension {
    constructor(name, derivation) {
        if (dimensions.base.includes(name)) {
            this.isAdimension = true;
            this.name = name;
            this.base = true;
            this.derivation = {};
            this.derivation[this.name] = 1;
        } else if (dimensions.derived.includes(name)) {
            this.isAdimension = true;
            this.name = name;
            this.base = false;
            this.derivation = dimensions.derived[derivation];
        } else if (derivation) {
            if (validateDimensionDerivation(derivation)) {
                this.derivation = derivation;
                this.isAdimension = true;
                if (isBaseDerivation(derivation)) {
                    this.isAdimension = true;
                    this.name = Object.keys(derivation)[0];
                    this.base = true;
                } else {
                    this.base = false;
                    const array = Object.keys(dimensions.derived);
                    let k;
                    for (k = 0; k < array.length; k++) {
                        const key = Object.keys(dimensions.derived);
                        const testDerivation = dimensions.derived[key];
                        if (areSameDimensionDerivation(this.derivation, testDerivation)) {
                            this.name = key;
                            break;
                        }
                    }
                    if (this.name === undefined) {
                        this.name = name;
                    }
                }
            } else {
                /// WILL I ALLOW DIMENSIONS WITH NO NAME????????
                /// THOSE WILL PROBABLY MATTER!!!!!!
                this.invalidate();
            }
        }

    }

    invalidate() {
        this.isAdimension = false;
        this.name = undefined;
        this.derivation = undefined;
    }

    getName() {
        return this.name
    }
    getDerivation() {
        return this.derivation
    }
    isBase() {
        return dimensions.base.includes(this.getName())
    }
    getLengthPower() {
        return this.derivation.length ? this.derivation.length : 0    }
    getTimePower() {
        return this.derivation.time ? this.derivation.time : 0    }
    getMassPower() {
        return this.derivation.mass ? this.derivation.mass : 0    }
    getCurrentPower() {
        return this.derivation.current ? this.derivation.current : 0    }
    getTemperaturePower() {
        return this.derivation.temperature ? this.derivation.temperature : 0    }
    getIntensityPower() {
        return this.derivation.intensity ? this.derivation.intensity : 0    }
    getAmountPower() {
        return this.derivation.amount ? this.derivation.amount : 0    }

    multiply(anotherDimension, newName) {
        const baseDimensions = dimensions.base;
        let newDerivation = {};
        baseDimensions.forEach((dimension) => {
            let power = 0;
            if (this.derivation[dimension]) {
                power += this.derivation[dimension];
            }
            if (anotherDimension.derivation[dimension]) {
                power += anotherDimension.derivation[dimension];
            }
            if (power) {
                newDerivation[dimension] = power;
            }
        });
        return new Dimension(newName, newDerivation);
    }

    divide(anotherDimension, newName) {
        const baseDimensions = dimensions.base;
        let newDerivation = {};
        baseDimensions.forEach((dimension) => {
            let power = 0;
            if (this.derivation[dimension]) {
                power += this.derivation[dimension];
            }
            if (anotherDimension.derivation[dimension]) {
                power -= anotherDimension.derivation[dimension];
            }
            if (power) {
                newDerivation[dimension] = power;
            }
        });
        return new Dimension(newName, newDerivation);
    }

    inverse(newName) {
        const baseDimensions = dimensions.base;
        let newDerivation = {};
        baseDimensions.forEach((dimension) => {
            let power = 0;
            if (this.derivation[dimension]) {
                power -= this.derivation[dimension];
            }
            if (power) {
                newDerivation[dimension] = power;
            }
        });
        return new Dimension(newName, newDerivation);
    }

    power(exponent, newName) {
        const baseDimensions = dimensions.base;
        let newDerivation = {};
        baseDimensions.forEach((dimension) => {
            let power = 0;
            if (this.derivation[dimension]) {
                power += this.derivation[dimension] * exponent;
            }
            if (power) {
                newDerivation[dimension] = power;
            }
        });
        return new Dimension(newName, newDerivation);
    }
}

function validateDimensionDerivation(derivation) {
    const baseDimensions = dimensions.base;
    const test = Object.keys(derivation);
    let j;
    for (j = 0; j < test.length; j++) {
        const key = test[j];
        const power = derivation[test[j]];
        if (!baseDimensions.includes(key)) {
            return false
        }
        if (power % 1 === 0 || power % 1 === -0) {
            return false
        }
        if (test.includes(key, j + 1)) { // ensuring there are no diplicates
            return false
        }
    }
    return true
}

function isBaseDerivation(derivation) {
    if (Object.keys(derivation).length === 1) {
        return derivation["length"] === 1 || derivation["time"] === 1 || derivation["mass"] === 1 || derivation["current"] === 1 || derivation["temperature"] === 1 || derivation["intensity"] === 1 || derivation["amount"] === 1
    } else {
        return false
    }
}

function areSameDimensionDerivation(derivation1, derivation2) {
    const baseDimensions = dimensions.base;
    let q;
    for (q = 0; q < baseDimensions.length; q++) {
        const dimension = baseDimensions[q];
        if (derivation1[dimension] && (!derivation2[dimension] || (derivation1[dimension] !== derivation2[dimension]))) {
            return false
        }
    }
    return true
}

function processDimensionInput(input) {
    if (typeof(input) === 'string') {
        return new Dimension(input);
    } else if (typeof(input) === 'object') {
        if (input.isAdimension) {
            return input
        } else {
            return new Dimension(undefined, input)
        }
    }
}