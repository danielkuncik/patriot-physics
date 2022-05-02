
/*
4-29-2022

where i am going with this:

- make a quiz into an object
- make a general store of questions, that are organized and not reordered
- 'generate quiz version' should make a new version of the quiz that reorders questions, all questions are saved along
with the general store
- then make functions for generate written quiz (with num versions as an input), generate autoquiz (front end), and generate autoquiz (back end)

- generate auto quiz back end would create redis keys for all answers (can it coexist with front end javascript??)


 */
const numberToLetter_X = [
    "A","B","C","D","E","F","G","H","I","J",'K',"L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
];
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
// i really gotta make this into an object!!!!
// and then have methods to produce a written quiz or an automated quiz

// right now, all these functions are hard wired to produce only written quizzes  :( :( :(

class quiz {
    constructor(quizJSONData, title, numberOfVersions = 1, randomizeAll) {

    }


    generateWrittenQuiz() {

    }
}

// figure out how to put in a title, in the json or outside of it???
function generateWrittenQuiz(quizJSONData, title, numberOfVersions = 1, randomizeAll) {
    const quizJSON = quizJSONData.isArray ? quizJSONData : [quizJSONData];
    let j;
    let questions = [];
    let answers = [];
    for (j = 0; j < numberOfVersions; j++) {
        let thisQuiz = combineQuizzes(quizJSONData, randomizeAll);
        let nextVersion = makeWrittenQuizVersion(thisQuiz);
        questions.push(nextVersion.questionList);
        answers.push(nextVersion.answerList);
    }
    /// there should be a way to quickly adapt this to an automated quiz....but it'd need to be on the back end
    let divObject = $("<div></div>");

    let q;
    for (q = 0; q < numberOfVersions; q++) {
        divObject.append(`<h3>${title} Version ${q + 1}</h3>`);
        divObject.append(questions[q]);
        divObject.append("<div class = 'pageBreak'></div>");
    }

    let a;
    for (a = 0; a < numberOfVersions; a++) {
        divObject.append(`<h4>Answers for version ${a + 1}</h4>`);
        divObject.append(answers[a]);
    }

    return divObject
}

// i need to reorder for each version

/// the directions might be tough to include in this
/// if randomize all, directions of each section will be lost for certain...
function combineQuizzes(quizArray, randomizeAll = false) {
    let questionList = [];
    let sections = [];
    let combinedQuizJSON = {
        directions: {},//{} needs to be an object
        reorder: randomizeAll,
    };
    let questionIamOn = 0;
    quizArray.forEach((quizData) => {
        if (quizData.reorder !== false) {
            shuffle(quizData.questions);
        }
        if (quizData.directions) {
            let theseDirections = {};
            theseDirections.text = quizData.directions;
            theseDirections.preMessage = `Directions for questions ${questionIamOn + 1} &#8211 ${questionIamOn + quizData.questions.length + 1}`;
            combinedQuizJSON.directions[String(questionIamOn)] = theseDirections;
        }
        questionList = questionList.concat(quizData.questions);
        questionIamOn += quizData.questions.length;
    });

    combinedQuizJSON.questions = questionList;
    return combinedQuizJSON;
}

function printDirections(directionsJSON) {
    let output = $(`<h3><strong>${directionsJSON.preMessage}: </strong>${directionsJSON.text}</h3>`);
    return output
}


// should i include making an answer sheet

// add a title or something?
function makeWrittenQuizVersion(quizJSON) {
    if (quizJSON.reorder) {
        shuffle(quizJSON.questions);
    }
    let questionList = $("<ol></ol>");
    let answerList = $("<ol></ol>");

    let k;
    for (k = 0; k < quizJSON.questions.length; k++) {
        if (quizJSON.directions[String(k)]) {
            $(questionList).append(printDirections(quizJSON.directions[String(k)]));
        }
        const question = quizJSON.questions[k];
        let questionObject = makeWrittenQuestion(question);
        questionList.append(questionObject.divObject);
        answerList.append($(`<li>${questionObject.correctAnswer}</li>`));

    }
    return {
        questionList: questionList,
        answerList: answerList
    }
}

function makeWrittenQuestion(questionJSON) {
    if (questionJSON.type === 'mc' || questionJSON.type === undefined) {
        return makeMCquestion(questionJSON)
    }
}

function makeMCquestion(questionJSON) {
    if (questionJSON.reorder !== false) { // default is to reorder, undefined will reorder
        shuffle(questionJSON.answerChoices);
    }
    /// should put in something that finds an error if there are more than one
    let divObject = $(makeQuizListItem(questionJSON));

    let choicesObject = $("<ol type = 'A'></ol>");
    let correctAnswer;
    let i;
    for (i = 0; i < questionJSON.answerChoices.length; i++) {
        const choice = questionJSON.answerChoices[i];
        if (choice.correct) {
            if (!correctAnswer) {
                correctAnswer = numberToLetter_X[i];
            } else {
                console.log("ERROR: More than 1 correct answer!")
            }
        }
        choicesObject.append(makeQuizListItem(choice));
    }
    divObject.append(choicesObject);
    return {
        divObject: divObject,
        correctAnswer: correctAnswer
    }
}



function makeQuizListItem(JSON) {
    let output = $("<li></li>");

    if (JSON.text) {
        output.append(JSON.text);
    } else if (JSON.text_math) {
        output.append(`\\(${JSON.text_math}\\)`);
    }

    return output
}
