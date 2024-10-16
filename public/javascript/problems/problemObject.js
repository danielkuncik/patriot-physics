
let pageAnswers = {};

/*
This is rough
i need to totally reenvision this to make it much simpler to understand

 */

// will need to be improved and beefed up as I add more automatically solving problems
class Problem {
  constructor(id = create_UUID()) {
    this.id = id;
    this.question = {};
    this.answers = {};
    this.dropDownChoices= []; /// dropdowns can only be used if there is a single answer....
    /// in the long term, that will not work
    // questions and answers will need to become their own objects

    /*
    One answer choice needs to be 'uneditable input'
     */
  }

  addDirections(directions) {
    this.question.directions = directions;
  }

  addQuestionString(questionString) {
    this.question.string =  questionString;
  }

  addDiagram(diagramObject) {
    this.question.diagram = diagramObject;
  }

  addDropdown(arrayOfChoices) {
    this.question.dropdown = arrayOfChoices;
  }

  displayQuestionAsLi(diagramWidth= 300, diagramHeight = diagramWidth) {
    let questionItem = $("<li class = 'question'></li>");
    if (this.question.directions) {
      $(questionItem).append(`<p>${this.question.directions}</p>`);
    }
    if (this.question.string) {
      $(questionItem).append(`<p>${this.question.string}</p>`);
    }
    if (this.question.diagram) {
      $(questionItem).append("<br>");
      $(questionItem).append(this.question.diagram.drawCanvas(diagramWidth, diagramHeight));
    }
    if (this.question.dropdown) {
      $(questionItem).append(this.createDropdown(this.question.dropdown))
    }
    return questionItem
  }

//  addAnswerVariableObject(variableObject);

  addAnswer(variable, answer, exact = false, name = variable, uneditable = false) {
    let thisAnswer = {
      name: name,
      id: create_UUID()
    };
    if (typeof(answer) === 'string') {
        thisAnswer["string"] = answer;
        thisAnswer['type'] = 'string';
        if (uneditable) {
          thisAnswer.inputType = 'p';
        } else {
          thisAnswer.inputType = 'input';
        }
    } else if (typeof(answer) === 'number') {
      thisAnswer["string"] = String(answer);
      thisAnswer.inputType = 'number';
      if (exact) {
        thisAnswer['type'] = 'exactNumber';
        thisAnswer['number'] = answer;
        thisAnswer.inputClass = 'integerInput';
      } else {
        thisAnswer['type'] = 'float';
        thisAnswer['float'] = answer;
      }
    } else if (typeof(answer) === 'object') {
      if (answer.isAmagnitude) {
        thisAnswer.inputType = 'number';
        thisAnswer["type"] = 'magnitude';
          thisAnswer["magnitude"] = answer;
          thisAnswer['string'] = answer.printOptimal();
        }
        if (answer.diagram) {
          thisAnswer["type"] = 'diagram';
          thisAnswer["diagram"] = answer;
        }
      /// give options for physics number, diagram, etc.
    }
    this.answers[variable] = thisAnswer;
    pageAnswers[thisAnswer.id] = thisAnswer;
    return thisAnswer
  }


  deleteAnswer() {
    this.answer = undefined;
  }

  // change globally run methods bottom to make this more smooth?
  displayAnswerAsLi() { // needs to be an input
    if (Object.keys(this.answers).length === 1) {
      let variable = Object.keys(this.answers)[0];
      // return $(`<li class = 'answer'>${variable} = ${this.answers[variable].string}</li>`);
      return $(`<span>${variable} = ${this.answers[variable].string}</span>`);
    } else {
      let item = $("<li class = 'answer'></li>");
      let masterList = $("<ul></ul>");
      Object.keys(this.answers).forEach((variable) => {
        $(masterList).append(`<li>${this.answers[variable].name} = ${this.answers[variable].string}</li>`);
      });
      $(item).append(masterList);
      return item
    }
  }

  // private method
  createAnswerInput(answerObject) {
    let inputType = answerObject.inputType;
    let inputClass = answerObject.inputClass;
    let input;
    if (inputType === 'p') {
      input = $(`<p id = '${answerObject.id}' class = 'border border-dark multipleChoiceInput'></p>`);
    } else {
      input = $(`<input type = '${inputType}' id = '${answerObject.id}' class = '${inputClass} border border-dark'/>`); // add a class
    }
    let commentSpace = $(`<p class = 'comment' id = 'comment-${answerObject.id}'/>`);
    let finalDiv = $("<div></div>");
    $(finalDiv).append(input);
    $(finalDiv).append(commentSpace);
    return finalDiv
  }

// lets see if it works
  displayProblem(appendID) { // as Li
    let question = this.displayQuestionAsLi();
    const answerID = `${this.id}_answer`;
    $(question).attr('data-answer_id',answerID);
    // HERE => display the dropdown choices
    let answer = this.displayAnswerAsLi();
    $(`#${appendID}`).append(question);
    addAnswerObject(answerID, answer);
  }

  displayProblemAsLi(appendID) {
    let question = this.displayQuestionAsLi();

  }

  createDropdown(arrayOfChoices) {
    let div = $("<div class = 'btn-group'></div>");
    let button_id = create_UUID();
    let master_btn = $(`<button class = 'btn btn-info dropdown-toggle' data-toggle = 'dropdown' aria-haspopup = 'true' aria-expanded = 'false' id = '${button_id}'>Select Energy</button>`);
    let dropDownMenu = $(`<div class = 'dropdown-menu' aria-labelledby = "${button_id}"></div>`);
    arrayOfChoices.forEach((choice) => {
      let newId = create_UUID();
      let thisChoice = $(`<button class = 'dropdown-item' type = 'button' id = '${newId}'>${choice}</button>`);
      this.dropDownChoices.push({
        id: newId,
        text: choice
      });
      $(dropDownMenu).append(thisChoice);
    });
    $(master_btn).append(dropDownMenu);
    $(div).append(master_btn);
    return div
  }

  displayProblemAsInputOneAnswer(appendID, answerObject = this.answers[Object.keys(this.answers)[0]]) {
    let questionLi = this.displayQuestionAsLi();
    let answerInput = this.createAnswerInput(answerObject);
    $(`#${appendID}`).append(questionLi);
    $(`#${appendID}`).append("<br>");
    $(`#${appendID}`).append(answerInput);


    // move to the display answer options?????
    if (this.dropDownChoices.length > 0) {
      const inputID = this.answers[Object.keys(this.answers)[0]].id;
      this.dropDownChoices.forEach((choice) => {
        $(`#${choice.id}`).on('click',() => {
          $(`#${inputID}`).text(choice.text);
        });
      })
    }

  }
}

function checkAnswer(uuid, input) {
  const answerObject = pageAnswers[uuid];
  if (answerObject.type === 'string') {
    return {
      correct: input === answerObject.string
    }
  } else if (answerObject.type === 'exactNumber') {
    return {
      correct: Number(input) === answerObject.number
    }
  } else if (answerObject.type === 'float') {
      return {
        correct: percentDifference(Number(input), answerObject.float) < 1
      }
  } else if (answerObject.type === 'magnitude') {
      let newMagnitude = new Magnitude(input); // consider unit
      return answerObject.magnitude.correctInputtedAnswer(input)
  } else if (answerObject.type === 'diagram') {
      return undefined // not sure how to handle this
  }
}


/// ADD A PROBLEM LIST OBJECT!!!!!!!
/// not to replace, but to supplement the questionList and answerList classes I already have
