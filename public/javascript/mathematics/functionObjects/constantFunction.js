class ConstantFunction extends LinearFunction {
    constructor(value, xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
        super(constructZeroMagnitude(), value, xMin, xMax, closedCircleAtMin, closedCircleAtMax);
        this.value = value;

        // i want to write a more complicated version of 'define function'
    }

    rangeFinder(xMin, xMax) {
        return [this.value, this.value]
    }

    getDerivative() {
        return new ZeroFunction(this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax);
    }

    getAntiDerivative(constant = constructZeroMagnitude()) {
        return new LinearFunction(this.value, constant, this.xMin, this.yMax, this.closedCircleAtMin, this.closedCircleAtMax);
    }
}
