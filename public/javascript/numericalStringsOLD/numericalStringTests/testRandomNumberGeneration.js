/**
 * Created by danielkuncik on 5/29/17.
 */

// tests whether the randomNumStringFromZero function has the correct sigFigs and is within the correct range one time
function test_createRandomNumStringFromZero_once(upperBound, sigFigs) {
    var testNum = createRandomNumStringFromZero(upperBound, sigFigs);
    console.log(testNum);
    if (Number(testNum) >= 0 && Number(testNum) <= Number(upperBound) && countSigFigs(testNum) === sigFigs ) {
        return true;
    } else {
        return false;
    }
}

function test_createRandomNumStringFromZero_range(upperBound, sigFigs, N) {
    testName = 'test_createRandomNumStringFromZero_range';
    var i, test, final_result = true;
    for (i = 0; i < N; i++ ) {
        test = test_createRandomNumStringFromZero_once(upperBound, sigFigs);
        console.log(test);
        if (!test) {
            final_result = false;
        }
    }
    assertEqual(final_result, true);
}

function testRandomGenerator() {
    test_createRandomNumStringFromZero_range('25',3,100);
}
//testRandomGenerator();









function test_createRandomNumStringFromZero_distribution(upperBound, sigFigs, N) {
    // this is much tougher, it needs to create a histogram of many results
    /// ill need to mix with the quantitative graphing functions

}





// tests for the createRandomNumString function

// test that a single numString created is between the two bounds and has the proper number of sig figs
function test_createRandomNumString_Once(lowerBound,upperBound,sigFigs) {
    var myNum = createRandomNumString(lowerBound, upperBound, sigFigs);
    console.log(myNum);
    if (Number(myNum) >= Number(lowerBound) && Number(myNum) <= Number(upperBound) && countSigFigs(myNum) === sigFigs) {
        return true;
    } else {
        return false;
    }
}

/// runs the preiovus function many times
function test_createRandomNumString_Function(lowerBound,upperBound,sigFigs,N) {
    testName = 'test_createRandomNumString_first';
    var i, test, final_result = true;
    for (i = 0; i < N; i++ ) {
        test = test_createRandomNumString_Once(lowerBound, upperBound, sigFigs);
        console.log(test);
        if (!test) {
            final_result = false;
        }
    }
    assertEqual(final_result, true);
}
/// a truly epic error for the ages:
/// the randInt function had been programmed in two different js files differently
/// and so, when i ran one file on its own, it did fine
// but when i used the function on the browser, it got the version from the other file, which was different
// (wrong, actually)
/// and, it was really fucking puzzling, but i eventually got it!



//test_createRandomNumString_Function('3','24',3,100);
// for some reason, it NEVER recrods the upper bound in this program
/// but in the other program, recrods the uppe bound with equal frequency to the lower bound



// tests that the random numbers created are evenly distributed
/// do i need to create a histogram with html canvas??? (that seems like a whole new program, but probably worth it!)
function test_createRandomNumString_historgram(lowerBound, upperBound, sigFigs, N, nBins) {
    testName = 'test_createRandomNumString_second';
}
// i also need a test to make sure that it still does sometimes record the lower and upper bounds
/// right now i'm having a problem in which it recrods the lower bound with some frequency, but never the upper bound


/// what this test does not measure is that the numbers selected are evenly spread out between the two bounds
/// ill need to write another test for that!
// some sort of histogram is necessary
