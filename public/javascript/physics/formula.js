
class Formula {
  constructor(formulaString) {
    const this.string = formulaString;
    const array = formulaString.split(' ');

    const resultantVariableKey = array[0];
    if (!selectVariable[resultantVariableKey]) {
      console.log('error: first peice of formula must be varaible key');
      return false
    }
    if (!array[1] === '=') {
      console.log('error: formula must have equals sign following first variable');
      return false
    }
    if (!array.length % 2 === 1) {
      console.log('error: formula string must have odd number of elements');
    }
    const firstVariableKey = array[3];
    let this.operationsArray = [firstVariableKey];
    for (i = 3; i < array.length; i += 2) {
      let operation = array[i];
      let varaibleKey = array[i+1];
      this.operationsArray.push[operation,variableKey];
    }
  }

// need to think about what the argument is: a list of quantities?
// the argument needs to be a list of variable keys and objects
  operate(listOfQuantities) {
    let currentQuantity = findVariableInQuantityList(this.operationsArray[0]);
    let k;
    for (k = 1; k < this.operationsArray.length - 1; k++) {
      const operation = this.operationsArray[k][0];
      const nextQuantity = findVariableInQuantityList(this.operationsArray[k][1]);
      currentQuantity = runOperation(currentQuantity, operation, nextQuantity);
    }
    const lastOperation = this.operationsArray[this.operationsArray.length -][0]
    const lastQuantity = findVariableInQuantityList(this.operationsArray[this.operationsArray.length -][1]);
    return runOperation(currentQuantity, lastOperation, lastQuantity, this.resultantVariableKey)
}

/// WORKS ONLY WITH SCALARS FOR NOW!!!! need to expand to include vectors
function runOperation(firstQuantity, operation, secondQuantity, newVariableKey) {
  if (operation === '+' && !firstQuantity.vector && !secondQuantity.vector) {
    return = firstQuantity.addScalar(secondQuantity, newVariableKey)
  } else if (nextOperation === '-' && !firstQuantity.vector && !secondQuantity.vector) {
    return = firstQuantity.subtractScalar(secondQuantity, newVariableKey)
  } else if (nextOperation === '*' && !firstQuantity.vector && !secondQuantity.vector) {
    return = firstQuantity.multiplyScalar(secondQuantity, newVariableKey)
  } else if (nextOperation === '/' && !firstQuantity.vector && !secondQuantity.vector) {
    return = firstQuantity.divideScalar(secondQuantity, newVariableKey)
  }
}

let testFormula = new Formula("average_speed = distance / time_interval");
/// try creating a quantity list and running this!

/// make one step formulas first????
