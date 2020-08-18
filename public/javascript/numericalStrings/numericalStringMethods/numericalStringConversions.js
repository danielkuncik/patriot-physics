/**
 * Created by danielkuncik on 5/29/17.
 * Contains Functions that convert the form of the numerical string without losing any information
 * (Does not contain rounding methods!)
 */


// converts a standard notation numerical string into scientific notation
// no alteration made to the number of significant figures
// this is harder than i thought!
function convertStandardToScientific(numString, sigFigs) {
    var decimal = findCharacter(numString, '.');
    if (decimal === false) { /// must put === false because !decimal would create problems if the decimal were in position 0
        decimal = numString.length;
        numString = "".concat(numString,'.'); // ill delete it later, but this way i dont need to worry about an annoying if statement
    }

    // returns index of the first significant figure of a problem
    var firstSigFig = findFirstSigFig(numString);


    var exponent = decimal - firstSigFig - 1; // for positive exponents

    numString = deleteFromString(numString, decimal);

    if (decimal < firstSigFig) { // for negative exponents
        firstSigFig -= 1; // if the decimal was before the firstSigFig, i need to subtract from the index to account for that
        exponent = decimal - firstSigFig - 1; // makes it work
    }

    // add new decimal point immediately after the frist sig fig
    numString = insertIntoString(numString, '.', firstSigFig);

    // delete leading zeroes
    numString = numString.slice(firstSigFig);
    firstSigFig = 0; // i want to keep this variable alive

    // round out the unecessary decimal soaces, or add more zeroes if necessary
    numString = roundDecimalStringToDecimalPlaces(numString, sigFigs - 1);

    /// add exponent
    numString = numString.concat('e',exponent.toString());

    return numString;

}
/// the only situation when it DOES NOT WORK is if you have a.. nines, 9.9999 === then, it will return 10.0000, which is not scientific notation
//  i could easily put a line to fix that, but then it would be less efficient, should i?  i think accuracy is more important than speed
/// (do i need some sort of validation??? there's no error handling if you enter the wrong variable!)
/// also, if there is only one significant figure, it can get a bit awkward because there is an unecessary decimal point


// if a numerical string is a whole number [contains no decimal point], adds a decimal point on the end
// else, returns the numstring is it is
function addDecimalPointToWholeNumber(numString) {

    var decimalLocation = findCharacter(numString, '.');
    if (decimalLocation === false) {
        return concat(numString, ".");
    } else {
        return numString;
    }
}

// given a scientific notation number, returns a standard notation number
function scientificToStandard(numString) {

    var exponent,
        locationofE,
        negativeExponent = false,
        coefficent;

    locationofE = findCharacter(numString, 'e');
    exponent = numString.slice(locationofE + 1);
    coefficent = numString.slice(0, locationofE);

    if (exponent[0] === '-') {
        negativeExponent = true;
        exponent = exponent.slice(1);
    }

    var decimalMotion = Number(exponent); // this needs to be converted to int ! -- i dont like this, i like keeping it all strings
    if (negativeExponent) {
        decimalMotion *= -1;
    }

    coefficent = moveDecimalPoint(coefficent, decimalMotion);

    return coefficent;
}

/// i should make this function work for scientific notation as well!!!!
function turnNumstringIntoIntegerWithExponent(numString) {
    var exponent = 0;

    // if you have a number in exponent form, take account for the decimal that's already there
    // once i have more validations etc. there may be a cleaner way to do this

    // testing if you have a number in exponent form
    var eLocation;
    eLocation = findE(numString);

    // what to do if you find a number in exponent form
    if (eLocation !== false) {
        exponent += Number(numString.slice(eLocation  + 1));
        numString = numString.slice(0,eLocation);
    }


    var decimalLocation = findCharacter(numString, '.');
    if (decimalLocation === false) { // it already is an integer, so just add an 'e0'
        // do nothing
        exponent += 0;
    } else {
        // move the decimal to the end, delete it, and count that as an exponent!
        exponent += -1 * (numString.length -  decimalLocation - 1); // positive version of exponent
        numString = deleteFromString(numString, decimalLocation);
    }

    return numString.concat('e',String(exponent));

}

// eliminates trailing zeroes, and puts taht information into an exponent
function eliminateTrailingZeroesFromInteger(numStringInteger) {

    // must be in correct form!!
    var ready = amIDigitsOnly(numStringInteger);
    if (!ready) {
        return numStringInteger;
    }

    var k= numStringInteger.length - 1, zeroesKilled = 0;

    while (numStringInteger[k] === '0') {
        numStringInteger = numStringInteger.slice(0, k);
        zeroesKilled += 1;
        k -= 1;
    }

    return "".concat(numStringInteger,'e',String(zeroesKilled));
}
//console.log(eliminateTrailingZeroesFromInteger('1200'));

// given any numstring and a number of sigFigs
// converts to an integer, with the correct number of significant figures, followed by an exponent
// if the integer has zeroes on the end, does not include decimal
function prepForRandomGeneration(numString, sigFigs) {
    var coefficient1, exponent1, coefficient2, coefficient3, exponent2, exponent3, coefficientCorrectSigFigs, coefficientIntegerCorrectSigFigs,
        coefficientCorrectSigFigsAndNoZeroes, finalCoefficient, finalExponent, finalNumString;

    coefficient1 = getCoefficient(numString);
    exponent1 = getExponent(numString);


    // what if THIS returns a scientific notation number???
    coefficientCorrectSigFigs = roundStandardNotationToSigFigs(coefficient1, sigFigs);
    coefficientCorrectSigFigsAndNoZeroes = eliminateTrailingZeroesFromInteger(coefficientCorrectSigFigs);
    coefficient2 = getCoefficient(coefficientCorrectSigFigsAndNoZeroes); // in case there are insignificant zeroes at the end of my number!
    exponent2 = getExponent(coefficientCorrectSigFigsAndNoZeroes);


    coefficientIntegerCorrectSigFigs = turnNumstringIntoIntegerWithExponent(coefficientCorrectSigFigsAndNoZeroes);
    coefficient3 = getCoefficient(coefficientIntegerCorrectSigFigs);
    exponent3 = getExponent(coefficientIntegerCorrectSigFigs); // because it might have been changed to scientific notation!



    finalCoefficient = coefficient3;
    finalExponent = addNaturalNumberNumstrings(exponent1,exponent3);

    finalNumString = "".concat(finalCoefficient,'e',finalExponent);
    finalNumString = deleteLeadingZeroes(finalNumString);

    return finalNumString;
}

function deleteLeadingZeroes(numString) {
    var sign;
    if (amIsigned(numString)) {
        sign = numString[0];
        numString = numString.slice(1);
    }

    if (countSigFigs(numString) === 0) { // gives zero if necessary
        return '0';
    }

    while (numString[0] === '0' && numString[1] !== '.') {
        numString = numString.slice(1);
    }
    if (numString[0] === '.') {  /// if you begin with a decimal point, add a zero
        numString = '0'.concat(numString);
    }

    if (sign) {
        numString = sign.concat(numString);
    }
    return numString;
}
