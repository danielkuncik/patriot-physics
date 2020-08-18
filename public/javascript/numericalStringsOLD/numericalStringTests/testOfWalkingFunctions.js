/**
 * Created by danielkuncik on 5/28/17.
 */

/// a test of the two walking functions,
// right now, only goes into the console.
// the last entry of each of them should be "undefined false"
// the penultimate entry of each of them should be "a digit false"
// all other entries should be all digits
function testWalkingFunctions(test) {
    var k, str1, str2;

// test of the walking forward function
    console.log('Walking Foward!');

    for (k = 0; k <= test.length; k++) {
        str1 = test[k];
        if (test[k] === '.') {
            // do nothing
        } else {
            if (walkForwardsInNumString(test, k) !== false) {
                str2 = test[walkForwardsInNumString(test, k)];
            } else {
                str2 = 'false';
            }

            console.log(test);
            console.log("".concat(str1, "  ", str2));
            console.log('   ');
        }

    }

// test the walking backward function
    console.log('Walking Backward!');
    for (k = test.length - 1; k >= -1; k--) {
        str1 = test[k];
        if (test[k] === '.') {
            // do nothing
        } else {
            if (walkBackwardsInNumString(test, k) !== false) {
                str2 = test[walkBackwardsInNumString(test, k)];
            } else {
                str2 = 'false';
            }

            console.log(test);
            console.log("".concat(str1, "  ", str2));
            console.log('   ');
        }
    }

}