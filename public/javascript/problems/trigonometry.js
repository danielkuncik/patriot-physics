/*
TO DO:
- fix all of the looking for side functions to make them more like the new ones
- in the looking for angle functions, change 'rotate' to 'swap'
- add a rotation method that allows the triangles to rotate
- then...develop a random triangle problem generator???
- fix the angles that show up on the hypotenuse rather than the side

- revise constructTriangleSSS method to use true compass and ruler construction, rather than the law of sines
 */


function solveForHypotenuseProblem(leg1, leg2, swap) {
    let myTriangle = new GeometryPad();
    if (!swap) {
      myTriangle.addTriangleSAS(leg1,90,leg2);
    } else {
      myTriangle.addTriangleSAS(leg2,90,leg1);
    }
    myTriangle.addRightTriangleMarker();
    myTriangle.labelSideOfTriangle('A');
    myTriangle.labelSideOfTriangle('B');
    myTriangle.labelUnknownSideOfTriangle('C');
    return {
      problem: myTriangle,
      answer: myTriangle.triangles[0].sideLengthC
    }
}

function solveForLegProblem(knownLeg, hypotenuse, squareLength, swap) {
    let unknownLeg = Math.sqrt(hypotenuse**2 - knownLeg**2);
    /// i don't like how it creats the answer before creating the problem!!!
    let myTriangle = new GeometryPad();
    let answer;
    if (!swap) {
      myTriangle.addTriangleSSS(knownLeg, unknownLeg, hypotenuse);
      myTriangle.labelSideOfTriangle('A');
      myTriangle.labelUnknownSideOfTriangle('B');
      answer = myTriangle.triangles[0].sideLengthB;
    } else {
      myTriangle.addTriangleSSS(unknownLeg, knownLeg, hypotenuse);
      myTriangle.labelSideOfTriangle('B');
      myTriangle.labelUnknownSideOfTriangle('A');
      answer = myTriangle.triangles[0].sideLengthA;
    }
    myTriangle.addRightTriangleMarker(squareLength);
    myTriangle.labelSideOfTriangle('C');
    return {
      problem: myTriangle,
      answer: answer
    }
    return myTriangle
}

function randomPythagoreanTheoremProblem() {
  const pythagoreanTriple = randomPythagoreanTripleUnder100();
  let myTriangle = new GeometryPad();
  let answer;
  if (coinFlip()) {
    myTriangle.addTriangleSSS(pythagoreanTriple[0], pythagoreanTriple[1], pythagoreanTriple[2]);
  } else {
    myTriangle.addTriangleSSS(pythagoreanTriple[1], pythagoreanTriple[0], pythagoreanTriple[2]);
  }
  myTriangle.addRightTriangleMarker();
  if (coinFlip()) { // look for hypotenuse
    myTriangle.labelSideOfTriangle('A');
    myTriangle.labelSideOfTriangle('B');
    myTriangle.labelUnknownSideOfTriangle('C');
    answer = myTriangle.triangles[0].sideLengthC;
  } else {
    if (coinFlip()) {
      myTriangle.labelSideOfTriangle('A');
      myTriangle.labelUnknownSideOfTriangle('B');
      myTriangle.labelSideOfTriangle('C');
      answer = myTriangle.triangles[0].sideLengthB;
    } else {
      myTriangle.labelUnknownSideOfTriangle('A');
      myTriangle.labelSideOfTriangle('B');
      myTriangle.labelSideOfTriangle('C');
      answer = myTriangle.triangles[0].sideLengthA;
    }
  }
  return {
    problem: myTriangle,
    answer: answer
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

function sineProblem(legA,hypotenuse,knownAngle = 'A', fontSize, moveAngleLabelToKey) {
    const knownSide = 'C';
    const unknownSide = knownAngle;
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide, fontSize,moveAngleLabelToKey);
}
function cosineProblem(legA,hypotenuse,knownAngle = 'A', fontSize, moveAngleLabelToKey) {
    const knownSide = 'C';
    const unknownSide = selectTheOtherLeg(knownAngle);
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide, fontSize,moveAngleLabelToKey);
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
