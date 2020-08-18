/**
 * Created by danielkuncik on 5/28/17.
 */

// returns a random integer between m and n -1
function randInt(m, n) {
    n += 1;
    return Math.floor(Math.random() * (n - m) + m);
}
/// i should write a test for randInt

/// returns a positive numerical string between 0 and the upperBound with a certain number of sigFigs
// please enter upperBound in the form of a numerical string!
function createRandomNumStringFromZero(upperBound, sigFigs) {
    var intExpForm, integerUpperBound, exponent, coefficient, randomInteger, result, resultPresentable;

    intExpForm = getIntegerExponentForm(upperBound,sigFigs*2);
    integerUpperBound = getCoefficient(intExpForm);
    exponent = getExponent(intExpForm);

    randomInteger = randInt(0,Number(integerUpperBound));

    result = String(randomInteger).concat('e',exponent);
    resultPresentable = getMostPresentableForm(result, sigFigs);

    return resultPresentable;
}
/*
var testNum = '24';
var resultNum;
var k;
for (k = 0; k < 100; k++) {
    resultNum = createRandomNumStringFromZero(testNum,2);
    console.log(resultNum);
}
*/
/// why was it necessary to increase the sigFigs by 1 for 24?
// well, ill think about it
// there's some amount you have to increase the sig figs to make it work
// of course, because I round to the correct number at the end, im ok either way
// doing (sigFigs * 2) is a short term solution


// how about negative numbers??? this doesnt work for negative numbers
// does this work for negative numbers???
function createRandomNumString(lowerBound, upperBound, sigFigs) {
    var newUpperBound = String(Number(upperBound) - Number(lowerBound));
    var firstResult = createRandomNumStringFromZero(newUpperBound, sigFigs);
    var newResult = String(Number(firstResult) + Number(lowerBound));
    var finalResult = getMostPresentableForm(newResult, sigFigs);
    return finalResult;
}

var testNum1 = '3';
var testNum2 = '24';
var resultNum;
var k;
for (k = 0; k < 100; k++) {
    resultNum = createRandomNumString(testNum1, testNum2,2);
    console.log(resultNum);
}

// it does, in fact, make random numbers with 2 significant figures from 3 to 24!
/// (well, taht was my goal when i started this, wasn't it!!!)
/// [still more testing, etc. to do, but i really need to move onto a different part of the program!]
/// [i need to create more range and distribution based testing methods...but for now i need to move onto a different part of the program]