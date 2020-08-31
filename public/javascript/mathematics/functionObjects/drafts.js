/*
to do:
- deal with discontinuities
- add stepwise functions
- break 'Mathematical Function' into two subclasses: single Function and stepwise function
- a stepwise function must be a list of single functions!
- come up with a way to differentaite many times, if you need it?
- figure out how to manke range finder a private function and make sure it works as such
- rewrite differentaite twice
*/

class ExponentialFunction extends SingleFunction {
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
