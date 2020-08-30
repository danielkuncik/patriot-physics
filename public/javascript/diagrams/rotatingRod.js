class RotatingRod extends DiagramF {
    constructor(distanceLeft, distanceRight, thetaInDegrees, distanceUnit) {
        super();
        if (distanceRight === undefined) {
            distanceRight = 1;
        }
        if (distanceLeft === undefined) {
            distanceLeft = 0;
        }
        if (distanceUnit === undefined) {
            distanceUnit = 'm'
        }
        if (thetaInDegrees === undefined) {
            thetaInDegrees = 0;
        }

        this.distanceUnit = distanceUnit;
        this.distanceRight = distanceRight;
        this.distanceLeft = distanceLeft;
        this.thetaInDegrees = thetaInDegrees;

        this.masses = [];
        this.defaultMassUnit = 'kg';

        this.forces = [];
        this.defaultForceUnit = 'N';

        this.referenceLineBelow = true;

        this.positionReferenceArray = [];
        this.addPositionToReferenceArray(0,);
    }

    moveReferenceLineAbove() {
        this.referenceLineBelow = false;
    }

    moveReferenceLineBelow() {
        this.referenceLineBelow = true;
    }

    addPositionToReferenceArray(position, label) {
        if (label = 'undefined') {
            label = `${position} ${this.distanceUnit}`;
        } // find an easy way to have different labels
        if (this.checkPosition(position, 'reference array')) {
            let labelInput = label;
            this.positionReferenceArray.push({
                position: position,
                label: labelInput
            });
        }
    }

    automaticReferenceArray(numHashes) {
        let hashDistance = (this.distanceLeft + this.distanceRight) / (numHashes - 1);
        let q;
        for (q = 0; q < numHashes; q++) {
            this.addPositionToReferenceArray(-1 * this.distanceLeft + hashDistance * q);
        }
    }

    checkPosition(position, type, message) {
        if (message === undefined) {
            message = '';
        }
        if (position > 0 && position > this.distanceRight) {
            console.log(`ERROR: position of ${type} added outside of range: ${message}`);
            return false
        } else if (position < 0 && Math.abs(position) > this.distanceLeft) {
            console.log(`ERROR: position of ${type} added outside of range: ${message}`);
            return false
        } else {
            return true
        }
    }

    setDistanceRight(newDistanceRight) {
        this.distanceRight = newDistanceRight;
    }
    setDistanceLeft(newDistanceLeft) {
        this.distanceLeft = newDistanceLeft;
    }
    setTheta(newTheta) {
        this.theta = newTheta;
    }
    setDistanceUnit(newDistanceUnit) {
        this.distanceUnit = newDistanceUnit;
    }
    setMassUnit(newMassUnit) {
        this.defaultMassUnit = newMassUnit;
    }
    setForceUnit(newForceUnit) {
        this.defaultForceUnit = newForceUnit;
    }

    addMass(massPosition, massQuantity, unit, addHashBoolean) {
        this.checkPosition(massPosition, 'mass', `position: ${massPosition}, quantity: ${massQuantity}`);
        if (unit === undefined) {
            unit = this.defaultMassUnit;
        }
        let label = `${massQuantity} ${unit}`;
        let quantity = massQuantity;
        if (unit === 'g') {
            quantity /= 1000;
        }

        this.masses.push({
            position: massPosition,
            quantity: quantity,
            unit: unit,
            label: label
        });

        if (addHashBoolean) {
            this.addPositionToReferenceArray(massPosition);
        }
    }

    addForce(forcePosition, forceMagnitude, forceDirectionInDegrees, unit, addHashBoolean) {
        if (forceMagnitude === undefined) {
            forceMagnitude = 10;
        }
        if (forceDirectionInDegrees === undefined) {
            forceDirectionInDegrees = 90;
        }
        if (forcePosition === undefined) {
            forcePosition = this.distanceRight
        }
        if (unit === undefined) {
            unit = this.defaultForceUnit;
        }

        this.checkPosition(forcePosition, 'force');

        this.forces.push({
            position: forcePosition,
            magnitude: forceMagnitude,
            directionInDegrees: forceDirectionInDegrees,
            unit: unit
        });

        if (addHashBoolean) {
            this.addPositionToReferenceArray(forcePosition);
        }
    }

    getMaxAndMinForce() {
        let max = 0, min = Infinity, maxBelow = 0, maxAbove = 0;
        this.forces.forEach((force) => {
            // this part here needs some work
            // the operation will be different if the force and the rod are at different angles around the object
            let forceAngle = convertDegreesToRadians(force.directionInDegrees - this.thetaInDegrees);
            console.log(forceAngle);
            if (force.magnitude > max) {
                max = force.magnitude;
            }
            if (force.magnitude < min) {
                min = force.magnitude;
            }
            if (force.directionInDegrees <= 180) { // forces above
                if (Math.abs(force.magnitude*Math.sin(forceAngle)) > maxAbove) {
                    maxAbove = Math.abs(force.magnitude*Math.sin(forceAngle));
                }
            } else { // forces below
                if (Math.abs(force.magnitude*Math.sin(forceAngle)) > maxBelow) {
                    maxBelow = Math.abs(force.magnitude*Math.sin(forceAngle));
                }
            }
        });
        return {
            max: max,
            min: min,
            maxBelow: maxBelow,
            maxAbove: maxAbove
        }
    }

    getMaxMass() {
        let max = 0;
        this.masses.forEach((mass) => {
            if (mass.quantity > max) {
                max = mass.quantity;
            }
        });
        return max
    }


    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        // space here to draw it

        const circleRadius = (this.distanceLeft + this.distanceRight) * 0.1;
        const rectangleWidth = circleRadius * 0.75;
        const forceRange = this.getMaxAndMinForce();
        const maxForce = forceRange.max;
        const minForce = forceRange.min;
        const maxForceAbove = forceRange.maxAbove;
        const maxForceBelow = forceRange.maxBelow;
        let forceMultiplier = 0;
        if (maxForce > 0) {
            forceMultiplier = (this.distanceLeft + this.distanceRight) / maxForce * 0.3;
        }
        // the largest force will always be 30 % the length of the rod
        const forceFontSize = minForce * forceMultiplier * 0.2;
        // the font size will always be 10 % the length of the smallest force
        const maxMass = this.getMaxMass();
        // the largest mass will be the same radius as the circle

        const thetaInRadians = convertDegreesToRadians(this.thetaInDegrees);

        let centerCircle = super.addCircle(origin, circleRadius);
        centerCircle.fill();

        // add two rectangles
        let rightCenterEndPoint = origin.getAnotherPointWithTrig(this.distanceRight, thetaInRadians);
        let leftCenterEndPoint = origin.getAnotherPointWithTrig(this.distanceLeft, thetaInRadians + Math.PI);
        let centerBottomPoint = origin.getAnotherPointWithTrig(rectangleWidth, thetaInRadians + Math.PI * 3 / 2);
        let centerTopPoint = origin.getAnotherPointWithTrig(rectangleWidth, thetaInRadians + Math.PI / 2);
        let rightBottomEndPoint = centerBottomPoint.getAnotherPointWithTrig(this.distanceRight, thetaInRadians);
        let rightTopEndPoint = centerTopPoint.getAnotherPointWithTrig(this.distanceRight, thetaInRadians);
        let leftBottomEndPoint = centerBottomPoint.getAnotherPointWithTrig(this.distanceLeft, thetaInRadians + Math.PI);
        let leftTopEndPoint = centerTopPoint.getAnotherPointWithTrig(this.distanceLeft, thetaInRadians + Math.PI);
        super.addSegment(centerBottomPoint, rightBottomEndPoint);
        super.addSegment(rightBottomEndPoint, rightTopEndPoint);
        super.addSegment(rightTopEndPoint, centerTopPoint);
        super.addSegment(centerBottomPoint, leftBottomEndPoint);
        super.addSegment(leftBottomEndPoint, leftTopEndPoint);
        super.addSegment(leftTopEndPoint, centerTopPoint);

        // add masses as circles
        this.masses.forEach((mass) => {
            let massCenter = origin.getAnotherPointWithTrig(mass.position, thetaInRadians);
            let radiusMultiplier = mass.quantity / maxMass;
            if (radiusMultiplier < 0.5) {radiusMultiplier = 0.5;} // this is to prevent masses from appearing as too small int he diagram
            let massRadius = circleRadius * radiusMultiplier;
            let massString = `${mass.label}`;
            let massFontSize = massRadius * 2 / massString.length;
            let massCircle = super.addCircle(massCenter, massRadius);
            massCircle.fillWhite();
            super.addText(massString,massCenter, massFontSize, 0); // addText(letters, centerPoint, relativeFontSize, rotation)
        });

        // add forces
        this.forces.forEach((force) => {
            let forceStart;
            let phiInRadians = convertDegreesToRadians(force.directionInDegrees);

            if (phiInRadians <= Math.PI) { /// force on top
                forceStart = centerTopPoint.getAnotherPointWithTrig(force.position, thetaInRadians);
            } else { // force on bottom
                forceStart = centerBottomPoint.getAnotherPointWithTrig(force.position, thetaInRadians);
            }

            let forceEnd = forceStart.getAnotherPointWithTrig(force.magnitude * forceMultiplier, phiInRadians);
            super.addArrow(forceStart, forceEnd);
            let forceText = `${force.magnitude} ${force.unit}`;
            super.labelLineAbove(forceStart, forceEnd, forceText, forceFontSize * 0.5, forceFontSize);
            //     addArrow(point1, point2, arrowheadLength, arrowheadAngleInDegrees)
            //     labelLineAbove(point1, point2, text, textDisplacement, relativeFontSize) {


        });

        // add reference Line
        let referenceLineDisplacement, referenceLeftEnd, referenceRightEnd, refernceLineBelow;
        if (this.positionReferenceArray.length > 0 ) {
            if (this.referenceLineBelow) { // refernce line below
                referenceLineDisplacement = (this.distanceLeft + this.distanceRight) * 0.07 + maxForceBelow * forceMultiplier;
                referenceLeftEnd = leftBottomEndPoint.getAnotherPointWithTrig(referenceLineDisplacement, thetaInRadians + 3 * Math.PI / 2);
                referenceRightEnd = rightBottomEndPoint.getAnotherPointWithTrig(referenceLineDisplacement, thetaInRadians + 3 * Math.PI / 2);
            } else { // reference line above
                referenceLineDisplacement = (this.distanceLeft + this.distanceRight) * 0.07 + maxForceAbove * forceMultiplier;
                referenceLeftEnd = leftTopEndPoint.getAnotherPointWithTrig(referenceLineDisplacement, thetaInRadians + Math.PI / 2);
                referenceRightEnd = rightTopEndPoint.getAnotherPointWithTrig(referenceLineDisplacement, thetaInRadians + Math.PI / 2);
            }
            let referenceLine = super.addSegment(referenceLeftEnd, referenceRightEnd);
            //  referenceLine.turnIntoDashedLine();
        }

        // hash marks on reference line
        //     addHashMark(endPoint1, endPoint2, proportion, hashLength, labelAbove, labelBelow, labelFontSize, labelRotateBoolean) {

        if (this.referenceLineBelow) {
            this.positionReferenceArray.forEach((referencePoint) => {
                let proportion = (referencePoint.position + this.distanceLeft) / (this.distanceRight + this.distanceLeft);
                super.addHashMark(referenceLeftEnd, referenceRightEnd, proportion, undefined, undefined, referencePoint.label, undefined, false);
            });
        } else {
            this.positionReferenceArray.forEach((referencePoint) => {
                let proportion = (referencePoint.position + this.distanceLeft) / (this.distanceRight + this.distanceLeft);
                super.addHashMark(referenceLeftEnd, referenceRightEnd, proportion, undefined, referencePoint.label, undefined, undefined, false);
            });
        }
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }
}
