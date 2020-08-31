/// I think this is all messed up, fix it!
// do i need to clarify this is inside/outside?
// given a line at a certain angle, determines the optimal location of text
function getOptimalLocationOfText(point1, point2, turningOrientation = 'clockwise') {
    const quadrant = point1.getQuadrantOfAnotherPoint(point2);
    let bestSpot;

    // optimal locations for clockwise orientation
    switch(point1.getQuadrantOfAnotherPoint(point2)) {
        case '1':
            bestSpot = 'left';
            break;
        case '2':
            bestSpot = 'left';
            break;
        case '3':
            bestSpot = 'right';
            break;
        case '4':
            bestSpot = 'right';
            break;
        case '+X':
            bestSpot = 'above';
            break;
        case '-X':
            bestSpot = 'below';
            break;
        case '+Y':
            bestSpot = 'left';
            break;
        case '-Y':
            bestSpot = 'right';
            break;
        default:
            bestSpot = undefined;
    }

    // make clockwise the default
    //// FIX FIX FIX FIX FIX
    /// make clockwise default and fix this

    // optimal spots for counter-clockwise orientation
    // if (angleInRadians >= 0 && angleInRadians < Math.PI / 4) {
    //     bestSpot = 'below';
    // } else if (angleInRadians >= Math.PI / 4 && angleInRadians <= 3 * Math.PI / 4) {
    //     bestSpot = 'left';
    // } else if (angleInRadians > 3 * Math.PI / 4 && angleInRadians < 5 * Math.PI / 4) {
    //     bestSpot = 'above';
    // } else if (angleInRadians >= 5 * Math.PI / 4 && angleInRadians <= 7 * Math.PI / 4) {
    //     bestSpot = 'right';
    // } else if (angleInRadians > 7 * Math.PI / 4 && angleInRadians <= Math.PI * 2 ) {
    //     bestSpot =  'below';
    // } else {
    //     bestSpot = undefined;
    // }
    if (turningOrientation === 'counterclockwise') { // rather than clockwise
        if (bestSpot === 'right') {
            bestSpot = 'left';
        } else if (bestSpot === 'left') {
            bestSpot = 'right';
        } else if (bestSpot === 'above') {
            bestSpot = 'below';
        } else if (bestSpot === 'below') {
            bestSpot = 'above';
        }
    }

    return bestSpot
}

class TextF {
    constructor(letters, referencePoint, relativeFontSize, rotationAngleInRadians, positioning) {
        if (positioning === undefined) {
            positioning = 'center'
        }
        if (typeof(letters) !== 'string') {
            letters = String(letters);
        }
        this.letters = letters;
        this.relativeFontSize = relativeFontSize;
        if (rotationAngleInRadians === undefined) {this.rotationAngleInRadians = 0} else {this.rotationAngleInRadians = rotationAngleInRadians}

        this.width = getLengthOfLetters(letters, this.relativeFontSize);
        this.height = this.relativeFontSize;


        this.font = 'Arial';
        this.referencePoint = referencePoint;
        // NT ALL OF THESE RANGE BOT functions work!
        if (positioning === 'center') {
            this.alignment = 'center'; // default
            this.baseline = 'middle';
            this.centerPoint = referencePoint;
            this.rangeBox = constructRangeBoxFromCenterF(this.centerPoint, this.width, this.height);
        } else if (positioning === 'lowerLeft') {
            this.alignment = 'left';
            this.baseline = 'alphabetic';
            this.rangeBox = new RangeBoxF(this.referencePoint.x, this.referencePoint.y, this.width, this.height); // construc from lower left corner is default
        } else if (positioning === 'aboveCenter') {
            this.alignment = 'center';
            this.baseline = 'alphabetic';
            let lowerLeftX = this.referencePoint.x - this.width/2;
            let lowerLeftY = this.referencePoint.y;
            this.rangeBox = new RangeBoxF(lowerLeftX, lowerLeftY, this.width, this.height);
        }  else if (positioning === 'belowCenter') {
            this.alignment = 'center';
            this.baseline = 'hanging';
            let lowerLeftX = this.referencePoint.x - this.width/2;
            let lowerLeftY = this.referencePoint.y - this.height;
            this.rangeBox = new RangeBoxF(lowerLeftX, lowerLeftY, this.width, this.height);
        } else if (positioning === 'upperLeft') {
            this.alignment = 'left';
            this.baseline = 'hanging';
            let lowerLeftX = this.referencePoint.x;
            let lowerLeftY = this.referencePoint.y - this.height;
            this.rangeBox = new RangeBoxF(lowerLeftX, lowerLeftY, this.width, this.height);
        } else if (positioning === 'lowerRight') {
            this.alignment = 'right';
            this.baseline = 'alphabetic';
            let lowerLeftX = this.referencePoint.x - this.width;
            let lowerLeftY = this.referencePoint.y;
            this.rangeBox = new RangeBoxF(lowerLeftX, lowerLeftY, this.width, this.height);
        } else if (positioning === 'upperRight') {
            this.alignment = 'right';
            this.baseline = 'hanging';
            let lowerLeftX = this.referencePoint.x - this.width;
            let lowerLeftY = this.referencePoint.y - this.height;
            this.rangeBox = new RangeBoxF(lowerLeftX, lowerLeftY, this.width, this.height);
        } else if (positioning === 'centerRight') {
            this.alignment = 'right';
            this.baseline = 'middle';
            let lowerLeftX = this.referencePoint.x - this.width;
            let lowerLeftY = this.referencePoint.y - this.height / 2;
            this.rangeBox = new RangeBoxF(lowerLeftX, lowerLeftY, this.width, this.height);
        } else if (positioning === 'centerLeft') {
            this.alignment = 'left';
            this.baseline = 'middle';
            let lowerLeftX = this.referencePoint.x;
            let lowerLeftY = this.referencePoint.y - this.height;
            this.rangeBox = new RangeBoxF(lowerLeftX, lowerLeftY, this.width, this.height);
        }

        if (this.rotationAngleInRadians) { // should it be clockwise, not counterclockwise?
            this.rangeBox.rotateClockwiseAboutCenter(this.rotationAngleInRadians);
            /// if the reference point is not the center, then this function needs to change!
            ///ERROR
            ///ERROR
            ///ERROR
            ///ERROR
            ///ERROR
            ///ERROR
            ///ERROR
        }
        this.color = "#000000";

    }


    rescaleSingleFactor(scaleFactor) {
        this.relativeFontSize *= scaleFactor;
        // i won't change anything else because they are all tied to the Point array with the Diagram
    }

    rescaleDoubleFactor(xFactor, yFactor) {
        if (xFactor >= yFactor) {
            this.relativeFontSize *= xFactor;
        } else {
            this.relativeFontSize *= yFactor;
        }
    }

    extendRangeBox(horizontalExtension, verticalExtension) {
        this.rangeBox.extend(horizontalExtension, verticalExtension);
    }

    stretchRangeBox(horizontalMultiplier, verticalMultiplier) {
        this.rangeBox.stretch(horizontalMultiplier, verticalMultiplier);
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
    /// YES!!! this does not take into account how the rangeBox must change
    /// when the text alignment is changed
    setAlignmentAndBaseline(newAlignment, newBaseline) {
        this.alignment = newAlignment;
        this.baseline = newBaseline;
    }
    //
    // centerText() {
    //     this.referencePoint = this.rangeBox.centerPoint;
    //     this.alignment = 'center';
    //     this.baseline = 'middle';
    // }
    //
    // alignLowerLeftCorner() {
    //     this.referencePoint = this.rangeBox.lowerLeftPoint;
    //     this.alignment = 'left';
    //     this.baseline = 'bottom';
    // }


    rotateCounterClockwise(rotationInRadians) {
        this.rotationAngleInRadians += rotationInRadians;
        this.rangeBox.rotateCounterClockwiseAboutCenter(rotationInRadians);
    }

    setNewRotationAngle(newRotationAngleInRadians) {
        this.rangeBox.rotateCounterClockwiseAboutCenter(-1 * this.rotationAngleInRadians);
        this.rotationAngleInRadians = newRotationAngleInRadians;
        this.rangeBox.rotateCounterClockwiseAboutCenter(this.rotationAngleInRadians);
    }

    addDegreeLabel(diagramObject) {
        let circleRadius = this.relativeFontSize * 0.1;

        // position the little circle
        let point1 = this.rangeBox.upperRightPoint;
        let point2 = this.rangeBox.lowerRightPoint;
        let d = point1.getDistanceToAnotherPoint(point2);
        let theta = point1.getAngleToAnotherPoint(point2);
        let circleCenter = point1.transformAndReproduce(theta, circleRadius * 1.3, circleRadius * 1.3);
        // this.addCircle(circleCenter, circleRadius);
        // the circle is all coded, but it will look terrible until I fix my aspect ratio of text issue

    }

    drawBoxAround(DiagramObject, horizontalExtension, verticalExtension) {
        this.rangeBox.addSegmentsToDiagram(DiagramObject, horizontalExtension, verticalExtension);
    }

}
