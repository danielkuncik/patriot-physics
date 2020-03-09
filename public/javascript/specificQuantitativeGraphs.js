class ElectricPotentialGraph {
    constructor(yMax,desiredAspectRatio) {
        this.yMax = yMax;
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

    addStep(potentialDifference,name,current) {
        this.lines.push({
            x1: this.cursorX,
            y1: this.cursorY,
            x2: this.cursorX + 1,
            y2: this.cursorY + potentialDifference,
            name: name,
            currentQuantity: current,
            currentLabel: this.labelCurrent(current)
        });
        this.cursorX += 1;
        this.cursorY += potentialDifference;
    }

    addBattery(voltage,current) {
        this.addStep(voltage,'Bat',current);
    }

    addWire(current) {
        this.addStep(0,undefined,current);
    }

    addResistor(voltageDrop,current) {
        this.addStep(-1 * voltageDrop,`R${alphabetArrayLowercase[this.numResistors]}`,current);
        this.numResistors += 1;
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
        let newGraph = new QuantitativeGraph(0, this.maxX, 0, this.maxY,2);

        newGraph.labelAxes('','Electric Potential (V)');
        newGraph.addReferenceArray([],this.referenceArray);


        this.lines.forEach((line) => {
            newGraph.addSegmentWithArrowheadInCenter(line.x1,line.y1,line.x2,line.y2,this.arrowSize);
            newGraph.labelBetweenTwoPoints(line.x1,line.y1,line.x2,line.y2,line.currentLabel,line.name,undefined,this.fontSize);
        });

        // backward steps
        let i;
        for (i = this.maxX; i > this.xStart; i -= 1) {
            newGraph.addSegmentWithArrowheadInCenter(i,0,i-1,0,this.arrowSize);
        }

        return newGraph.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);

    }


    // the next major steps are to try to make branches and to add current measurements to the bottom row!

}