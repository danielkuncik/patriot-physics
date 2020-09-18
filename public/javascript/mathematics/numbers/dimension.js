
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
};

const baseDimensions = ["length", "mass", "time", "current", "temperature", "amount", "intensity"];

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
            this.isAdimension = true;
          this.name = nameOrDerivation;
        } else {
          this.invalidate();
        }
      } else if (typeof(nameOrDerivation) === 'object') { // derivation entered
        let derivation = nameOrDerivation;
        if (validateDimensionDerivation(derivation)) {
            this.isAdimension = true;
            const array = Object.keys(dimensions);
            let k;
            for (k = 0; k < array.length; k++) {
                const key = array[k];
                const testDerivation = dimensions[key];
                if (areSameDimensionDerivation(derivation, testDerivation)) {
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

    invalidate() {
        this.isAdimension = false;
        this.name = undefined;
        this.derivation = undefined;
    }

    getName() {
        return this.name
    }

    getDerivation() {
        if (this.name) {
          return dimensions[this.name]
        } else if (this.derivation) {
          return this.derivation
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
        const derivation1 = this.getDerivation();
        const derivation2 = anotherDimension.getDerivation();
        let newDerivation = {};
        baseDimensions.forEach((dimension) => {
            let power = 0;
            if (derivation1[dimension]) {
                power += derivation1[dimension];
            }
            if (derivation2[dimension]) {
                power += derivation2[dimension];
            }
            if (power) {
                newDerivation[dimension] = power;
            }
        });
        return new Dimension(newDerivation);
    }

    divide(anotherDimension) {
        const derivation1 = this.getDerivation();
        const derivation2 = anotherDimension.getDerivation();
        let newDerivation = {};
        baseDimensions.forEach((dimension) => {
            let power = 0;
            if (derivation1[dimension]) {
                power += derivation1[dimension];
            }
            if (derivation2[dimension]) {
                power -= derivation2[dimension];
            }
            if (power) {
                newDerivation[dimension] = power;
            }
        });
        return new Dimension(newDerivation);
    }

    inverse() {
        const thisDerivation = this.getDerivation();
        let newDerivation = {};
        baseDimensions.forEach((dimension) => {
            let power = 0;
            if (thisDerivation[dimension]) {
                power -= thisDerivation[dimension];
            }
            if (power) {
                newDerivation[dimension] = power;
            }
        });
        return new Dimension(newDerivation);
    }

    power(exponent) {
        const thisDerivation = this.getDerivation();
        let newDerivation = {};
        baseDimensions.forEach((dimension) => {
            let power = 0;
            if (thisDerivation[dimension]) {
                power += thisDerivation[dimension] * exponent;
            }
            if (power) {
                newDerivation[dimension] = power;
            }
        });
        return new Dimension(newDerivation);
    }
}

function validateDimensionDerivation(derivation) {
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

