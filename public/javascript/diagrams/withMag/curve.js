class Curve {
    constructor(func, xMin, xMax, forcedYmin, forcedYmax) {
        this.function = func;
        this.xMin = xMin;
        this.xMax = xMax;
        // error if xMin is less than xMax
        let range = this.getRange();
        this.Yforced = false;
        if (forcedYmin !== undefined) {
            this.yMin = forcedYmin;
            this.Yforced = true;
        } else {
            this.yMin = range[0];
        }
        if (forcedYmax !== undefined) {
            this.yMax = forcedYmax;
            this.Yforced = true;
        } else {
            this.yMax = range[1];
        }
        this.makeSolid();

        this.rangeBox = new RangeBoxF(this.xMin,this.yMin,(this.xMax - this.xMin), (this.yMax - this.yMin));
    }

    getRange(Nsteps) {
        if (Nsteps === undefined) {Nsteps = 500;}
        let i, xVal, yVal;
        let yMax = this.function(this.xMin);
        let yMin = yMax;
        let xStep = (this.xMax - this.xMin) / Nsteps;
        for (i = 0; i <= Nsteps; i++) {
            xVal = this.xMin + i * xStep;
            yVal = this.function(xVal);
            if (yVal < yMin) {yMin = yVal;}
            if (yVal > yMax) {yMax = yVal;}
        }
        return [yMin, yMax];
    }

    rescaleVertically(yMultiplier) {
        /// rescales the function so that it fits
    }

    makeDashed(numDashes) {
        this.dashed = true;
        this.dashLength = this.getDashLength(numDashes);
    }

    makeSolid() {
        this.dashed = false;
        this.dashLength = undefined;
    }

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

    getDashLength(numDashes) {
        const arcLength = this.getArcLength();
        const numDashesAndSpaces = numDashes + (numDashes - 1); // always begin and end on a dash
        return arcLength / numDashesAndSpaces;
    }
}
