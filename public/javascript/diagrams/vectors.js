function drawVector(magnitude, directionInDegrees, unit, referenceLine, sideOfReference, textAboveOrBelow) {
    if (referenceLine === undefined) {
        if (directionInDegrees > 0 && directionInDegrees <= 45) {
            referenceLine = '+X';
            sideOfReference = 'above';
        } else if (directionInDegrees > 45 && directionInDegrees <= 90) {
            referenceLine = '+Y';
            sideOfReference = 'right';
        } else if (directionInDegrees > 90 && directionInDegrees <= 135) {
            referenceLine = '+Y';
            sideOfReference = 'left';
        } else if (directionInDegrees > 135 && directionInDegrees <= 180) {
            referenceLine = '-X';
            sideOfReference = 'above';
        } else if (directionInDegrees > 180 && directionInDegrees <= 225) {
            referenceLine = '-X';
            sideOfReference = 'below';
        } else if (directionInDegrees > 225 && directionInDegrees <= 270) {
            referenceLine = '-Y';
            sideOfReference = 'left';
        } else if (directionInDegrees > 270 && directionInDegrees <= 315) {
            referenceLine = '-Y';
            sideOfReference = 'right';
        } else if (directionInDegrees > 315 && directionInDegrees <= 360) {
            referenceLine = '+X';
            sideOfReference = 'below';
        }
    }
    if (textAboveOrBelow === undefined) {
        textAboveOrBelow = 'above';
    }

    if (unit === undefined) {
        unit = '';
    }
    let label = String(magnitude) + ` ${unit}`;
    let degreeLabel;
    let angleReferenceEnd1, angleReferenceEnd2;
    if (referenceLine === '+X' && sideOfReference === 'above') {
        degreeLabel = directionInDegrees;
        angleReferenceEnd1 = 0;
        angleReferenceEnd2 = convertDegreesToRadians(directionInDegrees);
    } else if (referenceLine === '+X' && sideOfReference === 'below') {
        degreeLabel = 360 - directionInDegrees;
        angleReferenceEnd2 = 0;
        angleReferenceEnd1 = convertDegreesToRadians(directionInDegrees);
    } else if (referenceLine === '+Y' && sideOfReference === 'left') {
        degreeLabel = directionInDegrees - 90;
        angleReferenceEnd1 = convertDegreesToRadians(directionInDegrees);
        angleReferenceEnd2 = Math.PI / 2;
    } else if (referenceLine === '+Y' && sideOfReference === 'right') {
        degreeLabel = 90 - directionInDegrees;
        angleReferenceEnd1 = Math.PI / 2;
        angleReferenceEnd2 = convertDegreesToRadians(directionInDegrees);
    } else if (referenceLine === '-X' && sideOfReference === 'above') {
        degreeLabel = 180 - directionInDegrees;
        angleReferenceEnd1 = convertDegreesToRadians(directionInDegrees);
        angleReferenceEnd2 = Math.PI;
    } else if (referenceLine === '-X' && sideOfReference === 'below') {
        degreeLabel = directionInDegrees - 180;
        angleReferenceEnd1 = Math.PI;
        angleReferenceEnd2 = convertDegreesToRadians(directionInDegrees);
    } else if (referenceLine === '-Y' && sideOfReference === 'left') {
        degreeLabel = 270 - directionInDegrees;
        angleReferenceEnd1 = convertDegreesToRadians(directionInDegrees);
        angleReferenceEnd2 = Math.PI * 3 / 2;
    } else if (referenceLine === '-Y' && sideOfReference === 'right') {
        degreeLabel = directionInDegrees - 270;
        angleReferenceEnd1 = Math.PI * 3 / 2;
        angleReferenceEnd2 = convertDegreesToRadians(directionInDegrees);
    } else {
        degreeLabel = 0;
    }

    let myDiagram = new Diagram();
    let vectorEndPoint = constructPointWithMagnitude(magnitude, convertDegreesToRadians(directionInDegrees));
    let referenceLineEndPoint;
    let referenceLineMagnitude = magnitude * 0.5;
    if (referenceLine === '+X') {
        referenceLineEndPoint = constructPointWithMagnitude(referenceLineMagnitude, 0);
    } else if (referenceLine === '+Y') {
        referenceLineEndPoint = constructPointWithMagnitude(referenceLineMagnitude, Math.PI / 2);
    } else if (referenceLine === '-X') {
        referenceLineEndPoint = constructPointWithMagnitude(referenceLineMagnitude, Math.PI);
    } else if (referenceLine === '-Y') {
        referenceLineEndPoint = constructPointWithMagnitude(referenceLineMagnitude, Math.PI * 3 / 2);
    }

    myDiagram.addArrow(origin, vectorEndPoint);
    if (textAboveOrBelow === 'above') {
        myDiagram.labelLineAbove(origin, vectorEndPoint, label);
    } else if (textAboveOrBelow === 'below') {
        myDiagram.labelLineBelow(origin, vectorEndPoint, label);
    }
    myDiagram.addSegment(origin, referenceLineEndPoint);
    let fontProportion = 0.4;
    if (degreeLabel <= 20) {
        fontProportion = 0.3;
    }
    myDiagram.labelAngle(degreeLabel, vectorEndPoint, origin, referenceLineEndPoint, 'interior','B',true,fontProportion);
    return myDiagram
}


function plusSign() {
    let newDiagram = new Diagram();

    newDiagram.addSegment(new Point(-1,0),new Point(1,0));
    newDiagram.addSegment(new Point(0,-1),new Point(0,1));

    return newDiagram
}