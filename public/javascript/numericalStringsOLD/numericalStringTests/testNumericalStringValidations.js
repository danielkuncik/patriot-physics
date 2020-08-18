/**
 * Created by danielkuncik on 5/28/17.
 *
 * Runs tests of these functions:
 * amIDigitsOnly
 * amIaStandardNotationDecimalString
 * amIaStandardNotationInteger
 * amIaStandardNotationNumString
 * amIanExponentFormNumString
 * amIinScientificNotation
 */

var arrayToTest, i;

// test amIaStandardNotationDecimalString
arrayToTest = [
    ['123.4',true],
    ['mrkuncik',false],
    ['dan.dfe',false],
    ['hello. its. me', false],
    ['0.000',true],
    ['3.0e8',false], // no scientific notation here!
    ['-0231.12',true],
    ['-12',false],
    ['+.54',true],
    ['12412.31421',true],
    ['-.3142',true],
    ['12421.',true],
    ['.54',true],
    ['.',false],
    ['+.',false],
    ['-.',false],
    ['.+',false],
    ['',false]
];

for (i = 0; i < arrayToTest.length; i++) {
    testFunction(amIaStandardNotationDecimalString,'amIaStandardNotationDecimalString',arrayToTest[i][0],[],arrayToTest[i][1]);
}

// test amIaStandardNotationNumString
arrayToTest = [
    ['1235124',true],
    ['4251215u351421',false],
    ['4214124.121412.42142',false],
    ['12412123',true],
    ['12412e41241',false],
    ['1241.12132',true],
    ['daniel kuncik',false],
    ['9909990.21323',true],
    ['3.0e4',false],
    ['3.0',true],
    ['12',true],
    ['',false]
];

for (i = 0; i < arrayToTest.length; i++) {
    testFunction(amIaStandardNotationNumString,'amIaStandardNotationNumString',arrayToTest[i][0],[],arrayToTest[i][1]);
}

// test amIanExponentFormNumString
arrayToTest = [
    ['3.0e8',true],
    ['234124',false],
    ['12',false],
    ['12e-7',true],
    ['123e+8',true],
    ['125e9',true],
    ['001e-7',true],
    ['1.23,e4.5',false],
    ['.34e3',true],
    ['.e5',false],
    ['-e4',false],
    ['+e+3',false],
    ['',false]
];
/// i should have more here!!

for (i = 0; i < arrayToTest.length; i++) {
    testFunction(amIanExponentFormNumString,'amIanExponentFormNumString',arrayToTest[i][0],[],arrayToTest[i][1]);
}

// test amIinScientificNotation
arrayToTest = [
    ['3.0e8',true],
    ['45.3e4',false],
    ['99',false],
    ['4e5',true],
    ['4.e5',true], // weird, but acceptable
    ['0003e4',false],
    ['3.14e-9',true],
    ['.42e2',false],
    ['6E-3',true],
    ['+4.56e3',true],
    ['-5.78e-9',true],
    ['+5E3',true],
    ['-6e-9',true],
    ['+8.e4',true], // again, weird, but acceptable
    ['.9e7',false],
    ['',false]
];
// i should have more, especially think of all the very weird cases!

for (i = 0; i < arrayToTest.length; i++) {
    testFunction(amIinScientificNotation,'amIinScientificNotation',arrayToTest[i][0],[],arrayToTest[i][1]);
}



// test amIaStandardNotationInteger

arrayToTest = [
    ['1245', true],
    ['+8', true],
    ['-99', true],
    ['+883.4', false],
    ['-4.4', false],
    ['', false],
    ['12000.', true],
    ['45.00000', true],
    ['45.3',false],
    ['45.00004',false],
    ['-6.000',true],
    ['+6.000',true]
];


for (i = 0; i < arrayToTest.length; i++) {
    testFunction(amIaStandardNotationInteger,'amIaStandardNotationInteger',arrayToTest[i][0],[],arrayToTest[i][1]);
}

/// test amIDigitsOnly

arrayToTest = [
    ['214513',true],
    ['daniel', false],
    ['+34124', false],
    ['1a', false],
    ['540183', true],
    ['4', true],
    ['3.14', false],
    ['98574937529834761', true],
    ['98574937529834761.', false],
    ['', false],
    ['12.',false],
    ['12',true],
    ['12.3',false]
];

for (i = 0; i < arrayToTest.length; i++) {
    testFunction(amIDigitsOnly,'amIDigitsOnly',arrayToTest[i][0],[],arrayToTest[i][1]);
}

// test amIaNumString


