function isXinArray(x, array) {
    let answer = false;
    array.forEach((element) => {
        if (element === x) {
            answer = true;
        }
    });
    return answer
}


function getRandomPointInProbabilityFunction(probabilityFunction) {
    // need to work this out
}

// from https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function minOfTwoValues(val1, val2) {
    if (val1 <= val2) {
        return val1
    } else {
        return val2
    }
}

function maxOfTwoValues(val1, val2) {
    if (val1 >= val2) {
        return val1
    } else {
        return val2
    }
}

function getMaxOfArray(array) {
    if (array.length > 1) {
        let currentMax = array[0];
        let i;
        for (i = 1; i < array.length; i++) {
            if (array[i] > currentMax) {
                currentMax = array[i]
            }
        }
        return currentMax
    } else {
        return undefined
    }
}

function convertDegreesToRadians(angle) {
    return angle / 180 * Math.PI;
}

function convertRadiansToDegrees(angle) {
    return angle / Math.PI * 180;
}

function roundValue(value, numDecimalPlaces) {
    return Math.floor(value * 10**numDecimalPlaces) / 10**numDecimalPlaces
}

function displacementBetweenTwoValues(minVal, maxVal) {
    if (minVal >= 0 && maxVal >= 0) {
        return maxVal - minVal
    } else if (minVal <= 0 && maxVal >= 0) {
        return maxVal - minVal
    } else if (minVal <= 0 && maxVal <= 0) {
        return Math.abs(minVal - maxVal)
    }
}

// returns N values evenly spaced between minVal and maxVal, including minVal and maxVal
function NpointsEvenlySpacedInARange(N, minVal, maxVal) {
    let outputArray;
    /// need to add some sanity checks, N must be an integer greater than 1, minVal must be less than maxVal;
    if (N === 1) {
        outputArray = [(minVal + maxVal) / 2];
    } else {
        let spaceBetween = displacementBetweenTwoValues(minVal, maxVal) / (N  - 1);
        outputArray = [minVal];
        let k;
        for (k = 1; k < N; k++) {
            outputArray.push(minVal + spaceBetween * k);
        }
    }
    return outputArray
}


function getRangeOfFunction(func, xMin, xMax, N) {
    let yMin = func(xMin);
    let yMax = func(xMin);
    if (N === undefined) {
        N = 100;
    }
    let i, y;
    let xRange = xMax - xMin;
    for (i = 1; i <= N; i++) {
        y = func(xMin + i / N * xRange);
        if (y > yMax) {
            yMax = y;
        }
        if (y < yMin) {
            yMin = y;
        }
    }
    return {
        yMin: yMin,
        yMax: yMax
    }
}

function sumOfArray(array) {
    let sum = 0;
    array.forEach((element) => {
        sum += element;
    });
    return sum
}

function makeArraySumToOne(array) {
    let sum = sumOfArray(array);
    let q;
    for (q = 0; q < array.length; q++) {
        array[q] = array[q]/sum;
    }
    return array
}

const alphabetArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N','O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const alphabetArrayLowercase = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function numberToLetter(number, lowercase) {
    let array;
    if (lowercase) {
        array = alphabetArrayLowercase;
    } else {
        array = alphabetArray;
    }
    let letter;
    if (number < 26) {
        letter = array[number];
    } else if (number < 26 * 27) {
        letter = `${array[Math.floor(number / 26)]}${array[number % 26]}`;
    } else {
        letter = 'xxx';
    }
    return letter;
}


// returns an array of allowed ranges for a function
function cutOffFunction(func, xMin, xMax, forcedYMin, forcedYMax) {


}

// turns a string in text to an appropriate angle in radians
function turnTextToRadians(text) {
    var theta;
    switch(text) {
        case 'right':
            theta = 0;
            break;
        case 'left':
            theta = Math.PI;
            break;
        case 'up':
            theta = Math.PI / 2;
            break;
        case "down":
            theta = Math.PI * 3 / 2;
            break;
        case "east":
            theta = 0;
            break;
        case "west":
            theta = Math.PI;
            break;
        case "north":
            theta = Math.PI / 2;
            break;
        case "south":
            theta = Math.PI * 3 / 2;
            break;
        default:
            theta = undefined;
            break;
    }
    return theta;
}

// given an inputted direction
// tries to figure out what the user meant, and returns a value in radians
function processDirectionInput(direction) {
    if (typeof(direction) === 'string') { // if you wrote a word indicating numbers
        return turnTextToRadians(direction)
    } else if (typeof(direction) === 'number' && direction > 2 * Math.PI + 1) { // if you probably meant degrees
        console.log(`note: assuming value ${direction} entered was in units of degrees, not radians`);
        return convertDegreesToRadians(direction)
    } else if (typeof(direction) === 'number') { // if you gave a value in radians
        return direction
    } else {
        console.log('ERROR: Unable to process direction input');
        return undefined
    }
}


// tests if a function is constant over the range from xMin to xMax
function isItAConstantFunction(testFunction, xMin, xMax, N) {
    if (N === undefined) {N = 100;}
    let xStep = (xMax - xMin) / N;
    let result = true;
    let k, thisY, previousY, x;
    previousY = testFunction(xMin);
    for (k = 1; k < N; k++) {
        x = xMin + xStep * k;
        thisY = testFunction(x);
        if (Math.abs(thisY - previousY) > 1e-10 ) {
            result = false;
            break;
        }
        previousY = thisY;
    }
    return result
}


function makeHtmlListFromArray(array, orderedListBoolean, type) {
  let newList;
  if (orderedListBoolean === undefined) {
    orderedListBoolean = false;
  }
  if (orderedListBoolean) {
    if (type === undefined) {type = '1'}
    newList = $(`<ol type = '${type}'></ol>`);
  } else {
    newList = $("<ul></ul>");
  }

  array.forEach((element) => {
    $(newList).append(`<li>${element}</li>`);
  });

  return newList
}


const ordinalObject = {
    0: 'Zeroth',
    1: 'First',
    2: 'Second',
    3: 'Third',
    4: 'Fourth',
    5: 'Fifth',
    6: 'Sixth',
    7: 'Seventh',
    8: 'Eighth',
    9: 'Ninth',
    10: 'Tenth',
    20: 'Twentieth',
    100: 'One-Hundredth',
    1000: 'Thousandth',
    'n': 'n-th',
    'N': 'N-th'
};