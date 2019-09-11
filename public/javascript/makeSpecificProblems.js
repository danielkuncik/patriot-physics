
function makeCircuitProblem(type, voltage, resistorArray, powerRowBoolean) {
    let circuit;
    if (type === 'series') {
        circuit = makeSeriesCircuit(voltage, resistorArray);
    } else if (type === 'parallel') {
        circuit = makeParallelCircuit(voltage, resistorArray);
    }
    let myTable = new CircuitTable(resistorArray.length, powerRowBoolean);
    let containerDiv = $("<div class = 'container'></div>");
    let rowDiv = $("<div class = 'row'></div>");
    let circuitDiv = $("<div class = 'col-md-6'></div>");
    let tableDiv = $("<div class = 'col-md-6'></div>");
    $(tableDiv).append(myTable.table);
    $(circuitDiv).append(circuit.drawCanvas(400,300));
    $(rowDiv).append(circuitDiv);
    $(rowDiv).append(tableDiv);
    $(containerDiv).append(rowDiv);

    return containerDiv
}