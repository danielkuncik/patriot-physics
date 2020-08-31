class MathematicalFunction {
    constructor(xMin = -Infinity, xMax = Infinity, closedCircleAtMin = true, closedCircleAtMax = true) {
        this.xMin = xMin;
        this.xMax = xMax;
        this.closedCircleAtMin = closedCircleAtMin;
        this.closedCircleAtMax = closedCircleAtMax;
        this.undefinedPoints = [];
        this.function = (x) => {return undefined};
    }

    addUndefinedPoint(x) {
        if (isValueInDomain(x)) {
            this.undefinedPoints.push(x);
        } else {
            console.log(`addUndefinedPoint Error: value ${x} already outside domain`);
        }
    }

    isValueInDomain(x) {
        return ((x > this.xMin || (x === this.xMin && this.closedCircleAtMin)) && (x < this.xMax || (x === this.xMax && this.closedCircleAtMax)) && !this.undefinedPoints.includes(x))
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
        } else if (this.derivative) { // if it gets the derivative, it recrods it, but does not create an infinite loop
            return this.derivative.runFunction(x)
        } else if (this.getDerivative()) { /// can i add 'this.derivative here, so that it recrods the derivative if finds it'
            this.derivative = this.getDerivative();
            return this.derivative.runFunction(x)
        } else {
            return this.differentiateBruteForce(x)
        }
    }

// needs to be rewritten!!!!
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
        if (!this.isValueInDomain(xMin) || !this.isValueInDomain(xMax) || xMin === -Infinity || xMax === Infinity) {
            return undefined
        } else if (this.getAntiDerivative()) {
            let antiDerivative = this.getAntiDerivative();
            return antiDerivative.runFunction(xMax) - antiDerivative.runFunction(xMin)
        } else {
            return this.integrateBruteForce(xMin, xMax)
        }
    }

    differentiateBruteForce(x, halfStep = 0.001 * (this.xMin - this.xMax)) {
        if (!this.isValueInDomain(x) || !this.isValueInDomain(x - halfStep) || !this.isValueInDomain(x + halfStep)) {
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
