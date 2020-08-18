/**
 * Created by danielkuncik on 5/28/17.
 */

// returns true if 'char' is a single character and a digit 0 - 9
function amIaDigit(char) {
    return char === '0' || char === '1' || char === '2' || char === '3' || char === '4' || char === '5' || char === '6' || char === '7' || char === '8' || char === '9';
}

// returns TRUE if the string contains only digits 0 - 9
function amIDigitsOnly(str) {
    var i, char;
    if (str.length === 0) {
        return false;
    }
    for (i = 0; i < str.length; i++) {
        test = amIaDigit(str[i]);
        if (!test) {
            return false;
        }
    }
    return true;
}

function amIaSign(char) {
    return (char === '+' || char === '-');
}


// returns TRUE if the first character of the string entered is a positive or negative sign
function amIsigned(str) {
    return amIaSign(str[0]);
}


// returns true if the string contains
// a + or - character first (or not)
// only digits, but at least one decimal point
// returns true if the number is a decimal string, signed or unsigned
function amIaStandardNotationDecimalString(str) {

    var decimalLocation = findCharacter(str,'.');
    var beforeDecimal, afterDecimal, beforeOK, afterOK, beforeOKbutWeird, afterOKbutWeird, allOK;
    // the 'but werid' options are things that can be true for one side, but not both sides

    if (decimalLocation === false) {
        return false
    } else {
        if (str.length == 1) { // ensures the string '.' is false
            return false
        }
        beforeDecimal = str.slice(0,decimalLocation);
        afterDecimal = str.slice(decimalLocation + 1);

        beforeOK = ((amIaSign(beforeDecimal[0])) && amIDigitsOnly(beforeDecimal.slice(1))) || amIDigitsOnly(beforeDecimal);
        beforeOKbutWeird = beforeDecimal === '+' || beforeDecimal === '-' || beforeDecimal.length === 0;

        afterOK = amIDigitsOnly(afterDecimal);
        afterOKbutWeird = afterDecimal.length === 0; // a decimal point at the end of a whole number should count!

        if (beforeOK && afterOK) {
            return true;
        } else if (beforeOK && afterOKbutWeird) {
            return true;
        } else if (beforeOKbutWeird && afterOK) {
            return true;
        } else {
            return false;
        }

    }
}


// returns TRUE if the string represents an integer
// and is in standard notation
function amIaStandardNotationInteger(str) {
    var newStr;
    if (amIsigned(str)) {
        newStr = str.slice(1);
    } else {
        newStr = str;
    }
    if (amIDigitsOnly(newStr)) {
        return true;
    } else if (amIaStandardNotationDecimalString(newStr)) {
        var decimalLocation = findCharacter(newStr,'.');
        if (decimalLocation === newStr.length - 1) { // if the decimal is the last character
            return true;
        } else {
            var i;
            for (i = decimalLocation + 1; i < newStr.length; i++ ) { // if all characters afte the decimal are zeroes
                if (newStr[i] !== '0') {
                    return false
                }
            }
            return true;
        }
    } else {
        return false;
    }
}



// returns true if the string is any form of numerical string in standard notation
function amIaStandardNotationNumString(str) {
    var newStr;
    if (amIsigned(str)) {
        newStr = str.slice(1);
    } else {
        newStr = str;
    }
    return amIDigitsOnly(newStr) || amIaStandardNotationDecimalString(newStr);
}

// returns true if the string is a numerical string in exponent form
// does not require that the string is in proper scientific notation
function amIanExponentFormNumString(str) {
    var eLocation = findE(str);
    var beforeE, afterE, beforeOK, afterOK;
    if (eLocation === false) {
        return false
    } else {
        beforeE = str.slice(0, eLocation);
        afterE = str.slice(eLocation + 1);
        beforeOK = amIaStandardNotationNumString(beforeE);
        if (amIsigned(afterE)) {
            afterE = afterE.slice(1);
        }
        afterOK = amIDigitsOnly(afterE);
        return beforeOK && afterOK;
    }
}

// returns true if the numerical string is in proper scientific notation
function amIinScientificNotation(str) {
    if (!amIanExponentFormNumString(str)) {
        return false
    } else {
        var coefficient = str.slice(0, findE(str));
        if (amIsigned(coefficient)) {
            coefficient = coefficient.slice(1);
        }
        if (amIaDigit(coefficient)) { // if the coefficient is a single digit, with no decimal, its weird but OK
            return true;
        }
        var decimalLocation = findCharacter(coefficient,'.');

        return (decimalLocation === 1 && amIaDigit(coefficient[0])); // this catches the case that the decimal is not there
    }
}

// returns true if the string is any type of numerical string
function amIaNumString(str) {
    return amIanExponentFormNumString(str) || amIaStandardNotationNumString(str);
}
// no tests yet exist for this!