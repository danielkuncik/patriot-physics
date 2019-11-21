class StepwiseFunctionObject {
    constructor(initialX, initialY) {
        this.stepwiseFunctionObject = true;

        if (initialX === undefined) {initialX = 0;}
        if (initialY === undefined) {initialY = 0;}

        this.steps = [];
        this.verticalLines = [];
        this.points = [];
        this.initialX = initialX;
        this.initialY = initialY;

        this.currentX = this.initialX;
        this.currentY = this.initialY;

        this.xMax = this.currentX;
        this.xMin = this.currentX;
        this.yMax = this.currentY;
        this.yMin = this.currentY;
    }

    addCurvedStep(curveFunction, xStep, forcedInitialY) {
        let yStart;
        if (forcedInitialY !== undefined) {
            this.addVerticalLine(this.currentX, this.currentY, forcedInitialY);
            yStart = forcedInitialY
        } else {
            yStart = this.currentY;
        }
        const yStartForThisFunction = yStart;
        const xStartForThisFunction = this.currentX;
        // automatically align function
        let alignedFunction = function (x) {
            return curveFunction(x - xStartForThisFunction) + yStartForThisFunction
        };
        this.addDefinedPoint(this.currentX + xStep, alignedFunction(this.currentX + xStep));
        this.steps.push({
            'type': 'curved',
            'x1': this.currentX,
            'y1': yStart,
            'x2': this.currentX + xStep,
            'y2': alignedFunction(this.currentX + xStep),
            'curveFunction': alignedFunction
        });
        let rangeObject = getRangeOfFunction(alignedFunction, this.currentX, this.currentX + xStep);
        if (rangeObject.yMax > this.yMax) {
            this.yMax = rangeObject.yMax;
        }
        if (rangeObject.yMin < this.yMin) {
            this.yMin = rangeObject.yMin;
        }
        this.currentY = alignedFunction(this.currentX + xStep);
        this.currentX = this.currentX + xStep;
        this.xMax = this.currentX;
    }

    addLinearStep(xStep, nextY, forcedInitialY) {
        let nextX = this.currentX + xStep;
        if (forcedInitialY !== undefined) {
            this.addVerticalLine(this.currentX, this.currentY, forcedInitialY);
        }
        this.addDefinedPoint(nextX, nextY);
        this.steps.push({
            'type': 'linear',
            'x1': this.currentX,
            'y1': this.currentY,
            'x2': nextX,
            'y2': nextY
        });
        this.currentX = nextX;
        this.xMax = this.currentX;
        this.currentY = nextY;
        if (this.currentY > this.yMax) {
            this.yMax = this.currentY;
        }
        if (this.currentY < this.yMin) {
            this.yMin = this.currentY;
        }
    }

    addConstantStep(xStep, forcedY) {
        if (forcedY) {
            this.addLinearStep(xStep, forcedY, forcedY);
        } else {
            this.addLinearStep(xStep, this.currentY);
        }
    }

    addZeroStep(xStep) {
        if (this.currentY === 0) {
            this.addLinearStep(xStep, 0);
        } else {
            this.addLinearStep(xStep, 0, 0);
        }
    }

    addDefinedPoint(x, y) {
        this.points.push({
            'x': x,
            'y': y,
            'type': 'defined'
        });
    }

    addVerticalLine(x, y1, y2) {
        this.verticalLines.push({
            'x': x,
            'y1': y1,
            'y2': y2
        });
        this.addDefinedPoint(x, y2);
    }

    addUndefinedPoint(x, y) {
        this.points.push({
            'x': x,
            'y': y,
            'type': 'undefined'
        });
    }

    addToDiagram(Diagram, yMultiplier, pointRadius, forcedYmin, forcedYmax) {
        if (yMultiplier === undefined) {yMultiplier = 1;}
        this.verticalLines.forEach((vertLine) => {
            Diagram.addTwoPointsAndSegment(vertLine.x, vertLine.y1 * yMultiplier, vertLine.x, vertLine.y2 * yMultiplier);
        });
        this.points.forEach((point) => {
            let newCirc = Diagram.addCircle(new Point(point.x, point.y * yMultiplier), pointRadius);
            if (point.type === 'defined') {
                newCirc.setFillColor('#000000');
                newCirc.fill();
            } else if (point.type === 'undefined') {
                newCirc.setFillColor('#FFFFFF');
                newCirc.fill();
            }
        });
        this.steps.forEach((step) => {
            if (step.type === 'linear') {
                Diagram.addTwoPointsAndSegment(step.x1, step.y1 * yMultiplier, step.x2, step.y2 * yMultiplier);
            } else if (step.type === 'curved') {
                let thisCurve = function(x) {
                    return step.curveFunction(x) * yMultiplier;
                };
                Diagram.addFunctionGraph(thisCurve, step.x1, step.x2, forcedYmin, forcedYmax);
            }
        });
    }
}