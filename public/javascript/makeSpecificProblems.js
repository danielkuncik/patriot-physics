
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
    let myTable = new CircuitTable(resistorArray.length, powerRowBoolean);
    let containerDiv = $("<div class = 'container'></div>");
    let rowDiv = $("<div class = 'row'></div>");
    let circuitDiv = $("<div class = 'col-md-6'></div>");
    let tableDiv = $("<div class = 'col-md-6'></div>");
    $(tableDiv).append(myTable.table);
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


//// I already created something like this, it was a success! so lets make more like this, on the same model
class KinematicsProblem {
  constructor(initial_velocity, acceleration, time_interval, initial_position) {
    if (initial_position === undefined) {
      initial_position = 0;
    }
    this.initial_velocity = initial_velocity;
    this.current_time = time_interval;
    this.initial_position = initial_position;
    this.current_velocity = initial_velocity + acceleration * time_interval;
    this.current_position = initial_velocity * time_interval + 0.5 * acceleration * time_interval**2;
    this.displacement = this.current_position - initial_position;

    this.currentVelocity = final_velocity;

    this.steps = [];
    this.addStep(initial_velocity, acceleration, time_interval, initial_position);
  }


  function addStep(acceleration, delta_t) {
    const vi = this.current_velocity;
    const delta_v = acceleration * delta_t;
    const vf = vi + delta_v;
    const delta_x = vi * delta_t + 0.5 * acceleration * delta_t**2;
    this.current_time += delta_t;
    this.current_velocity += delta_v;
    this.current_position += delta_x;

    this.steps.push({
      initial_velocity:vi,
      final_velocity:vf,
      delta_v:vi,
      delta_t:delta_t,
      delta_x:delta_x,
      acceleration:acceleration
    });

    this.total_displacement = this.current_position - this.initial_position;
    this.average_velocity = this.total_displacement / this.current_time;
    this.average_acceleration = (this.current_velocity - this.initial_velocity) / this.current_time;
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
