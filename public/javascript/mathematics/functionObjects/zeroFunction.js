// maybe just make this ex
class ZeroFunction extends ConstantFunction {
    constructor(xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
        super(constructZeroMagnitude(), xMin, xMax, closedCircleAtMin, closedCircleAtMax);

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
