/*
This javascript file contains method that are run as a part of every page
 */



createQuestionAndAnswerList();



// append all items in the answerID object into the lesson
$("ol.answerList").prepend($("<h4 class = 'answerHeader'>Answers:</h4>"))

/// for any <p class = 'directions>
// automatically palces the term "Directons" in bold at the front
$(".directions").prepend($("<strong>Directions: </strong>"));

// automatically places a box to sovle formula problems in any <div class = 'formulaBoxDiv'>
// let myFormulaBox = new formulaBox();
// myFormulaBox.insertTableByClass('formulaBoxDiv');
let formulaSolvingTable2 = new FormulaSolvingTable();
$(".formulaSolvingTable").append(formulaSolvingTable2.draw(600,300));
