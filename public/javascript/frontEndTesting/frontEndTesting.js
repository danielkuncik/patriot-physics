/*
Classes and Methods to test my mathematical and physics programs on the front end

Requires JQuery and Bootstrap to use
 */

class Test {
    constructor(name, pass,failMessage) {
        this.name = name;
        this.pass = pass;
        this.failMessage = failMessage;
    }

}


class TestPackage {
    constructor(name) {
        this.name = name;
        this.unattachedTests = [];
        this.categories = {};
        this.totalTests = 0;
    }

    addCategory(key, name) {
        if (Object.keys(this.categories).includes(key)) {
            return false
        } else {
            this.categories[key] = {
                name: name,
                unattachedTests: [],
                subCategories: {}
            };
        }
    }

    // add default name based on the category key
    addSubCategory(categoryKey, key, name) {
        if (!this.categories[categoryKey]) {
            return false
        } else if (Object.keys(this.categories[categoryKey].subCategories).includes(key)) {
            return false
        } else {
            this.categories[categoryKey].subCategories[key] = {
                name: name,
                tests: []
            };
        }
    }

    // add default name based on the category keys
    // private method
    addTest(newTest, categoryKey, subCategoryKey) {
        if (categoryKey && this.categories[categoryKey]) {
            if (subCategoryKey && this.categories[categoryKey].subCategories[subCategoryKey]) {
                this.categories[categoryKey].subCategories[subCategoryKey].tests.push(newTest);
            } else {
                this.categories[categoryKey].unattachedTests.push(newTest);
            }
        } else {
            this.unattachedTests.push(newTest);
        }
        this.totalTests++;
        if (this.totalTests % 10 === 0) { // every ten tests, automatically count all??? useful???
            this.countAllTests();
        }
    }

    testDefaultName(categoryKey, subCategoryKey) {
        let name;
        if (categoryKey && this.categories[categoryKey]) {
            let categoryName = this.categories[categoryKey].name;
            if (subCategoryKey && this.categories[categoryKey].subCategories[subCategoryKey]) {
                let subCategoryName = this.categories[categoryKey].subCategories[subCategoryKey].name;
                name = `${categoryName}: ${subCategoryName} Test ${this.categories[categoryKey].subCategories[subCategoryKey].tests.length + 1}`;
            } else {
                name = `${categoryName} Unattached Test ${this.categories[categoryKey].unattachedTests.length + 1}`;
            }
        } else {
            name = `Unattached Test ${this.unattachedTests.length + 1}`;
        }
        return name;
    }

    // add failure message
    assertEqualStrict(entered, expected, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
        const pass = entered === expected;
        let failMessage;
        if (!pass) {
            failMessage = `value ${entered} entered; expected ${expected}`;
        }
        this.addTest(new Test(name, pass, failMessage), categoryKey, subCategoryKey);
    }

    assertNotEqualStrict(entered, notExpected, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
        const pass = entered !== expected;
        let failMessage;
        if (!pass) {
            failMessage = `Not Equal Strict Fail: value ${entered} entered; did not expect ${expected}`;
        }
        this.addTest(new Test(name, pass, failMessage), categoryKey, subCategoryKey);
    }

    // add failure message
    assertEqualFloat(entered,expected, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey), limit = 1e-15) {
        const pass = Math.abs(entered - expected) < limit;
        let failMessage;
        if (!pass) {
            failMessage = `value ${entered} entered; expected ${expected}`;
        }
        this.addTest(new Test(name, pass, failMessage), categoryKey, subCategoryKey);
    }

    assertEqualArraysStrict(entered, expected, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
      let pass, failMessage;
      if (typeof(entered) !== 'object') {
        failMessage = 'Entered variable not of type object';
        pass = false;
      } else if (typeof(expected) !== 'object') {
        failMessage = 'Expected variable not of type object';
        pass = false;
      } else if (entered.length === undefined) {
        failMessage = 'Entered object not an array';
        pass = false;
      } else if (expected.length === undefined) {
        failMessage = 'Entered object not an array';
        pass = false;
      } else if (entered.length !== expected.length) {
        failMessage = `Entered array of length ${entered.length}; expected array of length ${expected.length}`;
        pass = false;
      } else {
        let j;
        failMessage = '';
        pass = true;
        for (j = 0; j < entered.length; j++) {
          if (entered[j] !== expected[j]) {
            failMessage = failMessage + 'Entered array element ${j} = ${entered[j]}; expected array element ${j} = ${expected[j]}';
            if (failMessage.length > 100) { // 100 characters total
              break;
            }
            pass = false;
          }
        }
      }
      this.addTest(new Test(name, pass, failMessage), categoryKey, subCategoryKey);
    }

    addFailedTest(categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey), message) {
      let newTest = new Test(name, false, message);
      this.addTest(newTest, categoryKey, subCategoryKey);
    }

    assertMagnitude(magnitude, equalObject, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
      // add check that it is an object
      if (typeof(magnitude) !== 'object') {
        this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object Entered For Magnitude");
        return false
      }
      if (typeof(equalObject) !== 'object') {
        this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object Entered For Equal Object");
        return false
      }
      this.assertEqualStrict(magnitude.isAmagnitude, true, categoryKey, subCategoryKey, `${name}: isAmagnitude`);
      if (equalObject.firstSigFig) {
        this.assertEqualStrict(magnitude.firstSigFig, equalObject["firstSigFig"], categoryKey, subCategoryKey, `${name}: first sig fig:`);
      }
      if (equalObject.otherSigFigs) {
        this.assertEqualStrict(magnitude.otherSigFigs, equalObject["otherSigFigs"], categoryKey, subCategoryKey, `${name}: other sig figs:`);
      }
      if (equalObject.orderOfMagnitude) {
        this.assertEqualStrict(magnitude.orderOfMagnitude, equalObject["orderOfMagnitude"], categoryKey, subCategoryKey, `${name}: order of magnitude: `);
      }
      if (equalObject.numSigFigs) {
        this.assertEqualStrict(magnitude.numSigFigs, equalObject["numSigFigs"], categoryKey, subCategoryKey, `${name}: Number of Sig Figs: `);
      }
      if (equalObject.positive) {
        this.assertEqualStrict(magnitude.positive, equalObject["positive"], categoryKey, subCategoryKey, `${name}: Positive `);
      }
      if (equalObject.float) {
        this.assertEqualFloat(magnitude.getFloat(), equalObject["float"], categoryKey, subCategoryKey, `${name}: Float`, 10**(magnitude.orderOfMagnitude - 15));
      }
      // add printing 
      // add unit
    }


    // privateMethod!
    countAllTests() {
        let totalFails = 0;
        let totalPasses = 0;
        this.unattachedTests.forEach((test) => {
            if (test.pass) {
                totalPasses++;
            } else {
                totalFails++;
            }
        });
        Object.keys(this.categories).forEach((categoryKey) => {
            let thisCategory = this.categories[categoryKey];
            let categoryTotalPasses = 0;
            let categoryTotalFails = 0;
            thisCategory.unattachedTests.forEach((test) => {
                if (test.pass) {
                    totalPasses++;
                    categoryTotalPasses++;
                } else {
                    totalFails++;
                    categoryTotalFails++
                }
            });
            Object.keys(thisCategory.subCategories).forEach((subCategoryKey) => {
                let thisSubCategory = thisCategory.subCategories[subCategoryKey];
                let subCategoryTotalPasses = 0;
                let subCategoryTotalFails = 0;
                thisSubCategory.tests.forEach((test) => {
                    if (test.pass) {
                        totalPasses++;
                        categoryTotalPasses++;
                        subCategoryTotalPasses++;
                    } else {
                        totalFails++;
                        categoryTotalFails++;
                        subCategoryTotalFails++;
                    }
                });
                thisSubCategory.subCategoryPasses = subCategoryTotalPasses;
                thisSubCategory.subCategoryFails = subCategoryTotalFails;
            });
            thisCategory.categoryPasses = categoryTotalPasses;
            thisCategory.categoryFails = categoryTotalFails;
        });
        this.totalPasses = totalPasses;
        this.totalFails = totalFails;
    }

    /// PRIVATE METHOD
    getColorClass(numPasses, numFails) {
        let colorClass;
        if (numFails > 0) {
            colorClass = 'text-danger';
        } else if (numPasses > 0) {
            colorClass = 'text-success';
        } else {
            colorClass = 'text-dark';
        }
        return colorClass
    }

    /// PRIVATE METHOD
    printSingleTest(testObject) {
        let colorClass;
        let message = `${testObject.name}: `;
        if (testObject.pass) {
            colorClass = 'text-success';
            message = message + 'PASS ';
        } else {
            colorClass = 'text-danger';
            message = message + `FAIL: ${testObject.failMessage}`;
        }
        return $(`<li class = '${colorClass}'>${message}</li>`);
    }


    // start with just a list,
    // then move to something more advanced, like a card?
    printAllTests() {
        this.countAllTests();
        let newDiv = $("<div></div>");
        let overallColorClass = this.getColorClass(this.totalPasses, this.totalFails);
        $(newDiv).append($(`<h1 class = '${overallColorClass}'>${this.name}</h1>`));
        $(newDiv).append($(`<h3 class = '${overallColorClass}'>Total Pass: ${this.totalPasses}</h3>`));
        $(newDiv).append($(`<h3 class = '${overallColorClass}'>Total Fail: ${this.totalFails}</h3>`));
        let overallUL = $("<ul></ul>");
        Object.keys(this.categories).forEach((categoryKey) => {
            let thisCategory = this.categories[categoryKey];
            let categoryColorClass = this.getColorClass(thisCategory.categoryPasses, thisCategory.categoryFails);
            let categoryLI = $("<li></li>");
            $(categoryLI).append($(`<h2 class = ${categoryColorClass}>Category: ${thisCategory.name}</h2>`));
            $(categoryLI).append($(`<h4 class = '${categoryColorClass}'>Category Pass: ${thisCategory.categoryPasses}</h4>`));
            $(categoryLI).append($(`<h4 class = '${categoryColorClass}'>Category Fail: ${thisCategory.categoryFails}</h4>`));
            let categoryUL = $('<ul></ul>');
            Object.keys(thisCategory.subCategories).forEach((subCategoryKey) => {
                let thisSubCategory = thisCategory.subCategories[subCategoryKey];
                let subCategoryColorClass = this.getColorClass(thisSubCategory.subCategoryPasses, thisSubCategory.subCategoryFails);
                let subCategoryLI = $("<li></li>");
                $(subCategoryLI).append($(`<h2 class = ${subCategoryColorClass}>Subcategory: ${thisSubCategory.name}</h2>`));
                $(subCategoryLI).append($(`<h4 class = '${subCategoryColorClass}'>Subcategory Pass: ${thisSubCategory.subCategoryPasses}</h4>`));
                $(subCategoryLI).append($(`<h4 class = '${subCategoryColorClass}'>Subcategory Fail: ${thisSubCategory.subCategoryFails}</h4>`));
                let subCategoryUL = $("<ul></ul>");
                thisSubCategory.tests.forEach((test) => {
                    $(subCategoryUL).append(this.printSingleTest(test));
                });
                $(subCategoryLI).append(subCategoryUL);
                $(categoryUL).append(subCategoryLI);
            });
            thisCategory.unattachedTests.forEach((test) => {
                $(categoryUL).append(this.printSingleTest(test));
            });
            $(categoryLI).append(categoryUL);
            $(overallUL).append(categoryLI);
        });
        this.unattachedTests.forEach((test) => {
            $(overallUL).append(this.printSingleTest(test));
        });
        $(newDiv).append(overallUL);
        return newDiv
    }
}
