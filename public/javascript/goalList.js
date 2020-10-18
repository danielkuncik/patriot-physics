/*
This file will contain information to list goal.

- goal list by date
- goal list by

 */

const testGoals = {
    "science_practice": {
        "scientific_reasoning": {
            "1": "10-22-2020",
            "2": "10-29-2020"
        }
    },
    "kinematics": {
        "forward_kinematics_qualitative": {
            "1": "10-22-2020",
            "2": "10-22-2020",
            "3": "10-29-2020"
        },
        "forward_kinematics_quantitative": {
            "1": "10-22-2020",
            "2": "10-22-2020",
            "3": "10-22-2020",
            "4": "10-29-2020"
        }
    },
    "dynamics": {
        "identifying_forces": {
            "1": "10-22-2020",
            "2": "10-29-2020"
        },
        "quantitative_dynamics": {
            "1": "10-22-2020",
            "2": "10-22-2020",
            "3": "10-22-2020",
            "4": "10-29-2020"
        },
        "vector_force_analysis": {
            "1": "10-22-2020",
            "2": "10-29-2020",
            "3": "10-29-2020"
        }
    }
};

const monthDictionary = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const dayDictionary = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

class DueDate { // date string must be formatated as 7-4-1776
    constructor(dateString) {
        const array = dateString.split('-');
        const month = Number(array[0]) - 1;
        const day = Number(array[1]);
        const year = Number(array[2]);
        this.date = new Date(year, month, day);
        console.log(this.date);
    }

    print() {
        const month = monthDictionary[this.date.getMonth()];
        const day = this.date.getDate();
        const year = this.date.getFullYear();
        const dayOfWeek = dayDictionary[this.date.getDay()];
        const string = `${dayOfWeek} ${month} ${day}, ${year} (11:59 pm)`;
        return string
    }
}


// should i bring the unit map to the front end
function listGoalsByTopic(goalsObject) {
    let bigList = $("<ul></ul>");
    Object.keys(goalsObject).forEach((superUnitKey) => {

    });
    return bigList
}