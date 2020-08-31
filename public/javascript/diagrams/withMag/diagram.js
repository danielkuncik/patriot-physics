// returns a scale Factor, an Xtranslation factor, a yTranslationfactor
// this would cause the Point to fit into a box with width no greater than maxwidth and height no greater than max height
// and for all points to be positive (as though all in quadrant 1)


function nondistortedResize(originalWidth, originalHeight, maxWidth, maxHeight) {
    let scale = 1;
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

class Diagram {
    constructor() {
        this.diagram = true;
        this.points = [];
        this.segments = [];
        this.circles = [];
        this.arcs = [];
        this.texts = [];
        this.functionGraphs = [];
        this.defaultSize = 500;

        this.key = [];
        this.keyFont = undefined;

        this.lockedRange = {};
    }

    addLineToKey(text, color) {
        this.key.push({
            text: text,
            color: color
        });
    }


    setKeyFont(keyFont) {
        this.keyFont = keyFont;
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

    // // i added a line to prevent creating duplicates!
    // // 8-25-19: Circle function was breaking because of the duplicates
    // addNewPoint(x,y,name) {
    //     if (x === 0 && y === 0) {
    //         x = Math.random() * 1e-10;
    //         y = Math.random() * 1e-10;
    //     }
    //     let pointAlreadyExists = this.searchForPoint(x,y);
    //     if (pointAlreadyExists) {
    //         return pointAlreadyExists
    //     } else {
    //         if (name === undefined) {
    //             name = numberToLetter(this.points.length);
    //         }
    //         let newPoint = new PointF(x,y,name);
    //         this.points.push(newPoint);
    //         return newPoint
    //     }
    // }

    addPoint(pointObject) {
        let pointAlreadySaved = this.searchForPoint(pointObject.x,pointObject.y);
        if (pointAlreadySaved) {
            // allow renaming of points
            if (pointAlreadySaved.name !== pointObject.name) {
                pointAlreadySaved.setName(pointObject.name);
            }
            return pointAlreadySaved
        } else {
            if (pointObject.name === undefined) {
                pointObject.setName(numberToLetter(this.points.length));
            }
            this.points.push(pointObject);
            return pointObject
        }

    }

    // won't work if you truly have values less than 1e-10
    searchForPoint(x,y) {
        let existingPoint = false;
        this.points.forEach((point) => {
            if (point.x.isEqualTo(x) && point.y.isEqualTo(y)) {
                existingPoint = point
            }
        });
        return existingPoint
    }


    // /// points must already be in the array of points before adding the Segment!
    // addSegment(point1, point2) {
    //     let pointA = this.addExistingPoint(point1);
    //     let pointB = this.addExistingPoint(point2);
    //     let newSegment = new SegmentF(pointA, pointB);
    //     this.segments.push(newSegment);
    //     return newSegment
    // }

    // adds a segment object that already exists, independent of this particular diagram object
    addSegment(segmentObject) {
        let pointA = this.addPoint(segmentObject.point1);
        let pointB = this.addPoint(segmentObject.point2);
        this.segments.push(segmentObject); // will this create a pointer like i want?
        return segmentObject
    }

    // // shortcut, makes it easier to add a Segment witout creating each Point first
    // addTwoPointsAndSegment(x1, y1, x2, y2) {
    //     let pointA = this.addNewPoint(x1,y1);
    //     let pointB = this.addNewPoint(x2,y2);
    //     let newSegment = this.addSegment(pointA, pointB);
    //     return newSegment
    // }

    addRangeBox(rangeBoxObject) {
        this.addPoint(rangeBoxObject.lowerLeftPoint);
        this.addPoint(rangeBoxObject.lowerRightPoint);
        this.addPoint(rangeBoxObject.upperLeftPoint);
        this.addPoint(rangeBoxObject.upperRightPoint);
    }

    drawRangeBox(rangeBoxObject) {
        this.addRangeBox(rangeBoxObject);

        this.addSegment(new Segment(rangeBoxObject.lowerLeftPoint, rangeBoxObject.lowerRightPoint));
        this.addSegment(new Segment(rangeBoxObject.lowerRightPoint, rangeBoxObject.upperRightPoint));
        this.addSegment(new Segment(rangeBoxObject.upperRightPoint, rangeBoxObject.upperLeftPoint));
        this.addSegment(new Segment(rangeBoxObject.upperLeftPoint, rangeBoxObject.lowerLeftPoint));

        let rectangleObject = {
            "lowerLeftPoint": rangeBoxObject.lowerLeftPoint,
            "lowerRightPoint": rangeBoxObject.lowerRightPoint,
            "upperLeftPoint": rangeBoxObject.upperLeftPoint,
            "upperRightPoint": rangeBoxObject.upperRightPoint
        };

        return rectangleObject
    }

    addArrowhead(centerPoint, pointingAngle, arrowheadLength, arrowHeadAngle = new Angle('20.00000')) {
        // add add and subtract to angle object
        let angle1, angle2;
        /// THIS IS A BAND AID==> need to truly test to make sure this works!
        const rightAngle = get90Degrees(undefined, true);
        if (pointingAngle.isGreaterThanOrEqualTo(rightAngle)) {
            angle1 = (pointingAngle.subtractAngle(rightAngle)).subtractAngle(arrowHeadAngle);
            angle2 = (pointingAngle.subtractAngle(rightAngle)).addAngle(arrowHeadAngle);
        } else {
            angle1 = (pointingAngle.addAngle(rightAngle)).subtractAngle(arrowHeadAngle);
            angle2 = (pointingAngle.addAngle(rightAngle)).addAngle(arrowHeadAngle);
        }
        const point1 = centerPoint.translateAndReproducePolar(arrowheadLength,angle1);
        const point2 = centerPoint.translateAndReproducePolar(arrowheadLength,angle2);
        this.addSegment(new Segment(centerPoint, point1));
        this.addSegment(new Segment(centerPoint, point2));
    }

    /// add arrow
    // right now, it's pretty bad
    addArrow(segment, arrowheadLength = segment.getLength().multiplyMagExactConstant(0.1), arrowHeadAngle = new Angle('20.00000')) {
        let point1 = segment.point1;
        let point2 = segment.point2;
        let arrowProportion = arrowheadLength.divideMag(segment.getLength());
        let arrowheadEnd1 = point2.interpolate(point1, arrowProportion);
        let arrowheadEnd2 = point2.interpolate(point1, arrowProportion);

        arrowheadEnd1.rotate(arrowHeadAngle, point2);
        arrowheadEnd2.rotate(arrowHeadAngle.reverseSign(), point2);

        this.addSegment(segment);
        this.addSegment(new Segment(point2, arrowheadEnd1));
        this.addSegment(new Segment(point2, arrowheadEnd2));

        return segment;
    };

    addTwoHeadedArrow(segment, arrowheadLength = segment.getLength().multiplyMagExactConstant(0.1), arrowHeadAngle = new Angle('20.00000')) {

        let centerPoint = point1.interpolate(point2, 0.5);
        this.addArrow(new Segment(centerPoint, point1), arrowheadLength, arrowHeadAngle);
        this.addArrow(new Segment(centerPoint, point2), arrowheadLength, arrowHeadAngle);
    }

    addDistanceMarker(segment, sideLength) { // line with hash marks on the ends
        this.addTwoHeadedArrow(segment, sideLength, get90Degrees(undefined, true));
    }

    addArrowHeadInMiddleOfSegment(segment, arrowHeadLocationFloat = 0.5, arrowheadLength = segment.getLength().multiplyMagExactConstant(0.1), arrowHeadAngle = new Angle('20.00000')) {
        let point1 = segment.point1;
        let point2 = segment.point2;
        let point3 = point1.interpolate(point2, constructMagnitudeFromFloat(arrowHeadLocationFloat,undefined,undefined,true));
        this.addArrow(point1, point3);
        this.addSegment(point1,point2);
    }
    // // in case you want a line with an arrowhead in the middle of it
    // addArrowHeadBetweenPoints(point1, point2, arrowHeadLength, arrowheadAngleInDegrees) {
    //     let arrowHeadAngleInRadians = convertDegreesToRadians(arrowheadAngleInDegrees);
    //     let centerPointOfSegment = new PointF((point1.x + point2.x)/2, (point1.y + point2.y)/2);
    //
    //     // center it so the center, not the head, of the arrow is in the center of the segment
    //     // looks much more centered
    //     let totalDisplacement = arrowHeadLength / 2 * Math.cos(arrowHeadAngleInRadians);
    //     let segmentToHorizontalAngle = point1.getAngleToAnotherPoint(point2);
    //     let xDisplacement = totalDisplacement * Math.cos(segmentToHorizontalAngle);
    //     let yDisplacement = totalDisplacement * Math.sin(segmentToHorizontalAngle);
    //     let arrowHeadCenter = new PointF(centerPointOfSegment.x + xDisplacement, centerPointOfSegment.y + yDisplacement);
    //
    //     let theta = point1.getAngleToAnotherPoint(point2) + Math.PI;
    //     let end1 = arrowHeadCenter.getAnotherPointWithTrig(arrowHeadLength, theta + arrowHeadAngleInRadians);
    //     let end2 = arrowHeadCenter.getAnotherPointWithTrig(arrowHeadLength, theta - arrowHeadAngleInRadians);
    //     this.addSegment(arrowHeadCenter, end1);
    //     this.addSegment(arrowHeadCenter, end2);
    // }
    //
    // addSegmentWithArrowheadInCenter(point1, point2, arrowheadLength, arrowheadAngleInDegrees) {
    //     if (arrowheadAngleInDegrees === undefined) {arrowheadAngleInDegrees = 30;}
    //     if (arrowheadLength === undefined) {arrowheadLength = point1.getDistanceToAnotherPoint(point2) * 0.15;}
    //     let newSegment = this.addSegment(point1, point2);
    //     this.addArrowHeadBetweenPoints(point1, point2, arrowheadLength, arrowheadAngleInDegrees);
    //     return newSegment
    // }


    // add Circle
    // Point must already exist? NO
    addCircle(circleObject) {
        this.addPoint(circleObject.center);
        this.circles.push(circleObject);
        this.addRangeBox(circleObject.rangeBox);
        return c;
    }
    /// if the Point already exists, eg. because it is the end of a line,
    /// then this function does not work properly!


    // addBlackCircle(centerPoint, radius) {
    //     let circle = this.addCircle(centerPoint, radius);
    //     circle.setFillColor('#000000');
    //     circle.fill();
    //     return circle
    // }
/*

    addArc(centerPoint, radius, startRadians, endRadians) {
        let center = this.addExistingPoint(centerPoint);
        let thisArc = new ArcF(center, radius, startRadians, endRadians);
        this.addExistingPoint(thisArc.rangeBox.lowerLeftPoint);
        this.addExistingPoint(thisArc.rangeBox.upperLeftPoint);
        this.addExistingPoint(thisArc.rangeBox.lowerRightPoint);
        this.addExistingPoint(thisArc.rangeBox.upperRightPoint);
        this.arcs.push(thisArc);
        return thisArc
    }
/*
    // the arc radius will be the radiusProportion variable times the lesser of the two rays
    labelAngle(label, outsidePointA, vertex, outsidePointB, interiorOrExterior, textOnAorB, addDegreeLabel, radiusProportion, fontProportion, lockedFontSize) {
        /// I need to create a way to label right angles!
        if (radiusProportion === undefined) {
            radiusProportion = 0.15;
        }
        if (fontProportion === undefined) {
            fontProportion = 1;
        }
        if (interiorOrExterior === undefined) {
            interiorOrExterior = 'interior';
        }
        if (textOnAorB === undefined) {
            textOnAorB = 'A';
        }

        let arcRadius;
        let lengthA = vertex.getDistanceToAnotherPoint(outsidePointA);
        let lengthB = vertex.getDistanceToAnotherPoint(outsidePointB);
        if (lengthA <= lengthB) {
            arcRadius = radiusProportion * lengthA;
        } else {
            arcRadius = lengthB * radiusProportion;
        }

        /// 8-2-2020: Back in april I wrote the first method, it broke today, but I reqrote it with a different method
        // I am not sure if this one will break at that point, i so rigorously tested this in march
        // let angleA = outsidePointA.getAngleToHorizontal();
        // let angleB = outsidePointB.getAngleToHorizontal();
        let angleA = vertex.getAngleToAnotherPoint(outsidePointA);
        let angleB = vertex.getAngleToAnotherPoint(outsidePointB);
        /// breaks if one of the points is the origin!
        if (angleA === angleB) {
            return false /// cannot return
        }
        let greaterAngle, lesserAngle;
        if (angleA > angleB) {
            greaterAngle = angleA;
            lesserAngle = angleB;
        } else {
            greaterAngle = angleB;
            lesserAngle = angleA;
        }
        /// how do i figure out how to decide if it is interior or exterior?
        // this is just a test
        // i don't know how it will work if I cut through the zero line
        let startAngle, endAngle;
        if (greaterAngle - lesserAngle <= Math.PI && interiorOrExterior === 'interior') {
            startAngle = lesserAngle;
            endAngle = greaterAngle;
        } else if (greaterAngle - lesserAngle <= Math.PI && interiorOrExterior === 'exterior') {
            startAngle = greaterAngle;
            endAngle = lesserAngle;
        } else if (greaterAngle - lesserAngle > Math.PI && interiorOrExterior === 'interior') {
            startAngle = greaterAngle;
            endAngle = lesserAngle;
        } else if (greaterAngle - lesserAngle > Math.PI && interiorOrExterior === 'exterior') {
            startAngle = lesserAngle;
            endAngle = greaterAngle;
        } else {
            startAngle = 0;
            endAngle = 0;
        }
        /// right now, the text is always included on angle A
        // but in the future, I need to make an option to include text on angle B
        this.addArc(vertex,arcRadius,startAngle,endAngle);

        let textRotation, textReferencePoint;
        let textOnStartOrEnd;
        if (textOnAorB === 'A' && startAngle === angleA) {
            textOnStartOrEnd = 'start';
        } else if (textOnAorB === 'A' && startAngle === angleB) {
            textOnStartOrEnd = 'end';
        } else if (textOnAorB === 'B' && startAngle === angleA) {
            textOnStartOrEnd = 'end';
        } else if (textOnAorB === 'B' && startAngle === angleB) {
            textOnStartOrEnd = 'start';
        } else {
            textOnStartOrEnd = 'start'; // default, if all the above tests don't work
        }


        /// THIS IS DISORGANIZED, and there are way more if statements than necessary
        /// BUT IT WORKS (and that took a damn long time and a lot of annoyance! 4-20-2020
        let textPositioning;
        if (textOnStartOrEnd === 'start') {
            /// setting text rotation, must go through each case
            if (startAngle === 0 ) { // horizontal right
                textPositioning = 'lowerLeft';
                textRotation = 0;
            } else if (Math.abs(startAngle - Math.PI / 2) < 1e-10) { // vertical up
                textPositioning = 'lowerLeft';
                textRotation = 3 * Math.PI / 2;
            } else if (Math.abs(startAngle - Math.PI ) < 1e-10) { // horizontal left
                textPositioning = 'upperRight';
                textRotation = 0;
            } else if (Math.abs(startAngle - Math.PI * 3 / 2 ) < 1e-10) { // vertical down
                textPositioning = 'lowerLeft';
                textRotation = Math.PI / 2;
            } else if (startAngle > 0 && startAngle < Math.PI / 2) { // quadrant 1
                textPositioning = 'lowerLeft';
                textRotation = -1 * startAngle;
            } else if (startAngle > Math.PI / 2 && startAngle < Math.PI ) { // quadrant 2
                textPositioning = 'lowerLeft';
                textRotation = -1 * startAngle;
            } else if (startAngle > Math.PI && startAngle < Math.PI * 3 / 2) { // quadrant 3
                if (interiorOrExterior === 'exterior') {
                    textPositioning = 'upperRight';
                    textRotation = Math.PI - startAngle;
                } else if (interiorOrExterior === 'interior') {
                    textPositioning = 'upperRight';
                    textRotation = Math.PI - startAngle;
                }
            } else if (startAngle > Math.PI * 3 / 2 && startAngle < Math.PI * 2) { // quadrant 4
                textPositioning = 'lowerLeft';
                textRotation = -1 * startAngle;
            } else {
                textRotation = 0;
            }
            textReferencePoint = constructPointWithMagnitudeF(arcRadius * 1.1, startAngle);
            textReferencePoint.translate(vertex.x, vertex.y);
        } else if (textOnStartOrEnd === 'end') {
            textPositioning = 'upperLeft';
            /// add more functions here to label text on angle B!
            if (endAngle === 0 ) { // horizontal right
                textRotation = 0;
            } else if (Math.abs(endAngle - Math.PI / 2) < 1e-10) { // vertical up  // when i made this pi /2 , it exposed a flaw in the range of text!
                textRotation = 3 * Math.PI / 2;
            } else if (Math.abs(endAngle - Math.PI ) < 1e-10) { // horizontal left
                textPositioning = 'lowerRight';
                textRotation = 0;
            } else if (Math.abs(endAngle - Math.PI * 3 / 2 ) < 1e-10) { // vertical down
                textPositioning = 'lowerRight';
                textRotation = 3 * Math.PI / 2;
            } else if (endAngle > 0 && endAngle < Math.PI / 2) { // quadrant 1
                textRotation =  -1 * endAngle;
            } else if (endAngle > Math.PI / 2 && endAngle < Math.PI ) { // quadrant 2
                if (interiorOrExterior === 'exterior') {
                    textPositioning = 'lowerRight';
                    textRotation = Math.PI - endAngle;
                } else {
                    textRotation = -1 * endAngle;
                }
            } else if (endAngle > Math.PI && endAngle < Math.PI * 3 / 2) { // quadrant 3
                if (interiorOrExterior === 'interior'){
                    textPositioning = 'lowerRight';
                    textRotation = Math.PI - endAngle;
                } else if (interiorOrExterior === 'exterior') { // same either way!
                    textPositioning = 'lowerRight';
                    textRotation = Math.PI - endAngle;
                }
            } else if (endAngle > Math.PI * 3 / 2 && endAngle < Math.PI * 2) { // quadrant 4
                textRotation = -1 * endAngle;
            } else {
                textRotation = 0;
            }
            textReferencePoint = constructPointWithMagnitudeF(arcRadius * 1.1, endAngle);
            textReferencePoint.translate(vertex.x, vertex.y);


            // MUCH MORE TO ADD HERE! (not sure what)
        }
        let relativeFontSize = arcRadius * 0.5 * fontProportion;
        if (lockedFontSize) {
            relativeFontSize = lockedFontSize;
        }
        let text;
        if (label) {
            if (addDegreeLabel) {
                label = label + '°';
            }
            text = this.addText(label,textReferencePoint,relativeFontSize,textRotation,textPositioning);
            text.addDegreeLabel(this);
        }
        return text
    }

    squareAngle(outsidePointA, vertex, outsidePointB, length) {
        let proportionA = length / vertex.getDistanceToAnotherPoint(outsidePointA);
        let proportionB = length / vertex.getDistanceToAnotherPoint(outsidePointB);
        let pointA = vertex.interpolate(outsidePointA, proportionA);
        let pointB = vertex.interpolate(outsidePointB, proportionB);

        let lineA = constructLineFromPointAndAngleF(pointA, vertex.getAngleToAnotherPoint(pointB));
        let lineB = constructLineFromPointAndAngleF(pointB, vertex.getAngleToAnotherPoint(pointA));

        let centerPoint = lineA.findIntersectionWithAnotherLine(lineB);

        this.addSegment(pointA, centerPoint);
        this.addSegment(pointB, centerPoint);
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
    addText(letters, referencePoint, relativeFontSize, rotation, positioning) {
        this.addExistingPoint(referencePoint); // figure out what this is used for!
        let newText = new TextF(letters, referencePoint, relativeFontSize, rotation, positioning);
        this.addExistingPoint(newText.rangeBox.lowerLeftPoint); // should i add a method to range box, 'add to diagram'?
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
            textDisplacement = 0;
        }

        let phi;
        let quadrant = point1.getQuadrantOfAnotherPoint(point2);

        // as defined by https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate
        // rotation angle is CLOCKWISE in radians
        // there are probably more bugs here!
        // 8-8-2020: considering reversing this: if I do I must reverse it in the range box also
        if (quadrant === '1') {
            phi = Math.PI /2 - theta;
            textRotation = -1 * theta;
        } else if (quadrant === '2') {
            textRotation = Math.PI - theta; // continues to perplex me
            phi = Math.PI / 2 - textRotation;
        } else if (quadrant === '3') {
            textRotation = Math.PI - theta;
            // textRotation = theta + Math.PI / 2;
            phi = 3 * Math.PI / 2 - theta; // have not fully tested this
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
            textAboveObject = this.addText(textAbove, new PointF(aboveX, aboveY), relativeFontSize, textRotation, 'aboveCenter');
        }
        if (textBelow) {
            textBelowObject = this.addText(textBelow, new PointF(belowX, belowY), relativeFontSize, textRotation,'belowCenter');
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

    getOppositeOrientation(orientation) {
        if (orientation === 'clockwise') {
            return 'counterclockwise'
        } else if (orientation === 'counterclockwise') {
            return 'clockwise'
        }
    }

    // these are used for labeling lines outside or inside of a box
    // the orientation is clockwise or counterclockwise
    labelLineOutside(point1, point2, text, textDisplacement, relativeFontSize, textOrientation) {
        if (textOrientation === undefined) {
            textOrientation = 'clockwise';
        }
        let aboveOrBelow;
        const optimalTextLocation = getOptimalLocationOfText(point1, point2, textOrientation);
        if (optimalTextLocation === 'left') {
            aboveOrBelow = 'above';
        } else if (optimalTextLocation === 'above') {
            aboveOrBelow = 'above';
        } else if (optimalTextLocation === 'right') {
            aboveOrBelow = 'below';
        } else if (optimalTextLocation === 'below') {
            aboveOrBelow = 'below';
        }
        if (aboveOrBelow === 'below') {
            this.labelLineBelow(point1, point2, text, textDisplacement, relativeFontSize);
        } else if (aboveOrBelow === 'above') {
            this.labelLineAbove(point1, point2, text, textDisplacement, relativeFontSize);
        }
    }

    labelLineInside(point1, point2, text, textDisplacement, relativeFontSize, textOrientation) {
        if (textOrientation === undefined) {
            textOrientation = 'clockwise';
        }
        this.labelLineOutside(point1, point2, text, textDisplacement, relativeFontSize, this.getOppositeOrientation(textOrientation));
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

        // get width
        let width = 0;
        lettersArray.forEach((line) => {
            if (getLengthOfLetters(line, relativeFontSize) > width) {
                width = getLengthOfLetters(line, relativeFontSize);
            }
        });
        let boxHeight = relativeFontSize * lettersArray.length + (spacing - 1) * relativeFontSize * (lettersArray.length - 1);
        let topY = centerLeftPoint.y + boxHeight / 2;
        let q, thisY, nextText;
        for (q = 0; q < lettersArray.length; q++) {
            thisY = topY - lineWidth * q;
            nextText = this.addText(lettersArray[q],new PointF(leftX, thisY),relativeFontSize);
            nextText.setAlignmentAndBaseline(textAlign,'top');
            // rework this using the new system of text alignment and baseline
        }
        return {
            height: boxHeight,
            width: width
        }
    }

    /// WORKS ONLY FOR 45 degree angles!!!! 3-19-2020 10:31 am
    /// i'm taking a break and coming back to this shit
    addLinesNextToSegment(point1, point2, lettersArray, location, extraDisplacement, relativeFontSize, spacing) {
        if (location === undefined) {
            location = 'clockwise';
        }
        if (location === 'clockwise') {
            location = getOptimalLocationOfText(point1, point2, 'clockwise');
        } else if (location === 'counterclockwise') {
            location = getOptimalLocationOfText(point1, point2, 'counterclockwise');
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

        let maxLettersLength = 0;
        lettersArray.forEach((text) => {
            let testLength = getLengthOfLetters(text, relativeFontSize);
            if (testLength > maxLettersLength) {
                maxLettersLength = testLength;
            }
        });

        let boxWidth = maxLettersLength;
        let horizontalDisplacement = 0;
        let verticalDisplacement = 0;
        let textAlign;

        ///// THIS PART ISN'T DONE!!!!
        ///  In fact, it's a total wreck, but i need to fix some other thigns before i can properly test it
        if (location === 'right') {
            textAlign = 'left';
            if (quad === '1' || quad === '3') {
                horizontalDisplacement += (boxHeight / 2) / Math.tan(theta) + extraDisplacement;
            } else if (quad === '2' || quad === '4') {
                horizontalDisplacement += -1 * (boxHeight / 2) / Math.tan(theta) + extraDisplacement;
            } else if (quad === '+Y' || quad === '-Y') {
                horizontalDisplacement += extraDisplacement;
            } else if (quad === '+X' || quad === '-X') {
                console.log('ERROR: Cannot place text to the right of horizontal line');
            } else {
                console.log('unable to add text lines');
            }
        } else if (location === 'left') {
            textAlign = 'right';
            if (quad === '1' || quad === '3') {
                horizontalDisplacement -= (boxHeight / 2) / Math.tan(theta) + extraDisplacement;
            } else if (quad === '2' || quad === '4') {
                horizontalDisplacement -= -1 * (boxHeight / 2) / Math.tan(theta) + extraDisplacement;
            } else if (quad === '+Y' || quad === '-Y') {
                horizontalDisplacement -= extraDisplacement;
            } else if (quad === '+X' || quad === '-X') {
                console.log('ERROR: Cannot place text to the right of horizontal line');
            } else {
                console.log('unable to add text lines');
            }
        } else if (location === 'below') { // these vertical positions are screwing with me
            textAlign = 'center';
            if (quad === '1') {
                verticalDisplacement -= boxHeight / 2 + extraDisplacement;
            } else if (quad === '2') {
                // horizontalDisplacement -= boxWidth;
                verticalDisplacement -= boxHeight / 2 + extraDisplacement;
            } else if (quad === '+X' || quad === '-X') {
                // verticalDisplacement -= boxHeight / 2;
                verticalDisplacement -= boxHeight / 2 + extraDisplacement;
            } else if (quad === '+Y' || quad === '-Y') {
                console.log('ERROR: Cannot place text above a vertical line');
            } else {
                console.log('unable to add text lines');
            }
        } else if (location === 'above') {
            textAlign = 'center';
            if (quad === '1') {
                verticalDisplacement += boxHeight / 2 + extraDisplacement; // definitely need more here
            } else if (quad === '2') {
                verticalDisplacement += boxHeight / 2 + extraDisplacement; // definitely need more here
            } else if (quad === '+X' || quad === '-X') {
                verticalDisplacement += boxHeight / 2 + extraDisplacement;
            } else if (quad === '+Y' || quad === '-Y') {
                console.log('ERROR: Cannot place text above a vertical line');
            } else {
                console.log('unable to add text lines');
            }
        } else {
            console.log('unable to add text lines');
        }

        let textReferencePoint = point1.interpolate(point2, 0.5);
        textReferencePoint.translate(horizontalDisplacement,verticalDisplacement);

        this.addLinesOfText(lettersArray, textReferencePoint, relativeFontSize, spacing, textAlign);
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
    //
    // replaceOriginWithUniquePoint() {
    //     let i;
    //     for (i = 0; i < this.points.length; i++) {
    //         if (this.points[i] === origin) {
    //             this.points[i] = new Point(Math.random()*1e-10, Math.random()*1e-10);
    //         }
    //     }
    // }

    // mergeWithAnotherDiagram
    merge(anotherDiagram, whichSide, bufferSpace, centering) {
        if (bufferSpace === undefined) {
            bufferSpace = 0;
        }

        anotherDiagram.points.forEach((point) => {
            if (point.x === 0 && point.y === 0) {
                point = new PointF(0,0);
            }
        });
        this.getRange();
        anotherDiagram.getRange();
        let xTranslation, yTranslation;
        if (whichSide === 'right') {
            xTranslation = this.xMax - anotherDiagram.xMin + bufferSpace;
            yTranslation = 0;
            if (centering) {
                yTranslation = (this.yMin + this.yMax) / 2;
            }
        } else if (whichSide === 'left') {
            xTranslation = this.xMin + anotherDiagram.xMax - bufferSpace;
            yTranslation = 0;
            if (centering) {
                yTranslation = (this.yMin + this.yMax) / 2;
            }
        } else if (whichSide === 'top') {
            xTranslation = 0;
            yTranslation = this.yMax - anotherDiagram.yMin + bufferSpace;
            if (centering) {
                xTranslation = (this.xMin + this.xMax) / 2;
            }
        } else if (whichSide === 'bottom') {
            xTranslation = 0;
            yTranslation = this.yMax + anotherDiagram.yMax - bufferSpace;
            if (centering) {
                xTranslation = (this.xMin + this.xMax) / 2;
            }
        } else if (whichSide === 'absolute') {
            xTranslation = 0;
            yTranslation = 0;
        } else {
            return false
        }
        anotherDiagram.translate(xTranslation, yTranslation);


        anotherDiagram.points.forEach((point) => {this.points.push(point)});
        anotherDiagram.segments.forEach((segment) => {this.segments.push(segment)});
        anotherDiagram.circles.forEach((circle) => {this.circles.push(circle)});
        anotherDiagram.texts.forEach((text) => {this.texts.push(text)});
        anotherDiagram.functionGraphs.forEach((functionGraph) => {this.functionGraphs.push(functionGraph)});
        anotherDiagram.arcs.forEach((arc) => {this.arcs.push(arc)});

        return true;
    }
    */



    /// transformations
    translate(xTranslationFloat, yTranslationFloat) {
        let xTranslation = constructMagnitudeFromFloat(xTranslationFloat, undefined, undefined, true); // will this work with units????
        let yTranslation = constructMagnitudeFromFloat(yTranslationFloat, undefined, undefined, true);
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
        this.arcs.forEach((arc) => {arc.rescaleSingleFactor(scaleFactor)});
    }

    rescaleDoubleFactor(xFactor, yFactor) {
        this.points.forEach((point) => {point.rescaleDoubleFactor(xFactor, yFactor)});
        this.texts.forEach((text) => {text.rescaleDoubleFactor(xFactor, yFactor)});
        this.circles.forEach((circle) => {circle.rescaleDoubleFactor(xFactor, yFactor)});
        this.arcs.forEach((arc) => {arc.rescaleDoubleFactor(xFactor, yFactor)});

    }

    reflectAboutXAxis() {
        this.points.forEach((point) => {point.reflectAboutXAxis();})
    }

    getRange() {
        let xMin, xMax, yMin, yMax;

        if (Object.keys(this.lockedRange).length > 0) {
            xMin = this.lockedRange.xMin;
            xMax = this.lockedRange.xMax;
            yMin = this.lockedRange.yMin;
            yMax = this.lockedRange.yMax;
        } else {

            xMin = this.points[0].x.getFloat();
            xMax = xMin;
            yMin = this.points[0].y.getFloat();
            yMax = yMin;

            this.points.forEach((point) => {
                if (point.x.getFloat() > xMax) {
                    xMax = point.x.getFloat();
                }
                if (point.x.getFloat() < xMin) {
                    xMin = point.x.getFloat();
                }
                if (point.y.getFloat() > yMax) {
                    yMax = point.y.getFloat();
                }
                if (point.y.getFloat() < yMin) {
                    yMin = point.y.getFloat();
                }
            });
        }

        this.xMax = xMax;
        this.xMin = xMin;
        this.yMax = yMax;
        this.yMin = yMin;
        this.horizontalRange = xMax - xMin;
        this.verticalRange = yMax - yMin;

        return true
    }

    // returns an html canvas of the Diagram
    // maxWidth and maxHeight are the maximum width and height of the canvas
    // unit is the unit for the maxWidth and maxHeight variabales, default is px
    // wiggle room is the space around the outside of the canvas in which nothing will be drawn,
    // default wiggle room is 20
    drawCanvas(maxWidth = this.defaultSize, maxHeight = maxWidth, forceSize, unit = 'px', wiggleRoom = 20) {
        try {
            if (isNaN(maxWidth) || isNaN(maxHeight)) throw 'Width and Height must be numbers'; // what if it is a non-number object???
            if (maxWidth <= 0 || maxHeight <= 0) throw 'Width and Height must be positive numbers';
            if (this.points.length === 0) throw "Cannot draw canvas with no elements."
        }
        catch(err) {
            console.log(err);
        }

        this.getRange();

        /*
        // add a key, if speecified
        if (this.key.length > 0) {
            let keyFontSizeDummy;
            if (this.keyFont) {
                keyFontSizeDummy = this.keyFont;
            } else {
                keyFontSizeDummy = (this.horizontalRange + this.verticalRange) / 2 * 0.05; // default value of the font of the key
            }
            const keyFontSize = keyFontSizeDummy;

            const keyY = this.yMax + (keyFontSize * 1.5 * this.key.length + .5);
            const keyX = (this.xMin + this.xMax) / 2;

            let index = 0;
            this.key.forEach((line) => {
                let newText = this.addText(line.text,new PointF(keyX, keyY - index * keyFontSize * 1.5),keyFontSize,0,'center');
                newText.setColor(line.color);
                index += 1;
            });

            this.getRange(); // get range again, with new text added
        }

         */

        try {
            if (this.horizontalRange.zero) throw 'Cannot draw canvas horizontal range = 0';
            if (this.verticalRange.zero) throw 'Cannot draw canvas with vertical range = 0';
        }
        catch (err) {
            console.log(err);
        }


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
        let ctx = c.getContext('2d');

        // should i make this variable?
        let dotSize = (this.horizontalRange + this.verticalRange) / 2 / 30;
        this.segments.forEach((segment) => {
            ctx.lineWidth = segment.diagramQualities.thickness;
            ctx.lineCap = segment.diagramQualities.lineCap;
            ctx.strokeStyle = segment.diagramQualities.color;
            if (segment.diagramQualities.dotted) {
                let q;
                let length = segment.getLength().getFloat();
                let theta = segment.getAngleToHorizontal().getFloat();
                let Ndots = length / dotSize;
                for (q = 0; q < Ndots; q++) {
                    if (q % 2 === 0) {
                        ctx.beginPath();
                        ctx.moveTo(wiggleRoom + segment.point1.x.getFloat() + length * q / Ndots * Math.cos(theta), canvasHeight - wiggleRoom - segment.point1.y.getFloat() - length * q / Ndots * Math.sin(theta));
                        ctx.lineTo(wiggleRoom + segment.point1.x.getFloat() + length * (q + 1) / Ndots * Math.cos(theta), canvasHeight - wiggleRoom - segment.point1.y.getFloat() - length * (q + 1) / Ndots * Math.sin(theta));
                        ctx.stroke();
                    }
                }
            } else if (segment.diagramQualities.dashed) {
                let length = segment.getLength().getFloat();
                let Ndashes = 7;
                //let solidToSpaceRatio = 0.5;
                let Lsolid = length / Ndashes / 2;
                ctx.beginPath();
                ctx.setLineDash([Lsolid]);
                ctx.moveTo(wiggleRoom + segment.point1.x.getFloat(), canvasHeight - wiggleRoom - segment.point1.y.getFloat());
                ctx.lineTo(wiggleRoom + segment.point2.x.getFloat(), canvasHeight - wiggleRoom - segment.point2.y.getFloat());
                ctx.stroke();
            } else { /// normal (not dotted) lines
                ctx.beginPath();
                ctx.setLineDash([]);
                ctx.moveTo(wiggleRoom + segment.point1.x.getFloat(), canvasHeight - wiggleRoom - segment.point1.y.getFloat());
                ctx.lineTo(wiggleRoom + segment.point2.x.getFloat(), canvasHeight - wiggleRoom - segment.point2.y.getFloat());
                ctx.stroke();
            }
        });

        ctx.setLineDash([]);
/*
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
*/
        this.circles.forEach((circleObject) => {
            ctx.fillStyle = circleObject.fillColor;
            ctx.strokeStyle = circleObject.lineColor;
            ctx.lineWidth = circleObject.lineThickness;

            ctx.beginPath();
            ctx.arc(wiggleRoom + circleObject.center.x.float(), canvasHeight - wiggleRoom - circleObject.center.y.float(), circleObject.radius.float(), 0, Math.PI * 2);
            ctx.stroke();
            if (circleObject.filled) {ctx.fill();}
        });

        /*
        this.arcs.forEach((arcObject) => {
            /// ARC SECTION
            ctx.strokeStyle = "#000000";
            ctx.fillStyle = "#FFFFFF";
            // ctx.fillStyle = "#FFFFFF";
            ctx.lineWidth = 2;

            let start = -1 * arcObject.startRadians;
            let end = -1 * arcObject.endRadians;
            let anticlockwise = true;

            ctx.beginPath();

            /// THIS METHOD IS AN ABSOLUTE NIGHTMARE!
            // let anticlockwise, start, end;
            // if (!arcObject.crossZeroLine) {
            //     start = arcObject.lesserAngle;
            //     end = arcObject.greaterAngle;
            //     console.log(start, end);
            //     anticlockwise = true;
            //     start *= -1;
            //     if (start === 0) {
            //         end *= -1;
            //     } else if (start <= -1 * Math.PI + 1e-10) {
            //         end *= -1;
            //     }
            //     if (start < Math.PI / 2 && end > 3 * Math.PI / 2) {
            //         start *= -1;
            //     }
            //     console.log(start, end);
            // } else { // crosses zero line
            //     anticlockwise = true;
            //     start = arcObject.greaterAngle;
            //     end = arcObject.lesserAngle;
            //     console.log(start, end);
            //     start *= -1;
            //     end *= -1;
            //     // works so far, but will probably break if I keep testing it!
            // }
            ctx.arc(wiggleRoom + arcObject.center.x, canvasHeight - wiggleRoom - arcObject.center.y, arcObject.radius, start, end, anticlockwise);
            ctx.stroke();
        });

        /// texts come last so they are not written over
        this.texts.forEach((textObject) => {
            ctx.font = String(textObject.relativeFontSize) + unit + " " + String(textObject.font);
            ctx.fillStyle = textObject.color;
            ctx.textAlign = textObject.alignment;
            ctx.textBaseline = textObject.baseline;

            //// MUST ADD IF/THEN STATEMENT TO SET THE REFERENCE POINT BASED UPON THE TEXT ALIGNMENT AND BASELINE

            if (Math.abs(textObject.rotationAngleInRadians) > 1e-10) {
                ctx.translate(wiggleRoom + textObject.referencePoint.x, canvasHeight - textObject.referencePoint.y - wiggleRoom);
                ctx.rotate(textObject.rotationAngleInRadians);
                ctx.fillText(textObject.letters, 0, 0);
                ctx.rotate(-1 * textObject.rotationAngleInRadians);
                ctx.translate(-1 * (wiggleRoom + textObject.referencePoint.x), -1 * ( canvasHeight - textObject.referencePoint.y - wiggleRoom));
            } else {
                ctx.fillText(textObject.letters, wiggleRoom + textObject.referencePoint.x, canvasHeight - textObject.referencePoint.y - wiggleRoom);
            }

        });
*/

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
