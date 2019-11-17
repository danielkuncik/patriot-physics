function isXinArray(x, array) {
    let answer = false;
    array.forEach((element) => {
        if (element === x) {
            answer = true;
        }
    });
    return answer
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

alphabetArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N','O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


// returns an array of allowed ranges for a function
function cutOffFunction(func, xMin, xMax, forcedYMin, forcedYMax) {


}