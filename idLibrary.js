const unitMap = require(__dirname + '/public/unit_map');

let idLibrary = {};

Object.keys(unitMap).forEach((superUnitKey) => {
  idLibrary[unitMap[superUnitKey].id] = {
    type: "superUnit",
    superUnitKey: superUnitKey
  }
  Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
    idLibrary[unitMap[superUnitKey].units[unitKey].id] = {
      type: "unit",
      superUnitKey: superUnitKey,
      unitKey: unitKey
    }
    Object.keys(unitMap[superUnitKey].units[unitKey].pods).forEach((podKey) => {
      idLibrary[unitMap[superUnitKey].units[unitKey].pods[podKey].id] = {
        type: "pod",
        superUnitKey: superUnitKey,
        unitKey: unitKey,
        podKey: podKey
      }
    });
  });
});

module.exports = {
  idLibrary
}
