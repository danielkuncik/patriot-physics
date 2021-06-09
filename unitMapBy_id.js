const unitMap = require(__dirname + '/public/unit_map.json');

let unitMapBy_id = {};

Object.keys(unitMap).forEach((superUnitKey) => {
    unitMapBy_id[unitMap[superUnitKey].id] = {
        "type": "superUnit",
        "superUnitKey": superUnitKey
    };
    Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
        unitMapBy_id[unitMap[superUnitKey].units[unitKey].id] = {
            "type": "unit",
            "superUnitKey": superUnitKey,
            "unitKey": unitKey
        };
        Object.keys(unitMap[superUnitKey].units[unitKey].pods).forEach((podKey) => {
            unitMapBy_id[unitMap[superUnitKey].units[unitKey].pods[podKey].id] = {
                "type": "pod",
                "superUnitKey": superUnitKey,
                "unitKey": unitKey,
                "podKey": podKey
            };
        });
    });
});

module.exports = {
    unitMapBy_id
};