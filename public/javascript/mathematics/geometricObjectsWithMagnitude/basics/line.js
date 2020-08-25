/*
TO DO: (8-12-2020)
- finish making all the functions to create different types of polygons: trapezoid, parallelogram, and regular polygon
- add the polygons to the geometry pad object, so that they all appear there
- read through triangle to make sure it is consistent and nonredundant with polygon
- make square, rectangle, and other types into subclasses of polygon, instead of only functions= especially

- fix triangle area function
 */

/// make units one of the objects!!!!
/*
UNITS UNITS UNITS
- deal with the units of the line, pointA and pointB
*/

class Line {
    constructor(pointA, pointB) {
        if (pointA.getDistanceToAnotherPoint(pointB).zero) {
            console.log('cannot make a line of two of the same point');
            return false
        } else if (!areSameUnit(pointA.x.unit, pointB.x.unit) || !areSameUnit(pointA.y.unit, pointB.y.unit)) {
            console.log('points used to create a line must have identical unit');
            return false
        } else {
          this.xUnit = pointA.x.unit;
          this.yUnit = pointA.y.unit;
        }


        if (pointA.y.isEqual(pointB.y)) { /// horizontal lines
            this.horizontal = true;
            this.vertical = false;
            this.yValue = pointA.y;
            this.slope = 0;
            this.yIntercept = this.yValue;
            this.function = (xMagnitude) => {return this.yValue}
        } else if (pointA.x.isEqual(pointB.x)) { /// vertical lines
            this.vertical = true;
            this.horizontal = false;
            this.xValue = pointA.x;
            this.slope = Infinity;
            this.function((xMagnitude) => {return undefined})
            // this.function = (x) => {return undefined} not very relevant
        } else { /// diagonal lines
            this.vertical = true;
            this.horizontal = false;
            this.slope = (pointB.y.subtractMag(pointA.y)).divideMag(pointB.x.subtractMag(pointA.x));
            this.yIntercept = pointA.y.subtractMag(this.slope.multiplyMag(pointA.x));
            this.function = (xMagnitude) => {return this.yIntercept.addMag(this.slope.multiplyMag(xMagnitude))}
        }
    }

    isPointOnLine(point, numSigFigs) { // UNTESTED
        if (this.horizontal) {
            return point.y.isEqual(this.value, numSigFigs)
        } else if (this.vertical) {
            return point.x.isEqual(this.value, numSigFigs)
        } else {
            const x = point.x;
            const y1 = point.y;
            const y2 = this.function(x);
            return y1.isEqual(y2, numSigFigs);
        }
    }

    inverseFunction(yValue) {
        if (this.horizontal) {
            return undefined
        } else if (this.vertical) {
            return this.xValue
        } else {
            return (yValue.subtractMag(this.yIntercept).divideMag(this.slope)
        }
    }

    findParallelLine(outsidePoint) {
        let pointB;
        if (isPointOnLine(outsidePoint)) {
          return undefined
        }
        if (this.horizontal) {
            pointB = new Point(outsidePoint.x.addMag(new Magnitude(`1e${this.orderOfMagnitude}`,this.xUnit,undefined, true )),outsidePoint.y);
        } else if (this.vertical) {
            pointB = new Point(outsidePoint.x,outsidePoint.y.addMag(new Magnitude(`1e${this.orderOfMagnitude}`,this.yUnit,undefined,true));
        } else {
            const delta_x = new Magnitude(`1e${this.orderOfMagnitude}`,this.xUnit,undefined, true );
            const delta_y = delta_x.multiplyMag(this.slope); /// should have same unit as y, based on how units combine
            pointB = new Point(outsidePoint.x.addMag(delta_x), outsidePoint.y.addMag(delta_y));
        }
        return new Line(outsidePoint, pointB)
    }

    // for any point outside aline, there is one point perpendicular to that point
    findPerpendicularLine(outsidePoint) {
        let pointB;
        if (isPointOnLine(outsidePoint)) {
          return undefined
        }
        if (this.horizontal) {
            pointB = new Point(outsidePoint.x, outsidePoint.y.addMag(new Magnitude(`1e${this.orderOfMagnitude}`,this.yUnit,undefined,true));
        } else if (this.vertical) {
            pointB = new Point(outsidePoint.x.addMag(new Magnitude(`1e${this.orderOfMagnitude}`,this.xUnit,undefined, true )), outsidePoint.y);
        } else {
            const newSlope = this.slope.inverse().reverseSign();
            const delta_x = new Magnitude(`1e${this.orderOfMagnitude}`,this.xUnit,undefined, true );
            const delta_y = delta_x.multiplyMag(newSlope);
            pointB = new Point(outsidePoint.x.addMag(delta_x), outsidePoint.y.addMag(delta_y));
        }
        return new Line(outsidePoint, pointB)
    }

    isParallel(anotherLine, numSigFigs) {
      return this.slope.isEqual(anotherLine.slope, numSigFigs)
    }

    findIntersectionWithAnotherLine(anotherLine) {
        if (this.isParallel(anotherLine)) {
          return undefined
        }

        if (this.vertical) {
            if (anotherLine.horizontal) {
                return new Point(this.xValue, anotherLine.yValue); /// is this line redundant?
            } else {
                return new Point(this.xValue, anotherLine.function(this.xValue));
            }
        } else if (this.horizontal) {
            if (anotherLine.vertical) {
                return new Point(anotherLine.xValue, this.yValue);  /// is this line redundant? this possiblity is already included int he findY Value for XVlaye funcion
            } else {
                return new Point(anotherLine.inverseFunction(this.yValue), this.yValue);
            }
        } else {
            if (anotherLine.vertical) {
                return new Point(anotherLine.xValue, this.function(anotherLine.xValue));
            } else if (anotherLine.horizontal) {
                return new Point(this.function(anotherLine.yValue), anotherLine.yValue);
            } else {
                const newX = (anotherLine.yIntercept.subtractMag(this.yIntercept)).divideMag(this.slope.subtractMag(anotherLine.slope));
                const newY = this.slope.multiplyMag(newX).addMag(this.yIntercept);
                return new Point(newX, newY)
            }
        }
    }
}

/// redo these with magnitudes
function constructLineSlopeIntercept(slope, yIntercept) {
    let pointA = new Point(constructZeroMagnitude(undefined, true), yIntercept);
    //// here, i need to get the x unit!!!
    const yUnit = yIntercept.unit;
    const xUnit = yUnit.divideUnit(slope.unit);
    const delta_x = new Magnitude(`1e${slope.orderOfMagnitude}`,xUnit,undefined, true);
    const delta_y = delta_x.multiplyMag(slope);
    let pointB = new Point(delta_x, yIntercept.addMag(delta_y));
    return new Point(pointA, pointB)
}

function constructVerticalLine(xValue, yUnit) {
    return new Line(new Point(xValue, new Magnitude('0',yUnit, undefined, true)), new Point(xValue, new Magnitude('1', yUnit, undefined, true));
}

function constructHorizontalLine(yValue, xUnit) {
    return new Line(new Point(new Magnitude('0',xUnit, undefined, true), yValue), new Point(new Magnitude('1',xUnit, undefined, true), yValue);
}

/// still need to make this work!!!!
function constructLineFromPointAndAngle(point = makeOrigin(), angle) {

    let pointB = new Point(point.x + Math.cos(angleInRadians), point.y + Math.sin(angleInRadians));
    return new Line(point, pointB);
}
