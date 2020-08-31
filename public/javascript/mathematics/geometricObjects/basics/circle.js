class Circle {
    constructor(centerPoint, radius) {
        this.center = centerPoint;
        this.radius = radius;
        this.diagramQualities = {
            filled: false,
            lineThickness: 2,
            lineColor: "#000000",
            fillColor: "#000000"
        };
        this.rangeBox = constructRangeBoxFromCenter(this.center, this.radius.multiplyMagExactConstant(2), this.radius.multiplyMagExactConstant(2));
    }

    setFillColor(newColor) {
        this.diagramQualities.fillColor = newColor;
    }

    fill() {
        this.diagramQualities.filled = true;
    }

    fillWhite() {
        this.setFillColor('#FFFFFF');
        this.fill();
    }

    unfill() {
        this.diagramQualities.filled = false;
    }

    rescaleSingleFactor(scaleFactor) {
        this.radius = this.radius.multiplyMagExactConstant(scaleFactor);
    }

    rescaleDoubleFactor(xFactor, yFactor) {
        if (xFactor <= yFactor) {
            this.radius = this.radius.multiplyMagExactConstant(xFactor);
        } else {
            this.radius = this.radius.multiplyMagExactConstant(yFactor);
        }
    }

}
