class Answer {
    constructor(variable) {

    }
}

class numericalAnswer extends Answer {
    constructor(variable, measurement) {
        super(variable);
        this.measurement = processMeasurementInput(measurement);
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
    constructor(variable) {
        super(variable);
    }
}

class noAnswer extends Answer {
    constructor(variable) {
        super(variable);
    }
}

class multipleChoiceShort extends Answer {
    constructor(variable) {
        super(variable);
    }
}

class multipleChoiceLong extends Answer {
    constructor(variable) {
        super(variable);
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