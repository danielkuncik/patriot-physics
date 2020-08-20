const variables = {
  "position":
  {
    "vector": true,
    "dimension": "length"
  },
  "distance":
  {
    "vector": false,
    "dimension": "length"
  },
  "displacement":
  {
    "vector": true,
    "dimension": "length"
  },
  "force":
  {
    "vector": true,
    "dimension": "force"
  },
  "net_force":
  {
    "vector": true,
    "name": "Net Force",
    "dimension": "force"
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
  }
}

const selectVariable(name) {
  if (variables[name]) {
    return variables[name]
  } else {
    return false
  }
}
