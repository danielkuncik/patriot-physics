
function constantVelocityEquation(dimension, dimensionSubscript) {
  if (dimension === undefined) {
    dimension = 'x';
  }
  if (dimensionSubscript === undefined) {
    dimensionSubscript = false;
  }

  let constantVelocityEquation;

  if (dimensionSubscript) {
    constantVelocityEquation = `\\( \\Delta ${dimension} = v_{${dimension}} \\cdot \\Delta t \\)`;
  } else {
    constantVelocityEquation = `\\( \\Delta ${dimension} = v \\cdot \\Delta t \\)`;
  }

  return constantVelocityEquation
}


function kinematicEquations(dimension, dimensionSubscripts) {
  if (dimension === undefined) {
    dimension = 'x';
  }
  if (dimensionSubscripts === undefined) {
    dimensionSubscripts = false;
  }

  let kinematicEquation1, kinematicEquation2, kinematicEquation3, kinematicEquation4;

  if (dimensionSubscripts) {
    kinematicEquation1 =`\\( v_{${dimension}f} = v_{${dimension}y} + a_{${dimension}} \\cdot \\Delta t \\)`;
    kinematicEquation2 = `\\( \\Delta ${dimension} = v_{i${dimension}} \\cdot \\Delta t + \\frac{1}{2} a_{${dimension}} \\left( \\Delta t \\right)^2 \\)`;
    kinematicEquation3 = `\\( \\Delta ${dimension} = \\left( \\frac{v_{f${dimension}} + v_{i${dimension}}}{2} \\right) \\Delta t \\)`;
    kinematicEquation4 = `\\( v_{f${dimension}}^2 =v_{i${dimension}}^2 + 2 a \\cdot \\Delta ${dimension} \\)`;
  } else {
    kinematicEquation1 = '\\( v_f = v_i + a \\cdot \\Delta t \\)';
    kinematicEquation2 = `\\( \\Delta ${dimension} = v_i \\cdot \\Delta t + \\frac{1}{2} a \\left( \\Delta t \\right)^2 \\)`;
    kinematicEquation3 = `\\( \\Delta ${dimension} = \\left( \\frac{v_f + v_i}{2} \\right) \\Delta t \\)`;
    kinematicEquation4 = `\\( v_f^2 =v_i^2 + 2 a \\cdot \\Delta ${dimension} \\)`;
  }
  let finalArray = [
    kinematicEquation1,
    kinematicEquation2,
    kinematicEquation3,
    kinematicEquation4
  ];
  return finalArray
}

// basic forms
const definitionOfAcceleration = '\\( v_f = v_i + a \\cdot \\Delta t \\)';
const kingOfKinematicEquations = '\\( \\Delta x = v_i \\cdot t \\ + \\frac{1}{2} a \\left( \\Delta t \\right)^2 \\)';
const averageVelocityFormula = '\\( \\Delta x = \\left( \\frac{v_f + v_i}{2} \\right) \\Delta t \\)';
const noTimeEquation = '\\( v_f^2 = v_i^2 + 2 a \\cdot \\Delta x \\)';


function kinematicEquationsHtmlList(dimension, dimensionSubscripts) {
  let kinematicEquationArray = kinematicEquations(dimension, dimensionSubscripts);
  return makeHtmlListFromArray(kinematicEquationArray);
}
