class UnitMap extends DiagramF {
    constructor() {
        super();
        this.pods = {};
        this.radius = 1;
        this.horizontalSpaceBetween = 1;
        this.verticalSpaceBetween = 1;
    }

    addPod(key, letter, level, horizontalPosition, prerequisites, score) {
        let x, y, newPod;
        if (score === undefined) {score = 0;}
        let fillColor = grayscale0to20(score);
        let textColor = "#000000"; // text is black if score is 10 or less and white if 10 or more
        if (score > 10) {textColor = "#FFFFFF";}
        newPod =
            {
                "letter": letter,
                "level": level,
                "horizontalPosition": horizontalPosition,
                "prerequisites": prerequisites,
                "fillColor": fillColor,
                "textColor": textColor
            };
        x = (horizontalPosition - 1) * (this.horizontalSpaceBetween + this.radius * 2);
        y = (level - 1) * (this.verticalSpaceBetween + this.radius * 2);
        newPod.center = new PointF(x,y);

        this.pods[key] = newPod;

        let podCircle = super.addCircle(newPod.center,this.radius);
        let podText = super.addText(letter, newPod.center, this.radius * 1.3);
        podText.setColor(newPod.textColor);
        podCircle.setFillColor(newPod.fillColor);
        podCircle.fill();

        return this.pods[key];
    };

    searchForPod(podKey) {
        if (isXinArray(podKey,Object.keys(this.pods))) {
            return this.pods[podKey]
        } else {
            return false
        }
    }

    // draws a segement between two existing pods
    connectTwoPods(podKey1, podKey2) {
        let pod1 = this.searchForPod(podKey1);
        let pod2 = this.searchForPod(podKey2);
        if (pod1 && pod2) {
            // add something that stops it if the podKey cannot be find
            let theta = this.pods[podKey1].center.getAngleToAnotherPoint(this.pods[podKey2].center);
            let startPoint = this.pods[podKey1].center.getAnotherPointWithTrig(this.radius, theta);
            let endPoint = this.pods[podKey2].center.getAnotherPointWithTrig(this.radius, theta + Math.PI);
            let newSegment = super.addSegmentWithArrowheadInCenter(startPoint, endPoint, this.horizontalSpaceBetween * 0.4, 30);
            newSegment.setThickness(2);
            return newSegment
        } else {
            return false
        }
    };


    // function to add segments between all pods and prerequisite pods
    connectPrerequisites() {
        Object.keys(this.pods).forEach((podKey) => {
            let thisPod = this.pods[podKey];
            thisPod.prerequisites.forEach((preReq) => {
                this.connectTwoPods(preReq, podKey);
            });
        });
    }

    getMaxLevel() {
        let currentMaxLevel = 0;
        Object.keys(this.pods).forEach((podKey) => {
            if (this.pods[podKey].level > currentMaxLevel) {currentMaxLevel = this.pods[podKey].level;}
        });
        return currentMaxLevel
    }

    getMaxHorizontalPosition() {
        let currentMaxHorizontalPosition = 0;
        Object.keys(this.pods).forEach((podKey) => {
            if (this.pods[podKey].level > currentMaxHorizontalPosition) {currentMaxHorizontalPosition = this.pods[podKey].level;}
        });
        return currentMaxHorizontalPosition
    }

}
