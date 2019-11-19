
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
        super.addDashedLine(new Point(position, this.yMinOnGraph), new Point(position, this.yMaxOnGraph), 15);
        // function here
        // adds a vertical dotted line at this position on the axis
    }

    addYAxisReferenceLine(position) {
        super.addDashedLine(new Point(this.xMinOnGraph, position * this.yMultiplier), new Point(this.xMaxOnGraph, position * this.yMultiplier), 15);
        // function here
        // adds a horizontal dotted line at this position on the y axis
    }

    // an array of positions
    // at each position, adds a reference hash, a label, an a reference line
    addReferenceArray(xReferenceArray, yReferenceArray) {
        xReferenceArray.forEach((position) => {
            this.addXAxisHash(position, String(roundValue(position,2)), true);
            this.addXAxisReferenceLine(position);
        });
        yReferenceArray.forEach((position) => {
            this.addYAxisHash(position, String(roundValue(position,2)), true);
            this.addYAxisReferenceLine(position);
        });
    }

    automaticReferenceArray(NumXHashMarks, NumYHashMarks) {
        if (NumXHashMarks === undefined) {NumXHashMarks = 6;}
        if (NumYHashMarks === undefined) {NumYHashMarks = 4;}
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

    addSegmentAndTwoPoints(x1,y1,x2,y2) {
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

        let newSegment = super.addTwoPointsAndSegment(x1,y1 * this.yMultiplier,x2,y2 * this.yMultiplier);
        return newSegment
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

    addStepwiseFunction(arrayOfPoints, circlesBoolean) {
        if (circlesBoolean === undefined) {circlesBoolean = true;}
        let k;
        for (k = 0; k < arrayOfPoints.length - 1; k++) {
            this.addSegmentAndTwoPoints(arrayOfPoints[k][0], arrayOfPoints[k][1], arrayOfPoints[k + 1][0], arrayOfPoints[k + 1][1]);
        }
        if (circlesBoolean) {
            arrayOfPoints.forEach((point) => {this.addPointAsACircle(point[0], point[1]);});
        }
    }

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }

}



// different than quantiative graph!
// designed for graphs with no numbers!
class QualitativeGraph extends Diagram {
    constructor(yFunc, xMin, xMax, desiredAspectRatio, forcedYmin, forcedYmax) {
        super();

        if (desiredAspectRatio === undefined) {
            this.desiredAspectRatio = 1;
        } else {
            this.desiredAspectRatio = desiredAspectRatio;
        }
        if (xMax <= xMin) {
            console.log('ERROR: xMax must be greater than xMin for qualitative graph class');
        }


        // all xMin and xMax, and yMin and yMax have a 0 attached to prevent overlap with the
        // same variables in the funciton above
        this.xMin0 = xMin;
        this.xMax0 = xMax;

        this.func = yFunc;
        this.range = getRangeOfFunction(this.func, this.xMax0, this.xMin0);
        this.cutOffPossible = false; // if i force a particualr y value, i may need to cut the graph off after a point
        if (forcedYmin === undefined) {
            this.yMin0 = this.range.yMin;
        } else {
            this.yMin0 = forcedYmin;
        }
        if (forcedYmax === undefined) {
            this.yMax0 = this.range.yMax;
        } else {
            this.yMax0 = forcedYmax;
        }

        // quadrants that will be included in the graph
        if (this.xMax0 > 0 && this.yMax0 > 0) {
            this.quadrant1 = true;
        } else {
            this.quadrant1 = false;
        }

        if (this.xMin0 < 0 && this.yMax0 > 0) {
            this.quadrant2 = true;
        } else {
            this.quadrant2 = false;
        }

        if (this.xMin0 < 0 && this.yMin0 < 0) {
            this.quadrant3 = true;
        } else {
            this.quadrant3 = false;
        }

        if (this.xMax0 > 0 && this.yMax0 < 0) {
            this.quadrant4 = true;
        } else {
            this.quadrant4 = false;
        }

        // determine if the graph is always zero
        if (this.range.yMin === 0 && this.range.yMax === 0) {
            this.zeroGraph = true;
        } else {
            this.zeroGraph = false;
        }

        // determine if the graph is a constant value
        if (this.range.yMin === this.range.yMax) {
            this.constantGraph = true;
        } else {
            this.constantGraph = false;
        }

        // default values for labels
        this.xLabel = 'x';
        this.yLabel = 'y';
        this.xLabelPosition = 'end';
        this.yLabelPosition = 'end';
        this.setFontSize();
    }

    setFontSize() {
        this.relativeFontSize = (this.xMax0 - this.xMin0) * 0.1;
        this.textDisplacement = this.relativeFontSize * 0.7;
    }

    setLabels(xLabel, yLabel) {
        this.xLabel = xLabel;
        this.yLabel = yLabel;
    }

    setMultiplier() {
        this.yMultiplier = this.desiredAspectRatio * (this.xMin0 - this.xMax0)  / (this.yMin0 - this.yMax0);
    }



    /*
    Where will i put the labels?
    how will i
     */


    //    addTwoPointsAndSegment(x1, y1, x2, y2) {
    //     addFunctionGraph(func, xMin, xMax) {
    //  addText(letters, centerPoint, relativeFontSize, rotation) {

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        this.setMultiplier();
        super.addTwoPointsAndSegment(this.xMin0, 0, this.xMax0, 0);
        super.addTwoPointsAndSegment(0, this.yMultiplier * this.yMin0, 0, this.yMultiplier * this.yMax0);
        let correctedFunction = ((x) => this.func(x) * this.yMultiplier);
        super.addFunctionGraph(correctedFunction, this.xMin0, this.xMax0);

        if (this.xLabelPosition === 'end') {
            super.addText(this.xLabel, new Point(this.xMax0 + this.textDisplacement, 0), this.relativeFontSize);
        }
        // add an option if you want the label int he center
        if (this.yLabelPosition === 'end') {
            super.addText(this.yLabel, new Point(0, this.yMultiplier * this.yMax0 + this.textDisplacement), this.relativeFontSize);
        }
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }

    /// i need to add correction for aspect ratio
}

class QualitativeKinematicGraphSet {
    constructor() {
        this.timeArray = [];
        this.positionArray = [];
        this.velocityArray = [];
        this.accelerationArray = [];
    }

}

class MotionMap extends Diagram {
    constructor(positionFunction, tMin, tMax, numDots, direction) {
        super();
        if (direction === undefined) {direction = 0;}
        this.theta = processDirectionInput(direction);
        // can input a text, number, etc. and it tries to figure out the correct direction
        this.func = positionFunction;
        if (numDots === undefined) {numDots = 20;}
        this.numDots = numDots;
        this.tMin = tMin;
        this.tMax = tMax;
        this.tStep = (this.tMax - this.tMin) / this.numDots;

        this.positionValues = this.calculatePositionValues(this.numDots);
        this.positionPoints = this.calculatePositionPoints();

        this.radius = 0;
        this.setDefaultRadius();

        this.arrowStartPoint = undefined;
        this.arrowEndPoint = undefined;
        this.setArrow();

    }

    calculatePositionValues(numDots) {
        let positionValuesArray = [];
        let q, t, x;
        for (q = 0; q < numDots; q++) {
            t = this.tMin + this.tStep * q;
            x = this.func(t);
            positionValuesArray.push(x);
        }
        return positionValuesArray;
    }

    calculatePositionPoints() {
        let positionPoints = [];
        let q, magnitude;
        for (q = 0; q < this.positionValues.length; q++) {
            magnitude = this.positionValues[q];
            positionPoints.push(constructPointWithMagnitude(magnitude, this.theta));
        }
        return positionPoints;
    }

    setDefaultRadius() {
        let minSpaceBetween = Math.abs(this.positionValues[1] - this.positionValues[0]);
        let q;
        for (q = 1; q < this.positionValues.length; q++) {
            if (Math.abs(this.positionValues[q + 1] - this.positionValues[q]) < minSpaceBetween) {
                minSpaceBetween = Math.abs(this.positionValues[q + 1] - this.positionValues[q]);
            }
        }
        this.radius = minSpaceBetween / 4; // default radius
    }

    setRadius(newRadius) {
        this.radius = newRadius;
        this.setArrow();
    }

    multiplyRadius(factor) {
        this.setRadius(this.radius * factor);
    }

    setArrow() {
        let arrowStartPoint = this.positionPoints[0].interpolate(this.positionPoints[this.positionPoints.length - 1], 0.35);
        let arrowEndPoint = this.positionPoints[0].interpolate(this.positionPoints[this.positionPoints.length - 1], 0.65);
        let phi = arrowStartPoint.getPerpendicularAngle(arrowEndPoint);
        let translation = this.radius * 3;

        arrowStartPoint.translate(translation * Math.cos(phi), translation * Math.sin(phi));
        arrowEndPoint.translate(translation* Math.cos(phi), translation * Math.sin(phi));

        this.arrowStartPoint = arrowStartPoint;
        this.arrowEndPoint = arrowEndPoint;
    }


    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        let thisCircle;
        this.positionPoints.forEach((point) => {
            thisCircle = super.addCircle(point, this.radius);
            thisCircle.fill();
        });
        super.addArrow(this.arrowStartPoint, this.arrowEndPoint);
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }

}

class VelocityTimeGraph extends QuantitativeGraph {
    constructor(xMinOnGraph, xMaxOnGraph, yMinOnGraph, yMaxOnGraph, desiredAspectRatio) {
        super(xMinOnGraph, xMaxOnGraph, yMinOnGraph, yMaxOnGraph, desiredAspectRatio);
        this.timeUnit = 's';
        this.velocityUnit = 'm/s';
    }

    changeTimeUnit(newTimeUnit) {
        this.timeUnit = newTimeUnit;
    }

    changeVelocityUnit(newVelocityUnit) {
        this.velocityUnit = newVelocityUnit
    }

    addSegmentWithCirclesOnEnds(x1,y1,x2,y2) {
        super.addSegmentWithCirclesOnEnds(x1,y1,x2,y2);
    }

    addStepwiseFunction(arrayOfPoints) {
        super.addStepwiseFunction(arrayOfPoints, true);
    }

    // add a function called automate reference array
    automaticReferenceArray(NumXHashMarks, NumYHashMarks) {
        super.automaticReferenceArray(NumXHashMarks, NumYHashMarks);
    }

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        super.labelAxes(`time (${this.timeUnit})`, `velocity (${this.velocityUnit})`);
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }
}

/*
To do:
- add plus and minus signs to battery
- add meters
- add a line with current labeled
 */
class CircuitDiagram extends Diagram {
    constructor() {
        super();
        this.cursor = origin;
    }

    addNewPoint(x,y) {
        return super.addNewPoint(x,y);
    }

    // points must already exist?
    addWire(point1, point2) {
        let pointA = super.addExistingPoint(point1);
        let pointB = super.addExistingPoint(point2);
        let newWire = super.addSegment(pointA, pointB);
        return newWire
    }


    // should only be accessible within the addResistor function
    addZigZag(endPoint1, endPoint2, width) {
        let theta = endPoint1.getAngleToAnotherPoint(endPoint2);
        let L = endPoint1.getDistanceToAnotherPoint(endPoint2);
        let intermediatePoint1 = endPoint1.interpolate(endPoint2, 0.333333);
        intermediatePoint1.translate(width * Math.cos(theta + Math.PI / 2), width * Math.sin(theta + Math.PI / 2));
        let intermediatePoint2 = endPoint1.interpolate(endPoint2, 0.666667);
        intermediatePoint2.translate(width * Math.cos(theta - Math.PI / 2), width * Math.sin(theta - Math.PI / 2));
        this.addWire(endPoint1, intermediatePoint1);
        this.addWire(intermediatePoint1, intermediatePoint2);
        this.addWire(intermediatePoint2, endPoint2);
    }

    addResistor(endPoint1, endPoint2, labelAbove, labelBelow, width, numZigZags) {
        if (numZigZags === undefined) {
            numZigZags = 3;
        }
        let length = endPoint1.getDistanceToAnotherPoint(endPoint2);
        if (width === undefined) {
            width = length * 0.25;
        }
        let j;
        let startPoint = endPoint1, finishPoint;
        for (j = 0; j < numZigZags; j++) {
            finishPoint = endPoint1.interpolate(endPoint2, (j + 1) / numZigZags);
            this.addZigZag(startPoint, finishPoint, width);
            startPoint = finishPoint;
        }
        if (labelAbove !== undefined) {
            super.labelLineAbove(endPoint1, endPoint2, printResistance(labelAbove), width * 1.7, length * 0.35);
        }
        if (labelBelow !== undefined) {
            super.labelLineBelow(endPoint1, endPoint2, printResistance(labelBelow), width * 1.7, length * 0.35);
        }
    }

    ///I want to replace 'addListOfElements' with more of a cursor type program

    moveCursor(X, Y) {
        this.cursor = new Point(X, Y);
    }

    /// creates an element
    addElementWithCursor(elementType, endPointX, endPointY, labelAbove, labelBelow) {
        let nextPoint = new Point(endPointX, endPointY);
        if (elementType === 'wire') {
            this.addWire(this.cursor, nextPoint);
        } else if (elementType === 'resistor') {
            this.addResistor(this.cursor, nextPoint, labelAbove, labelBelow);
        } else if (elementType === 'battery') {
            this.addCell(this.cursor, nextPoint, labelAbove, labelBelow);
        }
        this.cursor = nextPoint;
        return true
    }

    labelElement(endPoint1, endPoint2, elementLength, elementWidth, labelAbove, labelBelow) {
        // could make it more DRY by adding a function here
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

    addCell(endPoint1, endPoint2, labelAbove, labelBelow, numBatteries, width) {
        if (numBatteries === undefined) {numBatteries = 2;}
        if (width === undefined) {width = endPoint1.getDistanceToAnotherPoint(endPoint2) * 1;} /// should be proportioned by numbatteries

        let length = endPoint1.getDistanceToAnotherPoint(endPoint2);
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



        // still need to add + and - signs on the cathode and anode
        if (labelAbove !== undefined) {
            super.labelLineAbove(endPoint1, endPoint2, printVoltage(labelAbove), width * 1.5, length * 0.35);
        }
        if (labelBelow !== undefined) {
            super.labelLineBelow(endPoint1, endPoint2, printVoltage(labelBelow), width * 1.5, length * 0.35);
        }

    }

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }
}

class FreeBodyDiagram extends Diagram {
    constructor() {
        super();
        this.forces = [];
        this.maxForce = 0;
        this.arrowheadAngle = 20; // in degrees
        this.circleRadius = 0;
        this.arrowheadLength = 0;
        this.relativeFontSize = 0;
        this.textDisplacement = 0;
        this.velocityArrow = undefined; // only one allowed
        this.overLapppingForceGroups = undefined;
    }

    setFontSize(newFontSize) {
        this.relativeFontSize = newFontSize;
        this.textDisplacement = this.relativeFontSize / 2;
    }

    /// i need to add a way to add velocity arrow

    // if force is vertical, label above will add Text on the left and label below will ad Text on the right
    addForce(relativeMagnitude,angleInRadians,labelAbove, labelBelow) {
        if (this.maxForce < relativeMagnitude) {this.maxForce = relativeMagnitude;}
        let endPoint = new Point(relativeMagnitude * Math.cos(angleInRadians), relativeMagnitude * Math.sin(angleInRadians));
        this.forces.push(
            {
                "relativeMagnitude": relativeMagnitude,
                "angle": angleInRadians,
                "labelAbove": printForce(labelAbove),
                "labelBelow": printForce(labelBelow),
                "startPoint": origin,
                "endPoint": endPoint
            }
        ); // the printForce function will print as is if it is a string or print with the unit if it is a number
    };

    addVelocityArrow(angleInRadians, labelAbove, labelBelow, location) {
        if (location === undefined) {location = 'upperRight';}
        if (labelAbove === undefined) {labelAbove = 'velocity';}
        if (labelBelow === undefined) {labelBelow = '';}
        this.velocityArrow = {
            "angle": angleInRadians,
            "labelAbove": labelAbove,
            "labelBelow": labelBelow,
            "location": location,
        }
    }

    /// i need to add some function so that the label does not get covered by the dot!

    // if two forces are a very similar direction, they need to be displaced so that they do not overlap
    // first dvide forces ni
    identifyOverlappingForces() {
        const displacementMin = convertDegreesToRadians(15); // will act on all forces less than 15 degrees apart
        // determine if any forces are close to each other
        let overlappingForceGroups = [], forcesAlreadyAccountedFor = [];
        let i, j, thisForce, thatForce, nextOverlappingForceGroup;
        for (i = 0; i < this.forces.length; i++) {
            if (!isXinArray(i, forcesAlreadyAccountedFor)) {
                nextOverlappingForceGroup = [i];
                forcesAlreadyAccountedFor.push(i);
                thisForce = this.forces[i];
                for (j = i + 1; j < this.forces.length; j++) {
                    if (!isXinArray(j, forcesAlreadyAccountedFor)) {
                        thatForce = this.forces[j];
                        if (Math.abs(thisForce.angle - thatForce.angle) <= displacementMin) {
                            nextOverlappingForceGroup.push(j);
                            forcesAlreadyAccountedFor.push(j);
                        }
                    }
                }
                overlappingForceGroups.push(nextOverlappingForceGroup);
            }
        }
        this.overLapppingForceGroups = overlappingForceGroups;
        return overlappingForceGroups
    }

    displaceOverlappingForces() {
        let N;
        let thetaSum, thetaAverage, phi;
        const displacementRange = this.circleRadius / 2; /// they will displace over this range
        console.log(displacementRange);
        let displacementMagnitudes;
        this.overLapppingForceGroups.forEach((group) => {
            N = group.length;
            if (N === 1) {
                // pass
            } else {
                displacementMagnitudes = NpointsEvenlySpacedInARange(N, -1 * displacementRange, displacementRange);
                if (this.relativeFontSize > displacementMagnitudes[1] - displacementMagnitudes[0]) {  // if the labels will overlap each other
                    this.setFontSize((displacementMagnitudes[1] - displacementMagnitudes[0] * 0.6)); // reduce size of the labels
                }
                thetaSum = 0;
                group.forEach((index) => {
                    thetaSum += this.forces[index].angle;
                });
                thetaAverage = thetaSum / N;
                phi = thetaAverage + Math.PI / 2;

                let thisForce, newStartPoint, newEndPoint;
                group.forEach((index) => {
                    thisForce = this.forces[index];
                    newStartPoint = thisForce.startPoint.transformAndReproduce(phi, displacementMagnitudes[index], 0);
                    newEndPoint = thisForce.endPoint.transformAndReproduce(phi, displacementMagnitudes[index], 0);
                    thisForce.startPoint = newStartPoint;
                    thisForce.endPoint = newEndPoint;
                });
            }
        });
    }

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        if (this.forces.length === 0) {
            this.maxForce = 1; // so that a diagram can still be created with zero forces
        }
        this.circleRadius = this.maxForce * 0.1;
        this.arrowheadLength = this.maxForce * 0.05;
        this.setFontSize(this.maxForce * 0.1);


        this.forces.forEach((force) => {
            force.startPoint = constructPointWithMagnitude(this.circleRadius, force.angle);
        });

        this.identifyOverlappingForces();
        this.displaceOverlappingForces();

        // do i want forces to emanate from the edge of the circle, not its center???
        this.forces.forEach((force) => {
            super.addArrow(force.startPoint,force.endPoint,this.arrowheadLength,this.arrowheadAngle);
            super.labelLine(force.startPoint, force.endPoint, force.labelAbove, force.labelBelow, this.textDisplacement, this.relativeFontSize);
        });


        if (this.velocityArrow) { // add an arrow, seperate from the free-body diagram, indicating velocity of an object
            let velocityArrowStartPoint;
            if (this.velocityArrow.location === 'upperRight') { // this method can make the velocity kind of far away
                velocityArrowStartPoint = new Point(this.maxForce * 1.1, this.maxForce * 1.1);
            } else if (this.velocityArrow.location === 'lowerRight') {
                velocityArrowStartPoint = new Point(this.maxForce * 1.1, this.maxForce * -1.1);
            } else if (this.velocityArrow.location === 'lowerLeft') {
                velocityArrowStartPoint = new Point(this.maxForce * -1.1, this.maxForce * -1.1);
            } else if (this.velocityArrow.location === 'upperLeft') {
                velocityArrowStartPoint = new Point(this.maxForce * -1.1, this.maxForce * 1.1);
            } else {
                console.log('ERROR: invalid velocity arrow location given');
                velocityArrowStartPoint = origin
            }
            let velocityArrowLength = this.maxForce * 0.5;
            let velocityArrowEndPoint = velocityArrowStartPoint.getAnotherPointWithTrig(velocityArrowLength, this.velocityArrow.angle);
            super.addArrow(velocityArrowStartPoint, velocityArrowEndPoint);
            super.labelLine(velocityArrowStartPoint, velocityArrowEndPoint, this.velocityArrow.labelAbove, this.velocityArrow.labelBelow, this.textDisplacement, this.relativeFontSize);
        }
        let centerCircle = super.addCircle(origin, this.circleRadius,true);
        centerCircle.fill();
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }


}

class SpringProblem extends Diagram {
    constructor() {
        super();
    }


    // add a single zigzag
    addZigZag(endPoint1, endPoint2, width) {
        let pointA = endPoint1.interpolate(endPoint2,0.25);
        let pointB = endPoint1.interpolate(endPoint2, 0.75);
        let phi = endPoint1.getPerpendicularAngle(endPoint2);
        pointA.translate(width * Math.cos(phi), width * Math.sin(phi));
        pointB.translate(width * Math.cos(phi + Math.PI), width * Math.sin(phi + Math.PI));

        super.addSegment(endPoint1, pointA);
        super.addSegment(pointA, pointB);
        super.addSegment(pointB, endPoint2);
    }

    // add draw spring function!
    addSpring(endPoint1, endPoint2, width, numZigZags, proportionNotZigZag) {
        if (width === undefined) {width = endPoint1.getDistanceToAnotherPoint(endPoint2) * 0.2;}
        if (numZigZags === undefined) {numZigZags = 6;}
        if (proportionNotZigZag === undefined) {proportionNotZigZag = 0.1;}

        let pointA = endPoint1.interpolate(endPoint2, proportionNotZigZag / 2);
        let pointB = endPoint1.interpolate(endPoint2, 1 - proportionNotZigZag / 2);

        super.addSegment(endPoint1, pointA);

        let i, nextStartPoint = pointA, nextEndPoint;
        for (i = 0; i < numZigZags; i++) {
            nextEndPoint = endPoint1.interpolate(endPoint2, (1 - proportionNotZigZag) / numZigZags * (i + 1) + proportionNotZigZag / 2 );
            this.addZigZag(nextStartPoint, nextEndPoint, width);
            nextStartPoint = nextEndPoint;
        }

        super.addSegment(pointB, endPoint2);

        let springObject = {
            "endPoint1": endPoint1,
            "endPoint2": endPoint2,
            "width": width
        };
        return springObject
    }

    labelSpring(springObject, text, relativeFontSize) {
        if (relativeFontSize === undefined) {relativeFontSize = 0.7 * springObject.width;}
        super.labelLine(springObject.endPoint1, springObject.endPoint2, text, '', springObject.width * 1.5, relativeFontSize);
    }


}

// in the future
// i need to make this so that i can change it without creating a new object
class HorizontalSpringProblem extends SpringProblem {
    constructor(equilibirumLength, massBoolean, springWidth) {
        super();
        if (springWidth === undefined) {springWidth = equilibirumLength * 0.2;}
        this.equilibriumLength = equilibirumLength;
        this.massBoolean = massBoolean;
        this.springWidth = springWidth;

        //  super.addSpring(origin, new Point(equilibirumLength, 0));

        this.maxCanvasWidth = 300;
        this.maxCanvasHeight = 300;

        this.corner = new Point(0, -1 * this.springWidth);
        this.wallTop = new Point(0, this.springWidth * 2);
        this.floorEnd = new Point(equilibirumLength * 2, -1 * this.springWidth);

        this.wall = super.addSegment(this.corner, this.wallTop);
        this.floor = super.addSegment(this.corner, this.floorEnd);

        // default spring length is the
        this.springLength = this.equilibriumLength;
        this.springEndPoint = new Point(0, this.springLength);

        this.mass = undefined;

    }

    setCanvasWidthAndHeight(maxCanvasWidth, maxCanvasHeight) {
        this.maxCanvasWidth = maxCanvasWidth;
        this.maxCanvasHeight = maxCanvasHeight;
    }

    // sets the spring length to be the length of the spring
    stretchSpringAbsolute(newSpringLength) {
        let xTranslation = newSpringLength - this.springLength;
        this.springLength = newSpringLength;
        this.springEndPoint = new Point(this.springLength, 0);
        // if (this.mass) {
        //         //     this.mass.lowerLeft.translate(xTranslation, 0);
        //         //     this.mass.upperLeft.translate(xTranslation, 0);
        //         //     this.mass.lowerRight.translate(xTranslation, 0);
        //         //     this.mass.upperRight.translate(xTranslation, 0);
        //         // }
    }

    addMass() {
        this.mass = super.addRectangleFromCenter(this.springEndPoint.x + this.springWidth, 0, this.springWidth * 2, this.springWidth * 2);
    }


    // relativeLength = 1 will return an arrow with the same length as the mass;
    addVelocityArrow(direction, label, relativeLength) {
        let length = this.springWidth * 2 * relativeLength;
        let textDisplacement = this.springWidth * 0.7;
        let relativeFontSize = this.springWidth * 0.7;
        let arrowCenterPoint = new Point(this.springEndPoint.x + this.springWidth, this.springWidth * 1.5);
        let arrowBackPoint;
        let arrowFrontPoint;
        if (direction === 'right') {
            arrowFrontPoint = new Point(arrowCenterPoint.x + length / 2, arrowCenterPoint.y);
            arrowBackPoint = new Point(arrowCenterPoint.x - length / 2, arrowCenterPoint.y);
        } else if (direction === 'left') {
            arrowFrontPoint = new Point(arrowCenterPoint.x - length / 2, arrowCenterPoint.y);
            arrowBackPoint = new Point(arrowCenterPoint.x + length / 2, arrowCenterPoint.y);
        }
        super.addArrow(arrowBackPoint, arrowFrontPoint, this.springWidth * 0.6);
        super.labelLineAbove(arrowBackPoint, arrowFrontPoint, label, textDisplacement, relativeFontSize);
    }

    drawCanvas(springLength, springLabel, arrowDirection, arrowLabel, arrowRelativeLength) {
        this.stretchSpringAbsolute(springLength);
        if (this.massBoolean) {
            this.addMass();
        }
        let theSpring = super.addSpring(origin, this.springEndPoint, this.springWidth);
        if (springLabel) {
            super.labelSpring(theSpring, springLabel);
        }
        if (arrowDirection && arrowLabel && arrowRelativeLength) {
            this.addVelocityArrow(arrowDirection, arrowLabel, arrowRelativeLength);
        }
        return super.drawCanvas(this.maxCanvasWidth, this.maxCanvasHeight);
    }

}

class UnitMap extends Diagram {
    constructor() {
        super();
        this.pods = {};
        this.radius = 1;
        this.horizontalSpaceBetween = 1;
        this.verticalSpaceBetween = 1;
    }

    addPod(key, letter, level, horizontalPosition, prerequisites, score) {
        let x, y, newPod;
        if (score === undefined) {score = 0;}
        let fillColor = grayscale0to20(score);
        let textColor = "#000000"; // text is black if score is 10 or less and white if 10 or more
        if (score > 10) {textColor = "#FFFFFF";}
        newPod =
            {
                "letter": letter,
                "level": level,
                "horizontalPosition": horizontalPosition,
                "prerequisites": prerequisites,
                "fillColor": fillColor,
                "textColor": textColor
            };
        x = (horizontalPosition - 1) * (this.horizontalSpaceBetween + this.radius * 2);
        y = (level - 1) * (this.verticalSpaceBetween + this.radius * 2);
        newPod.center = new Point(x,y);

        this.pods[key] = newPod;

        let podCircle = super.addCircle(newPod.center,this.radius);
        let podText = super.addText(letter, newPod.center, this.radius * 1.3);
        podText.setColor(newPod.textColor);
        podCircle.setFillColor(newPod.fillColor);
        podCircle.fill();

        return this.pods[key];
    };

    searchForPod(podKey) {
        if (isXinArray(podKey,Object.keys(this.pods))) {
            return this.pods[podKey]
        } else {
            return false
        }
    }

    // draws a segement between two existing pods
    connectTwoPods(podKey1, podKey2) {
        let pod1 = this.searchForPod(podKey1);
        let pod2 = this.searchForPod(podKey2);
        if (pod1 && pod2) {
            // add something that stops it if the podKey cannot be find
            let theta = this.pods[podKey1].center.getAngleToAnotherPoint(this.pods[podKey2].center);
            let startPoint = this.pods[podKey1].center.getAnotherPointWithTrig(this.radius, theta);
            let endPoint = this.pods[podKey2].center.getAnotherPointWithTrig(this.radius, theta + Math.PI);
            let newSegment = super.addSegmentWithArrowheadInCenter(startPoint, endPoint, this.horizontalSpaceBetween * 0.4, 30);
            newSegment.setThickness(2);
            return newSegment
        } else {
            return false
        }
    };


    // function to add segments between all pods and prerequisite pods
    connectPrerequisites() {
        Object.keys(this.pods).forEach((podKey) => {
            let thisPod = this.pods[podKey];
            thisPod.prerequisites.forEach((preReq) => {
                this.connectTwoPods(preReq, podKey);
            });
        });
    }

    getMaxLevel() {
        let currentMaxLevel = 0;
        Object.keys(this.pods).forEach((podKey) => {
            if (this.pods[podKey].level > currentMaxLevel) {currentMaxLevel = this.pods[podKey].level;}
        });
        return currentMaxLevel
    }

    getMaxHorizontalPosition() {
        let currentMaxHorizontalPosition = 0;
        Object.keys(this.pods).forEach((podKey) => {
            if (this.pods[podKey].level > currentMaxHorizontalPosition) {currentMaxHorizontalPosition = this.pods[podKey].level;}
        });
        return currentMaxHorizontalPosition
    }

}
