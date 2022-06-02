
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

function findMinIndexOfArray(array) {
    let minIndex = 0;
    let min = array[0];
    let i;
    for (i = 1 ; i < array.length; i++) {
        if (array[i] < min) {
            minIndex = i;
            min = array[i];
        }
    }
    return minIndex
}

function generateOrderedSequence(max) {
    let k;
    let output = [];
    for (k = 0; k < max; k++) {
        output.push(k);
    }
    return k
}

function generateRandomSequence(max) {
    let dummyArray = [];
    let outputArray = [];
    let i;
    for (i = 0; i < max; i++) {
        dummyArray.push(Math.random());
    }
    let j;
    for (j = 0; j < max; j++) {
        let minIndex = findMinIndexOfArray(dummyArray);
        outputArray.push(minIndex);
        dummyArray[minIndex] = 5;
    }
    return outputArray
}


// I want a function that shuffles an array without messing with the original
function makeNewShuffledArray(array) {
    let newArray = [];
    let newOrder = generateRandomSequence(array.length);
    let k;
    for (k = 0; k < array.length; k++) {
        newArray.push(array[newOrder[k]]);
    }
    return newArray
}

// i really gotta make this into an object!!!!
// and then have methods to produce a written quiz or an automated quiz

// right now, all these functions are hard wired to produce only written quizzes  :( :( :(

// makes a test for multiple pods
// a TEST is composed of multiple quizzes
class Test {
    constructor(idArray) {
        if (typeof(idArray) === string) {
            idArray = [idArray];
        }
        this.idArray = idArray;
        this.quizArray = [];
        this.versions = [];
        idArray.forEach((id) => {
            this.quizArray.push(new Quiz(id));
        });
    }


    // i want to do this without making too much data???
    generateVersion(scrambleQuizzes = false, scrambleAll = false) {

    }
}


// this object will create a automatically generated quiz for a single pod
class Quiz {
    constructor(id) { /// does not automatically produce new versions
        this.id = id;
        $.getJSON(`/autoquiz/${id}`, (data) => {
            //this.masterData = data;
            this.questions = [];
            data.questions.forEach((questionData) => {
                if (questionData.type === "MC" || questionData.type === undefined) {
                    this.questions.push(new MultipleChoiceQuestion(questionData));
                }
            });
            this.directions = data.directions;
            this.title = "pod title"; // it should access the pod title???
            // find a way in the SERVER to add the pod title to the JSON data that is sent
        });

    }
}

class Question {
    constructor(questionObject, type = 'MC', id) { // default type is multiple choice
        this.mainText = questionObject.text;
        this.mathText = questionObject["text_math"];
        this.image = questionObject.image;
        this.type = type;
    }
}

// how do i deal with multiple choice with multiple correct answers???
// (i should be able to make questions where there MAY be multiple correct, but only one actually is correct
class MultipleChoiceQuestion extends Question {
    constructor(questionObject) {
        super(questionObject, "MC");
        this.reorder = questionObject.reorder !== false; // reorder answer choices unless explicitly stated not to
        this.answerChoices = this.reorder ? makeNewShuffledArray(questionObject.answerChoices) : questionObject.answerChoices;
        this.multipleCorrectType = questionObject.multipleCorrectType;
        this.correctAnswer = this.findCorrectAnswer();
    }

    findCorrectAnswer() {
        let q, corrects = [];
        for (q = 0; q < this.answerChoices.length; q++) {
            if (this.answerChoices[q].correct) {
                corrects.push(numberToLetter_X[q]);
            }
        }
        if (corrects.length > 0 && !this.multipleCorrectType) {
            console.log("ERROR: More than one correct answer!!!")
        }
        if (!this.multipleCorrectType) {
            return corrects[0]
        } else {
            return corrects
        }
    }
}

class AnswerChoice {
    constructor() {

    }
}

// etc. etc.
class NumericalQuestion extends Question {

}


// i wish i could make this private, accesible only within the Quiz class
/// it is inefficient to restore all this data......but......should i try to fix this???
class TestVersion {
    constructor(masterData, id) {
        this.directions = masterData.directions;
        this.mainImage = masterData.image;
        this.reorder = masterData.reorder !== false; /// reordering questions is default, unless explicitly stated not to
        this.numQuestions = masterData.questions.length;

        this.questionOrder = this.reorder ? generateRandomSequence(this.numQuestions) : generateOrderedSequence(this.numQuestions);

        let q;
        for (q = 0; q < this.numQuestions; q++) {
            const index = this.questionOrder[q];
            this.addQuestion(masterData.questions[index]);
        }
        this.answers = this.makeAnswerSheet();
    }

    // DO I WANT TO ADDRESS THE INEFFICIENCY OF SAVING ALL OF THIS MULTIPLE TIMES??? MAYBE NOT????
    /// not like I"m going to be running this program 1000s of times at once
    addQuestion(questionObject, questionType) {
        this.questions.push(new Question(questionObject, questionType));
    }

    makeAnswerSheet() {
        let answers = [];
        let a;
        for (a = 0; a < this.numQuestions; a++) {
            answers.push(this.questions[a].correctAnswer)
        }
        return answers
    }

    // generates a written form of this version of the quiz
    generateWritten(firstQuestion = 1) {
        let questions = $("<div></div>");
        let answers = $(`<ol start = ${firstQuestion}></ol>`);
        // here is where i will put alot of the work i've done already

        return {
            questions: questions,
            answers: answers
        }
    }

}


// figure out how to put in a title, in the json or outside of it???
function generateWrittenQuiz(quizJSONData, title, numberOfVersions = 1, firstVersion  = 1, randomizeAll) {
    const quizJSON = quizJSONData.isArray ? quizJSONData : [quizJSONData];
    let j;
    let questions = [];
    let answers = [];
    for (j = firstVersion; j < numberOfVersions + firstVersion; j++) {
        let thisQuiz = combineQuizzes(quizJSONData, randomizeAll);
        let nextVersion = makeWrittenQuizVersion(thisQuiz);
        questions.push(nextVersion.questionList);
        answers.push(nextVersion.answerList);
    }
    /// there should be a way to quickly adapt this to an automated quiz....but it'd need to be on the back end
    let divObject = $("<div></div>");


    let q;
    for (q = firstVersion; q < numberOfVersions + firstVersion; q++) {
        divObject.append(`<h1>${title}</h1>`);
        divObject.append(`<h2>Version ${q}</h2>`);
        divObject.append("<div class = 'pageBreak'></div>");
        divObject.append(questions[q - firstVersion]);
        divObject.append("<div class = 'pageBreak'></div>");
    }

    let a;
    for (a = firstVersion; a < numberOfVersions + firstVersion; a++) {
        divObject.append(`<h4>Answers for ${title} Version ${a}</h4>`);
        divObject.append(answers[a - firstVersion]);
        divObject.append("<div class = 'pageBreak'></div>");
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
        images: {},
        pageBreaks: []
    };
    let questionIamOn = 0;
    quizArray.forEach((quizData) => {
        if (quizData.reorder !== false) {
            shuffle(quizData.questions);
        }
        if (quizData.directions) {
            let theseDirections = {};
            theseDirections.text = quizData.directions ? quizData.directions : "Select the best possible choice for each prompt or question.";
            theseDirections.preMessage = `Directions for questions ${questionIamOn + 1} &#8211 ${questionIamOn + quizData.questions.length}`;
            combinedQuizJSON.directions[String(questionIamOn)] = theseDirections;
        }
        if (quizData.image) { // revise this!
            let thisImage = {};
            thisImage.link = `/asset/${quizData.id}/${quizData.image.name}`;
            thisImage.width = quizData.image.width;
            thisImage.height = quizData.image.height;
            combinedQuizJSON.images[String(questionIamOn)] = thisImage;
        }
        quizData.questions.forEach((question) => {
            question.id = quizData.id;
        });
        questionList = questionList.concat(quizData.questions);
        questionIamOn += quizData.questions.length;
        combinedQuizJSON.pageBreaks.push(questionIamOn - 1);
    });

    combinedQuizJSON.questions = questionList;
    return combinedQuizJSON;
}

function printDirections(directionsJSON) {
    let output = $(`<h3 class = 'mb-5'><strong>${directionsJSON.preMessage}: </strong>${directionsJSON.text}</h3>`);
    return output
}

function addImage(imageData, id) {// i need to make height and width adjustable
    if (typeof imageData === "string") {
        imageData = {
            name: imageData
        }
    }
    const link = `asset/${id}/${imageData.name}`; // need to replace
    const width = imageData.width ? imageData.width : '300px';
    const height = imageData.height? imageData.height : 'auto';
    const margin = imageData.margin ? imageData.margin: 5;
    return $(`<img class = 'mb-${margin}' src = '${link}' width = '${width}' height = '${height}' />`);
}



// should i include making an answer sheet

// add a title or something?
function makeWrittenQuizVersion(quizJSON, id) {
    if (quizJSON.reorder) {
        shuffle(quizJSON.questions);
    }
    let questionList = $("<ol></ol>");
    let answerList = $("<ol></ol>");

    let k;
    for (k = 0; k < quizJSON.questions.length; k++) {
        if (quizJSON.directions[k]) {
            $(questionList).append(printDirections(quizJSON.directions[k]));
        }
        if (quizJSON.images[k]) {
            $(questionList).append(addImage(quizJSON.images[k]), id)
        }
        const question = quizJSON.questions[k];
        let questionObject = makeWrittenQuestion(question, id);
        questionList.append(questionObject.divObject);
        answerList.append($(`<li style = 'font-size:32px' class = 'm-4'>${questionObject.correctAnswer}</li>`));
        if ((k + 1) % 5 === 0) {
            answerList.append("<div class = 'mediumSpace'></div>")
        }
        if (quizJSON.pageBreaks.includes(k)) {
            questionList.append("<div class = 'pageBreak'></div>");
        }
    }
    return {
        questionList: questionList,
        answerList: answerList
    }
}

function makeWrittenQuestion(questionJSON, id) {
    if (questionJSON.type === 'mc' || questionJSON.type === undefined) {
        return makeMCquestion(questionJSON, id)
    }
}

function makeMCquestion(questionJSON, id) {
    if (questionJSON.reorder !== false) { // default is to reorder, undefined will reorder
        shuffle(questionJSON.answerChoices);
    }
    /// should put in something that finds an error if there are more than one
    let divObject = $(makeQuizListItem(questionJSON, true, questionJSON.id));

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
        choicesObject.append(makeQuizListItem(choice, false, questionJSON.id));
    }
    divObject.append(choicesObject);
    return {
        divObject: divObject,
        correctAnswer: correctAnswer
    }
}


function makeQuizListItem(JSON, mainQuestion, id) { // main question is true if it is the main question, otherwise it is an answer choice
    const extraSpace = mainQuestion ? "&nbsp;" : "&nbsp; &nbsp; &nbsp;"; // adds more extra space to answer choices
    const fontSize = 32;
    const objectClass =  mainQuestion ? 'm-5 p-5' : 'mb-2 mt-2';
    const styleTag = mainQuestion ? `page-break-inside:avoid;font-size:${fontSize}px` : `font-size:${fontSize}px`;
    let output = $(`<li class = '${objectClass}' style = '${styleTag}'></li>`);

    if (JSON.text) {
        output.append(`${extraSpace}${JSON.text}`);
    } else if (JSON.text_math) {
        output.append(`${extraSpace}\\(${JSON.text_math}\\)`);
    }
    if (JSON.image) {
        output.append(addImage(JSON.image, id));
    }

    return output
}
