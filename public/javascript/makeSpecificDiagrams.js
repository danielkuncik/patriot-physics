/*
This is a follow-up on physics Diagram Generation

physicsDiagramGeneration.js creates objects and methods to make diagrams used in physics class


makeSpecificDiagrams.js creates functions that quickly generate specific types of diagrams
 */




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
    myCircuit.addElementWithCursor('battery', leftEndX, 3, `${batteryVoltage} Volts`);
    myCircuit.addElementWithCursor('wire', leftEndX, topLineY);
    myCircuit.addElementWithCursor('wire', leftEndX + 3, topLineY);

    this.resistorArrayIndex = 0;
    this.printResistance = function() {
        let outputString;
        if (resistorArray[this.resistorArrayIndex] === 1) {
            outputString = "1 Ohm";
        } else if (resistorArray[this.resistorArrayIndex] === undefined) {
            outputString = ''; // in case i want one of them to be empty and have no information
        } else {
            outputString = `${resistorArray[this.resistorArrayIndex]} Ohms`
        }
        this.resistorArrayIndex += 1;
        return outputString
    };

    let k, currentX = leftEndX + 3;
    for (k = 0; k < resistorsOnTop; k++) {
        currentX += 2;
        myCircuit.addElementWithCursor("resistor", currentX, topLineY, this.printResistance());
        currentX += 2;
        myCircuit.addElementWithCursor("wire", currentX, topLineY);
    }
    let rightEndX = currentX;

    myCircuit.addElementWithCursor("wire", rightEndX, topLineY - 2);
    if (resistorOnRightEnd) {
        myCircuit.addElementWithCursor("resistor", rightEndX, topLineY - 4, undefined, this.printResistance());
    }
    myCircuit.addElementWithCursor("wire", rightEndX, topLineY - 6);
    let bottomLineY = topLineY - 6;


    for (k = 0; k < resistorsOnBottom; k++) {
        currentX -= 2;
        myCircuit.addElementWithCursor("wire", currentX, bottomLineY);
        currentX -= 2;
        myCircuit.addElementWithCursor("resistor", currentX, bottomLineY, undefined, this.printResistance());
    }

    myCircuit.addElementWithCursor("wire", leftEndX, bottomLineY);
    myCircuit.addElementWithCursor("wire", leftEndX, 0);

    return myCircuit
}

function makeParallelCircuit(batteryVoltage, resistorArray) {
    let numResistors = resistorArray.length;

    this.resistorArrayIndex = 0;
    this.printResistance = function() {
        let outputString;
        if (resistorArray[this.resistorArrayIndex] === 1) {
            outputString = "1 Ohm";
        } else if (resistorArray[this.resistorArrayIndex] === undefined) {
            outputString = ''; // in case i want one of them to be empty and have no information
        } else if (typeof(resistorArray[this.resistorArrayIndex]) === 'string') {
            outputString = resistorArray[this.resistorArrayIndex]; /// you can write the resistance as a string and it jsut comes in fine
        } else {
            outputString = `${resistorArray[this.resistorArrayIndex]} Ohms`
        }
        this.resistorArrayIndex += 1;
        return outputString
    };

    let topLineY = 6;
    let bottomLineY = topLineY - 8;
    let leftEndX = 0;
    let firstResistorX = leftEndX + 5;
    let widthBetweenResistors = 3;

    let myCircuit = new CircuitDiagram();
    myCircuit.addElementWithCursor('battery', leftEndX, 3, `${batteryVoltage} Volts`);
    myCircuit.addElementWithCursor('wire', leftEndX, topLineY);
    myCircuit.addElementWithCursor('wire', firstResistorX - widthBetweenResistors, topLineY);

    let k, X;
    for (k = 0; k < numResistors; k++) {
        X = firstResistorX + k * widthBetweenResistors;
        myCircuit.moveCursor(X - widthBetweenResistors, topLineY);
        myCircuit.addElementWithCursor("wire", X, topLineY);
        myCircuit.addElementWithCursor("wire", X, topLineY - 3);
        myCircuit.addElementWithCursor("resistor", X, topLineY - 5, undefined, this.printResistance());
        myCircuit.addElementWithCursor("wire", X, bottomLineY);
        myCircuit.addElementWithCursor("wire", X - widthBetweenResistors, bottomLineY);
    }
    myCircuit.moveCursor(firstResistorX - widthBetweenResistors, bottomLineY);
    myCircuit.addElementWithCursor("wire", leftEndX, bottomLineY);
    myCircuit.addElementWithCursor("wire", leftEndX, 0);

    return myCircuit
}