// maybe just make this ex
class ZeroFunction extends ConstantFunction {
    constructor(xMin, xMax, closedCirlceAtMin, closedCircleAtMax) {
        super(0, xMin, xMax, closedCirlceAtMin, closedCircleAtMax);

    }

// private function
    rangeFinder(xMin, xMax) {
        return [0, 0]
    }

    getDerivative() {
        return this
    }

    getAntiDerivative(constant = 0) {
        if (constant === 0) {
            return this;
        } else {
            return new ConstantFunction(constant, this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax)
        }
    }
}
