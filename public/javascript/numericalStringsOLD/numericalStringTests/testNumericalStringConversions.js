/**
 * Created by danielkuncik on 5/29/17.
 */

var arrayToTest, i;

// I need many many many test of this!!! (but i'm happy for now)
// testing prepForRandomGeneration
arrayToTest = [
    ['1200',[4],'1200e0'],
    ['1200',[3],'120e1'],
    ['1200',[2],'12e2'],
    ['1200',[5],'12000e-1'],
    ['1200',[6],'120000e-2'],
    ['24',[3],'240e-1'],
    ['3',[3],'300e-2'],
    ['3',[6],'300000e-5'],
    ['24',[2],'24e0'],
    ['3',[1],'3e0'],
    ['0.0005',[4],'5000e-7'],
    ['.000431',[2],'43e-5'],
    ['313253',[2],'31e4'],
    ['.4324',[6],'432400e-6']
];
// need more, but working for now!

for (i = 0; i < arrayToTest.length; i++) {
    testFunction(prepForRandomGeneration, 'prepForRandomGeneration', arrayToTest[i][0],arrayToTest[i][1],arrayToTest[i][2]);
}

// test deleteLeadingZeroes
arrayToTest = [
    ['90','90'],
    ['000546','546'],
    ['0.04324','0.04324'],
    ['0000.34124','0.34124'],
    ['0021412000','21412000'],
    ['000000021412000','21412000'],
    ['021412000','21412000'],
    ['21412000','21412000'],
    ['0.021412000','0.021412000'],
    ['0000000.021412000','0.021412000'],
    ['.12','0.12']
];


for (i = 0; i < arrayToTest.length; i++) {
    testFunction(deleteLeadingZeroes, 'deleteLeadingZeroes', arrayToTest[i][0],[],arrayToTest[i][1]);
}

// test turnNumstringIntoIntegerWithExponent
arrayToTest = [
    ['123.456','123456e-3'],
    ['1.234','1234e-3'],
    ['0.000467','0000467e-6'],
    ['1.000','1000e-3'],
    ['45','45e0'],
    ['100','100e0'],
    ['0.112','0112e-3'],
    ['1.34e6','134e4'],
    ['2.345e-5','2345e-8'],
    ['123.56e5','12356e3'],
    ['0.000456e12','0000456e6'],
    ['154e3','154e3'],
    ['154E3','154e3'],
    ['123.56E5','12356e3']
];

for (i = 0; i < arrayToTest.length; i++) {
    testFunction(turnNumstringIntoIntegerWithExponent, 'turnNumstringIntoIntegerWithExponent', arrayToTest[i][0],[],arrayToTest[i][1]);
}


// test scientificToStandard
arrayToTest = [
    ['1.124e6', '1124000'],
    ['1.124e-6', '0.000001124'],
    ['1324.124e-6', '0.001324124'],
    ['3e8', '300000000']
];


for (i = 0; i < arrayToTest.length; i++) {
    testFunction(scientificToStandard, 'scientificToStandard', arrayToTest[i][0],[],arrayToTest[i][1]);
}


// test convertStandardToScientific
arrayToTest = [
    ['124124', [3], '1.24e5'],
    ['124124', [2], '1.2e5'],
    ['124124', [1], '1e5'],
    ['124124', [5], '1.2412e5'],
    ['51.51512', [3], '5.15e1'],
    ['000012512.12124', [4], '1.251e4'],
    ['0.000001231', [3], '1.23e-6'],
    ['.0000012', [3], '1.20e-6'],
    ['1.532', [3], '1.53e0'],
    ['799.921', [3], '8.00e2'],
   // ['999.999',3,'1.00e3'],

];

for (i = 0; i < arrayToTest.length; i++) {
    testFunction(convertStandardToScientific, 'convertStandardToScientific', arrayToTest[i][0],arrayToTest[i][1],arrayToTest[i][2]);
}
