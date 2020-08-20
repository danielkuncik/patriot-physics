
/// shoudl the constructor just take two angleObjects as arguments????
class Direction {
  constructor(thetaObject, phiObject) {
    /// phi can only be between 0 and 180??? not more
    // phi must be from negtive 90 to 90, make sure this is confirmed
    // theta must be from 0 to 360
    this.thetaObject = thetaObject;

    if (phiObject.getFloat() <= 90 && <= -90) {
      this.phiObject = phiObject;
    } else {
      console.log('ERROR: out of range given for angle phi');
      return this.invalidate()
    }
  }

  invalidate() {
    this.thetaOject = undefined;
    this.phiObject = undefined;
    return false
  }

}

function constructDirectionFromStrings(thetaInDegreesString, phiInDegreesString, thetaIntermediateValue, phiIntermediateValue, thetaExact, phiExact) {
  let thetaObject = new Angle(thetaInDegreesString, true, thetaIntermediateValue, thetaExact);
  let phiObject = new Angle(phiInDegreesString, true, phiIntermediateValue, phiExact);
  return new Direction(thetaObject, phiObject)
}

function constructDirectionFromFloats(thetaFloat, thetaNumSigFigs, phiFloat, phiNumSigFigs, thetaExact, phiExact) {
  let thetaObject = constructAngleFromFloat(thetaFloat, thetaNumSigFigs, true, thetaExact);
  let phiObject = constructAngleFromFloat(phiFloat, phiNumSigFigs, true, phiExact);
  return new Direction(thetaObject, phiObject)
}

function constructDirectionFromWord(word) {
  let thetaString, phiString;
  switch(word){
    case 'right':
      thetaString = '0';
      phiString = '0';
      break;
    case 'left':
      thetaString = '180';
      phiString = '0';
      break;
    case 'north':
      thetaString = '90';
      phiString = '0';
      break;
    case 'south':
      thetaString = '270';
      phiString = '0'
      break;
    case 'east':
      thetaString = '0';
      phiString = '0';
      break;
    case 'west':
      thetaString = '180';
      phiString = '0';
      break;
    case 'up':
      thetaString = '0';
      phiString = '90';
      break;
    case 'down':
      thetaString = '0';
      phiString = '-90';
      break;
    case 'northeast':
      thetaString = '45';
      phiString = '0';
      break;
    case 'southeast':
      thetaString = '315';
      phiString = '0';
      break
    case 'southwest':
      thetaString = '225';
      phiString = '0';
      break;
    case 'northwest':
      thetaString = '135';
      phiString = '0';
      break
    default:
      thetaString = undefined;
      phiString = undefined;
  }

  if (thetaString && phiString) {
    return constructDirectionFromStrings(thetaString, phiString, undefined, undefined, true, true);
  } else {
    return false
  }
}
