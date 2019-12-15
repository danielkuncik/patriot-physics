// the goal here is to recreate the physics Diagram generation file
// but with classes more carefully defined


/*
I need to create a function which finds the natural aspect ratio of my diagram
which i could use to better fit it into spaces
 */


// returns a scale Factor, an Xtranslation factor, a yTranslationfactor
// this would cause the Point to fit into a box with width no greater than maxwidth and height no greater than max height
// and for all points to be positive (as though all in quadrant 1)



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

    // creates a new point by rotating the canvas, then translating
    // does not work if rotation is negative
    transformAndReproduce(rotation, xTranslation, yTranslation) {
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
    rotate(rotationAngleInRadians, centerRotationPoint) {
        if (centerRotationPoint === undefined) {centerRotationPoint = origin;}
        this.translate(-1 * centerRotationPoint.x, -1 * centerRotationPoint.y);
        let xPrime = this.x * Math.cos(rotationAngleInRadians) - this.y * Math.sin(rotationAngleInRadians);
        let yPrime = this.y * Math.cos(rotationAngleInRadians) + this.x * Math.sin(rotationAngleInRadians);
        this.x = xPrime;
        this.y = yPrime;
        this.translate(centerRotationPoint.x, centerRotationPoint.y);
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
}


// global variable origin
const origin = new Point(0,0);

function constructPointWithMagnitude(magnitude, angleInRadians) {
    let x = magnitude * Math.cos(angleInRadians);
    let y = magnitude * Math.sin(angleInRadians);
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
        this.dashed = false;
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


// the box should always belong to an object!
class Rectangle {
    constructor(lowerLeftX, lowerLeftY, width, height) {
        let bottomY = lowerLeftY;
        let topY = lowerLeftY + height;
        let rightX = lowerLeftX + width;
        let leftX = lowerLeftX;
        this.lowerLeftPoint = new Point(leftX, bottomY);
        this.upperLeftPoint = new Point(leftX, topY);
        this.lowerRightPoint = new Point(rightX, bottomY);
        this.upperRightPoint = new Point(rightX, topY);
        // console.log(this.lowerLeftPoint.x);
        // console.log(isNaN(this.lowerLeftPoint.x));
        // console.log(typeof(this.lowerLeftPoint.x));
        // console.log(this.lowerLeftPoint);
        this.centerPoint = new Point(leftX + width / 2, bottomY + height / 2);
        this.segments = [];
    }


    rotateCounterClockwiseAboutCenter(angleInRadians) {
        this.lowerLeftPoint.rotate(angleInRadians, this.centerPoint);
        this.upperLeftPoint.rotate(angleInRadians, this.centerPoint);
        this.lowerRightPoint.rotate(angleInRadians, this.centerPoint);
        this.upperRightPoint.rotate(angleInRadians, this.centerPoint);

    }

    translate(xTranslation, yTranslation) {
        this.centerPoint.translate(xTranslation, yTranslation);
        this.lowerLeftPoint.translate(xTranslation, yTranslation);
        this.upperLeftPoint.translate(xTranslation, yTranslation);
        this.upperRightPoint.translate(xTranslation, yTranslation);
        this.lowerRightPoint.translate(xTranslation, yTranslation);
    }

    rescaleVertically(yMultiplier) {
        // used to fit a function graph in
    }


}
// does this make a duplicate of the center Point??
function constructRectangleFromCenter(centerPoint, width, height) {
    let lowerLeftX = centerPoint.x - width/2;
    let lowerLeftY = centerPoint.y - height/2;
    var newRectangle = new Rectangle(lowerLeftX, lowerLeftY, width, height);
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
        if (this.rotationAngleInRadians) {
            this.rectangle.rotateCounterClockwiseAboutCenter(this.rotationAngleInRadians);
        }
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

    fillWhite() {
        this.setFillColor('#FFFFFF')
        this.fill();
    }

    unfill() {
        this.filled = false;
    }

    rescale(scaleFactor) {
        this.radius *= scaleFactor; // why is there a /2??? i don't know, but it is necessary for it to work
    }

}

class FunctionGraph {
    constructor(func, xMin, xMax, forcedYmin, forcedYmax) {
        this.function = func;
        this.xMin = xMin;
        this.xMax = xMax;
        // error if xMin is less than xMax
        let range = this.getRange();
        this.Yforced = false;
        if (forcedYmin !== undefined) {
            this.yMin = forcedYmin;
            this.Yforced = true;
        } else {
            this.yMin = range[0];
        }
        if (forcedYmax !== undefined) {
            this.yMax = forcedYmax;
            this.Yforced = true;
        } else {
            this.yMax = range[1];
        }
        this.rectangle = new Rectangle(this.xMin,this.yMin,(this.xMax - this.xMin), (this.yMax - this.yMin));
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
        this.defaultSize = 500;
    }

    setDefaultSize(newSize) {
        this.defaultSize = newSize;
    }

    // i added a line to prevent creating duplicates!
    // 8-25-19: Circle function was breaking because of the duplicates
    addNewPoint(x,y,name) {
        let pointAlreadyExists = this.searchForPoint(x,y);
        if (pointAlreadyExists) {
            return pointAlreadyExists
        } else {
            if (name === undefined) {
                name = numberToLetter(this.points.length);
            }
            let newPoint = new Point(x,y,name);
            this.points.push(newPoint);
            return newPoint
        }
    }

    addExistingPoint(existingPoint) {
        let pointAlreadySaved = this.searchForPoint(existingPoint.x,existingPoint.y);
        if (pointAlreadySaved) {
            return pointAlreadySaved
        } else {
            if (existingPoint.name === undefined) {
                existingPoint.setName(numberToLetter(this.points.length));
            }
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
    addTwoPointsAndSegment(x1, y1, x2, y2) {
        let pointA = this.addNewPoint(x1,y1);
        let pointB = this.addNewPoint(x2,y2);
        let newSegment = this.addSegment(pointA, pointB);
        return newSegment
    }

    // this is a different thing than the rectangle object defined above
    // i need to come up with a different name for that object
    addRectangleFromCenter(centerX, centerY, width, height) {
        let lowerLeftX = centerX - width / 2;
        let lowerLeftY = centerY - height / 2;

        return this.addRectangleFromLowerLeft(lowerLeftX, lowerLeftY, width, height);
    }

    addRectangleFromLowerLeft(lowerLeftX, lowerLeftY, width, height) {
        let lowerLeftPoint = this.addNewPoint(lowerLeftX, lowerLeftY);
        let lowerRightPoint = this.addNewPoint(lowerLeftX + width, lowerLeftY);
        let upperLeftPoint = this.addNewPoint(lowerLeftX, lowerLeftY + height);
        let upperRightPoint = this.addNewPoint(lowerLeftX + width, lowerLeftY + height);

        this.addSegment(lowerLeftPoint, lowerRightPoint);
        this.addSegment(lowerRightPoint, upperRightPoint);
        this.addSegment(upperRightPoint, upperLeftPoint);
        this.addSegment(upperLeftPoint, lowerLeftPoint);

        let rectangleObject = {
            "lowerLeftPoint": lowerLeftPoint,
            "lowerRightPoint": lowerRightPoint,
            "upperLeftPoint": upperLeftPoint,
            "upperRightPoint": upperRightPoint
        };

        return rectangleObject
    }

    /// add arrow
    // right now, it's pretty bad
    addArrow(point1, point2, arrowheadLength, arrowheadAngleInDegrees) {
        if (arrowheadAngleInDegrees === undefined) {arrowheadAngleInDegrees = 20;}

        let angleToHorizontal = point1.getAngleToAnotherPoint(point2);


        let L = point1.getDistanceToAnotherPoint(point2);
        if (arrowheadLength === undefined) {arrowheadLength = L * 0.1;}
        let arrowProportion = arrowheadLength / point1.getDistanceToAnotherPoint(point2);
        let arrowheadEnd1 = point2.interpolate(point1, arrowProportion);
        let arrowheadEnd2 = point2.interpolate(point1, arrowProportion);

        arrowheadEnd1.rotate(convertDegreesToRadians(arrowheadAngleInDegrees), point2);
        arrowheadEnd2.rotate(-1 * convertDegreesToRadians(arrowheadAngleInDegrees), point2);
     /* the old way
     let arrowheadEnd1 = new Point(L - arrowheadLength * Math.cos((phi)), arrowheadLength * Math.sin(phi)); // location of the arrowhead end if the arrow were a straight line on the x-axis
        let arrowheadEnd2 = new Point(L - arrowheadLength * Math.cos((phi)), -1 * arrowheadLength * Math.sin(phi)); // location of the arrowhead end if the arrow were a straight line on the x-axis

        arrowheadEnd1.rotate(angleToHorizontal);
        arrowheadEnd1.translate(point1.x, point1.y);
        arrowheadEnd2.rotate(angleToHorizontal);
        arrowheadEnd2.translate(point1.x, point1.y);
*/
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
    addArrowHeadBetweenPoints(point1, point2, arrowHeadLength, arrowheadAngleInDegrees) {
        let arrowHeadAngleInRadians = convertDegreesToRadians(arrowheadAngleInDegrees);
        let centerPointOfSegment = new Point((point1.x + point2.x)/2, (point1.y + point2.y)/2);

        // center it so the center, not the head, of the arrow is in the center of the segment
        // looks much more centered
        let totalDisplacement = arrowHeadLength / 2 * Math.cos(arrowHeadAngleInRadians);
        let segmentToHorizontalAngle = point1.getAngleToAnotherPoint(point2);
        let xDisplacement = totalDisplacement * Math.cos(segmentToHorizontalAngle);
        let yDisplacement = totalDisplacement * Math.sin(segmentToHorizontalAngle);
        let arrowHeadCenter = new Point(centerPointOfSegment.x + xDisplacement, centerPointOfSegment.y + yDisplacement);

        let theta = point1.getAngleToAnotherPoint(point2) + Math.PI;
        let end1 = arrowHeadCenter.getAnotherPointWithTrig(arrowHeadLength, theta + arrowHeadAngleInRadians);
        let end2 = arrowHeadCenter.getAnotherPointWithTrig(arrowHeadLength, theta - arrowHeadAngleInRadians);
        this.addSegment(arrowHeadCenter, end1);
        this.addSegment(arrowHeadCenter, end2);
    }

    addSegmentWithArrowheadInCenter(point1, point2, arrowheadLength, arrowheadAngleInDegrees) {
        if (arrowheadAngleInDegrees === undefined) {arrowheadAngleInDegrees = 30;}
        if (arrowheadLength === undefined) {arrowheadLength = point1.getDistanceToAnotherPoint(point2) * 0.15;}
        let newSegment = this.addSegment(point1, point2);
        this.addArrowHeadBetweenPoints(point1, point2, arrowheadLength, arrowheadAngleInDegrees);
        return newSegment
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

    // should i add some sort of a workaround, in case a linear function etc. is inputted
    /// that makes it graph more clearly?
    addFunctionGraph(func, xMin, xMax, forcedYmin, forcedYmax) {
        let thisFunctionGraph = new FunctionGraph(func, xMin, xMax, forcedYmin, forcedYmax);
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
    labelLine(point1, point2, textAbove, textBelow, textDisplacement, relativeFontSize, textPosition) {
        if (textPosition === undefined) {
            textPosition = 0.5;
        }
        let centerOfText = point1.interpolate(point2, textPosition);
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

        // as defined by https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate
        // rotation angle is CLOCKWISE in radians
        // there are probably more bugs here!
        if (quadrant === '1') {
            phi = Math.PI /2 - theta;
            textRotation = -1 * theta;
        } else if (quadrant === '2') {
            textRotation = Math.PI - theta; // continues to perplex me
            phi = Math.PI / 2 - textRotation;
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


        let aboveX = centerOfText.x, belowX = centerOfText.x;
        let aboveY = centerOfText.y, belowY = centerOfText.y;

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
        //         thisSegment = this.addTwoPointsAndSegment(point1.x + xDisplacementPerDash * n,point1.y + yDisplacementPerDash * n, point1.x + xDisplacementPerDash * (n + 1),point1.y + yDisplacementPerDash * (n + 1));
        //         thisSegment.setThickness(thickness);
        //     }
        //     //   isThisSegmentSolid = !isThisSegmentSolid;
        //     n++;
        // }

        let newLine = this.addSegment(point1, point2);
        newLine.turnIntoDashedLine();
        return newLine
    };

    addDottedLine(point1, point2) {
        let newLine = this.addSegment(point1, point2);
        newLine.turnIntoDottedLine();
        return newLine
    }

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
        if (maxWidth === undefined) {
            maxWidth = this.defaultSize;
        }
        if (maxHeight === undefined) {
            maxHeight = maxWidth;
        }
        if (wiggleRoom === undefined) {wiggleRoom = 20;}
        if (maxWidth > 0 && maxHeight === undefined) {
            maxHeight = maxWidth;
        }
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
            } else if (segment.dashed) {
                let length = segment.getLength();
                let Ndashes = 7;
                //let solidToSpaceRatio = 0.5;
                let Lsolid = length / Ndashes / 2;
                ctx.beginPath();
                ctx.setLineDash([Lsolid]);
                ctx.moveTo(wiggleRoom + segment.point1.x, canvasHeight - wiggleRoom - segment.point1.y);
                ctx.lineTo(wiggleRoom + segment.point2.x, canvasHeight - wiggleRoom - segment.point2.y);
                ctx.stroke();
            } else { /// normal (not dotted) lines
                ctx.beginPath();
                ctx.setLineDash([]);
                ctx.moveTo(wiggleRoom + segment.point1.x, canvasHeight - wiggleRoom - segment.point1.y);
                ctx.lineTo(wiggleRoom + segment.point2.x, canvasHeight - wiggleRoom - segment.point2.y);
                ctx.stroke();
            }
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
            let yMax, yMin;
            if (FunctionGraphObject.Yforced) {
                yMax = FunctionGraphObject.yMax;
                yMin = FunctionGraphObject.yMin;
                for (k = 1; k <= Nsteps; k++) {
                    thisXVal = FunctionGraphObject.xMin + xSteps * k;
                    thisYVal = FunctionGraphObject.function(thisXVal);
                    if (thisYVal > yMax || thisYVal < yMin) {
                        // pass
                    } else {
                        ctx.moveTo(wiggleRoom + (lastXVal - this.xMin) * scaleFactor, canvasHeight - wiggleRoom - (lastYval - this.yMin) * scaleFactor);
                        ctx.lineTo(wiggleRoom + (thisXVal - this.xMin) * scaleFactor, canvasHeight - wiggleRoom - (thisYVal - this.yMin) * scaleFactor);
                        ctx.stroke();
                    }

                    lastXVal = thisXVal;
                    lastYval = thisYVal;
                }
            } else {
                for (k = 1; k <= Nsteps; k++) {
                    thisXVal = FunctionGraphObject.xMin + xSteps * k;
                    thisYVal = FunctionGraphObject.function(thisXVal);

                    ctx.moveTo(wiggleRoom + (lastXVal - this.xMin) * scaleFactor, canvasHeight - wiggleRoom - (lastYval - this.yMin) * scaleFactor);
                    ctx.lineTo(wiggleRoom + (thisXVal - this.xMin) * scaleFactor, canvasHeight - wiggleRoom - (thisYVal - this.yMin) * scaleFactor);
                    ctx.stroke();

                    lastXVal = thisXVal;
                    lastYval = thisYVal;
                }
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

