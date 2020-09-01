class LinearFunction extends Polynomial {
    constructor(slope, yIntercept, xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
        super([slope, yIntercept], xMin, xMax, closedCircleAtMin, closedCircleAtMax);

        this.slope = slope;
        this.yIntercept = yIntercept;
        if (this.slope.zero) {
            this.xIntercept = undefined;
        } else {
            this.xIntercept = (this.yIntercept.divideMag(this.slope)).reverseSign();
        }

        // this should redfine the function defined above in the polynomial constructor ?
        super.defineFunction((x) => {return this.slope * x + this.yIntercept})
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

}
