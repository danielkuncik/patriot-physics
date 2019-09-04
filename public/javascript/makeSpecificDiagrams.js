/*
This is a follow-up on physics Diagram Generation

physicsDiagramGeneration.js creates objects and methods to make diagrams used in physics class


makeSpecificDiagrams.js creates functions that quickly generate specific types of diagrams
 */


// creates a position-time graph from from time 0 to tmax and position 0 to positionMax
// with aspect ratio 1
function makeParabolicPTgraph(tMax, positionMax, acceleration, initialVelocity, initialPosition) {
    if (acceleration === undefined) {acceleration = 1;}
    if (initialVelocity === undefined) {initialVelocity = 0;}
    if (initialPosition === undefined) {initialPosition = 0;}
    let positionFunction = ((t) => {return 0.5 * acceleration * t * t + initialVelocity * t + initialPosition;});
    if (positionMax === undefined) {positionMax = positionFunction(tMax);}

    let myGraph = new QuantitativeGraph(0,tMax,0,positionMax,1);
    myGraph.labelAxes('time (s)', 'position (m)');
    myGraph.addReferenceArray([tMax],[positionMax]);
    myGraph.addFunctionGraph(positionFunction, 0, tMax);

    return myGraph
}
