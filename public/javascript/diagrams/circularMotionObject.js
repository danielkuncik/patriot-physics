

class CircularMotionDiagram extends DiagramF {
    constructor(direction, radius, numberOfDirectionIndicators, firstDirectionIndicator) {
        if (direction === undefined) {
            direction = 'counterclockwise'
        }
        if (direction !== 'counterclockwise' && direction !== 'clockwise') {
            console.log('ERROR: direction of circular motion must be either clockwise or counterclockwise. Setting to counterclockwise');
            direction = 'counterclockwise';
        }
        if (numberOfDirectionIndicators === undefined) {
            numberOfDirectionIndicators = 4;
        }
        if (firstDirectionIndicator === undefined) {
            firstDirectionIndicator = 0;
        }
        if (radius === undefined) {radius = 1;}

        super();

        this.direction = direction;
        this.radius = radius;

        super.addCircle(origin, this.radius);

        let k;
        for (k = 0; k < numberOfDirectionIndicators; k++) {
            this.addArrowheadOnCircle(firstDirectionIndicator + 2 * Math.PI / numberOfDirectionIndicators * k);
        }

    }

    // gets the angle that a circle is pointing
    getPointingAngle(positionInRadians) {
        let pointingAngle = positionInRadians;
        if (this.direction === 'clockwise') {
            pointingAngle += Math.PI / 2;
        } else if (this.direction === "counterclockwise") {
            pointingAngle -= Math.PI / 2;
        }
        return pointingAngle
    }

    // add arrowhead that shows the direction something is moving in the circle
    addArrowheadOnCircle(positionInRadians, arrowheadLength, arrowheadAngleInDegrees) {
        if (arrowheadLength === undefined) {
            arrowheadLength = this.radius / 5;
        }
        if (arrowheadAngleInDegrees === undefined) {
            arrowheadAngleInDegrees = 35;
        }
        const arrowheadAngleInRadians = convertDegreesToRadians(arrowheadAngleInDegrees);
        const pointingAngle = this.getPointingAngle(positionInRadians);
        let centerPoint = this.getPointOnCircle(positionInRadians);
        let pointA = centerPoint.translateAndReproducePolar(arrowheadLength, pointingAngle - Math.PI + arrowheadAngleInRadians);
        let pointB = centerPoint.translateAndReproducePolar(arrowheadLength, pointingAngle - Math.PI - arrowheadAngleInRadians);

        super.addSegment(centerPoint, pointA);
        super.addSegment(centerPoint, pointB);
    }

    getPointOnCircle(positionInRadians) {
        return new PointF(this.radius * Math.cos(positionInRadians), this.radius * Math.sin(positionInRadians))
    }

    addVisiblePoint(positionInRadians) {
        super.addBlackCircle(this.getPointOnCircle(positionInRadians), this.radius / 10);
    }

    addVelocityArrow(positionInRadians, length, label) {
        if (length === undefined) {
            length = this.radius * 1.2;
        }
        const pointingAngle = this.getPointingAngle(positionInRadians);
        let pointA = this.getPointOnCircle(positionInRadians);
        let pointB = pointA.translateAndReproducePolar(length, pointingAngle);

        let arrow = super.addArrow(pointA, pointB);
        if (label) {
            super.labelLineOutside(pointA, pointB, label, undefined, undefined, this.direction);
        }
        return {
            pointB: pointB,
            pointingAngle: pointingAngle
        }
    }

    addCentripetalForce(positionInRadians, length, label) {
        if (length === undefined) {
            length = this.radius * 0.75;
        }
        const inwardAngle = positionInRadians + Math.PI;
        let pointA = this.getPointOnCircle(positionInRadians);
        let pointB = pointA.translateAndReproducePolar(length, inwardAngle);

        super.addArrow(pointA, pointB);
        if (label) {
            super.labelLineAbove(pointA, pointB, label);
        }
    }

    addVelocityArrowWithDottedLine(positionInRadians, arrowLength, label, dottedLineLength, dottedLineLabel) {
        if (arrowLength === undefined) {
            arrowLength = this.radius * 1.2;
        }
        if (dottedLineLength === undefined) {
            dottedLineLength = arrowLength;
        }
        let velocityArrow = this.addVelocityArrow(positionInRadians, arrowLength, label);
        let pointB = velocityArrow.pointB;
        let pointingAngle = velocityArrow.pointingAngle;
        let pointC = pointB.translateAndReproducePolar(dottedLineLength, pointingAngle);
        super.addDottedLine(pointB, pointC);
        if (dottedLineLabel) {
            super.labelLineOutside(pointB, pointC, dottedLineLabel, undefined, undefined, this.direction);
        }
    }

    addTangentLine(positionInRadians, length) {
        if (length === undefined) {
            length = this.radius * 3;
        }
        const centerPoint = this.getPointOnCircle(positionInRadians);
        const pointingAngle = this.getPointingAngle(positionInRadians);
        let pointA = centerPoint.translateAndReproducePolar(length / 2, pointingAngle);
        let pointB = centerPoint.translateAndReproducePolar(length / 2, pointingAngle + Math.PI);
        super.addSegment(pointA, pointB);
    }

    addRadius(positionInRadians) {
        super.addSegment(origin, this.getPointOnCircle(positionInRadians));
    }

    addPerpendicularTangentLineAndRadius(positionInRadians, lineLength) {
        this.addTangentLine(positionInRadians, lineLength);
        this.addRadius(positionInRadians, lineLength);

        const squareLength = this.radius * 0.2;

        const centerPoint = this.getPointOnCircle(positionInRadians);
        const pointingAngle = this.getPointingAngle(positionInRadians);

        const pointA = centerPoint.translateAndReproducePolar(squareLength, positionInRadians + Math.PI);
        const pointC = centerPoint.translateAndReproducePolar(squareLength, pointingAngle + Math.PI);
        const pointB = pointA.translateAndReproducePolar(squareLength, pointingAngle + Math.PI);

        super.addSegment(pointA, pointB);
        super.addSegment(pointB, pointC);

    }

}