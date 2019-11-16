/*
This script is designed to
create a table object
that can be used to more easily create the similar different
types of tables I attach to physics problems.
 */


function sumOfArray(array) {
    let sum = 0;
    array.forEach((element) => {
        sum += element;
    });
    return sum
}

function makeArraySumToOne(array) {
    let sum = sumOfArray(array);
    let q;
    for (q = 0; q < array.length; q++) {
        array[q] = array[q]/sum;
    }
    return array
}

class Table {
    constructor(numRows, numColumns) {
        this.numRows = numRows;
        this.numColumns = numColumns;

        this.rowProportionArray = [];
        this.columnProportionArray = [];
        this.normalize();

        this.cellInfoArray = [];
        this.eraseAllInfo(); // sets the cell info array as a blank array

        this.columnKeys = {};
        this.rowKeys = {};
    }

    eraseAllInfo() {
        this.cellInfoArray = [];
        let i, j, thisRowArray;
        for (i = 0; i < this.numRows; i++) {
            thisRowArray = [];
            for (j =0; j < this.numColumns; j++) {
                thisRowArray.push({});
            }
            this.cellInfoArray.push(thisRowArray);
        }
    }

    setRowProportions(newProportionArray) {
        if (newProportionArray.length !== this.numRows) {
            console.log('ERROR: row proportion array must have element for each row');
            return false
        }
        let k;
        for (k = 0; k < this.numRows; k++) {
            this.rowProportionArray[k] = newProportionArray[k];
        }
    }

    setColumnProportions(newProportionArray) {
        if (newProportionArray.length !== this.numColumns) {
            console.log('ERROR: column proportion array must have element for each column');
            return false
        }
        let k;
        for (k = 0; k < this.numRows; k++) {
            this.columnProportionArray[k] = newProportionArray[k];
        }
    }

    normalizeRowProportions() {
        let newArray = [];
        let q;
        for (q = 0; q < this.numRows; q++) {
            newArray.push(1);
        }
        this.rowProportionArray = newArray;
        return true
    }

    normalizeColumnProportions() {
        let newArray = [];
        let q;
        for (q = 0; q < this.numColumns; q++) {
            newArray.push(1);
        }
        this.columnProportionArray = newArray;
        return true
    }

    normalize() {
        this.normalizeRowProportions();
        this.normalizeColumnProportions();
    }

    writeTextInCell(i, j, text) {
        this.cellInfoArray[i][j].text = text;
    }

    addClassToCell(i, j, newClass) {
        this.cellInfoArray[i][j].class = newClass
    }

    writeTextInRow(i, textArray) {
        if (textArray.length > this.numColumns) {
            console.log('ERROR: Too many elements in text array');
            return false
        }
        let j;
        for (j = 0; j < textArray.length; j++) {
            this.writeTextInCell(i, j, textArray[j])
        }
    }

    writeTextInColumn(j, textArray) {
        if (textArray.length > this.numColumns) {
            console.log('ERROR: Too many elements in text array');
            return false
        }
        let i;
        for (i = 0; i < textArray.length; i++) {
            this.writeTextInCell(i, j, textArray[i]);
        }
    }

    makeFirstRowHeaders() {
        let j;
        for (j = 0; j < this.numColumns; j++) {
            this.makeCellIntoHeader(0, j);
        }
    }

    makeFirstColumnHeaders() {
        let i;
        for (i = 0; i < this.numRows; i++) {
            this.makeCellIntoHeader(i, 0);
        }
    }

    shadeUpperLeftCorner() {
        this.shadeCell(0,0);
    }

    addTopHeaders(textArray) {
        this.writeTextInRow(0, textArray);
    }

    addSideHeaders(textArray) {
        this.writeTextInColumn(0, textArray);
    }

    setClassOfAllCells(newClass) {
        let i, j;
        for (i = 0; i < this.numRows; i++) {
            for (j = 0; j < this.numColumns; j++) {
                this.addClassToCell(i, j, newClass);
            }
        }
    }

    setClassOfRow(i, newClass) {
        let j;
        for (j =0; j < this.numColumns; j++) {
            this.addClassToCell(i, j, newClass);
        }
    }

    setClassOfColumn(j, newClass) {
        let i;
        for (i = 0; i < this.numRows; i++) {
            this.addClassToCell(i, j, newClass);
        }
    }

    setClassOfTopRow(newClass) {
        this.setClassOfRow(0, newClass);
    }

    setClassOfLeftColumn(newClass) {
        this.setClassOfColumn(0, newClass);
    }

    shadeCell(i, j) {
        this.addClassToCell(i, j, 'shaded');
    }

    makeCellIntoHeader(i, j) {
        this.cellInfoArray[i][j].header = true;
    }

    assignColumnKey(j, key) {
        if (j >= this.numColumns) {
            console.log('Key assignment out of range');
            return false
        }
        this.columnKeys[key] = j;
    }

    assignRowKey(i, key) {
        if (i >= this.numRows) {
            console.log('Key assignment out of range');
            return false
        }
        this.rowKeys[key] = i;
    }

    assignAllRowKeys(array) {
        if (array.length !== this.numRows) {
            console.log('Array must have one element for each row');
            return false
        }
        array.forEach((element, index) => {
            this.assignRowKey(index, element);
        });
    }

    assignAllColumnKeys(array) {
        if (array.length !== this.numColumns) {
            console.log('Array must have one element for each column');
            return false
        }
        array.forEach((element, index) => {
            this.assignColumnKey(index, element);
        });
    }

    getCellCoordinatesByKey(rowKey, columnKey) {
        return {
            i: this.rowKeys[rowKey],
            j: this.columnKeys[columnKey]
        }
    }

    draw(width, height, unit) {
        if (unit === undefined) {unit = 'px';}

        let rowProportions = makeArraySumToOne(this.rowProportionArray);
        let columnProportions = makeArraySumToOne(this.columnProportionArray);

        let table = $("<table></table>");
        let i, j, thisRow, thisCell;
        for (i = 0; i < this.numRows; i++) {
            thisRow = $(`<tr height = "${height * rowProportions[i]}${unit}"></tr>`);
            for (j = 0; j < this.numColumns; j++) {
                if (this.cellInfoArray[i][j].header) {
                    thisCell = $(`<th width = "${width * columnProportions[j]}${unit}"></th>`);
                } else {
                    thisCell = $(`<td width = "${width * columnProportions[j]}${unit}"></td>`);
                }
                if (this.cellInfoArray[i][j].text) {
                    $(thisCell).append($(document.createTextNode(this.cellInfoArray[i][j].text)));
                }
                if (this.cellInfoArray[i][j].class) {
                    $(thisCell).addClass(this.cellInfoArray[i][j].class);
                }
                $(thisRow).append(thisCell);
            }
            $(table).append(thisRow);
        }
        return table;
    }
}