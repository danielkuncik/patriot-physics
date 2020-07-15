// creates three stepwise functions
// representing the position, velocity, and acceleration graphs of that particular functions

// I think that i should eliminate the 'qualitative graphs' and just use this with the quantitative graphs to make all the damn graphs i want
/// this is really what i was trying to do with the qualitative graph function

class KinematicsProblem {
    constructor(firstTimeInterval, initialVelocity, acceleration, initialPosition, startTime) {
        if (initialPosition === undefined) {initialPosition = 0;}
        if (initialVelocity === undefined) {initialVelocity = 0;}
        if (acceleration === undefined) {acceleration = 0;}
        if (startTime === undefined) {startTime = 0;}

        this.initialPosition = initialPosition;
        this.totalDisplacement = 0;
        this.totalDistance = 0;
        this.initialVelocity = initialVelocity;
        this.totalTime = 0;
        this.startTime = startTime;

        this.maxPosition = initialPosition;
        this.minPosition = initialPosition;
        this.maxVelocity = initialVelocity;
        this.minVelocity = initialVelocity;
        this.maxAcceleration = acceleration;
        this.minAcceleration = acceleration;

        this.currentPosition = initialPosition;
        this.currentVelocity = this.initialVelocity;
        this.currentTime = startTime;

        this.averageVelocity = initialVelocity;
        this.averageAcceleration = acceleration;
        this.averageSpeed = Math.abs(initialVelocity);

        // this.positionFunction = new StepwiseFunctionObject(startTime, initialPosition);
        // this.velocityFunction = new StepwiseFunctionObject(startTime, initialVelocity);
        // this.accelerationFunction = new StepwiseFunctionObject(startTime, acceleration);

        this.steps = [];
        this.crucialPoints = [{
          t: this.currentTime,
          x: this.currentPosition,
          v: this.currentVelocity,
          a: acceleration
        ]; // crucial time points

        if (firstTimeInterval) { // you can make it without a first time interval
            if (initialVelocity === 0 && acceleration === 0) {
                this.addStationaryStep(firstTimeInterval);
            } else if (initialVelocity !== 0 && acceleration === 0) {
                this.addConstantVelocityStep(firstTimeInterval);
            } else if (initialVelocity !== 0 && acceleration !== 0) {
                this.addAcceleratedStep(firstTimeInterval, acceleration);
            }
        }
    }


    finalize() {
        this.finalPosition = this.currentPosition;
        this.finalVelocity = this.currentVelocity;
        this.finalTime = this.currentTime;
        // add here making position graphs
    }

    addCrucialPoint(t,x,v,a) {
      this.crucialTimes.push({
        t: t,
        x: x,
        v: v,
        a: a
      });
    }


    // i want this to only be used within other functions
    addStepInternalUseOnly(timeInterval, initialVelocity, acceleration, distance) {
        let displacement = initialVelocity * timeInterval + 0.5 * acceleration * timeInterval ** 2;
        let finalVelocity = initialVelocity + timeInterval * acceleration;
        const initialPosition = this.currentPosition;
        const initialTime = this.currentTime;
        this.steps.push({
            initialTime: initialTime,
            finalTime: initialTime + timeInterval,
            timeInterval: timeInterval,
            initialPosition: initialPosition,
            finalPosition: initialPosition + displacement,
            distance: distance,
            displacement: displacement,
            initialVelocity: initialVelocity,
            finalVelocity: finalVelocity,
            acceleration: acceleration
        });
        this.addCrucialPoint(finalTime, finalPosition, finalVelocity, acceleration);
        // what if it hits a max or min in the system
        if (initialPosition + displacement > this.maxPosition) {
            this.maxPosition = initialPosition + displacement;
        } else if (initialPosition + displacement < this.minPosition) {
            this.minPosition = initialPosition + displacement;
        }
        if (finalVelocity > this.maxVelocity) {
            this.maxVelocity = finalVelocity;
        } else if (finalVelocity < this.minVelocity) {
            this.minVelocity = finalVelocity;
        }
        if (acceleration > this.maxAcceleration) {
            this.maxAcceleration = acceleration;
        } else if (acceleration < this.minAcceleration) {
            this.minAcceleration = acceleration;
        }

        this.currentTime += timeInterval;
        this.currentVelocity = finalVelocity;
        this.currentPosition += displacement;

        this.totalDisplacement = this.currentPosition - this.initialPosition;
        this.totalTime += timeInterval; /// identical to current Time
        this.totalDistance += distance;
        this.averageVelocity = this.totalDisplacement / this.totalTime;
        this.averageAcceleration = (this.currentVelocity - this.initialVelocity)  / this.totalTime;
        this.averageSpeed = this.totalDistance / this.totalTime;
    }


    addStationaryStep(timeInterval) {
        // this.positionFunction.addConstantStep(timeInterval);
        // this.velocityFunction.addZeroStep(timeInterval);
        // this.accelerationFunction.addZeroStep(timeInterval);
        let distance = 0;
        this.addStepInternalUseOnly(timeInterval,0,0, distance);
    }

    addConstantVelocityStep(timeInterval) {
        // this.positionFunction.addLinearStepWithDelta(timeInterval, timeInterval * this.currentVelocity);
        // this.velocityFunction.addConstantStep(timeInterval);
        // this.accelerationFunction.addZeroStep(timeInterval);
        let distance = Math.abs(this.currentVelocity) * timeInterval;
        this.addStepInternalUseOnly(timeInterval, this.currentVelocity, 0, distance);
    }

    addAcceleratedStep(timeInterval, acceleration) {
        let distance;
        if (acceleration * this.currentVelocity < 0 && Math.abs(acceleration * timeInterval) > Math.abs(this.currentVelocity)) { // if the object reverses direction!
            let timeBeforeReversal, timeAfterReversal, displacementBeforeReversal, displacementAfterReversal;
            timeBeforeReversal = Math.abs(this.currentVelocity) / Math.abs(acceleration);
            timeAfterReversal = timeInterval - timeBeforeReversal;
            displacementBeforeReversal = this.currentVelocity * timeBeforeReversal + 0.5 * acceleration * timeBeforeReversal**2;
            displacementAfterReversal = 0.5 * acceleration * timeAfterReversal**2;
            distance = Math.abs(displacementBeforeReversal) + Math.abs(displacementAfterReversal);
            if (displacementBeforeReversal > 0) { // downward parabola
                if (this.currentPosition + displacementBeforeReversal > this.maxPosition) {
                    this.maxPosition = this.currentPosition + displacementBeforeReversal;
                    this.addCrucialPoint(this.currentTime + this.timeBeforeReversal, this.maxPosition, 0, acceleration);
                }
            } else if (displacementBeforeReversal < 0) { // upward parabola
                if (this.currentPosition + displacementBeforeReversal < this.minPosition) {
                    this.minPosition = this.currentPosition + displacementBeforeReversal;
                    this.addCrucialPoint(this.currentTime + this.timeBeforeReversal, this.minPosition, 0, acceleration);
                }
            }
        } else {
            distance = Math.abs(this.currentVelocity * timeInterval + 0.5 * acceleration * timeInterval**2);
        }
        // this.positionFunction.addCurvedStep((t) => {
        //     return this.currentVelocity * t + 0.5 * acceleration * timeInterval * timeInterval
        // }, timeInterval);
        // this.velocityFunction.addLinearStepWithDelta(timeInterval, acceleration * timeInterval);
        // // if (this.currentAcceleration !== acceleration) {
        // //     this.accelerationFunction.forceYchange(acceleration);
        // // }
        // this.accelerationFunction.addConstantStep(timeInterval);
        this.addStepInternalUseOnly(timeInterval, this.currentVelocity, acceleration, distance);
    }

    abruptVelocityChange(newVelocity) {
        this.currentVelocity = newVelocity;
        // this.velocityFunction.forceYchange(newVelocity);
    }

    abruptStop() {
        this.abruptVelocityChange(0);
    }

    /// these are not fully complete!
    timeTravel(newTime) {
        this.currentTime = newTime;
    }
    teleport(newPosition) {
        this.currentPosition = newPosition;
        // this.positionFunction.forceYchange(newPosition);
    }

    // makeQualitativeGraphs(labelsOnSide, dimension) {
    //     if (dimension === undefined) {
    //         dimension = 'x'
    //     }
    //     let graphCollection = {};
    //     graphCollection.story = story;
    //     graphCollection.positionGraph = smartQualitativeFunctionGrapher(this.positionFunction);
    //     graphCollection.velocityGraph = smartQualitativeFunctionGrapher(this.velocityFunction);
    //     graphCollection.accelerationGraph = smartQualitativeFunctionGrapher(this.accelerationFunction);
    //     graphCollection.motionMap = new MotionMap(this.positionFunction, this.startTime, this.currentTime);
    //
    //     if (labelsOnSide) {
    //         graphCollection.positionGraph.moveLabelsToSide();
    //         graphCollection.velocityGraph.moveLabelsToSide();
    //         graphCollection.accelerationGraph.moveLabelsToSide();
    //         graphCollection.positionGraph.labelAxes('time', 'position');
    //         graphCollection.velocityGraph.labelAxes('time', 'velocity');
    //         graphCollection.accelerationGraph.labelAxes('time', 'acceleration');
    //     } else {
    //         graphCollection.positionGraph.labelAxes('t', `${dimension}(t)`);
    //         graphCollection.velocityGraph.labelAxes('t', 'v(t)');
    //         graphCollection.accelerationGraph.labelAxes('t', 'a(t)');
    //     }
    //
    //     return graphCollection;
    // }

    makePositionGraph(desiredAspectRatio, crucialTimeReferenceArray) {
        let myGraph = new QuantitativeGraph(0, this.currentTime, this.minPosition, this.maxPosition,desiredAspectRatio);
        this.steps.forEach((step) => {
            if (step.acceleration === 0) {
                myGraph.addSegmentWithCirclesOnEnds(step.initialTime, step.finalTime, step.initialPosition, step.finalPosition);
            } else if (step.acceleration !== 0) {
                let y1 = step.initialVelocity * step.initialTime + 0.5 * step.acceleration * step.initialTime**2;
                let y2 = step.initialVelocity * step.finalTime + 0.5 * step.acceleration * step.finalTime**2;
                myGraph.addFunctionGraph((t) => {
                    return step.initialVelocity * t + 0.5 * step.acceleration * t**2
                    }, step.initialTime, step.finalTime);
                myGraph.addPointAsACircle(step.initialTime, y1);
                myGraph.addPointAsACircle(step.finalTime, y2);
            }
        });
        myGraph.labelAxes('time (s)', 'position (m/s)');
        if (crucialTimeReferenceArray) {
          let timeReferenceArray = [], positionReferenceArray = [];
          this.crucialPoints.forEach((point) => {
            timeReferenceArray.push(point.t);
            positionReferenceArray.push(point.x);
          });
          this.addReferenceArrays(timeReferenceArray, positionReferenceArray);
        }
        return myGraph
    }

    // i need to deal with the issue of undefined points etc.
    makeVelocityGraph(desiredAspectRatio) {
        let myGraph = new QuantitativeGraph(0, this.currentTime, this.minVelocity, this.maxVelocity,desiredAspectRatio);
        this.steps.forEach((step) => {
            myGraph.addSegmentWithCirclesOnEnds(step.initialTime, step.initialVelocity, step.finalTime, step.finalVelocity);
        });
        myGraph.labelAxes('time (s)','velocity (m/s)');
        return myGraph
    }

    makeAccelerationGraph(desiredAspectRatio) {
        let myGraph = new QuantitativeGraph(0, this.currentTime, this.minAcceleration, this.maxAcceleration, desiredAspectRatio);
        this.steps.forEach((step) => {
            myGraph.addSegmentWithCirclesOnEnds(step.initialTime, step.acceleration, step.finalTime, step.acceleration);
        });
        myGraph.labelAxes('time (s)','acceleration (m/s/s)');
        return myGraph
    }

}

/*
crucial position graph points
 - any zero point
 - any point at which the motion changes
 - any max or min point
*/


// two issues:
// the first issue was solved
// 2- the velocity graph requires a forced yMin of 0...and i don't want that!
// 3 - i need to add undefined points to accelration functions
// so examine these issues more please
