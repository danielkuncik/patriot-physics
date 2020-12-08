
// how do i get circuit problems to work?
/// add series element, addd parallel element



function makeCircuitProblem(type, voltage, resistorArray, powerRowBoolean, note) {
    let circuit;
    if (type === 'series') {
        circuit = makeSeriesCircuit(voltage, resistorArray);
    } else if (type === 'parallel') {
        circuit = makeParallelCircuit(voltage, resistorArray);
    }
    if (powerRowBoolean === undefined) { // default is to ahve a power row
        powerRowBoolean = true;
    }
    //function CircuitTable(numResistors, powerRowBoolean, width, height, unit) {
    let myTable = new ElectricCircuitTable(resistorArray.length, powerRowBoolean);
    let containerDiv = $("<div class = 'container'></div>");
    let rowDiv = $("<div class = 'row'></div>");
    let circuitDiv = $("<div class = 'col-md-6'></div>");
    let tableDiv = $("<div class = 'col-md-6'></div>");
    $(tableDiv).append(myTable.draw());
    $(circuitDiv).append(circuit.drawCanvas(400,300));
    if (note) {
        $(circuitDiv.append($(`<p>${note}</p>`)));
    }
    $(rowDiv).append(circuitDiv);
    $(rowDiv).append(tableDiv);
    $(containerDiv).append(rowDiv);

    return containerDiv
}




function oneStepKinematicsProblem(initial_velocity, acceleration, time_interval, initial_position) {
  if (initial_position === undefined) {
    initial_position = 0;
  }
  let final_velocity = initial_velocity + acceleration * time_interval;
  let final_position = initial_velocity * time_interval + 0.5 * acceleration * time_interval**2;
  let displacement = final_position - initial_position;
  return {
    initial_position: initial_position,
    final_position: final_position,
    initial_velocity: initial_velocity,
    final_velocity: final_velocity,
    acceleration: acceleration,
    displacement: displacement
  }
}



function simpleMomentumProblem(massA, massB, viA, viB, vfA) {
  let piA = massA * viA;
  let piB = massB * viB;
  let pfA = massA * vfA;
  let total_momentum = piA + piB;
  let pfB = total_momentum - pfA;
  let vfB = pfB / massB;
  return {
    massA: massA,
    massB: massB,
    viA: viA,
    viB: viB,
    piA: piA,
    piB: piB,
    vfA: vfA,
    vfB: vfB,
    pfA: pfA,
    pfB: pfB,
    total_momentum: total_momentum
  }
}
