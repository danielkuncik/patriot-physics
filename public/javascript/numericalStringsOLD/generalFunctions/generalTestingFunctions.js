/**
 * Created by danielkuncik on 5/28/17.
 * A set of functions for testing javascript functions
 * These can only test the results of individual functions

8-18-2020: i'll use the new functions i wrote earlier
make assert not eqal


 */

function add_test(result) {
    if (!result) {
        full_result = 'red';
    }
}

function assertEqual(a, b){
    var result = a === b;
    if (consoleInfo) {
        console.log(result);
    }
    add_test(result);
    return result;
}

function assertNotEqual(a, b){
    var result = a !== b;
    add_test(result);
    return result;
}

function createTextBox(text, tagName) {
    var newBox = document.createElement(tagName);
    var newText = document.createTextNode(text);
    newBox.appendChild(newText);
    return newBox;
}

function createTableRow(text) {
    var newRow = document.createElement('tr');
    var newBox = createTextBox(text,'td');
    newRow.appendChild(newBox);
    return newRow;
}

var consoleInfo = true;
// global variable that determines if i want to console to print information on tests or not
// turn it off to focus on individual tests!

// presents information from the tests in the javascript console
function presentInformation(testName, test, args, correct, result) {
    if (consoleInfo) {
        console.log(testName);
        console.log("".concat('Value Entered:     ', test));
        console.log("".concat('Arguments:         ', String(args)));
        console.log("".concat('Correct Answer:    ', correct));
        console.log("".concat('Value Determined:  ', result));
        console.log("    ")
    }

}

// creates an html table of all tests that have failed
function createFailureTable(testName,test,args,correct,result) {
    var newTable = document.createElement('table');

    var row1 = createTableRow(testName);
    var row2 = createTableRow("".concat('Value Entered:     ', test));
    var row3 = createTableRow("".concat('Arguments:         ',String(args)));
    var row4 = createTableRow("".concat('Correct Answer:    ', correct));
    var row5 = createTableRow("".concat('Value Determined:  ', result));
    var row6 = createTableRow("       ");

    newTable.appendChild(row1);
    newTable.appendChild(row2);
    newTable.appendChild(row3);
    newTable.appendChild(row4);
    newTable.appendChild(row5);
    newTable.appendChild(row6);

    //return newTable;

    var failingTestLocation = document.getElementById('failing_test_location');

    failingTestLocation.appendChild(newTable);
}

// a general testing function
// func is the function being tested
// name is a string name of the function
// testValue is the primary value entered into the function
// args is an array of all other arguments in the funciton, it may be empty
// correct is the correct value the function should submit
function testFunction(func, name, testValue, args, correct) {
    testName = name; /// i need to get rid of this global variable format!

    var result;
    // a very clunky method! -- will work for now!
    if (args.length === 0) {
        result = func(testValue);
    } else if (args.length === 1) {
        result = func(testValue, args[0]);
    } else if (args.length === 2) {
        result = func(testValue, args[0], args[1]);
    }

    var F = assertEqual(result, correct);
    presentInformation(testName, testValue, args, correct, result);

    if (!F) {
        createFailureTable(testName, testValue, args, correct, result)
    }

}

// a global variable, is there a way to change this???
