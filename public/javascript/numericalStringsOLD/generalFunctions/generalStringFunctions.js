/**
 * Created by danielkuncik on 5/28/17.
 */


/// Replace this function with 'indexOf()'

// find character
// returns the first index of a particular string containing a character, otherwise returns false
function findCharacter(string, char) {
    var j;
    for (j = 0; j < string.length; j++) {
        if (string[j] === char) {
            return j
        }
    }
    return false;
}

// at an index immediately AFTER the index defined by 'location'
// inserts a new value into the string
function insertIntoString(string, insert, location) {
    return "".concat(string.slice(0, location + 1),insert,string.slice(location + 1));
}

// wipes out the character at the index given by location!
function deleteFromString(string, location) {
    return "".concat(string.slice(0,location),string.slice(location + 1));
}

// replaces one character of a string
// allows individual character assignment in a string
function stringReplaceCharacter(string, newChar, location) {
    string = deleteFromString(string, location);
    return insertIntoString(string, newChar, location - 1);
}
