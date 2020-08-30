class MotionMap extends DiagramF {
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
            positionPoints.push(constructPointWithMagnitudeF(magnitude, this.theta));
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



class Compass extends DiagramF {
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
      super.addTwoHeadedArrow(new PointF(-1,0), new PointF(1,0));
      super.addText(this.westLabel,new PointF(-1 - textDisplacement ,0), relativeFontSize);
      super.addText(this.eastLabel, new PointF(1 + textDisplacement, 0), relativeFontSize);
    }
    if (this.vertical) {
      super.addTwoHeadedArrow(new PointF(0,-1), new PointF(0,1));
      super.addText(this.southLabel, new PointF(0, -1 - textDisplacement), relativeFontSize);
      super.addText(this.northLabel, new PointF(0, 1 + textDisplacement), relativeFontSize);
    }

    return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
  }

  addToDiagram(diagram, centerPoint, length) {
    // function to add the object to an existing diagram?
  }

}
