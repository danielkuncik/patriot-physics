///problems:
// 1 - there needs to be a function taht rescales the x and y axis values
/// without actualyl changing anything about the graph
/// 2 - i need to redo the dashed/dotted line function above!
//// so that it does not make a million points, and it makes lines that look a whole lot better!
class QuantitativeGraph extends Diagram {
    constructor(xMinOnGraph, xMaxOnGraph, yMinOnGraph, yMaxOnGraph, desiredAspectRatio) {
        super();
        // these variables are different than those for the canvas

        try {
            if (xMinOnGraph >= xMaxOnGraph) {throw "ERROR: xmax must be greater than xmin";}
            if (yMinOnGraph >= yMaxOnGraph) {throw "ERROR: ymax must be greater than ymin"}
        }
        catch (err) {
            console.log(err);
        }
        if (desiredAspectRatio === undefined) {desiredAspectRatio = 1;}

        // correct aspect ratio
        // to set the axis ratio to the desired value, multiple all y values by the multiplier
        this.yMultiplier = ( (xMaxOnGraph - xMinOnGraph) / (yMaxOnGraph - yMinOnGraph) ) / desiredAspectRatio ;
        //the y multiplier is the aspect ratio i would get if i did nothing divided by the aspect ratio i want
        // mulitply all y values by this number

        this.xMinOnGraph = xMinOnGraph; // differentiates from xMin of the diagram, defined above
        this.xMaxOnGraph = xMaxOnGraph;
        this.yMinOnGraphOriginal = yMinOnGraph;
        this.yMaxOnGraphOriginal = yMaxOnGraph;
        this.yMinOnGraph = yMinOnGraph * this.yMultiplier;
        this.yMaxOnGraph = yMaxOnGraph * this.yMultiplier;

        // x axis
        super.addTwoPointsAndSegment(this.xMinOnGraph, 0, this.xMaxOnGraph, 0);

        // y axis
        super.addTwoPointsAndSegment(0, this.yMinOnGraph, 0, this.yMaxOnGraph);

        this.axisLabelFontSize = undefined;
        this.hashLabelFontSize = undefined;
        this.hashLength = undefined;
        this.axisTextDisplacement = undefined;
        this.hashLabelDisplacement = undefined;
        this.pointRadius = undefined;
        this.setRelativeSizes();
        this.yAxisLabel = undefined;
        this.xAxisLabel = undefined;
    }

    setRelativeSizes() { // based on the shorter of the two sides
        let sizeFactor;
        if (this.xMaxOnGraph - this.xMinOnGraph < this.yMaxOnGraph - this.yMinOnGraph) {
            sizeFactor = this.xMaxOnGraph - this.xMinOnGraph;
        } else {
            sizeFactor = this.yMaxOnGraph - this.yMinOnGraph;
        }
        // estimates of what might work well
        this.axisLabelFontSize = sizeFactor / 8;
        this.hashLabelFontSize = sizeFactor / 10;
        this.hashLength = sizeFactor / 5;
        this.axisTextDisplacement = this.hashLength / 2 + this.hashLabelFontSize + this.axisLabelFontSize * 0.8; /// should automatically increase when the first hash is added
        this.hashLabelDisplacement = this.hashLength /2  + this.hashLabelFontSize * 0.8;
        this.pointRadius = sizeFactor / 30;
    }

    labelAxes(xLabel, yLabel) {
        let lowerLeftCorner = new Point(this.xMinOnGraph, this.yMinOnGraph);
        let lowerRightCorner = new Point(this.xMaxOnGraph, this.yMinOnGraph);
        let upperLeftCorner = new Point(this.xMinOnGraph, this.yMaxOnGraph);

        this.xAxisLabel = super.labelLineBelow(lowerLeftCorner, lowerRightCorner, xLabel, this.axisTextDisplacement, this.axisLabelFontSize);
        this.yAxisLabel = super.labelLineAbove(lowerLeftCorner, upperLeftCorner, yLabel, this.axisTextDisplacement, this.axisLabelFontSize);
    }

    makePositionGraph(timeUnit, positionUnit) {
        if (timeUnit === undefined) {timeUnit = 's';}
        if (positionUnit === undefined) {positionUnit = 'm';}
        this.labelAxes(`time (${timeUnit})`, `position (${positionUnit})`);
    }

    makeVelocityGraph(timeUnit, velocityUnit) {
        if (timeUnit === undefined) {timeUnit = 's';}
        if (velocityUnit === undefined) {velocityUnit = 'm/s';}
        this.labelAxes(`time (${timeUnit})`, `velocity (${velocityUnit})`);
    }

    makeAccelerationGraph(timeUnit, accelerationUnit) {
        if (timeUnit === undefined) {timeUnit = 's';}
        if (accelerationUnit === undefined) {accelerationUnit = 'm/s/s';}
        this.labelAxes(`time (${timeUnit})`, `acceleration (${accelerationUnit})`)
    }

    makeMomentumGraph(timeUnit, momentumUnit) {
        if (timeUnit === undefined) {timeUnit = 's';}
        if (momentumUnit === undefined) {momentumUnit = 'kg m/s';}
        this.labelAxes(`time (${timeUnit})`, ` momentum (${momentumUnit})`);
    }

    makeNetForceGraph(timeUnit, netForceUnit) {
        if (timeUnit === undefined) {timeUnit = 's';}
        if (netForceUnit === undefined) {netForceUnit = 'N';}
        this.labelAxes(`time (${timeUnit})`, `net force (${netForceUnit})`)
    }


    /*
    I need to add:
    an option taht allows the label to be at the end of the graph, not on the axis
     */
    addXAxisHash(position, label, doYouWantTheLabelFarAway) {
        try {
            if (position < this.xMinOnGraph || position > this.xMaxOnGraph) {throw "ERROR: xAxis Hash out of range";}
        }
        catch (err) {
            console.log(err);
            return false
        }
        /// i don't understand what i was thinking of when i created this variable?
        // odn't i alwasy want the label far away??
        if (doYouWantTheLabelFarAway === undefined) {doYouWantTheLabelFarAway = true;}

        let newHash = super.addTwoPointsAndSegment(position, this.hashLength / 2 + this.yMinOnGraph, position, -1 * this.hashLength / 2 + this.yMinOnGraph);

        let newLabel;
        if (doYouWantTheLabelFarAway) {
            newLabel = super.addText(label, new Point(position, -1 * this.hashLabelDisplacement + this.yMinOnGraph), this.hashLabelFontSize, 0);
        } else {
            newLabel = super.addText(label, new Point(position, -1 * this.hashLabelDisplacement), this.hashLabelFontSize, 0);
        }
        return newHash
    }
    addYAxisHash(position, label, doYouWantTheLabelFarAway) {
        try {
            if (position < this.yMinOnGraphOriginal || position > this.yMaxOnGraphOriginal) {throw "ERROR: yAxis Hash out of range";}
        }
        catch (err) {
            console.log(err);
            return false
        }
        if (doYouWantTheLabelFarAway === undefined) {doYouWantTheLabelFarAway = false;}


        let newHash = super.addTwoPointsAndSegment(this.hashLength / 2, position * this.yMultiplier, -1 * this.hashLength / 2, position * this.yMultiplier);

        let newLabel;
        if (doYouWantTheLabelFarAway) {
            let newLabel = super.addText(label, new Point(-1 * this.hashLabelDisplacement + this.xMinOnGraph, position * this.yMultiplier), this.hashLabelFontSize, 0);
        } else {
            let newLabel = super.addText(label, new Point(-1 * this.hashLabelDisplacement, position * this.yMultiplier), this.hashLabelFontSize, 0);
        }
        return newHash;
    }

    /// i will need to put some thought into how the dotted lines work so that they look nice!
    // adds a dotted line
    addXAxisReferenceLine(position) {
        super.addDottedLine(new Point(position, this.yMinOnGraph), new Point(position, this.yMaxOnGraph), 15);
        // function here
        // adds a vertical dotted line at this position on the axis
    }

    addYAxisReferenceLine(position) {
        super.addDottedLine(new Point(this.xMinOnGraph, position * this.yMultiplier), new Point(this.xMaxOnGraph, position * this.yMultiplier), 15);
        // function here
        // adds a horizontal dotted line at this position on the y axis
    }

    addXReference(position, referenceLineBoolean, hashMarkBoolean) {
        if (referenceLineBoolean === undefined) {
            referenceLineBoolean = true
        }
        if (hashMarkBoolean === undefined) {
            hashMarkBoolean = true
        }
        if (referenceLineBoolean) {
            this.addXAxisHash(position, String(roundValue(position,2)), true);
        }
        if (hashMarkBoolean) {
            this.addXAxisReferenceLine(position);
        }
    }

    addYReference(position, referenceLineBoolean, hashMarkBoolean) {
        if (referenceLineBoolean === undefined) {
            referenceLineBoolean = true
        }
        if (hashMarkBoolean === undefined) {
            hashMarkBoolean = true
        }
        if (referenceLineBoolean) {
            this.addYAxisHash(position, String(roundValue(position,2)), true);
        }
        if (hashMarkBoolean) {
            this.addYAxisReferenceLine(position);
        }
    }

    // an array of positions
    // at each position, adds a reference hash, a label, an a reference line
    addReferenceArray(xReferenceArray, yReferenceArray) {
        xReferenceArray.forEach((position) => {
            this.addXReference(position);
        });
        yReferenceArray.forEach((position) => {
            this.addYReference(position);
        });
    }

    automaticReferenceArray(NumXHashMarks, NumYHashMarks) {
        if (typeof(NumXHashMarks) === 'number' && NumYHashMarks === undefined) { // option to include a single argument
            NumYHashMarks = NumXHashMarks;
        }
        if (NumXHashMarks === undefined) {NumXHashMarks = 6;}
        if (NumYHashMarks === undefined) {NumYHashMarks = 4;}
        NumXHashMarks += 1; // so that the origin does not count against it!
        NumYHashMarks += 1;
        if (NumXHashMarks < 2) {NumXHashMarks = 2;}
        if (NumYHashMarks < 2) {NumYHashMarks = 2;}
        let xInterval = (this.xMaxOnGraph - this.xMinOnGraph) / (NumXHashMarks  - 1);
        let yInterval = (this.yMaxOnGraph / this.yMultiplier - this.yMinOnGraph / this.yMultiplier) / (NumYHashMarks  - 1);
        let xReferenceArray = [];
        let yReferenceArray = [];
        let i, j;
        for (i = 0; i < NumXHashMarks; i++) {
            xReferenceArray.push(this.xMinOnGraph + i * xInterval);
        }
        for (j = 0; j < NumYHashMarks; j++) {
            yReferenceArray.push(this.yMinOnGraph / this.yMultiplier + j * yInterval);
        }
        this.addReferenceArray(xReferenceArray, yReferenceArray);
    }

    validatePoints(x1,y1,x2,y2) {
        try {
            if (x1 < this.xMinOnGraph || x1 > this.xMaxOnGraph) {throw "ERROR: Segment given out of range (x1)";}
            if (x2 < this.xMinOnGraph || x2 > this.xMaxOnGraph) {throw "ERROR: Segment given out of range (x2)";}
            if (y1 < this.yMinOnGraphOriginal || y1 > this.yMaxOnGraphOriginal) {throw "ERROR: Segment given out of range (y1)";}
            if (y2 < this.yMinOnGraphOriginal || y2 > this.yMaxOnGraphOriginal) {throw "ERROR: Segment given out of range (y2)";}
        }
        catch (err) {
            console.log(y1, this.yMinOnGraph, this.yMaxOnGraph);
            console.log(err);
            return false
        }
    }

    addSegmentAndTwoPoints(x1,y1,x2,y2) {
        this.validatePoints(x1,y1,x2,y2);
        let newSegment = super.addTwoPointsAndSegment(x1,y1 * this.yMultiplier,x2,y2 * this.yMultiplier);
        return newSegment
    }

    addSegmentWithArrowheadInCenter(x1,y1,x2,y2,arrowheadLength, arrowheadAngleInDegrees) {
        this.validatePoints(x1,y1,x2,y2);
        super.addSegmentWithArrowheadInCenter(new Point(x1,y1 * this.yMultiplier),new Point(x2,y2 * this.yMultiplier),arrowheadLength, arrowheadAngleInDegrees);
    }

    labelBetweenTwoPoints(x1,y1,x2,y2,labelAbove,labelBelow,textDisplacement, relativeFontSize) {
        this.validatePoints(x1,y1,x2,y2);
        super.labelLine(new Point(x1,y1 * this.yMultiplier),new Point(x2,y2 * this.yMultiplier),labelAbove,labelBelow,textDisplacement, relativeFontSize);
    }

    // used to add lines of text
    // replaces a previous function from before...
    addLinesNextToSegment(x1,y1,x2,y2,textArray,location,extraDisplacement,relativeFontSize, spacing) {
        super.addLinesNextToSegment(new Point(x1,y1 * this.yMultiplier), new Point(x2,y2 * this.yMultiplier), textArray,  location, extraDisplacement, relativeFontSize, spacing);
    }


    addPointAsACircle(x,y) {
        // doens't work, i think it might have something to do witht he fact that
        // in this function the new Point is declared here
        // but in the one above (which works) the new Point is decaled in the super function
        // but new points are declared here in many functinos of this class...a mystery
        // look at super.addCircle
        let centerPoint = new Point(x,y * this.yMultiplier);
        let newCircle = super.addCircle(centerPoint, this.pointRadius);
        newCircle.fill();
        return newCircle;
    }

    // adds a white circuit with a letter in it
    addLetterPoint(letter,x,y) {
        let centerPoint = new Point(x,y * this.yMultiplier);
        let newCircle = super.addCircle(centerPoint, this.pointRadius);
        newCircle.fillWhite();
        let newText = super.addText(letter, centerPoint, this.pointRadius * 1.7);
    }

    addSegmentWithCirclesOnEnds(x1,y1,x2,y2) {
        this.addSegmentAndTwoPoints(x1,y1,x2,y2);
        this.addPointAsACircle(x1,y1);
        this.addPointAsACircle(x2,y2);
    }

    // add a graph of a function
    addFunctionGraph(func, xMin, xMax) {
        let yMultipler = this.yMultiplier;
        let rescaledFunction = function(x) {
            return func(x) * yMultipler
        };
        super.addFunctionGraph(rescaledFunction, xMin, xMax);
    }

    addStepwiseLinearFunction(arrayOfPoints, circlesBoolean) {
        if (circlesBoolean === undefined) {circlesBoolean = true;}
        let k;
        for (k = 0; k < arrayOfPoints.length - 1; k++) {
            this.addSegmentAndTwoPoints(arrayOfPoints[k][0], arrayOfPoints[k][1], arrayOfPoints[k + 1][0], arrayOfPoints[k + 1][1]);
        }
        if (circlesBoolean) {
            arrayOfPoints.forEach((point) => {this.addPointAsACircle(point[0], point[1]);});
        }
    }

    // multiplies the y axis of the graph!
    multiplyGraph(factor) {

    }

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }

}
