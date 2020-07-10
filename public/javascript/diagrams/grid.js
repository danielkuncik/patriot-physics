class Grid extends Diagram {
    constructor(numBoxesHorizontal, numBoxesVertical, thickness, boxWidth, boxHeight) {
        if (numBoxesHorizontal === undefined) {numBoxesHorizontal = 20;}
        if (numBoxesVertical === undefined) {numBoxesVertical = 10;}
        if (thickness === undefined) {thickness = 1;}
        if (boxWidth === undefined) {boxWidth = 1;}
        if (boxHeight === undefined) {boxHeight = 1;}
        super();

        const totalHeight = numBoxesVertical * boxHeight;
        const totalWidth = numBoxesHorizontal * boxWidth;

        let q;
        for (q = 0; q <= numBoxesHorizontal; q++) {
            let newSegment = super.addSegment(new Point(q * boxWidth, 0), new Point((q * boxWidth), totalHeight));
            newSegment.setThickness(thickness);
        }
        for (q = 0; q <= numBoxesVertical; q++) {
            let newSegment = super.addSegment(new Point(0, q * boxHeight), new Point(totalWidth, q * boxHeight));
            newSegment.setThickness(thickness);
        }
    }

    // how do i put something on it?
}
