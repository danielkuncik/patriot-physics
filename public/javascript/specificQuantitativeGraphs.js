class ElectricPotentialGraph {
    constructor(yMax,desiredAspectRatio) {
        this.yMax = yMax;
        this.desiredAspectRatio = desiredAspectRatio;

        this.cursorX = 0;
        this.cursorY = 0;

        this.maxX = 0;
        this.maxY = 0;

        this.lines = [];
        this.referenceArray = [];
    }


    addStep(potentialDifference) {
        this.lines.push({
            x1: this.cursorX,
            y1: this.cursorY,
            x2: this.cursorX + 1,
            y2: this.cursorY + potentialDifference
        });
        this.cursorX += 1;
        this.cursorY += potentialDifference;
    }

    addBattery(voltage) {
        this.addStep(voltage);
    }

    addWire() {
        this.addStep(0);
    }

    addResistor(voltageDrop) {
        this.addStep(-1 * voltageDrop);
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

    setReferenceArray(newReferenceArray) {
        this.referenceArray = newReferenceArray;
    }


    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        this.getMaxes();
        let newGraph = new QuantitativeGraph(0, this.maxX, 0, this.maxY,2);

        newGraph.labelAxes('','Electric Potential (V)');
        newGraph.addReferenceArray([],this.referenceArray);


        this.lines.forEach((line) => {
            newGraph.addSegmentWithArrowheadInCenter(line.x1,line.y1,line.x2,line.y2);
        });

        // backward steps
        let i;
        for (i = this.maxX; i > 0; i -= 1) {
            newGraph.addSegmentWithArrowheadInCenter(i,0,i-1,0);
        }

        return newGraph.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);

    }


}