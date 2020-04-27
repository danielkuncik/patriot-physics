




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






class Grid extends Diagram {
    constructor(numBoxesHorizontal, numBoxesVertical, thickness, boxWidth, boxHeight) {
        if (numBoxesHorizontal === undefined) {numBoxesHorizontal = 20;}
        if (numBoxesVertical === undefined) {numBoxesVertical = 10;}
        if (thickness === undefined) {thickness = 1;}
        if (boxWidth === undefined) {boxWidth = 1;}
        if (boxHeight === undefined) {boxHeight = 1;}
        super();

        const totalHeight = numBoxesVertical * boxHeight;
        const totalWidth = numBoxesHorizontal * boxWidth;

        let q;
        for (q = 0; q <= numBoxesHorizontal; q++) {
            let newSegment = super.addSegment(new Point(q * boxWidth, 0), new Point((q * boxWidth), totalHeight));
            newSegment.setThickness(thickness);
        }
        for (q = 0; q <= numBoxesVertical; q++) {
            let newSegment = super.addSegment(new Point(0, q * boxHeight), new Point(totalWidth, q * boxHeight));
            newSegment.setThickness(thickness);
        }
    }

    // how do i put something on it?
}


// class GeometryPad extends Diagram {
//     constructor() {
//         super();
//     }
//
//     goldenRatio() {
//         return 1.61803398875
//     }
//
//     // how does the label object work?
//
//     addSegment(pointA, pointB, lineName, labelObject, aboveOrBelow) {
//         super.addSegment(pointA, pointB);
//         if (labelObject[lineName]) {
//             if (aboveOrBelow === 'above') {
//                 super.labelLineAbove(pointA, pointB, labelObject[lineName]);
//             } else if (aboveOrBelow === 'below') {
//                 super.labelLineBelow(pointA, pointB, labelObject[lineName]);
//             }
//         }
//     }
//
//     addRectangle(lowerLeftCorner, width, height, labelObject) {
//         if (lowerLeftCorner === undefined) {
//             lowerLeftCorner = origin;
//         }
//         if (width === undefined) {
//             width = 1;
//         }
//         if (height === undefined) {
//             height = width / this.goldenRatio();
//         }
//         let lowerRightCorner = lowerLeftCorner.translateAndReproduce(width, 0);
//         let upperRightCorner = lowerLeftCorner.translateAndReproduce(width, height);
//         let upperLeftCorner = lowerLeftCorner.translateAndReproduce(0, height);
//
//         this.addSegment(lowerLeftCorner,lowerRightCorner,'bottom',labelObject,'below');
//         this.addSegment(lowerRightCorner,upperRightCorner,'right',labelObject,'below');
//         this.addSegment(upperRightCorner,upperLeftCorner,'top',labelObject,'above');
//         this.addSegment(upperLeftCorner,lowerLeftCorner,'left',labelObject,'above');
//     }
//
//     addSquare(lowerLeftCorner, sideLength, labelObject) {
//         if (sideLength === undefined) {
//             sideLength = 1;
//         }
//         this.addRectangle(lowerLeftCorner, sideLength, sideLength, labelObject);
//     }
//
//     addTriangleFromVerticies(vertexA, vertexB, vertexC, labelObject) {
//         this.addSegment(vertexA, vertexB, 'C', labelObject, 'above');
//         this.addSegment(vertexB, vertexC, 'A', labelObject, 'above');
//         this.addSegment(vertexC, vertexA, 'B', labelObject, 'above');
//     }
//
//     addTriangleSAS(vertexA, side1, angleInDegrees, side2, labelObject) {
//         if (vertexA === undefined) {
//             vertexA = origin;
//         }
//         let vertexB = vertexA.translateAndReproduce(side1, 0);
//         let angleInRadians = convertDegreesToRadians(angleInDegrees);
//         let vertexC = vertexB.translateAndReproduce(-1 * side2 * Math.cos(angleInRadians), side2 * Math.sin(angle));
//         this.addTriangleFromVerticies(vertexA, vertexB, vertexC, labelObject);
//     }
//
//     addTriangleSSS(vertexA, side1, side2, side3, labelObject) {
//         let angleB = this.getAngleFromLawOfCosines(side3, side1, side2); // in degrees
//         this.addTriangleSAS(vertexA, side2, angleB, side2, labelObject);
//
//     }
//
//
//     addTriagnleASA(vertexA, angle1inDegrees, side, angle2inDegrees, labelObject) {
//         if (vertexA === undefined) {
//             vertexA = origin;
//         }
//         let angle1inRadians = convertDegreesToRadians(angle1inDegrees);
//         let angle2inRadians = convertDegreesToRadians(angle2inDegrees);
//     }
//
//     // should these all be objects? // i really don't want it to be that involved...
//     /// whenever i try that, i go down a rabbit hole, i want somehting for making quick geometric diagrams
//     // but i'm thinking this might jsut not work...
// }

