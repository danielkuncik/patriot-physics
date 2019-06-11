// the goal here is to recreate the physics diagram generation file
// but with classes more carefully defined


// returns a scale Factor, an Xtranslation factor, a yTranslationfactor
// this would cause the point to fit into a box with width no greater than maxwidth and height no greater than max height
// and for all points to be positive (as though all in quadrant 1)



function minOfTwoValues(val1, val2) {
    if (val1 <= val2) {
        return val1
    } else {
        return val2
    }
}

function nondistortedResize(originalWidth, originalHeight, maxWidth, maxHeight) {
    var scale = 1;
    if (originalWidth !== maxWidth || originalHeight !== maxHeight) {
        scale = minOfTwoValues(maxWidth / originalWidth, maxHeight / originalHeight);
    }
    return scale;
}

class point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    translate(xTranslation, yTranslation) {
        this.x += xTranslation;
        this.y += yTranslation;
    }

    // rotates a point around the center point by a certain angle
    // default center point is origin
    rotate(rotationAngleInRadians, centerRotationPoint) {
        if (centerRotationPoint === undefined) {centerRotationPoint = origin;}
        this.translate(-1 * centerRotationPoint.x, -1 * centerRotationPoint.y);
        let xPrime = this.x * Math.cos(rotationAngleInRadians) - this.y * Math.sin(rotationAngleInRadians);
        let yPrime = this.y * Math.cos(rotationAngleInRadians) + this.x * Math.sin(rotationAngleInRadians);
        this.translate(centerRotationPoint.x, centerRotationPoint.y);
        this.x = xPrime;
        this.y = yPrime;
    }

    rescale(scaleFactor) {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
    }

    reflectAboutXAxis() {
        this.y *= -1;
    }

    getQuadrant() {
        if (Math.abs(this.x) < 1e-10 && Math.abs(this.y) < 1e-10) {return 'origin';}
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

    // returns the angle in radians between the x-axis and a line segment from the origin to this point
    // returns angles theta such that 0 <= theta < 2pi
    getAngleToHorizontal() {
        let theta;
        const quadrant = this.getQuadrant();
        if (quadrant === '1') {theta = Math.atan(this.y / this.x);}
        else if (quadrant === '2' || quadrant === '3') {theta = Math.PI + Math.atan(this.x, this.y);}
        else if (quadrant === '4') {theta = 2 * Math.PI + Math.atan(this.x, this.y);}
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

    /// if this point were the origin, returns the angle to the horizontal of the other point
    // returns angles theta such that 0 <= theta < 2pi
    getAngleToAnotherPoint(anotherPoint) {
        anotherPoint.translate(-1 * this.x, -1 * this.y);
        let theta = anotherPoint.getAngleToHorizontal();
        anotherPoint.translate(this.x, this.y);
        return theta;
    }

    // if this point were the origin
    // in what quadrant woul the other point be?
    getQuadrantOfAnotherPoint(anotherPoint) {
        anotherPoint.translate(-1 * this.x, -1 * this.y);
        let quadrant = anotherPoint.getQuadrant();
        anotherPoint.translate(this.x, this.y);
        return quadrant;
    }

    // returns a new point
    // on the ray beginning at this point and pointing toward anotherPoint
    // at a distance the length between the points * proportion
    // so if propotion = 0.5, it will be halfway between the points
    // and if proportion = 2, it will be twice as far away as the other point (so it can actually interpolate and extrapolate)
    interpolate(anotherPoint, proportion) {
        let theta = this.getAngleToAnotherPoint(anotherPoint);
        let L = this.getDistanceToAnotherPoint(anotherPoint) * proportion;
        let x = this.x + L * Math.cos(theta);
        let y = this.y + L * Math.sin(theta);
        return new point(x, y);
    }
}


// global variable origin
const origin = new point(0,0);

function constructPointWithMagnitude(magnitude, angleInDegrees) {
    let x = magnitude * Math.cos(convertDegreeToRadian(angleInDegrees));
    let y = magnitude * Math.sin(convertDegreeToRadian(angleInDegrees));
    let newPoint = new point(x, y);
    return newPoint;
}


class segment {
    constructor(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
        this.thickness = 2;
        this.color = "#000000";
        this.cap = "butt";
    }

    // do i want thickness to scale with the rest of the image??
    // right now, line thickness is the only thing that does not scale
    setThickness(newThickness) {
        this.thickness = newThickness;
    }

    setColor(newColor) {
        this.color = newColor;
    }

    getLength() {
        return this.point1.getDistanceToAnotherPoint(this.point2);
    }

    // if point 1 were the origin, returns the angle to the horizontal of point 2
    // returns angles theta such that 0 <= theta < 2pi
    getAngleToHorizontal() {
        return this.point1.getAngleToHorizontal(this.point2);
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
        if (originalSlope >= 1e10) {return 0;} // due to floating point arithmetic, a slope zero usually doesn't actually come out as zero!
        else if (originalSlope <= 1e-10) {return 1e10;} // if it returned Infinity, could lead to NaNs in later calculations
        else {return -1 / originalSlope;}
    }

    /* A BAD FUNCTION, MUST FIX
    // if two segments were to continue infinitely
    // gets the angle with which this segment intersects another
    // of two possible angles, always returns smaller angle
    getAngleWithAnotherSegment(anotherSegment) {
        let theta1 = this.getAngleToHorizontal();
        let theta2 = anotherSegment.getAngleToHorizontal();
        let choice1 = Math.abs(theta1 - theta2);
        let choice2 = 2 * Math.PI - choice1;
        if (choice1 <= choice2) {return choice1}
        else {return choice2}
    }
    */
}

function convertDegreesToRadians(angle) {
    return angle / 180 * Math.PI;
}

function convertRadiansToDegrees(angle) {
    return angle / Math.PI * 180;
}

// the box should always belong to an object!
class rectangle {
    constructor(lowerLeftPoint, width, height) {
        this.lowerLeftPoint = lowerLeftPoint;
        this.upperLeftPoint = new point(lowerLeftPoint.x, lowerLeftPoint.y + height);
        this.lowerRightPoint = new point(lowerLeftPoint.x + width, lowerLeftPoint.y);
        this.upperRightPoint = new point(lowerLeftPoint.x + width, lowerLeftPoint.y + height);
        this.centerPoint = new point(lowerLeftPoint.x + width / 2, lowerLeftPoint.y + height / 2);
    }

    rotateCounterClockwiseAboutCenter(angleInRadians) {
        this.lowerLeftPoint.rotate(angleInRadians, this.centerPoint);
    }


}
// does this make a duplicate of the center point??
function constructRectangleFromCenter(centerPoint, width, height) {
    let lowerLeftX = centerPoint.x - width/2;
    let lowerLeftY = centerPoint.y - height/2;
    var lowerLeftPoint = new point(lowerLeftX, lowerLeftY);
    var newRectangle = new rectangle(lowerLeftPoint, width, height);
    return newRectangle;
}

class text {
    constructor(letters, centerPoint, relativeFontSize, rotationAngleInRadians) {
        this.letters = letters;
        this.relativeFontSize = relativeFontSize;
        if (rotationAngleInRadians === undefined) {this.rotationAngleInRadians = 0} else {this.rotationAngleInRadians = rotationAngleInRadians}

        //this.referencePoint = centerPoint;
        // reference point will be different if the alignment is different!

        this.font = 'Arial';
        this.alignment = 'center'; // default
        this.baseline = 'middle';
        this.color = "#000000";
        this.centerPoint = centerPoint;
        this.referencePoint = this.centerPoint; // default, text in center

        this.width = letters.length * this.relativeFontSize;
        this.height = this.relativeFontSize / 2;
        this.rectangle = constructRectangleFromCenter(centerPoint, this.width, this.height);
        this.rectangle.rotateCounterClockwiseAboutCenter(rotationAngleInRadians);
    }


    rescale(scaleFactor) {
        this.relativeFontSize *= scaleFactor;
        // i won't change anything else because they are all tied to the point array with the diagram
    }

    setRelativeFontSize(newRelativeFontSize) {
        this.relativeFontSize = newRelativeFontSize;
    }

    setColor(newColor) {
        this.color = newColor;
    }

    setFont(newFont) {
        this.font = newFont;
    }

    /// need to think about implications of this!
    setAlignmentAndBaseline(newAlignment, newBaseline) {
        this.alignment = newAlignment;
        this.baseline = newBaseline;
    }

    centerText() {
        this.referencePoint = this.rectangle.centerPoint;
        this.alignment = 'center';
        this.baseline = 'middle';
    }

    alignLowerLeftCorner() {
        this.referencePoint = this.rectangle.lowerLeftPoint;
        this.alignment = 'left';
        this.baseline = 'bottom';
    }


    rotateCounterClockwise(rotationInRadians) {
        this.rotationAngleInRadians += rotationInRadians;
        this.rectangle.rotateCounterClockwiseAboutCenter(rotationInRadians);
    }

    setNewRotationAngle(newRotationAngleInRadians) {
        this.rectangle.rotateCounterClockwiseAboutCenter(-1 * this.rotationAngleInRadians);
        this.rotationAngleInRadians = newRotationAngleInRadians;
        this.rectangle.rotateCounterClockwiseAboutCenter(this.rotationAngleInRadians);
    }

}

class circle {
    constructor(centerPoint, radius) {
        //this.centerPoint = centerPoint;
        this.radius = radius;
        this.filled = false;
        this.lineThickness = 2;
        this.lineColor = "#000000";
        this.fillColor = "#000000";
        this.center = centerPoint;
        this.rectangle = constructRectangleFromCenter(centerPoint, radius * 2, radius * 2);
    }

    fill() {
        this.filled = true;
    }

    unfill() {
        this.filled = false;
    }

    rescale(scaleFactor) {
        this.radius *= scaleFactor; // why is there a /2??? i don't know, but it is necessary for it to work
    }

}

// alternative to constructing text with a center point, the default
function constructTextFromLowerLeftPoint() {}

// constructs a parallel segment
function constructParallelSegment(originalSegment, startPoint, length) {

}

class diagram {
    constructor() {
        this.points = [];
        this.segments = [];
        this.circles = [];
        this.texts = [];
        this.xMax = undefined;
        this.xMin = undefined;
        this.yMax = undefined;
        this.yMin = undefined;
        this.horizontalRange = undefined;
        this.verticalRange = undefined;
    }

    // i added a line to prevent creating duplicates!
    addNewPoint(x,y) {
        let pointAlreadyExists = this.searchForPoint(x,y);
        if (pointAlreadyExists) {
            return pointAlreadyExists
        } else {
            let newPoint = new point(x,y);
            this.points.push(newPoint);
            return newPoint
        }
    }

    addExistingPoint(existingPoint) {
        let pointAlreadySaved = this.searchForPoint(existingPoint.x,existingPoint.y);
        if (pointAlreadySaved) {
            return pointAlreadySaved
        } else {
            this.points.push(existingPoint);
            return existingPoint
        }
    }

    // won't work if you truly have values less than 1e-10
    searchForPoint(x,y) {
        let existingPoint = false;
        this.points.forEach((point) => {
            if (Math.abs(point.x - x) < 1e-10 && Math.abs(point.y - y) < 1e-10) {
                existingPoint = point
            }
        });
        return existingPoint
    }


    /// points must already be in the array of poitns before adding the segment!
    addSegment(point1, point2) {
        let pointA = this.addExistingPoint(point1);
        let pointB = this.addExistingPoint(point2);
        var newSegment = new segment(pointA, pointB);
        this.segments.push(newSegment);
        return newSegment
    }

    // shortcut, makes it easier to add a segment witout creating each point first
    addTwoPointsAndSegement(x1,y1,x2,y2) {
        let pointA = this.addNewPoint(x1,y1);
        let pointB = this.addNewPoint(x2,y2);
        let newSegment = this.addSegment(pointA, pointB);
        return newSegment
    }


    /// add arrow
    // right now, it's pretty bad
    addArrow(point1, point2, arrowheadLength, arrowheadAngleInDegrees) {
        if (arrowheadAngleInDegrees === undefined) {arrowheadAngleInDegrees = 20;}
        let phi = convertDegreesToRadians(arrowheadAngleInDegrees);

        let angleToHorizontal = point1.getAngleToAnotherPoint(point2);


        let L = point1.getDistanceToAnotherPoint(point2);
        if (arrowheadLength === undefined) {arrowheadLength = L * 0.1;}
        let arrowheadEnd1 = new point(L - arrowheadLength * Math.cos((phi)), arrowheadLength * Math.sin(phi)); // location of the arrowhead end if the arrow were a straight line on the x-axis
        let arrowheadEnd2 = new point(L - arrowheadLength * Math.cos((phi)), -1 * arrowheadLength * Math.sin(phi)); // location of the arrowhead end if the arrow were a straight line on the x-axis

        arrowheadEnd1.rotate(angleToHorizontal);
        arrowheadEnd1.translate(point1.x, point1.y);
        arrowheadEnd2.rotate(angleToHorizontal);
        arrowheadEnd2.translate(point1.x, point1.y);

        this.addExistingPoint(point1);
        this.addExistingPoint(point2);
        this.addExistingPoint(arrowheadEnd1);
        this.addExistingPoint(arrowheadEnd2);
        this.addSegment(point1, point2); // main line
        this.addSegment(point2, arrowheadEnd1); // half of arrowhead
        this.addSegment(point2, arrowheadEnd2); // half of arrowhead

        return true;
    };


    // add circle
    // point must already exist? NO
    addCircle(centerPoint, radius) {
        let center = this.addExistingPoint(centerPoint);
        let thisCircle = new circle(centerPoint, radius);
        this.addExistingPoint(thisCircle.rectangle.lowerLeftPoint);
        this.addExistingPoint(thisCircle.rectangle.upperLeftPoint);
        this.addExistingPoint(thisCircle.rectangle.lowerRightPoint);
        this.addExistingPoint(thisCircle.rectangle.upperRightPoint);
        this.circles.push(thisCircle);
        return thisCircle;
    }


    /// center point need not already exist
    addText(letters, centerPoint, relativeFontSize, rotation) {
        let center = this.addExistingPoint(centerPoint);
        let newText = new text(letters, center, relativeFontSize, rotation);
        this.addExistingPoint(newText.rectangle.lowerLeftPoint);
        this.addExistingPoint(newText.rectangle.upperLeftPoint);
        this.addExistingPoint(newText.rectangle.lowerRightPoint);
        this.addExistingPoint(newText.rectangle.upperRightPoint);
        // this.addExistingPoint(newText.rectangle.centerPoint); /// shoudl center point already exist though???
        this.texts.push(newText);
        return newText
    }

    // creates text above and below a line
    // if line is vertical "text above" is to the left and "textBelow" is to the right
    // returns textAbove if it exists
    // if only textBelow exists, returns textBelow
    labelLine(point1, point2, textAbove, textBelow, textDisplacement, relativeFontSize) {
        let centerOfLine = new point( (point1.x + point2.x)/2, (point1.y + point2.y)/2);
        let theta = point1.getAngleToAnotherPoint(point2);
        let textRotation;

        let phi;
        let quadrant = point1.getQuadrantOfAnotherPoint(point2);

        if (quadrant === '1') {
            phi = Math.PI /2 - theta;
            textRotation = -1 * theta;
        } else if (quadrant === '2') {
            phi = Math.PI - theta;
            textRotation = theta + 3 * Math.PI / 2; // i don't know why this works, but it does!
        } else if (quadrant === '3') {
            textRotation = theta + Math.PI / 2;
            phi = 3 * Math.PI / 2 - theta;
        } else if (quadrant === '4') {
            textRotation = -1 * theta;
            phi = 2* Math.PI - theta;
        } else if (quadrant === '+Y' || quadrant === '-Y') {
            textRotation = 3 * Math.PI / 2;
            // phi undefined
        } else if (quadrant === '+X' || quadrant === 'X') {
            textRotation = 0
            // phi undefined
        }


        let aboveX = centerOfLine.x, belowX = centerOfLine.x;
        let aboveY = centerOfLine.y, belowY = centerOfLine.y;

        // i know this is inefficient, but it is easy to understand
        if (quadrant === '1' || quadrant === '3') { // up right line
            aboveX -= textDisplacement * Math.cos(phi);
            aboveY += textDisplacement * Math.sin(phi);
            belowX += textDisplacement * Math.cos(phi);
            belowY -= textDisplacement * Math.sin(phi);
        } else if (quadrant === '2' || quadrant === '4') { // up left line
            aboveX += textDisplacement * Math.cos(phi);
            aboveY += textDisplacement * Math.sin(phi);
            belowX -= textDisplacement * Math.cos(phi);
            belowY -= textDisplacement * Math.sin(phi);
        } else if (quadrant === '+Y' || quadrant === '-Y') { // vertical line
            aboveX -= textDisplacement;
            belowX += textDisplacement;
        } else if (quadrant === "+X" || quadrant === '-X') { // horizontal line
            aboveY += textDisplacement;
            belowY -= textDisplacement;
        }


        let textAboveObject, textBelowObject;
        if (textAbove) {
            textAboveObject = this.addText(textAbove, new point(aboveX, aboveY), relativeFontSize, textRotation);
        }
        if (textBelow) {
            textBelowObject = this.addText(textBelow, new point(belowX, belowY), relativeFontSize, textRotation);
        }

        if (textAbove) {
            return textAboveObject
        } else if (textBelow) {
            return textBelowObject
        } else {
            return undefined
        }
    };


    labelLineAbove(point1, point2, text, textDisplacement, relativeFontSize) {
        let obj = this.labelLine(point1, point2, text, undefined, textDisplacement, relativeFontSize);
        return obj
    }

    labelLineBelow(point1, point2, text, textDisplacement, relativeFontSize) {
        let obj = this.labelLine(point1, point2, undefined, text, textDisplacement, relativeFontSize);
        return obj
    }

    /// bring back the dotted line function here!!!
    // adds a dashed line between point1 and point2 in which there are numDashes of dashes,
    // canvas has a built in dashed line funciton, but it has never worked properly for me
    // so i am creating my own instead
    // the line will always start and end with a solid segment!
    addDashedLine(point1, point2, numDashes, thickness) {
        if (thickness === undefined) {thickness = 1;}
        let totalLength = point1.getDistanceToAnotherPoint(point2);
        if (numDashes === undefined || isNaN(numDashes)) {numDashes = 10;}
        let numSteps = 2 * numDashes - 1;
        let stepLength = totalLength / numSteps;
        let theta = point1.getAngleToAnotherPoint(point2);
        let xDisplacementPerDash = stepLength * Math.cos(theta);
        let yDisplacementPerDash = stepLength * Math.sin(theta);
        //     if (isNaN(numSteps)) {numSteps = 1;} // to prevent potential of an infinite loop
        let n = 0;
        let thisSegment;
        // let isThisSegmentSolid = true;
        while (n < numSteps) {
            if (n % 2 === 0) {
                thisSegment = this.addTwoPointsAndSegement(point1.x + xDisplacementPerDash * n,point1.y + yDisplacementPerDash * n, point1.x + xDisplacementPerDash * (n + 1),point1.y + yDisplacementPerDash * (n + 1));
                thisSegment.setThickness(thickness);
            }
            //   isThisSegmentSolid = !isThisSegmentSolid;
            n++;
        }
    };


    /// transformations
    translate(xTranslation, yTranslation) {
        this.points.forEach((point) => {point.translate(xTranslation, yTranslation)});
    }

    rotateCounterclockwise(angleInRadians, centerRotationPoint) {
        if (centerRotationPoint === undefined) {centerRotationPoint = origin;}
        this.points.forEach((point) => {point.rotate(angleInRadians, centerRotationPoint)});
    }

    rescale(scaleFactor) {
        this.points.forEach((point) => {point.rescale(scaleFactor)});
        this.texts.forEach((text) => {text.rescale(scaleFactor)});
        this.circles.forEach((circle) => circle.rescale(scaleFactor));
    }

    reflectAboutXAxis() {
        this.points.forEach((point) => {point.reflectAboutXAxis();})
    }

    getRange() {

        let xMin = this.points[0].x;
        let xMax = xMin;
        let yMin = this.points[0].y;
        let yMax = yMin;

        this.points.forEach((point) => {
            if (point.x > xMax) {xMax = point.x;}
            if (point.x < xMin) {xMin = point.x;}
            if (point.y > yMax) {yMax = point.y;}
            if (point.y < yMin) {yMin = point.y;}
        });

        let horizontalRange = xMax - xMin;
        let verticalRange = yMax - yMin;

        this.xMax = xMax;
        this.xMin = xMin;
        this.yMax = yMax;
        this.yMin = yMin;
        this.horizontalRange = horizontalRange;
        this.verticalRange = verticalRange;

        return true
    }

    // returns an html canvas of the diagram
    // maxWidth and maxHeight are the maximum width and height of the canvas
    // unit is the unit for the maxWidth and maxHeight variabales, default is px
    // wiggle room is the space around the outside of the canvas in which nothing will be drawn,
    // default wiggle room is 20
    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        if (wiggleRoom === undefined) {wiggleRoom = 20;}
        try {
            if (isNaN(maxWidth) || isNaN(maxHeight)) throw 'Width and Height must be numbers';
            if (maxWidth <= 0 || maxHeight <= 0) throw 'Width and Height must be positive numbers';
            if (this.points.length === 0) throw "Cannot draw canvas with no elements."
        }
        catch(err) {
            console.log(err);
        }

        this.getRange();

        try {
            if (this.horizontalRange === 0 ) throw 'Cannot draw canvas horizontal range = 0';
            if (this.verticalRange === 0) throw 'Cannot draw canvas with vertical range = 0';
        }
        catch (err) {
            console.log(err);
        }

        if (unit === undefined) {unit = 'px';}

        const scaleFactor = nondistortedResize(this.horizontalRange, this.verticalRange, maxWidth - wiggleRoom * 2, maxHeight - wiggleRoom * 2);

        // transform to prepare for canvas;
        this.translate(-1 * this.xMin, -1 * this.yMin);
        this.rescale(scaleFactor);

        const canvasWidth = this.horizontalRange * scaleFactor + wiggleRoom * 2;
        const canvasHeight = this.verticalRange * scaleFactor + wiggleRoom * 2;

        let c = document.createElement('canvas');
        c.setAttribute("width", String(canvasWidth) + unit);
        c.setAttribute("height", String(canvasHeight) + unit);
        var ctx = c.getContext('2d');

        this.segments.forEach((segment) => {
            ctx.lineWidth = segment.thickness;
            ctx.lineCap = segment.lineCap;
            ctx.strokeStyle = segment.color;
            ctx.moveTo(wiggleRoom + segment.point1.x, canvasHeight - wiggleRoom - segment.point1.y);
            ctx.lineTo(wiggleRoom + segment.point2.x, canvasHeight - wiggleRoom - segment.point2.y);
            ctx.stroke();
        });

        this.texts.forEach((textObject) => {
            ctx.font = String(textObject.relativeFontSize) + unit + " " + String(textObject.font);
            ctx.fillStyle = textObject.color;
            ctx.textAlign = textObject.alignment;
            ctx.textBaseline = textObject.baseline;

            //// MUST ADD IF/THEN STATEMENT TO SET THE REFERENCE POINT BASED UPON THE TEXT ALIGNMENT AND BASELINE

            if (Math.abs(textObject.rotationAngleInRadians) > 1e-10) {
                ctx.translate(wiggleRoom + textObject.centerPoint.x, canvasHeight - textObject.centerPoint.y - wiggleRoom);
                ctx.rotate(textObject.rotationAngleInRadians);
                ctx.fillText(textObject.letters, 0, 0);
                ctx.rotate(-1 * textObject.rotationAngleInRadians);
                ctx.translate(-1 * (wiggleRoom + textObject.centerPoint.x), -1 * ( canvasHeight - textObject.centerPoint.y - wiggleRoom));
            } else {
                ctx.fillText(textObject.letters, wiggleRoom + textObject.centerPoint.x, canvasHeight - textObject.centerPoint.y - wiggleRoom);
            }

        });

        this.circles.forEach((circleObject) => {
            ctx.fillStyle = circleObject.fillColor;
            ctx.strokeStyle = circleObject.lineColor;
            ctx.lineWidth = circleObject.lineThickness;

            ctx.beginPath();
            ctx.arc(wiggleRoom + circleObject.center.x, canvasHeight - wiggleRoom - circleObject.center.y, circleObject.radius, 0, Math.PI * 2);
            ctx.stroke();
            if (circleObject.filled) {ctx.fill();}
        });

        // before finishing, undo transformations
        this.rescale(1 / scaleFactor);
        this.translate(this.xMin, this.yMin);

        return c
    }

}



class quantitativeGraph extends diagram {
    constructor(xMinOnGraph, xMaxOnGraph, yMinOnGraph, yMaxOnGraph, desiredAspectRatio) {
        super();
        // these variables are different than those for the canvas

        try {
            if (xMinOnGraph >= xMaxOnGraph) {throw "ERROR: xmax must be greater than xmin";}
            if (yMinOnGraph >= yMaxOnGraph) {throw "ERROR: ymax must be greater than ymin"}
        }
        catch (err) {
            console.log(err);
        }
        if (desiredAspectRatio === undefined) {desiredAspectRatio = 1;}

        // correct aspect ratio
        // to set the axis ratio to the desired value, multiple all y values by the multiplier
        this.yMultiplier = desiredAspectRatio / (yMaxOnGraph - yMinOnGraph) * (xMaxOnGraph - xMinOnGraph);

        this.xMinOnGraph = xMinOnGraph;
        this.xMaxOnGraph = xMaxOnGraph;
        this.yMinOnGraphOriginal = yMinOnGraph;
        this.yMaxOnGraphOriginal = yMaxOnGraph;
        this.yMinOnGraph = yMinOnGraph * this.yMultiplier;
        this.yMaxOnGraph = yMaxOnGraph * this.yMultiplier;

        this.xAxis = super.addTwoPointsAndSegement(this.xMinOnGraph, 0, this.xMaxOnGraph, 0);
        this.yAxis = super.addTwoPointsAndSegement(0, this.yMinOnGraph, 0, this.yMaxOnGraph);
        this.axisLabelFontSize = undefined;
        this.hashLabelFontSize = undefined;
        this.hashLength = undefined;
        this.axisTextDisplacement = undefined;
        this.hashLabelDisplacement = undefined;
        this.pointRadius = undefined;
        this.setRelativeSizes();
        this.yAxisLabel = undefined;
        this.xAxisLabel = undefined;
    }

    setRelativeSizes() { // based on the shorter of the two sides
        let sizeFactor;
        if (this.xMaxOnGraph - this.xMinOnGraph < this.yMaxOnGraph - this.yMinOnGraph) {
            sizeFactor = this.xMaxOnGraph - this.xMinOnGraph;
        } else {
            sizeFactor = this.yMaxOnGraph - this.yMinOnGraph;
        }
        // estimates of what might work well
        this.axisLabelFontSize = sizeFactor / 8;
        this.hashLabelFontSize = sizeFactor / 10;
        this.hashLength = sizeFactor / 5;
        this.axisTextDisplacement = this.hashLength / 2 + this.hashLabelFontSize + this.axisLabelFontSize * 0.5; /// should automatically increase when the first hash is added
        this.hashLabelDisplacement = this.hashLength /2  + this.hashLabelFontSize * 0.5;
        this.pointRadius = sizeFactor / 30;
    }

    labelAxes(xLabel, yLabel) {
        let lowerLeftCorner = new point(this.xMinOnGraph, this.yMinOnGraph);
        let lowerRightCorner = new point(this.xMaxOnGraph, this.yMinOnGraph);
        let upperLeftCorner = new point(this.xMinOnGraph, this.yMaxOnGraph);

        this.xAxisLabel = super.labelLineBelow(lowerLeftCorner, lowerRightCorner, xLabel, this.axisTextDisplacement, this.axisLabelFontSize);
        this.yAxisLabel = super.labelLineAbove(lowerLeftCorner, upperLeftCorner, yLabel, this.axisTextDisplacement, this.axisLabelFontSize);
    }


    /*
    I need to add:
    an option taht allows the label to be at the end of the graph, not on the axis
     */
    addXAxisHash(position, label, doYouWantTheLabelFarAway) {
        try {
            if (position < this.xMinOnGraph || position > this.xMaxOnGraph) {throw "ERROR: xAxis Hash out of range";}
        }
        catch (err) {
            console.log(err);
            return false
        }
        if (doYouWantTheLabelFarAway === undefined) {doYouWantTheLabelFarAway = false;}

        let newHash = super.addTwoPointsAndSegement(position, this.hashLength / 2, position, -1 * this.hashLength / 2);

        let newLabel;
        if (doYouWantTheLabelFarAway) {
            newLabel = super.addText(label, new point(position, -1 * this.hashLabelDisplacement - this.yMinOnGraph), this.hashLabelFontSize, 0);
        } else {
            newLabel = super.addText(label, new point(position, -1 * this.hashLabelDisplacement), this.hashLabelFontSize, 0);
        }
        return newHash
    }
    addYAxisHash(position, label, doYouWantTheLabelFarAway) {
        try {
            if (position < this.yMinOnGraphOriginal || position > this.yMaxOnGraphOriginal) {throw "ERROR: yAxis Hash out of range";}
        }
        catch (err) {
            console.log(err);
            return false
        }
        if (doYouWantTheLabelFarAway === undefined) {doYouWantTheLabelFarAway = false;}


        let newHash = super.addTwoPointsAndSegement(this.hashLength / 2, position * this.yMultiplier, -1 * this.hashLength / 2, position * this.yMultiplier);

        let newLabel;
        if (doYouWantTheLabelFarAway) {
            let newLabel = super.addText(label, new point(-1 * this.hashLabelDisplacement + this.xMinOnGraph, position * this.yMultiplier), this.hashLabelFontSize, 0);
        } else {
            let newLabel = super.addText(label, new point(-1 * this.hashLabelDisplacement, position * this.yMultiplier), this.hashLabelFontSize, 0);
        }
        return newHash;
    }

    /// i will need to put some thought into how the dotted lines work so that they look nice!
    // adds a dotted line
    addXAxisReferenceLine(position) {
        super.addDashedLine(new point(position, this.yMinOnGraph), new point(position, this.yMaxOnGraph), 15);
        // function here
        // adds a vertical dotted line at this position on the axis
    }

    addYAxisReferenceLine(position) {
        super.addDashedLine(new point(this.xMinOnGraph, position * this.yMultiplier), new point(this.xMaxOnGraph, position * this.yMultiplier), 15);
        // function here
        // adds a horizontal dotted line at this position on the y axis
    }

    // an array of positions
    // at each position, adds a reference hash, a label, an a reference line
    addReferenceArray(xReferenceArray, yReferenceArray) {
        xReferenceArray.forEach((position) => {
            this.addXAxisHash(position, String(position), true);
            this.addXAxisReferenceLine(position);
        });
        yReferenceArray.forEach((position) => {
            this.addYAxisHash(position, String(position), true);
            this.addYAxisReferenceLine(position);
        });
    }

    addSegmentAndTwoPoints(x1,y1,x2,y2) {
        try {
            if (x1 < this.xMinOnGraph || x1 > this.xMaxOnGraph) {throw "ERROR: segment given out of range (x1)";}
            if (x2 < this.xMinOnGraph || x2 > this.xMaxOnGraph) {throw "ERROR: segment given out of range (x2)";}
            if (y1 < this.yMinOnGraphOriginal || y1 > this.yMaxOnGraphOriginal) {throw "ERROR: segment given out of range (y1)";}
            if (y2 < this.yMinOnGraphOriginal || y2 > this.yMaxOnGraphOriginal) {throw "ERROR: segment given out of range (y2)";}
        }
        catch (err) {
            console.log(y1, this.yMinOnGraph, this.yMaxOnGraph);
            console.log(err);
            return false
        }

        let newSegment = super.addTwoPointsAndSegement(x1,y1 * this.yMultiplier,x2,y2 * this.yMultiplier);
        return newSegment
    }

    addPointAsACircle(x,y) {
        let newCircle = super.addCircle(new point(x,y), this.pointRadius);
        newCircle.fill();
        return newCircle;
    }

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }

}

class circuitDiagram extends diagram {
    constructor() {
        super();
    }

    addNewPoint(x,y) {
        return super.addNewPoint(x,y);
    }

    // points must already exist?
    addWire(point1, point2) {
        let pointA = super.addExistingPoint(point1);
        let pointB = super.addExistingPoint(point2);
        let newWire = super.addSegment(pointA, pointB);
        return newWire
    }


    // should only be accessible within the addResistor function
    addZigZag(endPoint1, endPoint2, width) {
        let theta = endPoint1.getAngleToAnotherPoint(endPoint2);
        let L = endPoint1.getDistanceToAnotherPoint(endPoint2);
        let intermediatePoint1 = endPoint1.interpolate(endPoint2, 0.333333);
        intermediatePoint1.translate(width * Math.cos(theta + Math.PI / 2), width * Math.sin(theta + Math.PI / 2));
        let intermediatePoint2 = endPoint1.interpolate(endPoint2, 0.666667);
        intermediatePoint2.translate(width * Math.cos(theta - Math.PI / 2), width * Math.sin(theta - Math.PI / 2));
        this.addWire(endPoint1, intermediatePoint1);
        this.addWire(intermediatePoint1, intermediatePoint2);
        this.addWire(intermediatePoint2, endPoint2);
    }

    addResistor(endPoint1, endPoint2, width, numZigZags) {
        if (numZigZags === undefined) {
            numZigZags = 3;
        }
        if (width === undefined) {
            width = endPoint1.getDistanceToAnotherPoint(endPoint2) * 0.25;
        }
        let j;
        let startPoint = endPoint1, finishPoint;
        for (j = 0; j < numZigZags; j++) {
            finishPoint = endPoint1.interpolate(endPoint2, (j + 1) / numZigZags);
            this.addZigZag(startPoint, finishPoint, width);
            startPoint = finishPoint;
        }
    }

    /*
        this.addCell = function(endPoint1, endPoint2, numBatteries, width) {
        if (numBatteries === undefined) {numBatteries = 2;}
        if (width === undefined) {width = getLength(endPoint1, endPoint2) * 0.5;} /// should be proportioned by numbatteries

        const numLines = numBatteries * 2;
        const angle = getAngleToHorizontal(endPoint1, endPoint2);
        var j, centerPoint, lineWidth, pointA, pointB;
        for (j = 0; j < numLines; j++) {
            centerPoint = interpolatePoint(endPoint1, endPoint2, j / (numLines - 1) );
            if (j % 2 === 0) {lineWidth = width / 2;} else {lineWidth = width;}
            pointA = getNewPointWithTrig(centerPoint, lineWidth / 2, rotateCounterClockwise90(angle));
            pointB = getNewPointWithTrig(centerPoint, lineWidth / 2, rotateClockwise90(angle));
            this.addWire(pointA, pointB);
        }
    };
    // i need to add the positive and negative signs!

     */

    addCell(endPoint1, endPoint2, numBatteries, width) {
        if (numBatteries === undefined) {numBatteries = 2;}
        if (width === undefined) {width = endPoint1.getDistanceToAnotherPoint(endPoint2) * 0.5;} /// should be proportioned by numbatteries

        let numLines = numBatteries * 2;
        let theta = endPoint1.getAngleToAnotherPoint(endPoint2);
        let j, pointA, pointB, lineWidth;
        for (j = 0; j < numLines; j++) {
            if (j % 2 === 0) {lineWidth = width / 2;} else {lineWidth = width;}
            pointA = endPoint1.interpolate(endPoint2, j / (numLines - 1));
            pointB = endPoint1.interpolate(endPoint2, j / (numLines - 1));
            pointA.translate(lineWidth * Math.cos(theta + Math.PI/2), lineWidth * Math.sin(theta + Math.PI /2));
            pointB.translate(lineWidth * Math.cos(theta - Math.PI/2), lineWidth * Math.sin(theta - Math.PI /2));
            super.addSegment(pointA, pointB);
        }
        // still need to add + and - signs on the cathode and anode
    }

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }
}

class freeBodyDiagram extends diagram {
    constructor() {
        super();
        this.forces = [];
        this.maxForce = 0;
        this.arrowheadAngle = 20; // in degrees
        this.circleRadius = 0;
        this.arrowheadLength = 0;
        this.relativeFontSize = 0;
        this.textDisplacement = 0;
    }

    /// do i want to make forces their own class??????

    // if force is vertical, label above will add text on the left and label below will ad text on the right
    addForce(relativeMagnitude,angle,labelAbove, labelBelow) {
        if (this.maxForce < relativeMagnitude) {this.maxForce = relativeMagnitude;}
        let endPoint = new point(relativeMagnitude * Math.cos(convertDegreesToRadians(angle)), relativeMagnitude * Math.sin(convertDegreesToRadians(angle)));
        this.forces.push(
            {
                "relativeMagnitude": relativeMagnitude,
                "angle": angle,
                "labelAbove": labelAbove,
                "labelBelow": labelBelow,
                "endPoint": endPoint
            }
        );
    };

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        this.circleRadius = this.maxForce * 0.1;
        this.arrowheadLength = this.maxForce * 0.05;
        this.relativeFontSize = this.maxForce * 0.02;
        this.textDisplacement = this.relativeFontSize / 2;
        console.log(origin);
        this.forces.forEach((force) => {
            super.addArrow(origin,force.endPoint,this.arrowheadLength,this.arrowheadAngle);
            super.labelLine(origin, force.endPoint, force.labelAbove, force.labelBelow, this.textDisplacement, this.relativeFontSize);
        });
        let centerCircle = super.addCircle(origin, this.circleRadius,true);
        centerCircle.fill();
        console.log(this);
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }


}

class unitMap extends diagram {
    constructor() {
        super();
        this.pods = {};
        this.radius = 1;
        this.horizontalSpaceBetween = 1;
        this.verticalSpaceBetween = 1;
    }

    addPod(key, letter, verticalPosition, horizontalPosition, prerequisites) {
        let x, y, center;
        this.pods[key] =
            {
                "letter": letter,
                "verticalPosition": verticalPosition,
                "horizontalPosition": horizontalPosition,
                "prerequisites": prerequisites
            };
        x = horizontalPosition * (this.horizontalSpaceBetween + this.radius * 2);
        y = verticalPosition * (this.verticalSpaceBetween + this.radius * 2);
        center = new point(x,y);

        super.addCircle(center,this.radius);
        super.addText(letter, center, this.radius * 1.3);

        return this.pods[key];
    };

    // function to add segments between all pods and prerequisite pods
    connectPrerequisites() {
        console.log('hello there mate');
        /// add a function here that connects each pod to its prerequisite!!!!
    }

    getMaxLevel() {
        // add function here
    }

    getMaxHorizontalPosition() {
        // add function here
    }

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }
}
