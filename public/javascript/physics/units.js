/*
creating an object for units

temperature will work a little different here!!
*/


class Dimension {
  constructor(name, SIUnit) {
    this.name = name;
    this.otherNames = [];
    this.SIUnit = undefined;
    this.otherUnits = [];
  }
}

const BaseDimension extends Dimension {

}

const DerivedDimension extends Dimension {

}

class Unit {

}


const Length = new Dimension('length');
