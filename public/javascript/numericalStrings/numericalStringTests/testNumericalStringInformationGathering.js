/**
 * Created by danielkuncik on 5/28/17.
 */



var arrayToTest, i;

// test countSigFigs
arrayToTest = [
    ['123',3],
    ['00000123',3],
    ['00000123.000',6],
    ['00000123.5421398',10],
    ['1000000',1],
    ['1000400',5],
    ['1000000.',7],
    ['1000000.00',9],
    ['0001000000',1],
    ['001000400',5],
    ['01000000.',7],
    ['0000001000000.00',9],
    ['1.00e6',3],
    ['5e-18',1],
    ['5.32e-12',3],
    ['5.e+12',1],
    ['0004.23e4',3],
    ['0000.0000',0],
    ['4.56E9',3],
    ['+123.4',4],
    ['-00000123',3],
    ['+1000000',1],
    ['-1.00e6',3],
    ['0.000035',2],
    ['0.0000004',1],
    ['0.0000000056001',5],
    ['0002445000',4],
    ['0000.0000412',3]
];

// i need to add tests for SIGNED numbers!

for (i = 0; i < arrayToTest.length; i++) {
    testFunction(countSigFigs,'countSigFigs',arrayToTest[i][0],[],arrayToTest[i][1]);
}

// testing lengthInStandardNotation
arrayToTest = [
    ['1200',[4],5],
    ['1200',[3],false],
    ['1200',[2],4],
    ['1200',[5],6],
    ['1200',[6],7],
    ['24',[3],4],
    ['3',[3],4],
    ['3',[6],7],
    ['24',[2],2],
    ['3',[1],1],
    ['0.0005',[4],9],
    ['.000431',[2],7],
    ['313253',[2],6],
    ['.4324',[6],8]
];

for (i = 0; i < arrayToTest.length; i++) {
    testFunction(lengthInStandardNotation, 'lengthInStandardNotation', arrayToTest[i][0],arrayToTest[i][1],arrayToTest[i][2]);
}

// testing getCoefficient
arrayToTest = [
    ['1234','1234'],
    ['1256e7','1256'],
    ['0.0432e9','0.0432'],
    ['3.0e8','3.0'],
    ['234E56','234'],
    ['5.789E-4','5.789'],
    ['120.e1','120.'],
    ['12E2','12']
];

for (i = 0; i < arrayToTest.length; i++) {
    testFunction(getCoefficient, 'getCoefficient', arrayToTest[i][0],[],arrayToTest[i][1]);
}

// testing getExponent
arrayToTest = [
    ['1234','0'],
    ['78','0'],
    ['543e67','67'],
    ['3.0e8','8'],
    ['567e-6','-6'],
    ['5.67e-6','-6'],
    ['0.0086e-4','-4']
];
for (i = 0; i < arrayToTest.length; i++) {
    testFunction(getExponent, 'getExponent', arrayToTest[i][0],[],arrayToTest[i][1]);
}