/*
To Do
9-2-2020

- create a new method called 'float function' for each function that returns a float version of a function
- redesign all recursive methods to use 'float function' instead of the normal run function
- create a quality called 'parameter sig figs' that gives the number of significant figures in the parameters of a function,
- use parameter sig figs with recursive methods
- create a method called 'get arc length' with each function [have a recursive brute force version and shortcut versions]

 */

class MathematicalFunction {
    constructor(xMin = constructNegativeInfinity(), xMax = constructInfinity(), closedCircleAtMin = true, closedCircleAtMax = true) {
        this.xMin = xMin;
        this.xMax = xMax;
        /// add some rules, like min cannot be less than max
        if (xMin.infinity && !xMin.positive) {
            this.closedCircleAtMin = undefined;
        } else {
            this.closedCircleAtMin = closedCircleAtMin;
        }
        if (this.xMax.infinity && xMax.positive) {
            this.closedCircleAtMax = undefined;
        } else {
            this.closedCircleAtMax = closedCircleAtMax;
        }
        this.undefinedPoints = [];
        this.func = undefined;
    }

    addUndefinedPoint(xMag) {
        if (this.isValueInDomain(xMag)) {
            this.undefinedPoints.push(xMag);
        } else {
            console.log(`addUndefinedPoint Error: value ${xMag} already outside domain`);
        }
    }


    // float function
    // a float based version of the function
    // not utilizing magnitudes and not considering significant figures
    // more efficient for long recursive operations

    isValueInDomain(xMag) {
        return (xMag.isGreaterThan(this.xMin)|| (xMag.isEqualTo(this.xMin) && (this.closedCircleAtMin || (this.xMin.infinity && !this.xMin.positive))) && (xMag.isLessThan(this.xMax) || (xMag.isEqualTo(this.xMax) && (this.closedCircleAtMax || (this.xMax.infinity && this.xMax.positive))))) && !this.undefinedPoints.includes(xMag)
    }

    runFunction(x) {
        return this.func(x)
    }

    getDerivative() {
        return undefined
    }

    getAntiDerivative() {
        return undefined
    }

    // private function???
    rangeFinder(xMin = this.xMin, xMax = this.xMax) {
        return undefined
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
            console.log('1');
            return undefined
        } else if (this.derivative) { // if it gets the derivative, it recrods it, but does not create an infinite loop
            console.log('2');
            return this.derivative.runFunction(x)
        } else if (this.getDerivative()) { /// can i add 'this.derivative here, so that it recrods the derivative if finds it'
            console.log('3');
            this.derivative = this.getDerivative();
            return this.derivative.runFunction(x)
        } else {
            console.log('4');
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
        } else if (this.antiDerivative) {
            return (this.antiDerivative.runFunction(xMax)).subtractMag(this.antiDerivative.runFunction(xMin))
        } else if (this.getAntiDerivative()) {
            this.antiDerivative = this.getAntiDerivative();
            return (this.antiDerivative.runFunction(xMax)).subtractMag(this.antiDerivative.runFunction(xMin))
        } else {
            return this.integrateBruteForce(xMin, xMax)
        }
    }

    differentiateBruteForce(x, halfStep = (this.xMin.subtractMag(this.xMax)).multiplyMagExactConstant(0.001)) {
        if (!this.isValueInDomain(x) || !this.isValueInDomain(x.subtractMag(halfStep)) || !this.isValueInDomain(x.addMag(halfStep))) {
            return undefined
        } else if (x.infinity) {
            return undefined
        } else {
            return ((this.runFunction(x.addMag(halfStep))).subtractMag(this.runFunction(x.subtractMag(halfStep)))).divideMag(halfStep.multiplyMagExactConstant(2))
        }// awkward code!
    }

    /// will break if it hits an undefined point
    // TO DO: create a more efficient method that uses floats and only corrects the number of significant figures at the end
    integrateBruteForce(xMin = this.xMin, xMax = this.xMax, nSteps = 100) {
        if ((xMin === -Infinity || xMax === Infinity) || !this.isValueInDomain(xMin) || !this.isValueInDomain(xMax)) {
            return undefined
        } else {
            let k;
            let totalArea = constructZeroMagnitude();
            const step = (xMax.subtractMag(xMin)).divideMagExactConstant(nSteps);
            for (k = 0; k < nSteps; k++) {
                let x1 = xMin.addMag(step.multiplyMagExactConstant(k));
                let x2 = x1.addMag(step);
                totalArea += x1.addMag(x2).divideMag(step.multiplyMagExactConstant(2));
            }
            return totalArea
        }
    }

    // TO DO: figure out a better method that uses floats and only corrects the significant figures at the end
    findRangeOverIntervalByBruteForce(xMin = this.xMin, xMax = this.xMax, Nsteps = 1000) {
        if ((xMin === -Infinity || xMax === Infinity) || !this.isValueInDomain(xMin) || !this.isValueInDomain(xMax)) {
            return undefined
        } else {
            let yMin = this.runFunction(xMin), yMax = this.runFunction(xMin);
            let k, thisYValue;
            const step = (xMax.subtractMag(xMin)).divideMagExactConstant(Nsteps);
            for (k = 1; k < Nsteps; k++) {
                thisYValue = this.runFunction(xMin.addMag(step.multiplyMagExactConstant(k)));
                if (thisYValue.isLessThan(yMin)) {
                    yMin = thisYValue;
                } else if (thisYValue.isGreaterThan(yMax)) {
                    yMax = thisYValue;
                }
            }
            return [yMin, yMax]
        }
    }


    /*
    Add a functino to find ARC LENGTH
    getArcLength() {
        const Nsteps = 1000;
        let i;
        const range = this.xMax - this.xMin;
        let arcLength = 0, x1, y1, x2,y2;
        for (i = 0; i < Nsteps; i++) {
            x1 = this.function(this.xMin + i / Nsteps * range);
            x2 = x1 + 1 / Nsteps;
            y1 = this.function(x1);
            y2 = this.function(x2);
            arcLength += Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
        }
        return arcLength;
    }
     */


}
