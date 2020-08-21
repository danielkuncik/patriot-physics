const constants = {
    "pi": {
        "unit": null,
        "value": 3.14159265358979323846,
        "sigFigs": 21,
        "universal": true
    }
};

function getConstantMagnitude(name) {
    const constantObj = constants[name];
    return constructMagnitudeFromFloat(constantObj.value, constantObj.sigFigs, constantObj.unit)
}