
class Flowchart extends Diagram {
    arrow(direction, message) {
        let secondPoint;
        if (direction === 'right') {
            secondPoint = new Point(1,0);
        } else if (direction === 'left') {
            secondPoint = new Point(-1,0);
        } else if (direction === 'up') {
            secondPoint = new Point(0,1);
        } else if (direction === 'down') {
            secondPoint = new Point(0,-1);
        } else {
            return false
        }
        let diagram = new Diagram();
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