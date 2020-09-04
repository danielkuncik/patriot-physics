class LinearFunction extends Polynomial {
    constructor(slope, yIntercept = constructZeroMagnitude(), xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
        super([slope, yIntercept], xMin, xMax, closedCircleAtMin, closedCircleAtMax);

        this.slope = slope;
        this.yIntercept = yIntercept;
        if (this.slope.zero) {
            this.xIntercept = undefined;
        } else {
            this.xIntercept = (this.yIntercept.divideMag(this.slope)).reverseSign();
        }

        this.func = (x) => {return (this.slope.multiplyMag(x)).addMag(this.yIntercept)};

        const slopeFloat = this.slope.getFloat();
        const yInterceptFloat = this.yIntercept.getFloat();

        this.parameterSigFigs = Math.min(slope.numSigFigs, yIntercept.numSigFigs);
        this.floatFunc = (x) => {return slopeFloat * x + yInterceptFloat}

        // this should redfine the function defined above in the polynomial constructor ?
    }

    /// range finder is not to be used separately, only within the range function above!
    // figure out how to make this a private class, that can only be called in the super function above
    rangeFinder(xMin, xMax) {
        if (this.slope.positive) {
            return [super.runFunction(xMin), super.runFunction(xMax)]
        } else if (this.slope.positive === false) {
            return [super.runFunction(xMax), super.runFunction(xMin)]
        } else if (this.slope.zero) {
            return [this.yIntercept, this.yIntercept]
        }
    }

    getDerivative() {
        return new ConstantFunction(this.slope, this.xMin, this.xMax);
    }

    getAntiDerivative(constant = constructZeroMagnitude()) { // add constant here
        return new QuadraticFunction(0.5 * this.slope, this.yIntercept, constant);
    }

    arcLengthFunction(xMin, xMax) {
        let x1 = xMin;
        let x2 = xMax;
        let y1 = this.runFunction(x1);
        let y2 = this.runFunction(x2);

        let deltaX = x2.subtractMag(x1);
        let deltaY = y2.subtractMag(y1);

        return deltaX.pythagoreanAddMag(deltaY)
    }

}
