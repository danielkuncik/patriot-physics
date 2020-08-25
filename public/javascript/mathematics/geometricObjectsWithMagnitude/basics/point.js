
const pi = new Magnitude('3.14159265358979323846');

class Point {
    constructor(xMagnitude, yMagnitude, name) {
        if (!xMagnitude.isAmagnitude || !yMagnitude.isAmagnitude) {
            return false
        }
        this.x = xMagnitude;
        this.y = yMagnitude;
        this.name = name;
        //    this.uuid = create_UUID();
    }

    setName(newName) {
        this.name = newName;
    }

    translate(xTranslation, yTranslation) {
        if (!xTranslation.isAmagnitude || !yTranslation.isAmagnitude) {
            return false
        }
        this.x = this.x.addMag(xTranslation);
        this.y = this.y.addMag(yTranslation);
    }

    // work on this!
    translatePolar(radius, angleObject) {
        if (!radius.isAmagnitude || !angleObject.isAmagnitude) {
            return false
        }
        let xTranslation = radius.multiplyMag(angleObject.cosMag());
        let yTranslation = radius.multiplyMag(angleObject.sinMag());
        this.translate(xTranslation, yTranslation);
    }


    translateAndReproduce(xTranslation, yTranslation) {
        if (!xTranslation.isAmagnitude || !yTranslation.isAmagnitude) {
            return false
        }
        let newX = this.x.addMag(xTranslation);
        let newY = this.y.addMag(yTranslation);
        let newPoint = new Point(newX, newY);
        return newPoint
    }

    /// I CHANGED THE NAME!!! (from trnalstae and reproduce polar)
    translatePolarAndReproduce(radius, angleObject) {
        if (!radius.isAmagnitude || !angleObject.isAmagnitude) {
            return false
        }
        let xTranslation = radius.multiplyMag(angleObject.cosMag());
        let yTranslation = radius.multiplyMag(angleObject.sinMag());
        return this.translateAndReproduce(xTranslation, yTranslation)
    }

    /// [do i want to keep tihis???]
    // creates a new point by rotating the canvas, then translating
    // does not work if rotation is negative
    rotatedRectangleTransformAndReproduce(rotationAngle, xTranslationMagnitude, yTranslationMagnitude) {
        let xPrime = xTranslation * Math.cos(rotation) - yTranslation * Math.sin(rotation) + this.x;
        let yPrime = yTranslation * Math.cos(rotation) + xTranslation * Math.sin(rotation) + this.y;
        // let newX = this.x + xTranslation * Math.cos(rotation) + yTranslation * Math.sin(rotation);
        // let newY = this.y + xTranslation * Math.sin(rotation) - yTranslation * Math.cos(rotation);
        // let newPoint = new Point(newX, newY);
        let newPoint = new Point(xPrime, yPrime);
        return newPoint
    }

    // rotates a Point around the center Point by a certain angle
    // default center Point is origin
    rotate(angleObject, centerPoint = makeOrigin()) {
        this.translate(centerPoint.x.reverseSign(), centerPoint.y.reverseSign());
        const xPrime = (this.x.multiplyMag(angleObject.cosMag())).subtractMag(this.y.multiplyMag(angleObject.sinMag()));
        const yPrime = (this.y.multiplyMag(angleObject.cosMag())).addMag(this.x.multiplyMag(angleObject.sinMag()));
        this.x = xPrime;
        this.y = yPrime;
        this.translate(centerPoint.x.reverseSign(), centerPoint.y.reverseSign());
    }

    rescaleSingleFactor(scaleFactorMagnitude) {
        this.x = this.x.multiplyMag(scaleFactorMagnitude);
        this.y = this.y.multiplyMag(scaleFactorMagnitude);
    }


    rescaleDoubleFactor(xScaleFactorMagnitude, yScaleFactorMagnitude) {
        this.x = this.x.multiplyMag(xScaleFactorMagnitude);
        this.y = this.y.multiplyMag(yScaleFactorMagnitude);
        // doesn't work well if the diagram includes circles and arcs!
        // and the point must be coordinated with these!
    }

    reflectAboutXAxis() {
        this.y.reverseSign();
    }

    getQuadrant() {
        if (this.x.zero && this.y.zero) {return '0';} // change this name?
        else if (this.x.positive && this.y.zero) {return '+X';}
        else if (!this.x.positive && this.y.zero) {return '-X';}
        else if (this.x.zero && this.y.positive) {return '+Y';}
        else if (this.x.zero && !this.y.positive) {return '-Y';}
        else if (this.x.positive && this.y.positive) {return '1';}
        else if (!this.x.positive && this.y.positive) {return '2';}
        else if (!this.x.positive && !this.y.positive) {return '3';}
        else if (this.x.positive && !this.y.positive) {return '4';}
        else {return false;}
    }

    // returns angle object
    getAngleToHorizontal() {
        let theta;
        const quadrant = this.getQuadrant();
        const numSigFigs = Math.min(this.x.numSigFigs, this.y.numSigFigs, 15); // if it is exact, it will go down to 15
        if (quadrant === '1') {return constructAngleFloat(Math.atan(this.y.getFloat() / this.x.getFloat()), numSigFigs, false) }
        else if (quadrant === '2'){return constructAngleFloat(Math.PI / 2 + Math.atan(-1 * this.x.getFloat()/this.y.getFloat()), numSigFigs, false) } //{theta = Math.PI / 2 + Math.atan(-1 * this.x / this.y);}
        else if (quadrant === '3') {return constructAngleFloat(Math.PI + Math.atan(this.y.getFloat()/this.x.getFloat()), numSigFigs, false)  }//{theta = Math.PI + Math.atan((-1 * this.y) / (-1 * this.x));}
        else if (quadrant === '4') {return constructAngleFloat(Math.PI * 3 / 2 + Math.atan(-1 * this.x.getFloat() / this.y.getFloat() ), numSigFigs, false) } //{theta = Math.PI * 3 / 2 + Math.atan(this.x / (-1 *  this.y));}
        else if (quadrant === '+X') {return constructAngleFloat(0, numSigFigs, false)}//{theta = 0;}
        else if (quadrant === '-X') {return constructAngleFloat(Math.PI, numSigFigs)}//{theta = Math.PI;}
        else if (quadrant === '+Y') {return constructAngleFloat(Math.PI / 2, numSigFigs)}//{theta = Math.PI / 2;}
        else if (quadrant === '-Y') {return constructAngleFloat(Math.PI * 3 / 2, numSigFigs)}//{theta = 3 * Math.PI / 2;}
        else return undefined;
    }

    getDistanceToOrigin() {
        return this.x.pythagoreanAddMag(this.y)
    }

    getDistanceToAnotherPoint(anotherPoint) {
        return (this.x.subtractMag(anotherPoint.x)).pythagoreanAddMag(this.y.subtractMag(anotherPoint.y));
    }

    /// if this Point were the origin, returns the angle to the horizontal of the other Point
    // returns angles theta such that 0 <= theta < 2pi
    getAngleToAnotherPoint(anotherPoint) {
        const intermediatePoint = anotherPoint.translateAndReproduce(this.x, this.y);
        return intermediatePoint.getAngleToHorizontal()
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
        return new Point(x, y);
    }

    // returns a new Point which is a particular length away at angle theta
    getAnotherPointWithTrig(length, thetaInRadians) {
        let newX, newY;
        newX = this.x + length * Math.cos(thetaInRadians);
        newY = this.y + length * Math.sin(thetaInRadians);
        return new Point(newX,newY)
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

function makeOrigin() {
    let x = constructZeroMagnitude(true);
    let y = constructZeroMagnitude(true);
    return new Point(x,y);
}

/*
function constructPointWithMagnitude(magnitude, angleInRadians) {
    let x = magnitude * Math.cos(angleInRadians);
    let y = magnitude * Math.sin(angleInRadians);
    let newPoint = new Point(x, y);
    return newPoint;
}
 */