

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
        let numColumns = 5;
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


        super.mergeRight(1,0);
        super.mergeRight(1,3);

        super.writeTextInCell(1,0,'Horizontal');
        super.writeTextInCell(1,3,'Vertical');
        super.writeTextInCell(0,0,'free-body diagram');

        super.writeTextInCell(2,0,'force');
        super.writeTextInCell(2,1,'magnitude');

        super.writeTextInCell(2,3,'force');
        super.writeTextInCell(2,4,'magnitude');

        super.setColumnProportions([5,5,1,5,5]);

        super.mergeBelow(1,2);

        let rowProportionArray = [4,1,1];
        let k;
        for (k = 0; k < maxForces; k++) {
            rowProportionArray.push(2);
            super.mergeBelow(1,2);
        }

        super.shadeCell(1,2);
        super.setRowProportions(rowProportionArray);

        // shading unecessary cells
        if (numHorizontalForces > numVerticalForces) {
            let q;
            for (q = 3 + numVerticalForces; q < this.numRows; q++) {
                super.mergeRight(q, 3);
                super.shadeCell(q,3);
            }
            /// a problem in the merging function prevents me from merging all of them!
        } else if (numVerticalForces > numHorizontalForces) {
            let q;
            for (q = 3 + numHorizontalForces; q < this.numRows; q++) {
                super.mergeRight(q, 0);
                super.shadeCell(q, 0);
            }
        }
    }
}

// qualitative force table focuses on identifying agents and causes of forces
class ForceTableQualitative extends Table {
    constructor(numForces, notesColumnBoolean) {
        let numRows = 2 + numForces;
        let numColumns = 3;
        if (notesColumnBoolean) {
            numColumns += 1;
        }
        super(numRows, numColumns);

        super.mergeRight(0,0);
        super.mergeRight(0,0);
        super.writeTextInRow(1,['force','direction','agent']);
        super.writeTextInCell(0,0, 'free-body diagram');
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
    }
}