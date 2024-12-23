

class ElectricCircuitTable extends Table {
    constructor(numResistors, powerRowBoolean) {
        let numRows = 4;
        if (powerRowBoolean) {
            numRows += 1;
        }
        super(numRows, 2 + numResistors);
        this.numResistors = numResistors;
        this.powerRowBoolean = powerRowBoolean;
        let columnKeys = ['blank'];
        let columnHeaders = [''];
        let k = 0;
        let columnProportions = [2];
        for (k = 0; k < numResistors; k++) {
            columnKeys.push(alphabetArray[k]);
            columnHeaders.push(`Resistor ${alphabetArray[k]}`);
            columnProportions.push(3);
        }
        columnProportions.push(3);
        columnKeys.push('total');
        columnHeaders.push('Total');
        super.setColumnProportions(columnProportions);

        let rowKeys = ['blank','voltage', 'current', 'resistance'];
        let rowHeaders = ['','Voltage (Volts)', 'Current (Amps)', 'Resistance (Ohms)'];
        if (powerRowBoolean) {
            rowKeys.push('power');
            rowHeaders.push('Power (Watts)');
        }

        if (powerRowBoolean) {
            super.setRowProportions([1,2,2,2,2]);
        } else {
            super.setRowProportions([1,2,2,2]);
        }

        super.assignAllRowKeys(rowKeys);
        super.addSideHeaders(rowHeaders);
        super.assignAllColumnKeys(columnKeys);
        super.addTopHeaders(columnHeaders);

        super.setClassOfAllCells('electricCircuitTable');
        super.setClassOfTopRow('electricCircuitTableTopHeader');
        super.setClassOfLeftColumn('electricCircuitTableSideHeader');

        super.makeFirstRowHeaders();
        super.makeFirstColumnHeaders();
        super.shadeUpperLeftCorner();

    }


    fillInVoltageRow(valuesArray) {
        valuesArray.unshift(undefined);
        super.writeTextInRow(1, valuesArray);
    }
    fillInCurrentRow(valuesArray) {
        valuesArray.unshift(undefined);
        super.writeTextInRow(2, valuesArray);
    }
    fillInResistanceRow(valuesArray) {
        valuesArray.unshift(undefined);
        super.writeTextInRow(3,valuesArray);
    }
    fillInPowerRow(valuesArray) {
        valuesArray.unshift(undefined);
        super.writeTextInRow(4, valuesArray);
    }

}

function filledElectricCircuitTable(voltageArray,currentArray,resistanceArray,powerArray) {
    let powerRowBoolean = false;
    if (powerArray) {
        powerRowBoolean = true;
    }
    if (voltageArray.length !== currentArray.length || voltageArray.length !== resistanceArray.length || (powerRowBoolean && voltageArray.length !== powerArray.length)) {
        console.log("ERROR: all arrays must be the same length!");
        return false
    }

    let numResistors = voltageArray.length - 1;

    let newTable = new ElectricCircuitTable(numResistors, powerRowBoolean);

    newTable.fillInVoltageRow(voltageArray);
    newTable.fillInCurrentRow(currentArray);
    newTable.fillInResistanceRow(resistanceArray);
    if (powerRowBoolean) {
        newTable.fillInPowerRow(powerArray);
    }

    return newTable
}

class EnergyTable extends Table {
    constructor(numPoints, columnTypes) {
        super(1 + numPoints, 1 + columnTypes.length);
        this.numPoints = numPoints;
        this.columnTypes = columnTypes;

        super.assignColumnKey(0, 'points');
        let k;
        for (k = 0; k < columnTypes.length; k++) {
            super.assignColumnKey(k + 1, columnTypes[k])
        }
        let rowKeys = alphabetArray.slice(0,numPoints);
        rowKeys.unshift('top');
        super.assignAllRowKeys(rowKeys);

        const selectionObject = {
            'ke': 'Kinetic Energy (J)',
            'gpe': 'Gravitational Potential Energy (J)',
            'epe': 'Elastic Potential Energy (J)',
            'thermal': 'Thermal Energy (heat loss) (J)',
            'total_e': 'Total Energy (J)',
            'speed': 'Speed (m/s)',
            'height': 'Height (m)',
            'length': 'Length (m)',
            'direction': 'Direction'
        };

        let sideHeaders = [''];
        let i;
        for (i = 0; i < numPoints; i++) {
            sideHeaders.push(alphabetArray[i]);
        }
        super.addSideHeaders(sideHeaders);

        let topHeaders = [''];
        let j;
        for (j = 0; j < columnTypes.length; j++) {
            if (selectionObject[columnTypes[j]]) {
                topHeaders.push(selectionObject[columnTypes[j]]);
            } else {
                topHeaders.push(columnTypes[j]);
            }
        }
        super.addTopHeaders(topHeaders);

        super.shadeUpperLeftCorner();

        // i just need to make this look a lot nicer etc.
    }

    addInfoToColumn(columnKey, infoArray) {
        let q;
        let columnIndex = this.columnKeys[columnKey];
        for (q = 1; q <= this.numPoints; q++) {
            super.writeTextInCell(q, columnIndex, infoArray[q - 1]);
        }
    }

    addInfoToRow(rowKey, infoArray) {
        let q;
        let rowIndex = this.rowKeys[rowKey];
        for (q = 1; q < this.numPoints; q++) {
            super.writeTextInCell(rowIndex, q, infoArray[q - 1]);
        }
    }
}

class MomentumTable extends Table {
  constructor() {
    super(5,6);

    this.setNameOfObjects("Car A", "Car B");

    super.mergeBelow(0,0);
    super.shadeUpperLeftCorner();
    this.setUnits('kg','m/s','kg m/s');
    this.makeCollisionTable();
    super.mergeRight(0,1);
    super.mergeRight(0,4);
    super.mergeBelow(0,3);
    super.mergeBelow(0,3);
    super.mergeBelow(0,3);

    super.setMaxFontProportion(0.05);
  }

  setUnits(massUnit, velocityUnit, momentumUnit) {
      super.addSideHeaders(["","",`mass (${massUnit})`,`velocity (${velocityUnit})`, `momentum (${momentumUnit})`]);
  }

  deleteUnits() {
      super.addSideHeaders(["","","mass","velocity", "momentum"]);
  }

  // default is
  // object1 = car A
  //object 2 = car B
  setNameOfObjects(object1, object2) {
    this.object1 = object1;
    this.object2 = object2;
    super.writeTextInRow(1,["",object1,object2,"",object1, object2]);
  }

  makeCollisionTable() {
      super.writeTextInRow(0,["","Before Collision","","Total Momentum","After Collision", ""]);
  }

  makeExplosionTable() {
      super.writeTextInRow(0,["","Before Explosion","","Total Momentum","After Explosion", ""]);
  }

  makeTotallyInelasticCollision() {
    super.mergeRight(1,4);
    super.mergeRight(2,4);
    super.mergeRight(3,4);
    super.mergeRight(4,4);
    super.writeTextInCell(1,4,`${this.object1} and ${this.object2}`);
  }

}


// a table built to contain canvasses
class TableOfCanvasses extends Table {
    constructor(numRows, numColumns, name, generalID) {
        super(numRows, numColumns);
        this.name = name;
        this.generalID = generalID;

        let i, j, overallIndex = 0;
        for (i = 0; i < this.numRows; i++) {
            for (j = 0; j < this.numColumns; j++) {
                super.addIdToCell(i, j, `${generalID}_${alphabetArray[overallIndex]}`);
                super.writeTextInCell(i, j, `${name} ${alphabetArray[overallIndex]}`);
                overallIndex++;
            }
        }

        this.canvasArray = [];
        for (i = 0; i < this.numRows; i++) {
            this.canvasArray.push([]);
            for (j = 0; j < this.numRows; j++) {
                this.canvasArray[i].push(undefined);
            }
        }
    }

    addDiagramsToCells(diagramArray) {
        let i, j, overallIndex = 0;
        if (diagramArray.length > this.numColumns * this.numRows) {
            console.log('ERROR: attempting to add more diagrams than table can fit.')
        }
        for (i = 0; i < this.numRows; i++) {
            for (j = 0; j < this.numColumns; j++) {
                super.addDiagramToCell(i, j, diagramArray[overallIndex]);
                overallIndex++;
            }
        }
    }
}


/// the next big thing is to create these tables for oragnizing forces!
// quantiative force table depends on identifying magnitudes of forces?
// has seperate sections for X and Y forces

// vector boolean, there is a place for velocity and net force vectors
class ForceTableQuantitative1D extends Table {
    constructor(numForces, vectorBoolean) {
        if (vectorBoolean === undefined) {
            vectorBoolean = false;
        }
        let numRows = numForces + 3;
        let numColumns = 4;
        super(numRows, numColumns);
        this.numForces = numForces;


        super.mergeRight(0,0);
        if (!vectorBoolean) {
            super.mergeRight(0,0);
            super.mergeRight(0,0);
        }

        super.mergeRight(1,0);
        super.mergeRight(1,0);
        super.mergeRight(1,0);
        super.shadeCell(1,0);

        super.writeTextInCell(0,0,
            'free-body diagram',20);
        if (vectorBoolean) {
            super.writeTextInCell(0,2, 'net force vector');
            super.writeTextInCell(0,3, 'velocity vector');
        }
        super.writeTextInRow(2, ['name of force','magnitude','direction','How did you determine the magnitude?']);

        super.setColumnProportions([2,2,2,4]);

        let rowProportionArray = [4,0.25,.5];
        let k;
        for (k = 0; k < numForces; k++) {
            rowProportionArray.push(2);
        }
        super.setRowProportions(rowProportionArray);
    }

    nameForce(number,name) {
        super.writeTextInCell(2 + number,0, name);
    }
}

class forceTableQuantitative2D extends Table {
    constructor(numHorizontalForces, numVerticalForces) {
        let numColumns = 7;
        let maxForces;
        if (numHorizontalForces >= numVerticalForces) {
            maxForces = numHorizontalForces;
        } else {
            maxForces = numVerticalForces;
        }
        let numRows = maxForces + 3;

        super(numRows, numColumns);

        super.mergeRight(0,0);
        super.mergeRight(0,0);
        super.mergeRight(0,0);
        super.mergeRight(0,0);
        super.mergeRight(0,0);
        super.mergeRight(0,0);


        super.mergeRight(1,0);
        super.mergeRight(1,0);
        super.mergeRight(1,4);
        super.mergeRight(1,4);

        super.writeTextInCell(1,0,'Horizontal');
        super.writeTextInCell(1,4,'Vertical');
        super.writeTextInCell(0,0,'free-body diagram');

        super.writeTextInCell(2,0,'force');
        super.writeTextInCell(2,1,'sign');
        super.writeTextInCell(2,2,'magnitude (N)');


        super.writeTextInCell(2,4,'force');
        super.writeTextInCell(2,5,'sign');
        super.writeTextInCell(2,6,'magnitude (N)');



        super.setColumnProportions([4,3,6,1,4,3,6]);

        super.mergeBelow(1,3);

        let rowProportionArray = [4,1,1];
        let k;
        for (k = 0; k < maxForces; k++) {
            rowProportionArray.push(2);
            super.mergeBelow(1,3);
        }

        super.shadeCell(1,3);
        super.setRowProportions(rowProportionArray);

        // shading unecessary cells
        if (numHorizontalForces > numVerticalForces) {
            let q;
            for (q = 3 + numVerticalForces; q < this.numRows; q++) {
                super.mergeRight(q, 4);
                super.mergeRight(q, 4);
                super.shadeCell(q,4);
            }
            /// a problem in the merging function prevents me from merging all of them!
        } else if (numVerticalForces > numHorizontalForces) {
            let q;
            for (q = 3 + numHorizontalForces; q < this.numRows; q++) {
                super.mergeRight(q, 0);
                super.mergeRight(q, 0);
                super.shadeCell(q, 0);
            }
        }
    }
}

// qualitative force table focuses on identifying agents and causes of forces
class ForceTableQualitative extends Table {
    constructor(numForces, objectColumnBoolean, notesColumnBoolean) {
        let numRows = 2 + numForces;
        let numColumns = 3;
        if (notesColumnBoolean) {
            numColumns += 1;
        }
        if (objectColumnBoolean) {
            numColumns += 1;
        }
        super(numRows, numColumns);

        super.mergeRight(0,0);
        super.mergeRight(0,0);
        if (notesColumnBoolean) {
            this.notesColumn = true;
            super.mergeRight(0,0);
        } else {
            this.notesColumn = false;
        }
        if (objectColumnBoolean) {
            this.objectColumn = true;
            super.mergeRight(0,0);
        } else {
            this.objectColumn = false;
        }
        if (this.notesColumn && this.objectColumn) {
            super.writeTextInRow(1,['force','direction','agent','object','notes']);
        } else if (!this.notesColumn && this.objectColumn) {
            super.writeTextInRow(1,['force','direction','agent','object']);
        } else if (this.notesColumn && !this.objectColumn) {
            super.writeTextInRow(1,['force','direction','agent','notes']);
        } else if (!this.notesColumn && !this.objectColumn) {
            super.writeTextInRow(1,['force','direction','agent']);
        }
        //super.writeTextInCell(0,0, 'free-body diagram');
        this.currentRow = 2;

        let rowProportionArray = [4,0.5];
        let i;
        for (i = 2; i < this.numRows; i++) {
            rowProportionArray.push(1);
        }
        this.setRowProportions(rowProportionArray);
    }

    addForce(name,direction,agent,object,note) {
        if ((this.objectColumn && object) && (this.notesColumn && note)) {
            super.writeTextInRow(this.currentRow,[name,direction,agent,object, note]);
        } else if (!(this.objectColumn && object) && (this.notesColumn && note)) {
            super.writeTextInRow(this.currentRow,[name,direction,agent, note]);
        } else if ((this.objectColumn && object) && !(this.notesColumn && note)) {
            super.writeTextInRow(this.currentRow,[name,direction,agent,object]);
        } else if (!(this.objectColumn && object) && !(this.notesColumn && note)) {
            super.writeTextInRow(this.currentRow,[name,direction,agent]);
        }

        this.currentRow += 1;
    }

    addFreeBodyDiagram(diagram) {
        this.addDiagramToCell(0,0,diagram);
    }
}

class FormulaSolvingTable extends Table {
    constructor() {
        super(3,3);

        super.mergeRight(1,1);

        super.mergeRight(2,0);
        super.mergeRight(2,0);

        super.writeTextInCell(0,0,'Looking For');
        super.writeTextInCell(1,0,'Already Know');
        super.writeTextInCell(0,1,'Formula');
        super.writeTextInCell(2,0,'Answer in a complete sentence with unit');

        super.addClassToCell(0,2,'littleBoxOnTheSide');

        super.setRowProportions([1,3,1]);

        super.setMaxFontProportion(0.02);
    }
}


class HarmonicsTable extends Table {
    constructor(numHarmonics, infoArray, nRowBoolean) {
        if (numHarmonics === undefined) {
            numHarmonics = 6;
        }
        if (infoArray === undefined) {
            infoArray = ['wavelength','frequency','speed']
        }

        const selectionObject = {
            'wavelength': 'Wavelength (m)',
            'frequency': 'Frequency (hz)',
            'speed': 'Speed (m/s)',
            'number': 'Harmonic',
            'diagram': 'Diagram',
            'numWavelengths': 'How many wavelengths are there?',
            'headers': undefined,
            'numNodes': 'Number of Nodes',
            'numAntiNodes': 'Number of Antinodes'
        };

        let numRows = 1 + numHarmonics;
        if (nRowBoolean) {
            numRows += 1;
        }

        let numColumns = 2 + infoArray.length;

        super(numRows, numColumns);

        this.numHarmonics = numHarmonics;
        this.nRowBoolean = nRowBoolean;
        let columnKeys = ['number','diagram'];
        infoArray.forEach((key) => {
            columnKeys.push(key);
        });

        let rowKeys = ['headers'];
        let q;
        for (q = 1; q <= this.numHarmonics; q++) {
            rowKeys.push(q);
        }
        if (this.nRowBoolean) {
            rowKeys.push('n');
        }

        this.assignAllColumnKeys(columnKeys);
        this.assignAllRowKeys(rowKeys);

        let topRowText = [];
        columnKeys.forEach((key) => {
            topRowText.push(selectionObject[key]);
        });

        let leftColumnText = [];
        rowKeys.forEach((key) => {
            leftColumnText.push(ordinalObject[key]);
        });

        this.writeTextInRow(0, topRowText);
        this.writeTextInColumn(0, leftColumnText);

        let columnPropotions = [];
        let k;
        for (k = 0; k < this.numColumns; k++) {
            columnPropotions.push(1);
        }
        columnPropotions[1] = 3; /// making the 'diagrams' columnd wider!

        this.setColumnProportions(columnPropotions);
    };

    addHarmonicDiagrams(end1, end2) { // doesn't adjust to phase
        Object.keys(this.rowKeys).forEach((key) => {
            if (isStringIntegerOneTo20(key)) {
                let coordinates = super.getCellCoordinatesByKey(key,'diagram');
                let harmonicNumber = Number(key);
                let newHarmonic = new Harmonic(harmonicNumber, end1, end2);
                if (coordinates) {
                    super.addDiagramToCell(coordinates.i, coordinates.j, newHarmonic, false);
                }
            }
        });
    }
}

class MatchingTable extends Table {
    constructor(numChoices) {
        super(numChoices,3);
        super.setColumnProportions([1,2,1]);
        super.mergeFullColumn(1,false);
    }

    // this didn't get off the ground
    // but is still worth exploring
}


// add kinematic equations as global variables

function makeKinematicEquationsTable(dimension, dimensionSubscript) {
    let equationArray = kinematicEquations(dimension, dimensionSubscript);

    let myTable = new Table(5,2);
    myTable.setRowProportions([1,2,2,2,2]);

    myTable.addTopHeaders(['Name','Equation']);
    myTable.writeTextInRow(1,['Definition of Acceleration',equationArray[0]]);
    myTable.writeTextInRow(2,['The King of Kinematic Equations',equationArray[1]]);
    myTable.writeTextInRow(3,['The Average Velocity Equation',equationArray[2]]);
    myTable.writeTextInRow(4,['The No-Time Equation',equationArray[3]]);

    return myTable
}