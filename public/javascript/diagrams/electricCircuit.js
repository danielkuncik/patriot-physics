/*
To do:
- add plus and minus signs to battery
- add meters
- add a line with current labeled

how should this actually work?
should it be primarily cursor based

i want to reorganize this a little
 */
class CircuitDiagram extends Diagram {
    constructor() {
        super();
        this.cursor = origin;
        this.fontSize = undefined;
        this.automaticallyNameAllResisors = false;
        this.numResistors = 0;
    }

    nameAllResistors() {
        this.automaticallyNameAllResisors = true;
    }

    setFontSize(newFontSize) {
        this.fontSize = newFontSize;
    }

    addNewPoint(x,y) {
        return super.addNewPoint(x,y);
    }

    // points must already exist?
    addWire(directionInput, length) {
        let pointA = new Point(this.cursor.x, this.cursor.y);
        let directionInRadians = processDirectionInput(directionInput);
        let pointB = pointA.getAnotherPointWithTrig(length, directionInRadians);
        let newWire = super.addSegment(pointA, pointB);
        this.translateCursorPolar(length, directionInRadians);
        return newWire
    }

    addWireWithLabeledCurrent(directionInput, length, name, current) {

    }


    // should only be accessible within the addResistor function
    addZigZag(endPoint1, endPoint2, width) {
        let theta = endPoint1.getAngleToAnotherPoint(endPoint2);
        let L = endPoint1.getDistanceToAnotherPoint(endPoint2);
        let intermediatePoint1 = endPoint1.interpolate(endPoint2, 0.333333);
        intermediatePoint1.translate(width * Math.cos(theta + Math.PI / 2), width * Math.sin(theta + Math.PI / 2));
        let intermediatePoint2 = endPoint1.interpolate(endPoint2, 0.666667);
        intermediatePoint2.translate(width * Math.cos(theta - Math.PI / 2), width * Math.sin(theta - Math.PI / 2));
        super.addSegment(endPoint1, intermediatePoint1);
        super.addSegment(intermediatePoint1, intermediatePoint2);
        super.addSegment(intermediatePoint2, endPoint2);
    }

    /*
    ONLY to be used within other functions!
    NOT to be used on its own!
     */
    labelElement(point1, point2, labelObject, name, relativeFontSize, width, extraDisplacement, primaryInformation, textOrientation) {
        if (textOrientation === undefined) {
            textOrientation = 'clockwise';
        }

        const length = point1.getDistanceToAnotherPoint(point2);

        if (relativeFontSize === undefined) {
            if (this.fontSize) {
                relativeFontSize = this.fontSize;
            } else {
                relativeFontSize = length * 0.35;
            }
        }
        if (!labelObject) {
            return undefined
        }
        let textDisplacement = width * 1.5 + relativeFontSize * 0.5 + extraDisplacement;
        if (Object.keys(labelObject).length === 1) {
            // label object with a single piece of information
            let key = Object.keys(labelObject)[0];
            let labelAbove  = this.printCircuitQuantity(labelObject[key], key, (key !== primaryInformation));
            // if the information is the primary information, it just gives the quantity
            // otherwise, a statement shows
            // primary information: potential difference for cells, resistance for resistors, current for wires, etc.
            super.labelLineOutside(point1, point2, labelAbove, textDisplacement, relativeFontSize, textOrientation);
        } else if (Object.keys(labelObject).length > 1) {
            // label object with multiple pieces of information
            // it will automatically go to LINES of information
            // and all statements will have an 'equals statement'
            let textArray = [];
            Object.keys(labelObject).forEach((quantity) => {
                let magnitude = labelObject[quantity];
                textArray.push(this.printCircuitQuantity(magnitude,quantity,true));
            });
            // the LOCATION needs to be adaptive, some of these will just yield an error!
            super.addLinesNextToSegment(point1, point2, textArray,textOrientation, width + extraDisplacement,relativeFontSize,undefined);
        } else if (Object.keys(labelObject).length === 0) {
            //no information
            //pass, do nothing
        }
        if (name) {
            // it needs to be on the opposite side, every time!
            super.labelLineInside(point1, point2, name, textDisplacement, relativeFontSize, textOrientation);
            // will work if it stays clockwise
        }
    }

    printCircuitQuantity(magnitudeOrString, quantity, includeEqualStatement) {
        if (typeof(magnitudeOrString) === 'string') { // if a string is entered
            return  magnitudeOrString
        } else if (typeof(magnitudeOrString) === 'number' || magnitudeOrString === undefined) { // if a number is entered
            let magnitude = magnitudeOrString;
            let unit, symbol;
            if (quantity === 'V') {
                unit = 'V';
                symbol = 'ΔV';
            } else if (quantity === 'I') {
                unit = 'A';
                symbol = 'I';
            } else if (quantity === 'R') {
                unit = 'Ω';
                symbol = 'R';
            } else if (quantity === 'P') {
                unit = 'W';
                symbol = 'P';
            } else {
                unit = '';
                symbol = '';
            }
            let value;
            if (magnitude === undefined) {
                value = '  ';
            } else {
                value = `${magnitude} ${unit}`;
            }

            let statement;
            if (includeEqualStatement) {
                statement = `${symbol} = ${value}`;
            } else {
                statement = `${value}`;
            }
            return statement
        }
    }



    addResistor(directionInput, length, labelObject, name, relativeFontSize, width, numZigZags) {
        if (name === undefined && this.automaticallyNameAllResisors) {
            name = `R${alphabetArrayLowercase[this.numResistors]}`
        }
        this.numResistors += 1;

        if (numZigZags === undefined) {
            numZigZags = 3;
        }
        let thetaInRadians = processDirectionInput(directionInput);
        let endPoint1 = this.cursor;
        let endPoint2 = (this.cursor).getAnotherPointWithTrig(length, thetaInRadians);
        if (width === undefined) {
            width = length * 0.25;
        }
        let j;
        let beginningOfZigZag = this.cursor;
        let endOfZigZag;
        for (j = 0; j < numZigZags; j++) {
            endOfZigZag = endPoint1.interpolate(endPoint2, (j + 1) / numZigZags);
            this.addZigZag(beginningOfZigZag, endOfZigZag, width);
            beginningOfZigZag = endOfZigZag;
        }
        this.labelElement(endPoint1, endPoint2, labelObject, name, relativeFontSize, width, 0,'R');
        this.translateCursorPolar(length, thetaInRadians);
    }

    // a simpler functions to add resistors
    addResistorSimple(directionInput,length,resistanceOrLabelObject,relativeFontSize, name) {
        let labelObject;
        if (typeof(resistanceOrLabelObject) === 'string' || typeof(resistanceOrLabelObject) === 'number') {
            labelObject = {"R": resistanceOrLabelObject};
        } else if (typeof(resistanceOrLabelObject) === 'object') {
            labelObject = resistanceOrLabelObject;
        }
        this.addResistor(directionInput, length, labelObject,name,relativeFontSize, undefined, undefined);
    }

    addParallelResistors(directionInput, length, resistorArray, width) {
        const numResistors = resistorArray.length;
        if (width === undefined) {
            width = numResistors * length * 0.5;
        }
        const originalX = this.cursor.x;
        const originalY = this.cursor.y;
        const thetaInRadians = processDirectionInput(directionInput);
        const perpendicularAngle = thetaInRadians - Math.PI / 2;
        this.translateCursorPolar(width / 2, perpendicularAngle);
        this.addWire(Math.PI + perpendicularAngle, width);
        this.translateCursorPolar(width, perpendicularAngle);
        let k;
        if (numResistors > 1) {
            for (k = 0; k < numResistors; k++) {
                this.addWire(thetaInRadians, length * 0.25);
                this.addResistorSimple(thetaInRadians, length*0.5,resistorArray[k]);
                this.addWire(thetaInRadians, length * 0.25);
                this.translateCursorPolar(length, -1 * thetaInRadians);
                this.translateCursorPolar(width / (numResistors - 1),  Math.PI + perpendicularAngle);
            }
        } else {
            console.log('What are you doing? dont use the add parallel element function unless you have more than one resistor!');
        }
        this.translateCursorAbsolute(originalX, originalY);
        this.translateCursorPolar(length, thetaInRadians);
        this.translateCursorPolar(width / 2, perpendicularAngle);
        this.addWire(Math.PI + perpendicularAngle, width);
        this.translateCursorPolar(width / 2, perpendicularAngle);

    }


    addSeriesResistors(directionInput, length, resistorArray, lockedResistorLength) {
        const numResistors = resistorArray.length;
        const numWireSections = numResistors + 1;
        let resistorLength;
        if (lockedResistorLength) {
            resistorLength = lockedResistorLength;
        } else {
            resistorLength = length / (numResistors + numWireSections);
        }
        const wireLength = (length - resistorLength * numResistors) / numWireSections;

        this.addWire(directionInput, wireLength);
        let k;
        for (k = 0; k < numResistors; k++) {
            this.addResistorSimple(directionInput, resistorLength, resistorArray[k]);
            this.addWire(directionInput, wireLength);
        }
        // that's all folks!
    }


    ///I want to replace 'addListOfElements' with more of a cursor type program
    translateCursor(directionInput, length) {
        let directionInRadians = processDirectionInput(directionInput);
        this.translateCursorPolar(length, directionInRadians);
    }

    translateCursorRectangonal(xTranslation, yTranslation) {
        this.cursor.translate(xTranslation, yTranslation);
    }
    translateCursorPolar(length, directionInRadians) {
        this.cursor.translatePolar(length, directionInRadians);
    }
    translateCursorAbsolute(newX, newY) {
        this.cursor.translateAbsolute(newX, newY);
    }

    /// will be deprecated after all elements are added with cursor
    addElementWithCursor(elementType, endPointX, endPointY, labelAbove, labelBelow) {
        let nextPoint = new Point(endPointX, endPointY);
        let directionInRadians = (this.cursor).getAngleToAnotherPoint(nextPoint);
        let length = this.cursor.getDistanceToAnotherPoint(nextPoint);
        if (elementType === 'wire') {
            this.addWire(directionInRadians, length);
        } else if (elementType === 'resistor') {
            this.addResistor(directionInRadians, length, labelAbove, labelBelow);
        } else if (elementType === 'battery' || elementType === 'cell') {
            this.addCell(directionInRadians, length, labelAbove, labelBelow);
        }
        return true
    }


    addSign(type, centerPoint, width, thetaInRadians) {
        // add a plus or minus sign
        let north = centerPoint.getAnotherPointWithTrig(width / 2, thetaInRadians);
        let west  = centerPoint.getAnotherPointWithTrig(width / 2, thetaInRadians + Math.PI / 2);
        let south = centerPoint.getAnotherPointWithTrig(width / 2, thetaInRadians + Math.PI);
        let east  = centerPoint.getAnotherPointWithTrig(width / 2, thetaInRadians + Math.PI * 3 / 2);

        if (type === 'plus') {
            let seg1 = super.addSegment(north, south);
            let seg2 = super.addSegment(west, east);
            return [seg1, seg2]
        } else if (type = 'minus') {
            let seg1 = super.addSegment(west, east);
            return seg1
        } else {
            return false
        }
    }

    addPlusSign(centerPoint, width, thetaInRadians) {
        return this.addSign('plus', centerPoint, width, thetaInRadians);
    }

    addMinusSign(centerPoint, width, thetaInRadians) {
        return this.addSign('minus', centerPoint, width, thetaInRadians);
    }

    //     labelElement(point1, point2, labelObject, name, relativeFontSize, width, extraDisplacement, primaryInformation) {
    addCell(directionInput, length, labelObject, name, numBatteries, relativeFontSize, width) {
        if (numBatteries === undefined) {numBatteries = 2;}
        if (width === undefined) {width = length * 0.6} /// should be proportioned by numbatteries

        let thetaInRadians = processDirectionInput(directionInput);
        let endPoint1 = this.cursor;
        let endPoint2 = endPoint1.getAnotherPointWithTrig(length, thetaInRadians);
        let numLines = numBatteries * 2;
        let theta = endPoint1.getAngleToAnotherPoint(endPoint2);
        let j, pointA, pointB, lineWidth;
        for (j = 0; j < numLines; j++) {
            if (j % 2 === 0) {lineWidth = width / 2;} else {lineWidth = width;}
            pointA = endPoint1.interpolate(endPoint2, j / (numLines - 1));
            pointB = endPoint1.interpolate(endPoint2, j / (numLines - 1));
            pointA.translate(lineWidth / 2 * Math.cos(theta + Math.PI/2), lineWidth / 2 * Math.sin(theta + Math.PI /2));
            pointB.translate(lineWidth / 2 * Math.cos(theta - Math.PI/2), lineWidth / 2 * Math.sin(theta - Math.PI /2));
            super.addSegment(pointA, pointB);
        }
        let plusSignCenter = endPoint2.transformAndReproduce(theta - Math.PI / 2, -1 * width * 3 / 8, width / 10);
        let plusSign = this.addPlusSign(plusSignCenter, width / 8, theta);
        let minusSignCenter = endPoint1.transformAndReproduce(theta - Math.PI / 2, -1 * width * 3 / 8, -1 * width / 10);
        let minusSign = this.addMinusSign(minusSignCenter, width / 8, theta);
        // the problem is exclusively in quadrant 4...in which theta - MATH.PI is negative!


        this.labelElement(endPoint1, endPoint2, labelObject, name, relativeFontSize, width, 0, 'V');
        this.translateCursorPolar(length, thetaInRadians);
    }

    addCellSimple(directionInput, length, voltageOrLabelObject, numBatteries) {
        let labelObject;
        if (typeof(voltageOrLabelObject) === 'number' || typeof(voltageOrLabelObject) === 'string') {
            labelObject = {"V": voltageOrLabelObject};
        } else if (typeof(voltageOrLabelObject) === 'object') {
            labelObject = voltageOrLabelObject;
        }
        this.addCell(directionInput, length, labelObject, undefined, numBatteries, undefined, undefined);
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

    let myCircuit = new CircuitDiagram();
    // need to change this so i have more control over the battery voltage
    myCircuit.addCellSimple('up',3,batteryVoltage);
    myCircuit.addWire('up',2);



    let k, resistorIndex = 0;
    for (k = 0; k < resistorsOnTop; k++) {
        myCircuit.addWire('right',2);
        myCircuit.addResistorSimple('right',2,resistorArray[resistorIndex]);
        resistorIndex += 1;
    }
    myCircuit.addWire('right',2);

    if (resistorOnRightEnd) {
        myCircuit.addWire('down',2);
        myCircuit.addResistorSimple('down',2, resistorArray[resistorIndex]);
        resistorIndex += 1;
        myCircuit.addWire('down',3);
    } else {
        myCircuit.addWire('down',7);
    }


    for (k = 0; k < resistorsOnTop; k++) {
        myCircuit.addWire('left',2);
        myCircuit.addResistorSimple('left',2, resistorArray[resistorIndex]);
        resistorIndex += 1;
    }

    myCircuit.addWire('left',2);
    myCircuit.addWire('up',2);

    return myCircuit
}

function makeSimpleCircuit(voltage, resistance) {
    return makeSeriesCircuit(voltage, [resistance]);
}

function makeParallelCircuit(batteryVoltage, resistorArray) {
    let numResistors = resistorArray.length;

    let myCircuit = new CircuitDiagram();
    myCircuit.addCellSimple('up',3,batteryVoltage);
    myCircuit.addWire('up',2);

    let k, X;
    for (k = 0; k < numResistors; k++) {
        myCircuit.addWire('right',4);
        myCircuit.addWire('down',2);
        myCircuit.addResistorSimple('down',3,resistorArray[k]);
        myCircuit.addWire('down',2);
        myCircuit.addWire('left',4);
        myCircuit.translateCursorRectangonal(4,7);
    }
    myCircuit.translateCursorAbsolute(0,-2);
    myCircuit.addWire('up',2);

    return myCircuit
}


function createCircuitProblem(type, batteryVoltage, resistorArray, powerBoolean, resistanceAnswers, currentAnswers, voltageAnswers, powerAnswers) {
    let circuit, table, answerTable;
    if (type === 'series') {
        circuit = makeSeriesCircuit(batteryVoltage, resistorArray);
    } else if (type === 'parallel') {
        circuit = makeParallelCircuit(batteryVoltage, resistorArray);
    }
    table = new ElectricCircuitTable(resistorArray.length, powerBoolean);
    answerTable = new ElectricCircuitTable(resistorArray.length, powerBoolean);
    answerTable.fillInResistanceRow(resistanceAnswers);
    answerTable.fillInVoltageRow(voltageAnswers);
    answerTable.fillInCurrentRow(currentAnswers);
    if (powerBoolean) {
        answerTable.fillInPowerRow(powerAnswers);
    }
    return {
        circuit: circuit,
        table: table,
        answerTable: answerTable
    }
}

function insertCircuitProblem(number, circuitProblem, size) {
    if (size === undefined) {size = 4;}
    $(`li#problem${number}`).append($("<br>"));
    $(`li#problem${number}`).append(circuitProblem.circuit.drawCanvas(size * 100, size * 50));
    $(`li#problem${number}`).append($("<br>"));
    $(`li#problem${number}`).append(circuitProblem.table.draw(size * 150, size * 75));
    addAnswerObject(`problem${number}Answer`, (circuitProblem.answerTable.draw(size *100, size * 50)));
}

