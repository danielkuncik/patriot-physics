/**
 * Created by danielkuncik on 5/29/17.
 */


var arrayToTest, i;

// test moveDecimalPoint
arrayToTest = [
    ['12.15',[1],'121.5'],
    ['124145.143613',[4], '1241451436.13'],
    ['12.1312', [-6], '0.0000121312'],
    ['12',[3],'12000'],
    ['15',[-6],'0.000015'],
    ['14',[7],'140000000'],
    ['143',[2],'14300']
];


for (i = 0; i < arrayToTest.length; i++) {
    testFunction(moveDecimalPoint, 'moveDecimalPoint', arrayToTest[i][0],arrayToTest[i][1],arrayToTest[i][2]);
}
