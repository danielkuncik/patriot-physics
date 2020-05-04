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


// a new free-body diagram specifically for Atwood Machines
class AtwoodFreeBodyDiagram extends Diagram {
   constructor() {
       super();
       this.forces = [];
       this.largestForceInDegrees = 180;
   }

   setLargestForce(newDegrees) {
       this.largestForceInDegrees = newDegrees;
   }

   addForce(direction,label,relativeMagnitude) {
       if (direction !== 'clockwise' && direction !== 'counterclockwise') {
           console.log('ERROR: forces on an Atwood machine must be clockwise or counterclockwise');
           return false
       }
       if (relativeMagnitude === undefined) {
           relativeMagnitude = 1;
       }
        this.forces.push({
            direction: direction,
            label: label,
            relativeMagnitude: relativeMagnitude
        });
   }

   addClockwiseForce(label, relativeMagnitude) {
       this.addForce('clockwise',label,relativeMagnitude);
   }

   addCounterClockwiseForce(label, relativeMagnitude) {
       this.addForce('counterclockwise',label, relativeMagnitude);
   }

   getMaxMagnitude() {
       let maxMagnitude = 0;
       this.forces.forEach((force) => {
           if (force.relativeMagnitude > maxMagnitude) {
               maxMagnitude = force.relativeMagnitude;
           }
       });
       return maxMagnitude
   }

    // reorders the force array from largest to smallest magnitude, so
    // the largest magnitude always appears largest on the diagram
    orderForcesByMagnitude() {
       let forceOrderArray = [];
       let k;
       for (k = 0; k < this.forces.length; k++) {
           forceOrderArray.push(k);
       }
       let q;
       for (q = 0; q < this.forces.length; q++) {
           let index1 = q;
           let index2 = q + 1;
           while (index2 < this.forces.length && this.forces[forceOrderArray[index1]].relativeMagnitude > this.forces[forceOrderArray[index2]].relativeMagnitude) {
               let var1 = forceOrderArray[index1];
               let var2 = forceOrderArray[index2];
               forceOrderArray[index1] = var2;
               forceOrderArray[index2] = var1;
               index1++;
               index2++;
           }
       }
       return forceOrderArray
   }

   addSideFBD(forceArray) {
       this.sideFBD = fastFBD(forceArray);
   }

   createDiagramObject() {
       const maxMagnitude = this.getMaxMagnitude();
       let radius = 2;
       this.addBlackCircle(origin,1);
       const forceOrderArray = this.orderForcesByMagnitude();
       let q;
       for (q = 0; q < forceOrderArray.length; q++) {
           const force = this.forces[forceOrderArray[q]];
           const magnitude = force.relativeMagnitude / maxMagnitude * this.largestForceInDegrees;
           const startRadians = convertDegreesToRadians(90 - magnitude / 2);
           const endRadians = convertDegreesToRadians(90 + magnitude / 2);

           this.addArc(origin,radius,startRadians,endRadians);
           this.addText(force.label, new Point(0, radius + 0.5),1);

           // if the diagram is rescaled with double factor...
           /// this function causes the arrowhead to end up in a different location
           // how do i permnantly attach it to the end of the arc?
           let arrowHeadCenterPoint, arrowHeadAngle;
           if (force.direction === 'counterclockwise') {
               arrowHeadCenterPoint = constructPointWithMagnitude(radius, endRadians);
               arrowHeadAngle = convertRadiansToDegrees(endRadians);
           } else if (force.direction === 'clockwise') {
               arrowHeadCenterPoint = constructPointWithMagnitude(radius, startRadians);
               arrowHeadAngle = convertRadiansToDegrees(startRadians);
           }
           this.addArrowhead(arrowHeadCenterPoint,arrowHeadAngle,1.5,40);

           radius += 2;
       }
       if (this.sideFBD) {
           this.sideFBD.createDiagramObject();
           this.sideFBD.rescaleSingleFactor(1.5 * this.forces.length);
           this.merge(this.sideFBD, 'right',2, true);
       }
   }

   drawCanvas(maxWidth, maxHeight, forceSize, unit, wiggleRoom) {
       this.createDiagramObject();
       return super.drawCanvas(maxWidth, maxHeight, forceSize, unit, wiggleRoom);
   }

}


// force array is a n x 2 matrix
// the first item of each row is the magnitude, must be a number
// the second item of each row is the direciton, can be a number or appropriate text
// magnitude must be a number
function fastFBD(forceArray, velocityDirection) {
    let myFBD = new FreeBodyDiagram();
    let relativeMagnitude, label, direction, theta, magnitudeOrLabel;
    forceArray.forEach((force) => {
        direction = force[0];
        theta = processDirectionInput(direction);
        magnitudeOrLabel = force[1]; /// processed as a label if a string or as a magnitude if a number
        if (typeof(magnitudeOrLabel) === 'string') { /// if it is a label
            label = magnitudeOrLabel;
            if (force[2]) { // can add a relative magnitude quantitiy as third element, or it will default to 1
                relativeMagnitude = force[2];
            } else {
                relativeMagnitude = 1;
            }
        } else if (typeof(magnitudeOrLabel) === 'number') { // if it is a magnitude
            relativeMagnitude = magnitudeOrLabel;
            label = printForceAbbreviated(magnitudeOrLabel);
        }
        myFBD.addForce(relativeMagnitude, theta, label);
    });
    if (velocityDirection) {
        let velocityTheta = processDirectionInput(velocityDirection);
        myFBD.addVelocityArrow(velocityTheta); // all default values
    }
    return myFBD;
}

function freeFallFBD() {
    return fastFBD([['down','gravity']]);
}

