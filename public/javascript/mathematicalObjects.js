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
        this.addDefinedPoint(this.initialX, this.initialY);

        this.currentX = this.initialX;
        this.currentY = this.initialY;

        this.xMax = this.currentX;
        this.xMin = this.currentX;
        this.yMax = this.currentY;
        this.yMin = this.currentY;
    }

    forceYchange(newY) {
        this.addVerticalLine(this.currentX, this.currentY, newY);
        this.currentY = newY;

    }

    addCurvedStep(curveFunction, xStep) {
        const yStartForThisFunction = this.currentY;
        const xStartForThisFunction = this.currentX;
        // automatically align function
        let alignedFunction = function (x) {
            return curveFunction(x - xStartForThisFunction) + yStartForThisFunction
        };
        this.addDefinedPoint(this.currentX + xStep, alignedFunction(this.currentX + xStep));
        this.steps.push({
            'type': 'curved',
            'x1': this.currentX,
            'y1': this.currentY,
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

    addLinearStep(xStep, nextY) {
        let nextX = this.currentX + xStep;
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

    addLinearStepWithDelta(xStep, deltaY) {
        let nextY = this.currentY + deltaY;
        this.addLinearStep(xStep, nextY);
    }

    addConstantStep(xStep) {
        this.addLinearStep(xStep, this.currentY);
    }

    addZeroStep(xStep) {
        if (this.currentY === 0) {
            this.addConstantStep(xStep);
        } else {
            this.forceYchange(0);
            this.addConstantStep(xStep);
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

    getFunction() {
        const xMin = this.initialX;
        const xMax = this.currentX;
        const initialY = this.initialY;
        const currentY = this.currentY;
        const stepArray = this.steps;
        let newFunction = function(x) {
            let result;
            if (x < xMin) {
                result = undefined;
            } else if (x > xMax) {
                result = undefined;
            } else if (x === xMin) {
                result = initialY;
            } else if (x === xMax) {
                return currentY;
            } else {
                let k, correctStepIndex;
                for (k = 0; k < stepArray.length; k++) {
                    if (x >= stepArray[k].x1 && x < stepArray[k].x2) {
                        correctStepIndex = k;
                    }
                }
                let correctStep = stepArray[correctStepIndex];
                if (correctStep.type === 'linear') {
                    let slope = (correctStep.y2 - correctStep.y1) / (correctStep.x2 - correctStep.x1);
                    result = correctStep.y1 + slope * (x - correctStep.x1);
                } else if (correctStep.type === 'curved') {
                    result = correctStep.curveFunction(x);
                }
            }
            return result
        };
        return newFunction;
    }

    getRange() {
        let range = getRangeOfFunction(this.getFunction(), this.initialX, this.currentX);
        this.yMin = range.yMin;
        this.yMax = range.yMax;
    }

    testIfConstant() {
        this.getRange();
        if (this.yMin === this.yMax) {
            return true
        } else {
            return false
        }
    }

    testIfZero() {
        this.getRange();
        if (this.yMin === this.yMax && this.yMin < 1e-10) {
            return true
        } else {
            return false
        }
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
function smartQualitativeFunctionGrapher(qualitativeStepwiseFunction, desiredAspectRatio) {
    let graph;
    if (qualitativeStepwiseFunction.testIfZero()) {
        graph = new QualitativeGraph(qualitativeStepwiseFunction, undefined, undefined, desiredAspectRatio, -5, 5);
    } else if (qualitativeStepwiseFunction.testIfConstant()) {
        if (qualitativeStepwiseFunction.yMax > 0 ) {
            graph = new QualitativeGraph(qualitativeStepwiseFunction, undefined, undefined, desiredAspectRatio, 0, qualitativeStepwiseFunction.yMax * 2);
        } else if (qualitativeStepwiseFunction.yMax < 0 ) {
            graph = new QualitativeGraph(qualitativeStepwiseFunction, undefined, undefined, desiredAspectRatio, qualitativeStepwiseFunction.yMax * 2, 0);
        }
    } else {
        graph = new QualitativeGraph(qualitativeStepwiseFunction, undefined, undefined, desiredAspectRatio);
    }
    return graph
}

// creates three stepwise functions
// representing the position, velocity, and acceleration graphs of that particular functions
class KinematicStepwiseFunctions {
    constructor(initialPosition, initialVelocity, initialAcceleration, startTime) {
        if (initialPosition === undefined) {initialPosition = 0;}
        if (initialVelocity === undefined) {initialVelocity = 0;}
        if (initialAcceleration === undefined) {initialAcceleration = 0;}
        if (startTime === undefined) {startTime = 0;}

        this.initialPosition = initialPosition;
        this.initialVelocity = initialVelocity;
        this.initialAcceleration = initialAcceleration;
        this.startTime = startTime;

        this.positionFunction = new StepwiseFunctionObject(this.startTime, this.initialPosition);
        this.velocityFunction = new StepwiseFunctionObject(this.startTime, this.initialVelocity);
        this.accelerationFunction = new StepwiseFunctionObject(this.startTime, this.initialAcceleration);

        this.currentPosition = this.initialPosition;
        this.currentVelocity = this.initialVelocity;
        this.currentTime = this.startTime;
        this.currentAcceleration = this.initialAcceleration;
    }

    addStationaryStep(time) {
        this.positionFunction.addConstantStep(time);
        this.velocityFunction.addZeroStep(time);
        this.accelerationFunction.addZeroStep(time);
        this.currentVelocity = 0;
        this.currentAcceleration = 0;
        this.currentTime += time;
    }

    addConstantVelocityStep(time) {
        this.positionFunction.addLinearStepWithDelta(time, time * this.currentVelocity);
        this.velocityFunction.addConstantStep(time);
        this.accelerationFunction.addZeroStep(time);
        this.currentPosition += time * this.currentVelocity;
        this.currentTime += time;
        this.currentAcceleration = 0;
    }

    addAcceleratedStep(acceleration, time) {
        const startingVelocity = this.currentVelocity;
        this.positionFunction.addCurvedStep((t) => {
            return startingVelocity * t + 0.5 * acceleration * t * t
        }, time);
        this.velocityFunction.addLinearStepWithDelta(time, acceleration * time);
        if (this.currentAcceleration !== acceleration) {
            this.accelerationFunction.forceYchange(acceleration);
        }
        this.accelerationFunction.addConstantStep(time);

        this.currentPosition += startingVelocity * time + 0.5 * acceleration * time * time;
        this.currentVelocity += acceleration * time;
        this.currentTime += time;
        this.currentAcceleration = acceleration;
    }

    teleport(newPosition) {
        this.currentPosition = newPosition;
        this.positionFunction.forceYchange(newPosition);
    }

    abruptVelocityChange(newVelocity) {
        this.currentVelocity = newVelocity;
        this.velocityFunction.forceYchange(newVelocity);
    }

    abruptStop() {
      this.abruptVelocityChange(0);
    }

    /// i want to eventually add this, but not sure how i will graph it
    timeTravel(newTime) {
        this.currentTime = newTime;
    }

    makeQualitativeGraphs(story, labelsOnSide, dimension) {
        if (story === undefined) {
            story = 'someStory'
        }
        if (dimension === undefined) {
            dimension = 'x'
        }
        let graphCollection = {};
        graphCollection.story = story;
        graphCollection.positionGraph = smartQualitativeFunctionGrapher(this.positionFunction);
        graphCollection.velocityGraph = smartQualitativeFunctionGrapher(this.velocityFunction);
        graphCollection.accelerationGraph = smartQualitativeFunctionGrapher(this.accelerationFunction);
        graphCollection.motionMap = new MotionMap(this.positionFunction, this.startTime, this.currentTime);

        if (labelsOnSide) {
            graphCollection.positionGraph.moveLabelsToSide();
            graphCollection.velocityGraph.moveLabelsToSide();
            graphCollection.accelerationGraph.moveLabelsToSide();
            graphCollection.positionGraph.labelAxes('time', 'position');
            graphCollection.velocityGraph.labelAxes('time', 'velocity');
            graphCollection.accelerationGraph.labelAxes('time', 'acceleration');
        } else {
            graphCollection.positionGraph.labelAxes('t', `${dimension}(t)`);
            graphCollection.velocityGraph.labelAxes('t', 'v(t)');
            graphCollection.accelerationGraph.labelAxes('t', 'a(t)');
        }

        return graphCollection;
    }
}

// two issues:
// the first issue was solved
// 2- the velocity graph requires a forced yMin of 0...and i don't want that!
// 3 - i need to add undefined points to accelration functions
// so examine these issues more please
