const variables = {
  "position":
  {
    "vector": true,
    "dimension": "length",
    "symbol": "x"
  },
  "distance":
  {
    "vector": false,
    "dimension": "length",
    "symbol": "d"
  },
  "displacement":
  {
    "vector": true,
    "dimension": "length",
    "symbol": "delta_x"
  },
  "force":
  {
    "vector": true,
    "dimension": "force",
    "symbol": "F"
  },
  "net_force":
  {
    "vector": true,
    "name": "Net Force",
    "dimension": "force",
    "symbol": "Sigma_F"
  },
  "coefficient_of_kinetic_friction":
  {
    "vector": false,
    "dimension": null,
    "symbol": "mu_k"
  },
  "coefficient_of_static_friction":
  {
    "vector": false,
    "dimension": null,
    "symbol": "mu_s"
  },
  "time":
  {
    "vector": false,
    "dimension": "time",
    "symbol": "t"
  },
  "time_interval":
  {
    "vector": false,
    "name": "time interval"
    "dimension": "time",
    "symbol": "Delta_t"
  },
  "intermediate": {
    "name": undefined
  }
}

const selectVariable(key) {
  if (variables[key]) {
    let variable = variables[key]
    if (!variable[name]) {
      variable[name] = key;
    }
    return variable
  } else {
    return false
  }
}

const intermediateVariableObject = {
  "name": "intermediate"
}
