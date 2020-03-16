
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
    addLinesRightOfSegment(x1,y1,x2,y2,textArray,relativeFontSize, spacing) {
        super.addLinesRightOfSegment(new Point(x1,y1 * this.yMultiplier), new Point(x2,y2 * this.yMultiplier), textArray, relativeFontSize, spacing);
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


        this.simpleFunctionGraph = undefined;
        this.stepWiseFunctionObjectGraph = undefined;
        this.yFuncMin = undefined;
        this.yFuncMax = undefined;

        this.pointsOnGraph = [];

        // all xMin and xMax, and yMin and yMax have a 0 attached to prevent confusion with the
        // min and max values of th the function

        this.func = yFunc;
        if (typeof(this.func) === "function" ) { // simple graph
            this.simpleFunctionGraph = true;

            this.range = getRangeOfFunction(this.func, xMin, xMax);
            this.yFuncMin = this.range.yMin;
            this.yFuncMax = this.range.yMax;

        } else if (typeof(this.func) === "object" && yFunc.stepwiseFunctionObject) {
            this.stepWiseFunctionObjectGraph = true;
            this.yFuncMin = yFunc.yMin;
            this.yFuncMax = yFunc.yMax;
            if (xMin === undefined) {
                xMin = this.func.xMin; // if using a stepwise function object, automatic x minimums are allowed
            }
            if (xMax === undefined) {
                xMax = this.func.xMax;
            }
        }
        this.xMin0 = xMin;
        this.xMax0 = xMax;



        // if y has forced values
        this.Yforced = false;
        if (forcedYmin === undefined) {
            this.yMin0 = this.yFuncMin;
        } else {
            this.yMin0 = forcedYmin;
            this.Yforced = true;
        }
        if (forcedYmax === undefined) {
            this.yMax0 = this.yFuncMax;
        } else {
            this.yMax0 = forcedYmax;
            this.Yforced = true;
        }

        this.zeroLabel = false;

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

        if (this.xMax0 > 0 && this.yMin0 < 0) {
            this.quadrant4 = true;
        } else {
            this.quadrant4 = false;
        }



        if (this.quadrant1 && this.quadrant4) {
            this.addZeroLabel();
        }

        // determine if the graph is always zero
        if (this.yFuncMin === 0 && this.yFuncMax === 0) {
            this.zeroGraph = true;
            this.addZeroLabel();
        } else {
            this.zeroGraph = false;
        }

        // determine if the graph is a constant value
        if (this.yFuncMin === this.yFuncMax) {
            this.constantGraph = true;
        } else {
            this.constantGraph = false;
        }

        // ends of axes
        this.leftEndHorizontal = undefined;
        this.rightEndHorizontal = undefined;
        this.topEndVertical = undefined;
        this.bottomEndVertical = undefined;


        /// i think there's lots of unnecessary cod ein this part
        if (this.Yforced) {
            this.setMultiplier();
            this.bottomEndVertical = new Point(0, this.yMin0 * this.yMultiplier);
            this.leftEndHorizontal = new Point(this.xMin0, 0);
            this.topEndVertical = new Point(0, this.yMax0 * this.yMultiplier);
            this.rightEndHorizontal = new Point(this.xMax0, 0);
        } else {
            if (this.quadrant1 && !this.quadrant2 && !this.quadrant3 && !this.quadrant4) {
                this.xMin0 = 0;
                this.yMin0 = 0;
                this.setMultiplier();
                // quadrant 1 only
                this.bottomEndVertical = origin;
                this.leftEndHorizontal = origin;
                this.topEndVertical = new Point(0, this.yMax0 * this.yMultiplier);
                this.rightEndHorizontal = new Point(this.xMax0, 0);
            } else if (this.quadrant2 && !this.quadrant1 && !this.quadrant3 && !this.quadrant4) {
                // quadrant 2 only
                this.xMax0 = 0;
                this.yMin0 = 0;
                this.setMultiplier();

                this.bottomEndVertical = origin;
                this.leftEndHorizontal = new Point(this.xMin0, 0);
                this.topEndVertical = new Point(0, this.yMax0 * this.yMultiplier);
                this.rightEndHorizontal = origin;
            } else if (this.quadrant3 && !this.quadrant1 && !this.quadrant2 && !this.quadrant4) {
                // quadrant 3 only
                this.xMax0 = 0;
                this.yMax0 = 0;
                this.setMultiplier();

                this.bottomEndVertical = new Point(0,this.yMin0 * this.yMultiplier);
                this.leftEndHorizontal = new Point(this.xMin0, 0);
                this.topEndVertical = origin;
                this.rightEndHorizontal = origin
            } else if (this.quadrant4 && !this.quadrant1 && !this.quadrant2 && !this.quadrant3) {
                // quadrant 4 only
                this.xMin0 = 0;
                this.yMax0 = 0;
                this.setMultiplier();

                this.bottomEndVertical = new Point(0,this.yMin0 * this.yMultiplier);
                this.leftEndHorizontal = origin;
                this.topEndVertical = origin;
                this.rightEndHorizontal = new Point(this.xMax0, 0);
            } else if (this.quadrant1 && this.quadrant2 && !this.quadrant3 && !this.quadrant4) {
                // quadrants 1 and 2
                this.yMax0 = 0;
                this.setMultiplier();

                this.bottomEndVertical = origin;
                this.leftEndHorizontal = new Point(this.xMin0, 0);
                this.topEndVertical = new Point(0, this.yMax0 * this.yMultiplier);
                this.rightEndHorizontal = new Point(this.xMax0, 0);
            } else if (this.quadrant3 && this.quadrant4 && !this.quadrant1 && !this.quadrant2) {
                // quadrants 3 and 4
                this.yMax0 = 0;
                this.setMultiplier();

                this.bottomEndVertical = new Point(0, this.yMin0 * this.yMultiplier);
                this.leftEndHorizontal = new Point(this.xMin0, 0);
                this.topEndVertical = origin;
                this.rightEndHorizontal = new Point(this.xMax0, 0);
            } else if (this.quadrant1 && this.quadrant4 && !this.quadrant2 && !this.quadrant3) {
                // quadrants 1 and 4
                this.xMin0 = 0;
                this.setMultiplier();

                this.bottomEndVertical = new Point(0, this.yMin0 * this.yMultiplier);
                this.leftEndHorizontal = origin;
                this.topEndVertical = new Point(0, this.yMax0 * this.yMultiplier);
                this.rightEndHorizontal = new Point(this.xMax0, 0);
            } else if (this.quadrant2 && this.quadrant3 && !this.quadrant1 && !this.quadrant4) {
                // quadrants 2 and 3
                this.xMax0 = 0;
                this.setMultiplier();

                this.bottomEndVertical = new Point(0, this.yMin0 * this.yMultiplier);
                this.leftEndHorizontal = new Point(this.xMin0, 0);
                this.topEndVertical = new Point(0, this.yMax0 * this.yMultiplier);
                this.rightEndHorizontal = origin;
            } else {
                this.setMultiplier();
                this.bottomEndVertical = new Point(0, this.yMin0 * this.yMultiplier);
                this.leftEndHorizontal = new Point(this.xMin0, 0);
                this.topEndVertical = new Point(0, this.yMax0 * this.yMultiplier);
                this.rightEndHorizontal = new Point(this.xMax0, 0);
            }
        }

        // corners
        this.lowerLeft = new Point(this.leftEndHorizontal.x, this.bottomEndVertical.y);
        this.upperLeft = new Point(this.leftEndHorizontal.x, this.topEndVertical.y);
        this.lowerRight = new Point(this.rightEndHorizontal.x, this.bottomEndVertical.y);
        this.upperRight = new Point(this.rightEndHorizontal.x, this.topEndVertical.y);


        this.horizontalAxis = true;

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

    labelAxes(xLabel, yLabel) {
        this.xLabel = xLabel;
        this.yLabel = yLabel;
    }

    setMultiplier() {
        this.yMultiplier = ( (this.xMax0 - this.xMin0) / (this.yMax0 - this.yMin0) ) / this.desiredAspectRatio ;
        // desired aspect ratio divided by current aspect ratio
    }


    addPointOnGraph(x,y,type) {
      if (type === undefined) {
        type = 'defined';
      }
      this.pointsOnGraph.push({
        x: x,
        y: y,
        type: type
      });
    }

    addDefinedPoint(x,y) {
      this.addPointOnGraph(x,y);
    }

    addUndefinedPoint(x,y) {
      this.addPointOnGraph(x,y,'undefined');
    }

    moveLabelsToEnd() {
        this.xLabelPosition = 'end';
        this.yLabelPosition = 'end';
    }

    moveLabelsToSide() {
        this.xLabelPosition = 'side';
        this.yLabelPosition = 'side';
    }

    turnIntoPositionGraph(dimension) {
      if (dimension === undefined) {dimension = 'x';}
      this.labelAxes('t',`${dimension}(t)`);
    }

    turnIntoVelocityGraph(dimension) {
      let yLabel;
      if (dimension === undefined) {
        yLabel = 'v(t)';
      } else {
        yLabel = `v_${dimension}(t)`;
      }
      this.labelAxes('t', yLabel);
    }

    turnIntoAccelerationGraph(dimension) {
      let yLabel;
      if (dimension === undefined) {
        yLabel = 'a(t)';
      } else {
        yLabel = `a_${dimension}(t)`;
      }
      this.labelAxes('t',yLabel);
    }

    /*
    I need some way to add the x-axis as a dotted line
    and to label a single point as zero
    first a break!
     */

    addZeroLabel() {
        this.zeroLabel = true;
    }
    removeZeroLabel() {
        this.zeroLabel = false;
    }

    removeHorizontalAxis() {
        this.horizontalAxis = false;
    }

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        // add four corners as points
        super.addExistingPoint(this.lowerRight);
        super.addExistingPoint(this.lowerLeft);
        super.addExistingPoint(this.upperRight);
        super.addExistingPoint(this.upperLeft);

        this.setMultiplier();

        // vertical axies
        super.addSegment(this.topEndVertical, this.bottomEndVertical);
        if (this.horizontalAxis) {
            super.addSegment(this.leftEndHorizontal, this.rightEndHorizontal);
        }
        if (this.zeroLabel) {
            this.textDisplacement *= 3;
            super.addText('0', new Point(this.xMin0 - this.textDisplacement/2, 0), this.relativeFontSize);
            super.addDashedLine(new Point(this.xMin0, 0), new Point(this.xMax0, 0));
        }

        if (this.xLabelPosition === 'end') {
            super.addText(this.xLabel, new Point(this.xMax0 + this.textDisplacement, 0), this.relativeFontSize);
        } else if (this.xLabelPosition === 'side') {
            super.labelLineBelow(this.lowerLeft, this.lowerRight, this.xLabel, this.textDisplacement, this.relativeFontSize);
        }
        // add an option if you want the label int he center
        if (this.yLabelPosition === 'end') {
            super.addText(this.yLabel, new Point(0, this.yMultiplier * this.yMax0 + this.textDisplacement), this.relativeFontSize);
        } else if (this.yLabelPosition === 'side') {
            super.labelLineAbove(this.lowerLeft, this.upperLeft, this.yLabel, this.textDisplacement, this.relativeFontSize);
        }

        let pointRadius = minOfTwoValues(this.lowerRight.x - this.lowerLeft.x, this.upperRight.y - this.lowerRight.y) * 0.05;

        this.pointsOnGraph.forEach((point) => {
          let newCircle = super.addCircle(new Point(point.x, point.y * this.yMultiplier), pointRadius);
          if (point.type === 'defined') {
            newCircle.fill();
          }
        });

        // graph the actual function
        if (this.simpleFunctionGraph) { // just graphing a normal function
            let correctedFunction = ((x) => {
                return this.func(x) * this.yMultiplier});
            if (this.Yforced) {
                super.addFunctionGraph(correctedFunction, this.xMin0, this.xMax0, this.yMin0, this.yMax0);
            } else {
                super.addFunctionGraph(correctedFunction, this.xMin0, this.xMax0);
            }
        } else if (this.stepWiseFunctionObjectGraph) { // graphing a stepwise function object
            if (this.Yforced) {
                this.func.addToDiagram(this, this.yMultiplier,(this.xMax0 - this.xMin0) * 0.03, this.yMin0, this.yMax0);
            } else {
                this.func.addToDiagram(this, this.yMultiplier, (this.xMax0 - this.xMin0) * 0.03);
            }
        }

        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }

    /// i need to add correction for aspect ratio
}


class MotionMap extends Diagram {
    constructor(positionFunction, tMin, tMax, numDots, direction, forcedRadius) {
        super();

        if (typeof(positionFunction) === 'function') {
            this.type = 'simpleFunction';
            this.simpleFunction = true;
            this.func = positionFunction;
        } else if (typeof(positionFunction) === 'object' && positionFunction.stepwiseFunctionObject) {
            this.type = 'stepwiseFunctionObject';
            this.simpleFunction = false;
            this.stepwiseFunctionObject = true;
            this.func = positionFunction.getFunction();
        }

        if (direction === undefined) {direction = 0;}
        this.theta = processDirectionInput(direction);
        // can input a text, number, etc. and it tries to figure out the correct direction
        this.tMin = tMin;
        this.tMax = tMax;
        this.constantFunction = false;
        if (isItAConstantFunction(this.func, this.tMin, this.tMax)) {
            this.constantFunction = true;
        }


        if (numDots === undefined) {numDots = 10;}
        this.numDots = numDots;

        this.tStep = (this.tMax - this.tMin) / this.numDots;

        this.positionValues = this.calculatePositionValues(this.numDots);
        this.positionPoints = this.calculatePositionPoints();

        this.radius = 0;
        if (forcedRadius !== undefined) {
            this.radius = forcedRadius;
        } else {
            this.setDefaultRadius();
        }

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
        if (this.constantFunction) {
            this.radius = 1;
        } else {
            let minSpaceBetween = Math.abs(this.positionValues[1] - this.positionValues[0]);
            let q;
            for (q = 1; q < this.positionValues.length; q++) {
                if (Math.abs(this.positionValues[q + 1] - this.positionValues[q]) < minSpaceBetween) {
                    minSpaceBetween = Math.abs(this.positionValues[q + 1] - this.positionValues[q]);
                }
            }
            this.radius = minSpaceBetween / 4; // default radius
        }
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
        if (this.constantFunction) {
            let circle = super.addCircle(origin, this.radius);
            circle.fill();
            super.addNewPoint(10,0);
            super.addNewPoint(0,2);
            super.addNewPoint(-10,0);
            super.addNewPoint(0,-2);
        } else {
            this.positionPoints.forEach((point) => {
                thisCircle = super.addCircle(point, this.radius);
                thisCircle.fill();
            });
            super.addArrow(this.arrowStartPoint, this.arrowEndPoint);
        }
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

    addStepwiseLinearFunction(arrayOfPoints) {
        super.addStepwiseLinearFunction(arrayOfPoints, true);
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


class Compass extends Diagram {
  constructor(horizontalBoolean, verticalBoolean) {
    super();
    if (horizontalBoolean === undefined) {
      horizontalBoolean = true;
    }
    if (verticalBoolean === undefined) {
      verticalBoolean = true;
    }
      this.horizontal = horizontalBoolean;
      this.vertical = verticalBoolean
      this.thetaInDegrees = 0;

      this.northLabel = 'N';
      this.eastLabel = 'E';
      this.southLabel = 'S';
      this.westLabel = 'W';

      this.dashed = false;
  }

  setNorthLabel(newLabel) {
    this.northLabel = newLabel;
  }
  setEastLabel(newLabel) {
    this.eastLabel = newLabel;
  }
  setSouthLabel(newLabel) {
    this.southLabel = newLabel;
  }
  setWestLabel(newLabel) {
    this.westLabel = newLabel;
  }

  setAllLabels(north, east, south, west) {
    this.setNorthLabel(north);
    this.setEastLabel(east);
    this.setSouthLabel(south);
    this.setWestLabel(west);
  }

  turnIntoCoordinateAxes() {
    this.setAllLabels('+y','+x','-y','-x');
  }

  makeDashed() {
    this.dashed = true;
  }

  makeSolid() {
    this.dashed = false;
  }

  drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
    let relativeFontSize = 0.3;
    let textDisplacement = relativeFontSize * 0.7

    if (this.horizontal) {
      super.addTwoHeadedArrow(new Point(-1,0), new Point(1,0));
      super.addText(this.westLabel,new Point(-1 - textDisplacement ,0), relativeFontSize);
      super.addText(this.eastLabel, new Point(1 + textDisplacement, 0), relativeFontSize);
    }
    if (this.vertical) {
      super.addTwoHeadedArrow(new Point(0,-1), new Point(0,1));
      super.addText(this.southLabel, new Point(0, -1 - textDisplacement), relativeFontSize);
      super.addText(this.northLabel, new Point(0, 1 + textDisplacement), relativeFontSize);
    }

    return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
  }

  addToDiagram(diagram, centerPoint, length) {
    // function to add the object to an existing diagram?
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
        let displacementMagnitudes;
        this.overLapppingForceGroups.forEach((group) => {
            N = group.length;
            if (N === 1) {
                // pass
            } else {
                displacementMagnitudes = NpointsEvenlySpacedInARange(N, -1 * displacementRange, displacementRange);
                if (this.relativeFontSize > (displacementMagnitudes[1] - displacementMagnitudes[0])*0.85) {  // if the labels will overlap each other
                    this.setFontSize((displacementMagnitudes[1] - displacementMagnitudes[0] * 0.85)); // reduce size of the labels
                }
                thetaSum = 0;
                group.forEach((index) => {
                    thetaSum += this.forces[index].angle;
                });
                thetaAverage = thetaSum / N;
                phi = thetaAverage + Math.PI / 2;

                let thisForce, newStartPoint, newEndPoint, counter =0;
                group.forEach((index) => {
                    thisForce = this.forces[index];
                    newStartPoint = thisForce.startPoint.transformAndReproduce(phi, displacementMagnitudes[counter], 0);
                    newEndPoint = thisForce.endPoint.transformAndReproduce(phi, displacementMagnitudes[counter], 0);
                    counter++;
                    thisForce.startPoint = newStartPoint;
                    thisForce.endPoint = newEndPoint;
                });
            }
        });
    }

    countMaxOverlappingForces() {
      let max = 0;
      this.overLapppingForceGroups.forEach((group) => {
        if (group.length > max) {
          max = group.length;
        }
      });
      return max;
    }


    /// adds all the points etc.
    createDiagramObject() {
        if (this.forces.length === 0) {
            this.maxForce = 1; // so that a diagram can still be created with zero forces
        }
        this.identifyOverlappingForces();
        const maxGroupSize = this.countMaxOverlappingForces();

        this.circleRadius = this.maxForce * 0.1 * maxGroupSize;
        this.arrowheadLength = this.maxForce * 0.05;
        this.setFontSize(this.maxForce * 0.1);


        this.forces.forEach((force) => {
            force.startPoint = constructPointWithMagnitude(this.circleRadius, force.angle);
        });

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

    }

    /// create an option force all force arrows to have the same length;
    // regardless of relative magnitude....
    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        this.createDiagramObject();
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }

    drawWithoutCreatingObject(maxWidth, maxHeight, unit, wiggleRoom) {
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }
}


/// this should be combined with the block problem area!
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

// global variable total number of forces
let totalNumberOfVectors = 0;

// axis rotation boolean
// determines if the vector rotates when the axis rotate
class Vector {
    constructor(name, relativeMagnitude, label, angleInDegrees, startPoint, relativeAngleBoolean) {
        if (name === undefined) {
            name = numberToLetter(totalNumberOfVectors);
        }
        totalNumberOfVectors += 1;
        if (relativeMagnitude === undefined) {
            relativeMagnitude = 2;
        }
        if (label === undefined) {
            label = name;
        }
        if (angleInDegrees === undefined) {
            angleInDegrees = 0;
        }
        if (startPoint === undefined) {
            startPoint = origin;
        }
        if (relativeAngleBoolean === undefined) { // relative angle boolean determines if the angle is relative to a ramp, etc.
            relativeAngleBoolean = false;
        }

        this.relativeMagnitude = relativeMagnitude;
        this.label = label;
        this.angleInDegrees = angleInDegrees;
        this.relativeAngleBoolean = relativeAngleBoolean;


        if (typeof (startPoint) === 'string') {
            this.stringStartPoint = true;
            this.absoluteStartPoint = false;
            this.startPoint = startPoint;
        } else if (typeof (startPoint) === 'object') {
            this.absoluteStartPoint = true;
            this.stringStartPoint = false;
            this.startPoint = startPoint;
        }

        this.verticalRefernceLine = undefined;
        this.horizontalReferenceLine = undefined;

        this.components = undefined;
    }


    addVerticalReference(label, length, dashed, relativeAngleBoolean) {
        if (label === undefined) {
            label = 'a'
        }
        if (length === undefined) {
            length = this.relativeMagnitude * Math.sin(convertDegreesToRadians(this.angleInDegrees)) * 0.5;
        }
        if (dashed === undefined) {
            dashed = true;
        }
        if (relativeAngleBoolean === undefined) {
            relativeAngleBoolean = false;
        }
        this.verticalRefernceLine = {
            label: label,
            length: length,
            dashed: dashed,
            relativeAngleBoolean: relativeAngleBoolean
        }
    }

    rotate(rotationAngleInDegrees) {
        this.angleInDegrees += rotationAngleInDegrees;
    }

    // if horizontal first boolean is false, the vertical component is constructed first
    addComponents(dashedBoolean, horizontalFirstBoolean) {
        if (dashedBoolean === undefined) {dashedBoolean = true;}
        if (horizontalFirstBoolean === undefined) {horizontalFirstBoolean = true;}

        this.components = {
            dashedBoolean: dashedBoolean,
            horizontalFirstBoolean: horizontalFirstBoolean
        }

    }

    addHorizontalReference(label, length, dashed, relativeAngleBoolean) {
        if (label === undefined) {
            label = 'a'
        }
        if (length === undefined) {
            length = this.relativeMagnitude * Math.cos(convertDegreesToRadians(this.angleInDegrees)) * 0.5;
        }
        if (dashed === undefined) {
            dashed = true;
        }
        if (relativeAngleBoolean === undefined) {
            relativeAngleBoolean = false;
        }
        this.horizontalReferenceLine = {
            label: label,
            length: length,
            dashed: dashed,
            relativeAngleBoolean: relativeAngleBoolean
        }
    }

    setAbsoluteStartPoint(point) {
        this.absoluteStartPoint = true;
        this.startPoint = point;
    }

    addToDiagram(diagramObject, axisRotationInDegrees, relativeFontSize) {
        if (relativeFontSize === undefined) {
            relativeFontSize = 0.2;
        }
        let textDisplacement = relativeFontSize / 2;
        if (this.relativeAngleBoolean === true && axisRotationInDegrees !== undefined) {
            this.rotate(axisRotationInDegrees)
        }
        if (!this.absoluteStartPoint) {
            console.log(`ERROR: Must set absolute start point before drawing force ${name}`)
        }

        this.endPoint = this.startPoint.getAnotherPointWithTrig(this.relativeMagnitude, convertDegreesToRadians(this.angleInDegrees));

        diagramObject.addArrow(this.startPoint, this.endPoint);

        if (this.label) {
            diagramObject.labelLineAbove(this.startPoint, this.endPoint, this.label,textDisplacement, relativeFontSize);
        }

        if (this.relativeAngleBoolean === true && axisRotationInDegrees !== undefined) {
            this.rotate(-1 * axisRotationInDegrees);
        }

        if (this.components) {
            let point1 = this.startPoint;
            let point3 = this.endPoint;
            let point2;
            let components = point1.getComponentsToAnotherPoint(point3, convertDegreesToRadians(axisRotationInDegrees));
            if (this.components.horizontalFirstBoolean) {
                point2 = new Point(point1.x + components.xComponent, point1.y);
            } else { // vertical first
                point2 = new Point(point1.x, point1.y + components.yComponent);
            }

            diagramObject.addArrow(point1, point2);
            diagramObject.addArrow(point2, point3);
        }

    }
}

class Block {
    constructor(horizontalPosition, width, height, name) {
        if (horizontalPosition === undefined) {horizontalPosition = 0;}
        if (width === undefined) {width = 1;}
        if (height === undefined) {height = 1;}
        if (name === undefined) {name = 'A';}

        this.horizontalPosition = horizontalPosition;
        this.width = width;
        this.height = height;
        this.name = name;

        this.forces = [];
    }

    // if absolute angle boolean is false, then the angle is relative to surface
    // but if true, it is relative to the ground
    addForce(name, relativeMagnitude, label, angleInDegrees, startPoint, relativeAngleBoolean) {
        if (relativeMagnitude === undefined) {relativeMagnitude = 2;}
        if (angleInDegrees === undefined) {angleInDegrees = 0;}
       // if (label === undefined) {label = '';}
        if (startPoint === undefined) {startPoint = 'centerRight';}
        if (relativeAngleBoolean === undefined) {relativeAngleBoolean = 'false';}
        let newForce = new Vector(name, relativeMagnitude, label, angleInDegrees, startPoint, relativeAngleBoolean);
        this.forces.push(newForce);
        return newForce;
    }

    addGravity(relativeMagnitude, label) {
        return this.addForce(undefined, relativeMagnitude, label, 270, 'center', false);
    }

    addNormalForce(relativeMagnitude, label) {
        return this.addForce(undefined, relativeMagnitude, label, 90, 'bottomCenter', true);
    }

    addHorizontalAppliedForce(relativeMagnitude, label, direction) {
        if (direction === undefined) {direction = 'right';}
        let position, angle;
        if (direction === 'right') {
            position = 'rightCenter';
            angle = 0;
        } else if (direction === 'left') {
            position = 'leftCenter';
            angle = 180;
        }
        return this.addForce(undefined, relativeMagnitude, label, angle, position, true);
    }

    addFriction(relativeMagnitude, label, direction) {
        if (direction === undefined) {direction = 'left';}
        let position, angle;
        if (direction === 'right') {
            position = 'bottomRightCorner';
            angle = 0;
        } else if (direction === 'left') {
            position = 'bottomLeftCorner';
            angle = 180;
        }
        return this.addForce(undefined, relativeMagnitude, label, angle, position, true);
    }

    /// there is a bug with NEGATIVE angles on the LEFT
    // and i believe it is an error in the ADD ARROW function in the diagram object
    addAngledAppliedForce(relativeMagnitude, label, angleInDegrees, direction) {
        if (direction === undefined) {direction = 'right';}
        if (angleInDegrees === undefined) {angleInDegrees = 30;}
        let position, angle;
        if (direction === 'right') {
            position = 'topRightCorner';
            angle = angleInDegrees;
        } else if (direction === 'left') {
            position = 'topLeftCorner';
            angle = 180 - angleInDegrees;
        }
        return this.addForce(undefined, relativeMagnitude, label, angle, position, true);
    }

    addToDiagram(diagramObject, bottomCenterPoint, thetaInDegrees) {
        let bottomLeft = bottomCenterPoint.getAnotherPointWithTrig(this.width / 2, convertDegreesToRadians(thetaInDegrees) + Math.PI);
        let bottomRight = bottomCenterPoint.getAnotherPointWithTrig(this.width / 2, convertDegreesToRadians(thetaInDegrees));
        let topLeft = bottomLeft.getAnotherPointWithTrig(this.height, convertDegreesToRadians(thetaInDegrees) + Math.PI / 2);
        let topRight = bottomRight.getAnotherPointWithTrig(this.height, convertDegreesToRadians(thetaInDegrees) + Math.PI / 2);

       // diagramObject.addSegment(bottomLeft, bottomRight); // redundadant?
        diagramObject.addSegment(bottomRight, topRight);
        diagramObject.addSegment(topRight, topLeft);
        diagramObject.addSegment(topLeft, bottomLeft);

        this.forces.forEach((force) => {
            if (force.startPoint === 'rightCenter') {
                force.setAbsoluteStartPoint(bottomRight.interpolate(topRight, 0.5));
            } else if (force.startPoint === 'leftCenter') {
                force.setAbsoluteStartPoint(bottomLeft.interpolate(topLeft, 0.5));
            } else if (force.startPoint === 'topRightCorner') {
                force.setAbsoluteStartPoint(topRight);
            } else if (force.startPoint === 'topLeftCorner') {
                force.setAbsoluteStartPoint(topLeft);
            } else if (force.startPoint === 'bottomRightCorner') { //it's just a little bit off the bottom so it doesn't overlap with the graph!
                force.setAbsoluteStartPoint(bottomRight.interpolate(topRight, 0.1));
            } else if (force.startPoint === 'bottomLeftCorner') {
                force.setAbsoluteStartPoint(bottomLeft.interpolate(topLeft, 0.1));
            } else if (force.startPoint === 'center') {
                force.setAbsoluteStartPoint(bottomLeft.interpolate(topRight, 0.55));
                /// it is just a tiny bit off center so it does not overlap with the gravitational force!
            } else if (force.startPoint === 'bottomCenter') {
                force.setAbsoluteStartPoint(bottomLeft.interpolate(bottomRight, 0.45));
            } else if (force.startPoint === 'topCenter') {
                force.setAbsoluteStartPoint(topLeft.interpolate(topRight, 0.5));
            } else {
                force.setAbsoluteStartPoint(bottomLeft.interpolate(topRight, 0.5));
                //center is the default
            }

            force.addToDiagram(diagramObject, thetaInDegrees);

        });
    }
}


class BlockProblem extends Diagram {
    constructor() {
        super();
        this.appliedForces = [];
        this.blocks = [];
        this.angleOfInclineDegrees = 0;
        this.length = 4;
        this.horizontalSurface = true;
        this.verticalSurface = false;
        this.ramp = false;
    }

    addBlock(horizontalPosition, width, height, name) {
        if (name === undefined) {name = alphabetArray[this.blocks.length];}
        let newBlock = new Block(horizontalPosition, width, height, name);
        this.blocks.push(newBlock);
        return
    }

    selectBlock(name) {
        if (name === undefined) {name = 'A';}
        let k;
        let selectedBlock;
        for (k = 0; k < this.blocks.length; k++) {
            if (this.blocks[k].name === name) {
                selectedBlock = this.blocks[k];
            }
        }
        return selectedBlock
    }

    addForce(blockName, relativeMagnitude, label, angleInDegrees, position, absoluteAngleBoolean) {
        let selectedBlock = this.selectBlock(blockName);
        return selectedBlock.addForce(relativeMagnitude, angleInDegrees, label, position, absoluteAngleBoolean);
    }

    addGravity(blockName, relativeMagnitude, label) {
        let selectedBlock = this.selectBlock(blockName);
        return selectedBlock.addGravity(relativeMagnitude, label);
    }

    addNormalForce(blockName, relativeMagnitude, label) {
        return this.selectBlock(blockName).addNormalForce(relativeMagnitude, label);
    }

    addHorizontalAppliedForce(blockName, relativeMagnitude, label, direction) {
        return this.selectBlock(blockName).addHorizontalAppliedForce(relativeMagnitude, label, direction);
    }

    addFriction(blockName, relativeMagnitude, label, direction) {
        return this.selectBlock(blockName).addFriction(relativeMagnitude, label, direction);
    }

    addAngledAppliedForce(blockName, relativeMagnitude, label, theta, direction) {
        return this.selectBlock(blockName).addAngledAppliedForce(relativeMagnitude, label, theta, direction);
    }

    setLength(newLength) {
        this.length = newLength;
    }

    setAngleOfIncline(thetaInDegrees) {
        if (thetaInDegrees % 180 === 0) {
            this.horizontalSurface = true;
            this.verticalSurface = false;
            this.ramp = false;
            this.angleOfInclineDegrees = 0;
        }
        else if ((thetaInDegrees + 90) % 180 === 0) {
            this.verticalSurface = true;
            this.horizontalSurface = false;
            this.ramp = false;
            this.angleOfInclineDegrees = 90;
        }
        else {
            this.ramp = true;
            this.horizontalSurface = false;
            this.verticalSurface = false;
            this.angleOfInclineDegrees = thetaInDegrees % 360;
        }
    }

    addRamp(thetaInDegrees) {
        if (thetaInDegrees === undefined) {thetaInDegrees = 30;}
        this.angleOfInclineDegrees = thetaInDegrees;
        this.ramp = true
    }

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {

        // draw ramp
        let theta = convertDegreesToRadians(this.angleOfInclineDegrees);
        let leftEndPoint = origin.getAnotherPointWithTrig(this.length / 2, theta + Math.PI);
        let rightEndPoint = origin.getAnotherPointWithTrig(this.length/2, theta);
        super.addSegment(leftEndPoint, rightEndPoint);
        if (this.ramp) {
            let cornerPoint = new Point(leftEndPoint.x + this.length * Math.cos(theta), leftEndPoint.y);
            super.addSegment(leftEndPoint, cornerPoint);
            super.addSegment(cornerPoint, rightEndPoint);
        }

        // draw blocks
        this.blocks.forEach((block) => {
            let bottomCenterPoint = leftEndPoint.getAnotherPointWithTrig(block.horizontalPosition + this.length / 2, this.angleOfInclineDegrees);
            block.addToDiagram(this, bottomCenterPoint, theta);
        });

        // draw canvas
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }
}

class RotatingRod extends Diagram {
    constructor(distanceLeft, distanceRight, thetaInDegrees, distanceUnit) {
        super();
        if (distanceRight === undefined) {
            distanceRight = 1;
        }
        if (distanceLeft === undefined) {
            distanceLeft = 0;
        }
        if (distanceUnit === undefined) {
            distanceUnit = 'm'
        }
        if (thetaInDegrees === undefined) {
            thetaInDegrees = 0;
        }

        this.distanceUnit = distanceUnit;
        this.distanceRight = distanceRight;
        this.distanceLeft = distanceLeft;
        this.thetaInDegrees = thetaInDegrees;

        this.masses = [];
        this.defaultMassUnit = 'kg';

        this.forces = [];
        this.defaultForceUnit = 'N';

        this.referenceLineBelow = true;

        this.positionReferenceArray = [];
        this.addPositionToReferenceArray(0,);
    }

    moveReferenceLineAbove() {
      this.referenceLineBelow = false;
    }

    moveReferenceLineBelow() {
      this.referenceLineBelow = true;
    }

    addPositionToReferenceArray(position, label) {
      if (label = 'undefined') {
        label = `${position} ${this.distanceUnit}`;
      } // find an easy way to have different labels
      if (this.checkPosition(position, 'reference array')) {
        let labelInput = label;
        this.positionReferenceArray.push({
          position: position,
          label: labelInput
        });
      }
    }

    automaticReferenceArray(numHashes) {
      let hashDistance = (this.distanceLeft + this.distanceRight) / (numHashes - 1);
      let q;
      for (q = 0; q < numHashes; q++) {
        this.addPositionToReferenceArray(-1 * this.distanceLeft + hashDistance * q);
      }
    }

    checkPosition(position, type) {
      if (position > 0 && position > this.distanceRight) {
          console.log(`ERROR: position of ${type} added outside of range`);
          return false
      } else if (position < 0 && Math.abs(position) > this.distanceLeft) {
          console.log(`ERROR: position of ${type} added outside of range`);
          return false
      } else {
        return true
      }
    }

    setDistanceRight(newDistanceRight) {
        this.distanceRight = newDistanceRight;
    }
    setDistanceLeft(newDistanceLeft) {
        this.distanceLeft = newDistanceLeft;
    }
    setTheta(newTheta) {
        this.theta = newTheta;
    }
    setDistanceUnit(newDistanceUnit) {
        this.distanceUnit = newDistanceUnit;
    }
    setMassUnit(newMassUnit) {
        this.defaultMassUnit = newMassUnit;
    }
    setForceUnit(newForceUnit) {
        this.defaultForceUnit = newForceUnit;
    }

    addMass(massPosition, massQuantity, unit, addHashBoolean) {
        this.checkPosition(massPosition, 'mass');
        if (unit === undefined) {
            unit = this.defaultMassUnit;
        }
        let label = `${massQuantity} ${unit}`;
        let quantity = massQuantity;
        if (unit === 'g') {
            quantity /= 1000;
        }

        this.masses.push({
            position: massPosition,
            quantity: quantity,
            unit: unit,
            label: label
        });

        if (addHashBoolean) {
            this.addPositionToReferenceArray(massPosition);
        }
    }

    addForce(forcePosition, forceMagnitude, forceDirectionInDegrees, unit, addHashBoolean) {
        if (forceMagnitude === undefined) {
            forceMagnitude = 10;
        }
        if (forceDirectionInDegrees === undefined) {
            forceDirectionInDegrees = 90;
        }
        if (forcePosition === undefined) {
            forcePosition = this.distanceRight
        }
        if (unit === undefined) {
            unit = this.defaultForceUnit;
        }

        this.checkPosition(forcePosition, 'force');

        this.forces.push({
            position: forcePosition,
            magnitude: forceMagnitude,
            directionInDegrees: forceDirectionInDegrees,
            unit: unit
        });

        if (addHashBoolean) {
            this.addPositionToReferenceArray(forcePosition);
        }
    }

    getMaxAndMinForce() {
        let max = 0, min = Infinity, maxBelow = 0, maxAbove = 0;
        this.forces.forEach((force) => {
          // this part here needs some work
          // the operation will be different if the force and the rod are at different angles around the object
          let forceAngle = convertDegreesToRadians(force.directionInDegrees - this.thetaInDegrees);
          console.log(forceAngle);
            if (force.magnitude > max) {
                max = force.magnitude;
            }
            if (force.magnitude < min) {
              min = force.magnitude;
            }
            if (force.directionInDegrees <= 180) { // forces above
              if (Math.abs(force.magnitude*Math.sin(forceAngle)) > maxAbove) {
                maxAbove = Math.abs(force.magnitude*Math.sin(forceAngle));
              }
            } else { // forces below
              if (Math.abs(force.magnitude*Math.sin(forceAngle)) > maxBelow) {
                maxBelow = Math.abs(force.magnitude*Math.sin(forceAngle));
              }
            }
        });
        return {
          max: max,
          min: min,
          maxBelow: maxBelow,
          maxAbove: maxAbove
        }
    }

    getMaxMass() {
        let max = 0;
        this.masses.forEach((mass) => {
            if (mass.quantity > max) {
                max = mass.quantity;
            }
        });
        return max
    }


    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        // space here to draw it

        const circleRadius = (this.distanceLeft + this.distanceRight) * 0.1;
        const rectangleWidth = circleRadius * 0.75;
        const forceRange = this.getMaxAndMinForce();
        const maxForce = forceRange.max;
        const minForce = forceRange.min;
        const maxForceAbove = forceRange.maxAbove;
        const maxForceBelow = forceRange.maxBelow;
        let forceMultiplier = 0;
        if (maxForce > 0) {
          forceMultiplier = (this.distanceLeft + this.distanceRight) / maxForce * 0.3;
        }
        // the largest force will always be 30 % the length of the rod
        const forceFontSize = minForce * forceMultiplier * 0.2;
        // the font size will always be 10 % the length of the smallest force
        const maxMass = this.getMaxMass();
        // the largest mass will be the same radius as the circle

        const thetaInRadians = convertDegreesToRadians(this.thetaInDegrees);

        let centerCircle = super.addCircle(origin, circleRadius);
        centerCircle.fill();

        // add two rectangles
        let rightCenterEndPoint = origin.getAnotherPointWithTrig(this.distanceRight, thetaInRadians);
        let leftCenterEndPoint = origin.getAnotherPointWithTrig(this.distanceLeft, thetaInRadians + Math.PI);
        let centerBottomPoint = origin.getAnotherPointWithTrig(rectangleWidth, thetaInRadians + Math.PI * 3 / 2);
        let centerTopPoint = origin.getAnotherPointWithTrig(rectangleWidth, thetaInRadians + Math.PI / 2);
        let rightBottomEndPoint = centerBottomPoint.getAnotherPointWithTrig(this.distanceRight, thetaInRadians);
        let rightTopEndPoint = centerTopPoint.getAnotherPointWithTrig(this.distanceRight, thetaInRadians);
        let leftBottomEndPoint = centerBottomPoint.getAnotherPointWithTrig(this.distanceLeft, thetaInRadians + Math.PI);
        let leftTopEndPoint = centerTopPoint.getAnotherPointWithTrig(this.distanceLeft, thetaInRadians + Math.PI);
        super.addSegment(centerBottomPoint, rightBottomEndPoint);
        super.addSegment(rightBottomEndPoint, rightTopEndPoint);
        super.addSegment(rightTopEndPoint, centerTopPoint);
        super.addSegment(centerBottomPoint, leftBottomEndPoint);
        super.addSegment(leftBottomEndPoint, leftTopEndPoint);
        super.addSegment(leftTopEndPoint, centerTopPoint);

        // add masses as circles
        this.masses.forEach((mass) => {
            let massCenter = origin.getAnotherPointWithTrig(mass.position, thetaInRadians);
            let radiusMultiplier = mass.quantity / maxMass;
            if (radiusMultiplier < 0.5) {radiusMultiplier = 0.5;} // this is to prevent masses from appearing as too small int he diagram
            let massRadius = circleRadius * radiusMultiplier;
            let massString = `${mass.label}`;
            let massFontSize = massRadius * 2 / massString.length;
            let massCircle = super.addCircle(massCenter, massRadius);
            massCircle.fillWhite();
            super.addText(massString,massCenter, massFontSize, 0); // addText(letters, centerPoint, relativeFontSize, rotation)
        });

        // add forces
        this.forces.forEach((force) => {
          let forceStart;
          let phiInRadians = convertDegreesToRadians(force.directionInDegrees);

          if (phiInRadians <= Math.PI) { /// force on top
            forceStart = centerTopPoint.getAnotherPointWithTrig(force.position, thetaInRadians);
          } else { // force on bottom
            forceStart = centerBottomPoint.getAnotherPointWithTrig(force.position, thetaInRadians);
          }

          let forceEnd = forceStart.getAnotherPointWithTrig(force.magnitude * forceMultiplier, phiInRadians);
          super.addArrow(forceStart, forceEnd);
          let forceText = `${force.magnitude} ${force.unit}`;
          super.labelLineAbove(forceStart, forceEnd, forceText, forceFontSize * 0.5, forceFontSize);
          //     addArrow(point1, point2, arrowheadLength, arrowheadAngleInDegrees)
          //     labelLineAbove(point1, point2, text, textDisplacement, relativeFontSize) {


        });

        // add reference Line
        let referenceLineDisplacement, referenceLeftEnd, referenceRightEnd, refernceLineBelow;
        if (this.positionReferenceArray.length > 0 ) {
          if (this.referenceLineBelow) { // refernce line below
            referenceLineDisplacement = (this.distanceLeft + this.distanceRight) * 0.07 + maxForceBelow * forceMultiplier;
            referenceLeftEnd = leftBottomEndPoint.getAnotherPointWithTrig(referenceLineDisplacement, thetaInRadians + 3 * Math.PI / 2);
            referenceRightEnd = rightBottomEndPoint.getAnotherPointWithTrig(referenceLineDisplacement, thetaInRadians + 3 * Math.PI / 2);
          } else { // reference line above
            referenceLineDisplacement = (this.distanceLeft + this.distanceRight) * 0.07 + maxForceAbove * forceMultiplier;
            referenceLeftEnd = leftTopEndPoint.getAnotherPointWithTrig(referenceLineDisplacement, thetaInRadians + Math.PI / 2);
            referenceRightEnd = rightTopEndPoint.getAnotherPointWithTrig(referenceLineDisplacement, thetaInRadians + Math.PI / 2);
          }
          let referenceLine = super.addSegment(referenceLeftEnd, referenceRightEnd);
        //  referenceLine.turnIntoDashedLine();
        }

        // hash marks on reference line
        //     addHashMark(endPoint1, endPoint2, proportion, hashLength, labelAbove, labelBelow, labelFontSize, labelRotateBoolean) {

        if (this.referenceLineBelow) {
          this.positionReferenceArray.forEach((referencePoint) => {
            let proportion = (referencePoint.position + this.distanceLeft) / (this.distanceRight + this.distanceLeft);
            super.addHashMark(referenceLeftEnd, referenceRightEnd, proportion, undefined, undefined, referencePoint.label, undefined, false);
          });
        } else {
          this.positionReferenceArray.forEach((referencePoint) => {
            let proportion = (referencePoint.position + this.distanceLeft) / (this.distanceRight + this.distanceLeft);
            super.addHashMark(referenceLeftEnd, referenceRightEnd, proportion, undefined, referencePoint.label, undefined, undefined, false);
        });
      }
      return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }
}


// should there be just one type of wave object, or different wave objects for transverse and longitudinal??

// default start is zero line, going up
// phase proportion is a number from 0 to 1 indicating at what point it should begin
class Wave {
    constructor(numWavelengths, amplitude, wavelength, phaseProportion) {
        if (amplitude === undefined) {
            amplitude = 1;
        }
        if (wavelength === undefined) {
            wavelength = 1;
        }
        if (phaseProportion === undefined) {
            phaseProportion = 0;
        }
        if (numWavelengths === undefined) {
            numWavelengths = 4;
        }
        this.makeTransverse();
        this.amplitude = amplitude;
        this.wavelength = wavelength;
        this.phaseProportion = phaseProportion;
        this.numWavelengths = numWavelengths;
        this.phase = phaseProportion * 2 * Math.PI;
        this.xMax = wavelength * numWavelengths;
        //    addFunctionGraph(func, xMin, xMax, forcedYmin, forcedYmax) {
        this.function = (x) => {
            return this.amplitude * Math.sin(2 * Math.PI * x / this.wavelength + this.phase);
        };


        this.circles = [];

    }

    normalizeFunction() {
        this.integral = this.amplitude * (Math.cos(this.phase) - Math.cos(2 * Math.PI * this.numWavelengths)) + this.amplitude * this.xMax / 2;
        this.probabilityFunction = (x) => {
            return (this.function(x) + this.amplitude / 2) / this.integral;
        }
        ///  won't this cancel out amplitude?? that does need to be a part of it.
    }

    makeLongitudinal(totalHeight, dotDensity) {
        if (totalHeight === undefined) {
            totalHeight = this.xMax / 2;
        }
        if (dotDensity === undefined) {
            dotDensity = 0.7; // number of dots per area
        }
        this.type = 'longitudinal';
        this.totalHeight = totalHeight;
        this.dotDensity = dotDensity;

        // make function into a probability distribution
    }
    makeTransverse() {
        this.type = 'transverse';
        this.totalHeight = undefined;
        this.dotDensity = undefined;
    }

    addSecondHalf(dashedBoolean) {
        if (this.type === 'longitudinal') {
            console.log('ERROR: Cannot add second half to longitudinal wave');
            return false
        }
        this.secondFunction = (x) => {
            return this.amplitude * Math.sin(2 * Math.PI * x / this.wavelength + this.phase + Math.PI);
        };
        this.bottomHalfDashed = dashedBoolean;
    }

    makeStandingWave() {
        this.addSecondHalf(true);
    }

    circleCrests(filled) {
        let firstCrest, numCrests;

    }

    circleTroughs(filled) {
        let firstTrough, numTroughs;

    }

    circleCenterPoints(filled) {
        let firstCenterPoint, numCenterPoints;
        if (this.phaseProportion === 0) { // if it begins with an anit-node
            firstCenterPoint = 0;
            if ((this.numWavelengths * 2) % 1 === 0 ) { // if it ends on a node
                numCenterPoints = this.numWavelengths  * 2 + 1;
            } else { // if it doesn't end on a node
                numCenterPoints = this.numWavelengths  * 2;
            }
        } else {
            firstCenterPoint = (0.5 - this.phaseProportion) * this.wavelength;
            numCenterPoints = this.numWavelengths * 2;
        }

        const circleRadius = this.amplitude * 0.1;

        let k, x, y;
        for (k = 0; k < numCenterPoints; k++) {
            x = firstCenterPoint + this.wavelength / 2 * k;
            y = 0;
            this.circles.push({
                x: x,
                y: y,
                radius: circleRadius,
                filled: filled
            })
        }

    }

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        if (maxWidth === undefined) {
            maxWidth = 300;
        }
        if (maxHeight === undefined) {
            maxHeight = maxWidth;
        }
        let WaveDiagram = new Diagram();
        if (this.type === 'transverse') {
            WaveDiagram.addFunctionGraph(this.function, 0, this.xMax);

            if (this.secondFunction) {
                let secondFunction = WaveDiagram.addFunctionGraph(this.secondFunction, 0, this.xMax);
                if (this.bottomHalfDashed) {
                    secondFunction.makeDashed(20);
                }
            }
        } else if (this.type === 'longitudinal') {
            /// function nondistortedResize(originalWidth, originalHeight, maxWidth, maxHeight) {


            let scale = nondistortedResize(this.xMax, this.totalHeight, maxWidth, maxHeight);
            let areaOnScreen = this.xMax * this.totalHeight * scale; // get the area in pixels
            let numDots = areaOnScreen * this.dotDensity;
            let dotRadius = areaOnScreen * 0.00003;

            let i, yTest, xTest, monteCarloPoint, Ntries;
            for (i = 0; i < numDots; i++) {
                xTest = Math.random() * this.xMax;
                yTest = Math.random() * this.totalHeight;

                monteCarloPoint = Math.random() * this.amplitude * 2;

                if (monteCarloPoint < this.function(xTest) + this.amplitude) {
                    WaveDiagram.addBlackCircle(new Point(xTest, yTest), dotRadius);
                } else {
                    i -= 1;
                }
                // the solution i once figured out on a friday night at a teavana in waltham, ma
            }

        }

        this.circles.forEach((circle) => {
            let newCircle = WaveDiagram.addCircle(new Point(circle.x, circle.y),circle.radius);
            if (circle.filled) {
                newCircle.fill();
            }
        });
        return WaveDiagram.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }

}

class Harmonic extends Wave {
    constructor(harmonicNumber, end1, end2, amplitude, wavelength) {
        if (end1 === undefined) {
            end1 = 'closed';
        }
        if (end2 === undefined) {
            end2 = 'closed';
        }
        if (harmonicNumber === undefined) {
            console.log('ERROR, Harmonic number must be defined')
        }
        let phaseProportion, numWavelengths;
        if (end1 === 'closed' && end2 === 'closed') {
            phaseProportion = 0;
            numWavelengths = harmonicNumber * 0.5;
        } else if (end1 === 'open' && end2 === 'open') {
            phaseProportion = 0.25;
            numWavelengths =  harmonicNumber * 0.5;
        } else if (end1 === 'closed' && end2 === 'open') {
            phaseProportion = 0;
            numWavelengths = 0.25 + (harmonicNumber - 1) * 0.5;
        } else if (end1 === 'open' && end2 === 'closed') {
            phaseProportion = 0.25;
            numWavelengths = 0.25 + (harmonicNumber - 1) * 0.5;
        } else {
            console.log('ERROR: unallowed harmonic type');
        }

        super(numWavelengths,amplitude,wavelength,phaseProportion);
        super.addSecondHalf(true);

    }


    circleNodes(filled) {
        super.circleCenterPoints(filled);
    }

    circleAntiNodes(filled) {
        let firstAntiNode, numAntiNodes;

        if (this.phaseProportion === 0.25 || this.phaseProportion === 0.75) { // begins on an antinode
            firstAntiNode = 0;
            if ((this.numWavelengths * 2) % 1 === 0 ) { // if it ends on a antinode
                numAntiNodes = this.numWavelengths * 2 + 1;
            } else {
                numAntiNodes = this.numWavelengths * 2;
            }
        } else {
            firstAntiNode = 0.25 - this.phaseProportion;
            numAntiNodes = this.numWavelengths * 2;
        }

        const circleRadius = this.amplitude * 0.1;
        let k, x;
        for (k = 0; k < numAntiNodes; k++) {
            x = firstAntiNode + this.wavelength / 2 * k;
            this.circles.push({
                x: x,
                y: this.amplitude,
                radius: circleRadius,
                filled: filled
            });
            this.circles.push({
                x: x,
                y: -1 * this.amplitude,
                radius: circleRadius,
                filled: filled
            });
        }
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
