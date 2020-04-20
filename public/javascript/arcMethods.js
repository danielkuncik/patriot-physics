
function getAngleClosestToArcIfStartAngleLesser(lesserAngle, greaterAngle, testAngle) {
    let newAngle;
    if (lesserAngle < testAngle && greaterAngle > testAngle) { /// the test angle is inbetween the two angles
        newAngle = testAngle;
    } else { /// figure out which angle is closer
        let optionsArray = [
            Math.abs(greaterAngle - testAngle), Math.abs(greaterAngle - testAngle - Math.PI * 2), Math.abs(greaterAngle - testAngle + Math.PI * 2),
            Math.abs(lesserAngle - testAngle), Math.abs(lesserAngle - testAngle - Math.PI * 2), Math.abs(lesserAngle - testAngle + Math.PI * 2)
        ];
        let index = getMinIndexOfArray(optionsArray);
        if (index === 0 || index === 1 || index === 2) {
            newAngle = greaterAngle;
        } else if (index === 3 || index === 4 || index === 5) {
            newAngle = lesserAngle;
        } else {
            newAngle = undefined;
        }
    }
    return simplifyAngle(newAngle)
}


// the arc goes from start radians to end radians always counterclockwise
function getAngleClosestToArc(startRadians, endRadians, testAngle) {
    let newAngle;
    if (startRadians < endRadians) { // does not cross zero
        newAngle = getAngleClosestToArcIfStartAngleLesser(startRadians, endRadians, testAngle);
    } else if (startRadians > endRadians) { // does cross zero
        endRadians += Math.PI * 2;
        newAngle = getAngleClosestToArcIfStartAngleLesser(startRadians, endRadians, testAngle);
    } else if (startRadians === endRadians) { // both angles equal
        newAngle = startRadians;
    }
    return newAngle;
}

/*
function runTest(startRadians, endRadians, testAngle, correctAnswer) {
    let overallResult = 'PASS';
    let result = getAngleClosestToArc(startRadians, endRadians, testAngle);
    if (result === correctAnswer) {
        console.log(result, correctAnswer, 'PASS');
    } else {
        console.log(result, correctAnswer, 'FAIL');
        overallResult = 'FAIL';
    }
    console.log(`Overall Result: ${overallResult}`);
}

runTest(0,1,0,0);
runTest(0,Math.PI /2, 1,1);
runTest(0,Math.PI /2, Math.PI,Math.PI / 2);
runTest(0,Math.PI /2, 5,0);
runTest(0,Math.PI, 4,Math.PI);
runTest(0,Math.PI, 5,0);
runTest(0,Math.PI, 0,0);
runTest(0,Math.PI, 6,0);
runTest(0,Math.PI, 3,3);
runTest(0,Math.PI, 2,2);
runTest(1,0,0,0);
runTest(Math.PI /2,0, 1,Math.PI /2 );
runTest(Math.PI /2,0, Math.PI,Math.PI);
runTest(Math.PI /2,0, 5,5);
runTest(Math.PI,0, 4,4);
runTest(Math.PI,0, 5,5);
runTest(Math.PI,0, 0,0);
runTest(Math.PI,0, 6,6);
runTest(Math.PI,0, 3,Math.PI);
runTest(Math.PI,0, 2,Math.PI);
runTest(Math.PI,0, 1,0);

*/


function simplifyAngle(angleInRadians) {
    while (angleInRadians < 0) {
        angleInRadians += 2 * Math.PI;
    }
    while (angleInRadians >= Math.PI * 2) {
        angleInRadians -= 2 * Math.PI;
    }
    return angleInRadians
}


function getMinIndexOfArray(array) {
    let i, min, minIndex;
    min = array[0];
    minIndex = 0;
    for (i = 0; i < array.length; i++) {
        if (array[i] < min) {
            minIndex = i;
            min = array[i];
        }
    }
    return minIndex
}