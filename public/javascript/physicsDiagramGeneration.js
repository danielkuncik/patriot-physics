/*
I NEED TO FIGURE OUT HOW TO ACCOUNT FOR THE RANGE OF A ROTATED BOX
I NEED TO FIGURE OUT HOW TO ACCOUNT FOR THE RANGE OF A ROTATED BOX
I NEED TO FIGURE OUT HOW TO ACCOUNT FOR THE RANGE OF A ROTATED BOX
I NEED TO FIGURE OUT HOW TO ACCOUNT FOR THE RANGE OF A ROTATED BOX
I NEED TO FIGURE OUT HOW TO ACCOUNT FOR THE RANGE OF A ROTATED BOX
I NEED TO FIGURE OUT HOW TO ACCOUNT FOR THE RANGE OF A ROTATED BOX
[i jsut really want to make sure i don't forget this]


IT ALWAYS INCLUDES THE ORIGIN... DO I WANT THAT???
 */
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

function getLength(point1, point2) {
    return Math.sqrt((point1[0] - point2[0]) * (point1[0] - point2[0]) + (point1[1] - point2[1]) * (point1[1] - point2[1]));
}


function getSlope(point1, point2) {
    return (point2[1] - point1[1])/(point2[0] - point1[0])
}

// returns angle to horizontal between two points
// note angle returned in is radians
// always returns  angle in range - pi/2 to pi / 2,
function getAngleToHorizontal(point1, point2) {
    return Math.atan(getSlope(point1, point2));
}

// returns integer 1 to 4
// if point is on an axis, returns false
function getQuadrantOfPoint(point) {
    if      (point[0] > 0 && point[1] > 0) {return 1;}
    else if (point[0] < 0 && point[1] > 0) {return 2;}
    else if (point[0] < 0 && point[1] < 0) {return 3;}
    else if (point[0] > 0 && point[1] < 0) {return 4;}
    else {return false;}
}

function rotateClockwise90(angle) {
    return angle - Math.PI / 2
}

function rotateCounterClockwise90(angle) {
    return angle + Math.PI / 2
}

function convertDegreeToRadian(angle) {
    return angle / 180 * Math.PI;
}

function rotatePointClockwiseAboutOrigin(point, angleInRadians) {
    const x = point[0];
    const y = point[1];
    const x_prime = x * Math.cos(angleInRadians) - y * Math.sin(angleInRadians);
    const y_prime = y * Math.cos(angleInRadians) + x * Math.sin(angleInRadians);
    return [x_prime, y_prime];
}

function translatePoint(point, x_translation, y_translation) {
    return [point[0] + x_translation, point[1] + y_translation];
}

// gets a point some porportion between two points
function interpolatePoint(point1, point2, proportion) {
    const hypotenuse = getLength(point1, point2) * proportion;
    const angle = getAngleToHorizontal(point1, point2);
    return getNewPointWithTrig(point1, hypotenuse, angle);
}

//
function getNewPointWithTrig(point, hypotenuse, angle) {
    const x = hypotenuse * Math.cos(angle) + point[0];
    const y = hypotenuse * Math.sin(angle) + point[1];
    return [x, y];

}

function getRangeOfACircle(centerPoint, radius) {

    return {
        xMin: 0,
        xMax: 0,
        yMin: 0,
        yMax: 0
    }
}


function diagram() {
    this.xMax = 0;
    this.xMin = 0;
    this.yMax = 0;
    this.yMin = 0;

    this.lines = [];
    this.circles = [];
    this.text = [];

    this.addPoint = function(point) {
        validatePoint(point);
        if (point[0] > this.xMax) {this.xMax = point[0]} else if (point[0] < this.xMin) {this.xMin = point[0]}
        if (point[1] > this.yMax) {this.yMax = point[1]} else if (point[1] < this.yMin) {this.yMin = point[1]}
        return true
    };

    // test how the addition of a new box element would influence the range of the canvas
    this.addBox = function(xmax, xmin, ymax, ymin, rotation) {
        if (rotation === undefined) {
            if (xmax > this.xMax) {this.xMax = xmax;}
            if (xmin < this.xMin) {this.xMin = xmin;}
            if (ymax > this.yMax) {this.yMax = ymax;}
            if (ymin < this.yMin) {this.yMin = ymin;}
        } else {
            // need to somehow account for rotation!
        }
    };


    this.addLine = function(point1, point2) {
        this.addPoint(point1);
        this.addPoint(point2);
        this.lines.push({
            "point1":point1,
            "point2":point2
        });
        return true
    };

    this.addArrow = function(point1, point2, arrowheadLength, arrowheadAngleInDegrees) {
        const phi = convertDegreeToRadian(arrowheadAngleInDegrees);

        var angleToHorizontal = getAngleToHorizontal(point1, point2);
        // returns value from -pi/2 to pi/2
        // appropriate for an arrowhead in quadrants 1 or 4, but not in quadrant 2 or 3
        const arrowheadQuadrant = getQuadrantOfPoint(point2);
        if (arrowheadQuadrant === 2) {
            angleToHorizontal = Math.PI + angleToHorizontal;
        } else if (arrowheadQuadrant === 3) {
            angleToHorizontal = Math.PI + angleToHorizontal;
        } else if (!arrowheadQuadrant && point2[0] < 0 && point2[1] === 0) { // if arrow is on the -x axis
            angleToHorizontal = Math.PI
        }

        const L = getLength(point1, point2);
        var arrowheadEnd1_untransformed = [L - arrowheadLength * Math.cos((phi)), arrowheadLength * Math.sin(phi)]; // location of the arrowhead end if the arrow were a straight line on the x-axis
        var arrowheadEnd2_untransformed = [L - arrowheadLength * Math.cos((phi)), -1 * arrowheadLength * Math.sin(phi)]; // location of the arrowhead end if the arrow were a straight line on the x-axis

        var arrowheadEnd1 = translatePoint(rotatePointClockwiseAboutOrigin(arrowheadEnd1_untransformed, angleToHorizontal), point1[0], point1[1]);
        var arrowheadEnd2 = translatePoint(rotatePointClockwiseAboutOrigin(arrowheadEnd2_untransformed, angleToHorizontal), point1[0], point1[1]);

        this.addLine(point1, point2); // main line
        this.addLine(point2, arrowheadEnd1); // half of arrowhead
        this.addLine(point2, arrowheadEnd2); // half of arrowhead

        return true;
    };


    this.addCircle = function(centerPoint, radius, isItFilled) {
        this.addBox(centerPoint[0] + radius, centerPoint[0] - radius, centerPoint[1] + radius, centerPoint[1] - radius);
        this.circles.push(
            {
                "centerPoint": centerPoint,
                "radius": radius,
                "filled": isItFilled
            }
        )
    };

    this.deleteLastCircle = function() {
        if (this.circles.length > 0) {this.circles.pop();}
    };


    // relative font size is how large you want each letter to be relative to whatever unit you are using
    // reltaive font size is not exact
    // roughly, it can be understood as follows:
    // if you ahve a line a length 1 and text with a relative font size of 1
    // then an upper case W will be slightly less wide than the length of the line.
    this.addText = function(text, centerPoint, relativeFontSize, rotation) {
        /// i need to consider how the text influences size!
        this.addBox(centerPoint[0] + text.length * relativeFontSize / 2, centerPoint[0] - text.length * relativeFontSize / 2, centerPoint[1] + relativeFontSize / 2, centerPoint[1] - relativeFontSize / 2);
        this.text.push({
            "text": text,
            "centerPoint": centerPoint,
            "relativeFontSize": relativeFontSize,
            "rotation": rotation /// rotation must be measured in radians
        });
    };

    this.getHorizontalRange = function() {
        return this.xMax - this.xMin;
    };

    this.getVerticalRange = function() {
        return this.yMax - this.yMin
    };

    // returns a scale Factor, an Xtranslation factor, a yTranslationfactor
    // this would cause the point to fit into a box with width no greater than maxwidth and height no greater than max height
    // and for all points to be positive (as though all in quadrant 1)
    this.fitIntoBox = function(maxWidth, maxHeight, wiggleRoom) {
        var horizontalRange = this.xMax - this.xMin;
        var verticalRange = this.yMax - this.yMin;
        var scaleFactor = nondistortedResize(horizontalRange, verticalRange, maxWidth - wiggleRoom * 2, maxHeight - wiggleRoom * 2);
        var fitObject = {
            "scaleFactor": scaleFactor,
            "xTranslationFactor": -1 * this.xMin, // so the lower left corner will be located at the origin
            "yTranslationFactor": -1 * this.yMin,
            "finalWidth": horizontalRange * scaleFactor + wiggleRoom * 2,
            "finalHeight": verticalRange * scaleFactor + wiggleRoom * 2
        };

        return fitObject
    };

    this.drawCanvas = function(maxWidth, maxHeight, unit, wiggleRoom) {
        if (wiggleRoom === undefined) {wiggleRoom = 20}
        try {
            if (isNaN(maxWidth) || isNaN(maxHeight)) throw 'Width and Height must be numbers';
            if (maxWidth <= 0 || maxHeight <= 0) throw 'Width and Height must be positive numbers';
        }
        catch(err) {
            console.log(err);
        }

        if (unit === undefined) {
            unit = 'px'
        }
        var fitObject = this.fitIntoBox(maxWidth, maxHeight, wiggleRoom);
        var newCanvas = new canvas(fitObject.finalWidth, fitObject.finalHeight, unit);

        var point1, point2;
        this.lines.forEach((line) => {
            point1 = transformPoint(line.point1, fitObject.scaleFactor, fitObject.xTranslationFactor, fitObject.yTranslationFactor, wiggleRoom);
            point2 = transformPoint(line.point2, fitObject.scaleFactor, fitObject.xTranslationFactor, fitObject.yTranslationFactor, wiggleRoom);
            newCanvas.drawLine(point1, point2);
        });

        var centerPoint, radius;
        this.circles.forEach((circle) => {
            centerPoint = transformPoint(circle.centerPoint, fitObject.scaleFactor, fitObject.xTranslationFactor, fitObject.yTranslationFactor, wiggleRoom);
            radius = transformLength(circle.radius, fitObject.scaleFactor);
            if (!circle.filled) {
                newCanvas.drawEmptyCircle(centerPoint, radius);
            } else {
                newCanvas.drawFilledCircle(centerPoint, radius);
            }
        });
        var text, fontSize;
        this.text.forEach((textElement) => {
            console.log(textElement);
            centerPoint = transformPoint(textElement.centerPoint, fitObject.scaleFactor, fitObject.xTranslationFactor, fitObject.yTranslationFactor, wiggleRoom);
            text = textElement.text;
            fontSize = transformLength(textElement.relativeFontSize,fitObject.scaleFactor);
            newCanvas.drawText(text, centerPoint, fontSize, textElement.rotation);
        });


        return newCanvas.c;
    }
}

function validatePoint(point) {
    if (typeof(point) !== "object" || point.length !== 2 || typeof(point[0]) !== 'number' || typeof(point[1]) !== 'number') {console.log("ERROR: Point must be a list 2 numbers")}
    /// change this to include the isNaN function
}


function transformPoint(point, scale, xTranslation, yTranslation, wiggleRoom) {
    var newX = scale * (point[0] + xTranslation) + wiggleRoom;
    var newY = scale * (point[1] + yTranslation) + wiggleRoom;
    return [newX, newY]
}

function transformLength(length, scale) {
    return length * scale
}

function canvas(width, height, unit) {

    this.c = document.createElement("canvas");
    this.c.setAttribute("width", String(width) + unit);
    this.c.setAttribute("height", String(height) + unit);
    this.height = height;

    this.drawLine = function(point1, point2) {
        var ctx = this.c.getContext("2d");

        ctx.lineWidth = 2;
        ctx.lineCap = "butt";
        ctx.strokeStyle = "#000000";

        ctx.moveTo(point1[0], this.height - point1[1]);
        ctx.lineTo(point2[0], this.height - point2[1]);
        ctx.stroke();
    };

    this.drawEmptyCircle = function(centerPoint, radius) {
        var ctx = this.c.getContext("2d");

        ctx.lineWidth = 2;
        ctx.lineCap = "butt";
        ctx.strokeStyle = "#000000";

        //ctx.moveTo(centerPoint[0], centerPoint[1]);
        ctx.moveTo(centerPoint[0] + radius, this.height - centerPoint[1]);
        ctx.beginPath();
        ctx.arc(centerPoint[0], this.height - centerPoint[1], radius, 0, Math.PI * 2);
        ctx.stroke();

    };

    this.drawFilledCircle = function(centerPoint, radius) {
        var ctx = this.c.getContext("2d");
        ctx.fillStyle = "black";
        ctx.moveTo(centerPoint[0] + radius, this.height - centerPoint[1]);
        ctx.beginPath();
        ctx.arc(centerPoint[0], this.height - centerPoint[1], radius, 0, Math.PI * 2);
        ctx.fill();

    };


    this.drawText = function(text, centerPoint, fontSize, rotation) {
        var ctx = this.c.getContext("2d");

        console.log(fontSize);
        ctx.font = String(fontSize) + "px Arial";
        console.log(ctx.font);
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center"; // on the unit maps, why isn't the text directly in the center of the circle?
        ctx.textBaseline = "middle";

        if (rotation === undefined) {
            ctx.fillText(text, centerPoint[0], this.height - centerPoint[1]);
        } else {
            console.log(rotation);
            ctx.translate(centerPoint[0], centerPoint[1]);
            ctx.rotate(rotation);
            ctx.fillText(text, 0, 0);
            ctx.rotate(-1 * rotation);
            ctx.translate(-1 * centerPoint[0], -1 * centerPoint[1]);
        }
    }
}


function electricCircuit() {
    this.circuit = new diagram();

    this.addWire = function(point1, point2) {
        this.circuit.addLine(point1, point2);
    };

    // inefficient to use the interpolate point function mulitple times!
    this.addZigZag = function(endPoint1, endPoint2, width) {
        const length = getLength(endPoint1, endPoint2);
        const angle = getAngleToHorizontal(endPoint1, endPoint2);
        const point1 = endPoint1;
        const point2 = getNewPointWithTrig(interpolatePoint(endPoint1, endPoint2, 0.3333333), width, rotateCounterClockwise90(angle));
        const point3 = getNewPointWithTrig(interpolatePoint(endPoint1, endPoint2, 0.6666667), width, rotateClockwise90(angle));
        const point4 = endPoint2;
        this.addWire(point1, point2);
        this.addWire(point2, point3);
        this.addWire(point3, point4);
    };

    this.addResistor = function(endPoint1, endPoint2, numZigZags, width) {
        if (numZigZags === undefined) {numZigZags = 3;}
        if (width === undefined) {width = getLength(endPoint1, endPoint2) * 0.25;}
        var j;
        var startPoint = endPoint1, finishPoint;
        for (j = 0; j < numZigZags; j++) {
            finishPoint = interpolatePoint(endPoint1, endPoint2, (j + 1) / numZigZags);
            this.addZigZag(startPoint, finishPoint, width);
            startPoint = finishPoint;
        }
    };


    //// I need to add 'label' to each of these elements
    /// i should also add an element called 'reverse text', which is a boolean
    /// and, if true, cases you to reverse the text to the other side
    /// so, the text is always on the natural side, unless you activate that boolean, then it goes to the other side
    /// this reverse all of the concerns about 'text above' or 'text below', or tons of other nonsense like that!

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

    this.drawCanvas = function(maxWidth, maxHeight, unit, wiggleRoom) {
        return this.circuit.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }

}
///i need to test if i can make diagonal elements... (2-26-19 it seems i can)
/// elements that point in all directions...that is a big goal of this code
/// my old code for electric circuit diagrams required me to explicitly specify directions of pieces
/// and then needed long if...then clauses to work, no more, direciton is determined automatically now


function freeBodyDiagram() {
    this.diagram = new diagram();
    this.forces = [];

    this.maxForce = 0;
    this.arrowheadAngle = 20; // in degrees
    this.circleRadius = 0;
    this.arrowheadLength = 0;

    /// i shoudl redo this so that you add forces, and then the
    // actual diagram is not drawn until you have added all the forces...
    // that would be better


    this.addForce = function(relativeMagnitude,angle,label) {
        if (this.maxForce < relativeMagnitude) {this.maxForce = relativeMagnitude;}
        var endPoint = [relativeMagnitude * Math.cos(convertDegreeToRadian(angle)), relativeMagnitude * Math.sin(convertDegreeToRadian(angle))]
        this.forces.push(
            {
                "relativeMagnitude": relativeMagnitude,
                "angle": angle,
                "label": label,
                "endPoint": endPoint
            }
        );
    };


    // i need to find a way to add labels to my forces!!!
    // and, to have multiple forces going the same direction!!!


    this.drawCanvas = function(maxWidth, maxHeight, unit, wiggleRoom) {
        this.circleRadius = this.maxForce * 0.1;
        this.arrowheadLength = this.maxForce * 0.05;
        this.forces.forEach((force) => {
            this.diagram.addArrow([0,0],force.endPoint,this.arrowheadLength,this.arrowheadAngle);
        });
        this.diagram.addCircle([0,0], this.circleRadius,true);
        return this.diagram.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }
}

function unitMap() {
    this.map = new diagram();
    this.pods = []; /// will need this later

    // only three hardwired parameters
    // i am not hardwiring the wiggle room, that is set above
    this.radius = 1;
    this.horizontalSpaceBetween = 1;
    this.verticalSpaceBetween = 1;


    var x, y;
    this.addPod = function(letter, verticalPosition, horizontalPosition) {
        this.pods.push(
            {
                "letter": letter,
                "verticalPosition": verticalPosition,
                "horizontalPosition": horizontalPosition
            }
        );
        x = horizontalPosition * (this.horizontalSpaceBetween + this.radius * 2);
        y = verticalPosition * (this.verticalSpaceBetween + this.radius * 2);

        this.map.addCircle([x,y],this.radius);
        this.map.addText(letter, [x,y], this.radius * 1.3);
    };

    this.drawCanvas = function(maxWidth, maxHeight, unit, wiggleRoom) {
        return this.map.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }
}
// why aren't the letter perfectly centered in the circle???