class ConstantFunction extends LinearFunction {
    constructor(value, xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
        super(constructZeroMagnitude(), value, xMin, xMax, closedCircleAtMin, closedCircleAtMax);
        this.value = value;

        this.func = (x) => {return this.value};
        // i want to write a more complicated version of 'define function'

        const constantFloat = this.value.getFloat();
        this.floatFunc = (x) => {return constantFloat}
    }


    rangeFinder(xMin, xMax) {
        return [this.value, this.value]
    }

    getDerivative() {
        return new ZeroFunction(this.value.numSigFigs,undefined,this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax);
    }

    getAntiDerivative(constant = constructZeroMagnitude()) {
        return new LinearFunction(this.value, constant, this.xMin, this.yMax, this.closedCircleAtMin, this.closedCircleAtMax);
    }
}
