export const schema = `#graphql
type Vehicle {
  id: ID!
  name: String!
  manufacturer: String!
  year: Int!
  joke: String! # Nuevo campo para el chiste
  parts: [Part!]!
}

type Part {
  id: ID!
  name: String!
  price: Float!
  vehicleId: ID!
}

type Query {
  vehicles: [Vehicle!]!
  vehicle(id: ID!): Vehicle
  parts: [Part!]!
  vehiclesByManufacturer(manufacturer: String!): [Vehicle!]!
  partsByVehicle(vehicleId: ID!): [Part!]!
  vehiclesByYearRange(startYear: Int!, endYear: Int!): [Vehicle!]!
}

type Mutation {
  addVehicle(name: String!, manufacturer: String!, year: Int!): Vehicle!
  addPart(name: String!, price: Float!, vehicleId: ID!): Part!
  updateVehicle(id: ID!, name: String!, manufacturer: String!, year: Int!): Vehicle!
  deletePart(id: ID!): Part
}
`;