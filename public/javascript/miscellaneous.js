

/// used to process numbers for these functions
// needs a better name
// if a single number is given, returns a stirng of that number
/// but if an array is given, returns a string of each number in the array multipled together
function processNumbers(numbers) {
    if (typeof(numbers) === "object") {
        var string = "";
        var j;
        for (j = 0; j < numbers.length - 1; j++) {
            string = string + String(numbers[j] + " \\cdot ");
        }
        string = string + String(numbers[numbers.length - 1]);
    } else {
        string = String(numbers)
    }
    return string
}

// number1 and unit1 go on top, and number2 and unit2 go on bottom
// if flipped = true, that is reversed
class fractionWithUnits { // not necessarily conversion factors...really a fraction with units
    constructor(number1, unit1, number2, unit2, flipped) {
        if (flipped === undefined) {flipped = false;}
        this.number1 = processNumbers(number1);
        this.number2 = processNumbers(number2);
        this.unit1 = unit1;
        this.number2 = number2;
        if (unit2 === undefined) {this.unit2 = '';} else {this.unit2 = unit2;} // can enter nothing for bottom unit
        this.flipped = flipped;
        this.unit1Canceled = false;
        this.unit2Canceled = false;
        this.parentheses = false;
        this.string = undefined;
    }

    flip() {
        this.flipped = !this.flipped
    }

    addParentheses() {
        this.parentheses = true;
    }
    deleteParentheses() {
        this.parentheses = false;
    }

    cancelUnit1() {
        this.unit1Canceled = true;
    }
    unCancelUnit1() {
        this.unit1Canceled = false;
    }
    cancelUnit2() {
        this.unit2Canceled = true;
    }
    unCancelUnit2() {
        this.unit2Canceled = false;
    }

    cancelTop() {
        if (this.flipped) {this.cancelUnit2();} else {this.cancelUnit1();}
    }
    cancelBottom() {
        if (this.flipped) {this.cancelUnit1();} else {this.cancelUnit2();}
    }
    unCancelTop() {
        if (this.flipped) {this.unCancelUnit2();} else {this.unCancelUnit1();}

    }
    unCancelBottom() {
        if (this.flipped) {this.unCancelUnit1();} else {this.unCancelUnit2();}
    }

    print() {
        var topNumber, topUnit, topUnitCanceled, bottomNumber, bottomUnit, bottomUnitCanceled;
        if (this.flipped) {
            topNumber = this.number2;
            topUnit = this.unit2;
            topUnitCanceled = this.unit2Canceled;
            bottomNumber = this.number1;
            bottomUnit = this.unit1;
            bottomUnitCanceled= this.unit1Canceled
        } else {
            topNumber = this.number1;
            topUnit = this.unit1;
            topUnitCanceled = this.unit1Canceled;
            bottomNumber = this.number2;
            bottomUnit = this.unit2;
            bottomUnitCanceled= this.unit2Canceled        }
        var numeratorString, denominatorString, masterString, finalString;
        if (topUnitCanceled) {
            numeratorString = `{${topNumber} \\, \\bcancel{ \\text{${topUnit}} } }`;
        } else {
            numeratorString = `{${topNumber} \\, \\text{${topUnit}} }`;
        }
        if (bottomUnitCanceled) {
            denominatorString = `{${bottomNumber} \\, \\bcancel{ \\text{${bottomUnit}} } }`;
        } else {
            denominatorString = `{${bottomNumber} \\, \\text{${bottomUnit}} }`;
        }

        masterString = `\\frac${numeratorString}${denominatorString}`;
        if (this.parentheses) {
            finalString = `\\left( ${masterString} \\right)`
        } else {
            finalString = masterString;
        }
        this.string = finalString;
        return finalString;
    }
}

class nonFractionStatement {
    constructor(number, unit) {
        this.number = processNumbers(number);
        this.unit = unit;
    }

    print() {
        return `${this.number} \\, \\text{${this.unit}}`
    }
}

class equalSign {
    constructor() {
        this.string = "="
    }
    print() {
        return "="
    }
}

class conversionProblem {
    constructor(){
        this.elements = [];
        this.string = ""
    }

    addEqualsSign() {
        var nextSign = new equalSign();
        this.elements.push(nextSign);
        return nextSign
    }

    addNonFractionStatement(number, unit) {
        var nextStatement = new nonFractionStatement(number, unit);
        this.elements.push(nextStatement);
        return nextStatement
    }

    addFractionWithUnits(numberOnTop, unitOnTop, numberOnBottom, unitOnBottom) {
        var nextFraction = new fractionWithUnits(numberOnTop, unitOnTop, numberOnBottom, unitOnBottom);
        this.elements.push(nextFraction);
        return nextFraction
    }

    print() {
        var masterString = "\\( \\require{cancel} ";
        this.elements.forEach((element) => {
            masterString = masterString + element.print();
        });
        masterString = masterString + "\\)";
        return masterString
    }
}