

class AutomaticProblem {
  constructor(name) {
    this.name = name;
    this.inputs = [];
  }

  addNumericalInput(answer, accuracy) {
    const id = `${this.name}-${this.inputs.length + 1}`;
    if (accuracy === undefined) {
      accuracy = 'exact';
    }
    this.inputs.push({
      id: id,
      type: "number",
      answer: answer,
      accuracy: accuracy
    });
    return $(`<input type = 'number' id = '${id}' />`);
  }

  addAnswerButton() {
    let clickFunction = this.answer;
    return $("<input type = 'button' value = 'ANSWER' onclick = clickFunction />")
    /// THIS DOES NOT WORK!!!
    /// i need to find a different way to control the answer button
  }

  answer() {
    this.inputs.forEach((input) => {
      let inputtedValue = $(`#${input.id}`).val();
      let correct = false;
      if (input.type === 'number') {
        inputtedValue = Number(inputtedValue);
        if (input.accuracy === 'exact') {
          if (Math.abs(inputtedValue - input.answer) < 1e-10) {
            correct = true;
          }
        }
      } // add radio ===
      if (correct) {
        $(`#${input.id}`).removeClass("border border-danger");
        $(`#${input.id}`).addClass("border border-success");
      } else {
        $(`#${input.id}`).addClass("border border-danger");
      }
    });

  }
}
