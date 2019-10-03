// the goal here is to recreate the physics Diagram generation file
// but with classes more carefully defined


/*
I need to create a function which finds the natural aspect ratio of my diagram
which i could use to better fit it into spaces
 */


// returns a scale Factor, an Xtranslation factor, a yTranslationfactor
// this would cause the Point to fit into a box with width no greater than maxwidth and height no greater than max height
// and for all points to be positive (as though all in quadrant 1)

// from https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

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

// given a number zero to 20, returns a proportionate shade of gray
// with 0 = white
// and 20 = black
function grayscale0to20(score) {
    var grayShade;
    switch(score) {
        case 20:
            grayShade = "#000000";
            break;
        case 19:
            grayShade = "#101010";
            break;
        case 18:
            grayShade = "#202020";
            break;
        case 17:
            grayShade = "#303030";
            break;
        case 16:
            grayShade = "#404040";
            break;
        case 15:
            grayShade = "#505050";
            break;
        case 14:
            grayShade = "#606060";
            break;
        case 13:
            grayShade = "#696969";
            break;
        case 12:
            grayShade = "#787878";
            break;
        case 11:
            grayShade = "#888888";
            break;
        case 10:
            grayShade = "#989898";
            break;
        case 9:
            grayShade = "#A8A8A8";
            break;
        case 8:
            grayShade = "#B0B0B0";
            break;
        case 7:
            grayShade = "#BEBEBE";
            break;
        case 6:
            grayShade = "#C8C8C8";
            break;
        case 5:
            grayShade = "#D3D3D3";
            break;
        case 4:
            grayShade = "#DCDCDC";
            break;
        case 3:
            grayShade = "#E8E8E8";
            break;
        case 2:
            grayShade = "#F5F5F5";
            break;
        case 1:
            grayShade = "#F8F8F8";
            break;
        case 0:
            grayShade = "#FFFFFF";
            break;
        default:
            grayShade = "#FFFFFF";
            break
    }
    return grayShade;
}


class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    //    this.uuid = create_UUID();
    }

    translate(xTranslation, yTranslation) {
        this.x += xTranslation;
        this.y += yTranslation;
    }

    // rotates a Point around the center Point by a certain angle
    // default center Point is origin
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

    // returns the angle in radians between the x-axis and a line Segment from the origin to this Point
    // returns angles theta such that 0 <= theta < 2pi
    getAngleToHorizontal() {
        let theta;
        const quadrant = this.getQuadrant();
        if (quadrant === '1') {theta = Math.atan(this.y / this.x);}
        /// inefficient, but very reliable
        else if (quadrant === '2') {theta = Math.PI / 2 + Math.atan(-1 * this.x / this.y);}
        else if (quadrant === '3') {theta = Math.PI + Math.atan((-1 * this.x) / (-1 * this.y));}
        else if (quadrant === '4') {theta = Math.PI * 3 / 2 + Math.atan(this.x / -1 *  this.y);}
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
        let newx, newy;
        newx = this.x + length * Math.cos(thetaInRadians);
        newy = this.y + length * Math.sin(thetaInRadians);
        return new Point(newx,newy)
    }
}

// global variable origin
const origin = new Point(0,0);

function constructPointWithMagnitude(magnitude, angleInDegrees) {
    let x = magnitude * Math.cos(convertDegreeToRadian(angleInDegrees));
    let y = magnitude * Math.sin(convertDegreeToRadian(angleInDegrees));
    let newPoint = new Point(x, y);
    return newPoint;
}


class Segment {
    constructor(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
        this.thickness = 2;
        this.color = "#000000";
        this.cap = "butt";
        this.dotted = false;
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

    /// i need a way to customize dot sizes and dash sizes!!!
    /// right now, it is set to 1/30 times the average of the width and height of the whole canvas!
    turnIntoDottedLine() {
        this.dotted = true;
        this.setThickness(1);
    };

    // if Point 1 were the origin, returns the angle to the horizontal of Point 2
    // returns angles theta such that 0 <= theta < 2pi
    getAngleToHorizontal() {
        return this.point1.getAngleToAnotherPoint(this.point2);
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

    /* A BAD FUNCTION, MUST FIX
    // if two segments were to continue infinitely
    // gets the angle with which this Segment intersects another
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
class Rectangle {
    constructor(lowerLeftPoint, width, height) {
        this.lowerLeftPoint = lowerLeftPoint;
        this.upperLeftPoint = new Point(lowerLeftPoint.x, lowerLeftPoint.y + height);
        this.lowerRightPoint = new Point(lowerLeftPoint.x + width, lowerLeftPoint.y);
        this.upperRightPoint = new Point(lowerLeftPoint.x + width, lowerLeftPoint.y + height);
        this.centerPoint = new Point(lowerLeftPoint.x + width / 2, lowerLeftPoint.y + height / 2);
    }

    rotateCounterClockwiseAboutCenter(angleInRadians) {
        this.lowerLeftPoint.rotate(angleInRadians, this.centerPoint);
        this.upperLeftPoint.rotate(angleInRadians, this.centerPoint);
        this.lowerRightPoint.rotate(angleInRadians, this.centerPoint);
        this.upperRightPoint.rotate(angleInRadians, this.centerPoint);

    }

    rescaleVertically(yMultiplier) {
        // used to fit a function graph in
    }


}
// does this make a duplicate of the center Point??
function constructRectangleFromCenter(centerPoint, width, height) {
    let lowerLeftX = centerPoint.x - width/2;
    let lowerLeftY = centerPoint.y - height/2;
    var lowerLeftPoint = new Point(lowerLeftX, lowerLeftY);
    var newRectangle = new Rectangle(lowerLeftPoint, width, height);
    return newRectangle;
}

class Text {
    constructor(letters, centerPoint, relativeFontSize, rotationAngleInRadians) {
        this.letters = letters;
        this.relativeFontSize = relativeFontSize;
        if (rotationAngleInRadians === undefined) {this.rotationAngleInRadians = 0} else {this.rotationAngleInRadians = rotationAngleInRadians}

        //this.referencePoint = centerPoint;
        // reference Point will be different if the alignment is different!

        this.font = 'Arial';
        this.alignment = 'center'; // default
        this.baseline = 'middle';
        this.color = "#000000";
        this.centerPoint = centerPoint;
        this.referencePoint = this.centerPoint; // default, Text in center

        this.width = letters.length * this.relativeFontSize;
        this.height = this.relativeFontSize / 2;
        this.rectangle = constructRectangleFromCenter(centerPoint, this.width, this.height);
        this.rectangle.rotateCounterClockwiseAboutCenter(rotationAngleInRadians);
    }


    rescale(scaleFactor) {
        this.relativeFontSize *= scaleFactor;
        // i won't change anything else because they are all tied to the Point array with the Diagram
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

class Circle {
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

    setFillColor(newColor) {
        this.fillColor = newColor;
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

class FunctionGraph {
    constructor(func, xMin, xMax) {
        this.function = func;
        this.xMin = xMin;
        this.xMax = xMax;
        // error if xMin is less than xMax
        let range = this.getRange();
        this.yMin = range[0];
        this.yMax = range[1];
        this.rectangle = new Rectangle(new Point(this.xMin,this.yMin),(this.xMax - this.xMin), (this.yMax - this.yMin));
    }

    getRange(Nsteps) {
        if (Nsteps === undefined) {Nsteps = 500;}
        let i, xVal, yVal;
        let yMax = this.function(this.xMin);
        let yMin = yMax;
        let xStep = (this.xMax - this.xMin) / Nsteps;
        for (i = 0; i <= Nsteps; i++) {
            xVal = this.xMin + i * xStep;
            yVal = this.function(xVal);
            if (yVal < yMin) {yMin = yVal;}
            if (yVal > yMax) {yMax = yVal;}
        }
        return [yMin, yMax];
    }

    rescaleVertically(yMultiplier) {
        /// rescales the function so that it fits
    }
}

// alternative to constructing Text with a center Point, the default
function constructTextFromLowerLeftPoint() {}

// constructs a parallel Segment
function constructParallelSegment(originalSegment, startPoint, length) {

}

class Diagram {
    constructor() {
        this.points = [];
        this.segments = [];
        this.circles = [];
        this.texts = [];
        this.functionGraphs = [];
        this.xMax = undefined;
        this.xMin = undefined;
        this.yMax = undefined;
        this.yMin = undefined;
        this.horizontalRange = undefined;
        this.verticalRange = undefined;
    }

    // i added a line to prevent creating duplicates!
    // 8-25-19: Circle function was breaking because of the duplicates
    addNewPoint(x,y) {
        let pointAlreadyExists = this.searchForPoint(x,y);
        if (pointAlreadyExists) {
            return pointAlreadyExists
        } else {
            let newPoint = new Point(x,y);
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


    /// points must already be in the array of poitns before adding the Segment!
    addSegment(point1, point2) {
        let pointA = this.addExistingPoint(point1);
        let pointB = this.addExistingPoint(point2);
        var newSegment = new Segment(pointA, pointB);
        this.segments.push(newSegment);
        return newSegment
    }

    // shortcut, makes it easier to add a Segment witout creating each Point first
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
        let arrowheadEnd1 = new Point(L - arrowheadLength * Math.cos((phi)), arrowheadLength * Math.sin(phi)); // location of the arrowhead end if the arrow were a straight line on the x-axis
        let arrowheadEnd2 = new Point(L - arrowheadLength * Math.cos((phi)), -1 * arrowheadLength * Math.sin(phi)); // location of the arrowhead end if the arrow were a straight line on the x-axis

        arrowheadEnd1.rotate(angleToHorizontal);
        arrowheadEnd1.translate(point1.x, point1.y);
        arrowheadEnd2.rotate(angleToHorizontal);
        arrowheadEnd2.translate(point1.x, point1.y);

        this.addExistingPoint(point1);
        this.addExistingPoint(point2);
        this.addExistingPoint(arrowheadEnd1);
        this.addExistingPoint(arrowheadEnd2);
        let mainSegment = this.addSegment(point1, point2); // main line
        this.addSegment(point2, arrowheadEnd1); // half of arrowhead
        this.addSegment(point2, arrowheadEnd2); // half of arrowhead

        return mainSegment;
    };

    // in case you want a line with an arrowhead in the middle of it
    addArrowHeadBetweenPoints(point1, point2, length, angleInDegrees) {
        let angleInRadians = convertDegreesToRadians(angleInDegrees);
        let centerPoint = new Point((point1.x + point2.x)/2, (point1.y + point2.y)/2);
        let theta = point1.getAngleToAnotherPoint(point2) + Math.PI;
        let end1 = centerPoint.getAnotherPointWithTrig(length, theta + angleInRadians);
        let end2 = centerPoint.getAnotherPointWithTrig(length, theta - angleInRadians);
        this.addSegment(centerPoint, end1);
        this.addSegment(centerPoint, end2);
    }


    // add Circle
    // Point must already exist? NO
    addCircle(centerPoint, radius) {
        let center = this.addExistingPoint(centerPoint);
        let thisCircle = new Circle(center, radius);
        this.addExistingPoint(thisCircle.rectangle.lowerLeftPoint);
        this.addExistingPoint(thisCircle.rectangle.upperLeftPoint);
        this.addExistingPoint(thisCircle.rectangle.lowerRightPoint);
        this.addExistingPoint(thisCircle.rectangle.upperRightPoint);
        this.circles.push(thisCircle);
        return thisCircle;
    }
    /// if the Point already exists, eg. because it is the end of a line,
    /// then this functino does not work properly!

    addFunctionGraph(func, xMin, xMax) {
        let thisFunctionGraph = new FunctionGraph(func, xMin, xMax);
        this.addExistingPoint(thisFunctionGraph.rectangle.lowerLeftPoint);
        this.addExistingPoint(thisFunctionGraph.rectangle.upperLeftPoint);
        this.addExistingPoint(thisFunctionGraph.rectangle.lowerRightPoint);
        this.addExistingPoint(thisFunctionGraph.rectangle.upperRightPoint);
        this.functionGraphs.push(thisFunctionGraph);
        return thisFunctionGraph;
    }


    /// center Point need not already exist
    addText(letters, centerPoint, relativeFontSize, rotation) {
        let center = this.addExistingPoint(centerPoint);
        let newText = new Text(letters, center, relativeFontSize, rotation);
        this.addExistingPoint(newText.rectangle.lowerLeftPoint);
        this.addExistingPoint(newText.rectangle.upperLeftPoint);
        this.addExistingPoint(newText.rectangle.lowerRightPoint);
        this.addExistingPoint(newText.rectangle.upperRightPoint);
        // this.addExistingPoint(newText.Rectangle.centerPoint); /// shoudl center Point already exist though???
        this.texts.push(newText);
        return newText
    }


    // creates Text above and below a line
    // if line is vertical "Text above" is to the left and "textBelow" is to the right
    // returns textAbove if it exists
    // if only textBelow exists, returns textBelow
    // i need to create a function that labels a segment
    labelLine(point1, point2, textAbove, textBelow, textDisplacement, relativeFontSize) {
        let centerOfLine = new Point( (point1.x + point2.x)/2, (point1.y + point2.y)/2);
        let theta = point1.getAngleToAnotherPoint(point2);
        let textRotation;
        if (relativeFontSize === undefined) {
            relativeFontSize = point1.getDistanceToAnotherPoint(point2) * 0.1;
        }
        if (textDisplacement === undefined) {
            textDisplacement = relativeFontSize * 1.5
        }

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
            textAboveObject = this.addText(textAbove, new Point(aboveX, aboveY), relativeFontSize, textRotation);
        }
        if (textBelow) {
            textBelowObject = this.addText(textBelow, new Point(belowX, belowY), relativeFontSize, textRotation);
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
    // the line will always start and end with a solid Segment!
    addDashedLine(point1, point2, numDashes, thickness) {
        // if (thickness === undefined) {thickness = 1;}
        // let totalLength = point1.getDistanceToAnotherPoint(point2);
        // if (numDashes === undefined || isNaN(numDashes)) {numDashes = 10;}
        // let numSteps = 2 * numDashes - 1;
        // let stepLength = totalLength / numSteps;
        // let theta = point1.getAngleToAnotherPoint(point2);
        // let xDisplacementPerDash = stepLength * Math.cos(theta);
        // let yDisplacementPerDash = stepLength * Math.sin(theta);
        // //     if (isNaN(numSteps)) {numSteps = 1;} // to prevent potential of an infinite loop
        // let n = 0;
        // let thisSegment;
        // // let isThisSegmentSolid = true;
        // while (n < numSteps) {
        //     if (n % 2 === 0) {
        //         thisSegment = this.addTwoPointsAndSegement(point1.x + xDisplacementPerDash * n,point1.y + yDisplacementPerDash * n, point1.x + xDisplacementPerDash * (n + 1),point1.y + yDisplacementPerDash * (n + 1));
        //         thisSegment.setThickness(thickness);
        //     }
        //     //   isThisSegmentSolid = !isThisSegmentSolid;
        //     n++;
        // }


        let newLine = this.addSegment(point1, point2);
        newLine.turnIntoDottedLine();
        return newLine
    };

    // mergeWithAnotherDiagram
    merge(anotherDiagram, whichSide, bufferSpace) {
        this.getRange();
        anotherDiagram.getRange();
        if (whichSide === 'right') {
            anotherDiagram.translate(this.xMax + bufferSpace, 0);
        } else if (whichSide === 'left') {
            anotherDiagram.translate(-1 * this.xMin - bufferSpace, 0);
        } else if (whichSide === 'top') {
            anotherDiagram.translate(0, this.yMax + bufferSpace);
        } else if (whichSide === 'bottom') {
            anotherDiagram.translate(0, -1 * this.yMax - bufferSpace);
        } else {
            return false
        }

        anotherDiagram.points.forEach((point) => {this.points.push(point)});
        anotherDiagram.segments.forEach((segment) => {this.segments.push(segment)});
        anotherDiagram.circles.forEach((circle) => {this.circles.push(circle)});
        anotherDiagram.texts.forEach((text) => {this.texts.push(text)});
        anotherDiagram.functionGraphs.forEach((functionGraph) => {this.functionGraphs.push(functionGraph)});

        return true;
    }


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
        this.circles.forEach((circle) => {circle.rescale(scaleFactor)});
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

    // returns an html canvas of the Diagram
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

        // should i make this variable?
        let dotSize = (this.horizontalRange + this.verticalRange) / 2 / 30;
        this.segments.forEach((segment) => {
            ctx.lineWidth = segment.thickness;
            ctx.lineCap = segment.lineCap;
            ctx.strokeStyle = segment.color;
            if (segment.dotted) {
                let q;
                let length = segment.getLength();
                let theta = segment.getAngleToHorizontal();
                let Ndots = length / dotSize;
                for (q = 0; q < Ndots; q++) {
                    if (q % 2 === 0) {
                        ctx.beginPath();
                        ctx.moveTo(wiggleRoom + segment.point1.x + length * q / Ndots * Math.cos(theta), canvasHeight - wiggleRoom - segment.point1.y - length * q / Ndots * Math.sin(theta));
                        ctx.lineTo(wiggleRoom + segment.point1.x + length * (q + 1) / Ndots * Math.cos(theta), canvasHeight - wiggleRoom - segment.point1.y - length * (q + 1) / Ndots * Math.sin(theta));
                        ctx.stroke();
                    }
                }
            } else { /// normal (not dotted) lines
                ctx.beginPath();
                ctx.moveTo(wiggleRoom + segment.point1.x, canvasHeight - wiggleRoom - segment.point1.y);
                ctx.lineTo(wiggleRoom + segment.point2.x, canvasHeight - wiggleRoom - segment.point2.y);
                ctx.stroke();
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

        this.functionGraphs.forEach((FunctionGraphObject) => {
            ctx.lineWidth = 2;
            ctx.lineCap = 'butt';
            ctx.strokeStyle = 'black'; // can change later!
            let Nsteps = 200;
            let k, thisXVal, thisYVal, lastXVal, lastYval;
            let range = FunctionGraphObject.xMax - FunctionGraphObject.xMin;
            let xSteps = range / Nsteps;
            lastXVal = FunctionGraphObject.xMin;
            lastYval = FunctionGraphObject.function(lastXVal);
            for (k = 1; k <= Nsteps; k++) {
                thisXVal = FunctionGraphObject.xMin + xSteps * k;
                thisYVal = FunctionGraphObject.function(thisXVal);

                /// the function was not transformed yet!
                // so there are transformations are included here!
                // ctx.moveTo(wiggleRoom + (lastXVal - this.xMin) * scaleFactor, canvasHeight - wiggleRoom - (lastYval - this.yMin) * scaleFactor);
                // ctx.lineTo(wiggleRoom + (thisXVal - this.xMin) * scaleFactor, canvasHeight - wiggleRoom - (thisYVal - this.yMin) * scaleFactor);

                ctx.moveTo(wiggleRoom + (lastXVal - this.xMin) * scaleFactor, canvasHeight - wiggleRoom - (lastYval - this.yMin) * scaleFactor);
                ctx.lineTo(wiggleRoom + (thisXVal - this.xMin) * scaleFactor, canvasHeight - wiggleRoom - (thisYVal - this.yMin) * scaleFactor);


                ctx.stroke();

                lastXVal = thisXVal;
                lastYval = thisYVal;
            }

        });
        /// texts come last so they are not written over
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


        // before finishing, undo transformations
        this.rescale(1 / scaleFactor);
        this.translate(this.xMin, this.yMin);

        return c
    }

}


///problems:
// 1 - there needs to be a function taht rescales the x and y axis values
/// without actualyl changing anything about the graph
/// 2 - i need to redo the dashed/dotted line function above!
//// so that it does not make a million points, and it makes lines that look a whole lot better!
class QuantitativeGraph extends Diagram {
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
        this.yMultiplier = ( (xMaxOnGraph - xMinOnGraph) / (yMaxOnGraph - yMinOnGraph) ) / desiredAspectRatio ;
        //the y multiplier is the aspect ratio i would get if i did nothing divided by the aspect ratio i want
        // mulitply all y values by this number

        this.xMinOnGraph = xMinOnGraph; // differentiates from xMin of the diagram, defined above
        this.xMaxOnGraph = xMaxOnGraph;
        this.yMinOnGraphOriginal = yMinOnGraph;
        this.yMaxOnGraphOriginal = yMaxOnGraph;
        this.yMinOnGraph = yMinOnGraph * this.yMultiplier;
        this.yMaxOnGraph = yMaxOnGraph * this.yMultiplier;

        // x axis
        super.addTwoPointsAndSegement(this.xMinOnGraph, 0, this.xMaxOnGraph, 0);

        // y axis
        super.addTwoPointsAndSegement(0, this.yMinOnGraph, 0, this.yMaxOnGraph);

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
        this.axisTextDisplacement = this.hashLength / 2 + this.hashLabelFontSize + this.axisLabelFontSize * 0.8; /// should automatically increase when the first hash is added
        this.hashLabelDisplacement = this.hashLength /2  + this.hashLabelFontSize * 0.8;
        this.pointRadius = sizeFactor / 30;
    }

    labelAxes(xLabel, yLabel) {
        let lowerLeftCorner = new Point(this.xMinOnGraph, this.yMinOnGraph);
        let lowerRightCorner = new Point(this.xMaxOnGraph, this.yMinOnGraph);
        let upperLeftCorner = new Point(this.xMinOnGraph, this.yMaxOnGraph);

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
        /// i don't understand what i was thinking of when i created this variable?
        // odn't i alwasy want the label far away??
        if (doYouWantTheLabelFarAway === undefined) {doYouWantTheLabelFarAway = true;}

        let newHash = super.addTwoPointsAndSegement(position, this.hashLength / 2 + this.yMinOnGraph, position, -1 * this.hashLength / 2 + this.yMinOnGraph);

        let newLabel;
        if (doYouWantTheLabelFarAway) {
            newLabel = super.addText(label, new Point(position, -1 * this.hashLabelDisplacement + this.yMinOnGraph), this.hashLabelFontSize, 0);
        } else {
            newLabel = super.addText(label, new Point(position, -1 * this.hashLabelDisplacement), this.hashLabelFontSize, 0);
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
            let newLabel = super.addText(label, new Point(-1 * this.hashLabelDisplacement + this.xMinOnGraph, position * this.yMultiplier), this.hashLabelFontSize, 0);
        } else {
            let newLabel = super.addText(label, new Point(-1 * this.hashLabelDisplacement, position * this.yMultiplier), this.hashLabelFontSize, 0);
        }
        return newHash;
    }

    /// i will need to put some thought into how the dotted lines work so that they look nice!
    // adds a dotted line
    addXAxisReferenceLine(position) {
        super.addDashedLine(new Point(position, this.yMinOnGraph), new Point(position, this.yMaxOnGraph), 15);
        // function here
        // adds a vertical dotted line at this position on the axis
    }

    addYAxisReferenceLine(position) {
        super.addDashedLine(new Point(this.xMinOnGraph, position * this.yMultiplier), new Point(this.xMaxOnGraph, position * this.yMultiplier), 15);
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
            if (x1 < this.xMinOnGraph || x1 > this.xMaxOnGraph) {throw "ERROR: Segment given out of range (x1)";}
            if (x2 < this.xMinOnGraph || x2 > this.xMaxOnGraph) {throw "ERROR: Segment given out of range (x2)";}
            if (y1 < this.yMinOnGraphOriginal || y1 > this.yMaxOnGraphOriginal) {throw "ERROR: Segment given out of range (y1)";}
            if (y2 < this.yMinOnGraphOriginal || y2 > this.yMaxOnGraphOriginal) {throw "ERROR: Segment given out of range (y2)";}
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
        // doens't work, i think it might have something to do witht he fact that
        // in this function the new Point is declared here
        // but in the one above (which works) the new Point is decaled in the super function
        // but new points are declared here in many functinos of this class...a mystery
        // look at super.addCircle
        let centerPoint = new Point(x,y * this.yMultiplier);
        let newCircle = super.addCircle(centerPoint, this.pointRadius);
        newCircle.fill();
        return newCircle;
    }

    addSegmentWithCirclesOnEnds(x1,y1,x2,y2) {
        this.addSegmentAndTwoPoints(x1,y1,x2,y2);
        this.addPointAsACircle(x1,y1);
        this.addPointAsACircle(x2,y2);
    }

    // add a graph of a function
    addFunctionGraph(func, xMin, xMax) {
        let yMultipler = this.yMultiplier;
        let rescaledFunction = function(x) {
            return func(x) * yMultipler
        };
        super.addFunctionGraph(rescaledFunction, xMin, xMax);
    }

    addStepwiseFunction(arrayOfPoints, circlesBoolean) {
        if (circlesBoolean === undefined) {circlesBoolean = true;}
        let k;
        for (k = 0; k < arrayOfPoints.length - 1; k++) {
            this.addSegmentAndTwoPoints(arrayOfPoints[k][0], arrayOfPoints[k][1], arrayOfPoints[k + 1][0], arrayOfPoints[k + 1][1]);
        }
        if (circlesBoolean) {
            arrayOfPoints.forEach((point) => {this.addPointAsACircle(point[0], point[1]);});
        }
    }

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }

}

/*
To do:
- add plus and minus signs to battery
- add meters
- add a line with current labeled
 */
class CircuitDiagram extends Diagram {
    constructor() {
        super();
        this.cursor = origin;
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

    addResistor(endPoint1, endPoint2, labelAbove, labelBelow, width, numZigZags) {
        if (numZigZags === undefined) {
            numZigZags = 3;
        }
        let length = endPoint1.getDistanceToAnotherPoint(endPoint2);
        if (width === undefined) {
            width = length * 0.25;
        }
        let j;
        let startPoint = endPoint1, finishPoint;
        for (j = 0; j < numZigZags; j++) {
            finishPoint = endPoint1.interpolate(endPoint2, (j + 1) / numZigZags);
            this.addZigZag(startPoint, finishPoint, width);
            startPoint = finishPoint;
        }
        if (labelAbove !== undefined) {
            super.labelLineAbove(endPoint1, endPoint2, printResistance(labelAbove), width * 1.7, length * 0.35);
        }
        if (labelBelow !== undefined) {
            super.labelLineBelow(endPoint1, endPoint2, printResistance(labelBelow), width * 1.7, length * 0.35);
        }
    }

    ///I want to replace 'addListOfElements' with more of a cursor type program

    moveCursor(X, Y) {
        this.cursor = new Point(X, Y);
    }

    /// creates an element
    addElementWithCursor(elementType, endPointX, endPointY, labelAbove, labelBelow) {
        let nextPoint = new Point(endPointX, endPointY);
        if (elementType === 'wire') {
            this.addWire(this.cursor, nextPoint);
        } else if (elementType === 'resistor') {
            this.addResistor(this.cursor, nextPoint, labelAbove, labelBelow);
        } else if (elementType === 'battery') {
            this.addCell(this.cursor, nextPoint, labelAbove, labelBelow);
        }
        this.cursor = nextPoint;
        return true
    }

    labelElement(endPoint1, endPoint2, elementLength, elementWidth, labelAbove, labelBelow) {
        // could make it more DRY by adding a function here
    }

    addCell(endPoint1, endPoint2, labelAbove, labelBelow, numBatteries, width) {
        if (numBatteries === undefined) {numBatteries = 2;}
        if (width === undefined) {width = endPoint1.getDistanceToAnotherPoint(endPoint2) * 0.5;} /// should be proportioned by numbatteries

        let length = endPoint1.getDistanceToAnotherPoint(endPoint2);
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
        if (labelAbove !== undefined) {
            super.labelLineAbove(endPoint1, endPoint2, printVoltage(labelAbove), width * 1.5, length * 0.35);
        }
        if (labelBelow !== undefined) {
            super.labelLineBelow(endPoint1, endPoint2, printVoltage(labelBelow), width * 1.5, length * 0.35);
        }

        // add plus and minus signs

    }

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }
}

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
            "location": location
        }
    }

    /// i need to add some function so that the label does not get covered by the dot!

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        if (this.forces.length === 0) {
            this.maxForce = 1; // so that a diagram can still be created with zero forces
        }
        this.circleRadius = this.maxForce * 0.1;
        this.arrowheadLength = this.maxForce * 0.05;
        this.relativeFontSize = this.maxForce * 0.1;
        this.textDisplacement = this.relativeFontSize / 2;
        this.forces.forEach((force) => {
            super.addArrow(origin,force.endPoint,this.arrowheadLength,this.arrowheadAngle);
            super.labelLine(origin, force.endPoint, force.labelAbove, force.labelBelow, this.textDisplacement, this.relativeFontSize);
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
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }


}

class UnitMap extends Diagram {
    constructor() {
        super();
        this.pods = {};
        this.radius = 1;
        this.horizontalSpaceBetween = 1;
        this.verticalSpaceBetween = 1;
    }

    addPod(key, letter, level, horizontalPosition, prerequisites, score) {
        let x, y, newPod;
        if (score === undefined) {score = 0;}
        let fillColor = grayscale0to20(score);
        let textColor = "#000000"; // text is black if score is 10 or less and white if 10 or more
        if (score > 10) {textColor = "#FFFFFF";}
        newPod =
            {
                "letter": letter,
                "level": level,
                "horizontalPosition": horizontalPosition,
                "prerequisites": prerequisites,
                "fillColor": fillColor,
                "textColor": textColor
            };
        x = (horizontalPosition - 1) * (this.horizontalSpaceBetween + this.radius * 2);
        y = (level - 1) * (this.verticalSpaceBetween + this.radius * 2);
        newPod.center = new Point(x,y);

        this.pods[key] = newPod;

        let podCircle = super.addCircle(newPod.center,this.radius);
        let podText = super.addText(letter, newPod.center, this.radius * 1.3);
        podText.setColor(newPod.textColor);
        podCircle.setFillColor(newPod.fillColor);
        podCircle.fill();

        return this.pods[key];
    };

    // draws a segement between two existing pods
    connectTwoPods(podKey1, podKey2) {
        // add something that breaks it if podKeys can't be found?
        let theta = this.pods[podKey1].center.getAngleToAnotherPoint(this.pods[podKey2].center);
        let startPoint = this.pods[podKey1].center.getAnotherPointWithTrig(this.radius, theta);
        let endPoint = this.pods[podKey2].center.getAnotherPointWithTrig(this.radius, theta + Math.PI);
        let newSegment = super.addSegment(startPoint,endPoint);
        // if (this.pods[podKey1].level === this.pods[podKey2].level) { // add arrowhead for horizontal connection lines
        //     super.addArrowHeadBetweenPoints(startPoint, endPoint, this.horizontalSpaceBetween * 0.4, 30);
        // }
        super.addArrowHeadBetweenPoints(startPoint, endPoint, this.horizontalSpaceBetween * 0.4, 30); // add arrowhead on lines
        newSegment.setThickness(2);
    };


    // function to add segments between all pods and prerequisite pods
    connectPrerequisites() {
        Object.keys(this.pods).forEach((podKey) => {
            let thisPod = this.pods[podKey];
            thisPod.prerequisites.forEach((preReq) => {
                this.connectTwoPods(preReq, podKey);
            });
        });
    }

    getMaxLevel() {
        let currentMaxLevel = 0;
        Object.keys(this.pods).forEach((podKey) => {
            if (this.pods[podKey].level > currentMaxLevel) {currentMaxLevel = this.pods[podKey].level;}
        });
        return currentMaxLevel
    }

    getMaxHorizontalPosition() {
        let currentMaxHorizontalPosition = 0;
        Object.keys(this.pods).forEach((podKey) => {
            if (this.pods[podKey].level > currentMaxHorizontalPosition) {currentMaxHorizontalPosition = this.pods[podKey].level;}
        });
        return currentMaxHorizontalPosition
    }

    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        return super.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom)
    }
}
