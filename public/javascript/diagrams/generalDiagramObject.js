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


function getLengthOfLetters(letters) {
    let fontAspectRatio = 0.52; // aspect ratio of arial font according to https://www.lifewire.com/aspect-ratio-table-common-fonts-3467385
    return letters.length * fontAspectRatio
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



// the box should always belong to an object!
class RangeBox {
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
function constructRangeBoxFromCenter(centerPoint, width, height) {
    let lowerLeftX = centerPoint.x - width/2;
    let lowerLeftY = centerPoint.y - height/2;
    var newRangeBox = new RangeBox(lowerLeftX, lowerLeftY, width, height);
    return newRangeBox;
}

class Text {
    constructor(letters, centerPoint, relativeFontSize, rotationAngleInRadians) {
        this.letters = letters;
        this.relativeFontSize = relativeFontSize;
        if (rotationAngleInRadians === undefined) {this.rotationAngleInRadians = 0} else {this.rotationAngleInRadians = rotationAngleInRadians}

        //this.referencePoint = centerPoint;
        // reference Point will be different if the alignment is different!

        this.font = 'Arial';
        this.fontAspectRatio = 0.52; // aspect ratio of aria font according to https://www.lifewire.com/aspect-ratio-table-common-fonts-3467385
        this.fontAspectRatio = 0.7; /// but, that value from lifewire led to text being cut off! so i changed it!
        this.alignment = 'center'; // default
        this.baseline = 'middle';
        this.color = "#000000";
        this.centerPoint = centerPoint;
        this.referencePoint = this.centerPoint; // default, Text in center

        this.width = letters.length * this.relativeFontSize * this.fontAspectRatio;
        this.height = this.relativeFontSize / 2;
        this.rangeBox = constructRangeBoxFromCenter(centerPoint, this.width, this.height);
        if (this.rotationAngleInRadians) {
            this.rangeBox.rotateCounterClockwiseAboutCenter(this.rotationAngleInRadians);
        }
    }


    rescaleSingleFactor(scaleFactor) {
        this.relativeFontSize *= scaleFactor;
        // i won't change anything else because they are all tied to the Point array with the Diagram
    }

    rescaleDoubleFactor(xFactor, yFactor) {
        if (xFactor <= yFactor) {
            this.relativeFontSize *= xFactor;
        } else {
            this.relativeFontSize *= yFactor;
        }
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
        this.makeSolid();

        this.rangeBox = new RangeBox(this.xMin,this.yMin,(this.xMax - this.xMin), (this.yMax - this.yMin));
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

    makeDashed(numDashes) {
        this.dashed = true;
        this.dashLength = this.getDashLength(numDashes);
    }

    makeSolid() {
        this.dashed = false;
        this.dashLength = undefined;
    }

    getArcLength() {
        const Nsteps = 1000;
        let i;
        const range = this.xMax - this.xMin;
        let arcLength = 0, x1, y1, x2,y2;
        for (i = 0; i < Nsteps; i++) {
            x1 = this.function(this.xMin + i / Nsteps * range);
            x2 = x1 + 1 / Nsteps;
            y1 = this.function(x1);
            y2 = this.function(x2);
            arcLength += Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
        }
        return arcLength;
    }

    getDashLength(numDashes) {
        const arcLength = this.getArcLength();
        const numDashesAndSpaces = numDashes + (numDashes - 1); // always begin and end on a dash
        return arcLength / numDashesAndSpaces;
    }
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

        this.lockedRange = undefined;
    }

    lockRange(xMin, xMax, yMin, yMax) {
        this.lockedRange = {
            xMin: xMin,
            xMax: xMax,
            yMin: yMin,
            yMax: yMax
        };
    }

    lockRangeToAnotherDiagram(anotherDiagram) {
        anotherDiagram.getRange();
        this.lockRange(anotherDiagram.xMin, anotherDiagram.xMax, anotherDiagram.yMin, anotherDiagram.yMax);
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

    // adds a segment object that already exists, independent of this particular diagram object
    addExistingSegment(segmentObject) {
        console.log(segmentObject);
        let pointA = this.addExistingPoint(segmentObject.point1);
        let pointB = this.addExistingPoint(segmentObject.point2);
        this.segments.push(segmentObject);
        return segmentObject
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
    addRangeBoxFromCenter(centerX, centerY, width, height) {
        let lowerLeftX = centerX - width / 2;
        let lowerLeftY = centerY - height / 2;

        return this.addRangeBoxFromLowerLeft(lowerLeftX, lowerLeftY, width, height);
    }

    addRangeBoxFromLowerLeft(lowerLeftX, lowerLeftY, width, height) {
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

    addTwoHeadedArrow(point1, point2, arrowheadLength, arrowheadAngleInDegrees) {

      let centerPoint = point1.interpolate(point2, 0.5);

      this.addArrow(centerPoint, point1, arrowheadLength, arrowheadAngleInDegrees);
      this.addArrow(centerPoint, point2, arrowheadLength, arrowheadAngleInDegrees);
    }

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
        this.addExistingPoint(thisCircle.rangeBox.lowerLeftPoint);
        this.addExistingPoint(thisCircle.rangeBox.upperLeftPoint);
        this.addExistingPoint(thisCircle.rangeBox.lowerRightPoint);
        this.addExistingPoint(thisCircle.rangeBox.upperRightPoint);
        this.circles.push(thisCircle);
        return thisCircle;
    }
    /// if the Point already exists, eg. because it is the end of a line,
    /// then this functino does not work properly!

    addBlackCircle(centerPoint, radius) {
        let circle = this.addCircle(centerPoint, radius);
        circle.setFillColor('#000000');
        circle.fill();
        return circle
    }

    // should i add some sort of a workaround, in case a linear function etc. is inputted
    /// that makes it graph more clearly?
    addFunctionGraph(func, xMin, xMax, forcedYmin, forcedYmax) {
        let thisFunctionGraph = new FunctionGraph(func, xMin, xMax, forcedYmin, forcedYmax);
        this.addExistingPoint(thisFunctionGraph.rangeBox.lowerLeftPoint);
        this.addExistingPoint(thisFunctionGraph.rangeBox.upperLeftPoint);
        this.addExistingPoint(thisFunctionGraph.rangeBox.lowerRightPoint);
        this.addExistingPoint(thisFunctionGraph.rangeBox.upperRightPoint);
        this.functionGraphs.push(thisFunctionGraph);
        return thisFunctionGraph;
    }


    /// center Point need not already exist
    addText(letters, centerPoint, relativeFontSize, rotation) {
        let center = this.addExistingPoint(centerPoint);
        let newText = new Text(letters, center, relativeFontSize, rotation);
        this.addExistingPoint(newText.rangeBox.lowerLeftPoint);
        this.addExistingPoint(newText.rangeBox.upperLeftPoint);
        this.addExistingPoint(newText.rangeBox.lowerRightPoint);
        this.addExistingPoint(newText.rangeBox.upperRightPoint);
        // this.addExistingPoint(newText.RangeBox.centerPoint); /// shoudl center Point already exist though???
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
            phi = Math.PI / 2 - textRotation;
            //phi = 2* Math.PI - theta;
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

    // you are not allowed to rotate lines
    addLinesOfText(lettersArray, centerLeftPoint, relativeFontSize, spacing, textAlign) {
        if (spacing === undefined) {
            spacing  = 1.4;
        }
        if (textAlign === undefined) {
            textAlign = 'left';
        }
        let lineWidth = relativeFontSize * spacing;
        let leftX = centerLeftPoint.x;
        let boxHeight = relativeFontSize * lettersArray.length + (spacing - 1) * relativeFontSize * (lettersArray.length - 1);
        let topY = centerLeftPoint.y + boxHeight / 2;
        let q, thisY, nextText;
        for (q = 0; q < lettersArray.length; q++) {
            thisY = topY - lineWidth * q;
            nextText = this.addText(lettersArray[q],new Point(leftX, thisY),relativeFontSize);
            nextText.setAlignmentAndBaseline(textAlign,'top');
            console.log(nextText);
        }
    }

    /// WORKS ONLY FOR 45 degree angles!!!! 3-19-2020 10:31 am
    /// i'm taking a break and coming back to this shit
    addLinesNextToSegment(point1, point2, lettersArray, location, extraDisplacement, relativeFontSize, spacing) {
        if (location === undefined) {
            location = 'right';
        }
        // left is a pretty bad idea, but right, above, below should all work
        if (extraDisplacement === undefined) {
            extraDisplacement = 0;
        }
        if (spacing === undefined) {
            spacing  = 1.4;
        }
        if (relativeFontSize === undefined) {
            relativeFontSize = point1.getDistanceToAnotherPoint(point2) / 3 / lettersArray.length;
        }
        let boxHeight = relativeFontSize * lettersArray.length + (spacing - 1) * relativeFontSize * (lettersArray.length - 1);
        let theta = point1.getAngleToAnotherPoint(point2);
        let quad = point1.getQuadrantOfAnotherPoint(point2);
        //let horizontalDisplacement_1 = (boxHeight / 2) / (Math.atan(theta));

        let maxLetters = 0;
        lettersArray.forEach((text) => {
            if (text.length > maxLetters) {
                maxLetters = text.length;
            }
        });
        let boxWidth = maxLetters * relativeFontSize * 0.7; // 0.7 is my guess of aspect ratio

        let horizontalDisplacement = 0;
        let verticalDisplacement = 0;
        let textAlign = 'left';

        ///// THIS PART ISN'T DONE!!!!
        /// but i want to make some programs while creating this
        // placement => not totally completed!
        if (location === 'right') {
            if (quad === '1' || quad === '3') {
                horizontalDisplacement += (boxHeight / 2) / Math.tan(theta) + extraDisplacement;
            } else if (quad === '2' || quad === '4') {
                horizontalDisplacement += -1 * (boxHeight / 2) / Math.tan(theta) + extraDisplacement;
            } else if (quad === '+Y' || quad === '-Y') {
                // do nothing
            } else if (quad === '+X' || quad === '-X') {
                console.log('ERROR: Cannot place text to the right of horizontal line');
            }
        } else if (location === 'below') { // these vertical positions are screwing with me
            if (quad === '1') {
                verticalDisplacement -= boxHeight / 2;
            } else if (quad === '2') {
                horizontalDisplacement -= boxWidth;
                verticalDisplacement -= boxHeight / 2;
            } else if (quad === '+X' || quad === '-X') {
                verticalDisplacement -= boxHeight / 2;
                textAlign = 'center';
            }
        }

        let centerLeftPoint = point1.interpolate(point2, 0.5);
        centerLeftPoint.translate(horizontalDisplacement,verticalDisplacement);

        this.addLinesOfText(lettersArray, centerLeftPoint, relativeFontSize, spacing, textAlign);
    };

    addDashedLine(point1, point2, numDashes, thickness) {
        let newLine = this.addSegment(point1, point2);
        newLine.turnIntoDashedLine();
        return newLine
    };

    addDottedLine(point1, point2) {
        let newLine = this.addSegment(point1, point2);
        newLine.turnIntoDottedLine();
        return newLine
    };

    // adds a hash mark,
    // at a point between endpoint1 and endpoint 2, indicated by proportion
    addHashMark(endPoint1, endPoint2, proportion, hashLength, labelAbove, labelBelow, labelFontSize, labelRotationBoolean) {
      if (hashLength === undefined) {
        hashLength = endPoint1.getDistanceToAnotherPoint(endPoint2) * 0.1;
      }
      if (labelFontSize === undefined) {
        labelFontSize = hashLength * 0.75;
      }
      let centerPoint = endPoint1.interpolate(endPoint2, proportion);
      let theta = endPoint1.getAngleToAnotherPoint(endPoint2);
      let bottomEnd = centerPoint.getAnotherPointWithTrig(hashLength / 2, theta + 3 * Math.PI / 2);
      let topEnd = centerPoint.getAnotherPointWithTrig(hashLength / 2, theta + Math.PI / 2);
      this.addSegment(bottomEnd, topEnd);

      let labelDisplacement = labelFontSize * 0.5;
      let topLabelPosition = centerPoint.getAnotherPointWithTrig(hashLength / 2 + labelDisplacement, theta + Math.PI / 2);
      let bottomLabelPosition = centerPoint.getAnotherPointWithTrig(hashLength / 2 + labelDisplacement, theta + 3 * Math.PI / 2);

//     addText(letters, centerPoint, relativeFontSize, rotation) {



      if (labelAbove) {
        if (labelRotationBoolean) {
          this.addText(labelAbove, topLabelPosition, labelFontSize, theta + 3 * Math.PI / 2);
        } else {
          this.addText(labelAbove, topLabelPosition, labelFontSize);
        }
      }
      if (labelBelow) {
        if (labelRotationBoolean) {
          this.addText(labelBelow, bottomLabelPosition, labelFontSize, theta + 3 * Math.PI / 2);
        } else {
          this.addText(labelBelow, bottomLabelPosition, labelFontSize);
        }
      }

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

    rescaleSingleFactor(scaleFactor) {
        this.points.forEach((point) => {point.rescaleSingleFactor(scaleFactor)});
        this.texts.forEach((text) => {text.rescaleSingleFactor(scaleFactor)});
        this.circles.forEach((circle) => {circle.rescaleSingleFactor(scaleFactor)});
    }

    rescaleDoubleFactor(xFactor, yFactor) {
        this.points.forEach((point) => {point.rescaleDoubleFactor(xFactor, yFactor)});
        this.texts.forEach((text) => {text.rescaleDoubleFactor(xFactor, yFactor)});
        this.circles.forEach((circle) => {circle.rescaleDoubleFactor(xFactor, yFactor)});

    }

    reflectAboutXAxis() {
        this.points.forEach((point) => {point.reflectAboutXAxis();})
    }

    getRange() {
        let xMin, xMax, yMin, yMax;

        if (this.lockedRange) {
            xMin = this.lockedRange.xMin;
            xMax = this.lockedRange.xMax;
            yMin = this.lockedRange.yMin;
            yMax = this.lockedRange.yMax;
        } else {

            xMin = this.points[0].x;
            xMax = xMin;
            yMin = this.points[0].y;
            yMax = yMin;

            this.points.forEach((point) => {
                if (point.x > xMax) {
                    xMax = point.x;
                }
                if (point.x < xMin) {
                    xMin = point.x;
                }
                if (point.y > yMax) {
                    yMax = point.y;
                }
                if (point.y < yMin) {
                    yMin = point.y;
                }
            });
        }

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
    drawCanvas(maxWidth, maxHeight, forceSize, unit, wiggleRoom) {
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


        // transform to prepare for canvas;
        this.translate(-1 * this.xMin, -1 * this.yMin);


        let scaleFactor, xScaleFactor, yScaleFactor, canvasWidth, canvasHeight;
        if (!forceSize) {
            scaleFactor = nondistortedResize(this.horizontalRange, this.verticalRange, maxWidth - wiggleRoom * 2, maxHeight - wiggleRoom * 2);
            this.rescaleSingleFactor(scaleFactor);
            canvasWidth = this.horizontalRange * scaleFactor + wiggleRoom * 2;
            canvasHeight = this.verticalRange * scaleFactor + wiggleRoom * 2;
            xScaleFactor = scaleFactor;
            yScaleFactor = scaleFactor;
        } else {
            xScaleFactor = (maxWidth - wiggleRoom * 2) / (this.horizontalRange);
            yScaleFactor = (maxHeight - wiggleRoom * 2) / (this.verticalRange);
            this.rescaleDoubleFactor(xScaleFactor, yScaleFactor);
            canvasWidth = maxWidth;
            canvasHeight = maxHeight;
        }




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

        ctx.setLineDash([]);

        this.functionGraphs.forEach((FunctionGraphObject) => { /// in desperate need of some refartoring, to make it easier to comprehend what's going on
            // too many different options in their own method and too much repeated code
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
                        ctx.moveTo(wiggleRoom + (lastXVal - this.xMin) * xScaleFactor, canvasHeight - wiggleRoom - (lastYval - this.yMin) * yScaleFactor);
                        ctx.lineTo(wiggleRoom + (thisXVal - this.xMin) * xScaleFactor, canvasHeight - wiggleRoom - (thisYVal - this.yMin) * yScaleFactor);
                        ctx.stroke();
                    }

                    lastXVal = thisXVal;
                    lastYval = thisYVal;
                }
            } else if (FunctionGraphObject.dashed) {
                let dashOn = true;
                let dashLength = FunctionGraphObject.dashLength;
                let sinceLastDashStart = 0;

                let x1,x2,y1,y2;

                for (k = 0; k < Nsteps; k++) { // a slightly different method here
                    x1 = FunctionGraphObject.xMin + xSteps * k;
                    x2 = x1 + xSteps;
                    y1 = FunctionGraphObject.function(x1);
                    y2 = FunctionGraphObject.function(x2);

                    sinceLastDashStart += Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
                    if (sinceLastDashStart > dashLength) {
                        dashOn = !dashOn;
                        sinceLastDashStart = 0;
                    }
                    if (dashOn) {
                        ctx.moveTo(wiggleRoom + (x1 - this.xMin) * xScaleFactor, canvasHeight - wiggleRoom - (y1 - this.yMin) * yScaleFactor);
                        ctx.lineTo(wiggleRoom + (x2 - this.xMin) * xScaleFactor, canvasHeight - wiggleRoom - (y2 - this.yMin) * yScaleFactor);
                        ctx.stroke();
                    }
                }

                /// so, i cannot have a yForced value on a dashed object!

            } else {
                for (k = 1; k <= Nsteps; k++) {
                    thisXVal = FunctionGraphObject.xMin + xSteps * k;
                    thisYVal = FunctionGraphObject.function(thisXVal);

                    ctx.moveTo(wiggleRoom + (lastXVal - this.xMin) * xScaleFactor, canvasHeight - wiggleRoom - (lastYval - this.yMin) * yScaleFactor);
                    ctx.lineTo(wiggleRoom + (thisXVal - this.xMin) * xScaleFactor, canvasHeight - wiggleRoom - (thisYVal - this.yMin) * yScaleFactor);
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
        if (!forceSize) {
            this.rescaleSingleFactor(1 / scaleFactor);
        } else {
            this.rescaleDoubleFactor(1 / xScaleFactor, 1 / yScaleFactor);
        }
        this.translate(this.xMin, this.yMin);

        return c
    }

}