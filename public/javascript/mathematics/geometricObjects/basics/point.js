
class Point {
    constructor(xMagnitude, yMagnitude, name = 'unnamed') {
        this.x = processMagnitudeInput(xMagnitude);
        this.y = processMagnitudeInput(yMagnitude);
        this.name = name;
        if (this.x.isAmagnitude && this.y.isAmagnitude) {
            this.isApoint = true
        } else {
            this.invalidate();
        }
    }

    invalidate() {
        this.x = new Magnitude();
        this.y = new Magnitude();
        this.isApoint = false;
    }

    print() {
        return `Point ${this.name}: X => ${this.x.printOptimal()} Y => ${this.y.printOptimal()}`
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
        let xTranslation = radius.multiplyMag(angleObject.cosAngle());
        let yTranslation = radius.multiplyMag(angleObject.sinAngle());
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
        if (!radius.isAmagnitude || !angleObject.isAnAngle) {
            return false
        }
        let xTranslation = radius.multiplyMag(angleObject.cos());
        let yTranslation = radius.multiplyMag(angleObject.sin());
        return this.translateAndReproduce(xTranslation, yTranslation)
    }

    /// [do i want to keep tihis???]
    // creates a new point by rotating the canvas, then translating
    // does not work if rotation is negative
    // rotatedRectangleTransformAndReproduce(rotationAngle, xTranslationMagnitude, yTranslationMagnitude) {
    //     let xPrime = xTranslation * Math.cos(rotation) - yTranslation * Math.sin(rotation) + this.x;
    //     let yPrime = yTranslation * Math.cos(rotation) + xTranslation * Math.sin(rotation) + this.y;
    //     // let newX = this.x + xTranslation * Math.cos(rotation) + yTranslation * Math.sin(rotation);
    //     // let newY = this.y + xTranslation * Math.sin(rotation) - yTranslation * Math.cos(rotation);
    //     // let newPoint = new Point(newX, newY);
    //     let newPoint = new Point(xPrime, yPrime);
    //     return newPoint
    // }

    // rotates a Point around the center Point by a certain angle
    // default center Point is origin
    rotate(angleInput, centerPoint = makeOrigin()) {
        const angleObject = processAngleInput(angleInput);
        this.translate(centerPoint.x.reverseSign(), centerPoint.y.reverseSign());
        console.log(this.print());
        console.log(angleObject.print());
        console.log(angleObject.cos());
        console.log(angleObject.sin());
        const xPrime = (this.x.multiplyMag(angleObject.cos())).subtractMag(this.y.multiplyMag(angleObject.sin()));
        console.log(xPrime.printOptimal());
        const yPrime = (this.x.multiplyMag(angleObject.sin())).addMag(this.y.multiplyMag(angleObject.cos()));
        this.x = xPrime;
        this.y = yPrime;
        this.translate(centerPoint.x, centerPoint.y);
    }

    rescaleSingleFactor(scaleFactorFloat) {
        this.x = this.x.multiplyMagExactConstant(scaleFactorFloat);
        this.y = this.y.multiplyMagExactConstant(scaleFactorFloat);
    }


    rescaleDoubleFactor(xScaleFactorFloat, yScaleFactorFloat) {
        this.x = this.x.multiplyMagExactConstant(xScaleFactorFloat);
        this.y = this.y.multiplyMagExactConstant(yScaleFactorFloat);
        // doesn't work well if the diagram includes circles and arcs!
        // and the point must be coordinated with these!
    }

    reflectAboutXAxis() {
        let newY = (this.y).reverseSign();
        this.y = newY
    }

    getQuadrant() {
        if (this.x.isZero() && this.y.isZero()) {return '0';} // change this name?
        else if (this.x.isPositive() && this.y.isZero()) {return '+X';}
        else if (this.x.isNegative() && this.y.isZero()) {return '-X';}
        else if (this.x.isZero() && this.y.isPositive()) {return '+Y';}
        else if (this.x.isZero() && this.y.isNegative()) {return '-Y';}
        else if (this.x.isPositive() && this.y.isPositive()) {return '1';}
        else if (this.x.isNegative() && this.y.isPositive()) {return '2';}
        else if (this.x.isNegative() && this.y.isNegative()) {return '3';}
        else if (this.x.isPositive() && this.y.isNegative()) {return '4';}
        else {return false;}
    }

    // returns angle object
    getAngleToHorizontal() {
        let theta;
        const quadrant = this.getQuadrant();
        const numSigFigs = Math.min(this.x.numSigFigs, this.y.numSigFigs, maxSigFigs); // if it is exact, it will go down to 15
        if (quadrant === '1') {return new Angle(Math.atan(this.y.getFloat() / this.x.getFloat()), numSigFigs, false) }
        else if (quadrant === '2'){return new Angle(Math.PI / 2 + Math.atan(-1 * this.x.getFloat()/this.y.getFloat()), numSigFigs, false) } //{theta = Math.PI / 2 + Math.atan(-1 * this.x / this.y);}
        else if (quadrant === '3') {return new Angle(Math.PI + Math.atan(this.y.getFloat()/this.x.getFloat()), numSigFigs, false)  }//{theta = Math.PI + Math.atan((-1 * this.y) / (-1 * this.x));}
        else if (quadrant === '4') {return new Angle(Math.PI * 3 / 2 + Math.atan(-1 * this.x.getFloat() / this.y.getFloat() ), numSigFigs, false) } //{theta = Math.PI * 3 / 2 + Math.atan(this.x / (-1 *  this.y));}
        else if (quadrant === '+X') {return new Angle(0, numSigFigs, false)}//{theta = 0;}
        else if (quadrant === '-X') {return new Angle(Math.PI, numSigFigs)}//{theta = Math.PI;}
        else if (quadrant === '+Y') {return new Angle(Math.PI / 2, numSigFigs)}//{theta = Math.PI / 2;}
        else if (quadrant === '-Y') {return new Angle(Math.PI * 3 / 2, numSigFigs)}//{theta = 3 * Math.PI / 2;}
        else return undefined;
    }

    // this works only if x and y have the same unit
    getDistanceToOrigin() {
        return this.x.pythagoreanAddMag(this.y)
    }

    // works only if points have the same unit
    getDistanceToAnotherPoint(anotherPoint) {
        return (this.x.subtractMag(anotherPoint.x)).pythagoreanAddMag(this.y.subtractMag(anotherPoint.y));
    }

    /// if this Point were the origin, returns the angle to the horizontal of the other Point
    // returns angles theta such that 0 <= theta < 2pi
    getAngleToAnotherPoint(anotherPoint) {
        const intermediatePoint = anotherPoint.translateAndReproduce(this.x, this.y);
        return intermediatePoint.getAngleToHorizontal()
    }

    isEqualToAnotherPoint(anotherPoint, numSigFigs_x, numSigFigs_y = numSigFigs_x) {
        if (this.x.isEqualTo(anotherPoint.x, numSigFigs_x) && (this.y.isEqualTo(anotherPoint.y, numSigFigs_y))) {
            return true
        } else {
            return false
        }
    }

    // if this Point were the origin
    // in what quadrant woul the other Point be?
    getQuadrantOfAnotherPoint(anotherPoint) {
        const intermediatePoint = anotherPoint.translateAndReproduce(this.x, this.y);
        return intermediatePoint.getQuadrant()
    }

    // returns a new Point
    // on the ray beginning at this Point and pointing toward anotherPoint
    // at a distance the length between the points * proportion
    // so if propotion = 0.5, it will be halfway between the points
    // and if proportion = 2, it will be twice as far away as the other Point (so it can actually interpolate and extrapolate)
    // what if proportion is negative????
    interpolate(anotherPoint, proportion) {
        let proportionMagnitude;
        if (typeof(proportion) === 'number') {
          proportionMagnitude = constructMagnitudeFromFloat(proportion, undefined, undefined, true);
        } else if (typeof(proportion) === 'object' && proportion.isAmagnitude) {
          proportionMagnitude = proportion;
        } else {
          return undefined
        }
        let theta = this.getAngleToAnotherPoint(anotherPoint);
        let L = this.getDistanceToAnotherPoint(anotherPoint).multiplyMag(proportionMagnitude);
        return this.translatePolarAndReproduce(L, theta)
    }

    // this is identical to 'translatePolarAndReproduce
    // returns a new Point which is a particular length away at angle theta
    // getAnotherPointWithTrig(length, thetaInRadians) {
    //     let newX, newY;
    //     newX = this.x + length * Math.cos(thetaInRadians);
    //     newY = this.y + length * Math.sin(thetaInRadians);
    //     return new Point(newX,newY)
    // }

    // this shouldn't be here, if you want this, use a line, not a point
    // returns an angle theta in Radians
    // of  a line that is perpendicular to the line between this point and another point
    // getPerpendicularAngle(anotherPoint) {
    //     let theta = this.getAngleToAnotherPoint(anotherPoint);
    //     theta += Math.PI / 2;
    //     if (theta > Math.PI * 2) {
    //         theta -= Math.PI * 2;
    //     }
    //     return theta;
    // }

    // i've never even used this
    // gives x and y components of a vector made from this vector and another point
    // getComponentsToAnotherPoint(anotherPoint, axisRotationInRadians) {
    //     if (axisRotationInRadians === undefined) {axisRotationInRadians = 0;}
    //     let xComponent, yComponent;
    //     let theta = this.getAngleToAnotherPoint(anotherPoint);
    //     let L = this.getDistanceToAnotherPoint(anotherPoint);
    //     xComponent = L * Math.cos(theta);
    //     yComponent = L * Math.sin(theta);
    //     return  {
    //         xComponent: xComponent,
    //         yComponent: yComponent
    //     }
    // }
}

function makeOrigin(numSigFigs = Infinity) { // exact is true if numSigFigs is not entered
    let x = new Magnitude(new Measurement(0, numSigFigs));
    let y = new Magnitude(new Measurement(0, numSigFigs));
    return new Point(x,y)
}

function constructPointPolar(radiusMagnitude, angle) {
    const x = radiusMagnitude.multiplyMag(angle.cos());
    const y = radiusMagnitude.multiplyMag(angle.sin());
    return new Point(x,y)
}


// always returns the interior angle!!
function getAngleOfTwoRays(outsidePointA, vertex, outsidePointB, degrees) {
    const c = outsidePointA.getDistanceToAnotherPoint(outsidePointB);
    const a = vertex.getDistanceToAnotherPoint(outsidePointA);
    const b = vertex.getDistanceToAnotherPoint(outsidePointB);
    const cosTheta = (a.squareMag().addMag(b.squareMag())).subtractMag((c.squareMag())).divideMag((a.multiplyMag(b).multiplyMag(2)));
    return cosTheta.inverseCosMag()
}
