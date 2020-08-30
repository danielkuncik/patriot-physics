// should there be just one type of wave object, or different wave objects for transverse and longitudinal??

// default start is zero line, going up
// phase proportion is a number from 0 to 1 indicating at what point it should begin
class Wave {
    constructor(numWavelengths, amplitude, wavelength, phaseProportion) {
        if (amplitude === undefined) {
            amplitude = 1;
        }
        if (wavelength === undefined) {
            wavelength = 1;
        }
        if (phaseProportion === undefined) {
            phaseProportion = 0;
        }
        this.phaseProportion = this.setPhaseProportion(phaseProportion);
        if (numWavelengths === undefined) {
            numWavelengths = 4;
        }
        this.makeTransverse();
        this.amplitude = amplitude;
        this.wavelength = wavelength;
        this.numWavelengths = numWavelengths;
        this.phase = this.phaseProportion * 2 * Math.PI;
        this.xMax = wavelength * numWavelengths;
        //    addFunctionGraph(func, xMin, xMax, forcedYmin, forcedYmax) {
        this.function = (x) => {
            return this.amplitude * Math.sin(2 * Math.PI * x / this.wavelength + this.phase);
        };


        this.circles = [];

        this.aboveArrows = [];
        this.belowArrows = [];
        this.topDistanceMarkers = [];
        this.bottomDistanceMarkers = [];
        this.verticalArrows = [];

        this.centerLine = false;
        this.centerLineDashed = undefined;
    }

    addCenterLine(dashedBoolean) {
        this.centerLine = true;
        this.centerLineDashed = dashedBoolean;
    }

    removeCenterLine() {
        this.centerLine = false;
        this.centerLineDashed = undefined;
    }

    setPhaseProportion(newPhaseProportion) {
        if (newPhaseProportion < 0) {
            newPhaseProportion -= Math.floor(newPhaseProportion);
        }
        if (newPhaseProportion > 1) {
            newPhaseProportion = newPhaseProportion % 1;
        }
        return newPhaseProportion
    }

    normalizeFunction() {
        this.integral = this.amplitude * (Math.cos(this.phase) - Math.cos(2 * Math.PI * this.numWavelengths)) + this.amplitude * this.xMax / 2;
        this.probabilityFunction = (x) => {
            return (this.function(x) + this.amplitude / 2) / this.integral;
        }
        ///  won't this cancel out amplitude?? that does need to be a part of it.
    }

    makeLongitudinal(totalHeight, dotDensity) {
        if (totalHeight === undefined) {
            totalHeight = this.xMax / 2;
        }
        if (dotDensity === undefined) {
            dotDensity = 0.7; // number of dots per area
        }
        this.type = 'longitudinal';
        this.totalHeight = totalHeight;
        this.dotDensity = dotDensity;

        // make function into a probability distribution
    }
    makeTransverse() {
        this.type = 'transverse';
        this.totalHeight = undefined;
        this.dotDensity = undefined;
    }

    addSecondHalf(dashedBoolean) {
        if (this.type === 'longitudinal') {
            console.log('ERROR: Cannot add second half to longitudinal wave');
            return false
        }
        this.secondFunction = (x) => {
            return this.amplitude * Math.sin(2 * Math.PI * x / this.wavelength + this.phase + Math.PI);
        };
        this.bottomHalfDashed = dashedBoolean;
    }

    makeStandingWave() {
        this.addSecondHalf(true);
    }

    countPoints(selectedPhaseProportion) { // counting the points at a particular proportion
        selectedPhaseProportion = this.setPhaseProportion(selectedPhaseProportion);
        let firstPoint, numPoints;
        if (this.phaseProportion === selectedPhaseProportion) {
            firstPoint = 0;
            if (this.numWavelengths % 1 === 0) { /// if it ends on a point
                numPoints = 1 + this.numWavelengths;
            } else { // if it doesn't end on a point
                numPoints = this.numWavelengths;
            }
        } else if (this.phaseProportion < selectedPhaseProportion) {
            firstPoint = this.wavelength * (selectedPhaseProportion - this.phaseProportion);
            if ((this.numWavelengths % 1) === (selectedPhaseProportion - this.phaseProportion)) {
                console.log('q');
                numPoints = 1 + this.numWavelengths;
            } else {
                numPoints = this.numWavelengths;
            }
        } else { // this.phaseProportion > selectedPhaseProportion
            firstPoint = this.wavelength * (1 + selectedPhaseProportion - this.phaseProportion);
            if ((this.numWavelengths % 1) ===  (1 + selectedPhaseProportion - this.phaseProportion)) { // if it ends on a point
                numPoints = 1 + this.numWavelengths;
            } else {
                numPoints = this.numWavelengths;
            }
        }
        return {
            firstPoint: firstPoint,
            numPoints: numPoints
        }
    }

    getCrestLocations() {
        return this.countPoints(0.25);
    }
    getTroughLocations() {
        return this.countPoints(0.75);
    }

    circlePoints(selectedPhaseProportion, yPoint, filled, radius) {
        if (radius === undefined) {
            radius = 0.1;
        }
        if (yPoint === undefined) {
            yPoint = 0;
        }

        let pointLocations = this.countPoints(selectedPhaseProportion);

        let k, x;
        for (k = 0; k < pointLocations.numPoints; k++ ) {
            x = pointLocations.firstPoint + this.wavelength * k;
            this.circles.push({
                x: x,
                y: yPoint,
                radius: radius,
                filled: filled
            });
        }
    }

    aboveArrowPoints(selectedPhaseProportion, label) {
        let pointLocations = this.countPoints(selectedPhaseProportion);

        let k, x;
        for (k = 0; k < pointLocations.numPoints; k++) {
            x = pointLocations.firstPoint + this.wavelength * k;
            this.aboveArrows.push({
                x: x,
                label: label
            });
        }
    }

    belowArrowPoints(selectedPhaseProportion, label) {
        let pointLocations = this.countPoints(selectedPhaseProportion);

        let k, x;
        for (k = 0; k < pointLocations.numPoints; k++) {
            x = pointLocations.firstPoint + this.wavelength * k;
            this.belowArrows.push({
                x: x,
                label: label
            });
        }
    }

    labelTop(startCrestNumber, numWavelengths, label, extraDisplacement) {
        if (extraDisplacement === undefined) {
            extraDisplacement = 0;
        }
        let x1 = this.getSingleCrestLocation(startCrestNumber);
        let x2 = x1 + this.wavelength * numWavelengths;
        this.topDistanceMarkers.push({
            x1: x1,
            x2: x2,
            label: label,
            extraDisplacement: extraDisplacement
        });
    }

    labelBottom(startTroughNumber, numWavelengths, label, extraDisplacement) {
        if (extraDisplacement === undefined) {
            extraDisplacement = 0;
        }
        let x1 = this.getSingleTroughLocation(startTroughNumber);
        let x2 = x1 + this.wavelength * numWavelengths;
        this.bottomDistanceMarkers.push({
            x1: x1,
            x2: x2,
            label: label,
            extraDisplacement: extraDisplacement
        });
    }

    labelSingleWavelengthTop(crestNumber, label) {
        this.labelTop(crestNumber, 1, label);
    }

    labelSingleWavelengthBottom(troughNumber, label) {
        this.labelBottom(troughNumber, 1, label);
    }

    pointAmplitudeUp(xLocation, label) {
        this.verticalArrows.push({
            y1: 0,
            y2: this.amplitude,
            x: xLocation,
            label: label
        })
    }

    pointAmplitudeDown(xLocation, label) {
        this.verticalArrows.push({
            y1: 0,
            y2: -1 * this.amplitude,
            x: xLocation,
            label: label
        })
    }

    getSingleCrestLocation(crestNumber) {
        let crestLocations = this.getCrestLocations();
        let x = crestLocations.firstPoint + crestNumber * this.wavelength;
        return x
    }

    getSingleTroughLocation(troughNumber) {
        let troughLocations = this.getTroughLocations();
        let x = troughLocations.firstPoint + troughNumber * this.wavelength;
        return x
    }

    pointAmplitudeOnCrest(crestNumber, label) {
        let x = this.getSingleCrestLocation(crestNumber);
        this.pointAmplitudeUp(x, label);
    }

    pointAmplitudeOnTrough(troughNumber, label) {
        let x = this.getSingleTroughLocation(troughNumber);
        this.pointAmplitudeDown(x, label);
    }

    pointToOneCrest(crestNumber, label) {
        let x = this.getSingleCrestLocation(crestNumber);
        this.aboveArrows.push({
            x: x,
            label: label
        });
    }

    pointToOneTrough(troughNumber, label) {
        let x = this.getSingleTroughLocation(troughNumber);
        this.belowArrows.push({
            x: x,
            label: label
        });
    }

    pointFullHeightOfWave(crestOrTrough, number, label) {
        if (crestOrTrough === undefined) {crestOrTrough = 'crest';}
        let x;
        if (crestOrTrough === 'crest') {
            x = this.getSingleCrestLocation(number);
        } else if (crestOrTrough === 'trough') {
            x = this.getSingleTroughLocation(number);
        }
        this.verticalArrows.push({
            x: x,
            y1: -1 * this.amplitude,
            y2: this.amplitude,
            label: label
        });
    }

    pointToCrests(label) {
        this.aboveArrowPoints(0.25, label);
    }
    pointToTroughs(label) {
        this.belowArrowPoints(0.75, label);
    }

    circleCrests(filled, radius) {
        this.circlePoints(0.25, this.amplitude, filled, radius);
    }

    circleTroughs(filled, radius) {
        this.circlePoints(0.75,-1 * this.amplitude, filled, radius);
    }

    circleCenterPoints(filled, radius) {
        this.circlePoints(0,0,filled,radius);
        this.circlePoints(0.5,0,filled,radius);
    }

    circleAllKeyPoints(filled, radius) {
        this.circleCrests(filled, radius);
        this.circleTroughs(filled, radius);
        this.circleCenterPoints(filled, radius);
    }


    drawCanvas(maxWidth, maxHeight, unit, wiggleRoom) {
        if (maxWidth === undefined) {
            maxWidth = 300;
        }
        if (maxHeight === undefined) {
            maxHeight = maxWidth;
        }
        let WaveDiagram = new DiagramF();
        if (this.type === 'transverse') {
            WaveDiagram.addFunctionGraph(this.function, 0, this.xMax);

            if (this.secondFunction) {
                let secondFunction = WaveDiagram.addFunctionGraph(this.secondFunction, 0, this.xMax);
                if (this.bottomHalfDashed) {
                    secondFunction.makeDashed(20);
                }
            }
        } else if (this.type === 'longitudinal') {
            /// function nondistortedResize(originalWidth, originalHeight, maxWidth, maxHeight) {


            let scale = nondistortedResizeF(this.xMax, this.totalHeight, maxWidth, maxHeight);
            let areaOnScreen = this.xMax * this.totalHeight * scale; // get the area in pixels
            let numDots = areaOnScreen * this.dotDensity;
            let dotRadius = areaOnScreen * 0.00003;

            let i, yTest, xTest, monteCarloPoint, Ntries;
            for (i = 0; i < numDots; i++) {
                xTest = Math.random() * this.xMax;
                yTest = Math.random() * this.totalHeight;

                monteCarloPoint = Math.random() * this.amplitude * 2;

                if (monteCarloPoint < this.function(xTest) + this.amplitude) {
                    WaveDiagram.addBlackCircle(new PointF(xTest, yTest), dotRadius);
                } else {
                    i -= 1;
                }
                // the solution i once figured out on a friday night at a teavana in waltham, ma
            }

        }

        if (this.centerLine) {
            let centerLine = WaveDiagram.addSegment(new PointF(0,0), new PointF(this.xMax, 0));
            if (this.centerLineDashed) {
                centerLine.turnIntoDashedLine();
            }
        }

        this.circles.forEach((circle) => {
            let newCircle = WaveDiagram.addCircle(new PointF(circle.x, circle.y),circle.radius);
            if (circle.filled) {
                newCircle.fill();
            }
        });

        this.aboveArrows.forEach((arrow) => {
            WaveDiagram.addArrow(new PointF(arrow.x, this.amplitude * 1.4),new PointF(arrow.x, 1.1 * this.amplitude), this.amplitude* 0.06);
            if (arrow.label) {
                WaveDiagram.addText(arrow.label, new PointF(arrow.x, this.amplitude * 1.5), this.amplitude * 0.2);
            }
        });
        this.belowArrows.forEach((arrow) => {
            WaveDiagram.addArrow(new PointF(arrow.x, this.amplitude * -1.4),new PointF(arrow.x, -1.1 * this.amplitude), this.amplitude * 0.06);
            if (arrow.label) {
                WaveDiagram.addText(arrow.label, new PointF(arrow.x, this.amplitude * -1.5), this.amplitude * 0.2);
            }
        });

        const sideLength = this.amplitude * 0.12;
        this.topDistanceMarkers.forEach((arrow) => {
            let point1 = new PointF(arrow.x1, this.amplitude + arrow.extraDisplacement + sideLength);
            let point2 = new PointF(arrow.x2, this.amplitude + arrow.extraDisplacement + sideLength);
            WaveDiagram.addDistanceMarker(point1, point2, sideLength);
            if (arrow.label) {
                WaveDiagram.labelLine(point1,point2,arrow.label,'',this.amplitude*0.1, this.amplitude*0.2);
            }
        });
        this.bottomDistanceMarkers.forEach((arrow) => {
            let point1 = new PointF(arrow.x1, -1 * this.amplitude - arrow.extraDisplacement - sideLength);
            let point2 = new PointF(arrow.x2, -1 * this.amplitude - arrow.extraDisplacement - sideLength);
            WaveDiagram.addDistanceMarker(point1, point2, sideLength);
            if (arrow.label) {
                WaveDiagram.labelLine(point1,point2,'',arrow.label,this.amplitude*0.1, this.amplitude*0.2);
            }
        });

        this.verticalArrows.forEach((arrow) => {
            let point1 = new PointF(arrow.x, arrow.y1);
            let point2 = new PointF(arrow.x, arrow.y2);
            WaveDiagram.addTwoHeadedArrow(point1, point2, this.amplitude * 0.12);
            if (arrow.label) {
                WaveDiagram.labelLine(point1, point2, arrow.label, '', this.amplitude * 0.05, this.amplitude * 0.1);
            }
        });

        return WaveDiagram.drawCanvas(maxWidth, maxHeight, unit, wiggleRoom);
    }

}

class Harmonic extends Wave {
    constructor(harmonicNumber, end1, end2, amplitude, wavelength) {
        if (end1 === undefined) {
            end1 = 'closed';
        }
        if (end2 === undefined) {
            end2 = 'closed';
        }
        if (harmonicNumber === undefined) {
            console.log('ERROR, Harmonic number must be defined')
        }
        let phaseProportion, numWavelengths;
        if (end1 === 'closed' && end2 === 'closed') {
            phaseProportion = 0;
            numWavelengths = harmonicNumber * 0.5;
        } else if (end1 === 'open' && end2 === 'open') {
            phaseProportion = 0.25;
            numWavelengths =  harmonicNumber * 0.5;
        } else if (end1 === 'closed' && end2 === 'open') {
            phaseProportion = 0;
            numWavelengths = 0.25 + (harmonicNumber - 1) * 0.5;
        } else if (end1 === 'open' && end2 === 'closed') {
            phaseProportion = 0.25;
            numWavelengths = 0.25 + (harmonicNumber - 1) * 0.5;
        } else {
            console.log('ERROR: unallowed harmonic type');
        }

        super(numWavelengths,amplitude,wavelength,phaseProportion);
        super.addSecondHalf(true);

    }


    circleNodes(filled, radius) {
        super.circleCenterPoints(filled, radius);
    }

    circleAntiNodes(filled, radius) {
        super.circleTroughs(filled, radius);
        super.circleCrests(filled, radius);
        super.circlePoints(0.25,-1 * this.amplitude, filled, radius);
        super.circlePoints(0.75, this.amplitude, filled, radius);
    }


}
