
// will this create any problems???? should I mix these?
/// i want to use redis just to make keys, not for sessions

const redis = require("redis");
const answerClient =redis.createClient(process.env.REDIS_URL);
answerClient.on("error",(error) => {
    console.log(error);
});

// client.set("hello","goodbye");
// client.get("hello", (err, reply) => {
//     console.log(reply);
// });

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const numberToLetter = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];


const userID = 209;
const podID = 'ad8g32';

const quizJSON = {
    "shuffle": true,
    "questions": [
        {
            "type": "mc",
            "text": "What is the capitol of Massachusetts?",
            "answers": [
                {"text": "Boston", "correct": true},
                {"text": "Worchester", "correct": false},
                {"text": "New Bedford", "correct": false},
                {"text": "Newton", "correct": false}
            ]
        },
        {
            "type": "mc",
            "answerLock": true,
            "text": "What is 2 + 2?",
            "answers": [
                {"text": "1", "correct": false},
                {"text": "2", "correct": false},
                {"text": "3", "correct": false},
                {"text": "4", "correct": true}
            ]
        }
    ]
};

// returns a JSON of questions and answers
function makeQuiz(quizJSON) {

}


/// it should create a redis of correct answers

function makeQuiz(quizJSON, podID, userID) {

}

/// frontEndAnswer states whether it is acceptable for the answer to be contained on the front end or not
function makeQuestion(questionJSON, frontEndAnswer = false, podID, userID, questionNumber) {

    /// once you get the answer

    let answer = 'A';// come up with a better way of getting the answer
    answerClient.set(`${userID}-${podID}-${questionNumber}`, answer);
}

function makeMultipleChoiceQuestion(JSON)

/// printed or online?
class question {
    constructor(questionJSON) {
        this.type = questionJSON.type;
        this.text = questionJSON.text;

        // multiple choice with a single correct answer
        if (this.type === 'mc') {
            let answerArray = questionJSON.answers;
            if (!questionJSON.answerLock) {
                answerArray.shuffle();
            }
            let correct, i;
            for (i = 0; i < answerArray.length; i++) {
                if (answerArray[i].correct) {
                    if (correct) {
                        console.log('ERROR!!!! Multiple correct answers');
                    }
                    correct = numberToLetter[i];
                }
            }
            if (correct) {
                this.correct = correct
            } else {
                console.log('ERROR!!! no correct answers');
            }
        }
    }
}

class multipleChoiceQuestion extends question {
    constructor(questionJSON) {
        super();

    }
}

