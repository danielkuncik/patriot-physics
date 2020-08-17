/*
TO DO:
- fix all of the looking for side functions to make them more like the new ones
- in the looking for angle functions, change 'rotate' to 'swap'
- add a rotation method that allows the triangles to rotate
- then...develop a random triangle problem generator???
- fix the angles that show up on the hypotenuse rather than the side

- revise constructTriangleSSS method to use true compass and ruler construction, rather than the law of sines
 */


function solveForHypotenuseProblem(xLeg, yLeg, swapLegs, rotationInDegrees) {
    let myTrianglePad = new GeometryPad();
    let problem = new Problem();
    myTrianglePad.addRightTriangleTwoLegs(xLeg, yLeg, swapLegs);
    if (rotationInDegrees) {
      myTrianglePad.spinTriangle(rotationInDegrees);
    }
    myTrianglePad.labelSideOfTriangle('A');
    myTrianglePad.labelSideOfTriangle('B');
    problem.addAnswer(myTrianglePad.labelUnknownSideOfTriangle('C'),myTrianglePad.triangles[0].sideLengthC);
    problem.addDiagram(myTrianglePad);
    return problem
}

function solveForLegProblem(hypotenuse, knownLeg, swapLegs, rotationInDegrees) {
    let myTrianglePad = new GeometryPad();
    let problem = new Problem();
    myTrianglePad.addRightTriangleHypotenuseLeg(hypotenuse, knownLeg, swapLegs);
    myTrianglePad.labelSideOfTriangle('C');
    if (rotationInDegrees) {
      myTrianglePad.spinTriangle(rotationInDegrees);
    }
    if (!swapLegs) {
      myTrianglePad.labelSideOfTriangle('A');
      problem.addAnswer(myTrianglePad.labelUnknownSideOfTriangle('B'),myTrianglePad.triangles[0].sideLengthB);
    } else {
      myTrianglePad.labelSideOfTriangle('B');
      problem.addAnswer(myTrianglePad.labelUnknownSideOfTriangle('A'),myTrianglePad.triangles[0].sideLengthA);
    }
    problem.addDiagram(myTrianglePad);
    return problem
}

function randomPythagoreanTheoremProblem(probabilityOfRotation = 0) {
  const pythagoreanTriple = randomPythagoreanTripleUnder100();
  const rotation = weightedCoinFlip(probabilityOfRotation) ? randInt(0,360) : undefined;
  if (coinFlip()) {
    return solveForHypotenuseProblem(pythagoreanTriple[0], pythagoreanTriple[1], coinFlip(), rotation)
  } else {
    const knownLeg = coinFlip() ? pythagoreanTriple[0] : pythagoreanTriple[1];
    return solveForLegProblem(pythagoreanTriple[2],knownLeg, coinFlip(), rotation)
  }
}

//    $("#triangle1").append(SOHCAHTOAsideProblem(5,12,13,'A','C','A').drawCanvas(250));
function SOHCAHTOAsideProblem(legA, hypotenuse, knownAngle, knownSide, unknownSide, fontSize, moveAngleLabelToKey) {
    let myTriangle = new GeometryPad();
    if (fontSize) {
        myTriangle.setFontSize(fontSize);
    }
    myTriangle.addTriangleSSS(legA,Math.sqrt(hypotenuse**2 - legA**2), hypotenuse,true);
    myTriangle.addRightTriangleMarker();
    myTriangle.labelAngleOfTriangle(knownAngle,undefined,undefined,undefined, moveAngleLabelToKey);
    myTriangle.labelSideOfTriangle(knownSide);
    myTriangle.labelUnknownSideOfTriangle(unknownSide);
    return myTriangle
}

function selectTheOtherLeg(thisLeg) {
    if (thisLeg === 'A') {
        return 'B'
    } else if (thisLeg === 'B') {
        return 'A'
    }
}

/*
CHANGE NEEDED
CHANGE NEEDED
CHANGE NEEDED
CHANGE NEEDED
These functions creating automatic trigonometry problems are weird and should be changed
you should always enter the known information,
never the unknown information or irrelevant information!!!
 */

// SOLVING FOR SIDE PROBLEMS

function sideProblem(type, knownSide, knownAngle, swap) {
    let answer;
    let problem = new GeometryPad();

}

function sineProblem(hypotenuse,angleInDegrees,swapLegs) {
    let problem = new GeometryPad();
    problem.addRightTriangleHypotenuseAngle(hypotenuse, angleInDegrees, swapLegs);
    problem.labelSideOfTriangle('C');
    problem.addRightTriangleMarker();
    problem.labelAngleOfTriangle('B');
    const answer = problem.triangles[0].sideLengthB;
    return {
        problem: problem,
        answer: answer
    }
}
function cosineProblem(hypotenuse, angleInDegrees, swap) {
    let answer;
    let problem = new GeometryPad();
    if (!swap) {
        problem.addTriangleSAA(hypotenuse,angleInDegrees,90);
        problem.labelUnknownSideOfTriangle('A');
        problem.labelAngleOfTriangle('B');
        answer = problem.triangles[0].sideLengthA;
    } else {
        problem.addTriangleSAA(hypotenuse,90 - angleInDegrees, 90);
        problem.labelUnknownSideOfTriangle('A');
        problem.labelAngleOfTriangle('B');
        answer = problem.triangles[0].sideLengthA;
    }
    problem.labelSideOfTriangle('C');
    problem.addRightTriangleMarker();
    return {
        problem: problem,
        answer: answer
    }
}

function tangentProblem(legA,hypotenuse,knownAngle ='A', fontSize, moveAngleLabelToKey) {
    const knownSide = selectTheOtherLeg(knownAngle);
    const unknownSide = knownAngle;
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide, fontSize, moveAngleLabelToKey);
}
function secantProblem(legA,hypotenuse,knownAngle = 'A', fontSize, moveAngleLabelToKey) { // reciprocal of cosine
    const knownSide = selectTheOtherLeg(knownAngle);
    const unknownSide = 'C';
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide, fontSize, moveAngleLabelToKey);
}

function cosecantProblem(legA,hypotenuse,knownAngle ='A', fontSize, moveAngleLabelToKey) { // reciprocal of sine
    const knownSide = knownAngle;
    const unknownSide = 'C';
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide, fontSize, moveAngleLabelToKey);
}

function cotangentProblem(legA,hypotenuse,knownAngle ='A', fontSize, moveAngleLabelToKey) { //reciprocal of tangent
    const knownSide = knownAngle;
    const unknownSide = selectTheOtherLeg(knownAngle);
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide, fontSize, moveAngleLabelToKey);
}

function inverseSineProblem(opposite, hypotenuse, unknownAngle = 'A', fontSize) {
    const adjacent = Math.sqrt(hypotenuse**2 - opposite**2);

}

function inverseCosineProblem(adjacent, hypotenuse, unknownAngle = 'A', fontSize) {
    const opposite = Math.sqrt(hypotenuse**2 - adjacent**2);
}


function inverseTangentProblem(opposite, adjacent, unknownAngle = 'A', fontSize) {
    let triangle = new GeometryPad();
    if (unknownAngle === 'A') {
        triangle.addTriangleSAS(opposite,90,adjacent);
        triangle.labelAngleOfTriangle('A','θ');

    } else if (unknownAngle === 'B') {
        triangle.addTriangleSAS(adjacent,90,opposite);
        triangle.labelAngleOfTriangle('B','θ');

    }
    triangle.addRightTriangleMarker();
    triangle.labelSideOfTriangle('A');
    triangle.labelSideOfTriangle('B');
    return triangle
}

function inverseSineProblem(opposite, hypotenuse, unknownAngle = 'A', fontSize) {
    let triangle = new GeometryPad();
    if (unknownAngle === 'A') {
        triangle.addTriangleSSS(opposite,Math.sqrt(hypotenuse**2 - opposite**2), hypotenuse);
        triangle.labelAngleOfTriangle('A','θ');
        triangle.labelSideOfTriangle('A');
    } else if (unknownAngle === 'B') {
        triangle.addTriangleSSS(Math.sqrt(hypotenuse**2 - opposite**2), opposite, hypotenuse);
        triangle.labelAngleOfTriangle('B','θ');
        triangle.labelSideOfTriangle('B');
    }
    triangle.addRightTriangleMarker();
    triangle.labelSideOfTriangle('C');
    return triangle
}


function inverseCosineProblem(adjacent, hypotenuse, unknownAngle = 'A', fontSize) {
    let triangle = new GeometryPad();
    if (unknownAngle === 'A') {
        triangle.addTriangleSSS(Math.sqrt(hypotenuse**2 - adjacent**2), adjacent, hypotenuse);
        triangle.labelAngleOfTriangle('A','θ');
        triangle.labelSideOfTriangle('A');
    } else if (unknownAngle === 'B') {
        triangle.addTriangleSSS(adjacent,Math.sqrt(hypotenuse**2 - adjacent**2), hypotenuse);
        triangle.labelAngleOfTriangle('B','θ');
        triangle.labelSideOfTriangle('B');
    }
    triangle.addRightTriangleMarker();
    triangle.labelSideOfTriangle('C');
    return triangle
}

// these functions generate problems in which the entire problem is this

function unknownRightTriangle1(leg1, leg2, swap) { // two legs known
    let problemTriangle = new GeometryPad();
    let answerTriangle = new GeometryPad();
    if (swap) {
        problemTriangle.addTriangleSSS(leg2, leg1, Math.sqrt(leg1**2 + leg2**2));
        answerTriangle.addTriangleSSS(leg2, leg1, Math.sqrt(leg1**2 + leg2**2));
    } else {
        problemTriangle.addTriangleSSS(leg1, leg2, Math.sqrt(leg1**2 + leg2**2));
        answerTriangle.addTriangleSSS(leg2, leg1, Math.sqrt(leg1**2 + leg2**2));
    }
    problemTriangle.addRightTriangleMarker();
    problemTriangle.labelAngleOfTriangle('A','??');
    problemTriangle.labelAngleOfTriangle('B','??');
    problemTriangle.labelSideOfTriangle('A');
    problemTriangle.labelSideOfTriangle('B');
    problemTriangle.labelSideOfTriangle('C','??');
    answerTriangle.showAllTriangleInformation();
    return {
        problem: problemTriangle,
        answer: answerTriangle
    }
}


/// CHECK THAT THE KNOWN INFORMATION IS THE INFORMATION PRESENTED!!!!!
function unknownRightTriangle2(leg1, hypotenuse, swap) { // one leg and hypotenuse known
    let problemTriangle = new GeometryPad();
    let answerTriangle = new GeometryPad();
    if (swap) {
        problemTriangle.addTriangleSSS(Math.sqrt(hypotenuse**2 - leg1**2),leg1,hypotenuse);
        answerTriangle.addTriangleSSS(Math.sqrt(hypotenuse**2 - leg1**2),leg1,hypotenuse);
        problemTriangle.labelSideOfTriangle('A','??');
        problemTriangle.labelSideOfTriangle('B');
    } else {
        problemTriangle.addTriangleSSS(leg1,Math.sqrt(hypotenuse**2 - leg1**2),hypotenuse);
        answerTriangle.addTriangleSSS(leg1,Math.sqrt(hypotenuse**2 - leg1**2),hypotenuse);
        problemTriangle.labelSideOfTriangle('B','??');
        problemTriangle.labelSideOfTriangle('A');
    }
    problemTriangle.labelSideOfTriangle('C');
    problemTriangle.addRightTriangleMarker();
    problemTriangle.labelAngleOfTriangle('A','??');
    problemTriangle.labelAngleOfTriangle('B','??');
    answerTriangle.showAllTriangleInformation();
    return {
        problem: problemTriangle,
        answer: answerTriangle
    }
}

function unknownRightTriangle3(leg, angle, swap) { ///if swap, the opposite angle becomes the known information!
    let problemTriangle = new GeometryPad();
    let answerTriangle = new GeometryPad();
    if (swap) {
        problemTriangle.addTriangleASA(angle, leg, 90);
        answerTriangle.addTriangleASA(angle, leg, 90);
        problemTriangle.labelAngleOfTriangle('A');
        problemTriangle.labelAngleOfTriangle('B','??');
        problemTriangle.labelSideOfTriangle('A');
        problemTriangle.labelSideOfTriangle('B','??');
    } else {
        problemTriangle.addTriangleASA(90, leg, angle);
        answerTriangle.addTriangleASA(90, leg, angle);
        problemTriangle.labelAngleOfTriangle('A');
        problemTriangle.labelAngleOfTriangle('B','??');
        problemTriangle.labelSideOfTriangle('B');
        problemTriangle.labelSideOfTriangle('A','??');
    }
    problemTriangle.addRightTriangleMarker();
    problemTriangle.labelSideOfTriangle('C','??');
    answerTriangle.showAllTriangleInformation();
    return {
        problem: problemTriangle,
        answer: answerTriangle
    }
}

function unknownRightTriangle4(angle, hypotenuse, swap) {
    let problemTriangle = new GeometryPad();
    let answerTriangle = new GeometryPad();

    if (swap) {
        problemTriangle.addTriangleSAA(hypotenuse, angle, 90);
        answerTriangle.addTriangleSAA(hypotenuse, angle, 90);
        problemTriangle.labelAngleOfTriangle('B');
        problemTriangle.labelAngleOfTriangle('A','??');
    } else {
        problemTriangle.addTriangleSAA(hypotenuse, angle, 90);
        answerTriangle.addTriangleSAA(hypotenuse, angle,90);
        problemTriangle.labelAngleOfTriangle('A');
        problemTriangle.labelAngleOfTriangle('B','??');
    }
    problemTriangle.addRightTriangleMarker();
    problemTriangle.labelSideOfTriangle('C');
    problemTriangle.labelSideOfTriangle('A','??');
    problemTriangle.labelSideOfTriangle('B','??');
    answerTriangle.showAllTriangleInformation();
    return {
        problem: problemTriangle,
        answer: answerTriangle
    }
}
