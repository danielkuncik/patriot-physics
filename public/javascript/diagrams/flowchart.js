
class Flowchart extends DiagramF {
    arrow(direction, message) {
        let secondPoint;
        if (direction === 'right') {
            secondPoint = new PointF(1,0);
        } else if (direction === 'left') {
            secondPoint = new PointF(-1,0);
        } else if (direction === 'up') {
            secondPoint = new PointF(0,1);
        } else if (direction === 'down') {
            secondPoint = new PointF(0,-1);
        } else {
            return false
        }
        let diagram = new DiagramF();
        diagram.addArrow(origin, secondPoint);
        if (message) {
            diagram.labelLineAbove(origin, secondPoint,message);
        }
        return diagram
    }

    rightArrow(message) {
        return arrow('right',message);
    }

    leftArrow(message) {
        return arrow('left', message);
    }

    upArrow(message) {
        return arrow('up', message);
    }

    downArrow(message) {
        return arrow('down', message);
    }

}