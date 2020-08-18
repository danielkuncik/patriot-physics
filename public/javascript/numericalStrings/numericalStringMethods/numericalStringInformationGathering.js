/**
 * Created by danielkuncik on 5/28/17.
 */

// returns the first instance of e or E
// returns false if it is not found
function findE(numString) {
    var k;
    for (k = 0; k < numString.length; k++) {
        if (numString[k] === 'E' || numString[k] === 'e') {
            return k;
        }
    }
    return false;
}

// finds the index of the first significant figure of a numerical string
function findFirstSigFig(numString) {
    var q, firstSigFig;
    // find the location of the first signinicant figure
    for (q = 0; q < numString.length; q++ ) {
        if (numString[q] !== '0' && numString[q] !== '.' && numString[q] !== '-') {
            return q;
        }
    }
    return false;
}

function countSigFigs(numString) {

    if (amIsigned(numString)) {
        numString = numString.slice(1);
    }

    var eLocation = findE(numString);
    if (eLocation !== false) {
        numString = numString.slice(0,eLocation);
    }


    var firstSigFigLocation = findFirstSigFig(numString);
    if (firstSigFigLocation === false) {
        return 0;
    }

    var decimalLocation = findCharacter(numString,'.');

    if (decimalLocation !== false) { // numbers with decimals
        if (decimalLocation < firstSigFigLocation) { // numbers less than 1
            return (numString.length - firstSigFigLocation);
        } else { // numbers greater than 1
            return (numString.length - firstSigFigLocation - 1);
        }
    } else { // whole numbers
        var k, extraZeroes = 0;
        for (k = numString.length - 1; k >= 0; k -= 1 ){
            if (numString[k] === '0') {
                extraZeroes += 1
            } else {
                break
            }
        }
        return (numString.length - firstSigFigLocation - extraZeroes)
    }

}



// determines if the numerical String presented CAN be written in standard notation with
function lengthInStandardNotation(numString, sigFigs) {
    var numStringPrepaed;

    if (amIinScientificNotation(numString)) {
        numStringPrepaed = scientificToStandard(numString);
    } else {
        numStringPrepaed = numString;
    }

    var roundedNumString = deleteLeadingZeroes(roundStandardNotationToSigFigs(numString, sigFigs));

    if (amIinScientificNotation(roundedNumString)) {
        return false
    } else {
        return roundedNumString.length; // what about leading zeroes, etc.
    }

}

// gets the coefficient from an exponent form  numString
function getCoefficient(numString) {

    var Elocation = findCharacter(numString, 'e');
    if (Elocation === false) {
        Elocation = findCharacter(numString, 'E');
    }
    if (Elocation === false ) { // if in standard notation, just return the numstring itself
        return numString;
    }

    return numString.slice(0,Elocation);

}

// gets the exponent from an exponent form numString
function getExponent(numString) {

    var Elocation = findCharacter(numString, 'e');
    if (Elocation === false) {
        Elocation = findCharacter(numString, 'E');
    }
    if (Elocation === false ) {
        return '0';
    }

    return numString.slice(Elocation + 1);

}

// be careful with this one!
// as long as i use it only for simple integers, it will work as planned but it could go wrong
function addNaturalNumberNumstrings(numString1, numString2) {
    return String(Number(numString1) + Number(numString2));
}

function subtractNaturalNumberNumstrings(numString1, numString2) {
    return String(Number(numString1) - Number(numString2));
}
