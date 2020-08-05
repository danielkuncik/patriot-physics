
class InteractionDiagram extends Diagram {
    constructor() {
        super();

        this.actors = {};
        this.interactions = {};
        this.system = [];

        this.fontSize = 1;

    }

    //    TEXT: constructor(letters, referencePoint, relativeFontSize, rotationAngleInRadians, positioning) {
    // NAMES MUST BE UNIQUE!
    addActor(name, xPosition, yPosition, horizontalExtension, verticalExtension) {
        let newActor = {
            centerPoint: new Point(xPosition, yPosition),
            horizontalExtension: horizontalExtension,
            verticalExtension: verticalExtension
        };
        this.actors[name] = newActor;
    }

    /// need to add some checks here to make sure it doesn't break!!!
    addActorToSystem(actor) {
        this.system.push(actor);
    }

    /// need to check that the actors are already added, otherwise it throws an error
    addInteraction(name, actor1, actor2) {
        const existingInteractionKey = this.findInteractions(actor1, actor2);
        if (existingInteractionKey) {
            this.interactions[existingInteractionKey].push(name);
        } else {
            const newKey = `${actor1}:::${actor2}`;
            this.interactions[newKey] = [name];
        }
    }

    findInteractions(actor1, actor2) {
        const keys = Object.keys(this.interactions);
        let i;
        let result = undefined;
        for (i = 0; i < keys.length; i++) {
            let actors = keys[i].split(':::');
            if (actor1 === actors[0] && actor2 === actors[1]) {
                result = keys[i];
                break;
            } else if (actor1 === actors[1] && actor2 === actors[0]) {
                result = keys[i];
                break;
            }
        }
        return result
    }

    drawCanvas(maxWidth, maxHeight, forceSize, unit, wiggleRoom) {
        // draw each actor
        Object.keys(this.actors).forEach((name) => {
            const actor = this.actors[name];
            let newText = this.addText(name, actor.centerPoint, this.fontSize);
            newText.drawBoxAround(this, actor.horizontalExtension, actor.verticalExtension);
            this.actors[name].xMin = newText.rangeBox.lowerLeftPoint.x - actor.horizontalExtension;
            this.actors[name].xMax = newText.rangeBox.lowerRightPoint.x + actor.horizontalExtension;
            this.actors[name].yMin = newText.rangeBox.lowerLeftPoint.y - actor.verticalExtension;
            this.actors[name].yMax = newText.rangeBox.upperLeftPoint.y + actor.verticalExtension;
        });

        // draw each interaction
        Object.keys(this.interactions).forEach((key) => {
            const theseActors = key.split(':::');
            const actor1 = this.actors[theseActors[0]];
            const actor2 = this.actors[theseActors[1]];

            let index = 0;
            const theta = actor1.centerPoint.getAngleToAnotherPoint(actor2.centerPoint) + Math.PI / 2;
            let currentDisplacement = 0, evenNumberForces;
            if (this.interactions[key].length % 2 === 0) {
                evenNumberForces = true;
                currentDisplacement = -1 * this.fontSize / 2;
            } else {
                evenNumberForces = false;
            }
            this.interactions[key].forEach((interaction) => {
                // let point1 = new Point(actor1.centerPoint.x, actor1.centerPoint.y); // duplicated
                // let point2 = new Point(actor2.centerPoint.x, actor2.centerPoint.y);
                let phi = theta;
                if (evenNumberForces && index % 2 === 0) { // for even total number, add displacement on all even forces
                    currentDisplacement += this.fontSize;
                } else if (!evenNumberForces && index % 2 === 1) { // for odd total number, add displacement on all odd forces
                    currentDisplacement += this.fontSize;
                }
                if (index % 2 === 0) {
                    phi += Math.PI;
                }
                let point1  = actor1.centerPoint.translateAndReproducePolar(currentDisplacement, phi);
                let point2  = actor2.centerPoint.translateAndReproducePolar(currentDisplacement, phi);
                super.addSegment(point1, point2);
                super.labelLineAbove(point1,point2,interaction);
                index++;
            });
        });

        // draw system
        if (this.system.length > 0) {
            let systemXmin, systemYmin, systemXmax, systemYmax;
            this.system.forEach((actorName) => {
                const actorObject = this.actors[actorName];
                if (actorObject.xMin < systemXmin || systemXmin === undefined) {
                    systemXmin = actorObject.xMin;
                }
                if (actorObject.xMax > systemXmax || systemXmax === undefined) {
                    systemXmax = actorObject.xMax;
                }
                if (actorObject.yMin < systemYmin || systemYmin === undefined) {
                    systemYmin = actorObject.yMin;
                }
                if (actorObject.yMax > systemYmax || systemYmax === undefined) {
                    systemYmax = actorObject.yMax;
                }
            });
            systemXmin -= this.fontSize*1.2;
            systemXmax += this.fontSize*1.2;
            systemYmin -= this.fontSize*1.2;
            systemYmax += this.fontSize*1.2;

            let systemLowerLeft = new Point(systemXmin, systemYmin);
            let systemLowerRight = new Point(systemXmax, systemYmin);
            let systemUpperLeft = new Point(systemXmin, systemYmax);
            let systemUpperRight = new Point(systemXmax, systemYmax);

            super.addDottedLine(systemLowerLeft,systemLowerRight);
            super.addDottedLine(systemLowerRight, systemUpperRight);
            super.addDottedLine(systemUpperRight,systemUpperLeft);
            super.addDottedLine(systemUpperLeft, systemLowerLeft);
        }

        return super.drawCanvas(maxWidth, maxHeight, forceSize, unit, wiggleRoom);
    }
}

