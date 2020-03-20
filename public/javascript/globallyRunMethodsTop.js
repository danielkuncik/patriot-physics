
// container for answerIDs
let answerObjects = {};

function addAnswerObject(id, object) {
    answerObjects[id] = object;
}


let questionListAlreadyCreated = false; /// this global variable makes it so that
// the question and answer list function is run only once



