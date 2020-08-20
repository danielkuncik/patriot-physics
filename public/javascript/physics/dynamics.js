
// this class should be an Inner class of the 'mehcanics' class!!! but javascript has no inner classes :(
// this class should exist ONLY inside of a MECHANICS!!!
class Actor {
    constructor(name, mass, initialPosition, initialVelocity) {
      this.name = name; /// a string
      this.mass = mass; /// a scalar object
      this.initialPosition = initialPosition; // a vector object
      this.initialVelocity = initialVelocity; // a scalar object
    }


    drawFreeBodyDiagram(time = 0) { // draws free-body diagram at some time

    }

    findNetForce(time = 0) { // returns free-body diagram at some time [returns a diagram object]

    }

    findAcceleration(time = 0) {

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

  addActor() {

  }

  this.addInteraction() { /// adds two forces

  }
}
