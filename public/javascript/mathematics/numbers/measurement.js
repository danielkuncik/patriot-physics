/*
possibility to refactor,

constructor(stringOrFloat,numSigFigsIfFloat, exact) {
    - then, it completes separate issues
    - it stores only two values
    'float' and 'numsig figs'
    all of the functions i am running already need to be run out of these two

    everything comes from those two!

   [or not, think about whether this is a good idea....]
}

 */


// returns true if 'char' is a single character and a digit 0 - 9
function amIaDigit(char) {
    return char === '0' || char === '1' || char === '2' || char === '3' || char === '4' || char === '5' || char === '6' || char === '7' || char === '8' || char === '9';
}

const maxSigFigs = 15; /// beyond this value, javscript number cannot be confied to be accurate

// returns TRUE if the string contains only digits 0 - 9
function digitsOnly(str) {
    let i;
    for (i = 0; i < str.length; i++) {
        let char = str[i];
        if (!amIaDigit(char)) {
            return false
        }
    }
    return true;
}

function makeStringOfZeros(numZeros) {
    let k, zeroString = '';
    for (k = 0; k < numZeros; k++) {
        zeroString = zeroString + '0';
    }
    return zeroString
}

function countTrailingZeros(string) {
    let numTrailingZeros = 0;
    let k;
    for (k = string.length - 1; k >= 0; k-- ){
        if (string[k] === '0') {
            numTrailingZeros++;
        } else {
            return numTrailingZeros
        }
    }
    return numTrailingZeros
}

function allNines(numString) {
    let i;
    for (i = 0; i < numString.length; i++) {
        if (numString[i] !== '9') {
            return false
        }
    }
    return true
}

function reassignDigit(numString, index, newDigit) {
    return numString.slice(0,index) + newDigit + numString.slice(index + 1, numString.length);
}

function roundUpCharacter(char) {
    switch (char) {
        case '0':
            return '1';
        case '1':
            return '2';
        case '2':
            return '3';
        case '3':
            return '4';
        case '4':
            return '5';
        case '5':
            return '6';
        case '6':
            return '7';
        case '7':
            return '8';
        case '8':
            return '9';
        case '9':
            return '0';
        default:
            return null;
    }
}

function roundUpDigit(numString, index) {
    return reassignDigit(numString, index, roundUpCharacter(numString[index]))
}

function validateExponentString(exponentString) {
  if (exponentString[0] === '+' || exponentString[0] === '-') {
      exponentString = exponentString.slice(1,exponentString.length);
  }
  return digitsOnly(exponentString)
}

// PRIVATE FUNCTION
function readExponentString(exponentString) {
    let sign = 1;
    if (exponentString[0] === '+') {
        exponentString = exponentString.slice(1,exponentString.length);
    } else if (exponentString[0] === '-') {
        sign = -1;
        exponentString = exponentString.slice(1,exponentString.length);
    }
    if (!digitsOnly(exponentString)) {
        return undefined
    } else {
        return sign * Number(exponentString)
    }
}


function countSigFigs(numericalString) {
    // // sign
    if (numericalString[0] === '+') {
        numericalString = numericalString.slice(1);
    } else if (numericalString[0] === '-') {
        numericalString = numericalString.slice(1);
    }

    if (numericalString === 'Infinity') {
        return Infinity // inifite sig figs
    }

    // deal with E
    let eLocation = numericalString.indexOf('e');
    if (eLocation === -1) {
        eLocation = numericalString.indexOf('E');
    }
    if (eLocation !== -1) { // if there is an exponent
      let exponentString = numericalString.slice(eLocation + 1); // check that this is right
      if (!validateExponentString(exponentString)) {
        return undefined
      }
      numericalString = numericalString.slice(0, eLocation);
    }
    // do i need to validate the string beyond?

    // delete leading zeros
    let leadingZeros = 0;
    while (numericalString[0] === '0') {
        numericalString = numericalString.slice(1);
        leadingZeros++;
    }
    if ((numericalString.length === 0 || numericalString === '.') && leadingZeros > 0) { // if it was only zeroes
        return 1 // one one sig fig if only zeros
    }


    if (numericalString.indexOf('.') !== -1) {  // values with decimal places
        const decimalPoint = numericalString.indexOf('.');
        const beforeDecimal = numericalString.slice(0, decimalPoint); // make more efficient with 'split???'
        let afterDecimal = numericalString.slice(decimalPoint + 1, numericalString.length);
        if (digitsOnly(beforeDecimal) && digitsOnly(afterDecimal) && (beforeDecimal.length > 0 || afterDecimal.length > 0)) {
            if (beforeDecimal.length > 0) {
                let otherSigFigs = beforeDecimal.slice(1, beforeDecimal.length) + afterDecimal;
                return 1 + otherSigFigs.length;
            } else { // no digits before decimal
                let leadingZerosAfterDecimal = 0;
                // this.orderOfMagnitude -= 1;
                while (afterDecimal[0] === '0') {
                    afterDecimal = afterDecimal.slice(1);
                    // this.orderOfMagnitude -= 1;
                    leadingZerosAfterDecimal++;
                }
                if (afterDecimal.length === 0) { // if it was only zeros
                     return 1 + leadingZerosAfterDecimal;
                } else {
                    let otherSigFigs = afterDecimal.slice(1, afterDecimal.length);
                    return 1 + otherSigFigs.length
                }
            }
        } else {
            return undefined
        }
    } else if (digitsOnly(numericalString) && numericalString.length > 0) { // integers with no .
        while (numericalString[numericalString.length - 1] === '0') {
            numericalString = numericalString.slice(0,numericalString.length - 1);
        }
        let otherSigFigs = numericalString.slice(1,numericalString.length);
        return numSigFigs = 1 + otherSigFigs.length;
    } else {
        return undefined
    }
}

//const maxSigFigs =  12;

// a number with significant figures accounted for
// this class will really only be used in its subclasses: angle, temperature, and magnitude
class Measurement {
    constructor(stringOrFloat, numSigFigsIfFloat = Infinity, zeroLimit = 1e-15) {
        let obj;
        if (typeof(stringOrFloat) === 'string') { // process string
            if (stringOrFloat.length === 0) {
                this.invalidate();
                return undefined
            }
            this.isAmeasurement = true;
            let numSigFigs = countSigFigs(stringOrFloat);
            if (!numSigFigs) {
              this.invalidate();
              return undefined
            } else {
              this.numSigFigs = numSigFigs;
            }
            this.float = Number(stringOrFloat);
        } else if (typeof(stringOrFloat) === 'number') { // process float input
            if (isNaN(stringOrFloat)) {
                this.invalidate();
                return undefined
            }
            this.isAmeasurement = true;
            if (Math.abs(stringOrFloat) < zeroLimit) {
                stringOrFloat = 0;
            }
            this.float = stringOrFloat;
            if (stringOrFloat === Infinity || stringOrFloat === -Infinity) {
                this.numSigFigs = Infinity;
            } else {
                this.numSigFigs = numSigFigsIfFloat
            }
        } else { // neither string nor float input
            this.invalidate();
            return undefined
        }
    }

    /// what if negative???
    getFloat(abs = false) { // argument is to get absolute value
            if (abs) {
                return Math.abs(this.float)
            } else {
                return this.float;
            }

            // let sign = this.isPositive() || abs ? 1 : -1;
            // if (this.isInfinity) {
            //     return Infinity * sign;
            // } else if (this.zero) {
            //     return 0;
            // } else if (this.intermediateValue) {
            //     return this.intermediateValue;
            // } else {
            //     return Number(`${this.firstSigFig}.${this.otherSigFigs}e${this.orderOfMagnitude}`) * sign;
            // }
    }

    // For efficiency, should i add a variable that waves these if you run them once?
    getFirstSigFig() {
        if (!this.isAmeasurement) {
          return undefined
        }
        const numString = this.getNumSigFigs() !== Infinity ? this.getFloat().toExponential(this.getNumSigFigs() - 1) : this.getFloat().toString();
        if (this.isNegative()) {
            return numString[1]
        } else {
            return numString[0]
        }
    }
    getOtherSigFigs() {
        if (!this.isAmeasurement) {
          return undefined
        }
        const numString1 = this.getNumSigFigs() !== Infinity ? this.getFloat().toExponential(this.getNumSigFigs() - 1) : this.getFloat().toString();
        let numString2 = numString1.split('e')[0];
        let numString3 = numString2.replace('.','');
        let numString4 = numString3.replace('-','');
        if (this.isExact()) {
            return numString4.slice(1)
        } else {
            while (numString4.length < this.numSigFigs) {
                numString4 = numString4 + '0';
            }
            return numString4.slice(1,this.numSigFigs)
        }
    }
    getOrderOfMagnitude() {
        if (!this.isAmeasurement) {
          return undefined
        }
        let testFloat = Number(this.getFloat(true).toExponential(this.getNumSigFigs() - 1));
        if (testFloat === 0) {
            return undefined
        } else {
            let orderOfMagnitude = 0;
            while (testFloat >= 10) {
                orderOfMagnitude++;
                testFloat /= 10;
            }
            while (testFloat < 1) {
                orderOfMagnitude--;
                testFloat *= 10;
            }
            return orderOfMagnitude
        }
    }

    getNumSigFigs() {
        if (!this.isAmeasurement) {
          return undefined
        }
        return this.numSigFigs
    }
    isPositive() {
        if (!this.isAmeasurement) {
          return undefined
        }
        return this.getFloat() > 0
    }
    isNegative() {
        if (!this.isAmeasurement) {
          return undefined
        }
        return this.getFloat() < 0
    }
    isExact() {
        if (!this.isAmeasurement) {
          return undefined
        }
        return this.numSigFigs === Infinity
    }
    isZero() { // perhaps this should work differently
        if (!this.isAmeasurement) {
          return undefined
        }
        return this.getFloat() === 0
    }
    isInfinity() {
        if (!this.isAmeasurement) {
          return undefined
        }
        return this.float === Infinity || this.float === -Infinity
    }

    invalidate() {
        this.isAmeasurement = false;
        this.float = NaN;
        this.numSigFigs = undefined;
        return false
    }

    setValueZero(numSigFigs = 1, exact = false) {
        this.isAphysicsNumber = true;
        this.zero = true;
        this.positive = undefined;
        this.orderOfMagnitude = undefined;
        this.numSigFigs = numSigFigs;
        this.firstSigFig = '0';
        this.unit = undefined;
        if (exact) {
            this.numSigFigs = Infinity;
            this.otherSigFigs = '';
            this.exact = true;
        } else {
            this.numSigFigs = numSigFigs;
            this.otherSigFigs = makeStringOfZeros(this.numSigFigs - 1);
            this.exact = false;
        }
        return true
    }


// not done
    setValueInfinity() {
        this.isAphysicsNumber = true;
        this.infinity = true;
        this.numSigFigs = Infinity;
        this.exact = true;
        this.firstSigFig = undefined;
        this.otherSigFigs = undefined;
        this.orderOfMagnitude = undefined;
        // positive attribute is set elsewhere is set elsewhere
    }



    duplicate() {
        // const string = !this.zero ? `${this.positive === false ? '-' : ''}${this.firstSigFig}.${this.otherSigFigs}e${this.orderOfMagnitude}` : `${this.firstSigFig}.${this.otherSigFigs}`;
        // const exact = this.numSigFigs === Infinity;
        // const intermediateValue = this.intermediateValue;
        return new Measurement(this.getFloat(), this.getNumSigFigs())
        // return new PhysicsNumber(string, intermediateValue, exact)
    }

    roundAndDuplicate(numSigFigs) {
        let tempMag = this.duplicate();
        tempMag.round(numSigFigs);
        return tempMag;
    }


    abs() {
        this.positive = true;
    }

    setZeroLimit(newZeroLimit) { // for low values (less than order og magnitude -10; ensures they will not be erased automatically during operations
        this.zeroLimit = newZeroLimit;
    }



    /// PRIVATE FUNCTION
   /* roundToFewerSigFigs(newSigFigs) {
        this.numSigFigs = newSigFigs;
        let numString = this.firstSigFig + this.otherSigFigs;
        let testChar = numString[newSigFigs];
        let numStringNew = numString.slice(0,newSigFigs);
        if (testChar === '0' || testChar === '1' || testChar === '2' || testChar === '3' || testChar === '4') {  // round down
            this.firstSigFig = numStringNew[0];
            this.otherSigFigs = numStringNew.slice(1,newSigFigs); /// chech this
        } else { // round up
            if (allNines(numString)) { // numstring is all 9s
                numStringNew = '1';
                let k;
                for (k = 0; k < this.numSigFigs - 1; k++) {
                    numStringNew = numStringNew + '0';
                }
                this.orderOfMagnitude += 1;
            } else { /// numstring not all 9s
                let index = newSigFigs - 1;
                while (numStringNew[index] === '9') {
                    numStringNew = reassignDigit(numStringNew, index, '0');
                    index--;
                }
                numStringNew = roundUpDigit(numStringNew,index);
            }
            this.firstSigFig = numStringNew[0];
            this.otherSigFigs = numStringNew.slice(1,numStringNew.length);
        }
    }
    */

   // the float variable does not change!
    round(newSigFigs) {
        if (newSigFigs >= this.numSigFigs) {
            // console.log('unable to add significant figures to a magnitude');
            return undefined
        } else {
            this.numSigFigs = newSigFigs;
            return  undefined
        }
    }

      /*
        else if (newSigFigs === this.numSigFigs) {
            return this
        } else if (this.numSigFigs === Infinity) {
            let i;
            for (i = 0; i < newSigFigs+ 2; i++) {
                this.otherSigFigs = this.otherSigFigs + '0'; // add lots of zeros, then round to fewer sig figs
            }
            this.roundToFewerSigFigs(newSigFigs);
        } else {
            this.roundToFewerSigFigs(newSigFigs)
        }
    }
    */


    // what about signs????
    /// need to work on the 'exactly!!!!'
    printStandardNotation() { // returns false if this is impossible to the correct number of significant figures
        if (this.isZero()) {
            return this.printZero()
        }
        const orderOfMag = this.getOrderOfMagnitude();
        const firstSigFig = this.getFirstSigFig();
        const otherSigFigs = this.getOtherSigFigs();
        const numSigFigs = this.getNumSigFigs();
        const sign = !this.isPositive() ? '-' : '';
        if (orderOfMag > 0 && orderOfMag > this.getNumSigFigs() - 1) {
            if (otherSigFigs[numSigFigs - 2] === '0') {
                return this.printScientificNotation(); /// in this event, you cannot print a standard notation number with the correct number of significant figures
            }
            return `${sign}${firstSigFig}${otherSigFigs}${makeStringOfZeros(orderOfMag - numSigFigs + 1)}` // a special case => what about a number with SIGNIFICANT zeros on the end
        } else if (orderOfMag > 0 && orderOfMag === numSigFigs - 1) {
            return `${sign}${firstSigFig}${otherSigFigs}${otherSigFigs[numSigFigs - 2] === '0' ? '.' : ''}`
        } else if (orderOfMag > 0 && orderOfMag < numSigFigs - 1) {
            return `${sign}${firstSigFig}${otherSigFigs.slice(0,orderOfMag)}.${otherSigFigs.slice(orderOfMag, numSigFigs - 1)}`
        } else if (orderOfMag === 0) {
            if (otherSigFigs.length > 0) {
                return `${sign}${firstSigFig}.${otherSigFigs}`
            } else {
                return `${sign}${firstSigFig}`
            }
        } else if (orderOfMag < 0) {
            return `${sign}0.${makeStringOfZeros(Math.abs(orderOfMag) - 1)}${firstSigFig}${otherSigFigs}`
        }
        /// what about zeros???
    }

    /// private function
    printZero() {
        if (this.isZero()) {
            if (this.isExact()) {
                return 'exactly 0';
            } else if (this.getNumSigFigs() === 1) {
                return '0'
            } else {
                return `0.${this.getOtherSigFigs()}`
            }
        } else {
            return undefined
        }
    }

    printScientificNotation() {
        if (this.isZero()) {
            return this.printZero()
        }
        return this.float.toExponential(this.numSigFigs)
        // const exactly = (this.numSigFigs === Infinity) ? 'exactly ' : '';
        // const sign = (this.positive === false) ? '-' : '';
        // if (this.numSigFigs === 1) {
        //     return `${sign}${this.firstSigFig}e${String(this.orderOfMagnitude)}`;
        // } else {
        //     return `${exactly}${sign}${this.firstSigFig}.${this.otherSigFigs}e${String(this.orderOfMagnitude)}`;
        // }
    }

    printOptimal() { // if print exactly is selected, it prints the word exatly
        if (this.isZero()) {
            console.log('here');
            return this.printZero()
        }
        let standardNot = this.printStandardNotation();
        let sciNot = this.printScientificNotation();
        return standardNot.length <= sciNot.length ? standardNot : sciNot
    }


    // what about signs?????
    comparisonTest(type, anotherMagnitude, numSigFigs = Math.min(this.numSigFigs, anotherMagnitude.numSigFigs)) {
        if (numSigFigs > Math.min(this.numSigFigs, anotherMagnitude.numSigFigs)) { // asking for more sig figs than you actually have
            /*
            In this case, i need to figure out if they COULD possibly be equal, or not, to a greater number of sig figs
            example:
            0.5 and 0.456, no
            to one sig fig these are equal
            to two or more sig figs, we are not sure, they could be equal, greater, or less

            but, 8.0 and 4
            no matter how many sig figs you have, will never be equal!
             */
            let tempMag1, tempMag2;
            if (this.numSigFigs < anotherMagnitude.numSigFigs) {
                tempMag1 = this.duplicate();
                tempMag2 = anotherMagnitude.roundAndDuplicate(this.numSigFigs);
            } else if (this.numSigFigs === anotherMagnitude.numSigFigs) {
                tempMag1 = this.duplicate();
                tempMag2 = anotherMagnitude.duplicate();
            } else if (this.numSigFigs > anotherMagnitude.numSigFigs) {
                tempMag1 = this.roundAndDuplicate(anotherMagnitude.numSigFigs);
                tempMag2 = anotherMagnitude.duplicate();
            }
            if (this.comparePhysicsNumbersWithEqualNumbersOfSigFigs('=', tempMag1, tempMag2)) {
                return undefined // if equal when rounded to the same number of significant figures, then you cannot conduct a comparison test
            } else { ///
                return this.comparePhysicsNumbersWithEqualNumbersOfSigFigs(type, tempMag1, tempMag2) // otherwise, you can compare them once they are the same number of sig figs
            }
        } else if (numSigFigs <= Math.min(this.numSigFigs, anotherMagnitude.numSigFigs) && numSigFigs < Infinity) { // asking for fewer sig figs than you have (what about exact????)
            const tempMag1 = this.roundAndDuplicate(numSigFigs);
            const tempMag2 = anotherMagnitude.roundAndDuplicate(numSigFigs); // now they have the same number of sig figs
            return this.comparePhysicsNumbersWithEqualNumbersOfSigFigs(type, tempMag1, tempMag2)
        } else if (numSigFigs <= Math.min(this.numSigFigs, anotherMagnitude.numSigFigs) && numSigFigs === Infinity) {
            // two exact numbers
            return this.comparePhysicsNumbersWithEqualNumbersOfSigFigs(type, this, anotherMagnitude);
            return undefined
        }
    }

    // private function!!!
    compareInfinities(anotherMagnitude) {
        if (this.infinity && anotherMagnitude.infinity) {
            if (this.positive && anotherMagnitude.positive) {
                return '='
            } else if (!this.positive && !anotherMagnitude.positive) {
                return '='
            } else if (this.positive && !anotherMagnitude.positive) {
                return '>'
            } else if (!this.positive && anotherMagnitude.positive) {
                return '<'
            }
        } else if (this.infinity) {
            if (this.positive) {
                return '>'
            } else {
                return '<'
            }
        } else if (anotherMagnitude.infinity) {
            if (anotherMagnitude.positive) {
                return '<'
            } else {
                return '>'
            }
        } else {
            return undefined
        }
    }

    // testes if equal up to a certain number of sig figs
    isEqualTo(anotherMagnitude, numSigFigs) {
        if (this.compareInfinities(anotherMagnitude)) {
            if (this.compareInfinities(anotherMagnitude) === '=') {
                return true
            } else {
                return false
            }
        } else {
            return this.comparisonTest('=', anotherMagnitude, numSigFigs)
        }
    }

    isGreaterThan(anotherMagnitude, numSigFigs) {
        if (this.compareInfinities(anotherMagnitude)) {
            if (this.compareInfinities(anotherMagnitude) === '>') {
                return true
            } else {
                return false
            }
        } else {
            return this.comparisonTest('>', anotherMagnitude, numSigFigs)
        }
    }
    isLessThan(anotherMagnitude, numSigFigs) {
        if (this.compareInfinities(anotherMagnitude)) {
            if (this.compareInfinities(anotherMagnitude) === '<') {
                return true
            } else {
                return false
            }
        } else {
            return this.comparisonTest('<', anotherMagnitude, numSigFigs)
        }
    }
    isGreaterThanOrEqualTo(anotherMagnitude, numSigFigs) {
        if (this.compareInfinities(anotherMagnitude)) {
            let test = this.compareInfinities(anotherMagnitude);
            if (test === '>' || test ==='=') {
                return true
            } else {
                return false
            }
        } else {
            return this.comparisonTest('>=', anotherMagnitude, numSigFigs)
        }
    }

    isLessThanOrEqualTo(anotherMagnitude, numSigFigs) {
        if (this.compareInfinities(anotherMagnitude)) {
            let test = this.compareInfinities(anotherMagnitude);
            if (test === '<' || test ==='=') {
                return true
            } else {
                return false
            }
        } else {
            return this.comparisonTest('<=', anotherMagnitude, numSigFigs)
        }
    }

    //// PRIVATE FUNCTION!
    comparePhysicsNumbersWithEqualNumbersOfSigFigs(type, tempMag1, tempMag2) {
        const string1 = !tempMag1.zero ? `${tempMag1.positive === false ? '-' : ''}${tempMag1.firstSigFig}.${tempMag1.otherSigFigs}e${tempMag1.orderOfMagnitude}` : `${tempMag1.firstSigFig}.${tempMag1.otherSigFigs}`;
        const string2 = !tempMag2.zero ? `${tempMag1.positive === false ? '-' : ''}${tempMag2.firstSigFig}.${tempMag2.otherSigFigs}e${tempMag2.orderOfMagnitude}` : `${tempMag2.firstSigFig}.${tempMag2.otherSigFigs}`;
        const num1 = Number(string1); // do not use getFloat(), because intermediate values should not be used for comparison testing
        const num2 = Number(string2);
        if (type === '=') {
            return num1 === num2
        } else if (type === '>') {
            return num1 > num2
        } else if (type === '<') {
            return num1 < num2
        } else if (type === '>=') {
            return num1 >= num2
        } else if (type === '<=') {
            return num1 <= num2
        }
    }

    /// correct inputted answer
    // this function assumes that this object is the correct answer
    correctInputtedAnswer(inputtedAnswer, type = 'exact', acceptedPercentDifference) {
        if (type === 'exact') {
            return this.correctInputtedAnswerExact(inputtedAnswer)
        } else if (type === 'float') {
            return this.correctInputtedAnswerFloat(inputtedAnswer, acceptedPercentDifference)
        }
    }

    /// private method!
    correctInputtedAnswerExact(inputtedAnswer) {
        let correct = true, comment = '';
        if (inputtedAnswer.numSigFigs === this.numSigFigs) {
            if (inputtedAnswer.orderOfMagnitude !== this.orderOfMagnitude) {
                correct = false;
                if (inputtedAnswer.divideMag(this).orderOfMagnitude !== 0) {
                    comment = comment + `Your answer is the incorrect order of magnitude! That means you made a big error :(`;
                }
            }
            if (!(inputtedAnswer.firstSigFig === this.firstSigFig)) {
                correct = false;
                comment = comment + `the First Sig Fig ${inputtedAnswer.firstSigFig} is not correct`;
            }
            if (!(inputtedAnswer.otherSigFigs === this.otherSigFigs)) {
                correct = false;
                comment = comment + `The Sig Figs beyond the first are not correct`;
            }

            if (!correct && (percentDifference(inputtedAnswer.getFloat(), this.getFloat()) < 1)) {
                comment = comment + 'You are off by less than 1%! So close! Maybe you rounded incorrectly at some point in the process?';
            }
        } else if (inputtedAnswer.numSigFigs < this.numSigFigs) {
            correct = false;
            comment = comment + 'You have too few significant figures';
            if (!correct && (percentDifference(inputtedAnswer.getFloat(), this.getFloat()) < 1)) {
                comment = comment + 'But, you are off by less than 1%! So if you add the extra significant figures you should be good!';
            }
        } else if (inputtedAnswer.numSigFigs > this.numSigFigs) {
            correct = false;
            comment = comment + 'You have too many significant figures';
            if (!correct && (percentDifference(inputtedAnswer.getFloat(), this.getFloat()) < 1)) {
                comment = comment + 'But, you are off by less than 1%! So round correctly and see if you are right!';
            }
        }
        return {
            correct: correct,
            comment: comment
        }
    }

    // private method
    correctInputtedAnswerFloat(inputtedAnswer, acceptedPercentDifference = 1) {
        let correct = percentDifference(inputtedAnswer.getFloat(), this.getFloat()) < acceptedPercentDifference;
        let comment = '';
        return {
            correct: correct,
            comment: comment
        }

    }


    reverseSign() {
        return new Measurement(this.getFloat() * -1, this.getNumSigFigs())
    }

    // reverseSign() {
    //     let newNumber = this.duplicate();
    //     if (newNumber.zero) {
    //         return newNumber
    //     } else {
    //         newNumber.positive = !newNumber.positive;
    //         if (this.intermediateValue) {
    //             newNumber.intermediateValue *= -1; // this was a good bug to find! 8-31-2020, 2:30 pm!
    //         }
    //         return newNumber
    //     }
    // }


    // PRIVATE METHOD!!!!
    // for addition, subtraction, pythagorean addition, pythagorean subtraction
    // addOrSubtract(operation, anotherMagnitude, zeroLimit = this.zeroLimit) {
    //
    //     const newSigFigs = Math.min(this.numSigFigs, anotherMagnitude.numSigFigs); // needs to change
    //
    //     let newFloat;
    //     if (operation === '+') {
    //         newFloat = this.getFloat() + anotherMagnitude.getFloat();
    //     } else if (operation === '-') {
    //         newFloat = this.getFloat() - anotherMagnitude.getFloat();
    //     } else if (operation === 'pythagorean_+') {
    //         newFloat = Math.sqrt(this.getFloat()**2 + anotherMagnitude.getFloat()**2);
    //     } else if (operation === 'pythagorean_-') {
    //         newFloat = Math.sqrt(this.getFloat()**2 - anotherMagnitude.getFloat()**2);
    //     }
    //     return new Measurement(newFloat, newSigFigs)
    // }

    // PRIVATE METHOD
    getSigFigsForCombination(anotherMeasurement) {
        if (this.getOrderOfMagnitude() > anotherMeasurement.getOrderOfMagnitude()) {
            const lowestDigitThatMatters = this.getOrderOfMagnitude() - this.numSigFigs + 1;
            if (anotherMeasurement.getOrderOfMagnitude() < lowestDigitThatMatters) { // case in which one measurement is so much lower it does not count
                return this.getNumSigFigs()
            } else {
                return this.getOrderOfMagnitude() - anotherMeasurement.getOrderOfMagnitude() + 1
            }
            // more complex piece here
        } else if (this.getOrderOfMagnitude() < anotherMeasurement.getOrderOfMagnitude()) {
            const lowestDigitThatMatters = anotherMeasurement.getOrderOfMagnitude() - anotherMeasurement.numSigFigs + 1;
            if (this.getOrderOfMagnitude() < lowestDigitThatMatters) {
                return anotherMeasurement.getNumSigFigs()
            } else {
                return anotherMeasurement.getOrderOfMagnitude() - this.getOrderOfMagnitude() + 1
            }
        } else {
            return Math.min(this.getNumSigFigs(), anotherMeasurement.getNumSigFigs())
        }
        return Math.min(this.getNumSigFigs(), anotherMeasurement.getNumSigFigs())
    }

    add(anotherMeasurement, zeroLimit) {
        let otherMeasurement = processMeasurementInput(anotherMeasurement);
        const newSigFigs = this.getSigFigsForCombination(otherMeasurement);
        return new Measurement(this.getFloat() + otherMeasurement.getFloat(), newSigFigs, zeroLimit)
    }

    subtract(anotherMeasurement, zeroLimit) {
        let otherMeasurement = processMeasurementInput(anotherMeasurement);
        const newSigFigs = this.getSigFigsForCombination(otherMeasurement);
        return new Measurement(this.getFloat() - otherMeasurement.getFloat(), newSigFigs, zeroLimit)
    }

    pythagoreanAdd(anotherMeasurement, zeroLimit) {
        let otherMeasurement = processMeasurementInput(anotherMeasurement);
        const newSigFigs = this.getSigFigsForCombination(otherMeasurement);
        return new Measurement(math.sqrt(this.getFloat()**2 + otherMeasurement.getFloat()**2), newSigFigs, zeroLimit)
    }

    pythagoreanSubtract(anotherMeasurement, zeroLimit) {
        let otherMeasurement = processMeasurementInput(anotherMeasurement);
        const newSigFigs = this.getSigFigsForCombination(otherMeasurement);
        return new Measurement(math.sqrt(this.getFloat()**2 - otherMeasurement.getFloat()**2), newSigFigs, zeroLimit)
    }


// can make more efficient for zeros?
    multiply(anotherMeasurement, zeroLimit) {
        let otherMeasurement = processMeasurementInput(anotherMeasurement);
        const newSigFigs = Math.min(this.getNumSigFigs(), otherMeasurement.getNumSigFigs()); // this will need to be revised
        return new Measurement(this.getFloat() * otherMeasurement.getFloat(), newSigFigs, zeroLimit)

        /*let newSigFigs;
        if (this.zero && anotherMagnitude.zero) { // rules of sig fig multiplication are a little different if one of the values is zero
            newSigFigs = Math.max(this.numSigFigs, anotherMagnitude.numSigFigs);
        } else if (this.zero) {
            newSigFigs = this.numSigFigs;
        } else if (anotherMagnitude.zero) {
            newSigFigs = anotherMagnitude.numSigFigs;
        } else {
            newSigFigs = Math.min(this.numSigFigs, anotherMagnitude.numSigFigs);
        }
        const exact = newSigFigs === Infinity;
        const newFloat = this.getFloat() * anotherMagnitude.getFloat();
        return new Measurement(newFloat, newSigFigs)
        */

    }

    divide(anotherMeasurement, zeroLimit) {
        let otherMeasurement = processMeasurementInput(anotherMeasurement);
        const newSigFigs = Math.min(this.getNumSigFigs(), otherMeasurement.getNumSigFigs()); // this will need to be revised
        return new Measurement(this.getFloat() / otherMeasurement.getFloat(), newSigFigs, zeroLimit)

        /*
        if (!this.infinity && anotherMagnitude.infinity) {
            return new Measurement(0)
        } else if (this.infinity && anotherMagnitude.infinity) {
            return new Measurement(undefined)
        }
        const newSigFigs = Math.min(this.numSigFigs, anotherMagnitude.numSigFigs);
        const newFloat = this.getFloat() / anotherMagnitude.getFloat();
        return new Measurement(newFloat, newSigFigs)
        */

    }

    inverse(zeroLimit) {
        return this.divide(1, zeroLimit)
    }

/*
  these are superfluous now
  multiplyExactConstant(exactConstant) {
        return constructMagnitudeFromFloat(this.getFloat() * exactConstant, this.numSigFigs, this.unit, this.exact, this.zeroLimit);
    }

    divideExactConstant(exactConstant) {
        return constructMagnitudeFromFloat(this.getFloat() / exactConstant, this.numSigFigs, this.unit, this.exact, this.zeroLimit);
    }

 */


    square() {
        const newSigFigs = this.numSigFigs;
        const newUnit = multiplyUnits(this.unit, this.unit);
        const exact = this.numSigFigs === Infinity;
        const newFloat = this.getFloat()**2;
        return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, this.zeroLimit)
    }

    squareRootMag() {
        const newSigFigs = this.numSigFigs;
        const newUnit = multiplyUnits(this.unit, this.unit);
        const exact = this.numSigFigs === Infinity;
        const newFloat = Math.sqrt(this.getFloat()**2);
        return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, this.zeroLimit)
    }

    power(exponent) {
        const newSigFigs = this.numSigFigs;
        const newUnit = multiplyUnits(this.unit, this.unit);
        const exact = this.numSigFigs === Infinity;
        const newFloat = this.getFloat()**exponent;
        return constructMagnitudeFromFloat(newFloat, newSigFigs, newUnit, exact, this.zeroLimit)
    }

    inverseSin() {
        if (this.unit !== undefined) {
            console.log('can only complete trig functions on a unitless quantity');
            return false
        }
        const newFloat = Math.asin(this.getFloat());
        const newSigFigs = Math.min(this.numSigFigs, 15);
        const exact = false; // // this operation always reduces the number of sig figs to 15
        return constructAngleFloat(newFloat, newSigFigs, false, exact, this.zeroLimit)
    }
    inverseCos() {
        if (this.unit !== undefined) {
            console.log('can only complete trig functions on a unitless quantity');
            return false
        }
        const newFloat = Math.acos(this.getFloat());
        const newSigFigs = Math.min(this.numSigFigs, 15);
        const exact = false; // this operation always reduces the number of sig figs to 15
        const newUnit = undefined;
        return constructAngleFloat(newFloat, newSigFigs, false, exact, this.zeroLimit)

    }
    inverseTan() {
        if (this.unit !== undefined) {
            console.log('can only complete trig functions on a unitless quantity');
            return false
        }
        const newFloat = Math.atan(this.getFloat());
        const newSigFigs = Math.min(this.numSigFigs, 15);
        const exact = false; // this operation always reduces the number of sig figs to 15
        const newUnit = undefined;
        return constructAngleFloat(newFloat, newSigFigs, false, exact, this.zeroLimit)
    }

}

function percentDifference(inputted, expected) {
    return (Math.abs(inputted - expected) / expected) * 100
}

function processMeasurementInput(input) {
    if (typeof(input) === 'number' || typeof(input) === 'string') {
        return new Measurement(input)
    } else if (typeof(input) === 'object' && input.isAmeasurement) {
        return input
    }
}