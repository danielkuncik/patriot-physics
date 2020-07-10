














// class GeometryPad extends Diagram {
//     constructor() {
//         super();
//     }
//
//     goldenRatio() {
//         return 1.61803398875
//     }
//
//     // how does the label object work?
//
//     addSegment(pointA, pointB, lineName, labelObject, aboveOrBelow) {
//         super.addSegment(pointA, pointB);
//         if (labelObject[lineName]) {
//             if (aboveOrBelow === 'above') {
//                 super.labelLineAbove(pointA, pointB, labelObject[lineName]);
//             } else if (aboveOrBelow === 'below') {
//                 super.labelLineBelow(pointA, pointB, labelObject[lineName]);
//             }
//         }
//     }
//
//     addRectangle(lowerLeftCorner, width, height, labelObject) {
//         if (lowerLeftCorner === undefined) {
//             lowerLeftCorner = origin;
//         }
//         if (width === undefined) {
//             width = 1;
//         }
//         if (height === undefined) {
//             height = width / this.goldenRatio();
//         }
//         let lowerRightCorner = lowerLeftCorner.translateAndReproduce(width, 0);
//         let upperRightCorner = lowerLeftCorner.translateAndReproduce(width, height);
//         let upperLeftCorner = lowerLeftCorner.translateAndReproduce(0, height);
//
//         this.addSegment(lowerLeftCorner,lowerRightCorner,'bottom',labelObject,'below');
//         this.addSegment(lowerRightCorner,upperRightCorner,'right',labelObject,'below');
//         this.addSegment(upperRightCorner,upperLeftCorner,'top',labelObject,'above');
//         this.addSegment(upperLeftCorner,lowerLeftCorner,'left',labelObject,'above');
//     }
//
//     addSquare(lowerLeftCorner, sideLength, labelObject) {
//         if (sideLength === undefined) {
//             sideLength = 1;
//         }
//         this.addRectangle(lowerLeftCorner, sideLength, sideLength, labelObject);
//     }
//
//     addTriangleFromVerticies(vertexA, vertexB, vertexC, labelObject) {
//         this.addSegment(vertexA, vertexB, 'C', labelObject, 'above');
//         this.addSegment(vertexB, vertexC, 'A', labelObject, 'above');
//         this.addSegment(vertexC, vertexA, 'B', labelObject, 'above');
//     }
//
//     addTriangleSAS(vertexA, side1, angleInDegrees, side2, labelObject) {
//         if (vertexA === undefined) {
//             vertexA = origin;
//         }
//         let vertexB = vertexA.translateAndReproduce(side1, 0);
//         let angleInRadians = convertDegreesToRadians(angleInDegrees);
//         let vertexC = vertexB.translateAndReproduce(-1 * side2 * Math.cos(angleInRadians), side2 * Math.sin(angle));
//         this.addTriangleFromVerticies(vertexA, vertexB, vertexC, labelObject);
//     }
//
//     addTriangleSSS(vertexA, side1, side2, side3, labelObject) {
//         let angleB = this.getAngleFromLawOfCosines(side3, side1, side2); // in degrees
//         this.addTriangleSAS(vertexA, side2, angleB, side2, labelObject);
//
//     }
//
//
//     addTriagnleASA(vertexA, angle1inDegrees, side, angle2inDegrees, labelObject) {
//         if (vertexA === undefined) {
//             vertexA = origin;
//         }
//         let angle1inRadians = convertDegreesToRadians(angle1inDegrees);
//         let angle2inRadians = convertDegreesToRadians(angle2inDegrees);
//     }
//
//     // should these all be objects? // i really don't want it to be that involved...
//     /// whenever i try that, i go down a rabbit hole, i want somehting for making quick geometric diagrams
//     // but i'm thinking this might jsut not work...
// }
