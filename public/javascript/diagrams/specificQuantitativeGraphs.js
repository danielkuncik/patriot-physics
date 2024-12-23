class ElectricPotentialGraph {
    constructor(desiredAspectRatio) {
        if (desiredAspectRatio === undefined) {
            desiredAspectRatio = 2;
        }
        this.desiredAspectRatio = desiredAspectRatio;
        this.xStart = 1;

        this.cursorX = this.xStart;
        this.cursorY = 0;

        this.maxX = 0;
        this.maxY = 0;

        this.fontSize = 0;
        this.arrowSize = 0;

        this.lines = [];
        this.referenceArray = [];

        this.numResistors = 0;
    }

    labelCurrent(current) {
        if (current) {
            return `${current} A`;
        } else {
            return undefined
        }
    }

    addStep(potentialDifference,name,current,infoLinesBoolean, knownInformation) {
        this.lines.push({
            x1: this.cursorX,
            y1: this.cursorY,
            x2: this.cursorX + 1,
            y2: this.cursorY + potentialDifference,
            name: name,
            currentQuantity: current,
            currentLabel: this.labelCurrent(current),
            infoLinesBoolean: infoLinesBoolean,
            knownInformation: knownInformation
        });
        this.cursorX += 1;
        this.cursorY += potentialDifference;
    }

    addBattery(voltage,current, infoLinesBoolean) {
        this.addStep(voltage,'Bat',current, infoLinesBoolean);
    }

    addWire(current) {
        this.addStep(0,undefined,current);
    }

    addMultipleWires(numWires, current) {
        let p;
        for (p = 0; p < numWires; p++) {
            this.addWire(current);
        }
    }

    addResistor(voltageDrop,current, infoLinesBoolean, knownInformation) {
        this.addStep(-1 * voltageDrop,`R${alphabetArrayLowercase[this.numResistors]}`,current, infoLinesBoolean, knownInformation);
        this.numResistors += 1;
    }

    // one current boolean causes current to be displayed in only one spot
    addDownwardSteps(stepArray, current, infoLinesBoolean, oneCurrentBoolean) {
        let k;
        this.addResistor(stepArray[0],current, infoLinesBoolean);
        if (oneCurrentBoolean) {
            current = undefined;
        }
        this.addWire(current);

        for (k = 1; k < stepArray.length - 1; k++) {
            this.addResistor(stepArray[k],current, infoLinesBoolean);
            this.addWire(current);
        }
        if (stepArray.length > 1) {
            this.addResistor(stepArray[stepArray.length - 1], current, infoLinesBoolean); // add the last resistor
        }
    }

    moveToEndOfRow(verticalPosition) {
        let newX = 0;
        this.lines.forEach((line) => {
            if (line.y1 === verticalPosition && line.x1 > newX) {
                newX = line.x1;
            }
            if (line.y2 === verticalPosition && line.x2 > newX) {
                newX = line.x2;
            }
        });
        this.moveCursor(newX, verticalPosition);
    }

    moveToEndOfTopRow() {
        this.getMaxes();
        this.moveToEndOfRow(this.maxY);
    }

    // one current boolean, if true, current is shown only in one place
    addBranch(stepArray, current, infoLinesBoolean, oneCurrentBoolean, extraHorizontalSteps, verticalPositionIfNotTop) {
        this.getMaxes();
        let verticalPosition = verticalPositionIfNotTop;
        if (verticalPosition === undefined) {
            verticalPosition = this.maxY;
        }
        if (extraHorizontalSteps === undefined) {
            extraHorizontalSteps = 0;
        }
        this.moveToEndOfRow(verticalPosition);

        this.addWire(current);
        if (oneCurrentBoolean) {
            current = undefined; // from now on
        }

        this.addWire(current);
        let w;
        for (w = 0; w < extraHorizontalSteps; w++) {
            this.addWire(current);
        }
        this.addDownwardSteps(stepArray, current, infoLinesBoolean);
    }


    moveCursor(newX, newY) {
        this.cursorX = newX;
        this.cursorY = newY;
    }

    getMaxes() {
        let maxX = 0;
        let maxY = 0;
        this.lines.forEach((line) => {
            if (line.x1 > maxX) {
                maxX = line.x1;
            }
            if (line.x2 > maxX) {
                maxX = line.x2;
            }
            if (line.y1 > maxY) {
                maxY = line.y1;
            }
            if (line.y2 > maxY) {
                maxY = line.y2;
            }
        });
        this.maxX = maxX;
        this.maxY = maxY;
    }


    setFontAndArrowSize() {
        this.fontSize = this.maxX * 0.02;
        this.arrowSize = this.maxX * 0.02;
    }

    setReferenceArray(newReferenceArray) {
        this.referenceArray = newReferenceArray;
    }


    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        this.getMaxes();
        this.setFontAndArrowSize();
        let newGraph = new QuantitativeGraph(0, this.maxX, 0, this.maxY,this.desiredAspectRatio);

        newGraph.labelAxes('','Electric Potential (V)');
        newGraph.addReferenceArray([],this.referenceArray);


        this.lines.forEach((line) => {
            newGraph.addSegmentWithArrowheadInCenter(line.x1,line.y1,line.x2,line.y2,this.arrowSize);
            newGraph.labelBetweenTwoPoints(line.x1,line.y1,line.x2,line.y2,line.currentLabel,line.name,undefined,this.fontSize);
            if (line.infoLinesBoolean) {
                let voltageLine = 'ΔV =';
                let currentLine = 'I = ';
                let resistanceLine = 'R = ';
                if (line.knownInformation) {
                    if (line.knownInformation['V']) {
                        voltageLine = voltageLine + ` ${line.knownInformation['V']} V`;
                    }
                    if (line.knownInformation['I']) {
                        currentLine = currentLine + ` ${line.knownInformation['I']} A`;
                    }
                    if (line.knownInformation['R']) {
                        resistanceLine = resistanceLine + ` ${line.knownInformation['R']} Ohms`;
                    }
                }
                newGraph.addLinesNextToSegment(line.x1, line.y1, line.x2, line.y2, [voltageLine,currentLine,resistanceLine],'right',0,this.fontSize);
            }
        });

        newGraph.addReferenceArray([], this.referenceArray);

        // backward steps
        let i;
        for (i = this.maxX; i > this.xStart; i -= 1) {
            newGraph.addSegmentWithArrowheadInCenter(i,0,i-1,0,this.arrowSize);
        }

        return newGraph.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);

    }


    // the next major steps are to try to make branches and to add current measurements to the bottom row!

}


class HeatGraphs extends QuantitativeGraph {
    constructor(minTemp, maxTemp, qualitativeOrQuantitative, desiredAspectRatio, temperatureScale, maxHeatAdded) {
        if (temperatureScale === undefined) {
            temperatureScale = 'celsius';
        }
        if (desiredAspectRatio === undefined) {
            desiredAspectRatio = 0.5;
        }
        let yLabel, xLabel, xMax;

        if (temperatureScale === 'celsius') {
            yLabel = 'Temperature (&#176;C)';
        } else if (temperatureScale === 'kelvin') {
            yLabel = 'Temperature (K)';
        }
        if (qualitativeOrQuantitative === 'qualitative') {
            xLabel = 'Heat Added';
            xMax = 1;
        } else if (qualitativeOrQuantitative === 'quantitative') {
            xLabel = 'Heat Added (J)';
            xMax = maxHeatAdded;
        }

        super(0,xMax,minTemp,maxTemp,desiredAspectRatio);
        super.labelAxes(xLabel, yLabel);
    }


    setHeatCapacity() {

    }

    setMass() {

    }
}
