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
            if (!this.textAlreadyAdded) {
                super.addText('0', new Point(this.xMin0 - this.textDisplacement/2, 0), this.relativeFontSize);
            }
            super.addDashedLine(new Point(this.xMin0, 0), new Point(this.xMax0, 0));
        }

        if (!this.textAlreadyAdded) {
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

        this.textAlreadyAdded = true;

        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }

    /// i need to add correction for aspect ratio
}
