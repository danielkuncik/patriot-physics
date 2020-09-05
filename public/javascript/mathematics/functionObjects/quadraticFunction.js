class QuadraticFunction extends Polynomial {
    constructor(a = new Magnitude('1', undefined, undefined, true), b = constructZeroMagnitude(), c = constructZeroMagnitude(), xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
        if (a === 0) {
            return new LinearFunction(b, c, xMax, xMin, closedCircleAtMin, closedCircleAtMax)
        }

        super([a, b, c], xMin, xMax, closedCircleAtMin, closedCircleAtMax);
        this.a = a;
        this.b = b;
        this.c = c;

        super.defineFunction((x) => {
            return (a.multiplyMag(x.squareMag()).addMag(b.multiplyMag(x))).addMag(c)
        });

        let vertexX = (this.b.divideMag(this.a.multiplyMagExactConstant(2))).reverseSign();
        if (super.isValueInDomain(vertexX)) {
            let vertexY = this.runFunction(vertexX);
            this.vertexX = vertexX;
            this.vertexY = vertexY;
            this.vertex = new Point(this.vertexX, this.vertexY);
        } else {
            this.vertexX = undefined;
            this.vertexY = undefined;
            this.vertex = undefined;
        }

        const aFloat = this.a.getFloat();
        const bFloat = this.b.getFloat();
        const cFloat = this.c.getFloat();

        this.parameterSigFigs = Math.min(a.numSigFigs, b.numSigFigs, c.numSigFigs);

        this.floatFunc = (x) => {return aFloat * x * x + bFloat * x + cFloat };
    }

    getDerivative() {
        return new LinearFunction(this.a.multiplyMagExactConstant(2), this.b, this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax)
    }

    getAntiDerivative(constant = constructZeroMagnitude()) {
        new Polynomial([this.a.divideMagExactConstant(3), this.b.divideMagExactConstant(2), c, constant], this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax); //redundant?
    }
}
