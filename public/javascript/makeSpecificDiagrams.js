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
function printQuantity(item, singularUnit, pluralUnit, abbreviation, useAbbreviationBoolean) {
    let outputString;
    if (item === undefined) {
        outputString = ''
    } else if (typeof(item) === 'string') {
        outputString = item;
    } else if (typeof(item) === 'number') {
        if (useAbbreviationBoolean) {
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

function printResistance(item) {
    return printQuantity(item, 'Ohm', 'Ohms');
}

function printVoltage(item) {
    return printQuantity(item, 'Volt', 'Volts');
}

function printCurrent(item) {
    return printQuantity(item, 'Amp', 'Amps');
}

function printPower(item) {
    return printQuantity(item, 'Watt', 'Watts');
}

function printForce(item) {
    return printQuantity(item, 'Newton', "Newtons");
}

function printForceAbbreviated(item) {
    return printQuantity(item, 'Newton', 'Newtons', 'N', true);
}
// i could just have both singular and plural be 'N' ==> a simpler code



// turns a string in text to an appropriate angle in radians
function turnTextToRadians(text) {
    var theta;
    switch(text) {
        case 'right':
            theta = 0;
            break;
        case 'left':
            theta = Math.PI;
            break;
        case 'up':
            theta = Math.PI / 2;
            break;
        case "down":
            theta = Math.PI * 3 / 2;
            break;
        case "east":
            theta = 0;
            break;
        case "west":
            theta = Math.PI;
            break;
        case "north":
            theta = Math.PI / 2;
            break;
        case "south":
            theta = Math.PI * 3 / 2;
            break;
        default:
            theta = undefined;
            break;
    }
    return theta;
}

// given an inputted direction
// tries to figure out what the user meant, and returns a value in radians
function processDirectionInput(direction) {
    if (typeof(direction) === 'string') { // if you wrote a word indicating numbers
        return turnTextToRadians(direction)
    } else if (typeof(direction) === 'number' && direction > 2 * Math.PI + 1) { // if you probably meant degrees
        console.log(`note: assuming value ${direction} entered was in units of degrees, not radians`);
        return convertDegreesToRadians(direction)
    } else if (typeof(direction) === 'number') { // if you gave a value in radians
        return direction
    } else {
        console.log('ERROR: Unable to process direction input');
        return undefined
    }
}


function makeSeriesCircuit(batteryVoltage, resistorArray) {
    let numResistors = resistorArray.length;
    let resistorOnRightEnd = (numResistors % 2 > 0);
    let resistorsOnTop;
    if (resistorOnRightEnd) {
        resistorsOnTop = (numResistors - 1)/2;
    } else {
        resistorsOnTop = numResistors / 2;
    }
    let resistorsOnBottom = resistorsOnTop;
    let topLineY = 4;
    let leftEndX = 0;

    let myCircuit = new CircuitDiagram();
    // need to change this so i have more control over the battery voltage
    myCircuit.addElementWithCursor('battery', leftEndX, 3, printVoltage(batteryVoltage));
    myCircuit.addElementWithCursor('wire', leftEndX, topLineY);
    myCircuit.addElementWithCursor('wire', leftEndX + 3, topLineY);

    this.resistorArrayIndex = 0;
    this.printNextResistor = function() {
        let output = printResistance(resistorArray[this.resistorArrayIndex]);
        this.resistorArrayIndex += 1;
        return output
    };


    let k, currentX = leftEndX + 3;
    for (k = 0; k < resistorsOnTop; k++) {
        currentX += 2;
        myCircuit.addElementWithCursor("resistor", currentX, topLineY, this.printNextResistor());
        currentX += 2;
        myCircuit.addElementWithCursor("wire", currentX, topLineY);
    }
    let rightEndX = currentX;

    myCircuit.addElementWithCursor("wire", rightEndX, topLineY - 2);
    if (resistorOnRightEnd) {
        myCircuit.addElementWithCursor("resistor", rightEndX, topLineY - 4, undefined, this.printNextResistor());
    }
    myCircuit.addElementWithCursor("wire", rightEndX, topLineY - 6);
    let bottomLineY = topLineY - 6;


    for (k = 0; k < resistorsOnBottom; k++) {
        currentX -= 2;
        myCircuit.addElementWithCursor("wire", currentX, bottomLineY);
        currentX -= 2;
        myCircuit.addElementWithCursor("resistor", currentX, bottomLineY, undefined, this.printNextResistor());
    }

    myCircuit.addElementWithCursor("wire", leftEndX, bottomLineY);
    myCircuit.addElementWithCursor("wire", leftEndX, 0);

    return myCircuit
}

function makeParallelCircuit(batteryVoltage, resistorArray) {
    let numResistors = resistorArray.length;

    this.resistorArrayIndex = 0;
    this.printNextResistor = function() {
        let output = printResistance(resistorArray[this.resistorArrayIndex]);
        this.resistorArrayIndex += 1;
        return output
    };


    let topLineY = 6;
    let bottomLineY = topLineY - 8;
    let leftEndX = 0;
    let firstResistorX = leftEndX + 5;
    let widthBetweenResistors = 3;

    let myCircuit = new CircuitDiagram();
    myCircuit.addElementWithCursor('battery', leftEndX, 3, printVoltage(batteryVoltage));
    myCircuit.addElementWithCursor('wire', leftEndX, topLineY);
    myCircuit.addElementWithCursor('wire', firstResistorX - widthBetweenResistors, topLineY);

    let k, X;
    for (k = 0; k < numResistors; k++) {
        X = firstResistorX + k * widthBetweenResistors;
        myCircuit.moveCursor(X - widthBetweenResistors, topLineY);
        myCircuit.addElementWithCursor("wire", X, topLineY);
        myCircuit.addElementWithCursor("wire", X, topLineY - 3);
        myCircuit.addElementWithCursor("resistor", X, topLineY - 5, undefined, this.printNextResistor());
        myCircuit.addElementWithCursor("wire", X, bottomLineY);
        myCircuit.addElementWithCursor("wire", X - widthBetweenResistors, bottomLineY);
    }
    myCircuit.moveCursor(firstResistorX - widthBetweenResistors, bottomLineY);
    myCircuit.addElementWithCursor("wire", leftEndX, bottomLineY);
    myCircuit.addElementWithCursor("wire", leftEndX, 0);

    return myCircuit
}

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
        console.log(theta);
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
    console.log(myFBD);
    return myFBD;
}

