
// upperCutoff => all lines above this will be cut off
// lowerCutoff => all lines below this will be cut off
class Curve {
    constructor(functionObject, upperCutoff, lowerCutoff) {
        if (functionObject.xMin === -Infinity) {
            return undefined
        }
        if (functionObject.xMax === Infinity) {
            return undefined
        }
        this.func = functionObject;

        let range = this.func.findRangeOverInterval();

        this.upperCutoff = upperCutoff;
        this.lowerCutoff = lowerCutoff;

        this.xMin = functionObject.xMin;
        this.xMax = functionObject.xMax;
        this.yMin = range[0];
        this.yMax = range[1];

        this.cutoff = false;
        if (this.upperCutoff !== undefined) {
            if (this.upperCutoff.isLessThan(this.yMin)) {
                this.yMax = this.upperCutoff;
                this.cutoff = true;
            }
        }
        if (this.lowerCutoff !== undefined) {
            if (this.lowerCutoff.isGreaterThan(this.yMax)) {
                this.yMin = this.lowerCutoff;
                this.cutoff = true;
            }
        }

        if (this.yMin === -Infinity) {
            return undefined
        }
        if (this.yMax === Infinity) {
            return undefined
        }

        this.diagramQualities = {
            dashed: false,
            dashLength: undefined,
            thickness: 2,
            color: "black",
            lineCap: "butt"
        };


        this.makeSolid();

        this.rangeBox = new RangeBox(this.xMin,this.yMin,(this.xMax - this.xMin), (this.yMax - this.yMin));
    }

    rescaleVertically(yMultiplier) {
        /// rescales the function so that it fits
    }

    makeDashed(numDashes) {
        this.diagramQualities = {
            dashed: true,
            dashLength: this.getDashLength(numDashes)
        };
    }

    makeSolid() {
        this.diagramQualities = {
            dashed: false,
            dashLength: undefined
        };
    }

    // add a function to add arrows?


    getDashLength(numDashes) {
        const arcLength = this.func.getArcLength(); // make sure to define this!!!!
        const numDashesAndSpaces = numDashes + (numDashes - 1); // always begin and end on a dash
        return arcLength / numDashesAndSpaces;
    }
}
