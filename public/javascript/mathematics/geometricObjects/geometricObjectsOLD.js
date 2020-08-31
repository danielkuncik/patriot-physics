/*
TO DO: (8-12-2020)
- finish making all the functions to create different types of polygons: trapezoid, parallelogram, and regular polygon
- add the polygons to the geometry pad object, so that they all appear there
- read through triangle to make sure it is consistent and nonredundant with polygon
- make square, rectangle, and other types into subclasses of polygon, instead of only functions= especially

- fix triangle area function
 */


 function convertDegreesToRadians(angle) {
     return angle / 180 * Math.PI;
 }

 function convertRadiansToDegrees(angle) {
     return angle / Math.PI * 180;
 }

 // turns a string in text to an appropriate angle in radians
 function turnTextToRadians(text) {
     var theta;
     switch(text) {
         case 'right':
             theta = 0;
             break;
         case 'left':
             theta = Math.PI;
             break;
         case 'up':
             theta = Math.PI / 2;
             break;
         case "down":
             theta = Math.PI * 3 / 2;
             break;
         case "east":
             theta = 0;
             break;
         case "west":
             theta = Math.PI;
             break;
         case "north":
             theta = Math.PI / 2;
             break;
         case "south":
             theta = Math.PI * 3 / 2;
             break;
         default:
             theta = undefined;
             break;
     }
     return theta;
 }



class PointF {
    constructor(x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;
        //    this.uuid = create_UUID();
    }

    setName(newName) {
        this.name = newName;
    }

    translate(xTranslation, yTranslation) {
        this.x += xTranslation;
        this.y += yTranslation;
    }

    translatePolar(radius, directionInRadians) {
        let xTranslation = radius * Math.cos(directionInRadians);
        let yTranslation = radius * Math.sin(directionInRadians);
        this.translate(xTranslation, yTranslation);
    }

    translateAbsolute(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    translateAndReproduce(xTranslation, yTranslation) {
        let newX = this.x + xTranslation;
        let newY = this.y + yTranslation;
        let newPoint = new PointF(newX, newY);
        return newPoint
    }

    translateAndReproducePolar(length, thetaInRadians) {
        let xTranslation = length * Math.cos(thetaInRadians);
        let yTranslation = length * Math.sin(thetaInRadians);
        let newPoint = new PointF(this.x + xTranslation, this.y + yTranslation);
        return newPoint
    }

    // creates a new point by rotating the canvas, then translating
    // does not work if rotation is negative
    transformAndReproduce(rotation, xTranslation, yTranslation) {
        let xPrime = xTranslation * Math.cos(rotation) - yTranslation * Math.sin(rotation) + this.x;
        let yPrime = yTranslation * Math.cos(rotation) + xTranslation * Math.sin(rotation) + this.y;
        // let newX = this.x + xTranslation * Math.cos(rotation) + yTranslation * Math.sin(rotation);
        // let newY = this.y + xTranslation * Math.sin(rotation) - yTranslation * Math.cos(rotation);
        // let newPoint = new Point(newX, newY);
        let newPoint = new PointF(xPrime, yPrime);
        return newPoint
    }

    // rotates a Point around the center Point by a certain angle
    // default center Point is origin
    rotate(rotationAngleInRadians, centerRotationPoint) {
        if (centerRotationPoint === undefined) {centerRotationPoint = origin;}
        this.translate(-1 * centerRotationPoint.x, -1 * centerRotationPoint.y);
        let xPrime = this.x * Math.cos(rotationAngleInRadians) - this.y * Math.sin(rotationAngleInRadians);
        let yPrime = this.y * Math.cos(rotationAngleInRadians) + this.x * Math.sin(rotationAngleInRadians);
        this.x = xPrime;
        this.y = yPrime;
        this.translate(centerRotationPoint.x, centerRotationPoint.y);
    }

    rescaleSingleFactor(scaleFactor) {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
    }


    rescaleDoubleFactor(xFactor, yFactor) {
        this.x *= xFactor;
        this.y *= yFactor;
        // doesn't work well if the diagram includes circles and arcs!
        // and the point must be coordinated with these!
    }

    reflectAboutXAxis() {
        this.y *= -1;
    }

    getQuadrant() {
        if (Math.abs(this.x) < 1e-10 && Math.abs(this.y) < 1e-10) {return '0';} // change this name?
        else if (this.x > 0 && Math.abs(this.y) < 1e-10 ) {return '+X';}
        else if (this.x < 0 && Math.abs(this.y) < 1e-10 ) {return '-X';}
        else if (Math.abs(this.x) < 1e-10 && this.y > 0) {return '+Y';}
        else if (Math.abs(this.x) < 1e-10 && this.y < 0) {return '-Y';}
        else if (this.x > 0 && this.y > 0) {return '1';}
        else if (this.x < 0 && this.y > 0) {return '2';}
        else if (this.x < 0 && this.y < 0) {return '3';}
        else if (this.x > 0 && this.y < 0) {return '4';}
        else {return false;}
    }

    // returns the angle in radians between the x-axis and a line Segment from the origin to this Point
    // returns angles theta such that 0 <= theta < 2pi
    // remake this using sqwitch?
    getAngleToHorizontal() {
        let theta;
        const quadrant = this.getQuadrant();
        if (quadrant === '1') {theta = Math.atan(this.y / this.x);}
        /// inefficient, but very reliable
        else if (quadrant === '2') {theta = Math.PI / 2 + Math.atan(-1 * this.x / this.y);}
        else if (quadrant === '3') {theta = Math.PI + Math.atan((-1 * this.y) / (-1 * this.x));}
        else if (quadrant === '4') {theta = Math.PI * 3 / 2 + Math.atan(this.x / (-1 *  this.y));}
        else if (quadrant === '+X') {theta = 0;}
        else if (quadrant === '-X') {theta = Math.PI;}
        else if (quadrant === '+Y') {theta = Math.PI / 2;}
        else if (quadrant === '-Y') {theta = 3 * Math.PI / 2;}
        else theta = undefined;
        return theta
    }

    getMagnitude() {
        return Math.sqrt(this.x**2 + this.y**2)
    }

    getDistanceToAnotherPoint(anotherPoint) {
        return Math.sqrt((this.x - anotherPoint.x)**2 + (this.y - anotherPoint.y)**2);
    }

    /// if this Point were the origin, returns the angle to the horizontal of the other Point
    // returns angles theta such that 0 <= theta < 2pi
    getAngleToAnotherPoint(anotherPoint) {
        anotherPoint.translate(-1 * this.x, -1 * this.y);
        let theta = anotherPoint.getAngleToHorizontal();
        anotherPoint.translate(this.x, this.y);
        return theta;
    }

    isEqualToAnotherPoint(anotherPoint) {
        if ((this.x === anotherPoint.x) && (this.y === anotherPoint.y)) {
            return true
        } else {
            return false
        }
    }

    // if this Point were the origin
    // in what quadrant woul the other Point be?
    getQuadrantOfAnotherPoint(anotherPoint) {
        anotherPoint.translate(-1 * this.x, -1 * this.y);
        let quadrant = anotherPoint.getQuadrant();
        anotherPoint.translate(this.x, this.y);
        return quadrant;
    }

    // returns a new Point
    // on the ray beginning at this Point and pointing toward anotherPoint
    // at a distance the length between the points * proportion
    // so if propotion = 0.5, it will be halfway between the points
    // and if proportion = 2, it will be twice as far away as the other Point (so it can actually interpolate and extrapolate)
    interpolate(anotherPoint, proportion) {
        let theta = this.getAngleToAnotherPoint(anotherPoint);
        let L = this.getDistanceToAnotherPoint(anotherPoint) * proportion;
        let x = this.x + L * Math.cos(theta);
        let y = this.y + L * Math.sin(theta);
        return new PointF(x, y);
    }

    // returns a new Point which is a particular length away at angle theta
    getAnotherPointWithTrig(length, thetaInRadians) {
        let newX, newY;
        newX = this.x + length * Math.cos(thetaInRadians);
        newY = this.y + length * Math.sin(thetaInRadians);
        return new PointF(newX,newY)
    }

    // returns an angle theta in Radians
    // of  a line that is perpendicular to the line between this point and another point
    getPerpendicularAngle(anotherPoint) {
        let theta = this.getAngleToAnotherPoint(anotherPoint);
        theta += Math.PI / 2;
        if (theta > Math.PI * 2) {
            theta -= Math.PI * 2;
        }
        return theta;
    }

    // gives x and y components of a vector made from this vector and another point
    getComponentsToAnotherPoint(anotherPoint, axisRotationInRadians) {
        if (axisRotationInRadians === undefined) {axisRotationInRadians = 0;}
        let xComponent, yComponent;
        let theta = this.getAngleToAnotherPoint(anotherPoint);
        let L = this.getDistanceToAnotherPoint(anotherPoint);
        xComponent = L * Math.cos(theta);
        yComponent = L * Math.sin(theta);
        return  {
            xComponent: xComponent,
            yComponent: yComponent
        }
    }
}


// global variable origin
const origin = new PointF(0,0);
/// in creating triangles
/// the point 'origin' has caused lots of problems
// so i added the function below as an alternative
/// EXPLORE THIS!!!

function makeOriginF() {
    return new PointF(0,0);
}

function constructPointWithMagnitudeF(magnitude, angleInRadians) {
    let x = magnitude * Math.cos(angleInRadians);
    let y = magnitude * Math.sin(angleInRadians);
    let newPoint = new PointF(x, y);
    return newPoint;
}


class LineF {
    constructor(pointA, pointB) {
        if (pointA.getDistanceToAnotherPoint(pointB) < 1e-10) {
            console.log('cannot make a line of two of the same point');
            return false
        } else if (Math.abs(pointA.y - pointB.y) < 1e-10) {
            this.horizontal = true;
            this.yValue = pointA.y;
            this.slope = 0;
            this.yIntercept = this.yValue;
            this.function = (x) => {return this.yValue}
        } else if (Math.abs(pointA.x - pointB.x) < 1e-10) {
            this.vertical = true;
            this.xValue = pointA.x;
            this.slope = Infinity;
            // this.function = (x) => {return undefined} not very relevant
        } else {
            this.slope = (pointB.y - pointA.y) / (pointB.x - pointA.x);
            this.yIntercept = pointA.y - this.slope * pointA.x;
            this.function = (x) => {return this.yIntercept + this.slope * x}
        }
    }

    isPointOnLine(point) { // UNTESTED
        if (this.horizontal) {
            if (point.y === this.yValue) {
                return true
            } else {
                return false
            }
        } else if (this.vertical) {
            if (point.x === this.xValue) {
                return true
            } else {
                return  false
            }
        } else {
            if (Math.abs(this.function(point.x) - point.y) < 1e-10) {
                return true
            } else {
                return false
            }
        }
    }

    findYValueForXValue(xValue) {
        if (this.horizontal) {
            return this.yValue
        } else if (this.vertical) {
            return undefined
        } else {
            return this.yIntercept + this.slope * xValue;
        }
    }
    findXValueForYValue(yValue) {
        if (this.horizontal) {
            return undefined
        } else if (this.vertical) {
            return this.xValue
        } else {
            return (yValue - this.yIntercept) / this.slope
        }
    }

    findParallelLine(outsidePoint) {
        let pointB;
        if (this.horizontal) {
            pointB = new PointF(outsidePoint.x + 1,outsidePoint.y);
        } else if (this.vertical) {
            pointB = new PointF(outsidePoint.x,outsidePoint.y + 1);
        } else {
            const deltaX = 1;
            const deltaY = this.slope * deltaX;
            pointB = new PointF(outsidePoint.x + deltaX, outsidePoint.y + deltaX);
        }
        return new LineF(outsidePoint, pointB)
    }

    // for any point outside aline, there is one point perpendicular to that point
    findPerpendicularLine(outsidePoint) {
        let pointB;
        if (this.horizontal) {
            pointB = new PointF(outsidePoint.x, outsidePoint.y + 1);
        } else if (this.vertical) {
            pointB = new PointF(outsidePoint.x + 1, outsidePoint.y);
        } else {
            let newSlope = -1 / this.slope;
            const deltaX = 1;
            const deltaY = newSlope * deltaX;
            pointB = new PointF(outsidePoint.x + deltaX, outsidePoint.y + deltaX);
        }
        return new LineF(outsidePoint, pointB)
    }

    findIntersectionWithAnotherLine(anotherLine) {
        if (this.slope === anotherLine.slope) {
            return undefined
        } else if (this.vertical) {
            if (anotherLine.horizontal) {
                return new PointF(this.xValue, anotherLine.yValue); /// is this line redundant?
            } else {
                return new PointF(this.xValue, anotherLine.findYValueForXValue(this.xValue));
            }
        } else if (this.horizontal) {
            if (anotherLine.vertical) {
                return new PointF(anotherLine.xValue, this.yValue);  /// is this line redundant? this possiblity is already included int he findY Value for XVlaye funcion
            } else {
                return new PointF(anotherLine.findXValueForYValue(this.yValue), this.yValue);
            }
        } else {
            if (anotherLine.vertical) {
                return new PointF(anotherLine.xValue, this.findYValueForXValue(anotherLine.xValue));
            } else if (anotherLine.horizontal) {
                return new PointF(this.findXValueForYValue(anotherLine.yValue), anotherLine.yValue);
            } else {
                let newX = (anotherLine.yIntercept - this.yIntercept) / (this.slope - anotherLine.slope);
                let newY = this.slope * newX + this.yIntercept;
                return new PointF(newX, newY)
            }
        }
    }
}

function constructLineSlopeInterceptF(slope, yIntercept) {
    let pointA = new PointF(0, yIntercept);
    let pointB = new PointF(1, yIntercept + 1 * slope);
    return new PointF(pointA, pointB)
}

function constructVerticalLineF(xValue) {
    return new LineF(new PointF(xValue, 0), new PointF(xValue, 1));
}

function constructHorizontalLineF(yValue) {
    return new LineF(new PointF(0, yValue), new PointF(yValue, 1));
}

function constructLineFromPointAndAngleF(point, angleInRadians) {
    let pointB = new PointF(point.x + Math.cos(angleInRadians), point.y + Math.sin(angleInRadians));
    return new LineF(point, pointB);
}

// // IMPROVE THIS, make this relevant!
// class Ray {
//     constructor(startPoint, slope) {
//         this.startPoint = startPoint;
//         this.slope = slope;
//     }
//     //
//     // turnIntoLine() {
//     //     return constructLineFromPointAndAngle(pointB, this.angleInRaidans);
//     // }
// }
//
// function constructRayFromTwoPoints(startPoint, outsidePoint) {
//     let slope = (outsidePoint.y - startPoint.y) / (outsidePoint.x - startPoint.x);
//     return new Ray(startPoint, slope)
// }


class SegmentF {
    constructor(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
        this.thickness = 2;
        this.color = "#000000";
        this.cap = "butt";
        this.dotted = false;
        this.dashed = false;

        this.line = new LineF(point1, point2); // a corresponding infinite line through this point
    }

    // do i want thickness to scale with the rest of the image??
    // right now, line thickness is the only thing that does not scale
    setThickness(newThickness) {
        this.thickness = newThickness;
    }

    isHorizontal() {
        if (this.line.horizontal) {
            return true
        } else {
            return false
        }
    }
    isVertical() {
        if (this.line.vertical) {
            return true
        } else {
            return false
        }
    }

    setColor(newColor) {
        this.color = newColor;
    }

    getLength() {
        return this.point1.getDistanceToAnotherPoint(this.point2);
    }

    /// i need a way to customize dot sizes and dash sizes!!!
    /// right now, it is set to 1/30 times the average of the width and height of the whole canvas!
    turnIntoDottedLine() {
        this.dotted = true;
        this.setThickness(1);
    };

    turnIntoDashedLine() {
        this.dashed = true;
    }

    // if Point 1 were the origin, returns the angle to the horizontal of Point 2
    // returns angles theta such that 0 <= theta < 2pi
    getAngleToHorizontal() {
        return this.point1.getAngleToAnotherPoint(this.point2);
    }

    getPerpendicularAngle() {
        return this.point1.getPerpendicularAngle(this.point2);
    }

    // gets slope of line
    // if line is vertical, returns 1e10, rather than infinity
    getSlope() {
        let slope = (this.point2.y - this.point1.y) / (this.point2.x - this.point1.x);
        if (slope >= 1e0) {slope = 1e10;}
        return slope
    }

    // gets the slope of a line perpendicular to this line
    getPerpendicularSlope(point1, point2) {
        const originalSlope = getSlope(point1, point2);
        if (originalSlope >= 1e10) {return 0;} // due to floating Point arithmetic, a slope zero usually doesn't actually come out as zero!
        else if (originalSlope <= 1e-10) {return 1e10;} // if it returned Infinity, could lead to NaNs in later calculations
        else {return -1 / originalSlope;}
    }


    isPointOnSegment(point) { // UNTESETD
        if (this.line.isPointOnLine(point)) {
            if (this.isVertical()) {
                let firstY;
                let secondY;
                if (this.point1.y <= this.point2.y) {
                    firstY = this.point1.y;
                    secondY = this.point2.y;
                } else {
                    firstY = this.point2.y;
                    secondY = this.point1.y;
                }
                if (point.y >= firstY && point.y <= secondY) {
                    return true
                } else {
                    return false
                }
            } else { // a point is on this segment if it intersects the line and it is within the domain of this segment
                let firstX;
                let secondX;
                if (this.point1.x <= this.point2.x) {
                    firstX = this.point1.x;
                    secondX = this.point2.x;
                } else {
                    firstX = this.point2.x;
                    secondX = this.point1.x;
                }
                if (point.x >= firstX && point.x <= secondX) {
                    return true
                } else {
                    return false
                }
            }
        } else {
            return false
        }
    }

    intersectionWithAnotherSegment(anotherSegment) { // UNTESTED
        const intersectionPoint  = this.line.findIntersectionWithAnotherLine(anotherSegment.line);
        if (!intersectionPoint) {
            return false
        }
        if (this.isPointOnSegment(intersectionPoint) && anotherSegment.isPointOnSegment(intersectionPoint)) {
            return intersectionPoint
        }
    }

}

class CircleF {
    constructor(centerPoint, radius) {
        //this.centerPoint = centerPoint;
        this.radius = radius;
        this.filled = false;
        this.lineThickness = 2;
        this.lineColor = "#000000";
        this.fillColor = "#000000";
        this.center = centerPoint;
        this.rangeBox = constructRangeBoxFromCenterF(centerPoint, radius * 2, radius * 2);
    }

    setFillColor(newColor) {
        this.fillColor = newColor;
    }

    fill() {
        this.filled = true;
    }

    fillWhite() {
        this.setFillColor('#FFFFFF')
        this.fill();
    }

    unfill() {
        this.filled = false;
    }

    rescaleSingleFactor(scaleFactor) {
        this.radius *= scaleFactor; // why is there a /2??? i don't know, but it is necessary for it to work
    }

    rescaleDoubleFactor(xFactor, yFactor) {
        if (xFactor <= yFactor) {
            this.radius *= xFactor;
        } else {
            this.radius *= yFactor;
        }
    }

}


// converts an angle that is outside the range of 0 to 2pi into that range
function simplifyAngleF(angleInRadians) {
    while (angleInRadians < 0) {
        angleInRadians += 2 * Math.PI;
    }
    while (angleInRadians >= Math.PI * 2) {
        angleInRadians -= 2 * Math.PI;
    }
    return angleInRadians
}

// start radians and end radians are based on starting at +X and going counter-clockwise
// always counterclockwise!
class ArcF {
    constructor(centerPoint, radius, startRadians, endRadians) {
        this.center = centerPoint;
        this.radius = radius;
        startRadians = simplifyAngleF(startRadians); // if the angle is outside the 0 to 2 pi range, converts into that range
        endRadians = simplifyAngleF(endRadians);
        if (startRadians === endRadians) {
            return false
        }
        this.startRadians = startRadians;
        this.endRadians = endRadians;
        if (this.startRadians < this.endRadians) {
            this.lesserAngle = this.startRadians;
            this.greaterAngle = this.endRadians;
            this.crossZeroLine = false;
        } else {
            this.greaterAngle = this.startRadians;
            this.lesserAngle = this.endRadians;
            this.crossZeroLine = true;
        }

        // not quite perfect, look at some cases
        this.rangeBox = constructRangeBoxFromExtremePointsF(this.getMinX(), this.getMinY(), this.getMaxX(), this.getMaxY());
    }

    // gets the closest point to a particular angle on
    getClosestPointToAngleAbsolute(angle) {  // need to do some different things if crossing the zero line
        return getAngleClosestToArc(this.startRadians, this.endRadians, angle)
    }

    // this is infuriating 4-17-2020
    // i need to create a set of unit tests for this function, bc it's a mess
    // TDD is the only way to make this work

    getMinIndexOfArray(array) {
        if (array.length === 0) {
            return undefined
        }
        let min = array[0];
        let min_i = 0;
        let i;
        for (i = 1; i < array.length; i++) {
            if (array[i] < min) {
                min = array[i];
                min_i = i;
            }
        }
        return  min_i
    }

    // returns the point, in radians, on this particular arc, that is closest to some other angle in radians
    // I need to write many unit tests for this function
    getClosestPointToAngle(angle) {
        let options = [this.getClosestPointToAngleAbsolute(angle), this.getClosestPointToAngleAbsolute(angle + Math.PI * 2), this.getClosestPointToAngleAbsolute(angle - Math.PI * 2)];
        let optionScores = [Math.abs(options[0] - angle), Math.abs(options[1] - (angle + Math.PI * 2)), Math.abs(options[2] - (angle - Math.PI * 2))];
        let index = this.getMinIndexOfArray(optionScores);
        return options[index];
    }

    getMaxY() {
        let highestAngle = this.getClosestPointToAngle(Math.PI / 2);
        return this.center.y + this.radius * Math.sin(highestAngle);
    }

    getMinY() {
        let lowestAngle = this.getClosestPointToAngle(Math.PI * 3 / 2);
        return this.center.y + this.radius * Math.sin(lowestAngle);
    }

    getMaxX() {
        let farthestRightAngle = this.getClosestPointToAngle(0);
        return this.center.x + this.radius * Math.cos(farthestRightAngle);
    }

    getMinX() {
        let farthestLeftAngle = this.getClosestPointToAngle(Math.PI);
        return this.center.x + this.radius * Math.cos(farthestLeftAngle);
    }

    rescaleSingleFactor(scaleFactor) {
        this.radius *= scaleFactor; // why is there a /2??? i don't know, but it is necessary for it to work
    }

    rescaleDoubleFactor(xFactor, yFactor) {
        // this.elipse = true; // can make it elliptical if i want
        // this.xRadius= this.radius * xFactor;
        // this.yRadius = this.radius * yFactor;
        if (xFactor <= yFactor) {
            this.radius *= xFactor;
        } else {
            this.radius *= yFactor;
        }
    }

}


function getAngleFromLawOfCosines(oppositeSide, adjacentSide1, adjacentSide2) {
    let cosine = (adjacentSide1**2 + adjacentSide2**2 - oppositeSide**2) / 2 / adjacentSide1 / adjacentSide2;
    while (cosine > 1) {
        cosine -= 1;
    }
    while (cosine < -1) {
        cosine += 1;
    }
    const angleInRadians = Math.acos(cosine);
    return convertRadiansToDegrees(angleInRadians);
}


// always returns the interior angle!!
function getAngleOfTwoRaysF(outsidePointA, vertex, outsidePointB) {
    const c = outsidePointA.getDistanceToAnotherPoint(outsidePointB);
    const a = vertex.getDistanceToAnotherPoint(outsidePointA);
    const b = vertex.getDistanceToAnotherPoint(outsidePointB);

    let cosTheta = (a**2 + b**2 - c**2) / (2 * a * b);
    return Math.acos(cosTheta)
}


/// covers all polygons with 4 or greater sides
// DOES NOT include triangles, because they have a different set of methods
/// counterclockwise convention: the side that is counterclockwise of each vertex has the same name as that vertex
// counterclockwise convention: the angle counterclockwise on each vertex has the same name as that vertex
class PolygonF {
    constructor(arrayOfVertices) {
        if (arrayOfVertices.length <= 2) {
            console.log('Must have greater than 2 vertices to create polygon!');
            return false
        } else {
            this.polygon = true;
            this.vertices = arrayOfVertices;
            this.calculateParameters();
        }
        this.orientation = 'clockwise'; // default orientation
    }

    setOrientationClockwise() {
        this.orientation = 'clockwise';
    }

    setOrientationCounterclockwise() {
        this.orientation = 'counterclockwise';
    }

    calculateParameters() {
        this.lengths = [];
        this.angles = [];
        let i;
        const penultimateVertex = this.vertices[this.vertices.length - 2];
        const lastVertex = this.vertices[this.vertices.length - 1];
        const firstVertex = this.vertices[0];
        const secondVertex = this.vertices[1];
        this.lengths.push(firstVertex.getDistanceToAnotherPoint(secondVertex));
        this.angles.push(convertRadiansToDegrees(getAngleOfTwoRaysF(lastVertex,firstVertex,secondVertex)));
        for (i = 1; i < this.vertices.length - 1; i++ ) {
            const previousVertex = this.vertices[i - 1];
            const thisVertex = this.vertices[i];
            const nextVertex = this.vertices[i + 1];
            this.lengths.push(thisVertex.getDistanceToAnotherPoint(nextVertex));
            this.angles.push(convertRadiansToDegrees(getAngleOfTwoRaysF(previousVertex, thisVertex, nextVertex))); // always returns the interior angle!!!! WILL NOT WORK FOR CONVEX polygons
        }
        this.lengths.push(lastVertex.getDistanceToAnotherPoint(firstVertex));
        this.angles.push(convertRadiansToDegrees(getAngleOfTwoRaysF(penultimateVertex, lastVertex, firstVertex)));

    }

    //returns three points with the vertex of the given index in the middle
    getThreeVertices(index) {
        let points;
        if (index === 0) {
            points = [ this.vertices[this.vertices.length - 1], this.vertices[0], this.vertices[1]];
        } else if (index === this.vertices.length - 1) {
            points = [this.vertices[index - 1], this.vertices[index], this.vertices[0]];
        } else if (index > this.vertices.length - 1) {
            console.log('ERROR: index given out of range');
        } else {
            points = [this.vertices[index - 1], this.vertices[index], this.vertices[index + 1]];
        }
        return points
    }

    // rotates vertices counterclockwise
    // the previous vertex0 becomes vertex1, the previous vertex1 becomes vertex2 etc.
    // the previous final vertex becomes vertex0
    rotateVertices() {
        if (this.vertices.length === 3) {
            console.log('ERROR: using rotateVerticies for triangle, use rotateTriangleVerticies function')
        }
        const oldVertexArray = this.vertices;
        const oldLengthArray = this.lengths;
        const oldAngleArray = this.angles;

        let newVertexArray = oldVertexArray[oldVertexArray.length - 1];
        let newLengthArray = oldLengthArray[oldVertexArray.length - 1];
        let newAngleArray = oldAngleArray[oldVertexArray.length - 1];

        let j;
        for (j = 1; j < oldVertexArray.length - 1; j++) {
            newVertexArray.push(oldVertexArray[j - 1]);
            newLengthArray.push(oldLengthArray[j - 1]);
            newAngleArray.push(oldAngleArray[j - 1]);
        }
        this.vertices = newVertexArray;
        this.lengths = newLengthArray;
        this.angles = newAngleArray;
    }


    rotateAboutPoint(angleInDegrees, centerPoint) {
      const theta = convertDegreesToRadians(angleInDegrees);
      this.vertices.forEach((vertex) => {
        console.log(vertex, centerPoint);
        vertex.rotate(theta, centerPoint);
      });
    }
}



/*
still must complete:
- trapezoid
- parallelogram
- regular polygon
 */



/// THESE ALL NEED TO BE A COUNTERCLOCKWISE ORIENTATION!!!!
function rhombusF(sideLength, angle1inDegrees, vertex0 = makeOriginF()) {
    const angle1inRadians = convertDegreesToRadians(angle1inDegrees);
    const angle2inRadians = Math.PI - angle1inRadians;
    const vertex1 = vertex0.translateAndReproducePolar(sideLength, Math.PI / 2 - angle1inRadians / 2);
    const vertex3 = vertex0.translateAndReproducePolar(sideLength, Math.PI / 2 + angle1inRadians / 2);
    const vertex2 = vertex3.translateAndReproducePolar(sideLength, angle2inRadians / 2);
    return new PolygonF([vertex0, vertex1, vertex2, vertex3]);
}

function trapezoidF(base1, base2, lowAngle1inDegrees, lowAngle2inDegrees, vertex0 = makeOriginF()) {
    const vertex1 = new PointF(vertex0.x + base1, vertex0.y);
    //// NOT SURE WHERE TO GO FROM HERE!
}

function isoscelesTrapezoidF(base1, base2, lowAngleInDegrees, vertex0) {
    return trapezoidF(base1, base2, lowAngleInDegrees, lowAngleInDegrees, vertex0)
}


/// THESE ALL NEED TO BE A COUNTERCLOCKWISE ORIENTATION!!!!
function rightTrapezoidF(base1, base2, height, vertex0 = makeOriginF()) {
    const vertex1 = vertex0.translateAndReproduce(0,height);
    const vertex2 = vertex3.translateAndReproduce(base2,0);
    const vertex3 = vertex0.translateAndReproduce(base1,0);
    return new PolygonF([vertex0,vertex1,vertex2,vertex3])
}

function parallelogramF() {

}

function regularPentagonF(sideLength) {
    return constructRegularPolygonF(5, sideLength)
}

function homePlateF(scaleFactor, vertex0 = makeOriginF()) {
    const base = 17 * scaleFactor; // based on MLB official rules
    const height = 8.5 * scaleFactor;
    const topSides = 12 * scaleFactor;
    const theta = Math.acos(base / 2 / topSides);

    const vertex4 = vertex0.translateAndReproduce(base,0);
    const vertex3 = vertex1.translateAndReproducePolar(0,height);
    const vertex1 = vertex0.translateAndReproducePolar(0,height);
    const vertex2 = vertex4.translateAndReproducePolar(topSides, theta);
    return new PolygonF([vertex0, vertex1, vertex2, vertex3, vertex4]);
}

function regularHexagonF(sideLength) {
    return constructRegularPolygonF(6, sideLength)

}

function regularOctagonF(sideLength) {
    return constructRegularPolygonF(8, sideLength)
}


//// INCOMPLETE!!!!!!!
function constructRegularPolygonF(nSides, sideLength, vertex0 = makeOriginF()) {
    const theta =  convertDegreesToRadians((nSides - 2) * 180 / nSides);
    this.currentAngle = 0;
    let i;
    let vertexArray = [vertex0];
    for (i = 0; i < nSides; i++) {
        let phi = undefined;
        /// figure out a recursive function that always gives the next angle, relative to the horizontal, of a regular polygon
        vertexArray.push(vertexArray[i].translateAndReproducePolar(sideLength,phi));
    }
    return new PolygonF(vertexArray)
}


/// should I make this a subclass of polygon?????
/// there isn't anything about these methods that make it inconsistent with the methods of polygon!!
// triangle can be a subclass of polygon, with verxtexA, vertexB, and vertexC => none of these variables are defined in the polygon method!
// and many of the methods are consistent
class TriangleF extends PolygonF {
    constructor(vertexA, vertexB, vertexC) {
        super([vertexA, vertexB, vertexC]);

        this.vertexA = vertexA;
        this.vertexB = vertexB;
        this.vertexC = vertexC;

        this.triangle = true;


        this.calculateTriangleParameters();

        // i took this out
        // this.setRightTriangleConvention(); // if right triangle, automatically sets the 90 degree vertex to C;

        this.recommendedFontSize = (this.sideLengthA + this.sideLengthB + this.sideLengthC) / 3 * .2;

        this.area = this.calculateArea();
    }

    calculateTriangleParameters() {

        this.sideLengthA = this.vertexB.getDistanceToAnotherPoint(this.vertexC);
        this.sideLengthB = this.vertexA.getDistanceToAnotherPoint(this.vertexC);
        this.sideLengthC = this.vertexA.getDistanceToAnotherPoint(this.vertexB);

        this.angleA = getAngleFromLawOfCosines(this.sideLengthA, this.sideLengthB, this.sideLengthC);
        this.angleB = getAngleFromLawOfCosines(this.sideLengthB, this.sideLengthC, this.sideLengthA);
        this.angleC = 180 - this.angleA - this.angleB;

        this.right = this.isRightTriangle();

        this.segmentA = new SegmentF(this.vertexB, this.vertexC);
        this.segmentB = new SegmentF(this.vertexC, this.vertexA);
        this.segmentC = new SegmentF(this.vertexA, this.vertexB);
    }

    // renames the verticies
    // A becomes B; B becomes C; C becomes A
    rotateTriangleVertices() {
        const oldVertexA = this.vertexA;
        const oldVertexB = this.vertexB;
        const oldVertexC = this.vertexC;

        const oldSideLengthA = this.sideLengthA;
        const oldSideLengthB = this.sideLengthB;
        const oldSideLengthC = this.sideLengthC;

        const oldAngleA = this.angleA;
        const oldAngleB = this.angleB;
        const oldAngleC = this.angleC;

        const oldSegmentA = this.segmentA;
        const oldSegmentB = this.segmentB;
        const oldSegmentC = this.segmentC;

        this.vertexA = oldVertexC;
        this.vertexB = oldVertexA;
        this.vertexC = oldVertexB;

        this.sideLengthA = oldSideLengthC;
        this.sideLengthB = oldSideLengthA;
        this.sideLengthC = oldSideLengthB;

        this.angleA = oldAngleC;
        this.angleB = oldAngleA;
        this.angleC = oldAngleB;

        this.segmentA = oldSegmentC;
        this.segmentB = oldSegmentA;
        this.segmentC = oldSegmentB;
    }

    isRightTriangle() {
        if (Math.abs(this.angleA - 90) < 1e-10 || Math.abs(this.angleB - 90) < 1e-10 || Math.abs(this.angleC - 90) < 1e-10) {
            return true
        } else {
            return false
        }
    }

    // 8-13-2020: giving answers slightly too high, a problem with 'get length?, or 'get altitude?'
    calculateArea() {
        let area;
        if (this.right) {
            area = 0.5 * this.sideLengthA * this.sideLengthB;
        } else {
            console.log('WARNING: calculate triangle area function can give slightly incorrect answers');
            area = 0.5 * this.sideLengthA * this.getAltitude('A').getLength();
        }
        return area
    }

    /// i took this out bc it did nothing but cause problems!
    /// if you use the specific right triangle generators, you get this convention
    /// otherwise, you don't!
    // if a triangle is a right triangle,
    /// rotates verticies so the hypotenuse is angle C
    // setRightTriangleConvention() {
    //     if (Math.abs(this.angleA - 90) < 1e-10) {
    //         this.rotateTriangleVertices();
    //         this.rotateTriangleVertices();
    //     } else if (Math.abs(this.angleB - 90) < 1e-10) {
    //         this.rotateTriangleVertices();
    //     }
    // }

    // this wasn't a very good idea
    // findAngleClosestTo90() {
    //     const ninetyMinusA = Math.abs(this.angleA - 90);
    //     const ninetyMinusB = Math.abs(this.angleB - 90);
    //     const ninetyMinusC = Math.abs(this.angleC - 90);
    //
    //     let result;
    //     if (ninetyMinusA <= ninetyMinusB && ninetyMinusA <= ninetyMinusC) {
    //         result = 'A';
    //     } else if (ninetyMinusB <= ninetyMinusA && ninetyMinusB <= ninetyMinusC) {
    //         result = 'B';
    //     } else if (ninetyMinusC <= ninetyMinusA && ninetyMinusC <= ninetyMinusB) {
    //         result = 'C';
    //     }
    //     return result
    // }

    // this wsan't a very good idea
    // whichever angle is closest to 90 degrees is set to 90 degrees and the triangle is reformed
    // forceRight() {
    //     const angleClosestTo90 = this.findAngleClosestTo90();
    //     if (angleClosestTo90 === 'A') {
    //         this.rotateTriangleVertices();
    //         this.rotateTriangleVertices();
    //     } else if (angleClosestTo90 === 'B') {
    //         this.rotateTriangleVertices();
    //     } else if (angleClosestTo90 === 'C') {
    //         // pass
    //     }
    //     const newVertexC = this.vertexC;
    //     const newVertexA = new Point(newVertexC.x, newVertexC.y + this.sideLengthA);
    //     const newVertexB = new Point(newVertexC.x - this.sideLengthB, newVertexC.y);
    //
    //     this.vertexA = newVertexA;
    //     this.vertexB = newVertexB;
    //     this.vertexC = newVertexC;
    //     this.calculateTriangleParameters();
    // }

    // altitude is a segment that begins at one vertex and makes a right angle with the opposite segment
    getAltitude(whichVertex) {
        if (whichVertex === 'A') {
            return new SegmentF(this.vertexA, this.segmentA.line.findIntersectionWithAnotherLine(this.segmentA.line.findPerpendicularLine(this.vertexA)));
        } else if (whichVertex === 'B') {
            return new SegmentF(this.vertexB, this.segmentB.line.findIntersectionWithAnotherLine(this.segmentB.line.findPerpendicularLine(this.vertexB)));
        } else if (whichVertex === 'C') {
            return new SegmentF(this.vertexC, this.segmentC.line.findIntersectionWithAnotherLine(this.segmentC.line.findPerpendicularLine(this.vertexC)));
        } else {
            return undefined
        }
    }

    // a median is a segment that begins at one vertex and ends at the midpoint of the opposite segment
    getMedian(whichVertex) {
        if (whichVertex === 'A') {
            return new SegmentF(this.vertexA, this.vertexB.interpolate(this.vertexC, 0.5));
        } else if (whichVertex === 'B') {
            return new SegmentF(this.vertexB, this.vertexC.interpolate(this.vertexA, 0.5));
        } else if (whichVertex === 'C') {
            return new SegmentF(this.vertexC, this.vertexA.interpolate(this.vertexB, 0.5));
        } else {
            return undefined
        }
    }

    // the centroid is the point at which all medians intersect
    getCentroid() {
        let medianA = this.getMedian('A');
        let medianB = this.getMedian("B");
        return medianA.line.findIntersectionWithAnotherLine(medianB.line);
    }

    getSideLength(oppositeVertex) {
      if (oppositeVertex === 'A') {
        return this.sideLengthA
      } else if (oppositeVertex === 'B') {
        return this.sideLengthB
      } else if (oppositeVertex === 'C') {
        return this.sideLengthC
      }
    }

    translate(xTranslation, yTranslation) {
        // how will this affect altitudes and medians?....need to think about this.
    }

    /// check if i ever use this, I don't think i do, and i'm not sure I want this to be a part of this object!
    addToDiagramObject(DiagramObject) {
        DiagramObject.addExistingSegment(this.segmentA);
        DiagramObject.addExistingSegment(this.segmentB);
        DiagramObject.addExistingSegment(this.segmentC);
    }

    // definitely does not work!!!!
    /// FIX THIS! I need it to make my triangles face the correct way all the time!
    spin(angleInDegrees) {
        const theta = convertDegreesToRadians(angleInDegrees);
        const centroid = this.getCentroid();
        this.vertexA.rotate(theta, centroid);
        this.vertexB.rotate(theta, centroid);
        this.vertexC.rotate(theta, centroid);
    }
}

function constructEquilateralTriangleF(sideLength, vertexA = makeOriginF()) { // clockwise orientation
  let vertexB = vertexA.translateAndReproduce(sideLength / 2, sideLength / 2 * Math.sqrt(3));
  let vertexC = vertexA.translateAndReproduce(sideLength, 0);
  return new TriangleF(vertexA, vertexB, vertexC);
}

function constructIsoscelesTriangleF(width, height, vertexA = makeOriginF()) { // clockwise orientation
  let vertexB = vertexA.translateAndReproduce(width / 2, height);
  let vertexC = vertexA.translateAndReproduce(width, 0);
  return new TriangleF(vertexA, vertexB, vertexC)
}

function constructRightTriangleHypotenuseAngleF(hypotenuse, angleA, swapLegs, vertexA = makeOriginF()) { // clockwise orientation
  const theta = convertDegreesToRadians(angleA);
  let x = hypotenuse * Math.cos(theta);
  let y = hypotenuse * Math.sin(theta);
  if (swapLegs) {
      const oldX = x;
      const oldY = y;
      x = oldY;
      y = oldX;
  }
  const vertexC = vertexA.translateAndReproduce(x,0);
  const vertexB = vertexA.translateAndReproduce(x,y);
  return new TriangleF(vertexA, vertexB, vertexC);
}

function constructRightTriangleTwoLegsF(xLeg, yLeg, swapLegs, vertexA = makeOriginF()) { // clockwise orientation
    if (swapLegs) {
        const oldxLeg = xLeg;
        const oldyLeg = yLeg;
        xLeg = oldyLeg;
        yLeg = oldxLeg;
    }
    const vertexC = vertexA.translateAndReproduce(xLeg,0);
    const vertexB = vertexA.translateAndReproduce(xLeg,yLeg);
    return new TriangleF(vertexA, vertexB, vertexC);
}

// add error message if hypotenuse is shorter than leg
function constructRightTriangleHypotenuseLegF(hypotenuse, xLeg, swapLegs, vertexA = makeOriginF()) { // clockwise orientation
    const yLeg = Math.sqrt(hypotenuse**2 - xLeg**2);
    return constructRightTriangleTwoLegsF(xLeg, yLeg, swapLegs, vertexA)
}


function constructTriangleSASF(sideC, angleBinDegrees, sideA, vertexA = makeOriginF()) { // counterlockwise orientation
    console.log(sideC, angleBinDegrees, sideA, vertexA);
    let vertexB = vertexA.translateAndReproduce(sideC, 0);
    let angleBInRadians = convertDegreesToRadians(angleBInDegrees);
    let vertexC = vertexB.translateAndReproduce(-1 * sideA * Math.cos(angleBInRadians), sideA * Math.sin(angleBInRadians));
    let newTriangle = new TriangleF(vertexA, vertexB, vertexC);
    newTriangle.setOrientationCounterClockwise();
    return newTriangle
}


// its possible that the angles do not
function constructTriangleASAF(angleAinDegrees, sideC, angleBinDegrees, vertexA = makeOriginF()) { // counterclockwise orientation
    const angleCinDegrees = 180 - angle1inDegrees - angle2inDegrees;
    if (angle3inDegrees <= 0) {
        console.log('cannot have a triangle with total angle greater than 180');
        return false
    }
    const angleAinRadians = convertDegreesToRadians(angleAinDegrees);
    const angleBinRadians = convertDegreesToRadians(angleBinDegrees);


    const lineB = new constructLineFromPointAndAngleF(vertexA, angleAinRadians);
    const vertexB = vertexA.translateAndReproduce(sideC, 0);
    const lineA = new constructLineFromPointAndAngleF(vertexB, Math.PI - angleBinRadians);
    const vertexC = lineA.findIntersectionWithAnotherLine(lineB);
    let newTriangle = new TriangleF(vertexA, vertexB, vertexC);
    newTriangle.setOrientationCounterClockwise();
    return newTriangle
}

function constructTriangleSSSF(sideC, sideB, sideA, vertexA) { // counterclockwise orientation
    let angleB = getAngleFromLawOfCosines(sideA, sideB, sideC); // in degrees
    return constructTriangleSASF(sideC, angleB, sideA, vertexA);
}


function constructTriangleAASF(angleCinDegrees, angleAinDegrees, sideC, vertexA) { // counterclockwiseOrientation orientation
    const angleBinDegrees = 180 - angleCinDegrees - angleAinDegrees;
    if (angleBinDegrees <= 0) {
        console.log('cannot have a triangle with total angle greater than 180');
        return false
    }
    return constructTriangleASAF(angleAinDegrees, sideC, angleBinDegrees, vertexA);
}



class RectangleF extends PolygonF {
  constructor(width, height, vertex0) {
    const vertex1 = vertex0.translateAndReproduce(0,height);
    const vertex2 = vertex0.translateAndReproduce(width,height);
    const vertex3 = vertex0.translateAndReproduce(width,0);
    super([vertex0, vertex1, vertex2, vertex3]);
    this.area = width * height;
  }

  // diagonal through vertex 0 and vertex 2
  getDiagonal0() {
    return new SegmentF(this.vertices[0],this.vertices[2]);
  }
  getDiagonal1() {
    return new SegmentF(this.vertices[1],this.vertices[3]);
  }
  getCenter() {
    return this.getDiagonal0().intersectionWithAnotherSegment(this.getDiagonal1())
  }
  spinAboutCenter(angleInDegrees) {
    super.rotateAboutPoint(angleInDegrees, this.getCenter())
  }

}

class SquareF extends RectangleF {
  constructor(sideLength, vertex0) {
    super(sideLength, sideLength, vertex0);
  }
}
