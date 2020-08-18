/**
 * Created by danielkuncik on 5/29/17.
 * Contain functions for numerical strings that do not fit into any other category
 */

// finds and deletes the decimal point in any numString

function deleteDecimalPoint(numString) {
    var decimalLocation = findCharacter(numString, '.');
    numString = deleteFromString(numString, decimalLocation);
    return numString;
}

// moves one digit to the left in a numerical string (standard notation only!) (positive numbers only!!)
/// returns the "INDEX" of the digit one to the left!
// returns false if you are at the farthest digit left
/// (this function exists because of the pesky decimal point that gets in the way
/// (it is not efficient... but it is easier to read code)
function walkBackwardsInNumString(numString,location) {
    if (location <= 0) {
        return false;
    } else if (numString[location - 1] !== '.') {
        return location - 1;
    } else if (numString[location - 1] === '.' && location - 2 >= 0) {
        return location - 2;
    } else if (numString[location - 1] === '.' && location - 2 < 0) {
        return false;
    }
}

/// gives the index of the digit to the left in a numerical string (standard notation only!--- at least for now!) (positive numbers only!)
/// returns the INDEX, not the value
// returns false if you are at the last digit
function walkForwardsInNumString(numString,location) {
    if (location + 1>= numString.length) {
        return false;
    } else if (numString[location + 1] !== '.') {
        return location + 1;
    } else if (numString[location + 1] === '.' && location + 2 <= numString.length - 1) {
        return location + 2;
    } else if (numString[location + 1] === '.' && location - 2 > numString.length - 1) {
        return false
    }
}

// negative will be LEFT
// positive will be RIGHT
// (it should create new zeroes if necessary)
// works only with standard notation numerical strings
function moveDecimalPoint(numString, movementPlaces) {

    var decimalLocation = findCharacter(numString, '.');

    if (decimalLocation === false) { // correcting for if no decimal appears
        decimalLocation = numString.length;
        numString = "".concat(numString,'.');
    }

    var digitsPastDecimal, digitsBeforeDecimal; // number of character existing beyond the decimal
    var zeroesToAdd; // number of zeroes that must be added to the problem
    var q;
    var newDecimalLocation;

    if (movementPlaces > 0) { // muliplying by a power of ten, moving to the right!
        digitsPastDecimal = numString.length - decimalLocation  - 1;

        // if necessary, add zeroes
        if (digitsPastDecimal < movementPlaces) {
            zeroesToAdd = movementPlaces - digitsPastDecimal;
            for (q = 0; q < zeroesToAdd; q++) {
                numString = numString.concat("0");
            }
        }

        // move the decimal point
        newDecimalLocation = decimalLocation + movementPlaces - 2; // why is the -2 necessary?? i just works!
        numString = deleteFromString(numString, decimalLocation);
        numString = insertIntoString(numString, '.', newDecimalLocation + 1); // the +1 accounts for the element just eliminated from the index

    } else if (movementPlaces < 0) { /// for negative exponents
        digitsBeforeDecimal = decimalLocation; // should be 1, but possibly we have a number in limbo

        // if necessary, add zeroes
        if (digitsBeforeDecimal < -1 * movementPlaces) {
            zeroesToAdd = -1 * movementPlaces - digitsBeforeDecimal + 1; // the +1 ensures the string will read "0.---" rather than ".---"
            for (q = 0; q < zeroesToAdd; q++) {
                numString = "0".concat(numString);
            }
            decimalLocation += zeroesToAdd; // beacuse i added zeroes to the front, the index of the decimal has changed
        }

        // move the decimal point
        newDecimalLocation = decimalLocation + movementPlaces - 1; /// the -1 works, not sure why it is necessary
        numString = deleteFromString(numString, decimalLocation);
        numString = insertIntoString(numString, '.', newDecimalLocation);
    } else{
        // do nothing
        numString = numString;
    }

    // eliminate awkward case of decimal point at the end of a whole number
    if (findCharacter(numString,'.') === numString.length - 1) {
        numString = deleteFromString(numString, findCharacter(numString,'.'));
    }

    return numString;
}


function cleanUpStandardNotationString(numString) {
    if (numString[0] === '+') {
        numString = numString.slice(1);
    }
    numString = deleteLeadingZeroes(numString);
    return numString;
}