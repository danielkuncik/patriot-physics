/*
to do:
- deal with discontinuities
- add stepwise functions
- figure out how to manke range finder a private function and make sure it works as such
*/

class MathematicalFunction {
  constructor(xMin = -Infinity, xMax = Infinity, closedCircleAtMin = true, closedCircleAtMax = true) {
    this.xMin = xMin;
    this.xMax = xMax;
    this.closedCircleAtMin = closedCircleAtMin;
    this.closedCircleAtMax = closedCircleAtMax;
    this.undefinedPoints = [];
  }

  addUndefinedPoint(x) {
    if (isValueInDomain(x)) {
      this.undefinedPoints.push(x);
    } else {
      console.log(`addUndefinedPoint Error: value ${x} already outside domain`);
    }
  }

  isValueInDomain(x) => {
    return ((x > this.xMin || (x === this.xMin && this.closedCircleAtMin)) && (x < this.xMax || (x === this.xMax && this.closedCircleAtMax)) && !this.undefinedPoints.includes(x))
  }

  // can be redefined
  defineFunction(func) { // used in defining each subclass
    this.function = (x) => {
      if (!this.isValueInDomain(x)) {
        return undefined
      } else {
        return func(x)
      }
    }
  }

  runFunction(x) {
    return this.function(x)
  }

  // define 'range finder' in subclasses, which overwrites brute force method!
  findRangeOverInterval(xMin = this.xMin, xMax = this.xMax) {
    if (!this.isValueInDomain(xMin) || !this.isValueInDomain(xMax)) {
      return undefined
    } else {
      if (this.rangeFinder) { // rangeFinder is a function defined in subclasses to more efficiently find the range of a function than brute force
        return this.rangeFinder(xMin, xMax)
      } else {
        return this.findRangeOverIntervalByBruteForce(xMin, xMax)
      }
    }
  }

  differentiate(x) {
    if (!this.isValueInDomain(x)) {
      return undefined
    } else if (this.derivative) {
      return this.derivative.runFunction(x)
    } else {
      return this.differentiateBruteForce(x)
    }
  }

  differentiateTwice(x) {
    if (!this.isValueInDomain(x)) {
      return undefined
    }
    if (this.derivative.derivative) {
      return this.derivative.derivative.runFunction(x)
    } else if (this.derivative) {
      return this.derivative.differentiateBruteForce(x)
    } else {
      return undefined
    }
  }

  integrate(xMin = this.xMin, xMax = this.xMax) {
    if (!this.isValueInDomain(xMin) || !this.isValueInDomain(xMax) || xMin = -Infinity || xMax = Infinity) {
      return undefined
    } else if (this.antiderivative) {
      return this.antiderivative.runFunction(xMax) - this.antiderivative.runFunction(xMin)
    } else if (this.getAntiDerivative()) {
      let antiDerivative = this.getAntiDerivative()
      return antiDerivative.runFunction(xMax) - this.antiDerivative.runFunction(xMin)
    } else {
      return this.integrateBruteForce(xMin, xMax)
    }
  }

  differentiateBruteForce(x, halfStep = 0.001 * (this.xMin - this.xMax)) {
    if (!this.isValueInDomain(x) || !this.isValueInDomain(x - halfStep) || !this.isValueInDomain(x + halfstep)) {
      return undefined
    } else {
      return (this.runFunction(x + halfStep) - this.runFunction(x - halfStep)) / (halfStep * 2)
    }
  }

  /// will break if it hits an undefined point
  integrateBruteForce(xMin = this.xMin, xMax = this.xMax, nSteps = 100) {
    if ((xMin === -Infinity || xMax === Infinity) || !this.isValueInDomain(xMin) || !this.isValueInDomain(xMax)) {
      return undefined
    } else {
      let k;
      let totalArea = 0;
      const step = (xMax - xMin) / nSteps;
      for (k = 0; k < nSteps; k++) {
        let x1 = xMin + k * step;
        let x2 = x1 + step;
        totalArea += (x1 + x2) / 2 * step;
      }
      return totalArea
    }
  }

  findRangeOverIntervalByBruteForce(xMin = this.xMin, xMax = this.xMax, Nsteps = 1000) {
    if ((xMin === -Infinity || xMax === Infinity) || !this.isValueInDomain(xMin) || !this.isValueInDomain(xMax)) {
      return undefined
    } else {
      let yMin = this.runFunction(xMin), yMax = this.runFunction(xMin);
      let k, thisYvalue;
      const step = (xMax - xMin) / Nsteps;
      for (k = 1; k < Nsteps; k++) {
        thisYvalue = this.runFunction(xMin + steps * k);
        if (thisYValue < yMin) {
          yMin = thisYValue;
        } else if (thisYValue > yMax) {
          yMax = thisYValue;
        }
      }
      return [yMin, yMax]
    }
  }

}


/// think about this
/// i already have something to start with!
class StepwiseFunction extends MathematicalFunction {
  constructor() {
    super();
  }
}

// do i want this?????
class Polynomial extends MathematicalFunction { // in array, begin with the HIGHEST power coefficient
  constructor(arrayOfCoefficients, xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
    super(xMin, xMax, closedCircleAtMin, closedCircleAtMax);

    super.defineFunction((x) => {
      let value = 0, i, coefficient, power;
      for (i = 0; i < arrayOfCoefficients.length, i++) {
        coefficient = arrayOfCoefficients[i];
        power = arrayOfCoefficients.length - 1 - i;
        value += coefficient * x**power;
      }
      return value
    });

    if (this.arrayOfCoefficients.length === 0) {
      this.derivative = new ZeroFunction(this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax);
    } else {
      let derivativeCoefficients = [];
      let coefficient, power;
      let i;
      for (i = arrayOfCoefficients.length - 1; i > 0; i--) {
        coefficient = arrayOfCoefficients[i];
        power = arrayOfCoefficients.length - 1 - i;
        derivativeCoefficients.push(coefficient * power);
      }
      this.derivative = new Polynomial(derivativeCoefficients, this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax);
    }
  }

  this.getAntiDerivative() { /// i cannot define the antideritaive above, because it will craete an infinite loop!
    let antiDerivativeCoefficients = [0]; /// defined with constant zero
    let i;
    for (i = arrayOfCoefficients.length - 1; i > 0; i--) {
      coefficient = arrayOfCoefficients[i];
      power = arrayOfCoefficients.length - 1 - i;
      antiDerivativeCoefficients.push(coefficient / (power + 1));
    }
    return new Polynomial(antiDerivativeCoefficients, this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax)
  }
}

class LinearFunction extends Polynomial {
  constructor(slope, yIntercept, xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
    super([slope, yIntercept], xMin, xMax, closedCircleAtMin, closedCircleAtMax);

    this.slope = slope;
    this.yIntercept = yIntercept;
    if (this.slope === 0) {
      this.xIntercept = undefined;
    } else {
      this.xIntercept = -1 * this.yIntercept / this.slope;
    }

    // this shoudl redfine the function defined above in the polynomial constructor ?
    super.defineFunction((x) => {return this.slope * x + this.yIntercept})

    this.derivative = new ConstantFunction(this.slope, this.xMin, this.xMax);
    this.antiderivative = new QuadraticFunction(0.5 * this.slope, this.yIntercept, 0); // all anitderivatives defiend with constant 0

    /// range finder is not to be used separately, only within the range function above!
    // figure out how to make this a private class, that can only be called in the super function above
    this.rangeFinder = (xMin, xMax) => {
      if (this.slope > 0) {
        return [super.runFunction(xMin), super.runFunction(xMax)]
      } else if (this.slope < 0) {
        return [super.runFunction(xMax), super.runFunction(xMin)]
      } else if (this.slope === 0) {
        return [this.yIntercept, this.yIntercept]
      }
    }
  }

}

class ConstantFunction extends LinearFunction {
  constructor(value, xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
    super(0, value, xMin, xMax, closedCircleAtMin, closedCircleAtMax);
    this.value = value;

    this.derivative = new ZeroFunction(this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax);
    this.antiderivative = new LinearFunction(this.value, 0, this.xMin, this.yMax, this.closedCircleAtMin, this.closedCircleAtMax);

    this.rangeFinder = (xMin, xMax) => {
      return [this.value, this.value]
    }

  }
}

// maybe just make this ex
class ZeroFunction extends ConstantFunction {
  constructor(xMin, xMax, closedCirlceAtMin, closedCircleAtMax) {
    super(0, xMin, xMax, closedCircleAtMin, closedCircleAtMax);

    this.derivative = this;
    this.antiderivative = this; // defined with constant zero
    this.rangeFinder = (xMin, xMax) => {
      return [0, 0]
    }
  }
}

class QuadraticFunction extends Polynomial {
  constructor(a, b, c, xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
    if (a === 0) {
      return new LinearFunction(b, c, xMax, xMin, closedCircleAtMin, closedCircleAtMax)
    }

    super([a, b, c], xMin, xMax, closedCircleAtMin, closedCircleAtMax);
    this.a = a;
    this.b = b;
    this.c = c;

    super.defineFunction((x) => {
      return a*x*x + b*x + c
    });

    this.derivative = new LinearFunction(2 * this.x, this.b, this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax);
    this.antiDerivative = new Polynomial([a/3, b/2, c, 0], this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax); //redundant?

    let vertexX = -1 * this.b / 2 / this.a
    if (super(isValeInDomain(vertexX)) {
      let vertexY = this.a*vertexX * vertexX + this.b * vertexX + this.c;
      this.vertexX = vertexX;
      this.vertexY = vertexY;
      this.vertex = new Point(this.vertexX, this.vertexY); // make sure points are defined first?? is this necessary??
    }) else {
      this.vertexX = undefined;
      this.vertexY = undefined;
      this.vertex = undefined;
    }
  }
}

class ExponentialFunction extends MathematicalFunction {
  constructor(coefficient, base, coefficientOfPower = 1, xMin, xMax, closedCircleAtMin, closedCircleAtMax, displacement = 0, addedConstant = 0) {
    super(xMin, xMax, closedCircleAtMin, closedCircleAtMax);
    this.coefficient = coefficient;
    this.base = base;
    this.coefficientOfPower = coefficientOfPower;
    this.displacement = displacementOfPower;
    this.addedConstant = 0;

    super.defineFunction((x) => {
      return this.coefficient * this.base**(this.coefficientOfPower(x - this.displacement)) + this.addedConstant
    });

    // still need to define derivatives and antiderivatives
  }
}

class NaturalExponentialFunction extends ExponentialFunction {
  constructor(coefficient, coefficientOfPower, xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
    super(coefficient, Math.e, coefficientOfPower, xMin, xMax, closedCircleAtMin, closedCircleAtMax);
  }
}

class HalfLifeDecay extends NaturalExponentialFunction {

}


class GaussianFunction extends MathematicalFunction {

}

class InverseFunction extends MathematicalFunction {

}

class InverseSquareFunction extends MathematicalFunction {

}
