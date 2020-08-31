class Circle {
    constructor(centerPoint, radius) {
        this.centerPoint = centerPoint;
        this.radius = radius;
        this.diagramQualities = {
            filled: false,
            lineThickness: 2,
            lineColor: "#000000",
            fillColor: "#000000"
        };
        this.center = centerPoint;
        this.rangeBox = constructRangeBoxFromCenter(centerPoint, radius * 2, radius * 2);
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
