// do i want this?????
class Polynomial extends SingleFunction { // in array, begin with the HIGHEST power coefficient
    constructor(arrayOfCoefficients, xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
        super(xMin, xMax, closedCircleAtMin, closedCircleAtMax);
        this.arrayOfCoefficients = arrayOfCoefficients;

        super.defineFunction((x) => {
            let value = 0, i, coefficient, power;
            for (i = 0; i < arrayOfCoefficients.length; i++) {
                coefficient = arrayOfCoefficients[i];
                power = arrayOfCoefficients.length - 1 - i;
                value += coefficient * x**power;
            }
            return value
        });

    }

    getDerivative() {
        if (this.arrayOfCoefficients.length === 0) {
            this.derivative = new ZeroFunction(this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax);
        } else {
            let derivativeCoefficients = [];
            let coefficient, power;
            let i;
            for (i = arrayOfCoefficients.length - 1; i > 0; i--) {
                coefficient = arrayOfCoefficients[i];
                power = arrayOfCoefficients.length - 1 - i;
                derivativeCoefficients.push(coefficient * power);
            }
            this.derivative = new Polynomial(derivativeCoefficients, this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax);
        }
    }


    getAntiDerivative(constant = 0) { /// i cannot define the antideritaive above, because it will craete an infinite loop!
        let antiDerivativeCoefficients = [constant]; /// defined with constant zero
        let i;
        for (i = arrayOfCoefficients.length - 1; i > 0; i--) {
            coefficient = arrayOfCoefficients[i];
            power = arrayOfCoefficients.length - 1 - i;
            antiDerivativeCoefficients.push(coefficient / (power + 1));
        }
        return new Polynomial(antiDerivativeCoefficients, this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax)
    }
}
