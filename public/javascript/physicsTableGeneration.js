// The goal of this file is to format and create
// graphic specific to certain types of physics problems
// for example: boxes to help plug into formula problems
// boxes to guide students through momentum, conservatio of energy, or electric circuit problems

// converts arrays of any numbers into an array of the same proportion that sums to 1
function normalizeArray(array) {
    var sum = 0, q;
    for (q = 0; q < array.length; q++) {
        sum += array[q];
    }
    for (q = 0; q < array.length; q++) {
        array[q] /= sum;
    }
    return array;
}


function cellObject(width, height, unit, text) {
    this.width = width;
    this.height = height;
    this.unit = unit;
    if (!text) {text = ''}
    this.text = String(text);
    this.class = 'nonShaded';
    this.shade = function() {
        this.class = 'shaded';
    };
    this.draw = function() {
        var cell = $(`<td class = ${this.class} width = '${String(this.width) + this.unit}' height = '${String(this.height) + this.unit}'>${this.text}</td>`)
        return cell
    };
}

function rowObject(width, height, unit) {
    this.width = width;
    this.height = height;
    this.unit = unit;
    this.cells = [];

    this.addCell = function(width, text) {
        this.cells.push(new cellObject(width, this.height, this.unit, text));
    };

    this.draw = function() {
        var row = $(`<tr width = '${String(this.width) + this.unit}' height = '${String(this.height) + this.unit}'></tr>`);
        this.cells.forEach((cell) => {
            $(row).append(cell.draw());
        });
        return row
    };

    this.setHeight = function(newHeight) {
        this.height = newHeight;
        this.cells.forEach((cell) => {
            cell.height = newHeight;
        })
    };

}

function tableObject(width, height, unit, numRows, numColumns) {
    /// variables
    this.width;
    this.height;
    this.unit;
    this.tableMatrix = [];

    /// setting crucial sections
    this.setUnit = function (unit) {
        if (typeof(unit) !== 'string') {
            unit = 'px'
        }
        this.unit = unit
    };
    this.setHeight = function (height) {
        if (typeof(height) !== 'number') {
            height = 300
        }
        this.height = height
    };
    this.setWidth = function (width) {
        if (typeof(width) !== 'number') {
            width = 400
        }
        this.width = width
    };


    this.addRow = function(height) {
        this.tableMatrix.push(new rowObject(this.width, height, this.unit));
    };

    /// setting the basic objects
    this.reset = function(numRows, numColumns) {
        this.tableMatrix = [];
        var i, j, nextRow, rowHeight = this.height / numRows, columnWidth = this.width / numColumns;
        for (i = 0; i < numRows; i++ ) {
            this.addRow(rowHeight);
            for (j = 0; j < numColumns; j++ ) {
                this.tableMatrix[this.tableMatrix.length - 1].addCell(columnWidth);
            }
        }
    };

    this.setWidth(width);
    this.setHeight(height);
    this.setUnit(unit);
    this.reset(numRows, numColumns);
    this.numRows = numRows;
    this.numColumns = numColumns;

    this.selectCell = function(i,j) {
        if (i > numRows || i <= 0) {console.log('ERROR: index outside vertical range selected')}
        if (j > numColumns || j <= 0) {console.log('ERROR: index outside horizontal range selected')}
        i -= 1;
        j -= 1;
        return this.tableMatrix[i].cells[j]
    };


    this.addTextToCell = function(text,i,j) {
        this.selectCell(i,j).text = text;
    };

    this.shadeCell = function(i, j) {
        this.selectCell(i,j).shade();
    };

    this.reporportionRows = function(porportionArray) {
        const normalizedProportions = normalizeArray(porportionArray);
        this.tableMatrix.forEach((row, index) => {
            console.log(index);
            row.setHeight(normalizedProportions[index] * this.height);
        });
    };

    this.reporportionColumns = function(proportionArray) {
        const normalizedProportions = normalizeArray(proportionArray);
        var w;
        for (w = 0; w < this.numColumns; w++) {
            this.tableMatrix.forEach((row) => {
                row.cells[w].width = normalizedProportions[w] * this.height;
            });
        }
    };

    this.draw = function() {
        var table = $(`<table width = '${String(this.width) + this.unit}' height = '${String(this.height) + this.unit}'></table>`);
        this.tableMatrix.forEach((row) => {
            $(table).append(row.draw());
        });
        return table;
    };

    this.insertIntoDomObject = function(domObject) {$(domObject).append(this.draw())};
    this.insertTableByID = function(insertID) {$('#' + insertID).append(this.draw());};
    this.insertTableByClass = function(insertClass) {$('.' + insertClass).append(this.draw());};

}
/// i need to create variables for all sorts of things
/// column width - array  =[where do i want these set?]
/// row height - array
/// colspans and rowspans
/// information inside fo columns and rows - array of arrays
/// shaded rows and arrays
/// buttons within arrays
/// create functions that set each of these values...
/// then, create default table setups for my situations...based on these values


/// what if i had an actualy javascript matrix...which contained objects





// arguments should adjust how large i want the table to be etc.
function formulaBox(width, height, unit) {
    if (width === undefined) {
        width = 400;
    }
    if (height === undefined) {
        height = 300;
    }
    if (unit === undefined) {
        unit = 'px'
    }
    this.numericalWidth = width;
    this.numericalHeight = height;
    this.unit = unit;

    this.totalWidth = String(this.numericalWidth) + this.unit;
    this.totalHeight = String(this.numericalHeight) + this.unit;

    this.firstColumnWidth = String(this.numericalWidth * 0.4) + this.unit;
    this.secondColumnWidth = String(this.numericalWidth * 0.3)  + this.unit;
    this.thirdColumnWidth = String(this.numericalWidth * 0.3) + this.unit;

    this.firstRowHeight = String(this.numericalHeight * 0.3) + this.unit;
    this.secondRowHeight = String(this.numericalHeight * 0.4) + this.unit;
    this.thirdRowHeight = String(this.numericalHeight * 0.3) + this.unit;


    var table = $(`<table width = '${this.totalWidth}' height = '${this.totalHeight}' cellspacing = '1px'></table>`);

    var firstRow = $(`<tr height = '${this.firstRowHeight}' ></tr>`);
    var secondRow = $(`<tr height = '${this.secondRowHeight}' ></tr>`);
    var thirdRow = $(`<tr height = '${this.thirdRowHeight}' ></tr>`);

    $(firstRow).append(`<td width = '${this.firstColumnWidth}' class = 'lookingForBox'>Looking For</td>`);
    $(firstRow).append(`<td width = '${this.secondColumnWidth}' class = 'formulaBox'>Formula</td>`);
    $(firstRow).append(`<td width = '${this.thirdColumnWidth}' ></td>`);

    $(secondRow).append(`<td class = 'alreadyKnowBox'>Already Know</td>`);
    $(secondRow).append(`<td colspan = '2'></td>`);

    $(thirdRow).append(`<td class = 'answerBox' colspan = '3'>Answer in a complete sentence with unit</td>`);

    $(table).append(firstRow);
    $(table).append(secondRow);
    $(table).append(thirdRow);

    this.table = table;

    this.insertTable = function(insertID) {
        $("#" + insertID).append(this.table);
    }
}
// well, that's a start
// some things to do: fix the issue with the thick border lines
// make it more nicely proportioned


// makes tables to help analyze a circuit with resistors in series or parallel
function circuitTable(numResistors, width, height, unit, powerRow) {
    if (width === undefined) {
        width = 400;
    }
    if (height === undefined) {
        height = 300;
    }
    if (unit === undefined) {
        unit = 'px'
    }
    if (powerRow === undefined) {
        powerRow = true;
    }
    this.numResistors = numResistors;
    this.numericalWidth = width;
    this.numericalHeight = height;
    this.unit = unit;
    this.powerRow = powerRow;

    this.totalWidth = String(this.numericalWidth) + this.unit;
    this.totalHeight = String(this.numericalHeight) + this.unit;

    /// even rows and columns
    var numericalRowHeight;
    if (this.powerRow) {
        numericalRowHeight = this.numericalHeight / 5;
    } else {
        numericalRowHeight = this.numericalHeight / 4;
    }
    this.rowHeight = String(numericalRowHeight) + this.unit;
    var numericalColumnWidth = this.numericalWidth / (this.numResistors + 2);
    this.columnWidth = String(numericalColumnWidth) + this.unit;

    var table = $(`<table width = ${this.totalWidth} height = ${this.totalHeight} cellspacing = '1px'></table>`);

    var headerRow = $(`<tr height = '${this.rowHeight}'></tr>`);
    var voltageRow = $(`<tr height = '${this.rowHeight}'></tr>`);
    var currentRow = $(`<tr height = '${this.rowHeight}'></tr>`);
    var resistanceRow = $(`<tr height = '${this.rowHeight}'></tr>`);
    var powerRow = $(`<tr height = '${this.rowHeight}'></tr>`);

    var i;
    headerRow.append(`<td width = '${this.columnWidth}'></td>`); // first column
    voltageRow.append("<td>Voltage (V)</td>");
    currentRow.append("<td>Current (A)</td>");
    resistanceRow.append("<td>Resistance (Ohms)</td>");
    powerRow.append("<td>Power (W)</td>");
    for (i = 0; i < this.numResistors; i++) {
        headerRow.append(`<td width = '${this.columnWidth}'>Resistor ${i + 1}</td>`); // each individual resistor column
        voltageRow.append("<td></td>");
        currentRow.append("<td></td>");
        resistanceRow.append("<td></td>");
        powerRow.append("<td></td>");
    }
    headerRow.append(`<td width = '${this.columnWidth}'>Total Circuit</td>`); // total column
    voltageRow.append("<td></td>");
    currentRow.append("<td></td>");
    resistanceRow.append("<td></td>");
    powerRow.append("<td></td>");

    $(table).append(headerRow);
    $(table).append(voltageRow);
    $(table).append(currentRow);
    $(table).append(resistanceRow);
    $(table).append(powerRow);

    this.table = table;

    this.insertTable = function (insertID) {
        $("#" + insertID).append(this.table);
    };
}


function makeCollisionTable(itemNames, width, height, unit, totallyInelastic) {
    if (itemNames === undefined) {
        itemNames = ['Car A', 'Car B'];
    }
    if (totallyInelastic === undefined) {
        totallyInelastic = false
    }
    var numColumns = 2 + 2 * itemNames.length;
    var numRows = 4;
    var myTable = new tableObject(width, height, unit, numRows, numColumns);
    myTable.addTextToCell('mass (kg)',2,1);
    myTable.addTextToCell('velocity (m/s)', 3,1);
    myTable.addTextToCell('momentum (kg m/s)', 4,1);
    itemNames.forEach((item, index) => {
        console.log(index);
        myTable.addTextToCell(item, 1, 2 + index);
        myTable.addTextToCell(item, 1, 3 + itemNames.length + index);
    });
    myTable.addTextToCell('Total Momentum',3,2 + itemNames.length);
    myTable.shadeCell(1,2 + itemNames.length);
    myTable.shadeCell(2,2 + itemNames.length);

    return myTable;
}

// one more type of table!!!
// a conservation of energy table!
function energyTable(pointArray, typesOfEnergyArray, width, height, unit) {
    if (pointArray === undefined) {
        pointArray = ['A','B','C','D'];
    }
    if (typesOfEnergyArray === undefined) {
        typesOfEnergyArray = ['KE', 'GPE'];
    }
    if (width === undefined) {
        width = 400;
    }
    if (height === undefined) {
        height = 300;
    }
    if (unit === undefined) {
        unit = 'px'
    }
    this.pointArray = pointArray;
    this.typesOfEnergyArray = typesOfEnergyArray;
    this.numericalWidth = width;
    this.numericalHeight = height;
    this.unit = unit;

    this.numColumns = 2 + this.typesOfEnergyArray.length;
    this.numRows = 1 + pointArray.length;

    this.totalWidth = String(this.numericalWidth) + this.unit;
    this.totalHeight = String(this.numericalHeight) + this.unit;

    this.rowHeight = String(this.numericalHeight / this.numRows) + this.unit;
    this.columnWidth = String(this.numericalWidth / this.numColumns) + this.unit;

    var table = $(`<table width = '${this.totalWidth}' height = '${this.totalHeight}' cellspacing = '1px'></table>`);

    var headerRow = $("<tr></tr>");
    $(headerRow).append("<td>Point</td>");
    this.typesOfEnergyArray.forEach((type) => {
        $(headerRow).append(`<td>${type}</td>`);
    });
    $(headerRow).append("<td>Total</td>");

    $(table).append(headerRow);

    // add other rows
    var nextRow, k;
    this.pointArray.forEach((point) => {
        nextRow = $("<tr></tr>");
        $(nextRow).append(`<td>${point}</td>`); // the header column
        for (k = 0; k < this.typesOfEnergyArray.length; k++) {
            $(nextRow).append("<td></td>"); // each individual column
        }
        $(nextRow).append("<td></td>"); // the total column
        table.append(nextRow);
    });

    this.table = table;

    this.insertTable = function (insertID) {
        $("#" + insertID).append(this.table);
    };

}
/*
Things to add to this file
2-20-19
- should there be a single 'physics table' class, and then within that different types of tables?
- refactor significantly in order to make it much easier and readable
- is there a specific javascript function for default values?
- change the insert function to allow inserting by class or other items, rather than always inserting by id
- make sure all of the length and width numbers are precisely correct...i don't think my current system includes the space between or borders in them
- reformat heights of columns and rows to make more seemly
- use table headers and not only table cells <th> not just <td>
- move more of the functionality out of automatic functions and into called functions
- have ways to change values of the table after it is initially created
- add a way to add values to the specific cells of a table
- add a way to include numerical input in the specific cells of a table [to allow for future problems in which kids enter numbers]
 */