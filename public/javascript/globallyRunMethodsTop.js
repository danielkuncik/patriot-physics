
// container for answerIDs
let answerObjects = {};

function addAnswerObject(id, object) {
    answerObjects[id] = object;
}
//
function addAnswerImage(id, src, height = 'auto', width = 'auto') {
  let imageObject = {
    "image": true,
    "src": src,
    "height": height,
    "width": width
  };
  const answerImageString = `<img src = '${src}' height = '${height}' width = '${width}' >`;
  const answerObject = $(answerImageString);
  addAnswerObject(id, answerObject);
}

function addAnswer(id, answer) {
    $(`#${id}`).attr('data-answer',answer);
}

/*
I need to add a sig fig counter here!
 */

// change width and height to make them in terms of the screen
function appendProblem(id, problemObject, width = 300, height = 300) {
  const problem = problemObject.problem;
  const answer = problemObject.answer;
  if (typeof(problem) === 'string') {
    $(`#${id}`).append($(`<p>${problem}</p>`));
  } else if (typeof(problem) === 'object' && problem.diagram) {
    $(`#${id}`).append(problem.drawCanvas(width, height));
  }

  if (typeof(answer) === 'string') {
    $(`#${id}`).attr('data-answer',answer);
  } else if (typeof(answer) === 'number') {
    $(`#${id}`).attr('data-answer',String(roundValue(answer,2)));
  } else if (typeof(answer) === 'object' && answer.diagram) {
    const answerID = `${id}_ans`;
    $(`#${id}`).attr('data-answer_id',answerID);
    addAnswerObject(answerId, answer.drawCanvas(width, height));
  } else if (typeof(answer) === 'object' && answer.image) {
    console.log('image');
    console.log(answer);
  }
}



let questionListAlreadyCreated = false; /// this global variable makes it so that
// the question and answer list function is run only once
