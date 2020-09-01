// maybe just make this ex
class ZeroFunction extends ConstantFunction {
    constructor(numSigFigs, exact = numSigFigs === undefined, xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
        super(constructZeroMagnitude(numSigFigs, exact), xMin, xMax, closedCircleAtMin, closedCircleAtMax);

    }

// private function
    rangeFinder(xMin, xMax) {
        return [constructZeroMagnitude(), constructZeroMagnitude()]
    }

    getDerivative() {
        return this
    }

    getAntiDerivative(constant = constructZeroMagnitude()) {
        if (constant.zero) {
            return this;
        } else {
            return new ConstantFunction(constant, this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax)
        }
    }
}
