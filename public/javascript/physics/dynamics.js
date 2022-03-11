
// this class should be an Inner class of the 'mehcanics' class!!! but javascript has no inner classes :(
// this class should exist ONLY inside of a MECHANICS!!!
class Actor {
    constructor(name, mass, initialPosition, initialVelocity) {
      this.name = name; /// a string
      this.mass = mass; /// a scalar object
      this.initialPosition = initialPosition; // a vector object
      this.initialVelocity = initialVelocity; // a scalar object
      this.forces = [];
    }


    drawFreeBodyDiagram(time = 0) { // draws free-body diagram at some time

    }

    findNetForce(time = 0) { // returns free-body diagram at some time [returns a diagram object]
      let netForceSoFar = constructZeroVector();/// the variable inside of this should be net force
      this.forces.forEach((force) => {
        netForceSoFar = netForceSoFar.addVector(force); /// what if forces vary with time???? // add net force as a variable!
      });
      return netForceSoFar
    }

    findAcceleration(time = 0) {
      return findNetForce(time).divideByScalar(this.mass)
    }



}

// magnitude and direction should be functions, but can be entered as constant functions????
/// should be an INNER CLASS of mechanics!!!
class Force {
  constructor(type, agent, object, magnitude, direction) {

  }
}


/// make it only 'dynamics' or 'mechanics'????
class Mechanics() { /// a dynamics situation occuring at only one instant
  constructor(name) {
    this.name = name;
  }

  this.addActor() {

  }

  this.addInteraction() { /// adds two forces

  }
}
