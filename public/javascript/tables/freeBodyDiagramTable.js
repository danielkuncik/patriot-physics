function freeBodyDiagramTable(name, numForces, extraQuestion) {
  let container = $("<div class = 'container'></div>");
  let titleRow = $(`<div class = 'row'><div class = 'col-12'><strong>Free-Body Diagram of ${name}</strong></div></div>`);
  $(container).append(titleRow);
  let theBigRow = $("<div class = 'row'></div>");
  let firstColumn = $("<div class = 'col-md-8'></div>");

  let row1 = $("<div class = 'row'></div>");
  $(row1).append($("<div class = 'col-3 border border-dark'>Type of Force</div>"));
  $(row1).append($("<div class = 'col-3 border border-dark'>Direction</div>"));
  $(row1).append($("<div class = 'col-3 border border-dark'>Agent</div>"));
  $(row1).append($("<div class = 'col-3 border border-dark'>Object</div>"));
  $(firstColumn).append(row1);

  let nextRow, i;
  for (i = 0; i < numForces; i++) {
    nextRow = $("<div class = 'row'></div>");

    $(nextRow).append($("<div class = 'col-3 border border-dark pb-5'></div>"));
    $(nextRow).append($("<div class = 'col-3 border border-dark pb-5'></div>"));
    $(nextRow).append($("<div class = 'col-3 border border-dark pb-5'></div>"));
    $(nextRow).append($("<div class = 'col-3 border border-dark pb-5'></div>"));

    $(firstColumn).append(nextRow);
  }

  $(theBigRow).append(firstColumn);
  if (extraQuestion) {
    let secondColumn = $(`<div class = 'col-md-4 border border-dark pb-5'>${extraQuestion}</div>`);
    $(theBigRow).append(secondColumn);
  }
  $(container).append(theBigRow);
  return container
}

/*
Model for the above function
<div class = 'container'>
  <div class = 'row'>
    <div class = 'col-12'>
      <strong>Free-Body Diagram of the Man</strong>
    </div>
  </div>
  <div class = 'row'>
    <div class = 'col-md-8'>
      <div class = 'row'>
        <div class = 'col-12 border border-dark pb-5'><br><br><br></div>
      </div>
      <div class = 'row'>
        <div class = 'col-3 border border-dark'>Type of Force</div>
        <div class = 'col-3 border border-dark'>Direction</div>
        <div class = 'col-3 border border-dark'>Agent</div>
        <div class = 'col-3 border border-dark'>Object</div>
      </div>
      <div class = 'row'>
        <div class = 'col-3 border border-dark pt-5'></div>
        <div class = 'col-3 border border-dark pt-5'></div>
        <div class = 'col-3 border border-dark pt-5'></div>
        <div class = 'col-3 border border-dark pt-5'></div>
      </div>
      <div class = 'row'>
        <div class = 'col-3 border border-dark pt-5'></div>
        <div class = 'col-3 border border-dark pt-5'></div>
        <div class = 'col-3 border border-dark pt-5'></div>
        <div class = 'col-3 border border-dark pt-5'></div>
      </div>
    </div>
    <div class = 'col-md-4 border border-dark pb-5'>
      What is the net force acting on the man?<br><br>
    </div>
  </div>
</div>


*/
