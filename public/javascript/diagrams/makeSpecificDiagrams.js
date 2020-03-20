/*
This is a follow-up on physics Diagram Generation

physicsDiagramGeneration.js creates objects and methods to make diagrams used in physics class


makeSpecificDiagrams.js creates functions that quickly generate specific types of diagrams
 */




function appendListOfDiagramsByID(diagramList) {
    let thisDiagram, thisID, thisWidth, thisHeight;
    diagramList.forEach((diagram) => {
        thisDiagram = diagram[0];
        thisID = diagram[1];
        if (diagram[2]) {
            thisWidth = diagram[2];
        } else {
            thisWidth = 300;
        }
        if (diagram[3]) {
            thisHeight = diagram[3]
        } else {
            thisHeight = 300;
        }
        $(`#${thisID}`).append(thisDiagram.drawCanvas(thisWidth, thisHeight));
    })
}


/// #########################################################################################
//// KINEMATIC GRAPHS

// creates a position-time graph from from time 0 to tmax and position 0 to positionMax
// with aspect ratio 1
function makeParabolicPTgraph(tMax, positionMax, acceleration, initialVelocity, initialPosition) {
    if (acceleration === undefined) {acceleration = 1;}
    if (initialVelocity === undefined) {initialVelocity = 0;}
    if (initialPosition === undefined) {initialPosition = 0;}
    let positionFunction = ((t) => {return 0.5 * acceleration * t * t + initialVelocity * t + initialPosition;});
    if (positionMax === undefined) {positionMax = positionFunction(tMax);}

    let myGraph = new QuantitativeGraph(0,tMax,0,positionMax,1);
    myGraph.labelAxes('time (s)', 'position (m)');
    myGraph.addReferenceArray([tMax],[positionMax]);
    myGraph.addFunctionGraph(positionFunction, 0, tMax);

    return myGraph
}



/// #########################################################################################
//// CIRCUIT DIAGRAMS
/*
class CircuitDiagram extends Diagram {
    constructor() {
    addWire(point1, point2) {
    addResistor(endPoint1, endPoint2, width, numZigZags) {
    addCell(endPoint1, endPoint2, numBatteries, width) {
    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {


    // there needs to be a function that allows you to string elements together
 */


/*
Next steps:
- instead of functions that simply create a series or parallel circuit,
- I should have functions taht create series or parallel elements within a certain space
- so that i can then more easily make accordion circuits
- by using these types of functions

but for now these are not bad
 */

// if given a numerical value, a string, or an empty set for any quantity
// it returns the required thing to print
/// undefined will return an empty string
// a string will return the same string
// a number will return the value with the unit
function printQuantity(item, singularUnit, pluralUnit, abbreviation, abbreviationBoolean) {
    if (abbreviationBoolean === undefined) {
        abbreviationBoolean = true;
    }
    let outputString;
    if (item === undefined) {
        outputString = ''
    } else if (typeof(item) === 'string') {
        outputString = item;
    } else if (typeof(item) === 'number') {
        if (abbreviationBoolean) {
            outputString = `${item} ${abbreviation}`;
        } else {
            if (item === 1) {
                outputString = `${item} ${singularUnit}`;
            } else {
                outputString = `${item} ${pluralUnit}`;
            }
        }
    }
    return outputString
}
// need to somehow account for abbreviations

function printResistance(item,abbreviationBoolean) {
    return printQuantity(item, 'Ohm', 'Ohms', 'Ω',abbreviationBoolean);
}

function printVoltage(item,abbreviationBoolean) {
    return printQuantity(item, 'Volt', 'Volts','V',abbreviationBoolean);
}

function printCurrent(item,abbreviationBoolean) {
    return printQuantity(item, 'Amp', 'Amps','A',abbreviationBoolean);
}

function printPower(item,abbreviationBoolean) {
    return printQuantity(item, 'Watt', 'Watts','W',abbreviationBoolean);
}

function printForce(item,abbreviationBoolean) {
    return printQuantity(item, 'Newton', "Newtons",'N',abbreviationBoolean);
}

function printForceAbbreviated(item) {
    return printQuantity(item, 'Newton', 'Newtons', 'N', true);
}
// i could just have both singular and plural be 'N' ==> a simpler code





/// #########################################################################################
//// FREE BODY Diagrams
//     addForce(relativeMagnitude,angle,labelAbove, labelBelow) {


// force array is a n x 2 matrix
// the first item of each row is the magnitude, must be a number
// the second item of each row is the direciton, can be a number or appropriate text
// magnitude must be a number
function fastFBD(forceArray, velocityDirection) {
    let myFBD = new FreeBodyDiagram();
    let relativeMagnitude, label, direction, theta, magnitudeOrLabel;
    forceArray.forEach((force) => {
        direction = force[0];
        theta = processDirectionInput(direction);
        magnitudeOrLabel = force[1]; /// processed as a label if a string or as a magnitude if a number
        if (typeof(magnitudeOrLabel) === 'string') { /// if it is a label
            label = magnitudeOrLabel;
            if (force[2]) { // can add a relative magnitude quantitiy as third element, or it will default to 1
                relativeMagnitude = force[2];
            } else {
                relativeMagnitude = 1;
            }
        } else if (typeof(magnitudeOrLabel) === 'number') { // if it is a magnitude
            relativeMagnitude = magnitudeOrLabel;
            label = printForceAbbreviated(magnitudeOrLabel);
        }
        myFBD.addForce(relativeMagnitude, theta, label);
    });
    if (velocityDirection) {
        let velocityTheta = processDirectionInput(velocityDirection);
        myFBD.addVelocityArrow(velocityTheta); // all default values
    }
    return myFBD;
}

function freeFallFBD() {
    return fastFBD([['down','gravity']]);
}


/// Make simple qualitative kinematic graphs
function makePositionGraphConstantVelocity() {
    let positionGraph = new QualitativeGraph((x)=>x,0,10);
    positionGraph.labelAxes('time','position');
    positionGraph.moveLabelsToSide();
    return positionGraph
}

function makePositionGraphPositiveAcceleration() {
    let positionGraph = new QualitativeGraph((x)=>x*x,0,10);
    positionGraph.labelAxes('time','position');
    positionGraph.moveLabelsToSide();
    return positionGraph
}

function makePositionGraphNegativeAcceleration() {
    let positionGraph = new QualitativeGraph((x)=>10*x + 0.5 * (-1) * x * x,0,10);
    positionGraph.labelAxes('time','position');
    positionGraph.moveLabelsToSide();
    return positionGraph
}

function makePositionGraphNotMoving() {
    let positionGraph = new QualitativeGraph((x)=>5,0,10,1,0,10);
    positionGraph.labelAxes('time','position');
    positionGraph.moveLabelsToSide();
    return positionGraph
}

function makeVelocityGraphConstantVelocity() {
    let velocityGraph1 = new QualitativeGraph(() => 5, 0, 10, 1, 0, 10);
    velocityGraph1.moveLabelsToSide();
    velocityGraph1.labelAxes('time', 'velocity');
    return velocityGraph1
}

function makeVelocityGraphPositiveAcceleration() {
    let velocityGraph2 = new QualitativeGraph((v) => v, 0, 10);
    velocityGraph2.moveLabelsToSide();
    velocityGraph2.labelAxes('time', 'velocity');
    return velocityGraph2
}

function makeVelocityGraphNegativeAcceleration() {
    let velocityGraph3 = new QualitativeGraph((v) => 10 - v, 0, 11, 1, 0, 11);
    velocityGraph3.moveLabelsToSide();
    velocityGraph3.labelAxes('time', 'velocity');
    return velocityGraph3
}

function makeVelocityGraphNotMoving() {
    let velocityGraph4 = new QualitativeGraph(() => 0, 0, 10, 1, -0.5, 10);
    velocityGraph4.moveLabelsToSide();
    velocityGraph4.labelAxes('time', 'velocity');
    velocityGraph4.addZeroLabel();
    return velocityGraph4
}

function makeMomentumGraphConstantVelocity() {
    let momentumGraph1 = makeVelocityGraphConstantVelocity();
    momentumGraph1.labelAxes('time', 'momentum');
    return momentumGraph1
}

function makeMomentumGraphPositiveAcceleration() {
    let momentumGraph2 = makeVelocityGraphPositiveAcceleration();
    momentumGraph2.labelAxes('time', 'momentum');
    return momentumGraph2
}

function makeMomentumGraphNegativeAcceleration() {
    let momentumGraph3 = makeVelocityGraphNegativeAcceleration();
    momentumGraph3.labelAxes('time', 'momentum');
    return momentumGraph3
}

function makeMomentumGraphNotMoving() {
    let momentumGraph4 = makeVelocityGraphNotMoving();
    momentumGraph4.labelAxes('time', 'momentum');
    return momentumGraph4
}



function makeAccelerationGraphPositive() {
    let accelerationGraph1 = new QualitativeGraph(() => 5, 0,10,1,-10,10);
    accelerationGraph1.moveLabelsToSide();
    accelerationGraph1.labelAxes('time', 'acceleration');
    accelerationGraph1.removeHorizontalAxis();
    return accelerationGraph1
}

function makeAccelerationGraphNegative() {
    let accelerationGraph2 = new QualitativeGraph(() => -5, 0, 10, 1, -10, 10);
    accelerationGraph2.moveLabelsToSide();
    accelerationGraph2.labelAxes('time', 'acceleration');
    accelerationGraph2.removeHorizontalAxis();
    return accelerationGraph2
}

function makeAccelerationGraphZero() {
    let accelerationGraph3 = new QualitativeGraph(() => 0, 0, 10, 1, -10, 10);
    accelerationGraph3.moveLabelsToSide();
    accelerationGraph3.labelAxes('time', 'acceleration');
    accelerationGraph3.removeHorizontalAxis();
    return accelerationGraph3
}

function makeNetForceGraphZero() {
    let netForceGraph1 = makeAccelerationGraphZero();
    netForceGraph1.labelAxes('time', 'net force');
    return netForceGraph1
}

function makeNetForceGraphPositive() {
    let netForceGraph2 = makeAccelerationGraphPositive();
    netForceGraph2.labelAxes('time', 'net force');
    return netForceGraph2
}

function makeNetForceGraphNegative() {
    let netForceGraph3 = makeAccelerationGraphNegative();
    netForceGraph3.labelAxes('time', 'net force');
    return netForceGraph3
}

function makeMotionMapConstantVelocity() {
    let motionMap1 = new MotionMap((x)=>x,0,20,10);
    motionMap1.multiplyRadius(0.6);
    return motionMap1
}

function makeMotionMapPositiveAcceleration() {
    let motionMap2 = new MotionMap((x) => x*x, 0, 100, 8);
    motionMap2.multiplyRadius(3);
    return motionMap2
}

function makeMotionMapNegativeAcceleration() {
    let motionMap3 = new MotionMap((t) => 10*t + 0.5 * (-1) * t*t, 0, 10, 8);
    motionMap3.multiplyRadius(1.6);
    return motionMap3
}

function makeMotionMapNotMoving() {
    let motionMap4 = new MotionMap((t) => 0, 0, 10, 10);
    motionMap4.multiplyRadius(1);
    return motionMap4
}
