/// I think this is all messed up, fix it!
// do i need to clarify this is inside/outside?
// given a line at a certain angle, determines the optimal location of text

class Text {
    constructor(letters, referencePoint, relativeFontSizeFloat, positioning = 'center', rotationAngle) {
        if (positioning === undefined) {
            positioning = 'center'
        }
        if (typeof(letters) !== 'string') {
            letters = String(letters);
        }
        this.letters = letters;
        this.relativeFontSize = relativeFontSizeFloat;

        this.width = constructMagnitudeFromFloat(getLengthOfLetters(letters, this.relativeFontSize), undefined, undefined, true);
        this.height = constructMagnitudeFromFloat(this.relativeFontSize, undefined, undefined, true);

        this.solidBorder = false;

        this.rotationAngle = rotationAngle;


        this.font = 'Arial';
        this.referencePoint = referencePoint;
        console.log(this.referencePoint.print());
        // NT ALL OF THESE RANGE BOT functions work!
        if (positioning === 'center') {
            this.alignment = 'center'; // default
            this.baseline = 'middle';
            this.centerPoint = referencePoint;
            this.rangeBox = constructRangeBoxFromCenter(this.centerPoint, this.width, this.height);
        } else if (positioning === 'lowerLeft') {
            this.alignment = 'left';
            this.baseline = 'alphabetic';
            let lowerLeftPoint = referencePoint;
            this.rangeBox = new RangeBox(referencePoint, this.width, this.height); // construc from lower left corner is default
        } else if (positioning === 'aboveCenter') {
            this.alignment = 'center';
            this.baseline = 'alphabetic';
            let lowerLeftPoint = this.referencePoint.translateAndReproduce((this.width.divideMagExactConstant(2)).reverseSign(), constructZeroMagnitude())
            this.rangeBox = new RangeBox(lowerLeftPoint, this.width, this.height);
        }  else if (positioning === 'belowCenter') {
            this.alignment = 'center';
            this.baseline = 'hanging';
            let lowerLeftPoint = this.referencePoint.translateAndReproduce((this.width.divideMagExactConstant(2)).reverseSign(), this.height.reverseSign())
            this.rangeBox = new RangeBox(lowerLeftPoint, this.width, this.height);
        } else if (positioning === 'upperLeft') {
            this.alignment = 'left';
            this.baseline = 'hanging';
            let lowerLeftPoint = this.referencePoint(constructZeroMagnitude(), this.height.reverseSign());
            this.rangeBox = new RangeBox(lowerLeftPoint, this.width, this.height);
        } else if (positioning === 'lowerRight') {
            this.alignment = 'right';
            this.baseline = 'alphabetic';
            let lowerLeftPoint = this.referencePoint(this.width.reverseSign(), constructZeroMagnitude());
            this.rangeBox = new RangeBox(lowerLeftPoint, this.width, this.height);
        } else if (positioning === 'upperRight') {
            this.alignment = 'right';
            this.baseline = 'hanging';
            let lowerLeftPoint = this.referencePoint(this.width.reverseSign(), this.height.reverseSign());
            this.rangeBox = new RangeBox(lowerLeftPoint, this.width, this.height);
        } else if (positioning === 'centerRight') {
            this.alignment = 'right';
            this.baseline = 'middle';
            let lowerLeftPoint = this.referencePoint(this.width.reverseSign(), (this.height.divideMagExactConstant(2)).reverseSign());
            this.rangeBox = new RangeBox(lowerLeftPoint, this.width, this.height);
        } else if (positioning === 'centerLeft') {
            this.alignment = 'left';
            this.baseline = 'middle';
            let lowerLeftPoint = this.referencePoint(constructZeroMagnitude(), this.height.reverseSign());
            this.rangeBox = new RangeBox(lowerLeftPoint, this.width, this.height);
        }

        this.centerPoint = this.rangeBox.centerPoint;
        console.log(this.centerPoint);

        // its a disaster all around


        if (this.rotationAngle) { // should it be clockwise, not counterclockwise?
            this.rangeBox.rotateCounterClockwiseAboutCenter(this.rotationAngle);
            /// if the reference point is not the center, then this function needs to change!
            ///ERROR
            ///ERROR
            ///ERROR this is fixed i think?
            ///ERROR
            ///ERROR
            ///ERROR
            ///ERROR
        }
        this.color = "#000000";

    }

    drawBorder() {
      this.solidBorder = true;
    }
    eraseBorder() {
      this.solidBorder = false
    }


    rescaleSingleFactor(scaleFactor) {
        this.relativeFontSize *= (scaleFactor);
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

    // addDegreeLabel(diagramObject) {
    //     let circleRadius = this.relativeFontSize * 0.1;
    //
    //     // position the little circle
    //     let point1 = this.rangeBox.upperRightPoint;
    //     let point2 = this.rangeBox.lowerRightPoint;
    //     let d = point1.getDistanceToAnotherPoint(point2);
    //     let theta = point1.getAngleToAnotherPoint(point2);
    //     let circleCenter = point1.transformAndReproduce(theta, circleRadius * 1.3, circleRadius * 1.3);
    //     // this.addCircle(circleCenter, circleRadius);
    //     // the circle is all coded, but it will look terrible until I fix my aspect ratio of text issue
    //
    // }

    // drawBoxAround(DiagramObject, horizontalExtension, verticalExtension) {
    //     this.boxAround = true;
    // }

}


function linesOfText() {
  //// lines of text
}

function linesOfTextNextToSegment() {
  // lines of text next to segment
}
