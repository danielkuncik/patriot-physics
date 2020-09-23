// do i need a 'reponse' object, with a correct boolean and a comment string

class Answer {
    constructor(variable) {

    }
}

class numericalAnswer extends Answer {
    constructor(variable, measurement) {
        super(variable);
        this.measurement = processMeasurementInput(measurement);
    }

    /// correct inputted answer
    // this function assumes that this object is the correct answer
    correct(numStringInput, type = 'exact', acceptedPercentDifference = 0) {
        if (acceptedPercentDifference === 0) {
            return this.correctInputtedAnswerExact(new Measurement(numStringInput))
        } else if (acceptedPercentDifference > 0) {
            return this.correctInputtedAnswerFloat(Number(numStringInput), acceptedPercentDifference)
        }
    }

    /// private method!
    correctInputtedAnswerExact(input) {
        let correct = true, comment = '';
        if (input.numSigFigs === this.measurement.numSigFigs) {
            if (input.orderOfMagnitude !== this.measurement.orderOfMagnitude) {
                correct = false;
                if (input.divideMag(this.measurement).orderOfMagnitude !== 0) {
                    comment = comment + `Your answer is the incorrect order of magnitude! That means you made a big error :(`;
                }
            }
            if (!(input.firstSigFig === this.measurement.firstSigFig)) {
                correct = false;
                comment = comment + `the First Sig Fig ${input.firstSigFig} is not correct`;
            }
            if (!(input.otherSigFigs === this.measurement.otherSigFigs)) {
                correct = false;
                comment = comment + `The Sig Figs beyond the first are not correct`;
            }

            if (!correct && (percentDifference(input.getFloat(), this.getFloat()) < 1)) {
                comment = comment + 'You are off by less than 1%! So close! Maybe you rounded incorrectly at some point in the process?';
            }
        } else if (input.numSigFigs < this.measurement.numSigFigs) {
            correct = false;
            comment = comment + 'You have too few significant figures';
            if (!correct && (percentDifference(input.getFloat(), this.getFloat()) < 1)) {
                comment = comment + 'But, you are off by less than 1%! So if you add the extra significant figures you should be good!';
            }
        } else if (input.numSigFigs > this.measurement.numSigFigs) {
            correct = false;
            comment = comment + 'You have too many significant figures';
            if (!correct && (percentDifference(input.getFloat(), this.getFloat()) < 1)) {
                comment = comment + 'But, you are off by less than 1%! So round correctly and see if you are right!';
            }
        }
        return {
            correct: correct,
            comment: comment
        }
    }

    // private method
    correctInputtedAnswerFloat(numberInput, acceptedPercentDifference = 1) {
        let correct = percentDifference(numberInput, this.getFloat()) < acceptedPercentDifference;
        let comment = '';
        return {
            correct: correct,
            comment: comment
        }

    }

}

class numericalAnswerWithUnit extends Answer {
    constructor(variable, magnitude) {
        super(variable);
        this.magnitude = processMagnitudeInput(magnitude);
    }
}

class textAnswer extends Answer {
    constructor(variable) {
        super(variable);
    }
}

class manualCheckAnswer extends Answer {
    constructor(variable, answerString) {
        super(variable);
        this.answerString = answerString;
    }
}

// the "answer" of an open-ended question
class noAnswer extends Answer {
    constructor(variable) {
        super(variable);
    }
}

class multipleChoice extends Answer {
    constructor(variable, arrayOfChoices, correctChoice) {
        super(variable);
        this.arrayOfChoices = arrayOfChoices;
        this.correctChoice = correctChoice;
    }

    makeDropdown() {

    }

    makeRadio() {

    }

    makeButton() {

    }
}

class multipleChoiceMultipleSelection extends Answer {
    constructor(variable) {
        super(variable);
    }
}

class dragAndDropLimited extends Answer {
    constructor(variable) {
        super(variable);
    }
}

class dragAndDropUnlimited extends Answer {
    constructor(variable) {
        super(variable);
    }
}