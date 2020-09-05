/*
TO DO:
- fix all of the looking for side functions to make them more like the new ones
- in the looking for angle functions, change 'rotate' to 'swap'
- add a rotation method that allows the triangles to rotate
- then...develop a random triangle problem generator???
- fix the angles that show up on the hypotenuse rather than the side

- revise constructTriangleSSS method to use true compass and ruler construction, rather than the law of sines
 */


//##########################################################
// Pythagorean Theorem Problems

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


//##########################################################
// SOHCAHTOA: solving for side
// SOLVING FOR SIDE PROBLEMS

function SOHCAHTOAproblem(triangleObject, knownSide, knownAngle, unknownSide) {
    let trianglePad = new GeometryPad;
    let problem = new Problem;
    trianglePad.addTriangleObject(triangleObject);
    trianglePad.labelSideOfTriangle(knownSide);
    trianglePad.labelAngleOfTriangle(knownAngle);
    problem.addAnswer(trianglePad.labelUnknownSideOfTriangle(unknownSide),trianglePad.triangles[0].getSideLength(unknownSide));
    problem.addDiagram(trianglePad);
    return problem
}

function sineProblem(hypotenuse,angleInDegrees,swapLegs) {
    let myTriangle = constructRightTriangleHypotenuseAngleF(hypotenuse, angleInDegrees, swapLegs);
    if (swapLegs) {
      return SOHCAHTOAproblem(myTriangle, 'C','B','B');
    } else {
      return SOHCAHTOAproblem(myTriangle, 'C','A','A');
    }
}


function cosineProblem(hypotenuse, angleInDegrees, swapLegs) {
  let myTriangle = constructRightTriangleHypotenuseAngleF(hypotenuse, angleInDegrees, swapLegs);
  if (swapLegs) {
    return SOHCAHTOAproblem(myTriangle, 'C','B','A');
  } else {
    return SOHCAHTOAproblem(myTriangle, 'C','A','B');
  }
}

function tangentProblem(adjacent, angleInDegrees, swapLegs) {
  let myTriangle = constructRightTriangleTwoLegsF(adjacent, adjacent * Math.tan(convertDegreesToRadians(angleInDegrees)), swapLegs);
  if (swapLegs) {
    return SOHCAHTOAproblem(myTriangle, 'A', 'B', 'B');
  } else {
    return SOHCAHTOAproblem(myTriangle, 'B', 'A', 'A');
  }
}


function secantProblem(adjacent, angleInDegrees, swapLegs) { // reciprocal of cosine
  let myTriangle = constructRightTriangleHypotenuseAngleF(adjacent / Math.cos(convertDegreesToRadians(angleInDegrees)), angleInDegrees, swapLegs);
  if (swapLegs) {
    return SOHCAHTOAproblem(myTriangle, 'A', 'B', 'C');
  } else {
    return SOHCAHTOAproblem(myTriangle, 'B', 'A', 'C');
  }
}

function cosecantProblem(opposite, angleInDegrees, swapLegs) { // reciprocal of sine
  let myTriangle = constructRightTriangleHypotenuseAngleF(opposite / Math.sin(convertDegreesToRadians(angleInDegrees)), angleInDegrees, swapLegs);
  if (swapLegs) {
    return SOHCAHTOAproblem(myTriangle, 'B', 'B', 'C');
  } else {
    return SOHCAHTOAproblem(myTriangle, 'A', 'A', 'C');
  }
}

function cotangentProblem(opposite, angleInDegrees, swapLegs) { //reciprocal of tangent
  let myTriangle = constructRightTriangleTwoLegsF(opposite / Math.tan(convertDegreesToRadians(angleInDegrees)), opposite, swapLegs);
  if (swapLegs) {
    return SOHCAHTOAproblem(myTriangle, 'B', 'B', 'A');
  } else {
    return SOHCAHTOAproblem(myTriangle, 'A', 'A', 'B');
  }
}


function randomSOHCAHTOAProblem(simpleOnly) {
    let probType = simpleOnly ? randInt(1,3) : randInt(1,6);
    let triangleObject, swapLegs = coinFlip();
    if (swapLegs) {probType *= -1;}
    if (coinFlip()) {
        const sides = randomPythagoreanTripleUnder100();
        triangleObject = constructRightTriangleTwoLegsF(sides[0], sides[1], swapLegs);
    } else {
        const angles = randomComplementaryAngles();
        const angleA = coinFlip() ? angles[0] : angles[1];
        const hypotenuse = randInt(1,100);
        triangleObject = constructRightTriangleHypotenuseAngleF(hypotenuse, angleA, swapLegs);
    }
    let knownSide, knownAngle, unknownSide;
    switch (probType) {
        case 1: // sine
            knownSide = 'C';
            knownAngle = 'A';
            unknownSide = 'A';
            break;
        case -1:
            knownSide = 'C';
            knownAngle = 'B';
            unknownSide = 'B';
            break;
        case 2: // cosine
            knownSide = 'C';
            knownAngle = 'A';
            unknownSide = 'B';
            break;
        case -2:
            knownSide = 'C';
            knownAngle = 'B';
            unknownSide = 'A';
            break;
        case 3: // tangent
            knownSide = 'B';
            knownAngle = 'A';
            unknownSide = 'A';
            break;
        case -3:
            knownSide = 'A';
            knownAngle = 'B';
            unknownSide = 'B';
            break;
        case 4:  // secant
            knownSide = 'B';
            knownAngle = 'A';
            unknownSide = 'C';
            break;
        case -4:
            knownSide = 'A';
            knownAngle = 'B';
            unknownSide = 'C';
            break;
        case 5: // cosecant
            knownSide = 'A';
            knownAngle = 'A';
            unknownSide = 'C';
            break;
        case -5:
            knownSide = 'B';
            knownAngle = 'B';
            unknownSide = 'C';
            break;
        case 6: // cotangent
            knownSide = 'A';
            knownAngle = 'A';
            unknownSide = 'B';
            break;
        case -6:
            knownSide = 'B';
            knownAngle = 'B';
            unknownSide = 'A';
            break;
        default:
            break;
    }
    return SOHCAHTOAproblem(triangleObject, knownSide, knownAngle, unknownSide);
}

/// ############################################################
/// angle probelms: know two sides and solve for an angle



function inverseTangentProblem(opposite, adjacent, swapLegs) {
    let myTrianglePad = new GeometryPad();
    let problem = new Problem();
    myTrianglePad.addRightTriangleTwoLegs(opposite, adjacent, swapLegs);
    myTrianglePad.labelSideOfTriangle('A');
    myTrianglePad.labelSideOfTriangle('B');
    let unknownAngle = swapLegs ? 'B' : 'A';
    let answer = swapLegs ? myTrianglePad.triangles[0].angleB : myTrianglePad.triangles[0].angleA;
    myTrianglePad.labelUnknownAngleOfTriangle(unknownAngle);
    problem.addAnswer('θ', answer);
    problem.addDiagram(myTrianglePad);
    return problem
}

function inverseSineProblem(opposite, hypotenuse, swapLegs) {
    let myTrianglePad = new GeometryPad();
    let problem = new Problem();
    myTrianglePad.addRightTriangleHypotenuseLeg(hypotenuse, opposite, swapLegs);
    myTrianglePad.labelSideOfTriangle('C');
    let unknownAngle = swapLegs ? 'B' : 'A';
    let knownSide = unknownAngle;
    let answer = swapLegs ? myTrianglePad.triangles[0].angleB : myTrianglePad.triangles[0].angleA;
    myTrianglePad.labelUnknownAngleOfTriangle(unknownAngle);
    myTrianglePad.labelSideOfTriangle(knownSide);
    problem.addAnswer('θ', answer);
    problem.addDiagram(myTrianglePad);
    return problem
}


function inverseCosineProblem(adjacent, hypotenuse, swapLegs) {
    let myTrianglePad = new GeometryPad();
    let problem = new Problem();
    myTrianglePad.addRightTriangleHypotenuseLeg(hypotenuse, adjacent, swapLegs);
    myTrianglePad.labelSideOfTriangle('C');
    let unknownAngle = swapLegs ? 'B' : 'A';
    let knownSide = swapLegs ? 'A' : 'B';
    let answer = swapLegs ? myTrianglePad.triangles[0].angleB : myTrianglePad.triangles[0].angleA;
    myTrianglePad.labelUnknownAngleOfTriangle(unknownAngle);
    myTrianglePad.labelSideOfTriangle(knownSide);
    problem.addAnswer('θ', answer);
    problem.addDiagram(myTrianglePad);
    return problem
}

//##########################################################
// Unknown triangle problems: knowing minimum information, solve for all unknown information abotua  triangle


function unknownRightTriangleLegLeg(leg1, leg2, swap) { // two legs known
    let problemTrianglePad = new GeometryPad();
    let answerTrianglePad = new GeometryPad();
    let problem = new Problem();

    let myTriangle = constructRightTriangleTwoLegsF(leg1, leg2, swap);

    problemTrianglePad.addTriangleObject(myTriangle);
    answerTrianglePad.addTriangleObject(myTriangle);

    problemTrianglePad.labelSideOfTriangle('A');
    problemTrianglePad.labelSideOfTriangle('B');

    answerTrianglePad.labelSideOfTriangle('A');
    answerTrianglePad.labelSideOfTriangle('B');

    let var1 = problemTrianglePad.labelUnknownSideOfTriangle('C');
    answerTrianglePad.labelSideOfTriangle('C');
    problem.addAnswer(var1, myTriangle.getSideLength('C'));

    let var2 = problemTrianglePad.labelUnknownAngleOfTriangle('A');
    answerTrianglePad.labelAngleOfTriangle('A');
    problem.addAnswer(var2, myTriangle.getAngle('A'));

    let var3 = problemTrianglePad.labelUnknownAngleOfTriangle('B');
    answerTrianglePad.labelAngleOfTriangle('B');
    problem.addAnswer(var3, myTriangle.getAngle('B'));

    problem.addDiagram(problemTrianglePad);
    problem.addAnswer('diagram',answerTrianglePad);

    return problem

/*
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
    */
}


/// CHECK THAT THE KNOWN INFORMATION IS THE INFORMATION PRESENTED!!!!!
function unknownRightTriangleHypotenuseLeg(hypotenuse, leg, swap) { // one leg and hypotenuse known
  let problemTrianglePad = new GeometryPad();
  let answerTrianglePad = new GeometryPad();
  let problem = new Problem();

  let myTriangle = constructRightTriangleHypotenuseLegF(hypotenuse, leg, swap);

  problemTrianglePad.addTriangleObject(myTriangle);
  answerTrianglePad.addTriangleObject(myTriangle);

  let knownSide = swap ? 'B' : 'A';
  let unknownSide = swap ? 'A' : 'B';

  problemTrianglePad.labelSideOfTriangle(knownSide);
  answerTrianglePad.labelSideOfTriangle(unknownSide);

  let var1 = problemTrianglePad.labelUnknownSideOfTriangle(unknownSide);
  answerTrianglePad.labelSideOfTriangle(unknownSide);
  problem.addAnswer(var1, myTriangle.getSideLength(unknownSide));

  problemTrianglePad.labelSideOfTriangle('C'); // hypotenuse known
  answerTrianglePad.labelSideOfTriangle('C');

  let var2 = problemTrianglePad.labelUnknownAngleOfTriangle('A');
  answerTrianglePad.labelAngleOfTriangle('A');
  problem.addAnswer(var2, myTriangle.getAngle('A'));

  let var3 = problemTrianglePad.labelUnknownAngleOfTriangle('B');
  answerTrianglePad.labelAngleOfTriangle('B');
  problem.addAnswer(var3, myTriangle.getAngle('B'));

  problem.addDiagram(problemTrianglePad);
  problem.addAnswer('diagram',answerTrianglePad);

  return problem


  /*  let problemTriangle = new GeometryPad();
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
    */
}

function unknownRightTriangleHypotenuseAngle(hypotenuse, angle, swap) {

  let problemTrianglePad = new GeometryPad();
  let answerTrianglePad = new GeometryPad();
  let problem = new Problem();

  let myTriangle = constructRightTriangleHypotenuseAngleF(hypotenuse, angle, swap);

  let unknownAngle = swap ? 'B' : 'A';
  let knownAngle = swap ? 'A': 'B';

  problemTrianglePad.addTriangleObject(myTriangle);
  answerTrianglePad.addTriangleObject(myTriangle);

  let var1 = problemTrianglePad.labelUnknownSideOfTriangle('A'); // reverse these if swap???
  let var2 = problemTrianglePad.labelUnknownSideOfTriangle('B');
  answerTrianglePad.labelSideOfTriangle('A');
  answerTrianglePad.labelSideOfTriangle('B');
  problem.addAnswer(var1, myTriangle.getSideLength('A'));
  problem.addAnswer(var2, myTriangle.getSideLength('B'));

  problemTrianglePad.labelSideOfTriangle('C');
  answerTrianglePad.labelSideOfTriangle('C');

  problemTrianglePad.labelAngleOfTriangle(knownAngle);
  answerTrianglePad.labelAngleOfTriangle(knownAngle);


  let var3 = problemTrianglePad.labelUnknownAngleOfTriangle(unknownAngle);
  answerTrianglePad.labelAngleOfTriangle(unknownAngle);
  problem.addAnswer(var3, myTriangle.getAngle(unknownAngle));

  problem.addDiagram(problemTrianglePad);
  problem.addAnswer('diagram',answerTrianglePad);

  return problem


    /*let problemTriangle = new GeometryPad();
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
    }*/
}


function unknownRightTriangleLegAngle(leg, angle, swap) { ///if swap, the opposite angle becomes the known information!

  let problemTrianglePad = new GeometryPad();
  let answerTrianglePad = new GeometryPad();
  let problem = new Problem();

  let myTriangle = constructRightTriangleLegAngleF(leg, angle, swap);

  let unknownAngle = swap ? 'B' : 'A';
  let knownAngle = swap ? 'A': 'B';

  let unknownSide = swap ? 'B' : 'A'; // is there more than one option here, should I have multiple swaps of legs and angles???
  let knownSide = swap ? 'A': 'B';

  problemTrianglePad.addTriangleObject(myTriangle);
  answerTrianglePad.addTriangleObject(myTriangle);

  problemTrianglePad.labelSideOfTriangle(knownSide);
  answerTrianglePad.labelSideOfTriangle(knownSide);

  let var1 = problemTrianglePad.labelUnknownSideOfTriangle(unknownSide); // reverse these if swap???
  answerTrianglePad.labelSideOfTriangle(unknownSide);
  problem.addAnswer(var1, myTriangle.getSideLength(unknownSide));

  let var2 = problemTrianglePad.labelUnknownSideOfTriangle('C');
  answerTrianglePad.labelSideOfTriangle('C');
  problem.addAnswer(var2, myTriangle.getSideLength('C'));

  problemTrianglePad.labelAngleOfTriangle(knownAngle);
  answerTrianglePad.labelAngleOfTriangle(knownAngle);

  let var3 = problemTrianglePad.labelUnknownAngleOfTriangle(unknownAngle);
  answerTrianglePad.labelAngleOfTriangle(unknownAngle);
  problem.addAnswer(var3, myTriangle.getAngle(unknownAngle));

  problem.addDiagram(problemTrianglePad);
  problem.addAnswer('diagram',answerTrianglePad);

  return problem

  /*  let problemTriangle = new GeometryPad();
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
    } */
}
