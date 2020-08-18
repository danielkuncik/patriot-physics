/**
 * Created by danielkuncik on 5/31/17.
 * Contains the most important methods for reading and presenting numerical strings
 * For use in creating math programs
 *
 * All operate on ANY numerical string, whether it is currently in standard notation or scientific notation
 */


// deletes leading zeroes, but ensures if the magnitude is less than 1, then the numstring begins '0.---'
// erases unecessary positive signs, maintains negative signs
// makes sure the 'e' in exponent form is lowercase
function cleanUpNumericalString(numString) {
    var newString;
    if (amIaStandardNotationNumString(numString)) {
        newString = cleanUpStandardNotationString(numString);
    } else if (amIanExponentFormNumString(numString)) {
        var coef = getCoefficient(numString);
        var exponent = getExponent(numString);
        var newCoef = cleanUpStandardNotationString(coef);
        var newExp = cleanUpStandardNotationString(exponent);
        if (newExp === '0') {
            newString = newCoef;
        } else {
            newString = "".concat(newCoef,'e',newExp);
        }
    } else {
        return false;
    }
    return newString
}

// turns ANY numerical string into a standard notation number with a certain number of sig figs
// if it is not possible to have a standard notation number with that many sig figs, returns a scientific
// notation number
// if the sigFigs variable is left undefined, then it maintains the same number of sig figs
function getStandardNotation(numString, sigFigs) {
    // convert to scientific notation, with the correct number of sig figs
    // change to standard notation....
    // [if possible, how do i determine if it is possible?]
    /// (how do i determine if keeping the same number of sig figs is impossible???)
    var negativeSign;
    if (numString[0] === '-') {
        negativeSign = true;
        numString = numString.slice(1);
    } else {
        negativeSign = false;
    }

    if (sigFigs === undefined) {
        sigFigs = countSigFigs(numString);
    }

    var sciNotNumString = getScientificNotation(numString, sigFigs);

    var coef = getCoefficient(sciNotNumString);
    var exp = getExponent(sciNotNumString);

    var decimalLocation = findCharacter(coef, '.');
    if (decimalLocation === false) {
        coef = coef.concat('.');
        decimalLocation = coef.length - 1;
    }

    var newNumString = moveDecimalPoint(coef, Number(exp));
    var newSigFigs = countSigFigs(newNumString);
    if (newSigFigs !== sigFigs) { // if we didn't get the correct number of sig figs
        var newDecimalLocation = findCharacter(newNumString,'.');
        if (newDecimalLocation === false) { /// see if adding a decimal point on the end helps!
            newSigFigs = countSigFigs(newNumString.concat('.'));
            if (newSigFigs === sigFigs) {
                newNumString = newNumString.concat('.');
            } else {// if nothing else works, switch back to scientific notation, there is no standard notation with the correct number of sig figs
                newNumString = sciNotNumString;
            }
        } else {// if nothing else works, switch back to scientific notation, there is no standard notation with the correct number of sig figs
            newNumString = sciNotNumString;
        }
    }

    if (negativeSign) {
        newNumString = '-'.concat(newNumString);
    }
    newNumString = cleanUpNumericalString(newNumString);

    // or, try the function i already wrote??? will that work???
    return newNumString;
}


// tursn ANY numerical string into scientific notation with a certain number of sig figs
// if the sigFigs variable is left undefined, then it maintains the smae number of sig figs it currently has
function getScientificNotation(numString, sigFigs) {
    var firstTest, secondTest;

    firstTest = getScientificNotationIncomplete(numString, sigFigs);
    if (amIinScientificNotation(firstTest)) {
        return firstTest
    } else {
        secondTest = getScientificNotationIncomplete(firstTest, sigFigs);
        return secondTest;
    }
}

// used by above function
/// (should i put this into a while loop or something?)
function getScientificNotationIncomplete(numString, sigFigs) {

    // clean up function
    numString = cleanUpNumericalString(numString);

    // save negative sign (if necessary) [positive sign wiped out by above function]
    var sign;
    if (numString[0] === '-') {
        sign = '-';
        numString = numString.slice(1);
    }

    if (sigFigs === undefined) {
        sigFigs = countSigFigs(numString);
    }
    if (sigFigs === 0 || countSigFigs(numString) === 0) {
        return '0';
    }

    var coefficient = getCoefficient(numString);
    var exponent = getExponent(numString); // will return zero if a standard notation numstring


    var firstSigFigLocation = findFirstSigFig(coefficient);
    var decimalLocation = findCharacter(numString,'.');
    if (decimalLocation === false) {
        coefficient = coefficient.concat('.');
        decimalLocation = coefficient.length - 1;
    }

    /// move the decimal, and add spaces ot the exponent
    var decimalMovement;
    if (firstSigFigLocation < decimalLocation) { // magnitude greater than 1
        decimalMovement = firstSigFigLocation  - decimalLocation + 1; // negative is left, positive is right
    } else { // magnitude less than 1
        decimalMovement = firstSigFigLocation - decimalLocation;
    }
    exponent = subtractNaturalNumberNumstrings(exponent, decimalMovement);
    coefficient = moveDecimalPoint(coefficient, decimalMovement);
    coefficient = roundDecimalStringToDecimalPlaces(coefficient, sigFigs - 1);

    // put the number back into scientific notation
    numString = "".concat(coefficient,'e',exponent);


    // add negative sign (if necessary)
    if (sign) {
        numString = '-'.concat(numString);
    }
    numString = cleanUpNumericalString(numString);


    return numString;
}

// turns any numerical string into an integer followed by an exponent with a certain number of sig figs
// (this is equivalent to scientific notation ONLY in the case of one sig fig)
// digits is the total number of digits, which is different than the total number of sig figs!
// if the digits variable is left undefined, then it maintains the same number of sig figs it currently has
// a potential issue: if this function involves ROUNDING, and then i put the results into a ranodm number generator, i may get numerbs slightly out of thr ange specificed
// or, not fill the entire range.
// think abotu this!s
function getIntegerExponentForm(numString, digits) {
    // this is simple
    /// convert to scientific notation, then move the decimal point to the correct spot
    if (digits === undefined) {
        digits = countSigFigs(numString);
    }

    var sciNotString = getScientificNotation(numString, digits);

    var coef = getCoefficient(sciNotString);
    var exp = getExponent(sciNotString);
    var finalCoef, decimalMovement, finalExp, newNumString;

    var decimalLocation = findCharacter(coef,'.');
    if (decimalLocation === false) {
        finalCoef = coef;
        finalExp = exp;
    } else {
        decimalMovement = coef.length - 1 - decimalLocation;
        finalCoef = moveDecimalPoint(coef, decimalMovement); // automatically deletes decimal point when it is at the end of a whole number!
        finalExp = subtractNaturalNumberNumstrings(exp,decimalMovement);
    }

    newNumString = "".concat(finalCoef,'e',finalExp);
    newNumString = cleanUpNumericalString(newNumString);

    return newNumString;
}


// decides whether a number will look more presentable in scientific notation or standard notation
// then, puts it into taht form with the correct number of sig Figs
// if the sigFigs variable is left undefined, then it maintains the same number of sig figs it currently has
function getMostPresentableForm(numString, sigFigs) {
    var standNot, sciNot;
    standNot = getStandardNotation(numString, sigFigs);

    if (standNot.length <= 7) {
        return standNot;
    } else {
        sciNot = getScientificNotation(numString, sigFigs);
        return sciNot;
    }
}
/// very simple for now, i should improve this later!