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

// figure out how to put in a title, in the json or outside of it???
function makeWrittenQuiz(quizJSON, title, numberOfVersions = 1) {
    let j;
    let questions = [];
    let answers = [];
    for (j = 0; j < numberOfVersions; j++) {
        let nextVersion = makeWrittenQuizVersion(quizJSON);
        questions.push(nextVersion.questionList);
        answers.push(nextVersion.answerList);
    }
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

// should i include making an answer sheet

// add a title or something?
function makeWrittenQuizVersion(quizJSON) {
    if (quizJSON.reorder) {
        shuffle(quizJSON.questions);
    }
    let questionList = $("<ol></ol>");
    let answerList = $("<ol></ol>");

    quizJSON.questions.forEach((question) => {
        let questionObject = makeWrittenQuestion(question);
        questionList.append(questionObject.divObject);
        answerList.append($(`<li>${questionObject.correctAnswer}</li>`));
    });

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
    let divObject = $("<li></li>");
    divObject.append(`<p>${questionJSON.text}</p>`);

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
        choicesObject.append($(`<li>${choice.text}</li>`));
    }

    divObject.append(choicesObject);
    return {
        divObject: divObject,
        correctAnswer: correctAnswer
    }
}
