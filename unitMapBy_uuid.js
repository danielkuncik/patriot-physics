const unitMap = require(__dirname + '/public/unit_map.json');

let unitMapBy_uuid = {};

Object.keys(unitMap).forEach((superUnitKey) => {
    unitMapBy_uuid[unitMap[superUnitKey].uuid] = {
        "type": "superUnit",
        "superUnitKey": superUnitKey
    };
    Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
        unitMapBy_uuid[unitMap[superUnitKey].units[unitKey].uuid] = {
            "type": "unit",
            "superUnitKey": superUnitKey,
            "unitKey": unitKey
        };
        Object.keys(unitMap[superUnitKey].units[unitKey].pods).forEach((podKey) => {
            unitMapBy_uuid[unitMap[superUnitKey].units[unitKey].pods[podKey].uuid] = {
                "type": "pod",
                "superUnitKey": superUnitKey,
                "unitKey": unitKey,
                "podKey": podKey
            };
        });
    });
});

module.exports = {
    unitMapBy_uuid
};