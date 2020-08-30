/// this should be combined with the block problem area!
class SpringProblem extends DiagramF {
    constructor() {
        super();
    }


    // add a single zigzag
    addZigZag(endPoint1, endPoint2, width) {
        let pointA = endPoint1.interpolate(endPoint2,0.25);
        let pointB = endPoint1.interpolate(endPoint2, 0.75);
        let phi = endPoint1.getPerpendicularAngle(endPoint2);
        pointA.translate(width * Math.cos(phi), width * Math.sin(phi));
        pointB.translate(width * Math.cos(phi + Math.PI), width * Math.sin(phi + Math.PI));

        super.addSegment(endPoint1, pointA);
        super.addSegment(pointA, pointB);
        super.addSegment(pointB, endPoint2);
    }

    // add draw spring function!
    addSpring(endPoint1, endPoint2, width, numZigZags, proportionNotZigZag) {
        if (width === undefined) {width = endPoint1.getDistanceToAnotherPoint(endPoint2) * 0.2;}
        if (numZigZags === undefined) {numZigZags = 6;}
        if (proportionNotZigZag === undefined) {proportionNotZigZag = 0.1;}

        let pointA = endPoint1.interpolate(endPoint2, proportionNotZigZag / 2);
        let pointB = endPoint1.interpolate(endPoint2, 1 - proportionNotZigZag / 2);

        super.addSegment(endPoint1, pointA);

        let i, nextStartPoint = pointA, nextEndPoint;
        for (i = 0; i < numZigZags; i++) {
            nextEndPoint = endPoint1.interpolate(endPoint2, (1 - proportionNotZigZag) / numZigZags * (i + 1) + proportionNotZigZag / 2 );
            this.addZigZag(nextStartPoint, nextEndPoint, width);
            nextStartPoint = nextEndPoint;
        }

        super.addSegment(pointB, endPoint2);

        let springObject = {
            "endPoint1": endPoint1,
            "endPoint2": endPoint2,
            "width": width
        };
        return springObject
    }

    labelSpring(springObject, text, relativeFontSize) {
        if (relativeFontSize === undefined) {relativeFontSize = 0.7 * springObject.width;}
        super.labelLine(springObject.endPoint1, springObject.endPoint2, text, '', springObject.width * 1.5, relativeFontSize);
    }


}

// in the future
// i need to make this so that i can change it without creating a new object
class HorizontalSpringProblem extends SpringProblem {
    constructor(equilibirumLength, massBoolean, springWidth) {
        super();
        if (springWidth === undefined) {springWidth = equilibirumLength * 0.2;}
        this.equilibriumLength = equilibirumLength;
        this.massBoolean = massBoolean;
        this.springWidth = springWidth;

        //  super.addSpring(origin, new Point(equilibirumLength, 0));

        this.maxCanvasWidth = 300;
        this.maxCanvasHeight = 300;

        this.corner = new PointF(0, -1 * this.springWidth);
        this.wallTop = new PointF(0, this.springWidth * 2);
        this.floorEnd = new PointF(equilibirumLength * 2, -1 * this.springWidth);

        this.wall = super.addSegment(this.corner, this.wallTop);
        this.floor = super.addSegment(this.corner, this.floorEnd);

        // default spring length is the
        this.springLength = this.equilibriumLength;
        this.springEndPoint = new PointF(0, this.springLength);

        this.mass = undefined;

    }

    setCanvasWidthAndHeight(maxCanvasWidth, maxCanvasHeight) {
        this.maxCanvasWidth = maxCanvasWidth;
        this.maxCanvasHeight = maxCanvasHeight;
    }

    // sets the spring length to be the length of the spring
    stretchSpringAbsolute(newSpringLength) {
        let xTranslation = newSpringLength - this.springLength;
        this.springLength = newSpringLength;
        this.springEndPoint = new PointF(this.springLength, 0);
        // if (this.mass) {
        //         //     this.mass.lowerLeft.translate(xTranslation, 0);
        //         //     this.mass.upperLeft.translate(xTranslation, 0);
        //         //     this.mass.lowerRight.translate(xTranslation, 0);
        //         //     this.mass.upperRight.translate(xTranslation, 0);
        //         // }
    }

    addMass() {
        this.mass = super.addRangeBoxFromCenter(this.springEndPoint.x + this.springWidth, 0, this.springWidth * 2, this.springWidth * 2);
    }


    // relativeLength = 1 will return an arrow with the same length as the mass;
    addVelocityArrow(direction, label, relativeLength) {
        let length = this.springWidth * 2 * relativeLength;
        let textDisplacement = this.springWidth * 0.7;
        let relativeFontSize = this.springWidth * 0.7;
        let arrowCenterPoint = new PointF(this.springEndPoint.x + this.springWidth, this.springWidth * 1.5);
        let arrowBackPoint;
        let arrowFrontPoint;
        if (direction === 'right') {
            arrowFrontPoint = new PointF(arrowCenterPoint.x + length / 2, arrowCenterPoint.y);
            arrowBackPoint = new PointF(arrowCenterPoint.x - length / 2, arrowCenterPoint.y);
        } else if (direction === 'left') {
            arrowFrontPoint = new PointF(arrowCenterPoint.x - length / 2, arrowCenterPoint.y);
            arrowBackPoint = new PointF(arrowCenterPoint.x + length / 2, arrowCenterPoint.y);
        }
        super.addArrow(arrowBackPoint, arrowFrontPoint, this.springWidth * 0.6);
        super.labelLineAbove(arrowBackPoint, arrowFrontPoint, label, textDisplacement, relativeFontSize);
    }

    drawCanvas(springLength, springLabel, arrowDirection, arrowLabel, arrowRelativeLength) {
        this.stretchSpringAbsolute(springLength);
        if (this.massBoolean) {
            this.addMass();
        }
        let theSpring = super.addSpring(origin, this.springEndPoint, this.springWidth);
        if (springLabel) {
            super.labelSpring(theSpring, springLabel);
        }
        if (arrowDirection && arrowLabel && arrowRelativeLength) {
            this.addVelocityArrow(arrowDirection, arrowLabel, arrowRelativeLength);
        }
        return super.drawCanvas(this.maxCanvasWidth, this.maxCanvasHeight);
    }

}

// global variable total number of forces
let totalNumberOfVectors = 0;

// axis rotation boolean
// determines if the vector rotates when the axis rotate
class Vector {
    constructor(name, relativeMagnitude, label, angleInDegrees, startPoint, relativeAngleBoolean) {
        if (name === undefined) {
            name = numberToLetter(totalNumberOfVectors);
        }
        totalNumberOfVectors += 1;
        if (relativeMagnitude === undefined) {
            relativeMagnitude = 2;
        }
        if (label === undefined) {
            label = name;
        }
        if (angleInDegrees === undefined) {
            angleInDegrees = 0;
        }
        if (startPoint === undefined) {
            startPoint = origin;
        }
        if (relativeAngleBoolean === undefined) { // relative angle boolean determines if the angle is relative to a ramp, etc.
            relativeAngleBoolean = false;
        }

        this.relativeMagnitude = relativeMagnitude;
        this.label = label;
        this.angleInDegrees = angleInDegrees;
        this.relativeAngleBoolean = relativeAngleBoolean;


        if (typeof (startPoint) === 'string') {
            this.stringStartPoint = true;
            this.absoluteStartPoint = false;
            this.startPoint = startPoint;
        } else if (typeof (startPoint) === 'object') {
            this.absoluteStartPoint = true;
            this.stringStartPoint = false;
            this.startPoint = startPoint;
        }

        this.verticalRefernceLine = undefined;
        this.horizontalReferenceLine = undefined;

        this.components = undefined;
    }


    addVerticalReference(label, length, dashed, relativeAngleBoolean) {
        if (label === undefined) {
            label = 'a'
        }
        if (length === undefined) {
            length = this.relativeMagnitude * Math.sin(convertDegreesToRadians(this.angleInDegrees)) * 0.5;
        }
        if (dashed === undefined) {
            dashed = true;
        }
        if (relativeAngleBoolean === undefined) {
            relativeAngleBoolean = false;
        }
        this.verticalRefernceLine = {
            label: label,
            length: length,
            dashed: dashed,
            relativeAngleBoolean: relativeAngleBoolean
        }
    }

    rotate(rotationAngleInDegrees) {
        this.angleInDegrees += rotationAngleInDegrees;
    }

    // if horizontal first boolean is false, the vertical component is constructed first
    addComponents(dashedBoolean, horizontalFirstBoolean) {
        if (dashedBoolean === undefined) {dashedBoolean = true;}
        if (horizontalFirstBoolean === undefined) {horizontalFirstBoolean = true;}

        this.components = {
            dashedBoolean: dashedBoolean,
            horizontalFirstBoolean: horizontalFirstBoolean
        }

    }

    addHorizontalReference(label, length, dashed, relativeAngleBoolean) {
        if (label === undefined) {
            label = 'a'
        }
        if (length === undefined) {
            length = this.relativeMagnitude * Math.cos(convertDegreesToRadians(this.angleInDegrees)) * 0.5;
        }
        if (dashed === undefined) {
            dashed = true;
        }
        if (relativeAngleBoolean === undefined) {
            relativeAngleBoolean = false;
        }
        this.horizontalReferenceLine = {
            label: label,
            length: length,
            dashed: dashed,
            relativeAngleBoolean: relativeAngleBoolean
        }
    }

    setAbsoluteStartPoint(point) {
        this.absoluteStartPoint = true;
        this.startPoint = point;
    }

    addToDiagram(diagramObject, axisRotationInDegrees, relativeFontSize) {
        if (relativeFontSize === undefined) {
            relativeFontSize = 0.2;
        }
        let textDisplacement = relativeFontSize / 2;
        if (this.relativeAngleBoolean === true && axisRotationInDegrees !== undefined) {
            this.rotate(axisRotationInDegrees)
        }
        if (!this.absoluteStartPoint) {
            console.log(`ERROR: Must set absolute start point before drawing force ${name}`)
        }

        this.endPoint = this.startPoint.getAnotherPointWithTrig(this.relativeMagnitude, convertDegreesToRadians(this.angleInDegrees));

        diagramObject.addArrow(this.startPoint, this.endPoint);

        if (this.label) {
            diagramObject.labelLineAbove(this.startPoint, this.endPoint, this.label,textDisplacement, relativeFontSize);
        }

        if (this.relativeAngleBoolean === true && axisRotationInDegrees !== undefined) {
            this.rotate(-1 * axisRotationInDegrees);
        }

        if (this.components) {
            let point1 = this.startPoint;
            let point3 = this.endPoint;
            let point2;
            let components = point1.getComponentsToAnotherPoint(point3, convertDegreesToRadians(axisRotationInDegrees));
            if (this.components.horizontalFirstBoolean) {
                point2 = new PointF(point1.x + components.xComponent, point1.y);
            } else { // vertical first
                point2 = new PointF(point1.x, point1.y + components.yComponent);
            }

            diagramObject.addArrow(point1, point2);
            diagramObject.addArrow(point2, point3);
        }

    }
}

class Block {
    constructor(horizontalPosition, width, height, name) {
        if (horizontalPosition === undefined) {horizontalPosition = 0;}
        if (width === undefined) {width = 1;}
        if (height === undefined) {height = 1;}
        if (name === undefined) {name = 'A';}

        this.horizontalPosition = horizontalPosition;
        this.width = width;
        this.height = height;
        this.name = name;

        this.forces = [];
    }

    // if absolute angle boolean is false, then the angle is relative to surface
    // but if true, it is relative to the ground
    addForce(name, relativeMagnitude, label, angleInDegrees, startPoint, relativeAngleBoolean) {
        if (relativeMagnitude === undefined) {relativeMagnitude = 2;}
        if (angleInDegrees === undefined) {angleInDegrees = 0;}
        // if (label === undefined) {label = '';}
        if (startPoint === undefined) {startPoint = 'centerRight';}
        if (relativeAngleBoolean === undefined) {relativeAngleBoolean = 'false';}
        let newForce = new Vector(name, relativeMagnitude, label, angleInDegrees, startPoint, relativeAngleBoolean);
        this.forces.push(newForce);
        return newForce;
    }

    addGravity(relativeMagnitude, label) {
        return this.addForce(undefined, relativeMagnitude, label, 270, 'center', false);
    }

    addNormalForce(relativeMagnitude, label) {
        return this.addForce(undefined, relativeMagnitude, label, 90, 'bottomCenter', true);
    }

    addHorizontalAppliedForce(relativeMagnitude, label, direction) {
        if (direction === undefined) {direction = 'right';}
        let position, angle;
        if (direction === 'right') {
            position = 'rightCenter';
            angle = 0;
        } else if (direction === 'left') {
            position = 'leftCenter';
            angle = 180;
        }
        return this.addForce(undefined, relativeMagnitude, label, angle, position, true);
    }

    addFriction(relativeMagnitude, label, direction) {
        if (direction === undefined) {direction = 'left';}
        let position, angle;
        if (direction === 'right') {
            position = 'bottomRightCorner';
            angle = 0;
        } else if (direction === 'left') {
            position = 'bottomLeftCorner';
            angle = 180;
        }
        return this.addForce(undefined, relativeMagnitude, label, angle, position, true);
    }

    /// there is a bug with NEGATIVE angles on the LEFT
    // and i believe it is an error in the ADD ARROW function in the diagram object
    addAngledAppliedForce(relativeMagnitude, label, angleInDegrees, direction) {
        if (direction === undefined) {direction = 'right';}
        if (angleInDegrees === undefined) {angleInDegrees = 30;}
        let position, angle;
        if (direction === 'right') {
            position = 'topRightCorner';
            angle = angleInDegrees;
        } else if (direction === 'left') {
            position = 'topLeftCorner';
            angle = 180 - angleInDegrees;
        }
        return this.addForce(undefined, relativeMagnitude, label, angle, position, true);
    }

    addToDiagram(diagramObject, bottomCenterPoint, thetaInDegrees) {
        let bottomLeft = bottomCenterPoint.getAnotherPointWithTrig(this.width / 2, convertDegreesToRadians(thetaInDegrees) + Math.PI);
        let bottomRight = bottomCenterPoint.getAnotherPointWithTrig(this.width / 2, convertDegreesToRadians(thetaInDegrees));
        let topLeft = bottomLeft.getAnotherPointWithTrig(this.height, convertDegreesToRadians(thetaInDegrees) + Math.PI / 2);
        let topRight = bottomRight.getAnotherPointWithTrig(this.height, convertDegreesToRadians(thetaInDegrees) + Math.PI / 2);

        // diagramObject.addSegment(bottomLeft, bottomRight); // redundadant?
        diagramObject.addSegment(bottomRight, topRight);
        diagramObject.addSegment(topRight, topLeft);
        diagramObject.addSegment(topLeft, bottomLeft);

        this.forces.forEach((force) => {
            if (force.startPoint === 'rightCenter') {
                force.setAbsoluteStartPoint(bottomRight.interpolate(topRight, 0.5));
            } else if (force.startPoint === 'leftCenter') {
                force.setAbsoluteStartPoint(bottomLeft.interpolate(topLeft, 0.5));
            } else if (force.startPoint === 'topRightCorner') {
                force.setAbsoluteStartPoint(topRight);
            } else if (force.startPoint === 'topLeftCorner') {
                force.setAbsoluteStartPoint(topLeft);
            } else if (force.startPoint === 'bottomRightCorner') { //it's just a little bit off the bottom so it doesn't overlap with the graph!
                force.setAbsoluteStartPoint(bottomRight.interpolate(topRight, 0.1));
            } else if (force.startPoint === 'bottomLeftCorner') {
                force.setAbsoluteStartPoint(bottomLeft.interpolate(topLeft, 0.1));
            } else if (force.startPoint === 'center') {
                force.setAbsoluteStartPoint(bottomLeft.interpolate(topRight, 0.55));
                /// it is just a tiny bit off center so it does not overlap with the gravitational force!
            } else if (force.startPoint === 'bottomCenter') {
                force.setAbsoluteStartPoint(bottomLeft.interpolate(bottomRight, 0.45));
            } else if (force.startPoint === 'topCenter') {
                force.setAbsoluteStartPoint(topLeft.interpolate(topRight, 0.5));
            } else {
                force.setAbsoluteStartPoint(bottomLeft.interpolate(topRight, 0.5));
                //center is the default
            }

            force.addToDiagram(diagramObject, thetaInDegrees);

        });
    }
}


class BlockProblem extends DiagramF {
    constructor() {
        super();
        this.appliedForces = [];
        this.blocks = [];
        this.angleOfInclineDegrees = 0;
        this.length = 4;
        this.horizontalSurface = true;
        this.verticalSurface = false;
        this.ramp = false;
    }

    addBlock(horizontalPosition, width, height, name) {
        if (name === undefined) {name = alphabetArray[this.blocks.length];}
        let newBlock = new Block(horizontalPosition, width, height, name);
        this.blocks.push(newBlock);
        return
    }

    selectBlock(name) {
        if (name === undefined) {name = 'A';}
        let k;
        let selectedBlock;
        for (k = 0; k < this.blocks.length; k++) {
            if (this.blocks[k].name === name) {
                selectedBlock = this.blocks[k];
            }
        }
        return selectedBlock
    }

    addForce(blockName, relativeMagnitude, label, angleInDegrees, position, absoluteAngleBoolean) {
        let selectedBlock = this.selectBlock(blockName);
        return selectedBlock.addForce(relativeMagnitude, angleInDegrees, label, position, absoluteAngleBoolean);
    }

    addGravity(blockName, relativeMagnitude, label) {
        let selectedBlock = this.selectBlock(blockName);
        return selectedBlock.addGravity(relativeMagnitude, label);
    }

    addNormalForce(blockName, relativeMagnitude, label) {
        return this.selectBlock(blockName).addNormalForce(relativeMagnitude, label);
    }

    addHorizontalAppliedForce(blockName, relativeMagnitude, label, direction) {
        return this.selectBlock(blockName).addHorizontalAppliedForce(relativeMagnitude, label, direction);
    }

    addFriction(blockName, relativeMagnitude, label, direction) {
        return this.selectBlock(blockName).addFriction(relativeMagnitude, label, direction);
    }

    addAngledAppliedForce(blockName, relativeMagnitude, label, theta, direction) {
        return this.selectBlock(blockName).addAngledAppliedForce(relativeMagnitude, label, theta, direction);
    }

    setLength(newLength) {
        this.length = newLength;
    }

    setAngleOfIncline(thetaInDegrees) {
        if (thetaInDegrees % 180 === 0) {
            this.horizontalSurface = true;
            this.verticalSurface = false;
            this.ramp = false;
            this.angleOfInclineDegrees = 0;
        }
        else if ((thetaInDegrees + 90) % 180 === 0) {
            this.verticalSurface = true;
            this.horizontalSurface = false;
            this.ramp = false;
            this.angleOfInclineDegrees = 90;
        }
        else {
            this.ramp = true;
            this.horizontalSurface = false;
            this.verticalSurface = false;
            this.angleOfInclineDegrees = thetaInDegrees % 360;
        }
    }

    addRamp(thetaInDegrees) {
        if (thetaInDegrees === undefined) {thetaInDegrees = 30;}
        this.angleOfInclineDegrees = thetaInDegrees;
        this.ramp = true
    }

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {

        // draw ramp
        let theta = convertDegreesToRadians(this.angleOfInclineDegrees);
        let leftEndPoint = origin.getAnotherPointWithTrig(this.length / 2, theta + Math.PI);
        let rightEndPoint = origin.getAnotherPointWithTrig(this.length/2, theta);
        super.addSegment(leftEndPoint, rightEndPoint);
        if (this.ramp) {
            let cornerPoint = new PointF(leftEndPoint.x + this.length * Math.cos(theta), leftEndPoint.y);
            super.addSegment(leftEndPoint, cornerPoint);
            super.addSegment(cornerPoint, rightEndPoint);
        }

        // draw blocks
        this.blocks.forEach((block) => {
            let bottomCenterPoint = leftEndPoint.getAnotherPointWithTrig(block.horizontalPosition + this.length / 2, this.angleOfInclineDegrees);
            block.addToDiagram(this, bottomCenterPoint, theta);
        });

        // draw canvas
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }
}
