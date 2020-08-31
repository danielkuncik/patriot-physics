class SingleFunction extends MathematicalFunction {
    constructor(xMin, xMax, closedCircleAtMin, closedCircleAtMax) {
        super(xMin, xMax, closedCircleAtMin, closedCircleAtMax);
    }

    // can be redefined
    defineFunction(func) { // used in defining each subclass
        this.func = (x) => {
            if (!super.isValueInDomain(x)) {
                return undefined
            } else {
                return func(x)
            }
        }
    }

}
