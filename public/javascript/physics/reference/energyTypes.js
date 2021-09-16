const energyTypes = {
    "ke": {
        "name": "Kinetic Energy"
    },
    "pe": {
        "name": "Potential Energy"
    },
    "tke": {
        "name": "Translational Kinetic Energy"
    },
    "rke": {
        "name": "Rotational Kinetic Energy"
    },
    "te": {
        "name": "Thermal Kinetic Energy"
    },
    "cpe": {
        "name": "Chemical Potential Energy"
    },
    "gpe": {
        "name": "Gravitational Potential Energy"
    },
    "epe": {
        "name": "Elastic Potential Energy"
    },
    "ecpe": {
        "name": "Electrochemical Potential Energy"
    },
    "le": {
        "name": "Light Energy"
    },
    "emwe": {
        "name": "Electromagnetic Wave Kinetic Energy"
    },
    "mwe": {
        "name": "Mechanical Wave Kinetic Energy"
    },
    "ne": {
        "name": "Nuclear Potential Potential Energy"
    },
    "se": {
        "name": "Sound Energy"
    },
    "ee": {
        "name": "Electrical Kinetic Energy"
    }
};

function writtenEnergySelectionProblem(statement, typeArray = Object.keys(energyTypes), answerKey) {
    let choiceArray = [];
    typeArray.forEach((type) => {
        choiceArray.push(energyTypes[type].name);
    });
    let problem = new Problem();
    problem.addQuestionString(statement);
    problem.addDropdown(choiceArray);
    problem.addAnswer('energy', energyTypes[answerKey].name, undefined, undefined, true);
    return problem
}