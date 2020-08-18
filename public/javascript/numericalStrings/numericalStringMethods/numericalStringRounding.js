/**
 * Created by danielkuncik on 5/29/17.
 * Contains functions that round numerical strings
 */


// rounds up a single character of a numerical string
function roundUpNumericalStringChar(char) {
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

// given a numerical string character, returns true if it is 5 or above
function shouldIRoundUp(numChar) {
    return (numChar === '5' || numChar === '6' || numChar === '7' || numChar === '8' || numChar === '9');
}


/// rounds a numerical string with decimal places to a whole number
/// (returns the result with no decimal point!) [see if this is efficient, given other functions?]
function roundDecimalStringToWholeNumber(numString) {
    var result;
    var oldChar;
    var testLocation;
    var impactedDigit;
    var decimalLocation = findCharacter(numString, '.');
    if (decimalLocation === false) { // no decimal whole number, just return it
        return numString
    } else if (decimalLocation === numString.length - 1) { // whole number with decimal on the end, cut decimal out
        return deleteDecimalPoint(numString);
    } else if (decimalLocation === 0) { // decimal point is the first digit of the number
        if (shouldIRoundUp(numString[1])) {
            return '1';
        } else {
            return '0';
        }
    } else { /// a decimal number that must be rounded
        // round
        testLocation = decimalLocation + 1; // the spot just beyond what i need to measure

        if (shouldIRoundUp(numString[testLocation])) { // rounding up
            impactedDigit = decimalLocation - 1; // the spot taht will be rounded up or down
            oldChar = numString[impactedDigit];

            if (oldChar === '9') { // special case of rounding up nine
                // var nextDigit = impactedDigit;
                while (numString[impactedDigit] === '9' && impactedDigit >= 0) { // as long as there are still nines, keep rounding until the first digit
                    numString = stringReplaceCharacter(numString, '0', impactedDigit);
                    impactedDigit -= 1;
                }
                if (impactedDigit >= 0) { // nonce you've found a digit that isn't nine, round up as normal
                    numString = stringReplaceCharacter(numString, roundUpNumericalStringChar(numString[impactedDigit]), impactedDigit);
                } else if (impactedDigit === -1) { // if its nines all the way to the first digit, add a new digit
                    numString = "".concat('1',numString);
                    decimalLocation += 1;
                }
                //  result = roundUpWithNines(numString, impactedSpot);
            } else {
                numString = stringReplaceCharacter(numString, roundUpNumericalStringChar(numString[impactedDigit]), impactedDigit);
            }
        } else { // rounding down
            // do nothing (not roudning up)
            numString = numString;
        }
        result = numString.slice(0, decimalLocation); // delete the decimal and all numbers after
    }

    return result;
}

// rounds a standard notation numerical string to a certain number of decimal places
/// it accepts negative values for 'decimalPlaces', and then will round in the number
function roundDecimalStringToDecimalPlaces(numString, decimalPlaces) {
    var decimalLocation = findCharacter(numString, '.');
    if (decimalLocation === false) { // if no decimal, add it to the end
        decimalLocation = numString.length;
        numString = numString.concat('.')
    }

    numString = moveDecimalPoint(numString, decimalPlaces); // move decimal point
    numString = roundDecimalStringToWholeNumber(numString); // round to a whole number
    numString = numString.concat('.'); // put decimal place back
    numString = moveDecimalPoint(numString, -1 * decimalPlaces); // move decimal point back

    if (countSigFigs(numString) === 0) { // if the result is a string of only zeroes, simplify it
        return '0';
    }

    return numString
}


/// i need to put in some sort of override, that will make it standard notation even if it calcualtes it should use scientific notation
function roundStandardNotationToSigFigs(numString,sigFigs) {
    var decimalLocation = findCharacter(numString, '.'); // waht if there is no decimal???
    if (decimalLocation === false) {
        decimalLocation = numString.length;
        numString = numString.concat('.');
        // should i add a decimal point here???
    }
    var firstSigFigLocation = findFirstSigFig(numString);
    var nextSigFigLocation = firstSigFigLocation; // will walk from the first to the last sig fig
    var lastSigFigLocation;
    var j;
    for (j = 0; j < sigFigs  - 1; j++) {
        if (numString[nextSigFigLocation + 1] === '.') {
            nextSigFigLocation += 2;
        } else {
            nextSigFigLocation += 1;
        }
    }
    lastSigFigLocation = nextSigFigLocation;
    var spacesToMoveDecimal;
    if (lastSigFigLocation > decimalLocation) {
        spacesToMoveDecimal = lastSigFigLocation - decimalLocation;
    } else {
        spacesToMoveDecimal = lastSigFigLocation - decimalLocation + 1; // the +1 means you move the decimal one LESS space
    }
    var numString = roundDecimalStringToDecimalPlaces(numString, spacesToMoveDecimal);


    if (amIDigitsOnly(numString) && numString[numString.length - 1] === '0') { /// specific situations when you have a whole number ending in zeroes
        if (numString.length - firstSigFigLocation === sigFigs) { // if last digit is zero and that is preceisely the correct number of sigFigs
            numString = numString.concat('.'); // place decimal point on the end

        } else {
            // in some situations, it is impossible to get the correct number of sig figs without converting to scientific notation
            // try to figure out those situaitons, and then convert to scientific notation if necessary

            var trueSigFigs = countSigFigs(numString);

            if (trueSigFigs < sigFigs) {
                numString = convertStandardToScientific(numString,sigFigs);
            }

        }

    }

    return numString;

}
