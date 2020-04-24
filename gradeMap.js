const unitMap = require(__dirname + '/public/unit_map');


function getPodKeysByUUID(uuid) {
    let selectionObject;
    let done = false;
    Object.keys(unitMap).some((superUnitKey) => {
        if (done) {
            return true
        }
        Object.keys(unitMap[superUnitKey].units).some((unitKey) => {
            if (done) {
                return true
            }
            Object.keys(unitMap[superUnitKey].units[unitKey].pods).some((podKey) => {
                if (uuid === unitMap[superUnitKey].units[unitKey].pods[podKey].uuid) {
                    selectionObject = {
                        superUnitKey: superUnitKey,
                        unitKey: unitKey,
                        podKey: podKey
                    };
                    done = true;
                }
                return done
            });
        });
    });
    return selectionObject
}

class GradeMap {
    constructor() {
        this.map = this.makeBlankMap();
        this.setAllPodValues();
        this.overallLevel = 0;

    }

    makeBlankMap() {
        let blankMap = {};
        Object.keys(unitMap).forEach((superUnitKey) => {
            blankMap[superUnitKey] = {
                units: {}
            };
            Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
                blankMap[superUnitKey].units[unitKey] = {
                    level: 0,
                    pods: {}
                };
                Object.keys(unitMap[superUnitKey].units[unitKey].pods).forEach((podKey) => {
                    let level = unitMap[superUnitKey].units[unitKey].pods[podKey].level;
                    if (level === undefined) {
                        level = 0;
                    }
                    blankMap[superUnitKey].units[unitKey].pods[podKey] = {
                        score: 0,
                        level: level,
                        pending: false
                    }
                });
            });
        });
        return blankMap
    }

    setPodValuesInOneUnit(superUnitKey, unitKey) {
        let currentLevel;
        let podsObject = this.map[superUnitKey].units[unitKey].pods;
        for (currentLevel = 1; currentLevel <= 5; currentLevel++) {
            let podsKeysForThisLevel = [];
            Object.keys(podsObject).forEach((podKey) => {
                if (podsObject[podKey].level === currentLevel) {
                    podsKeysForThisLevel.push(podKey);
                }
            });
            let value = 1 / podsKeysForThisLevel.length;
            podsKeysForThisLevel.forEach((podKey) => {
                this.map[superUnitKey].units[unitKey].pods[podKey].value = value;
            });
        }

        // all level 6 pods have a value of 1
        let level6PodKeys = [];
        Object.keys(podsObject).forEach((podKey) => {
            if (podsObject[podKey].level === 6) {
                level6PodKeys.push(podKey);
            }
        });
        level6PodKeys.forEach((podKey) => {
            this.map[superUnitKey].units[unitKey].pods[podKey].value = 1;
        });
    }

    setAllPodValues() {
        Object.keys(unitMap).forEach((superUnitKey) => {
            Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
                this.setPodValuesInOneUnit(superUnitKey, unitKey);
            });
        });
    }

    addScore(pod_uuid, score) {
        if (score === undefined) {
            score = 0;
        }
        if (score < 0) {
            score = 0
        } else if (score > 18) {
            score = 20;
        }
        let selectionObject = getPodKeysByUUID(pod_uuid);
        if (selectionObject) {
            this.map[selectionObject.superUnitKey].units[selectionObject.unitKey].pods[selectionObject.podKey].score = score;
        }
    }

    setQuizPending(pod_uuid) {
        const selectionObject = getPodKeysByUUID(pod_uuid);
        if (selectionObject) {
            this.map[selectionObject.superUnitKey].units[selectionObject.unitKey].pods[selectionObject.podKey].pending = true;
        }
    }

    calculateUnitLevel(superUnitKey, unitKey) {
        let podsObject = this.map[superUnitKey].units[unitKey].pods;
        let level = 0;
        Object.keys(podsObject).forEach((podKey) => {
            let score = podsObject[podKey].score;
            let value = podsObject[podKey].value;
            level += score / 20 * value;
        });
        let roundedLevel = Math.floor(level * 10) / 10;
        this.map[superUnitKey].units[unitKey].level = roundedLevel;
        return roundedLevel
    }

    calculateAllUnitLevels() {
        Object.keys(unitMap).forEach((superUnitKey) => {
            Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
                this.calculateUnitLevel(superUnitKey, unitKey);
            });
        });
    }

    calculateOverallLevel() {
        let level = 0;
        Object.keys(unitMap).forEach((superUnitKey) => {
            Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
                level += this.map[superUnitKey].units[unitKey].level;
            });
        });
        this.overallLevel = Math.floor(level);
        return this.overallLevel
    }
}

module.exports = {
    GradeMap
};
