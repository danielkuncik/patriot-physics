class ConstantFunction extends LinearFunction {
    constructor(value, xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
        super(0, value, xMin, xMax, closedCircleAtMin, closedCircleAtMax);
        this.value = value;

    }

    rangeFinder(xMin, xMax) {
        return [this.value, this.value]
    }

    getDerivative() {
        return new ZeroFunction(this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax);
    }

    getAntiDertivative(constant = 0) {
        return new LinearFunction(this.value, constant, this.xMin, this.yMax, this.closedCircleAtMin, this.closedCircleAtMax);
    }
}
