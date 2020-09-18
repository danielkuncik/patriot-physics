
const dimensions = {
  "length": {
    "length": 1
  },
  "mass": {
    "mass": 1
  },
  "time": {
    "time": 1
  },
  "current": {
    "current": 1
  },
  "temperature": {
    "temperature": 1
  },
  "amount": {
    "amount": 1
  },
  "intensity": {
    "intensity": 1
  },
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
      "length": 2,
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

const baseDimensions = ["length", "mass", "time", "current", "temperature", "amount", "intensity"];
//
//
// const dimensions = {
//     "base": ["length", "mass", "time", "current", "temperature", "amount", "intensity"],
//     "derived": {
//         "area": {
//             "length": 2
//         },
//         "volume": {
//             "length": 3
//         },
//         "frequency": {
//             "time": -1
//         },
//         "velocity": {
//             "length": 1,
//             "time": -1
//         },
//         "acceleration": { // gravitational field is here
//             "length": 1,
//             "time": -2
//         },
//         "force": {
//             "mass": 1,
//             "length": 1,
//             "time": -2
//         },
//         "energy": {
//             "mass": 1,
//             "length": 2,
//             "time": -2
//         },
//         "power": {
//             "mass": 1,
//             "length": 2,
//             "time": -3
//         },
//         "charge": {
//             "current": 1,
//             "time": 1
//         },
//         "spring_constant": {
//             "mass": 1,
//             "time": -2
//         },
//         "potential_difference": {
//             "mass": 1,
//             "length": 2,
//             "time": -3,
//             "current": -1
//         },
//         "resistance": {
//             "mass": 1,
//             "length": 2,
//             "time": -3,
//             "current": -2
//         },
//         "specific_heat": {
//             "length": 2,
//             "time": -2,
//             "temperature": -1
//         },
//         "gravitational_constant": {
//             "mass": -1,
//             "length": 3,
//             "time": -2
//         },
//         "electrostatic_constant": {
//             "mass": 1,
//             "length": 3,
//             "current": -2,
//             "time": -4
//         },
//         "permittivity": {
//             "mass": -1,
//             "length": -3,
//             "current": 2,
//             "time": 4
//         }
//     }
// };

/*
each dimension object has EITHER a name or a derivation

if it is one of the cannonical dimensions, in the dimension object above,
then it has a name, and if the derivation is necessary, the name is used to retrieve it

if it is not a cannonical dimesion, it has a derivation, which is an object
that gives the power of each of the seven base dimensions

dimensions can be constructed by entering either a name or a derivation object
if a name is entered, then if it is a cannonical name, it is saved
otherwise, the dimension is invalid

if a derivation object is entered, then the construcotr tests if that derivation object is
one of the cannonical dimensions,
if it is , then the name of that dimension is saved,
otherwise, the derivaiton is saved and no name is saved
*/

class Dimension {
    constructor(nameOrDerivation) {
      if (typeof(nameOrDerivation) === 'string') { // name entered
        if (dimensions[nameOrDerivation]) {
          this.name = nameOrDerivation;
        } else {
          this.invalidate();
        }
      } else if (typeof(nameOrDerivation) === 'object') { // derivation entered
        let derivation = nameOrDerivation;
        if (validateDimensionDerivation(derivation)) {
            let possibleDerivation = derivation;
            this.isAdimension = true;
            const array = Object.keys(dimensions);
            let k;
            for (k = 0; k < array.length; k++) {
                const key = array[k];
                const testDerivation = dimensions[key];
                if (areSameDimensionDerivation(this.derivation, testDerivation)) {
                    this.name = key;
                    break;
                }
            }
            if (this.name === undefined) {
              this.derivation = derivation;
            }
        } else {
          this.invalidate();
        }
      } else {
        this.invalidate();
      }
    }

/*
    oldConstructor(name, derivation) {
        if (dimensions.base.includes(name)) {
            this.isAdimension = true;
            this.name = name;
            this.derivation = {};
            this.derivation[this.name] = 1;
        } else if (Object.keys(dimensions.derived).includes(name)) {
            this.isAdimension = true;
            this.name = name;
            this.derivation = dimensions.derived[name];
        } else if (derivation) {
            if (validateDimensionDerivation(derivation)) {
                this.derivation = derivation;
                this.isAdimension = true;
                if (isBaseDerivation(derivation)) {
                    this.isAdimension = true;
                    this.name = Object.keys(derivation)[0];
                } else {
                    const array = Object.keys(dimensions.derived);
                    let k;
                    for (k = 0; k < array.length; k++) {
                        const key = array[k];
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
    */

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
    getDerivation() {
        if (this.getName()) {
          return dimensions[this.getName()]
        } else if (this.getDerivation()) {
          return this.getDerivation()
        } else {
          return undefined
        }
    }
    isBase() {
        const derivation = this.getDerivation();
        return Object.keys(derivation).length === 1 && derivation[Object.keys(derivation)[0]] === 1
    }
    getLengthPower() {
        return this.getDerivation().length ? this.getDerivation().length : 0    }
    getTimePower() {
        return this.getDerivation().time ? this.getDerivation().time : 0    }
    getMassPower() {
        return this.getDerivation().mass ? this.getDerivation().mass : 0    }
    getCurrentPower() {
        return this.getDerivation().current ? this.getDerivation().current : 0    }
    getTemperaturePower() {
        return this.getDerivation().temperature ? this.getDerivation().temperature : 0    }
    getIntensityPower() {
        return this.getDerivation().intensity ? this.getDerivation().intensity : 0    }
    getAmountPower() {
        return this.getDerivation().amount ? this.getDerivation().amount : 0    }

        // I don't need to go through all base dimensions...i can go through all of those that are there
    multiply(anotherDimension) {
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

    divide(anotherDimension) {
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

    inverse() {
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

    power(exponent) {
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
        if (power % 1 !== 0 || power % 1 !== -0) {
            return false
        }
        if (test.includes(key, j + 1)) { // ensuring there are no duplicates
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
    if (Object.keys(derivation1).length !== Object.keys(derivation2).length) {
        return false
    }
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
