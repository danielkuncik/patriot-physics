class QuadraticFunction extends Polynomial {
    constructor(a, b, c, xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
        if (a === 0) {
            return new LinearFunction(b, c, xMax, xMin, closedCircleAtMin, closedCircleAtMax)
        }

        super([a, b, c], xMin, xMax, closedCircleAtMin, closedCircleAtMax);
        this.a = a;
        this.b = b;
        this.c = c;

        super.defineFunction((x) => {
            return a*x*x + b*x + c
        });

        let vertexX = -1 * this.b / 2 / this.a
        if (super.isValueInDomain(vertexX)) {
            let vertexY = this.a*vertexX * vertexX + this.b * vertexX + this.c;
            this.vertexX = vertexX;
            this.vertexY = vertexY;
            // this.vertex = new Point(this.vertexX, this.vertexY); // make sure points are defined first?? is this necessary??
        } else {
            this.vertexX = undefined;
            this.vertexY = undefined;
            this.vertex = undefined;
        }
    }

    getDerivative() {
        return new LinearFunction(2 * this.x, this.b, this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax)
    }

    getAntiDerivative(constant = 0) {
        new Polynomial([a/3, b/2, c, constant], this.xMin, this.xMax, this.closedCircleAtMin, this.closedCircleAtMax); //redundant?
    }
}
